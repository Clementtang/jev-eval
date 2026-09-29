// Checks site/public/data/items.json against results/comparison.md and the raw JSONL records.
// Samples cells at random with a fixed seed; the variant cells are recomputed here without the
// export code. Usage: node scripts/export-site-data.mjs && node scripts/verify-items.mjs
import { readFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const root = new URL("..", import.meta.url).pathname;
const items = JSON.parse(readFileSync(join(root, "site/public/data/items.json"), "utf8"));
const dataset = JSON.parse(readFileSync(join(root, "data/dataset.json"), "utf8"));
const comparison = readFileSync(join(root, "results/comparison.md"), "utf8");
const runsDir = join(root, "results/runs");
const records = readdirSync(runsDir).filter((f) => f.endsWith(".jsonl"))
  .flatMap((f) => readFileSync(join(runsDir, f), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)))
  .filter((r) => r.ok && !r.refusal);

let seed = 20260928;
const random = () => ((seed = (seed * 1103515245 + 12345) % 2 ** 31) / 2 ** 31);
const pick = (xs) => xs[Math.floor(random() * xs.length)];
let failures = 0;
const check = (label, actual, expected) => {
  const ok = actual === expected;
  if (!ok) failures++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}: ${actual}${ok ? "" : `  (expected ${expected})`}`);
};

const covered = new Set(items.types.flatMap((t) => [...Object.values(t.text), ...Object.values(t.variants).flatMap((v) => Object.values(v))].map((x) => x.id)));
check("base item types", items.types.length, 139);
check("items covered", `${covered.size}/${dataset.length}`, `${dataset.length}/${dataset.length}`);
check("dataset ids all present", dataset.every((i) => covered.has(i.id)), true);

// Parse the two tables of comparison.md.
const table = (heading) => {
  const lines = comparison.split("\n");
  const start = lines.findIndex((l) => l.startsWith(heading));
  const rows = [];
  let header = null;
  for (const line of lines.slice(start + 1)) {
    if (line.startsWith("## ")) break;
    if (!line.startsWith("|") || line.startsWith("| ---")) continue;
    const cells = line.split("|").slice(1, -1).map((c) => c.trim());
    if (!header) header = cells; else rows.push(Object.fromEntries(cells.map((c, i) => [header[i], c])));
  }
  return { header, rows };
};
const f2 = (x) => x.toFixed(2);
const byConcept = (group, concept, framing, type, polarity) => items.types.find((t) => t.group === group && t.concept === concept && t.type === type && (framing ? t.framing === framing : true) && (polarity ? t.polarity === polarity : true));

const noul = table("## 陳述判斷立場值");
const modelCols = noul.header.slice(3);
for (let i = 0; i < 8; i++) {
  const row = pick(noul.rows);
  const col = pick(modelCols);
  const [model, lang] = col.split(" ");
  const type = byConcept(row["組"], row["概念"], row["框架"], "noul", pick(["pos", "neg"]));
  // compare.mjs computes (pos + (1 - neg)) / 2 and stats.mjs (pos + 1 - neg) / 2; on exact ties
  // such as 0.235 the two float orders round to different figures, so a half-cent gap is a match.
  const value = type.results.base[lang][model].agreement;
  const shown = Number(row[col].replace("*", ""));
  const tie = f2(value) !== row[col].replace("*", "") && Math.abs(value - shown) <= 0.005 + 1e-9;
  check(`comparison.md agreement ${row["概念"]} ${row["框架"]} ${col}${tie ? ` (exact ${value}, float tie)` : ""}`, tie ? shown.toFixed(2) : f2(value), row[col].replace("*", ""));
}

const choice = table("## 選擇題最常選的選項");
const choiceCols = choice.header.slice(2);
for (let i = 0; i < 6; i++) {
  const row = pick(choice.rows);
  const col = pick(choiceCols);
  const [model, lang] = col.split(" ");
  const [option, share] = row[col].split(" ");
  const cell = byConcept(row["組"], row["概念"], null, "choice").results.base[lang][model];
  check(`comparison.md choice ${row["概念"]} ${col} share of ${option}`, `${Math.round((100 * cell.counts[option]) / cell.n)}%`, share);
}

// Variant cells against the raw records, recomputed here without the site code.
const variantItems = dataset.filter((i) => (i.variant ?? "base") !== "base");
const models = items.models;
for (let i = 0; i < 6; i++) {
  const item = pick(variantItems);
  const model = pick(models);
  const rs = records.filter((r) => r.item_id === item.id && r.target === model);
  const type = items.types.find((t) => Object.values(t.variants[item.variant] ?? {}).some((x) => x.id === item.id));
  const cell = type.results[item.variant][item.lang][model];
  if (item.question.type === "choice") {
    const counts = {};
    for (const r of rs) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
    check(`raw ${item.id} ${model} counts`, JSON.stringify(Object.entries(cell.counts).sort()), JSON.stringify(Object.entries(counts).sort()));
  } else {
    const v = rs.map((r) => r.value);
    const m = v.reduce((a, b) => a + b, 0) / v.length;
    const s = Math.sqrt(v.reduce((a, x) => a + (x - m) ** 2, 0) / (v.length - 1));
    check(`raw ${item.id} ${model} n/mean/sd`, `${cell.n}/${cell.mean.toFixed(4)}/${cell.sd.toFixed(4)}`, `${v.length}/${m.toFixed(4)}/${s.toFixed(4)}`);
  }
}
console.log(failures ? `${failures} failures` : "all checks passed");
process.exitCode = failures ? 1 : 0;
