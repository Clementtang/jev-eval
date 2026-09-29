// Checks the site's addendum data against results/addendum.md and the raw records in
// results/runs-addendum/: the indices the lab computes with lib/lab.mjs, the claim table in
// results/addendum.json (served as /data/addendum.json) and the addendum cells of items.json.
// Usage: node scripts/export-site-data.mjs && node scripts/verify-addendum.mjs
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const { buildUnits, indexTable, jevComparisons } = await import(join(root, "lib/lab.mjs"));
const { ADDENDUM_SUFFIX, ADDENDUM_TARGETS, mergeAddendum } = await import(join(root, "lib/addendum.mjs"));
const summary = JSON.parse(readFileSync(join(root, "results/summary.json"), "utf8"));
const addendumPath = join(root, "results/addendum.json");
const addendum = JSON.parse(readFileSync(addendumPath, "utf8"));
const markdown = readFileSync(join(root, "results/addendum.md"), "utf8").split("\n");
const items = JSON.parse(readFileSync(join(root, "site/public/data/items.json"), "utf8"));
const runsDir = join(root, "results/runs-addendum");
const records = readdirSync(runsDir).filter((f) => f.endsWith(".jsonl"))
  .flatMap((f) => readFileSync(join(runsDir, f), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)))
  .filter((r) => r.ok && !r.refusal);
const LANGS = summary.langs;
const f2 = (x) => x.toFixed(2);
const ci = (c) => (c && c.units ? `${f2(c.estimate)} [${f2(c.low)}, ${f2(c.high)}]` : "-");
let failures = 0;
let passes = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (ok) passes++; else failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : `  (expected ${expected})`}`);
};

// Figures quoted in the task and in results/addendum.md, typed here so a silent change in either
// the data or the computation stops the deploy.
const EXPECTED_STATUS = {
  "claude-sonnet-5-5": "0.76 [0.69, 0.83] | 0.66 [0.56, 0.75] | 0.80 [0.73, 0.87]",
  "claude-sonnet-5": "0.78 [0.68, 0.87] | 0.58 [0.46, 0.70] | 0.76 [0.66, 0.85]",
  "claude-sonnet-5-5-high": "0.79 [0.73, 0.86] | 0.71 [0.63, 0.79] | 0.81 [0.75, 0.87]",
};
const LABEL = {
  "claude-sonnet-5": "Claude Sonnet 5 (same-day rerun)",
  "claude-sonnet-5-5": "Claude Sonnet 5.5, effort low",
  "claude-sonnet-5-5-high": "Claude Sonnet 5.5, effort high",
};

// Rows of a results/addendum.md table under a heading, keyed by the model label.
const tableAfter = (heading) => {
  const start = markdown.findIndex((l) => l === heading);
  if (start < 0) throw new Error(`heading not found in results/addendum.md: ${heading}`);
  const rows = {};
  for (const line of markdown.slice(start + 1)) {
    if (line.startsWith("#")) break;
    if (!line.startsWith("| ") || line.startsWith("| ---") || line.startsWith("| Model")) continue;
    const [label, ...cells] = line.split("|").slice(1, -1).map((c) => c.trim());
    rows[label] = cells.join(" | ");
  }
  return rows;
};

// 1. The lab's computation on the merged data against results/addendum.md and the typed figures.
const merged = mergeAddendum(summary, addendum);
const SETS = [
  ["## Status index (12 status claims, main analysis)", summary.definitions.status_concepts, "status_index"],
  ["## Place index (3 city claims)", summary.definitions.place_concepts, "place_index"],
  ["## Pooled index (15 claims)", Object.keys(summary.definitions.orientation), "pooled_index"],
];
for (const [heading, concepts, key] of SETS) {
  const units = buildUnits(merged, { concepts });
  const table = indexTable(merged, units);
  const rows = tableAfter(heading);
  for (const t of ADDENDUM_TARGETS) {
    const cells = table[t + ADDENDUM_SUFFIX];
    const shown = LANGS.map((l) => ci(cells[l])).join(" | ");
    check(`${key} ${t} lab vs addendum.md`, shown, rows[LABEL[t]]);
    check(`${key} ${t} lab vs addendum.json`, shown, LANGS.map((l) => ci(addendum[key][t][l])).join(" | "));
    if (key === "status_index") check(`${key} ${t} typed figures`, shown, EXPECTED_STATUS[t]);
  }
  // Adding the addendum models must not move any main-analysis number.
  const alone = indexTable(summary, buildUnits(summary, { concepts }));
  check(`${key} main models unchanged by the merge`, JSON.stringify(summary.models.map((m) => table[m])) === JSON.stringify(summary.models.map((m) => alone[m])), true);
}
const comparisons = jevComparisons(summary, buildUnits(summary, { concepts: summary.definitions.status_concepts }));
check("Jev comparisons cover main models only", Object.keys(comparisons).join(","), summary.models.filter((m) => m !== "jev").join(","));

// 2. addendum.json claim agreement recomputed from the raw records, without scripts/addendum.mjs.
let worst = 0;
let cells = 0;
for (const t of ADDENDUM_TARGETS) {
  const rs = records.filter((r) => r.target === t && (r.variant ?? "base") === "base" && r.question_type === "noul");
  const groups = new Map();
  for (const r of rs) {
    const key = `${r.lang}|${r.concept}|${r.framing}`;
    if (!groups.has(key)) groups.set(key, { pos: [], neg: [] });
    groups.get(key)[r.polarity].push(r.value);
  }
  for (const [key, { pos, neg }] of groups) {
    const [l, c, f] = key.split("|");
    if (!(c in summary.definitions.orientation) || !pos.length || !neg.length) continue;
    const avg = (xs) => xs.reduce((a, b) => a + b, 0) / xs.length;
    const expected = (avg(pos) + 1 - avg(neg)) / 2;
    const actual = addendum.claim_agreement[t]?.[l]?.[c]?.[f];
    worst = Math.max(worst, actual == null ? Infinity : Math.abs(actual - expected));
    cells++;
  }
}
check(`addendum.json claim agreement vs raw records (${cells} cells, max error below 1e-12)`, worst < 1e-12, true);
check("addendum.json targets", addendum.models.slice().sort().join(","), ADDENDUM_TARGETS.slice().sort().join(","));
check("addendum.json run date matches every record", records.every((r) => r.ts.startsWith(addendum.run_date)), true);
const highConcepts = new Set(Object.values(addendum.claim_agreement["claude-sonnet-5-5-high"]).flatMap((byLang) => Object.keys(byLang)));
check("effort high covers the status claims only", [...highConcepts].sort().join(","), [...summary.definitions.status_concepts].sort().join(","));
const sitePath = join(root, "site/public/data/addendum.json");
if (existsSync(sitePath)) check("site/public/data/addendum.json is a copy of results/addendum.json", readFileSync(sitePath, "utf8") === readFileSync(addendumPath, "utf8"), true);

// 3. items.json: main models unchanged, addendum cells against the raw records.
check("items.json main models", items.models.join(","), summary.models.join(","));
check("items.json addendum models", items.addendum.models.join(","), ADDENDUM_TARGETS.map((t) => t + ADDENDUM_SUFFIX).join(","));
check("items.json addendum calls", items.addendum.calls, records.length);
let seed = 20260929;
const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = (xs) => xs[Math.floor(random() * xs.length)];
const typeOf = (id) => items.types.find((t) => [...Object.values(t.text), ...Object.values(t.variants).flatMap((v) => Object.values(v))].some((x) => x.id === id));
for (let i = 0; i < 12; i++) {
  const target = ADDENDUM_TARGETS[i % ADDENDUM_TARGETS.length];
  const record = pick(records.filter((r) => r.target === target));
  const rs = records.filter((r) => r.item_id === record.item_id && r.target === target);
  const type = typeOf(record.item_id);
  const cell = type.results[record.variant ?? "base"][record.lang][target + ADDENDUM_SUFFIX];
  if (record.question_type === "choice") {
    const counts = {};
    for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
    check(`items.json ${record.item_id} ${target} counts`, JSON.stringify(Object.entries(cell.counts).sort()), JSON.stringify(Object.entries(counts).sort()));
  } else {
    const v = rs.map((r) => r.value);
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const s = Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / (v.length - 1));
    check(`items.json ${record.item_id} ${target} n/mean/sd`, `${cell.n}/${cell.mean.toFixed(4)}/${cell.sd.toFixed(4)}`, `${v.length}/${m.toFixed(4)}/${s.toFixed(4)}`);
    if ((record.variant ?? "base") === "base" && record.concept in summary.definitions.orientation) {
      check(`items.json ${record.item_id} ${target} agreement vs addendum.json`, cell.agreement, addendum.claim_agreement[target][record.lang][record.concept][record.framing]);
    }
  }
}
const highCells = items.types.filter((t) => Object.values(t.results).some((ls) => Object.values(ls).some((c) => c[`claude-sonnet-5-5-high${ADDENDUM_SUFFIX}`])));
check("items.json effort-high cells only on status claims", highCells.every((t) => t.index === "status"), true);

console.log(failures ? `${failures} failures, ${passes} passed` : `all ${passes} checks passed`);
process.exitCode = failures ? 1 : 0;
