// Recomputes the sensitivity lab's numbers with lib/lab.mjs, the module the site runs, and compares
// them with results/stats.md (sections 1, 15 and 17) and results/summary.json.
// Usage: node scripts/verify-lab.mjs
import { readFileSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const { buildUnits, indexTable, jevComparisons, presets } = await import(join(root, "lib/lab.mjs"));
const summary = JSON.parse(readFileSync(join(root, "results/summary.json"), "utf8"));
const stats = readFileSync(join(root, "results/stats.md"), "utf8").split("\n");
const LANGS = summary.langs;
const f2 = (x) => x.toFixed(2);
let failures = 0;
let passes = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (ok) passes++; else failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : `  (expected ${expected})`}`);
};

const rowsAfter = (heading) => {
  const start = stats.findIndex((l) => l === heading);
  if (start < 0) throw new Error(`heading not found: ${heading}`);
  const rows = [];
  for (const line of stats.slice(start + 1)) {
    if (line.startsWith("#")) break;
    if (line.startsWith("| ") && !line.startsWith("| ---") && !line.startsWith("| 模型") && !line.startsWith("| 語言")) rows.push(line.split("|").slice(1, -1).map((c) => c.trim()));
  }
  return rows;
};
const ci = (c) => `${f2(c.estimate)} [${f2(c.low)}, ${f2(c.high)}]`;

// Section 1: main analysis, point estimate and interval for all six models.
const main = indexTable(summary, buildUnits(summary, { concepts: presets(summary).main }));
for (const [model, ...cells] of rowsAfter("## 1. 地位指數（95% bootstrap 信賴區間）")) {
  check(`section 1 ${model}`, LANGS.map((l) => ci(main[model][l])).join(" | "), cells.join(" | "));
}

// Section 17: point estimates and Jev-lower counts for each set.
const SETS = [
  ["全部 15 個主張（0.4 版以前的主分析）", { concepts: presets(summary).pooled }],
  ["原 7 個主張（事先定義，含兩個城市）", { concepts: presets(summary).original }],
  ["地位主張，不含規範題與國際組織題（10）", { concepts: presets(summary).noNormative }],
  ["地位主張，「一部分／一個省」合併（11）", { concepts: presets(summary).main, mergePartOf: true }],
  ["15 個主張，城市主張合併為一個單位（13）", { concepts: presets(summary).pooled, mergeCities: true }],
  ["15 個主張，城市合併、「一部分／一個省」合併（12）", { concepts: presets(summary).pooled, mergeCities: true, mergePartOf: true }],
];
const tables = {};
for (const [label, options] of SETS) {
  const units = buildUnits(summary, options);
  const table = (tables[label] = indexTable(summary, units));
  for (const [model, ...cells] of rowsAfter(`### 17a. ${label}：指數與中立檢定`)) {
    check(`17a ${label} ${model} (${units.length} units)`, LANGS.map((l) => f2(table[model][l].estimate)).join(" / "), cells.map((c) => c.split("（")[0]).join(" / "));
  }
  const comparisons = jevComparisons(summary, units);
  const rows = rowsAfter(`### 17b. ${label}：Jev − 其他模型`);
  check(`17b ${label} Jev-lower counts (15 cells)`, rows.map(([l, m]) => `${comparisons[m][l].jevLower}/${comparisons[m][l].n}`).join(" "), rows.map((r) => r[3]).join(" "));
  check(`17b ${label} mean differences (15 cells)`, rows.map(([l, m]) => f2(comparisons[m][l].diff)).join(" "), rows.map((r) => r[2]).join(" "));
}

// stats.md prints no intervals for section 17; summary.json carries the pooled fifteen-claim
// interval computed by stats.mjs from the raw records, an independent path to the same numbers.
const pooled = tables[SETS[0][0]];
for (const model of summary.models) {
  check(`pooled interval vs summary.json ${model}`, LANGS.map((l) => ci(pooled[model][l])).join(" | "), LANGS.map((l) => ci(summary.pooled_index[model][l])).join(" | "));
}
// The same for the place index (three city claims).
const place = indexTable(summary, buildUnits(summary, { concepts: summary.definitions.place_concepts }));
for (const model of summary.models) {
  check(`place interval vs summary.json ${model}`, LANGS.map((l) => ci(place[model][l])).join(" | "), LANGS.map((l) => ci(summary.place_index[model][l])).join(" | "));
}
// f1-only framing against stats.md section 15 (主分析／只 f1／排除不穩定).
const f1 = indexTable(summary, buildUnits(summary, { concepts: presets(summary).main }), "f1");
for (const [model, ...cells] of rowsAfter("## 15. 敏感度分析")) {
  check(`section 15 f1 only ${model}`, LANGS.map((l) => f2(f1[model][l].estimate)).join(" / "), cells.map((c) => c.split("／")[1]).join(" / "));
}
console.log(failures ? `${failures} failures, ${passes} passed` : `all ${passes} checks passed`);
process.exitCode = failures ? 1 : 0;
