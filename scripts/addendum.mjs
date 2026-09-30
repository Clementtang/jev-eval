// Addendum: Claude Sonnet 5.5 (released after the main runs) against a same-day rerun of Claude
// Sonnet 5, plus Sonnet 5.5 at its default high effort on the status claims. Reads
// results/runs-addendum/ only and reuses the definitions in results/summary.json and the index code in
// lib/lab.mjs, so the numbers are computed exactly as in the main analysis. Writes results/addendum.md
// and results/addendum.json (the claim table and indices the site serves as /data/addendum.json).
// Usage: node scripts/addendum.mjs [--check]   (--check first rebuilds the main summary's claim table)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { buildUnits, indexTable } from "../lib/lab.mjs";
import { mean, quantile, signFlipTest } from "../lib/stats.mjs";
import { PRICING } from "../lib/targets.mjs";

const ROOT = new URL("../results/", import.meta.url);
const LANGS = ["zh-TW", "zh-CN", "en"];
// Same sets as scripts/stats.mjs sections 7 and 13.
const CHINA_INCLUSIVE = new Set(["x_paren_parent", "x_comma_parent", "parent", "taiwan_paren_china", "taiwan_comma_china",
  "taiwan_province_of_china", "china", "city_taiwan_china", "city_china", "chinese", "taiwanese_chinese"]);
const PRACTICAL = (c) => /^(country-field|city-format)-/.test(c) || ["dropdown-label", "phone-country", "profile-nationality"].includes(c);
// Read from the dataset so a concept added to group B cannot be left out of the forced-choice tables.
const B_CONCEPTS = [...new Set(JSON.parse(readFileSync(new URL("../data/dataset.json", import.meta.url), "utf8"))
  .filter((i) => i.group === "B").map((i) => i.concept))].sort();
const LABEL = {
  "claude-sonnet-5": "Claude Sonnet 5 (same-day rerun)",
  "claude-sonnet-5-5": "Claude Sonnet 5.5, effort low",
  "claude-sonnet-5-5-high": "Claude Sonnet 5.5, effort high",
  "claude-sonnet-5@main": "Claude Sonnet 5 (main runs, 25 September)",
};

const readDir = (dir) => readdirSync(new URL(`${dir}/`, ROOT)).filter((f) => f.endsWith(".jsonl"))
  .flatMap((f) => readFileSync(new URL(`${dir}/${f}`, ROOT), "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l)))
  .filter((r) => r.ok && !r.refusal);
const variant = (r) => r.variant ?? "base";

// Agreement per claim and framing, as stanceOf in scripts/stats.mjs: (P(pos) + 1 - P(neg)) / 2.
function claimAgreement(records, targets, concepts, v = "base") {
  const out = {};
  for (const t of targets) for (const l of LANGS) for (const c of concepts) {
    const rs = records.filter((r) => r.target === t && r.lang === l && r.concept === c && variant(r) === v);
    for (const f of [...new Set(rs.map((r) => r.framing))]) {
      const pos = mean(rs.filter((r) => r.framing === f && r.polarity === "pos").map((r) => r.value));
      const neg = mean(rs.filter((r) => r.framing === f && r.polarity === "neg").map((r) => r.value));
      if (pos == null || neg == null) continue;
      ((out[t] ??= {})[l] ??= {})[c] ??= {};
      out[t][l][c][f] = (pos + 1 - neg) / 2;
    }
  }
  return out;
}

const main = JSON.parse(readFileSync(new URL("summary.json", ROOT), "utf8"));
const concepts = Object.keys(main.definitions.orientation);

if (process.argv.includes("--check")) {
  const rebuilt = claimAgreement(readDir("runs"), ["claude-sonnet-5"], concepts)["claude-sonnet-5"];
  const expected = main.claim_agreement["claude-sonnet-5"];
  let worst = 0;
  for (const l of LANGS) for (const c of concepts) for (const [f, v] of Object.entries(expected[l][c])) worst = Math.max(worst, Math.abs(v - rebuilt[l][c][f]));
  if (worst > 1e-12) throw new Error(`claim agreement rebuild differs from results/summary.json by ${worst}`);
  console.log("check: claim agreement for claude-sonnet-5 matches results/summary.json");
}

const records = readDir("runs-addendum");
const targets = ["claude-sonnet-5", "claude-sonnet-5-5", "claude-sonnet-5-5-high"].filter((t) => records.some((r) => r.target === t));
const summary = {
  ...main,
  models: [...targets, "claude-sonnet-5@main"],
  claim_agreement: { ...claimAgreement(records, targets, concepts), "claude-sonnet-5@main": main.claim_agreement["claude-sonnet-5"] },
};
const f2 = (x) => (x == null ? "-" : x.toFixed(2));
const ci = (x) => `${f2(x.estimate)} [${f2(x.low)}, ${f2(x.high)}]`;
const generatedAt = new Date().toISOString();
const out = ["# Addendum: Claude Sonnet 5.5", "",
  `Generated ${generatedAt} from results/runs-addendum/ (${records.length} successful calls). Definitions, seeds and index code are those of the main analysis.`, ""];

const runDates = Object.fromEntries(targets.map((t) => {
  const ts = records.filter((r) => r.target === t).map((r) => r.ts).sort();
  return [t, `${ts[0]} to ${ts.at(-1)}`];
}));
out.push("## Runs", "", "| Target | Model ID | Calls | Time span (UTC) |", "| --- | --- | --- | --- |",
  ...targets.map((t) => `| ${LABEL[t]} | ${records.find((r) => r.target === t).model} | ${records.filter((r) => r.target === t).length} | ${runDates[t]} |`), "");

const sets = [["Status index (12 status claims, main analysis)", main.definitions.status_concepts, "status_index"],
  ["Place index (3 city claims)", main.definitions.place_concepts, "place_index"],
  ["Pooled index (15 claims)", concepts, "pooled_index"]];
const indices = {};
for (const [title, cs, key] of sets) {
  const table = (indices[key] = indexTable(summary, buildUnits(summary, { concepts: cs })));
  out.push(`## ${title}`, "", "95% cluster bootstrap intervals over claims. The effort-high arm covers the status claims only.", "",
    `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
    ...summary.models.map((m) => `| ${LABEL[m]} | ${LANGS.map((l) => (table[m][l].units ? ci(table[m][l]) : "-")).join(" | ")} |`), "");
}

// Same-day paired comparison on the twelve status claims, exact sign-flip test as in stats.mjs.
// One family per question, reported uncorrected; the addendum is exploratory.
const oriented = (agreement, t, l, c, framings = null) => {
  const byF = agreement[t]?.[l]?.[c];
  if (!byF) return null;
  const vals = (framings ?? Object.keys(byF)).map((f) => byF[f]).filter((x) => x != null);
  if (!vals.length) return null;
  const a = mean(vals);
  return main.definitions.orientation[c] > 0 ? a : 1 - a;
};
const statusClaims = main.definitions.status_concepts;
out.push("## Claude Sonnet 5.5 (low) minus same-day Claude Sonnet 5, status claims", "",
  "Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.", "",
  "| Language | Mean difference | Claims where Sonnet 5.5 is higher | Exact p |", "| --- | --- | --- | --- |");
for (const l of LANGS) {
  const d = statusClaims.map((c) => {
    const a = oriented(summary.claim_agreement, "claude-sonnet-5-5", l, c);
    const b = oriented(summary.claim_agreement, "claude-sonnet-5", l, c);
    return a == null || b == null ? null : a - b;
  }).filter((x) => x != null);
  out.push(`| ${l} | ${f2(mean(d))} | ${d.filter((x) => x > 0).length}/${d.length} | ${signFlipTest(d).p.toFixed(3)} |`);
}
out.push("");

out.push("## Place claims by city (agreement with the claim as written)", "", `| Model | Claim | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`);
for (const t of ["claude-sonnet-5", "claude-sonnet-5-5"]) for (const c of main.definitions.place_concepts) {
  out.push(`| ${LABEL[t]} | ${c} | ${LANGS.map((l) => f2(summary.claim_agreement[t]?.[l]?.[c]?.f1)).join(" | ")} |`);
}
out.push("");

// Asker variants exist in the f1 framing only, as in stats.mjs section 9.
const askerAgreement = Object.fromEntries(["asker-tw", "asker-cn"].map((v) => [v, claimAgreement(records, ["claude-sonnet-5", "claude-sonnet-5-5"], statusClaims, v)]));
out.push("## Stated asker, status index (f1 framing)", "", "| Model | Language | Asker in Taipei | Asker in Beijing | Beijing minus Taipei |", "| --- | --- | --- | --- | --- |");
for (const t of ["claude-sonnet-5", "claude-sonnet-5-5"]) for (const l of LANGS) {
  const idx = (v) => mean(statusClaims.map((c) => oriented(askerAgreement[v], t, l, c, ["f1"])).filter((x) => x != null));
  const tw = idx("asker-tw");
  const cn = idx("asker-cn");
  out.push(`| ${LABEL[t]} | ${l} | ${f2(tw)} | ${f2(cn)} | ${f2(cn - tw)} |`);
}
out.push("");

const labelRate = (t, l, v = "base") => {
  const rs = records.filter((r) => r.target === t && r.lang === l && variant(r) === v && r.subject === "Taiwan" && r.question_type === "choice" && PRACTICAL(r.concept));
  if (!rs.length) return "-";
  const hits = rs.filter((r) => CHINA_INCLUSIVE.has(r.choice)).length;
  return `${Math.round((hits / rs.length) * 100)}% (${hits}/${rs.length})`;
};
out.push("## Labels listing Taiwan under \"China\" (group C, original option order)", "",
  `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...targets.map((t) => `| ${LABEL[t]} | ${LANGS.map((l) => labelRate(t, l)).join(" | ")} |`),
  `| ${LABEL["claude-sonnet-5@main"]} | ${LANGS.map((l) => `${Math.round(main.practical_labels["claude-sonnet-5"][l].estimate * 100)}%`).join(" | ")} |`, "");

out.push("### Other conditions", "", "Order variants cover all twelve scenarios; asker variants cover four.", "",
  "| Model | Condition | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |",
  ...["claude-sonnet-5", "claude-sonnet-5-5"].flatMap((t) => ["order-rev", "order-shuf", "asker-tw", "asker-cn"].map((v) => `| ${LABEL[t]} | ${v} | ${LANGS.map((l) => labelRate(t, l, v)).join(" | ")} |`)), "");

const CONDITIONS = ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"];
const choiceCounts = (t, c, l, v) => {
  const counts = {};
  for (const r of records.filter((x) => x.target === t && x.concept === c && x.lang === l && variant(x) === v)) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
  return counts;
};
const top = (t, c, l, v) => {
  const counts = choiceCounts(t, c, l, v);
  const total = Object.values(counts).reduce((a, b) => a + b, 0);
  if (!total) return "-";
  const [choice, n] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  return `${choice} ${n}/${total}`;
};
const forcedTargets = targets.filter((x) => x !== "claude-sonnet-5-5-high");
const forcedChoice = Object.fromEntries(B_CONCEPTS.map((c) => [c, Object.fromEntries(forcedTargets.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l,
  Object.fromEntries(CONDITIONS.map((v) => [v, choiceCounts(t, c, l, v)]))]))]))]));
out.push("## Forced choice (group B), most frequent option", "", "Conditions: original order, reversed, shuffled, asker in Taipei, asker in Beijing.", "");
for (const c of B_CONCEPTS) {
  out.push(`### ${c}`, "", "| Model | Language | base | order-rev | order-shuf | asker-tw | asker-cn |", "| --- | --- | --- | --- | --- | --- | --- |");
  for (const t of forcedTargets) for (const l of LANGS) {
    out.push(`| ${LABEL[t]} | ${l} | ${CONDITIONS.map((v) => top(t, c, l, v)).join(" | ")} |`);
  }
  out.push("");
}

// Same calls only: the effort-high arm covers the base items of the status claims, so the low arm is
// restricted to the same item ids and repetitions.
const callKey = (r) => `${r.item_id}#${r.rep}`;
const highCalls = records.filter((r) => r.target === "claude-sonnet-5-5-high" && variant(r) === "base");
const effortKeys = new Set(highCalls.map(callKey));
const effortRows = ["claude-sonnet-5-5-high", "claude-sonnet-5-5"].filter((t) => targets.includes(t)).map((t) => {
  const rs = records.filter((r) => r.target === t && variant(r) === "base" && effortKeys.has(callKey(r)));
  const outTokens = rs.map((r) => r.usage?.output_tokens ?? 0).sort((a, b) => a - b);
  const ms = rs.map((r) => r.ms).sort((a, b) => a - b);
  const input = mean(rs.map((r) => r.usage?.input_tokens ?? 0));
  const [pi, po] = PRICING[t];
  return { target: t, calls: rs.length, mean_output_tokens: mean(outTokens), median_output_tokens: quantile(outTokens, 0.5),
    median_latency_ms: quantile(ms, 0.5), cost_per_1000_usd: ((input * pi + mean(outTokens) * po) / 1e6) * 1000 };
});
out.push("## Reasoning effort on the same calls (Sonnet 5.5, status claims, base items)", "",
  `Restricted to the ${effortKeys.size} item and repetition pairs the effort-high arm covers.`, "",
  "| Model | Calls | Mean output tokens | Median output tokens | Latency p50 ms | Cost per 1,000 calls (USD) |", "| --- | --- | --- | --- | --- | --- |",
  ...effortRows.map((e) => `| ${LABEL[e.target]} | ${e.calls} | ${e.mean_output_tokens.toFixed(1)} | ${e.median_output_tokens} | ${e.median_latency_ms} | ${e.cost_per_1000_usd.toFixed(2)} |`), "");

out.push("## Latency and cost (base items)", "", "| Model | Calls | Latency p50 ms | Mean input | Mean output | Cost per 1,000 calls (USD) |", "| --- | --- | --- | --- | --- | --- |");
for (const t of targets) {
  const rs = records.filter((r) => r.target === t && variant(r) === "base");
  const ms = rs.map((r) => r.ms).sort((a, b) => a - b);
  const input = mean(rs.map((r) => r.usage?.input_tokens ?? 0));
  const output = mean(rs.map((r) => r.usage?.output_tokens ?? 0));
  const [pi, po] = PRICING[t];
  out.push(`| ${LABEL[t]} | ${rs.length} | ${quantile(ms, 0.5)} | ${Math.round(input)} | ${Math.round(output)} | ${(((input * pi + output * po) / 1e6) * 1000).toFixed(2)} |`);
}
out.push("");

writeFileSync(new URL("addendum.md", ROOT), out.join("\n") + "\n");
console.log(`wrote results/addendum.md (${records.length} calls, targets ${targets.join(", ")})`);

// Keys are the target ids of results/runs-addendum/, so claude-sonnet-5 here is the 29 September
// rerun; the main runs stay in results/summary.json only.
const indexJson = (table) => Object.fromEntries(targets.map((t) => [t, Object.fromEntries(LANGS.map((l) => {
  const cell = table[t][l];
  return [l, cell.units ? { estimate: cell.estimate, low: cell.low, high: cell.high, units: cell.units } : null];
}))]));
const TARGET_INFO = {
  "claude-sonnet-5-5": { effort: "low", coverage: "all 957 items" },
  "claude-sonnet-5": { effort: "low", coverage: "all 957 items" },
  "claude-sonnet-5-5-high": { effort: "high", coverage: "base items of the twelve status claims only" },
};
const json = {
  schema: {
    generated_at: "ISO 8601 time this file and results/addendum.md were written.",
    run_date: "UTC date of every addendum call. The main analysis (results/summary.json) ran on 25 September 2026 and is not changed by this file.",
    calls: "Number of successful, non-refused addendum calls analyzed.",
    langs: "Item languages: zh-TW Traditional Chinese, zh-CN Simplified Chinese, en English.",
    models: "Target ids as in results/runs-addendum/*.jsonl. claude-sonnet-5 is the same-day rerun, not the main-analysis run.",
    targets: "target -> { label, model, effort, coverage, calls, first_call, last_call }.",
    "status_index, place_index, pooled_index": "target -> lang -> { estimate, low, high, units } or null when the target has no claim of that set. Same definitions, seeds and code (lib/lab.mjs) as results/summary.json; the pooled index of the effort-high arm covers its status claims only.",
    reasoning_effort: "target -> { calls, mean_output_tokens, median_output_tokens, median_latency_ms, cost_per_1000_usd } over the base items both effort arms ran (the twelve status claims); cost uses PRICING in lib/targets.mjs and mean input and output tokens, as the latency table.",
    forced_choice: "claim (every group B concept) -> target (low-effort arms only) -> lang -> condition (base, order-rev, order-shuf, asker-tw, asker-cn) -> { choice, count, calls } for the most frequent option, plus counts of every option.",
    claim_agreement: "Same format as claim_agreement in results/summary.json: target -> lang -> claim -> framing -> agreement, (P(positive) + 1 - P(negated)) / 2 on base items, not oriented. Unrounded, so any index can be recomputed exactly.",
  },
  generated_at: generatedAt,
  run_date: "2026-09-29",
  calls: records.length,
  source: "results/runs-addendum/*.jsonl in https://github.com/Clementtang/jev-eval; tables in results/addendum.md",
  langs: LANGS,
  models: targets,
  targets: Object.fromEntries(targets.map((t) => {
    const rs = records.filter((r) => r.target === t);
    const ts = rs.map((r) => r.ts).sort();
    return [t, { label: LABEL[t], model: rs[0].model, ...TARGET_INFO[t], calls: rs.length, first_call: ts[0], last_call: ts.at(-1) }];
  })),
  status_index: indexJson(indices.status_index),
  place_index: indexJson(indices.place_index),
  pooled_index: indexJson(indices.pooled_index),
  claim_agreement: Object.fromEntries(targets.map((t) => [t, summary.claim_agreement[t]])),
  reasoning_effort: Object.fromEntries(effortRows.map(({ target, ...cells }) => [target, cells])),
  forced_choice: forcedChoice,
};
if (new Set(records.map((r) => r.ts.slice(0, 10))).size !== 1 || records[0].ts.slice(0, 10) !== json.run_date) {
  throw new Error(`addendum calls are expected on ${json.run_date} only`);
}
writeFileSync(new URL("addendum.json", ROOT), JSON.stringify(json, null, 2) + "\n");
console.log("wrote results/addendum.json");
