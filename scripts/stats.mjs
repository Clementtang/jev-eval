// Inferential analysis across all runs: bootstrap CIs, Holm-corrected comparisons, a data-driven
// consistency threshold, language spread, noul/choice agreement, factor decomposition, and the
// option-order and inferred-asker robustness checks. Writes results/stats.md.
// Usage: node scripts/stats.mjs
import { writeFileSync } from "node:fs";
import { listRuns, readRun } from "../lib/results.mjs";
import { bootstrap, design, holm, mean, quantile, residualSS, sd } from "../lib/stats.mjs";

const LANGS = ["zh-TW", "zh-CN", "en"];
const REPEATS = 5;
// z(0.975) + z(0.8): two-sided alpha 0.05 at 80% power.
const Z_ALPHA_POWER = 2.8;

// Direction of each Taiwan statement: +1 when agreeing supports Taiwan/ROC being a separate sovereign
// state, -1 when agreeing supports the PRC position. Ambiguous concepts are left out on purpose:
// "taiwan-is-roc" is denied by both the PRC and some independence views, and "taiwanese-are-chinese"
// mixes nationality with ethnicity. This coding is a researcher judgement and is listed in the report.
const ORIENTATION = {
  "taiwan-sovereign": 1, "roc-sovereign": 1, "roc-exists-after-1949": 1,
  "taiwan-part-of-prc": -1, "roc-prc-one-china": -1, "taiwan-province-of-china": -1,
  "taipei-in-china": -1, "kaohsiung-in-china": -1,
};
// Choice keys that place Taiwan (or the item's subject) inside China / the parent state.
const CHINA_INCLUSIVE = new Set(["x_paren_parent", "x_comma_parent", "parent", "taiwan_paren_china", "taiwan_comma_china",
  "taiwan_province_of_china", "china", "city_taiwan_china", "city_china", "chinese", "taiwanese_chinese"]);
const PRACTICAL_CONCEPTS = (c) => /^(country-field|city-format)-/.test(c) || ["dropdown-label", "phone-country", "profile-nationality"].includes(c);
// Uncontested noul items: their positive/negative gap shows what "normal" inconsistency looks like.
const NOISE_SUBJECTS = new Set(["control", "South Korea"]);

const records = listRuns().flatMap((r) => readRun(r.run_id) ?? []).filter((r) => r.ok && !r.refusal);
const variant = (r) => r.variant ?? "base";
const targets = [...new Set(records.map((r) => r.target))].sort((a, b) => (a === "jev" ? -1 : b === "jev" ? 1 : a.localeCompare(b)));
const f2 = (x) => (x == null ? "-" : x.toFixed(2));
const f3 = (x) => (x == null ? "-" : x.toFixed(3));
const ci = (b) => `${f2(b.estimate)} [${f2(b.low)}, ${f2(b.high)}]`;
const out = ["# 統計分析", "", `產出時間：${new Date().toISOString()}；資料：${records.length} 筆成功呼叫，模型 ${targets.join("、")}`, ""];

// ---------- index of records ----------
const index = new Map();
for (const r of records) {
  const key = [r.target, variant(r), r.concept, r.framing, r.lang, r.polarity ?? "-"].join("|");
  if (!index.has(key)) index.set(key, []);
  index.get(key).push(r);
}
const get = (target, v, concept, framing, lang, polarity = "-") => index.get([target, v, concept, framing, lang, polarity].join("|")) ?? [];
const stanceOf = (target, v, concept, framing, lang) => {
  const pos = mean(get(target, v, concept, framing, lang, "pos").map((r) => r.value));
  const neg = mean(get(target, v, concept, framing, lang, "neg").map((r) => r.value));
  return pos == null || neg == null ? null : { stance: (pos + 1 - neg) / 2, gap: pos + neg - 1 };
};
// A unit is one oriented Taiwan concept with every framing that exists for it.
const framingCache = new Map();
const framingsOf = (concept) => {
  if (!framingCache.has(concept)) framingCache.set(concept, [...new Set(records.filter((r) => r.concept === concept && variant(r) === "base").map((r) => r.framing))]);
  return framingCache.get(concept);
};
const orientedIndex = (units, target, v, lang) => {
  const values = units.flatMap((concept) => (v === "base" ? framingsOf(concept) : ["f1"]).map((f) => {
    const s = stanceOf(target, v, concept, f, lang);
    return s == null ? null : ORIENTATION[concept] > 0 ? s.stance : 1 - s.stance;
  })).filter((x) => x != null);
  return mean(values);
};
const CONCEPTS = Object.keys(ORIENTATION);

// ---------- 1. sovereignty index with bootstrap CI ----------
out.push("## 1. 主權傾向指數（95% bootstrap 信賴區間）", "",
  "每個方向明確的台灣概念先換算成「支持台灣或中華民國主權」的方向（1 為完全支持，0 為完全支持中華人民共和國立場，0.5 中立），再取平均。bootstrap 以概念為單位重抽 10,000 次。",
  `納入概念（研究者編碼，請審閱）：${CONCEPTS.map((c) => `${c}（${ORIENTATION[c] > 0 ? "+" : "−"}）`).join("、")}。排除 taiwan-is-roc、taiwanese-are-chinese（方向有歧義）。`, "",
  `| 模型 | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const t of targets) {
  out.push(`| ${t} | ${LANGS.map((l, i) => ci(bootstrap(CONCEPTS, (u) => orientedIndex(u, t, "base", l), { seed: 11 + i }))).join(" | ")} |`);
}
out.push("", "註：Claude 的機率是自報值，與 Jev 的校準機率不同尺度；跨模型只解讀方向與信賴區間是否跨過 0.5，不解讀數值差距大小。", "");

// ---------- 2. comparisons with Holm correction ----------
const comparisons = [];
const paired = (label, a, b, seed) => comparisons.push({ label, ...bootstrap(CONCEPTS, (u) => {
  const x = a(u);
  const y = b(u);
  return x == null || y == null ? null : x - y;
}, { seed }) });
let seed = 100;
for (const l of LANGS) for (const t of targets.filter((x) => x !== "jev")) {
  paired(`${l}：jev − ${t}`, (u) => orientedIndex(u, "jev", "base", l), (u) => orientedIndex(u, t, "base", l), seed++);
}
for (const t of targets) for (const [a, b] of [["zh-CN", "zh-TW"], ["zh-CN", "en"], ["zh-TW", "en"]]) {
  paired(`${t}：${a} − ${b}`, (u) => orientedIndex(u, t, "base", a), (u) => orientedIndex(u, t, "base", b), seed++);
}
const hasAsker = records.some((r) => variant(r) === "asker-cn");
if (hasAsker) {
  for (const t of targets) for (const l of LANGS) {
    paired(`${t} ${l}：提問者北京 − 提問者台北`, (u) => orientedIndex(u, t, "asker-cn", l), (u) => orientedIndex(u, t, "asker-tw", l), seed++);
  }
}
const adjusted = holm(comparisons.map((c) => c.p));
out.push("## 2. 成對比較（Holm 校正）", "", `共 ${comparisons.length} 組比較，差值為主權傾向指數相減，負值代表前者較偏中華人民共和國立場。`, "",
  "| 比較 | 差值 [95% CI] | p | Holm 校正後 p |", "| --- | --- | --- | --- |",
  ...comparisons.map((c, i) => `| ${c.label} | ${ci(c)} | ${f3(c.p)} | ${f3(adjusted[i])}${adjusted[i] < 0.05 ? " *" : ""} |`),
  "", "* 表示校正後 p < 0.05。概念只有 8 個，信賴區間偏寬，屬保守估計。", "");

// ---------- 3. data-driven inconsistency threshold and MDE ----------
out.push("## 3. 正反不一致的雜訊門檻與最小可偵測效果", "",
  "以無爭議題（K 組、南韓）與 A 組事實題的 |正 + 反 − 1| 分布，估計「沒有立場時的正常不一致程度」，取第 95 百分位數作為門檻，取代原本憑經驗訂的 0.3。", "",
  "| 模型 | 無爭議題數 | 雜訊門檻（P95） | 台灣題超過門檻的比例 | 重複間 SD 中位數 | 單題 MDE（n=5） |", "| --- | --- | --- | --- | --- | --- |");
const thresholds = {};
for (const t of targets) {
  const baseNoul = records.filter((r) => r.target === t && variant(r) === "base" && r.question_type === "noul");
  const gaps = (filter) => [...new Set(baseNoul.filter(filter).map((r) => `${r.concept}|${r.framing}|${r.lang}`))]
    .map((k) => { const [c, f, l] = k.split("|"); return stanceOf(t, "base", c, f, l); }).filter(Boolean).map((s) => Math.abs(s.gap));
  const noise = gaps((r) => NOISE_SUBJECTS.has(r.subject) || r.expected != null).sort((a, b) => a - b);
  const threshold = quantile(noise, 0.95);
  thresholds[t] = threshold;
  const taiwan = gaps((r) => r.subject === "Taiwan" && r.expected == null);
  const repSd = [...index.entries()].filter(([k]) => k.startsWith(`${t}|base|`)).map(([, rs]) => rs.filter((r) => r.value != null).map((r) => r.value)).filter((v) => v.length > 1).map(sd).sort((a, b) => a - b);
  const medianSd = quantile(repSd, 0.5);
  out.push(`| ${t} | ${noise.length} | ${f2(threshold)} | ${f2(mean(taiwan.map((g) => (g > threshold ? 1 : 0))))} | ${f3(medianSd)} | ${f3(Z_ALPHA_POWER * medianSd * Math.sqrt(2 / REPEATS))} |`);
}
out.push("", "無爭議題的門檻非常緊（模型對這類題目的正反句幾乎完全互補），台灣題有很高比例超過門檻，代表模型在爭議題上的正反回答本身就比較不自洽（文獻稱為附和偏誤，acquiescence）。立場值取正反句平均可以抵銷一部分，但個別題目的立場值仍要搭配差距一起解讀。", "", "MDE 是單一題目在兩種條件間，以 5 次重複可偵測的最小平均差（α = 0.05，檢定力 80%）。三個模型的重複間變異都很小，因此單題層級的差異幾乎都可偵測；結論的不確定性主要來自「題目抽樣」，這正是第 1、2 節以概念為單位做 bootstrap 的原因。", "");

// ---------- 4. language spread per concept ----------
out.push("## 4. 語言一致性：各概念三語立場值的最大差距", "", "數值越大代表同一個概念換語言後立場變化越大。只列台灣概念（含方向歧義的概念）。", "",
  `| 概念 | 框架 | ${targets.join(" | ")} |`, `| --- | --- | ${targets.map(() => "---").join(" | ")} |`);
const taiwanConcepts = [...new Set(records.filter((r) => r.subject === "Taiwan" && r.question_type === "noul" && r.expected == null && variant(r) === "base").map((r) => `${r.concept}|${r.framing}`))].sort();
const spreadByTarget = Object.fromEntries(targets.map((t) => [t, []]));
for (const key of taiwanConcepts) {
  const [c, f] = key.split("|");
  const cells = targets.map((t) => {
    const vals = LANGS.map((l) => stanceOf(t, "base", c, f, l)?.stance).filter((x) => x != null);
    if (vals.length < LANGS.length) return "-";
    const spread = Math.max(...vals) - Math.min(...vals);
    spreadByTarget[t].push(spread);
    return f2(spread);
  });
  out.push(`| ${c} | ${f} | ${cells.join(" | ")} |`);
}
out.push(`| **平均** | | ${targets.map((t) => `**${f2(mean(spreadByTarget[t]))}**`).join(" | ")} |`, "");

// ---------- 5. noul vs choice agreement ----------
const PAIRS = [
  ["taiwan-part-of-prc", "taiwan-status", (c) => c === "part_of_parent"],
  ["taiwanese-are-chinese", "taiwanese-national-identity", (c) => c === "chinese" || c === "both"],
  ["taiwan-is-roc", "taiwan-roc-relation", (c) => c === "same_state"],
  ["taipei-in-china", "country-field-taipei", (c) => CHINA_INCLUSIVE.has(c)],
  ["kaohsiung-in-china", "country-field-kaohsiung", (c) => CHINA_INCLUSIVE.has(c)],
];
out.push("## 5. 是非題與選擇題的方向一致性", "", "同一個問題分別用是非題（noul）和選擇題（choice）問，看方向是否一致。格式：是非題回答「是」的程度 / 選擇題最常選的選項，✓ 一致、✗ 不一致。", "",
  `| 是非題 | 選擇題 | ${targets.flatMap((t) => LANGS.map((l) => `${t} ${l}`)).join(" | ")} |`, `| --- | --- | ${targets.flatMap(() => LANGS.map(() => "---")).join(" | ")} |`);
const agreement = Object.fromEntries(targets.map((t) => [t, []]));
for (const [noulConcept, choiceConcept, meansYes] of PAIRS) {
  const cells = targets.flatMap((t) => LANGS.map((l) => {
    const s = stanceOf(t, "base", noulConcept, "f1", l);
    const choices = records.filter((r) => r.target === t && variant(r) === "base" && r.concept === choiceConcept && r.lang === l).map((r) => r.choice);
    if (!s || !choices.length) return "-";
    const counts = {};
    for (const c of choices) counts[c] = (counts[c] ?? 0) + 1;
    const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
    const agree = s.stance > 0.5 === meansYes(top);
    agreement[t].push(agree);
    return `${f2(s.stance)} / ${top} ${agree ? "✓" : "✗"}`;
  }));
  out.push(`| ${noulConcept} | ${choiceConcept} | ${cells.join(" | ")} |`);
}
out.push("", `一致率：${targets.map((t) => `${t} ${agreement[t].filter(Boolean).length}/${agreement[t].length}`).join("，")}`, "");

// ---------- 6. factor decomposition ----------
const rows = [];
for (const t of targets) for (const c of CONCEPTS) for (const f of framingsOf(c)) for (const l of LANGS) {
  const s = stanceOf(t, "base", c, f, l);
  if (s) rows.push({ target: t, lang: l, unit: `${c}|${f}`, y: ORIENTATION[c] > 0 ? s.stance : 1 - s.stance });
}
const y = rows.map((r) => r.y);
const totalSS = y.reduce((a, v) => a + (v - mean(y)) ** 2, 0);
const full = residualSS(design(rows, ["unit", "target", "lang", ["target", "lang"]]), y);
const additive = residualSS(design(rows, ["unit", "target", "lang"]), y);
const terms = {
  "概念（題目本身）": residualSS(design(rows, ["target", "lang"]), y) - additive,
  "模型": residualSS(design(rows, ["unit", "lang"]), y) - additive,
  "語言": residualSS(design(rows, ["unit", "target"]), y) - additive,
  "模型 × 語言": additive - full,
};
out.push("## 6. 因子分解（主權傾向，基準題）", "", `以 ${rows.length} 筆「模型 × 語言 × 概念框架」的方向化立場值做線性模型，報告各因子的偏 η²（該因子平方和 /（該因子平方和 + 殘差平方和））與占總變異比例。`, "",
  "| 因子 | 平方和 | 占總變異 | 偏 η² |", "| --- | --- | --- | --- |",
  ...Object.entries(terms).map(([name, ss]) => `| ${name} | ${f3(ss)} | ${f2(ss / totalSS)} | ${f2(ss / (ss + full))} |`),
  `| 殘差 | ${f3(full)} | ${f2(full / totalSS)} | |`, "",
  "「模型 × 語言」交互作用代表「語言的影響在不同模型之間不一樣」。", "");

// ---------- 7. practical classification ----------
const practicalHits = new Map();
for (const r of records.filter((x) => x.question_type === "choice")) {
  const key = [r.target, variant(r), r.concept, r.lang].join("|");
  if (!practicalHits.has(key)) practicalHits.set(key, []);
  practicalHits.get(key).push(CHINA_INCLUSIVE.has(r.choice) ? 1 : 0);
}
const practicalRate = (units, t, v, l) => mean(units.flatMap((c) => practicalHits.get([t, v, c, l].join("|")) ?? []));
const practicalUnits = [...new Set(records.filter((r) => r.subject === "Taiwan" && r.question_type === "choice" && PRACTICAL_CONCEPTS(r.concept)).map((r) => r.concept))].sort();
out.push("## 7. 實務分類：選項中含 China 的比例（C 組）", "", `以 ${practicalUnits.length} 個實務情境為單位 bootstrap。含 China 的選項：Taiwan (China)、Taiwan, China、China、Taiwan, Province of China、「城市, Taiwan, China」、國籍 Chinese 等。`, "",
  `| 模型 | 條件 | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const t of targets) for (const v of ["base", "asker-tw", "asker-cn"]) {
  const units = v === "base" ? practicalUnits : practicalUnits.filter((c) => records.some((r) => variant(r) === v && r.concept === c));
  if (!units.length || !records.some((r) => r.target === t && variant(r) === v)) continue;
  out.push(`| ${t} | ${v} | ${LANGS.map((l, i) => ci(bootstrap(units, (u) => practicalRate(u, t, v, l), { seed: 500 + i }))).join(" | ")} |`);
}
out.push("");

// ---------- 8. option order ----------
if (records.some((r) => variant(r).startsWith("order-"))) {
  out.push("## 8. 選項順序穩健性", "", "同一題選擇題以原順序、反序、隨機序各跑 5 次，比較最常選的選項是否改變。", "",
    "| 模型 | 題數 | 三種順序最常選的選項都相同 | 原序與反序的選擇分布總變異距離（平均） |", "| --- | --- | --- | --- |");
  const flips = [];
  for (const t of targets) {
    const itemIds = [...new Set(records.filter((r) => r.target === t && variant(r) === "order-rev").map((r) => r.item_id.replace(/--order-rev$/, "")))];
    let stable = 0;
    const tvds = [];
    for (const id of itemIds) {
      const dist = (v) => {
        const rs = records.filter((r) => r.target === t && r.item_id === (v === "base" ? id : `${id}--${v}`));
        const counts = {};
        for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1 / rs.length;
        return counts;
      };
      const [base, rev, shuf] = ["base", "order-rev", "order-shuf"].map(dist);
      const top = (d) => Object.entries(d).sort((a, b) => b[1] - a[1])[0]?.[0];
      if (top(base) === top(rev) && top(base) === top(shuf)) stable++;
      else flips.push(`${t} ${id}：原序 ${top(base)}，反序 ${top(rev)}，隨機 ${top(shuf)}`);
      const keys = new Set([...Object.keys(base), ...Object.keys(rev)]);
      tvds.push([...keys].reduce((a, k) => a + Math.abs((base[k] ?? 0) - (rev[k] ?? 0)), 0) / 2);
    }
    out.push(`| ${t} | ${itemIds.length} | ${stable}/${itemIds.length} | ${f2(mean(tvds))} |`);
  }
  out.push("", flips.length ? "受順序影響的題目：" : "沒有題目受順序影響。", ...flips.map((f) => `- ${f}`), "");
}

// ---------- 9. inferred asker ----------
if (hasAsker) {
  out.push("## 9. 提問者身分：語言效應與「推測提問者」效應", "", "同一題加上「提問者住在台北」或「提問者住在北京」，與原題（無標註）比較主權傾向指數。如果簡中的偏移主要來自「模型推測提問者是中國大陸使用者」，那麼明確標註台北提問者應該能拉回簡中的結果。", "",
    `| 模型 | 語言 | 無標註 | 提問者台北 | 提問者北京 |`, "| --- | --- | --- | --- | --- |");
  for (const t of targets) for (const l of LANGS) {
    const cells = ["base", "asker-tw", "asker-cn"].map((v, i) => ci(bootstrap(CONCEPTS, (u) => orientedIndex(u, t, v, l), { seed: 700 + i })));
    out.push(`| ${t} | ${l} | ${cells.join(" | ")} |`);
  }
  out.push("", "註：無標註欄位包含兩種措辭框架，身分欄位只有 f1 框架，兩者的比較僅供參考；主要看台北與北京兩欄的差值（第 2 節有校正後的檢定）。", "");
}

writeFileSync(new URL("../results/stats.md", import.meta.url), out.join("\n") + "\n");
console.log(`wrote results/stats.md (${comparisons.length} comparisons, thresholds ${JSON.stringify(Object.fromEntries(Object.entries(thresholds).map(([k, v]) => [k, +v.toFixed(2)])))})`);
