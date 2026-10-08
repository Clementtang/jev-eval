// Checks results/appendix-e.json and results/appendix-e.md against the raw records in
// results/runs-appendixe/ (and results/runs/ for the bridge), recomputing every figure without
// scripts/appendix-e.mjs or lib/arm-analysis.mjs; indices go through lib/lab.mjs as the site does.
// Section 11 checks the site's copy of the appendix (lab merge, items.json, replay.json).
// Usage: node scripts/export-site-data.mjs && node scripts/verify-appendix-e.mjs
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const { buildUnits, indexTable } = await import(join(root, "lib/lab.mjs"));
const { quantile, signFlipTest } = await import(join(root, "lib/stats.mjs"));
const { PRICING } = await import(join(root, "lib/targets.mjs"));
const summary = JSON.parse(readFileSync(join(root, "results/summary.json"), "utf8"));
const appendix = JSON.parse(readFileSync(join(root, "results/appendix-e.json"), "utf8"));
const markdown = readFileSync(join(root, "results/appendix-e.md"), "utf8").split("\n");
const dataset = JSON.parse(readFileSync(join(root, "data/dataset.json"), "utf8"));
const readJsonl = (path) => readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const readDir = (dir) => readdirSync(join(root, dir)).filter((f) => f.endsWith(".jsonl")).flatMap((f) => readJsonl(join(root, dir, f)));
const raw = readDir("results/runs-appendixe");
const records = raw.filter((r) => r.ok && !r.refusal);
const mainRecords = readDir("results/runs").filter((r) => r.ok && !r.refusal && r.target === "claude-haiku-4-5");
const LANGS = summary.langs;
const RERUN = "claude-haiku-4-5";
const NEW = "claude-haiku-5-5";
const MEDIUM = "claude-haiku-5-5-medium";
const TARGETS = [RERUN, NEW, MEDIUM];
const FULL = [RERUN, NEW];
const CONDITIONS = ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"];
const LABEL = { [RERUN]: "Claude Haiku 4.5 (same-day rerun)", [NEW]: "Claude Haiku 5.5, effort low", [MEDIUM]: "Claude Haiku 5.5, effort medium",
  main: "Claude Haiku 4.5 (main runs, 25 September)" };
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
const hasRow = (label, row) => check(`appendix-e.md row ${label}`, markdown.includes(row), true);

// Figures quoted in the report, typed here so a silent change in the data or the code stops the deploy.
const EXPECTED_STATUS = {
  [RERUN]: "0.62 [0.54, 0.71] | 0.53 [0.45, 0.60] | 0.62 [0.53, 0.69]",
  [NEW]: "0.74 [0.66, 0.81] | 0.66 [0.58, 0.75] | 0.73 [0.64, 0.81]",
  [MEDIUM]: "0.73 [0.66, 0.81] | 0.68 [0.60, 0.76] | 0.76 [0.70, 0.83]",
};

// 1. Raw records: counts, dates and full coverage.
const statusClaims = summary.definitions.status_concepts;
const coverage = { [RERUN]: dataset, [NEW]: dataset, [MEDIUM]: dataset.filter((i) => i.group === "A" && !i.variant && statusClaims.includes(i.concept)) };
check("raw records all successful", raw.length === records.length && raw.every((r) => r.ok && !r.refusal), true);
check("calls", appendix.calls, records.length);
check("run date matches every record", records.every((r) => r.ts.startsWith(appendix.run_date)), true);
check("every record has a value or choice", records.every((r) => (r.question_type === "choice" ? r.choice : r.value) != null), true);
for (const t of TARGETS) {
  const rs = records.filter((r) => r.target === t);
  const ts = rs.map((r) => r.ts).sort();
  const info = appendix.targets[t];
  const expected = new Set(coverage[t].flatMap((i) => [1, 2, 3, 4, 5].map((k) => `${i.id}#${k}`)));
  const keys = new Set(rs.map((r) => `${r.item_id}#${r.rep}`));
  check(`${t} calls`, info.calls, rs.length);
  check(`${t} calls equal items covered x 5`, rs.length, coverage[t].length * 5);
  check(`${t} unique item and repetition pairs`, keys.size, rs.length);
  check(`${t} covers exactly the expected item and repetition pairs`, keys.size === expected.size && [...keys].every((k) => expected.has(k)), true);
  check(`${t} missing calls`, info.missing_calls, 0);
  check(`${t} first and last call`, `${info.first_call} ${info.last_call}`, `${ts[0]} ${ts.at(-1)}`);
  const gap = Math.max(...ts.slice(1).map((x, i) => Date.parse(x) - Date.parse(ts[i])));
  check(`${t} longest gap`, info.longest_gap_s, Math.round(gap / 1000));
  hasRow(`${t} runs`, `| ${LABEL[t]} | ${rs[0].model} | ${t === RERUN ? "none" : info.effort} | ${rs.length} | ${coverage[t].length * 5} | 0 | ${ts[0]} | ${ts.at(-1)} | ${Math.round(gap / 1000)} |`);
}

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
  const claims = t === MEDIUM ? statusClaims : concepts;
  for (const l of LANGS) for (const c of claims) for (const [f, x] of Object.entries(expected[l][c])) {
    const actual = appendix.claim_agreement[t]?.[l]?.[c]?.[f];
    worst = Math.max(worst, actual == null ? Infinity : Math.abs(actual - x));
    cells++;
  }
}
check(`claim agreement vs raw records (${cells} cells, max error below 1e-12)`, worst < 1e-12, true);
check(`${MEDIUM} has the status claims only`, LANGS.every((l) => Object.keys(appendix.claim_agreement[MEDIUM][l]).sort().join() === [...statusClaims].sort().join()), true);
const mainAgreement = agreementOf(mainRecords, RERUN);
check("main Claude Haiku 4.5 raw records reproduce results/summary.json", concepts.every((c) => LANGS.every((l) => Object.entries(summary.claim_agreement[RERUN][l][c]).every(([f, x]) => Math.abs(x - mainAgreement[l][c][f]) < 1e-12))), true);

// 3. Indices through lib/lab.mjs, as the site's lab computes them.
const SETS = [["status_index", statusClaims], ["place_index", summary.definitions.place_concepts], ["pooled_index", concepts]];
const merged = { ...summary, models: [...TARGETS, "main"], claim_agreement: { ...appendix.claim_agreement, main: summary.claim_agreement[RERUN] } };
for (const [key, cs] of SETS) {
  const table = indexTable(merged, buildUnits(merged, { concepts: cs }));
  for (const t of TARGETS) {
    // The medium arm lacks the place claims, so only its status index is a full index.
    const full = t !== MEDIUM || key === "status_index";
    const shown = LANGS.map((l) => (full ? ci(table[t][l]) : "-")).join(" | ");
    check(`${key} ${t} lab vs appendix-e.json`, shown, LANGS.map((l) => ci(appendix[key][t][l])).join(" | "));
    if (!full) check(`${key} ${t} is null`, LANGS.every((l) => appendix[key][t][l] === null), true);
    hasRow(`${key} ${t}`, `| ${LABEL[t]} | ${shown} |`);
    if (key === "status_index") check(`${key} ${t} typed figures`, shown, EXPECTED_STATUS[t]);
    if (t === RERUN) check(`bridge ${key} rerun`, LANGS.map((l) => ci(appendix.bridge[key].rerun[l])).join(" | "), shown);
  }
  const mainShown = LANGS.map((l) => ci(summary[key][RERUN][l])).join(" | ");
  check(`${key} main run vs results/summary.json`, LANGS.map((l) => ci(table.main[l])).join(" | "), mainShown);
  check(`bridge ${key} main`, LANGS.map((l) => ci(appendix.bridge[key].main[l])).join(" | "), mainShown);
  hasRow(`${key} main`, `| ${LABEL.main} | ${mainShown} |`);
}

// 4. Exact sign-flip tests on the status claims.
const oriented = (agreement, l, c) => {
  const a = avg(Object.values(agreement[l][c]));
  return summary.definitions.orientation[c] > 0 ? a : 1 - a;
};
const signFlipCheck = (name, cell, a, b, l) => {
  const d = statusClaims.map((c) => oriented(a, l, c) - oriented(b, l, c));
  check(`${name} ${l}`, `${f2(cell.mean_difference)} ${cell.new_higher}/${cell.new_lower}/${cell.claims} ${cell.p.toFixed(3)}`,
    `${f2(avg(d))} ${d.filter((x) => x > 0).length}/${d.filter((x) => x < 0).length}/${d.length} ${signFlipTest(d).p.toFixed(3)}`);
  hasRow(`${name} ${l}`, `| ${l} | ${f2(cell.mean_difference)} | ${cell.new_higher}/${cell.claims} | ${cell.new_lower}/${cell.claims} | ${cell.p.toFixed(3)} |`);
};
for (const l of LANGS) signFlipCheck("sign flip", appendix.sign_flip[l], appendix.claim_agreement[NEW], appendix.claim_agreement[RERUN], l);

// 5. Labels: China-inclusive choices on the Taiwan practical scenarios, every condition.
const CHINA_INCLUSIVE = new Set(summary.definitions.china_inclusive_choice_keys);
const labelOf = (rs, t, l, cond) => {
  const xs = rs.filter((r) => r.target === t && r.lang === l && v(r) === cond && r.subject === "Taiwan" && r.question_type === "choice"
    && (/^(country-field|city-format)-/.test(r.concept) || ["dropdown-label", "phone-country", "profile-nationality"].includes(r.concept)));
  return { hits: xs.filter((r) => CHINA_INCLUSIVE.has(r.choice)).length, calls: xs.length };
};
const rate = ({ hits, calls }) => `${Math.round((hits / calls) * 100)}% (${hits}/${calls})`;
for (const cond of CONDITIONS) for (const l of LANGS) {
  for (const t of FULL) {
    const x = labelOf(records, t, l, cond);
    check(`labels ${t} ${cond} ${l}`, JSON.stringify(appendix.practical_labels[t].counts[cond][l]), JSON.stringify(x));
    if (cond === "base") check(`labels ${t} base ${l} estimate`, appendix.practical_labels[t].base_interval[l].estimate, x.hits / x.calls);
  }
  check(`bridge labels main ${cond} ${l}`, JSON.stringify(appendix.bridge.practical_labels.main[cond][l]), JSON.stringify(labelOf(mainRecords, RERUN, l, cond)));
  check(`bridge labels rerun ${cond} ${l}`, JSON.stringify(appendix.bridge.practical_labels.rerun[cond][l]), JSON.stringify(labelOf(records, RERUN, l, cond)));
}
for (const t of FULL) for (const cond of CONDITIONS) hasRow(`labels ${t} ${cond}`, `| ${LABEL[t]} | ${cond} | ${LANGS.map((l) => rate(labelOf(records, t, l, cond))).join(" | ")} |`);
for (const l of LANGS) {
  const { hits, calls } = labelOf(mainRecords, RERUN, l, "base");
  check(`labels main base ${l} vs results/summary.json`, hits / calls, summary.practical_labels[RERUN][l].estimate);
}

// 6. Forced choice: full counts, the bridge differences and the PRC-position cells.
const groupB = [...new Set(dataset.filter((i) => i.group === "B").map((i) => i.concept))].sort();
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
let differences = 0;
const prcCells = [];
for (const c of groupB) for (const l of LANGS) for (const cond of CONDITIONS) {
  for (const t of FULL) {
    const counts = countsOf(records, t, c, l, cond);
    if (sorted(counts) !== sorted(appendix.forced_choice[c][t][l][cond])) countMismatches++;
    if (Object.values(counts).reduce((a, b) => a + b, 0) !== 5) countMismatches++;
    for (const k of Object.keys(counts).filter((x) => PRC_POSITION.has(x))) prcCells.push(`${t}|${c}|${l}|${cond}|${k}|${counts[k]}`);
  }
  if (modalSet(countsOf(mainRecords, RERUN, c, l, cond)) !== modalSet(countsOf(records, RERUN, c, l, cond))) differences++;
}
check("forced_choice counts vs raw records (5 calls per cell)", countMismatches, 0);
check("bridge forced-choice differences", appendix.bridge.forced_choice_differences.length, differences);
check("bridge forced-choice cells", appendix.bridge.forced_choice_cells, groupB.length * LANGS.length * CONDITIONS.length);
check("PRC-position choices", appendix.prc_position_choices.map((p) => `${p.target}|${p.claim}|${p.lang}|${p.condition}|${p.choice}|${p.count}`).sort().join(";"), prcCells.sort().join(";"));
for (const p of appendix.prc_position_choices) hasRow(`PRC position ${p.target} ${p.claim} ${p.lang} ${p.condition}`, `| ${LABEL[p.target]} | ${p.claim} | ${p.lang} | ${p.condition} | ${p.choice} | ${p.count}/${p.calls} |`);

// 7. Stated asker (f1 framing) from the raw records.
for (const t of FULL) for (const l of LANGS) {
  const idx = (cond) => avg(statusClaims.map((c) => {
    const rs = records.filter((r) => r.target === t && r.lang === l && r.concept === c && v(r) === cond && r.framing === "f1");
    const a = (avg(rs.filter((r) => r.polarity === "pos").map((r) => r.value)) + 1 - avg(rs.filter((r) => r.polarity === "neg").map((r) => r.value))) / 2;
    return summary.definitions.orientation[c] > 0 ? a : 1 - a;
  }));
  const cell = appendix.asker[t][l];
  check(`asker ${t} ${l}`, `${f2(cell.asker_tw)} ${f2(cell.asker_cn)}`, `${f2(idx("asker-tw"))} ${f2(idx("asker-cn"))}`);
}

// 7b. City claims: positive and negative statement apart, recomputed from the raw records.
const f3 = (x) => x.toFixed(3);
for (const [t, rs, label] of [...FULL.map((x) => [x, records, LABEL[x]]), ["claude-haiku-4-5@main", mainRecords, LABEL.main]]) {
  const target = t.endsWith("@main") ? RERUN : t;
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

// 8. Latency, tokens and cost from the raw records.
const usageOf = (rs, t) => {
  const input = avg(rs.map((r) => r.usage.input_tokens));
  const output = avg(rs.map((r) => r.usage.output_tokens));
  return { calls: rs.length, input, output, ms: quantile(rs.map((r) => r.ms).sort((a, b) => a - b), 0.5),
    cost: ((input * PRICING[t][0] + output * PRICING[t][1]) / 1e6) * 1000 };
};
check("records carry no separate reasoning token count", records.every((r) => r.usage.reasoning_tokens == null), true);
for (const t of TARGETS) {
  const u = usageOf(records.filter((r) => r.target === t && v(r) === "base"), t);
  const cell = appendix.latency_cost[t];
  check(`latency, tokens and cost ${t}`, `${cell.calls} ${cell.median_latency_ms} ${cell.mean_input_tokens.toFixed(4)} ${cell.mean_output_tokens.toFixed(4)} ${cell.cost_per_1000_usd.toFixed(4)}`,
    `${u.calls} ${u.ms} ${u.input.toFixed(4)} ${u.output.toFixed(4)} ${u.cost.toFixed(4)}`);
  if (t !== MEDIUM) hasRow(`latency ${t}`, `| ${LABEL[t]} | ${u.calls} | ${u.ms} | ${Math.round(u.input)} | ${Math.round(u.output)} | not reported | ${u.cost.toFixed(2)} |`);
}
const ratio = appendix.latency_cost[NEW].mean_input_tokens / appendix.latency_cost[RERUN].mean_input_tokens;
check("mean input ratio", appendix.mean_input_ratio, ratio);
check("mean input ratio in appendix-e.md", markdown.some((line) => line.includes(`its mean input is ${ratio.toFixed(2)} times`)), true);

// 9. Reasoning effort: medium against low on the same calls.
const mediumKeys = new Set(records.filter((r) => r.target === MEDIUM).map((r) => `${r.item_id}#${r.rep}`));
check("reasoning effort calls compared", appendix.reasoning_effort.calls_compared, mediumKeys.size);
const sameCalls = records.filter((r) => (r.target === MEDIUM || r.target === NEW) && v(r) === "base" && mediumKeys.has(`${r.item_id}#${r.rep}`));
const effortSummary = { ...summary, models: [MEDIUM, NEW], claim_agreement: { [MEDIUM]: agreementOf(sameCalls, MEDIUM), [NEW]: agreementOf(sameCalls, NEW) } };
const effortTable = indexTable(effortSummary, buildUnits(effortSummary, { concepts: statusClaims }));
for (const t of [MEDIUM, NEW]) {
  const u = usageOf(sameCalls.filter((r) => r.target === t), t);
  const row = appendix.reasoning_effort.rows[t];
  const shown = LANGS.map((l) => ci(effortTable[t][l])).join(" | ");
  check(`reasoning effort ${t} status index`, LANGS.map((l) => ci(row.status_index[l])).join(" | "), shown);
  check(`reasoning effort ${t} status index equals the full status index`, shown, EXPECTED_STATUS[t]);
  check(`reasoning effort ${t} calls, tokens, latency and cost`, `${row.calls} ${row.mean_output_tokens.toFixed(4)} ${row.median_latency_ms} ${row.cost_per_1000_usd.toFixed(4)}`,
    `${u.calls} ${u.output.toFixed(4)} ${u.ms} ${u.cost.toFixed(4)}`);
  check(`reasoning effort ${t} row in appendix-e.md`, markdown.some((line) => line.startsWith(`| ${LABEL[t]} | ${u.calls} | ${shown} | ${Math.round(u.input)} | ${u.output.toFixed(1)} |`) && line.endsWith(`| ${u.ms} | ${u.cost.toFixed(2)} |`)), true);
}
for (const l of LANGS) signFlipCheck("effort sign flip", appendix.reasoning_effort.sign_flip[l], effortSummary.claim_agreement[MEDIUM], effortSummary.claim_agreement[NEW], l);

// 10. Simplified Chinese table beside the main analysis.
for (const row of appendix.cross_model_zh_cn) {
  const isMain = summary.models.includes(row.model) && row.run_date === "2026-09-25";
  const expected = isMain
    ? `${ci(summary.status_index[row.model]["zh-CN"])} ${ci(summary.place_index[row.model]["zh-CN"])}`
    : `${ci(appendix.status_index[row.model]["zh-CN"])} ${ci(appendix.place_index[row.model]["zh-CN"])}`;
  check(`zh-CN table ${row.model} ${row.run_date}`, `${ci(row.status_index)} ${ci(row.place_index)}`, expected);
  hasRow(`zh-CN table ${row.model} ${row.run_date}`, `| ${row.label} | ${row.run_date} | ${ci(row.status_index)} | ${ci(row.place_index)} |`);
}
check("zh-CN table covers every main model and the three targets", appendix.cross_model_zh_cn.map((r) => r.model).join(","), [...summary.models, ...TARGETS].join(","));

// 11. The site: the lab's merge of appendix E (lib/addendum.mjs), and the exported items.json and
// replay.json cells against the raw records.
const { APPENDIX_ARMS, mergeAppendices } = await import(join(root, "lib/addendum.mjs"));
const arm = APPENDIX_ARMS.find((a) => a.id === "E");
const siteId = (t) => t + arm.suffix;
check("arm E run date matches every record", records.every((r) => r.ts.startsWith(arm.runDate)), true);
check("arm E targets", [...arm.targets].sort().join(","), [...TARGETS].sort().join(","));
const siteMerged = mergeAppendices(summary, { E: appendix });
for (const [key, cs] of SETS) {
  const table = indexTable(siteMerged, buildUnits(siteMerged, { concepts: cs }));
  for (const t of TARGETS) {
    const full = t !== MEDIUM || key === "status_index";
    check(`site lab ${key} ${siteId(t)} vs appendix-e.json`, LANGS.map((l) => (full ? ci(table[siteId(t)][l]) : "-")).join(" | "), LANGS.map((l) => ci(appendix[key][t][l])).join(" | "));
    // The lab shows "not tested" when a model lacks some of the selected claims.
    if (!full) check(`site lab ${key} ${siteId(t)} lacks some claims`, LANGS.every((l) => table[siteId(t)][l].units < cs.length), true);
  }
  const alone = indexTable(summary, buildUnits(summary, { concepts: cs }));
  check(`site lab ${key} main models unchanged by the merge`, JSON.stringify(summary.models.map((m) => table[m])) === JSON.stringify(summary.models.map((m) => alone[m])), true);
}
const siteCopy = join(root, "site/public/data/appendix-e.json");
// The site build copies the file (site/scripts/agent-files.mjs), and CI verifies before building.
if (existsSync(siteCopy)) check("site/public/data/appendix-e.json is a copy of results/appendix-e.json", readFileSync(siteCopy, "utf8") === readFileSync(join(root, "results/appendix-e.json"), "utf8"), true);

const items = JSON.parse(readFileSync(join(root, "site/public/data/items.json"), "utf8"));
const itemsArm = items.appendices.find((a) => a.id === "E");
check("items.json main models", items.models.join(","), summary.models.join(","));
check("items.json appendix E models", itemsArm.models.join(","), arm.targets.map(siteId).join(","));
check("items.json appendix E calls", itemsArm.calls, records.length);
check("items.json appendix E run date", itemsArm.run_date, appendix.run_date);
let seed = 20261008;
const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = (xs) => xs[Math.floor(random() * xs.length)];
const typeOf = (id) => items.types.find((t) => [...Object.values(t.text), ...Object.values(t.variants).flatMap((x) => Object.values(x))].some((x) => x.id === id));
for (let i = 0; i < 15; i++) {
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
      check(`items.json ${record.item_id} ${siteId(t)} agreement vs appendix-e.json`, cell.agreement, appendix.claim_agreement[t][record.lang][record.concept][record.framing]);
    }
  }
}
// The main Claude Haiku 4.5 cells must stay those of the 25 September run, apart from the rerun.
const mainItem = pick(mainRecords.filter((r) => r.question_type === "noul" && v(r) === "base"));
const mainValues = mainRecords.filter((r) => r.item_id === mainItem.item_id).map((r) => r.value);
check(`items.json ${mainItem.item_id} ${RERUN} is the main run`, typeOf(mainItem.item_id).results.base[mainItem.lang][RERUN].mean.toFixed(4), avg(mainValues).toFixed(4));

const replay = JSON.parse(readFileSync(join(root, "site/public/replay/data/replay.json"), "utf8"));
for (const t of TARGETS) {
  check(`replay.json ${siteId(t)} base calls`, replay.records.filter((r) => r.target === siteId(t)).length, records.filter((r) => r.target === t && v(r) === "base").length);
  check(`replay.json ${siteId(t)} pricing`, JSON.stringify(replay.pricing[siteId(t)]), JSON.stringify(PRICING[t]));
}
check(`replay.json ${RERUN} base calls are the main run's`, replay.records.filter((r) => r.target === RERUN).length, mainRecords.filter((r) => v(r) === "base").length);

console.log(failures ? `${failures} failures, ${passes} passed` : `all ${passes} checks passed`);
process.exitCode = failures ? 1 : 0;
