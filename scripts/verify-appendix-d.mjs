// Checks results/appendix-d.json and results/appendix-d.md against the raw records in
// results/runs-appendixd/ (and results/runs/ for the bridge), recomputing every figure without
// scripts/appendix-d.mjs or lib/arm-analysis.mjs; indices go through lib/lab.mjs as the site does.
// Section 7 checks the site's copy of the appendix (lab merge, items.json, replay.json).
// Usage: node scripts/export-site-data.mjs && node scripts/verify-appendix-d.mjs
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const { buildUnits, indexTable } = await import(join(root, "lib/lab.mjs"));
const { quantile, signFlipTest } = await import(join(root, "lib/stats.mjs"));
const { PRICING } = await import(join(root, "lib/targets.mjs"));
const summary = JSON.parse(readFileSync(join(root, "results/summary.json"), "utf8"));
const appendix = JSON.parse(readFileSync(join(root, "results/appendix-d.json"), "utf8"));
const markdown = readFileSync(join(root, "results/appendix-d.md"), "utf8").split("\n");
const readJsonl = (path) => readFileSync(path, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
const readDir = (dir) => readdirSync(join(root, dir)).filter((f) => f.endsWith(".jsonl")).flatMap((f) => readJsonl(join(root, dir, f)));
const raw = readDir("results/runs-appendixd");
const records = raw.filter((r) => r.ok && !r.refusal);
const mainRecords = readDir("results/runs").filter((r) => r.ok && !r.refusal && r.target === "sol-6");
const discarded = readJsonl(join(root, "results/runs-discarded/20261001-openai-credits-exhausted.jsonl"));
const LANGS = summary.langs;
const TARGETS = ["sol-6", "sol-6-1"];
const CONDITIONS = ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"];
const LABEL = { "sol-6": "GPT-6 Sol (same-day rerun)", "sol-6-1": "GPT-6.1 Sol", main: "GPT-6 Sol (main runs, 25 September)" };
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
const hasRow = (label, row) => check(`appendix-d.md row ${label}`, markdown.includes(row), true);

// Figures quoted in the report, typed here so a silent change in the data or the code stops the deploy.
const EXPECTED_STATUS = {
  "sol-6": "0.91 [0.87, 0.95] | 0.81 [0.74, 0.88] | 0.91 [0.86, 0.95]",
  "sol-6-1": "0.90 [0.84, 0.95] | 0.79 [0.69, 0.87] | 0.91 [0.87, 0.95]",
};

// 1. Raw records: counts, dates, the pause and the discarded failures.
check("raw records all successful", raw.length === records.length && raw.every((r) => r.ok && !r.refusal), true);
check("calls", appendix.calls, records.length);
check("run date matches every record", records.every((r) => r.ts.startsWith(appendix.run_date)), true);
for (const t of TARGETS) {
  const rs = records.filter((r) => r.target === t);
  const ts = rs.map((r) => r.ts).sort();
  const info = appendix.targets[t];
  check(`${t} calls (957 items x 5)`, info.calls, rs.length);
  check(`${t} calls equal 4785`, rs.length, 4785);
  check(`${t} unique item and repetition pairs`, new Set(rs.map((r) => `${r.item_id}#${r.rep}`)).size, rs.length);
  check(`${t} first and last call`, `${info.first_call} ${info.last_call}`, `${ts[0]} ${ts.at(-1)}`);
  check(`${t} segments cover every call`, info.segments.reduce((a, s) => a + s.calls, 0), rs.length);
  check(`${t} segments are ordered and disjoint`, info.segments.every((s, i) => s.from <= s.to && (i === 0 || info.segments[i - 1].to < s.from)), true);
  const failed = discarded.filter((r) => r.target === t);
  check(`${t} discarded failures`, info.discarded_failures.calls, failed.length);
  check(`${t} discarded failures are HTTP 429`, info.discarded_failures.http_429, failed.filter((r) => r.error.includes("HTTP 429")).length);
  // Concurrent calls overlap the end of the first segment, so failures are checked against the resume only.
  check(`${t} discarded failures precede the resume`, info.segments.length === 2 && failed.every((r) => r.ts >= info.first_call && r.ts < info.segments[1].from), true);
  hasRow(`${t} runs`, `| ${LABEL[t]} | ${rs[0].model} | ${rs.length} | ${ts[0]} | ${ts.at(-1)} |`);
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
  for (const l of LANGS) for (const c of concepts) for (const [f, x] of Object.entries(expected[l][c])) {
    const actual = appendix.claim_agreement[t]?.[l]?.[c]?.[f];
    worst = Math.max(worst, actual == null ? Infinity : Math.abs(actual - x));
    cells++;
  }
}
check(`claim agreement vs raw records (${cells} cells, max error below 1e-12)`, worst < 1e-12, true);
const mainAgreement = agreementOf(mainRecords, "sol-6");
check("main GPT-6 Sol raw records reproduce results/summary.json", concepts.every((c) => LANGS.every((l) => Object.entries(summary.claim_agreement["sol-6"][l][c]).every(([f, x]) => Math.abs(x - mainAgreement[l][c][f]) < 1e-12))), true);

// 3. Indices through lib/lab.mjs, as the site's lab computes them.
const merged = { ...summary, models: [...TARGETS, "sol-6@main"], claim_agreement: { ...appendix.claim_agreement, "sol-6@main": summary.claim_agreement["sol-6"] } };
for (const [key, cs] of [["status_index", summary.definitions.status_concepts], ["place_index", summary.definitions.place_concepts], ["pooled_index", concepts]]) {
  const table = indexTable(merged, buildUnits(merged, { concepts: cs }));
  for (const t of TARGETS) {
    const shown = LANGS.map((l) => ci(table[t][l])).join(" | ");
    check(`${key} ${t} lab vs appendix-d.json`, shown, LANGS.map((l) => ci(appendix[key][t][l])).join(" | "));
    hasRow(`${key} ${t}`, `| ${LABEL[t]} | ${shown} |`);
    if (key === "status_index") check(`${key} ${t} typed figures`, shown, EXPECTED_STATUS[t]);
    if (t === "sol-6") check(`bridge ${key} rerun`, LANGS.map((l) => ci(appendix.bridge[key].rerun[l])).join(" | "), shown);
  }
  const mainShown = LANGS.map((l) => ci(summary[key]["sol-6"][l])).join(" | ");
  check(`${key} main run vs results/summary.json`, LANGS.map((l) => ci(table["sol-6@main"][l])).join(" | "), mainShown);
  check(`bridge ${key} main`, LANGS.map((l) => ci(appendix.bridge[key].main[l])).join(" | "), mainShown);
}

// 4. Exact sign-flip test on the status claims.
const oriented = (agreement, l, c) => {
  const a = avg(Object.values(agreement[l][c]));
  return summary.definitions.orientation[c] > 0 ? a : 1 - a;
};
for (const l of LANGS) {
  const d = summary.definitions.status_concepts.map((c) => oriented(appendix.claim_agreement["sol-6-1"], l, c) - oriented(appendix.claim_agreement["sol-6"], l, c));
  const cell = appendix.sign_flip[l];
  check(`sign flip ${l}`, `${f2(cell.mean_difference)} ${cell.new_higher}/${cell.new_lower}/${cell.claims} ${cell.p.toFixed(3)}`,
    `${f2(avg(d))} ${d.filter((x) => x > 0).length}/${d.filter((x) => x < 0).length}/${d.length} ${signFlipTest(d).p.toFixed(3)}`);
  hasRow(`sign flip ${l}`, `| ${l} | ${f2(cell.mean_difference)} | ${cell.new_higher}/${cell.claims} | ${cell.new_lower}/${cell.claims} | ${cell.p.toFixed(3)} |`);
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
  check(`bridge labels main ${cond} ${l}`, JSON.stringify(appendix.bridge.practical_labels.main[cond][l]), JSON.stringify(labelOf(mainRecords, "sol-6", l, cond)));
}
for (const t of TARGETS) for (const cond of CONDITIONS) hasRow(`labels ${t} ${cond}`, `| ${LABEL[t]} | ${cond} | ${LANGS.map((l) => rate(labelOf(records, t, l, cond))).join(" | ")} |`);
for (const l of LANGS) {
  const { hits, calls } = labelOf(mainRecords, "sol-6", l, "base");
  check(`labels main base ${l} vs results/summary.json`, hits / calls, summary.practical_labels["sol-6"][l].estimate);
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
let differences = 0;
let prcCells = 0;
for (const c of groupB) for (const l of LANGS) for (const cond of CONDITIONS) {
  for (const t of TARGETS) {
    const counts = countsOf(records, t, c, l, cond);
    if (sorted(counts) !== sorted(appendix.forced_choice[c][t][l][cond])) countMismatches++;
    if (Object.values(counts).reduce((a, b) => a + b, 0) !== 5) countMismatches++;
    prcCells += Object.keys(counts).filter((k) => PRC_POSITION.has(k)).length;
  }
  if (modalSet(countsOf(mainRecords, "sol-6", c, l, cond)) !== modalSet(countsOf(records, "sol-6", c, l, cond))) differences++;
}
check("forced_choice counts vs raw records (5 calls per cell)", countMismatches, 0);
check("bridge forced-choice differences", appendix.bridge.forced_choice_differences.length, differences);
check("bridge forced-choice cells", appendix.bridge.forced_choice_cells, groupB.length * LANGS.length * CONDITIONS.length);
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

// 8. Latency and cost from the raw records.
for (const t of TARGETS) {
  const rs = records.filter((r) => r.target === t && v(r) === "base");
  const input = avg(rs.map((r) => r.usage.input_tokens));
  const output = avg(rs.map((r) => r.usage.output_tokens));
  const cost = ((input * PRICING[t][0] + output * PRICING[t][1]) / 1e6) * 1000;
  const ms = quantile(rs.map((r) => r.ms).sort((a, b) => a - b), 0.5);
  const cell = appendix.latency_cost[t];
  check(`latency and cost ${t}`, `${cell.calls} ${cell.median_latency_ms} ${cell.cost_per_1000_usd.toFixed(4)}`, `${rs.length} ${ms} ${cost.toFixed(4)}`);
  check(`${t} row in appendix-d.md`, markdown.some((line) => line.startsWith(`| ${LABEL[t]} | ${rs.length} | ${ms} |`) && line.endsWith(`| ${cost.toFixed(2)} |`)), true);
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
check("zh-CN table covers every main model and both targets", appendix.cross_model_zh_cn.map((r) => r.model).join(","), [...summary.models, ...TARGETS].join(","));

// 7. The site: the lab's merge of appendix D (lib/addendum.mjs), and the exported items.json and
// replay.json cells against the raw records.
const { APPENDIX_ARMS, mergeAppendices } = await import(join(root, "lib/addendum.mjs"));
const arm = APPENDIX_ARMS.find((a) => a.id === "D");
const siteId = (t) => t + arm.suffix;
check("arm D run date matches every record", records.every((r) => r.ts.startsWith(arm.runDate)), true);
check("arm D targets", [...arm.targets].sort().join(","), [...TARGETS].sort().join(","));
const siteMerged = mergeAppendices(summary, { D: appendix });
for (const [key, cs] of [["status_index", summary.definitions.status_concepts], ["place_index", summary.definitions.place_concepts], ["pooled_index", concepts]]) {
  const table = indexTable(siteMerged, buildUnits(siteMerged, { concepts: cs }));
  for (const t of TARGETS) check(`site lab ${key} ${siteId(t)} vs appendix-d.json`, LANGS.map((l) => ci(table[siteId(t)][l])).join(" | "), LANGS.map((l) => ci(appendix[key][t][l])).join(" | "));
  const alone = indexTable(summary, buildUnits(summary, { concepts: cs }));
  check(`site lab ${key} main models unchanged by the merge`, JSON.stringify(summary.models.map((m) => table[m])) === JSON.stringify(summary.models.map((m) => alone[m])), true);
}
const siteCopy = join(root, "site/public/data/appendix-d.json");
if (existsSync(siteCopy)) check("site/public/data/appendix-d.json is a copy of results/appendix-d.json", readFileSync(siteCopy, "utf8") === readFileSync(join(root, "results/appendix-d.json"), "utf8"), true);

const items = JSON.parse(readFileSync(join(root, "site/public/data/items.json"), "utf8"));
const itemsArm = items.appendices.find((a) => a.id === "D");
check("items.json main models", items.models.join(","), summary.models.join(","));
check("items.json appendix D models", itemsArm.models.join(","), arm.targets.map(siteId).join(","));
check("items.json appendix D calls", itemsArm.calls, records.length);
check("items.json appendix D run date", itemsArm.run_date, appendix.run_date);
let seed = 20261001;
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
      check(`items.json ${record.item_id} ${siteId(t)} agreement vs appendix-d.json`, cell.agreement, appendix.claim_agreement[t][record.lang][record.concept][record.framing]);
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
