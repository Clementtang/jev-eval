// Checks results/appendix-f.json and results/appendix-f.md against the raw records in
// results/runs-appendixf/ (and results/runs/ for the two bridges), recomputing every figure without
// scripts/appendix-f.mjs or lib/arm-analysis.mjs; indices go through lib/lab.mjs as the site does.
// The last section checks the site's copy of the appendix (lab merge, items.json, replay.json).
// Usage: node scripts/export-site-data.mjs && node scripts/verify-appendix-f.mjs
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const { buildUnits, indexTable } = await import(join(root, "lib/lab.mjs"));
const { quantile, signFlipTest } = await import(join(root, "lib/stats.mjs"));
const { PRICING } = await import(join(root, "lib/targets.mjs"));
const summary = JSON.parse(readFileSync(join(root, "results/summary.json"), "utf8"));
const appendix = JSON.parse(readFileSync(join(root, "results/appendix-f.json"), "utf8"));
const markdown = readFileSync(join(root, "results/appendix-f.md"), "utf8").split("\n");
const readJsonl = (path) => readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const readDir = (dir) => readdirSync(join(root, dir)).filter((f) => f.endsWith(".jsonl")).flatMap((f) => readJsonl(join(root, dir, f)));
const raw = readDir("results/runs-appendixf");
const records = raw.filter((r) => r.ok && !r.refusal);
const NEW = "luna-6-decisions";
const RERUNS = ["luna-6", "jev"];
const mainRecords = readDir("results/runs").filter((r) => r.ok && !r.refusal && RERUNS.includes(r.target));
const LANGS = summary.langs;
const TARGETS = ["luna-6", NEW, "jev"];
const REFUSED_ITEM = "A-taiwan-part-of-prc-zh-CN-pos-f2";
const CONDITIONS = ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"];
const LABEL = {
  "luna-6": "GPT-6 Luna, chat completions (same-day rerun)",
  [NEW]: "GPT-6 Luna, Decisions API",
  jev: "Jev (same-day rerun)",
  "luna-6@main": "GPT-6 Luna, chat completions (main runs, 25 September)",
  "jev@main": "Jev (main runs, 25 September)",
};
const v = (r) => r.variant ?? "base";
const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
const f2 = (x) => x.toFixed(2);
// lab cells carry units (0 when a model lacks the claims); results/summary.json cells do not.
const ci = (c) => (c && c.units !== 0 ? `${f2(c.estimate)} [${f2(c.low)}, ${f2(c.high)}]` : "-");
let failures = 0;
let passes = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (ok) passes++; else failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : `  (expected ${expected})`}`);
};
const hasRow = (label, row) => check(`appendix-f.md row ${label}`, markdown.includes(row), true);

// Figures quoted in the report, typed here so a silent change in the data or the code stops the deploy.
const EXPECTED_STATUS = {
  "luna-6": "0.88 [0.82, 0.93] | 0.83 [0.75, 0.90] | 0.84 [0.72, 0.93]",
  [NEW]: "0.83 [0.73, 0.92] | 0.66 [0.52, 0.79] | 0.80 [0.69, 0.91]",
  jev: "0.40 [0.31, 0.50] | 0.26 [0.17, 0.37] | 0.40 [0.31, 0.50]",
};

// 1. Raw records: counts and dates.
check("raw records all successful (ok true)", raw.every((r) => r.ok), true);
// The Decisions API refused one statement in all five repetitions; refusals are left out as in the
// main analysis, which drops that framing of the claim because its positive statement has no value.
const refused = raw.filter((r) => r.refusal);
check("refusals: one Decisions API item, five repetitions", [...new Set(refused.map((r) => `${r.target} ${r.item_id}`))].join(",") + ` x${refused.length}`,
  `${NEW} ${REFUSED_ITEM} x5`);
check("refusals listed in appendix-f.json", JSON.stringify(appendix.refusals), JSON.stringify([{ target: NEW, item_id: REFUSED_ITEM, repetitions: 5 }]));
check("refused item has no framing in claim_agreement", appendix.claim_agreement[NEW]["zh-CN"]["taiwan-part-of-prc"].f2, undefined);
hasRow("record counts", `Records in results/runs-appendixf/: ${raw.length}; failed (ok false) 0; refusals 5; successful calls without a value or choice 0; duplicate item and repetition pairs 0.`);
check("calls", appendix.calls, records.length);
check("run date matches every record", records.every((r) => r.ts.startsWith(appendix.run_date)), true);
for (const t of TARGETS) {
  const rs = records.filter((r) => r.target === t);
  const ts = rs.map((r) => r.ts).sort();
  const info = appendix.targets[t];
  check(`${t} calls (957 items x 5)`, info.calls, rs.length);
  check(`${t} calls equal 4785 less refusals`, rs.length, 4785 - refused.filter((r) => r.target === t).length);
  check(`${t} unique item and repetition pairs`, new Set(rs.map((r) => `${r.item_id}#${r.rep}`)).size, rs.length);
  check(`${t} first and last call`, `${info.first_call} ${info.last_call}`, `${ts[0]} ${ts.at(-1)}`);
  hasRow(`${t} runs`, `| ${LABEL[t]} | ${rs[0].model} | ${info.interface} | ${rs.length} | 0 | ${ts[0]} | ${ts.at(-1)} |`);
}
check("Decisions API and chat completions call the same model", records.find((r) => r.target === NEW).model, records.find((r) => r.target === "luna-6").model);

// 2. Claim agreement recomputed from the raw records.
const concepts = Object.keys(summary.definitions.orientation);
const agreementOf = (rs, t) => {
  const out = {};
  const groups = new Map();
  for (const r of rs.filter((x) => x.target === t && v(x) === "base" && x.question_type === "noul" && x.concept in summary.definitions.orientation)) {
    const key = `${r.lang}|${r.concept}|${r.framing}`;
    if (!groups.has(key)) groups.set(key, { pos: [], neg: [] });
    groups.get(key)[r.polarity].push(r.value);
  }
  for (const [key, { pos, neg }] of groups) {
    if (!pos.length || !neg.length) continue;
    const [l, c, f] = key.split("|");
    ((out[l] ??= {})[c] ??= {})[f] = (avg(pos) + 1 - avg(neg)) / 2;
  }
  return out;
};
let worst = 0;
let cells = 0;
for (const t of TARGETS) {
  const expected = agreementOf(records, t);
  for (const l of LANGS) for (const c of concepts) for (const [f, x] of Object.entries(expected[l][c])) {
    const actual = appendix.claim_agreement[t]?.[l]?.[c]?.[f];
    worst = Math.max(worst, actual == null ? Infinity : Math.abs(actual - x));
    cells++;
  }
}
check(`claim agreement vs raw records (${cells} cells, max error below 1e-12)`, worst < 1e-12, true);
for (const t of RERUNS) {
  const mainAgreement = agreementOf(mainRecords, t);
  check(`main ${t} raw records reproduce results/summary.json`, concepts.every((c) => LANGS.every((l) => Object.entries(summary.claim_agreement[t][l][c]).every(([f, x]) => Math.abs(x - mainAgreement[l][c][f]) < 1e-12))), true);
}

// 3. Indices through lib/lab.mjs, as the site's lab computes them.
const merged = { ...summary, models: [...TARGETS, ...RERUNS.map((t) => `${t}@main`)],
  claim_agreement: { ...appendix.claim_agreement, ...Object.fromEntries(RERUNS.map((t) => [`${t}@main`, summary.claim_agreement[t]])) } };
for (const [key, cs] of [["status_index", summary.definitions.status_concepts], ["place_index", summary.definitions.place_concepts], ["pooled_index", concepts]]) {
  const table = indexTable(merged, buildUnits(merged, { concepts: cs }));
  for (const t of TARGETS) {
    const shown = LANGS.map((l) => ci(table[t][l])).join(" | ");
    check(`${key} ${t} lab vs appendix-f.json`, shown, LANGS.map((l) => ci(appendix[key][t][l])).join(" | "));
    hasRow(`${key} ${t}`, `| ${LABEL[t]} | ${shown} |`);
    if (key === "status_index") check(`${key} ${t} typed figures`, shown, EXPECTED_STATUS[t]);
    if (RERUNS.includes(t)) check(`bridge ${t} ${key} rerun`, LANGS.map((l) => ci(appendix.bridges[t][key].rerun[l])).join(" | "), shown);
  }
  for (const t of RERUNS) {
    const mainShown = LANGS.map((l) => ci(summary[key][t][l])).join(" | ");
    check(`${key} main ${t} run vs results/summary.json`, LANGS.map((l) => ci(table[`${t}@main`][l])).join(" | "), mainShown);
    check(`bridge ${t} ${key} main`, LANGS.map((l) => ci(appendix.bridges[t][key].main[l])).join(" | "), mainShown);
  }
}

// 4. Exact sign-flip test on the status claims.
const oriented = (agreement, l, c) => {
  const a = avg(Object.values(agreement[l][c]));
  return summary.definitions.orientation[c] > 0 ? a : 1 - a;
};
for (const other of RERUNS) for (const l of LANGS) {
  const d = summary.definitions.status_concepts.map((c) => oriented(appendix.claim_agreement[NEW], l, c) - oriented(appendix.claim_agreement[other], l, c));
  const cell = appendix.sign_flip[other][l];
  check(`sign flip against ${other} ${l}`, `${f2(cell.mean_difference)} ${cell.new_higher}/${cell.new_lower}/${cell.claims} ${cell.p.toFixed(3)}`,
    `${f2(avg(d))} ${d.filter((x) => x > 0).length}/${d.filter((x) => x < 0).length}/${d.length} ${signFlipTest(d).p.toFixed(3)}`);
  hasRow(`sign flip against ${other} ${l}`, `| ${l} | ${f2(cell.mean_difference)} | ${cell.new_higher}/${cell.claims} | ${cell.new_lower}/${cell.claims} | ${cell.p.toFixed(3)} |`);
}

// 5. Labels: China-inclusive choices on the Taiwan practical scenarios, every condition.
const CHINA_INCLUSIVE = new Set(summary.definitions.china_inclusive_choice_keys);
const labelOf = (rs, t, l, cond) => {
  const xs = rs.filter((r) => r.target === t && r.lang === l && v(r) === cond && r.subject === "Taiwan" && r.question_type === "choice"
    && (/^(country-field|city-format)-/.test(r.concept) || ["dropdown-label", "phone-country", "profile-nationality"].includes(r.concept)));
  return { hits: xs.filter((r) => CHINA_INCLUSIVE.has(r.choice)).length, calls: xs.length };
};
const rate = ({ hits, calls }) => `${Math.round((hits / calls) * 100)}% (${hits}/${calls})`;
for (const cond of CONDITIONS) for (const l of LANGS) {
  for (const t of TARGETS) {
    const x = labelOf(records, t, l, cond);
    check(`labels ${t} ${cond} ${l}`, JSON.stringify(appendix.practical_labels[t].counts[cond][l]), JSON.stringify(x));
    if (cond === "base") check(`labels ${t} base ${l} estimate`, appendix.practical_labels[t].base_interval[l].estimate, x.hits / x.calls);
  }
  for (const t of RERUNS) check(`bridge ${t} labels main ${cond} ${l}`, JSON.stringify(appendix.bridges[t].practical_labels.main[cond][l]), JSON.stringify(labelOf(mainRecords, t, l, cond)));
}
for (const t of TARGETS) for (const cond of CONDITIONS) hasRow(`labels ${t} ${cond}`, `| ${LABEL[t]} | ${cond} | ${LANGS.map((l) => rate(labelOf(records, t, l, cond))).join(" | ")} |`);
for (const t of RERUNS) for (const l of LANGS) {
  const { hits, calls } = labelOf(mainRecords, t, l, "base");
  check(`labels main ${t} base ${l} vs results/summary.json`, hits / calls, summary.practical_labels[t][l].estimate);
}

// 6. Forced choice: full counts, the bridge differences and the PRC-position cells.
const groupB = [...new Set(JSON.parse(readFileSync(join(root, "data/dataset.json"), "utf8")).filter((i) => i.group === "B").map((i) => i.concept))].sort();
check("forced_choice covers every group B concept", Object.keys(appendix.forced_choice).sort().join(","), groupB.join(","));
const countsOf = (rs, t, c, l, cond) => {
  const counts = {};
  for (const r of rs.filter((x) => x.target === t && x.concept === c && x.lang === l && v(x) === cond)) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
  return counts;
};
const sorted = (o) => JSON.stringify(Object.entries(o).sort());
const modalSet = (o) => {
  const n = Math.max(...Object.values(o));
  return Object.keys(o).filter((k) => o[k] === n).sort().join("/");
};
const PRC_POSITION = new Set(["part_of_parent", "one_china_prc_legitimate", "taiwan_belongs_to_prc", "prc"]);
let countMismatches = 0;
const differences = Object.fromEntries(RERUNS.map((t) => [t, 0]));
let prcCells = 0;
for (const c of groupB) for (const l of LANGS) for (const cond of CONDITIONS) {
  for (const t of TARGETS) {
    const counts = countsOf(records, t, c, l, cond);
    if (sorted(counts) !== sorted(appendix.forced_choice[c][t][l][cond])) countMismatches++;
    if (Object.values(counts).reduce((a, b) => a + b, 0) !== 5) countMismatches++;
    prcCells += Object.keys(counts).filter((k) => PRC_POSITION.has(k)).length;
  }
  for (const t of RERUNS) if (modalSet(countsOf(mainRecords, t, c, l, cond)) !== modalSet(countsOf(records, t, c, l, cond))) differences[t]++;
}
check("forced_choice counts vs raw records (5 calls per cell)", countMismatches, 0);
for (const t of RERUNS) {
  check(`bridge ${t} forced-choice differences`, appendix.bridges[t].forced_choice_differences.length, differences[t]);
  check(`bridge ${t} forced-choice cells`, appendix.bridges[t].forced_choice_cells, groupB.length * LANGS.length * CONDITIONS.length);
}
check("PRC-position choices", appendix.prc_position_choices.length, prcCells);

// 7. Stated asker (f1 framing) from the raw records.
for (const t of TARGETS) for (const l of LANGS) {
  const idx = (cond) => avg(summary.definitions.status_concepts.map((c) => {
    const rs = records.filter((r) => r.target === t && r.lang === l && r.concept === c && v(r) === cond && r.framing === "f1");
    const a = (avg(rs.filter((r) => r.polarity === "pos").map((r) => r.value)) + 1 - avg(rs.filter((r) => r.polarity === "neg").map((r) => r.value))) / 2;
    return summary.definitions.orientation[c] > 0 ? a : 1 - a;
  }));
  const cell = appendix.asker[t][l];
  check(`asker ${t} ${l}`, `${f2(cell.asker_tw)} ${f2(cell.asker_cn)}`, `${f2(idx("asker-tw"))} ${f2(idx("asker-cn"))}`);
}

// 7b. City claims: positive and negative statement apart, recomputed from the raw records.
const f3 = (x) => x.toFixed(3);
for (const [t, rs, label] of [...TARGETS.map((x) => [x, records, LABEL[x]]), ...RERUNS.map((x) => [`${x}@main`, mainRecords, LABEL[`${x}@main`]])]) {
  const target = t.endsWith("@main") ? t.slice(0, -"@main".length) : t;
  for (const l of LANGS) for (const c of summary.definitions.place_concepts) {
    const cell = rs.filter((r) => r.target === target && r.lang === l && r.concept === c && v(r) === "base" && r.framing === "f1");
    const pos = cell.filter((r) => r.polarity === "pos").map((r) => r.value);
    const neg = cell.filter((r) => r.polarity === "neg").map((r) => r.value);
    const p = avg(pos);
    const n = avg(neg);
    const high = neg.filter((x) => x >= 0.5).length;
    const got = appendix.place_consistency[t][l][c];
    check(`place consistency ${t} ${l} ${c}`, `${got.positive.toFixed(12)} ${got.negative.toFixed(12)} ${got.synthetic.toFixed(12)} ${got.gap.toFixed(12)} ${got.negative_at_least_half}/${got.negative_calls}`,
      `${p.toFixed(12)} ${n.toFixed(12)} ${((p + 1 - n) / 2).toFixed(12)} ${(p + n - 1).toFixed(12)} ${high}/${neg.length}`);
    check(`place consistency synthetic equals claim_agreement ${t} ${l} ${c}`, Math.abs(got.synthetic - (t.endsWith("@main") ? summary.claim_agreement[target] : appendix.claim_agreement[t])[l][c].f1) < 1e-12, true);
    hasRow(`place consistency ${t} ${l} ${c}`, `| ${label} | ${c} | ${l} | ${f3(p)} | ${f3(n)} | ${f3((p + 1 - n) / 2)} | ${f3(p + n - 1)} | ${high}/${neg.length} |`);
  }
}
check("bridge sentence avoids an upper-bound claim", markdown.some((line) => line.includes("it cannot estimate the range of day-to-day variation")) && !markdown.some((line) => line.includes("bound how much")), true);

// 8. Latency and cost from the raw records.
for (const t of TARGETS) {
  const rs = records.filter((r) => r.target === t && v(r) === "base");
  const input = avg(rs.map((r) => r.usage.input_tokens));
  const output = avg(rs.map((r) => r.usage.output_tokens));
  const cost = ((input * PRICING[t][0] + output * PRICING[t][1]) / 1e6) * 1000;
  const ms = quantile(rs.map((r) => r.ms).sort((a, b) => a - b), 0.5);
  const cell = appendix.latency_cost[t];
  check(`latency and cost ${t}`, `${cell.calls} ${cell.median_latency_ms} ${cell.cost_per_1000_usd.toFixed(4)}`, `${rs.length} ${ms} ${cost.toFixed(4)}`);
  check(`${t} row in appendix-f.md`, markdown.some((line) => line.startsWith(`| ${LABEL[t]} | ${rs.length} | ${ms} |`) && line.endsWith(`| ${cost.toFixed(3)} |`)), true);
}
check(`${NEW} output tokens are all zero (input-only pricing)`, records.filter((r) => r.target === NEW).every((r) => r.usage.output_tokens === 0), true);

// 8b. Yes/no value extremity from the raw records.
for (const t of TARGETS) {
  const vs = records.filter((r) => r.target === t && v(r) === "base" && r.question_type === "noul").map((r) => r.value);
  const cell = appendix.value_extremity[t];
  const extreme = vs.filter((x) => x === 0 || x === 1).length / vs.length;
  const middle = vs.filter((x) => x >= 0.2 && x <= 0.8).length / vs.length;
  check(`value extremity ${t}`, `${cell.calls} ${cell.at_0_or_1.toFixed(12)} ${cell.between_0_2_and_0_8.toFixed(12)} ${cell.distinct_values}`,
    `${vs.length} ${extreme.toFixed(12)} ${middle.toFixed(12)} ${new Set(vs).size}`);
  hasRow(`value extremity ${t}`, `| ${LABEL[t]} | ${vs.length} | ${Math.round(extreme * 100)}% | ${Math.round(middle * 100)}% | ${new Set(vs).size} |`);
}

// 9. Simplified Chinese table beside the main analysis.
for (const row of appendix.cross_model_zh_cn) {
  const isMain = summary.models.includes(row.model) && row.run_date === "2026-09-25";
  const expected = isMain
    ? `${ci(summary.status_index[row.model]["zh-CN"])} ${ci(summary.place_index[row.model]["zh-CN"])}`
    : `${ci(appendix.status_index[row.model]["zh-CN"])} ${ci(appendix.place_index[row.model]["zh-CN"])}`;
  check(`zh-CN table ${row.model} ${row.run_date}`, `${ci(row.status_index)} ${ci(row.place_index)}`, expected);
  hasRow(`zh-CN table ${row.model} ${row.run_date}`, `| ${row.label} | ${row.run_date} | ${ci(row.status_index)} | ${ci(row.place_index)} |`);
}
check("zh-CN table covers every main model and the three targets", appendix.cross_model_zh_cn.map((r) => r.model).join(","), [...summary.models, ...TARGETS].join(","));

// 10. The site: the lab's merge of appendix F (lib/addendum.mjs), and the exported items.json and
// replay.json cells against the raw records.
const { APPENDIX_ARMS, mergeAppendices } = await import(join(root, "lib/addendum.mjs"));
const arm = APPENDIX_ARMS.find((a) => a.id === "F");
const siteId = (t) => t + arm.suffix;
check("arm F run date matches every record", records.every((r) => r.ts.startsWith(arm.runDate)), true);
check("arm F targets", [...arm.targets].sort().join(","), [...TARGETS].sort().join(","));
const siteMerged = mergeAppendices(summary, { F: appendix });
for (const [key, cs] of [["status_index", summary.definitions.status_concepts], ["place_index", summary.definitions.place_concepts], ["pooled_index", concepts]]) {
  const table = indexTable(siteMerged, buildUnits(siteMerged, { concepts: cs }));
  for (const t of TARGETS) check(`site lab ${key} ${siteId(t)} vs appendix-f.json`, LANGS.map((l) => ci(table[siteId(t)][l])).join(" | "), LANGS.map((l) => ci(appendix[key][t][l])).join(" | "));
  const alone = indexTable(summary, buildUnits(summary, { concepts: cs }));
  check(`site lab ${key} main models unchanged by the merge`, JSON.stringify(summary.models.map((m) => table[m])) === JSON.stringify(summary.models.map((m) => alone[m])), true);
}
const siteCopy = join(root, "site/public/data/appendix-f.json");
if (existsSync(siteCopy)) check("site/public/data/appendix-f.json is a copy of results/appendix-f.json", readFileSync(siteCopy, "utf8") === readFileSync(join(root, "results/appendix-f.json"), "utf8"), true);

const items = JSON.parse(readFileSync(join(root, "site/public/data/items.json"), "utf8"));
const itemsArm = items.appendices.find((a) => a.id === "F");
check("items.json main models", items.models.join(","), summary.models.join(","));
check("items.json appendix F models", itemsArm.models.join(","), arm.targets.map(siteId).join(","));
check("items.json appendix F calls", itemsArm.calls, records.length);
check("items.json appendix F run date", itemsArm.run_date, appendix.run_date);
let seed = 20261010;
const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = (xs) => xs[Math.floor(random() * xs.length)];
const typeOf = (id) => items.types.find((t) => [...Object.values(t.text), ...Object.values(t.variants).flatMap((x) => Object.values(x))].some((x) => x.id === id));
for (let i = 0; i < 12; i++) {
  const t = TARGETS[i % TARGETS.length];
  const record = pick(records.filter((r) => r.target === t));
  const rs = records.filter((r) => r.item_id === record.item_id && r.target === t);
  const cell = typeOf(record.item_id).results[v(record)][record.lang][siteId(t)];
  if (record.question_type === "choice") {
    const counts = {};
    for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
    check(`items.json ${record.item_id} ${siteId(t)} counts`, JSON.stringify(Object.entries(cell.counts).sort()), JSON.stringify(Object.entries(counts).sort()));
  } else {
    const xs = rs.map((r) => r.value);
    const m = avg(xs);
    const sd = Math.sqrt(xs.reduce((a, x) => a + (x - m) ** 2, 0) / (xs.length - 1));
    check(`items.json ${record.item_id} ${siteId(t)} n/mean/sd`, `${cell.n}/${cell.mean.toFixed(4)}/${cell.sd.toFixed(4)}`, `${xs.length}/${m.toFixed(4)}/${sd.toFixed(4)}`);
    if (v(record) === "base" && record.concept in summary.definitions.orientation) {
      check(`items.json ${record.item_id} ${siteId(t)} agreement vs appendix-f.json`, cell.agreement, appendix.claim_agreement[t][record.lang][record.concept][record.framing]);
    }
  }
}

const replay = JSON.parse(readFileSync(join(root, "site/public/replay/data/replay.json"), "utf8"));
for (const t of TARGETS) {
  check(`replay.json ${siteId(t)} base calls`, replay.records.filter((r) => r.target === siteId(t)).length, records.filter((r) => r.target === t && v(r) === "base").length);
  check(`replay.json ${siteId(t)} pricing`, JSON.stringify(replay.pricing[siteId(t)]), JSON.stringify(PRICING[t]));
}

console.log(failures ? `${failures} failures, ${passes} passed` : `all ${passes} checks passed`);
process.exitCode = failures ? 1 : 0;
