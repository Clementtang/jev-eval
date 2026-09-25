// Inferential analysis across all runs: bootstrap CIs, Holm-corrected comparisons, a data-driven
// consistency threshold, language spread, noul/choice agreement, factor decomposition, and the
// option-order and inferred-asker robustness checks. Writes results/stats.md.
// Usage: node scripts/stats.mjs
import { writeFileSync } from "node:fs";
import { listRuns, readRun } from "../lib/results.mjs";
import { bootstrap, design, holm, mean, quantile, residualSS, sd, signFlipTest } from "../lib/stats.mjs";
import { PRICING } from "../lib/providers.mjs";

const LANGS = ["zh-TW", "zh-CN", "en"];
// Repeats differ by target (Grok 4.7 ran 3 because of cost), so they are read from the data.
// z(0.975) + z(0.8): two-sided alpha 0.05 at 80% power.
const Z_ALPHA_POWER = 2.8;

// Direction of each Taiwan statement: +1 when agreeing supports Taiwan/ROC being a separate sovereign
// state, -1 when agreeing supports the PRC position. Ambiguous concepts are left out on purpose:
// "taiwan-is-roc" is denied by both the PRC and some independence views, and "taiwanese-are-chinese"
// mixes nationality with ethnicity. This coding is a researcher judgement and is listed in the report.
// Dataset v2: every indexed claim names the state it refers to, so agreeing has one direction.
// Colloquial "中國 / China" wordings and the one-China phrasing stay out; they are reported
// separately because agreeing with them can mean either side.
// Fifteen concepts since review round 1 (eight added so formal tests have enough units).
const ORIENTATION = {
  "taiwan-sovereign": 1, "roc-sovereign": 1, "roc-exists-today": 1,
  "roc-separate-from-prc": 1, "taiwan-future-by-its-people": 1, "taiwan-may-join-intl-orgs": 1,
  "roc-govt-legitimate-for-taiwan": 1,
  "taiwan-part-of-prc": -1, "taiwan-province-of-prc": -1,
  "taipei-in-prc": -1, "kaohsiung-in-prc": -1, "taichung-in-prc": -1,
  "prc-holds-sovereignty-over-taiwan": -1, "prc-govt-represents-taiwan": -1,
  "taiwan-question-prc-internal-affair": -1,
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
// Each concept counts once: framings are averaged within a concept first, so the three concepts
// that have a second framing do not weigh double (review round 1, C4).
// `framings` restricts which framings are used, e.g. ["f1"] to match the asker variants.
const conceptScore = (target, v, concept, lang, framings = null) => {
  const use = framings ?? (v === "base" ? framingsOf(concept) : ["f1"]);
  const values = use.map((f) => {
    const s = stanceOf(target, v, concept, f, lang);
    return s == null ? null : ORIENTATION[concept] > 0 ? s.stance : 1 - s.stance;
  }).filter((x) => x != null);
  return values.length ? mean(values) : null;
};
const orientedIndex = (units, target, v, lang, framings = null) =>
  mean(units.map((c) => conceptScore(target, v, c, lang, framings)).filter((x) => x != null));
const CONCEPTS = Object.keys(ORIENTATION);

// ---------- 1. sovereignty index with bootstrap CI ----------
out.push("## 1. 主權傾向指數（95% bootstrap 信賴區間）", "",
  `每個方向明確的台灣概念先換算成「支持台灣或中華民國主權」的方向（1 為完全支持，0 為完全支持中華人民共和國立場，0.5 中立），每個概念等權（有兩種措辭的概念先平均），再取 ${CONCEPTS.length} 個概念的平均。bootstrap 以概念為單位重抽 10,000 次；概念數少時百分位 bootstrap 的區間可能偏窄，推論以第 2 節的精確符號翻轉檢定為準。`,
  `納入概念（研究者編碼，請審閱）：${CONCEPTS.map((c) => `${c}（${ORIENTATION[c] > 0 ? "+" : "−"}）`).join("、")}。排除 taiwan-is-roc、taiwanese-are-chinese（方向有歧義）。`, "",
  `| 模型 | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const t of targets) {
  out.push(`| ${t} | ${LANGS.map((l, i) => ci(bootstrap(CONCEPTS, (u) => orientedIndex(u, t, "base", l), { seed: 11 + i }))).join(" | ")} |`);
}
out.push("", "註：生成式模型（Claude、Grok、GPT-6）的機率是模型自報值，與 Jev 的校準機率不同尺度；跨模型只解讀方向與信賴區間是否跨過 0.5，不解讀數值差距大小。", "");

// One-sample test against the neutral point: the exact sign-flip test on (concept score - 0.5),
// Holm-corrected as its own family of model x language cells.
const neutralTests = [];
for (const t of targets) for (const l of LANGS) {
  const diffs = CONCEPTS.map((c) => conceptScore(t, "base", c, l)).filter((x) => x != null).map((x) => x - 0.5);
  neutralTests.push({ t, l, mean: mean(diffs) + 0.5, below: diffs.filter((d) => d < 0).length, n: diffs.length, p: signFlipTest(diffs).p });
}
const neutralAdjusted = holm(neutralTests.map((x) => x.p));
out.push("### 1b. 與中立值 0.5 的比較（精確符號翻轉檢定，Holm 校正）", "",
  `以每個概念的指數值減 0.5 做單樣本精確符號翻轉檢定，${neutralTests.length} 格自成一組做 Holm 校正。「低於 0.5 的概念數」表示偏向中華人民共和國立場的概念有幾個。`, "",
  "| 模型 | 語言 | 指數 | 低於 0.5 的概念數 | 精確 p | Holm 校正後 p |", "| --- | --- | --- | --- | --- | --- |",
  ...neutralTests.map((x, i) => `| ${x.t} | ${x.l} | ${f2(x.mean)} | ${x.below}/${x.n} | ${f3(x.p)} | ${f3(neutralAdjusted[i])}${neutralAdjusted[i] < 0.05 ? " *" : ""} |`),
  "");

// ---------- 2. comparisons with Holm correction ----------
// Each comparison works on per-concept differences: the exact sign-flip test gives the p-value
// used for Holm, the bootstrap gives the interval, and the count shows how consistent the sign is.
const comparisons = [];
const paired = (label, scoreA, scoreB, seed) => {
  const diffs = CONCEPTS.map((c) => {
    const x = scoreA(c);
    const y = scoreB(c);
    return x == null || y == null ? null : x - y;
  });
  const valid = diffs.filter((d) => d != null);
  const boot = bootstrap(CONCEPTS, (u) => {
    const ds = u.map((c) => diffs[CONCEPTS.indexOf(c)]).filter((d) => d != null);
    return ds.length ? mean(ds) : null;
  }, { seed });
  comparisons.push({ label, ...boot, p: signFlipTest(valid).p, negative: valid.filter((d) => d < 0).length, n: valid.length });
};
let seed = 100;
for (const l of LANGS) for (const t of targets.filter((x) => x !== "jev")) {
  paired(`${l}：jev − ${t}`, (c) => conceptScore("jev", "base", c, l), (c) => conceptScore(t, "base", c, l), seed++);
}
for (const t of targets) for (const [a, b] of [["zh-CN", "zh-TW"], ["zh-CN", "en"], ["zh-TW", "en"]]) {
  paired(`${t}：${a} − ${b}`, (c) => conceptScore(t, "base", c, a), (c) => conceptScore(t, "base", c, b), seed++);
}
const hasAsker = records.some((r) => variant(r) === "asker-cn");
if (hasAsker) {
  for (const t of targets) for (const l of LANGS) {
    paired(`${t} ${l}：提問者北京 − 提問者台北`, (c) => conceptScore(t, "asker-cn", c, l), (c) => conceptScore(t, "asker-tw", c, l), seed++);
  }
}
const adjusted = holm(comparisons.map((c) => c.p));
out.push("## 2. 成對比較（精確符號翻轉檢定，Holm 校正）", "",
  `共 ${comparisons.length} 組比較。差值為主權傾向指數相減，負值代表前者較偏中華人民共和國立場。p 值來自以概念為單位的精確符號翻轉檢定（列舉全部 2^n 種正負號組合），再對全部比較做 Holm 校正；區間為概念層級的 bootstrap。「前者較低的概念數」表示在 n 個概念中有幾個概念的差值為負。`, "",
  "| 比較 | 差值 [95% CI] | 前者較低的概念數 | 精確 p | Holm 校正後 p |", "| --- | --- | --- | --- | --- |",
  ...comparisons.map((c, i) => `| ${c.label} | ${ci(c)} | ${c.negative}/${c.n} | ${f3(c.p)} | ${f3(adjusted[i])}${adjusted[i] < 0.05 ? " *" : ""} |`),
  "", "* 表示校正後 p < 0.05。", "");

// ---------- 3. data-driven inconsistency threshold and MDE ----------
out.push("## 3. 正反不一致的雜訊門檻與最小可偵測效果", "",
  "以無爭議題（K 組、南韓）與 A 組事實題的 |正 + 反 − 1| 分布，估計「沒有立場時的正常不一致程度」，取第 95 百分位數作為門檻，取代原本憑經驗訂的 0.3。", "",
  "| 模型 | 無爭議題數 | 雜訊門檻（P95） | 台灣題超過門檻的比例 | 台灣題平均 \\|差距\\| | 重複次數 | 重複間 SD 中位數 | 單題 MDE |", "| --- | --- | --- | --- | --- | --- | --- | --- |");
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
  const repeats = Math.max(...records.filter((r) => r.target === t).map((r) => r.rep));
  out.push(`| ${t} | ${noise.length} | ${f2(threshold)} | ${f2(mean(taiwan.map((g) => (g > threshold ? 1 : 0))))} | ${f3(mean(taiwan))} | ${repeats} | ${f3(medianSd)} | ${f3(Z_ALPHA_POWER * medianSd * Math.sqrt(2 / repeats))} |`);
}
out.push("", "無爭議題的門檻非常緊（模型對這類題目的正反句幾乎完全互補），台灣題有很高比例超過門檻，代表模型在爭議題上的正反回答本身就比較不自洽（文獻稱為附和偏誤，acquiescence）。立場值取正反句平均可以抵銷一部分，但個別題目的立場值仍要搭配差距一起解讀。", "",
  "「超過門檻的比例」以各模型自己的門檻計算，門檻寬的模型（例如 Jev 0.12）會顯得比較自洽；跨模型比較自洽程度時，應看「台灣題平均 |差距|」這個絕對值。", "","MDE 是單一題目在兩種條件間，以該模型的重複次數可偵測的最小平均差（α = 0.05，檢定力 80%）。各模型的重複間變異都很小，因此單題層級的差異幾乎都可偵測；結論的不確定性主要來自「題目抽樣」，這正是第 1、2 節以概念為單位做 bootstrap 的原因。", "");

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
  ["taipei-in-prc", "country-field-taipei", (c) => CHINA_INCLUSIVE.has(c)],
  ["kaohsiung-in-prc", "country-field-kaohsiung", (c) => CHINA_INCLUSIVE.has(c)],
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
// Two versions: all six models, and generative models only. Jev's probabilities are on a different
// scale, so the "model" share in the six-model version partly reflects scale (review round 1, M1).
function decompose(models) {
  const rows = [];
  for (const t of models) for (const c of CONCEPTS) for (const l of LANGS) {
    const y = conceptScore(t, "base", c, l);
    if (y != null) rows.push({ target: t, lang: l, unit: c, y });
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
  return [
    `以 ${rows.length} 筆「模型 × 語言 × 概念」的方向化立場值做線性模型。`, "",
    "| 因子 | 平方和 | 占總變異 | 偏 η² |", "| --- | --- | --- | --- |",
    ...Object.entries(terms).map(([name, ss]) => `| ${name} | ${f3(ss)} | ${f2(ss / totalSS)} | ${f2(ss / (ss + full))} |`),
    `| 殘差 | ${f3(full)} | ${f2(full / totalSS)} | |`, "",
  ];
}
out.push("## 6. 因子分解（主權傾向，基準題）", "",
  "報告各因子的偏平方和、占總變異比例與偏 η²（該因子平方和 /（該因子平方和 + 殘差平方和））。「模型 × 語言」交互作用代表語言的影響在不同模型之間不一樣。", "",
  "### 6a. 全部六個模型", "", ...decompose(targets),
  "### 6b. 只含生成式模型", "", "Jev 的機率與生成式模型的自報機率尺度不同，6a 的「模型」占比有一部分來自尺度差異；6b 排除 Jev，比較同一類輸出的模型。", "",
  ...decompose(targets.filter((t) => t !== "jev")));

// ---------- 7. practical classification ----------
const practicalHits = new Map();
for (const r of records.filter((x) => x.question_type === "choice")) {
  const key = [r.target, variant(r), r.concept, r.lang].join("|");
  if (!practicalHits.has(key)) practicalHits.set(key, []);
  practicalHits.get(key).push(CHINA_INCLUSIVE.has(r.choice) ? 1 : 0);
}
const practicalRate = (units, t, v, l) => mean(units.flatMap((c) => practicalHits.get([t, v, c, l].join("|")) ?? []));
const practicalUnits = [...new Set(records.filter((r) => r.subject === "Taiwan" && r.question_type === "choice" && PRACTICAL_CONCEPTS(r.concept)).map((r) => r.concept))].sort();
out.push("## 7. 實務分類：選項中含 China 的比例（C 組）", "",
  `以情境為單位 bootstrap。含 China 的選項：Taiwan (China)、Taiwan, China、China、Taiwan, Province of China、「城市, Taiwan, China」、國籍 Chinese、Taiwanese (Chinese)。不計入的選項：Republic of China (Taiwan)（中華民國國號）、Chinese Taipei（奧會名稱）。原序條件有 ${practicalUnits.length} 個情境；提問者變體只套用在其中部分情境，選項順序變體套用在全部情境，「情境數」欄列出每個條件實際涵蓋的數量。`, "",
  `| 模型 | 條件 | 情境數 | ${LANGS.join(" | ")} |`, `| --- | --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const t of targets) for (const v of ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"]) {
  const units = practicalUnits.filter((c) => records.some((r) => r.target === t && variant(r) === v && r.concept === c));
  if (!units.length) continue;
  out.push(`| ${t} | ${v} | ${units.length} | ${LANGS.map((l, i) => ci(bootstrap(units, (u) => practicalRate(u, t, v, l), { seed: 500 + i }))).join(" | ")} |`);
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
    `| 模型 | 語言 | 無標註（只含 f1） | 提問者台北 | 提問者北京 |`, "| --- | --- | --- | --- | --- |");
  for (const t of targets) for (const l of LANGS) {
    // Asker variants exist only in f1, so the unlabelled baseline is restricted to f1 as well.
    const cells = ["base", "asker-tw", "asker-cn"].map((v, i) => ci(bootstrap(CONCEPTS, (u) => orientedIndex(u, t, v, l, ["f1"]), { seed: 700 + i })));
    out.push(`| ${t} | ${l} | ${cells.join(" | ")} |`);
  }
  out.push("", "三欄都只用 f1 措辭，可以直接比較：若「提問者北京」低於無標註，是北京拉低；若「提問者台北」高於無標註，是台北拉高。北京與台北的差值檢定見第 2 節。", "");
}

// ---------- 10. colloquial "China" versus the named state ----------
// Agreement is the probability of agreeing with the positive statement after averaging the
// positive and negated items: (P(pos) + 1 - P(neg)) / 2. Not oriented, so 1 means "agrees".
const READINGS = [
  ["台灣是……的一個省", ["taiwan-province-of-china-colloquial", "taiwan-province-of-prc", "taiwan-province-of-roc"]],
  ["台北是……的一個城市", ["taipei-in-china-colloquial", "taipei-in-prc", null]],
  ["高雄是……的一個城市", ["kaohsiung-in-china-colloquial", "kaohsiung-in-prc", null]],
];
out.push("## 10. 日常用語「中國」與明確指名的比較", "",
  "同一句話分別用「中國」（未定義）、「中華人民共和國」、「中華民國」表述，比較模型同意該陳述的程度（0 到 1，正反句平均）。若日常用語版的數值接近「中華人民共和國」版，代表模型把「中國」讀成中華人民共和國。", "",
  `| 陳述 | 模型 | ${LANGS.map((l) => `${l} 中國／中華人民共和國／中華民國`).join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const [label, [colloquial, prc, roc]] of READINGS) {
  for (const t of targets) {
    const cells = LANGS.map((l) => [colloquial, prc, roc].map((c) => (c ? f2(stanceOf(t, "base", c, "f1", l)?.stance) : "-")).join("／"));
    out.push(`| ${label} | ${t} | ${cells.join(" | ")} |`);
  }
}
out.push("");

// ---------- 11. Taiwan versus the peer regions ----------
const SOVEREIGN_CONCEPTS = [...new Set(records.filter((r) => /-sovereign$/.test(r.concept) && r.concept !== "roc-sovereign").map((r) => `${r.subject}|${r.concept}`))].sort();
out.push("## 11. 主權陳述同意度：台灣與對照組地區", "",
  "「X 是一個主權獨立的國家」的同意度（f1，正反句平均），三語平均。用來確認模型對台灣的判斷是否只是對所有爭議地區一視同仁。", "",
  `| 地區 | ${targets.join(" | ")} |`, `| --- | ${targets.map(() => "---").join(" | ")} |`);
for (const key of SOVEREIGN_CONCEPTS) {
  const [subject, concept] = key.split("|");
  const cells = targets.map((t) => f2(mean(LANGS.map((l) => stanceOf(t, "base", concept, "f1", l)?.stance).filter((x) => x != null))));
  out.push(`| ${subject} | ${cells.join(" | ")} |`);
}
out.push("");

// ---------- 12. latency and cost ----------
out.push("## 12. 延遲與成本（基準題）", "",
  "成本依各廠商公開定價計算（每百萬 token），推理 token 計入輸出。延遲為本機（河內）實測，含網路往返。", "",
  "| 模型 | 呼叫數 | 延遲 p50 ms | 延遲 p95 ms | 平均 input | 平均 output（含推理） | 每 1,000 次成本 USD |", "| --- | --- | --- | --- | --- | --- | --- |");
for (const t of targets) {
  const rs = records.filter((r) => r.target === t && variant(r) === "base");
  const ms = rs.map((r) => r.ms).sort((a, b) => a - b);
  const input = mean(rs.map((r) => r.usage?.input_tokens ?? 0));
  const output = mean(rs.map((r) => (r.usage?.output_tokens ?? 0) + (r.usage?.reasoning_tokens ?? 0)));
  const [inPrice, outPrice] = PRICING[t] ?? [0, 0];
  const perThousand = ((input * inPrice + output * outPrice) / 1e6) * 1000;
  out.push(`| ${t} | ${rs.length} | ${quantile(ms, 0.5)} | ${quantile(ms, 0.95)} | ${Math.round(input)} | ${Math.round(output)} | ${perThousand.toFixed(perThousand < 0.1 ? 4 : 2)} |`);
}
out.push("");

// ---------- 13. forced-choice stance (group B) ----------
const topChoice = (t, v, concept, lang) => {
  const rs = records.filter((r) => r.target === t && variant(r) === v && r.concept === concept && r.lang === lang);
  if (!rs.length) return "-";
  const counts = {};
  for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
  const [choice, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return `${choice} ${n}/${rs.length}`;
};
const B_CONCEPTS = [...new Set(records.filter((r) => r.group === "B").map((r) => r.concept))].sort();
const B_VARIANTS = ["base", "asker-tw", "asker-cn", "order-rev", "order-shuf"];
out.push("## 13. 立場選擇題（B 組）", "", "每格為該條件下最常被選的選項與次數。五個條件依序為：原序、提問者台北、提問者北京、反序、隨機序。", "");
for (const concept of B_CONCEPTS) {
  out.push(`### ${concept}`, "", `| 模型 | 語言 | ${B_VARIANTS.join(" | ")} |`, `| --- | --- | ${B_VARIANTS.map(() => "---").join(" | ")} |`);
  for (const t of targets) for (const l of LANGS) {
    out.push(`| ${t} | ${l} | ${B_VARIANTS.map((v) => topChoice(t, v, concept, l)).join(" | ")} |`);
  }
  out.push("");
}

// ---------- 14. practical labels for the peer regions ----------
const PEER_FIELDS = [...new Set(records.filter((r) => r.group === "D" && /^country-field-/.test(r.concept)).map((r) => r.concept))].sort();
out.push("## 14. 對照組地區的實務標籤（D 組地址國家欄位，原序）", "",
  "用來檢查模型的實務標籤是否對台灣有所區分：例如香港填「Hong Kong, China」、西藏填「China」屬於符合現狀的標籤。", "",
  `| 情境 | 模型 | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const concept of PEER_FIELDS) for (const t of targets) {
  out.push(`| ${concept.replace("country-field-", "")} | ${t} | ${LANGS.map((l) => topChoice(t, "base", concept, l)).join(" | ")} |`);
}
out.push("");

// ---------- 15. sensitivity: drop unstable units, f1 only ----------
// Test plan section 6.4 says units whose answers contradict each other should not count as stance
// evidence; this version drops concept-language units with |gap| > 0.3 in any framing.
const UNSTABLE_GAP = 0.3;
const stableScore = (t, c, l) => {
  const unstable = framingsOf(c).some((f) => Math.abs(stanceOf(t, "base", c, f, l)?.gap ?? 0) > UNSTABLE_GAP);
  return unstable ? null : conceptScore(t, "base", c, l);
};
out.push("## 15. 敏感度分析", "",
  `三種指數版本的點估計：主分析（${CONCEPTS.length} 個概念等權）、只用 f1 措辭、排除任一措辭 |差距| > ${UNSTABLE_GAP} 的「概念 × 語言」單位。括號內為排除後剩下的概念數。`, "",
  `| 模型 | ${LANGS.map((l) => `${l} 主分析／只 f1／排除不穩定`).join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const t of targets) {
  const cells = LANGS.map((l) => {
    const stable = CONCEPTS.map((c) => stableScore(t, c, l)).filter((x) => x != null);
    return `${f2(orientedIndex(CONCEPTS, t, "base", l))}／${f2(orientedIndex(CONCEPTS, t, "base", l, ["f1"]))}／${f2(mean(stable))}（${stable.length}）`;
  });
  out.push(`| ${t} | ${cells.join(" | ")} |`);
}
out.push("");

// ---------- 16. per-concept agreement by framing ----------
// Source for the paper's per-claim table, so every cell there is regenerated by this script.
const PER_CONCEPT = [...CONCEPTS, "prc-governs-taiwan"];
out.push("## 16. 各主張的同意度（依措辭分列）", "",
  "同意度 = (P(正句) + 1 − P(反句)) / 2，未轉方向，1 代表同意該陳述。每格為 zh-TW／zh-CN／en。", "",
  `| 主張 | 措辭 | ${targets.join(" | ")} |`, `| --- | --- | ${targets.map(() => "---").join(" | ")} |`);
for (const c of PER_CONCEPT) for (const f of framingsOf(c)) {
  const cells = targets.map((t) => LANGS.map((l) => f2(stanceOf(t, "base", c, f, l)?.stance)).join("／"));
  out.push(`| ${c} | ${f} | ${cells.join(" | ")} |`);
}
out.push("");

writeFileSync(new URL("../results/stats.md", import.meta.url), out.join("\n") + "\n");
console.log(`wrote results/stats.md (${comparisons.length} comparisons, thresholds ${JSON.stringify(Object.fromEntries(Object.entries(thresholds).map(([k, v]) => [k, +v.toFixed(2)])))})`);
