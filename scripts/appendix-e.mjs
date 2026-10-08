// Appendix E: Claude Haiku 5.5 (released after the main runs) against a same-day rerun of Claude Haiku
// 4.5. Haiku 5.5 runs at effort low like the other Claude models of the main analysis, and at its API
// default of medium on the base items of the twelve status claims; Haiku 4.5 takes no effort
// parameter, as in the main runs. Reads results/runs-appendixe/ (and results/runs/ for the bridge to
// the main Claude Haiku 4.5 run), reuses the definitions in results/summary.json and the code shared
// with appendices C and D (lib/arm-analysis.mjs, lib/lab.mjs), and writes results/appendix-e.md and
// results/appendix-e.json.
// Usage: node scripts/appendix-e.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { B_CONCEPTS, CONDITIONS, LANGS, PRACTICAL, PRC_POSITION, RESULTS_ROOT as ROOT, CHINA_INCLUSIVE, choiceCounts, ci, claimAgreement, f2,
  labelCounts, labelRate, latencyCost, modal, orientedScore, pairedDiffs, PLACE_CONSISTENCY_HEADER, placeConsistency, placeConsistencyRows, readArm, readJsonl, readSummary, showModal, variant } from "../lib/arm-analysis.mjs";
import { buildUnits, indexTable } from "../lib/lab.mjs";
import { bootstrap, mean, quantile, signFlipTest } from "../lib/stats.mjs";
import { PRICING } from "../lib/targets.mjs";

const ARM_DIR = "runs-appendixe";
const RUN_DATE = "2026-10-08";
const NEW = "claude-haiku-5-5";
const MEDIUM = "claude-haiku-5-5-medium";
const RERUN = "claude-haiku-4-5";
const MAIN = "claude-haiku-4-5@main";
// Display order of the runs table and the JSON: the rerun first, as appendix D.
const TARGETS = [RERUN, NEW, MEDIUM];
// Targets that ran every item; the medium arm ran the base items of the status claims only.
const FULL_TARGETS = [RERUN, NEW];
const REPS = 5;
const LABEL = {
  [RERUN]: "Claude Haiku 4.5 (same-day rerun)",
  [NEW]: "Claude Haiku 5.5, effort low",
  [MEDIUM]: "Claude Haiku 5.5, effort medium",
  [MAIN]: "Claude Haiku 4.5 (main runs, 25 September)",
};
const TARGET_INFO = {
  [RERUN]: { effort: "none (the model takes no effort parameter, as in the main runs)", coverage: "all 957 items" },
  [NEW]: { effort: "low", coverage: "all 957 items" },
  [MEDIUM]: { effort: "medium (API default)", coverage: "base items of the twelve status claims only" },
};
const MAIN_LABEL = { jev: "Jev", "claude-haiku-4-5": "Claude Haiku 4.5", "claude-sonnet-5": "Claude Sonnet 5", "grok-4-7": "Grok 4.7",
  "luna-6": "GPT-6 Luna", "sol-6": "GPT-6 Sol" };
const MAIN_RUN_DATE = "2026-09-25";

const main = readSummary();
const { orientation, status_concepts: statusClaims, place_concepts: placeClaims } = main.definitions;
const concepts = Object.keys(orientation);
const dataset = JSON.parse(readFileSync(new URL("../data/dataset.json", ROOT), "utf8"));
const rawRecords = readdirSync(new URL(`${ARM_DIR}/`, ROOT)).filter((f) => f.endsWith(".jsonl")).flatMap((f) => readJsonl(new URL(`${ARM_DIR}/${f}`, ROOT)));
const records = readArm(ARM_DIR);
const mainRecords = readArm("runs").filter((r) => r.target === RERUN);

// The bridge compares against the main run's raw records, so they must reproduce results/summary.json.
const rebuilt = claimAgreement(mainRecords, [RERUN], concepts)[RERUN];
let worst = 0;
for (const l of LANGS) for (const c of concepts) for (const [f, v] of Object.entries(main.claim_agreement[RERUN][l][c])) worst = Math.max(worst, Math.abs(v - rebuilt[l][c][f]));
if (worst > 1e-12) throw new Error(`claim agreement rebuild of ${RERUN} differs from results/summary.json by ${worst}`);

const summary = {
  ...main,
  models: [...TARGETS, MAIN],
  claim_agreement: { ...claimAgreement(records, TARGETS, concepts), [MAIN]: main.claim_agreement[RERUN] },
};
const generatedAt = new Date().toISOString();
const out = ["# Appendix E: Claude Haiku 5.5", "",
  `Generated ${generatedAt} from results/${ARM_DIR}/ (${records.length} successful calls) and, for the bridge, the Claude Haiku 4.5 records of results/runs/. Definitions, seeds and index code are those of the main analysis.`, ""];

// ---------- runs and record completeness ----------
const callKey = (r) => `${r.item_id}#${r.rep}`;
const statusBaseItems = dataset.filter((i) => i.group === "A" && !i.variant && statusClaims.includes(i.concept));
const expectedItems = { [RERUN]: dataset, [NEW]: dataset, [MEDIUM]: statusBaseItems };
const runInfo = Object.fromEntries(TARGETS.map((t) => {
  const rs = records.filter((r) => r.target === t);
  const ts = rs.map((r) => r.ts).sort();
  // The longest pause between consecutive calls shows whether the batch ran without interruption.
  const longestGapMs = Math.max(0, ...ts.slice(1).map((x, i) => Date.parse(x) - Date.parse(ts[i])));
  const keys = new Set(rs.map(callKey));
  const missing = expectedItems[t].flatMap((i) => Array.from({ length: REPS }, (_, k) => `${i.id}#${k + 1}`)).filter((k) => !keys.has(k)).length;
  return [t, {
    label: LABEL[t], model: rs[0].model, ...TARGET_INFO[t], calls: rs.length, expected_calls: expectedItems[t].length * REPS,
    missing_calls: missing, first_call: ts[0], last_call: ts.at(-1), longest_gap_s: Math.round(longestGapMs / 1000),
  }];
}));
const duplicates = records.length - new Set(records.map((r) => `${r.target}|${callKey(r)}`)).size;
const integrity = {
  records: rawRecords.length,
  failed: rawRecords.filter((r) => !r.ok).length,
  refusals: rawRecords.filter((r) => r.refusal).length,
  without_value_or_choice: records.filter((r) => (r.question_type === "choice" ? r.choice : r.value) == null).length,
  duplicate_pairs: duplicates,
};
out.push("## Runs", "", "All three targets ran in one batch on 8 October 2026 (UTC) without interruption or failed calls. The medium arm started after the other two finished.", "",
  "| Target | Model ID | Effort | Calls | Expected | Missing | First call (UTC) | Last call (UTC) | Longest gap between calls (s) |",
  "| --- | --- | --- | --- | --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => {
    const x = runInfo[t];
    return `| ${LABEL[t]} | ${x.model} | ${t === RERUN ? "none" : x.effort} | ${x.calls} | ${x.expected_calls} | ${x.missing_calls} | ${x.first_call} | ${x.last_call} | ${x.longest_gap_s} |`;
  }), "",
  `Records in results/${ARM_DIR}/: ${integrity.records}; failed (ok false) ${integrity.failed}; refusals ${integrity.refusals}; successful calls without a value or choice ${integrity.without_value_or_choice}; duplicate item and repetition pairs ${integrity.duplicate_pairs}. Expected calls are every item of the target's coverage times ${REPS} repetitions.`, "");

// ---------- indices ----------
const SETS = [["Status index (12 status claims, main analysis)", statusClaims, "status_index"],
  ["Place index (3 city claims)", placeClaims, "place_index"],
  ["Pooled index (15 claims)", concepts, "pooled_index"]];
const indices = Object.fromEntries(SETS.map(([, cs, key]) => [key, indexTable(summary, buildUnits(summary, { concepts: cs }))]));
// Each model's bootstrap depends only on its own scores, so the main row must equal results/summary.json.
for (const [, , key] of SETS) for (const l of LANGS) {
  if (JSON.stringify(indices[key][MAIN][l].estimate) !== JSON.stringify(main[key][RERUN][l].estimate)) throw new Error(`${key} ${l} of the main run differs from results/summary.json`);
}
// A cell that lacks some of the set's claims (the medium arm has no place claims) is a different
// index; such cells are left out so no partial index sits beside the full ones.
const setSize = Object.fromEntries(SETS.map(([, cs, key]) => [key, cs.length]));
function indexJsonCell(cell, key) {
  return cell.units && (!key || cell.units === setSize[key]) ? { estimate: cell.estimate, low: cell.low, high: cell.high, units: cell.units } : null;
}
const ciOrDash = (cell) => (cell ? ci(cell) : "-");

// ---------- labels with the scenario bootstrap of scripts/stats.mjs section 7 ----------
const practicalUnits = [...new Set([...records, ...mainRecords].filter((r) => r.subject === "Taiwan" && r.question_type === "choice" && PRACTICAL(r.concept)).map((r) => r.concept))].sort();
const labelInterval = (rs, t, l) => {
  const byConcept = new Map(practicalUnits.map((c) => [c, rs.filter((r) => r.target === t && variant(r) === "base" && r.lang === l && r.question_type === "choice" && r.concept === c)
    .map((r) => (CHINA_INCLUSIVE.has(r.choice) ? 1 : 0))]));
  const { iterations, seed } = main.definitions.bootstrap.practical_labels;
  // flatMap keeps a scenario drawn twice counted twice, as practicalRate in scripts/stats.mjs.
  return bootstrap(practicalUnits, (u) => mean(u.flatMap((c) => byConcept.get(c))), { iterations, seed: seed[l] });
};
const mainLabels = Object.fromEntries(LANGS.map((l) => [l, labelInterval(mainRecords, RERUN, l)]));
for (const l of LANGS) {
  const expected = main.practical_labels[RERUN][l];
  if (["estimate", "low", "high"].some((k) => Math.abs(mainLabels[l][k] - expected[k]) > 1e-12)) throw new Error(`practical label rebuild of ${RERUN} ${l} differs from results/summary.json`);
}
const labelTable = (rs, t) => Object.fromEntries(CONDITIONS.map((v) => [v, Object.fromEntries(LANGS.map((l) => [l, labelCounts(rs, t, l, v)]))]));

// ---------- 1. bridge: same-day Claude Haiku 4.5 rerun against the main run ----------
out.push("## 1. Bridge: Claude Haiku 4.5 rerun (8 October) against the main run (25 September)", "",
  "The same target and items on two dates. A single bridge shows how much this version moved between the two dates; it cannot estimate the range of day-to-day variation.", "",
  "| Index | Run | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |");
for (const [, , key] of SETS) {
  for (const m of [MAIN, RERUN]) out.push(`| ${key} | ${LABEL[m]} | ${LANGS.map((l) => ci(indices[key][m][l])).join(" | ")} |`);
  out.push(`| ${key} | Rerun minus main | ${LANGS.map((l) => f2(indices[key][RERUN][l].estimate - indices[key][MAIN][l].estimate)).join(" | ")} |`);
}
out.push("", "### Labels listing Taiwan under \"China\" (group C)", "", "| Run | Condition | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |",
  ...CONDITIONS.flatMap((v) => [[MAIN, mainRecords], [RERUN, records]].map(([m, rs]) => `| ${LABEL[m]} | ${v} | ${LANGS.map((l) => labelRate(rs, RERUN, l, v)).join(" | ")} |`)), "");

const forcedDifferences = [];
for (const c of B_CONCEPTS) for (const l of LANGS) for (const v of CONDITIONS) {
  const a = modal(choiceCounts(mainRecords, RERUN, c, l, v));
  const b = modal(choiceCounts(records, RERUN, c, l, v));
  if (a.choices.join("/") !== b.choices.join("/")) {
    forcedDifferences.push({ claim: c, lang: l, condition: v, main: choiceCounts(mainRecords, RERUN, c, l, v), rerun: choiceCounts(records, RERUN, c, l, v) });
  }
}
const forcedCells = B_CONCEPTS.length * LANGS.length * CONDITIONS.length;
out.push("### Forced choice (group B): cells whose most frequent option differs", "",
  `${forcedDifferences.length} of ${forcedCells} cells (${B_CONCEPTS.length} claims x 3 languages x 5 conditions). Ties are shown as "a / b".`, "");
if (forcedDifferences.length) {
  out.push("| Claim | Language | Condition | Main run | Rerun |", "| --- | --- | --- | --- | --- |",
    ...forcedDifferences.map((d) => `| ${d.claim} | ${d.lang} | ${d.condition} | ${showModal(d.main)} | ${showModal(d.rerun)} |`));
}
out.push("");

// ---------- 2. Claude Haiku 5.5 (low) against the same-day Claude Haiku 4.5 ----------
out.push("## 2. Claude Haiku 5.5 (effort low) against the same-day Claude Haiku 4.5", "");
for (const [title, , key] of SETS) {
  out.push(`### ${title}`, "", "95% cluster bootstrap intervals over claims. The effort-medium arm covers the status claims only.", "",
    `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
    ...summary.models.map((m) => `| ${LABEL[m]} | ${LANGS.map((l) => ciOrDash(indexJsonCell(indices[key][m][l], key))).join(" | ")} |`), "");
}

// One family per question, reported uncorrected; the appendix is exploratory, as appendices C and D.
const signFlipOf = (a, b) => Object.fromEntries(LANGS.map((l) => {
  const d = pairedDiffs(orientation, summary.claim_agreement, a, b, l, statusClaims);
  return [l, { mean_difference: mean(d), new_higher: d.filter((x) => x > 0).length, new_lower: d.filter((x) => x < 0).length, claims: d.length, p: signFlipTest(d).p }];
}));
const signFlipRows = (x) => LANGS.map((l) => `| ${l} | ${f2(x[l].mean_difference)} | ${x[l].new_higher}/${x[l].claims} | ${x[l].new_lower}/${x[l].claims} | ${x[l].p.toFixed(3)} |`);
const signFlip = signFlipOf(NEW, RERUN);
out.push("### Claude Haiku 5.5 (low) minus same-day Claude Haiku 4.5, status claims", "",
  "Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.", "",
  "| Language | Mean difference | Claims where Haiku 5.5 is higher | Claims where it is lower | Exact p |", "| --- | --- | --- | --- | --- |",
  ...signFlipRows(signFlip), "");

const newLabels = Object.fromEntries(LANGS.map((l) => [l, labelInterval(records, NEW, l)]));
const rerunLabels = Object.fromEntries(LANGS.map((l) => [l, labelInterval(records, RERUN, l)]));
const pct = (x) => `${Math.round(x.estimate * 100)}% [${Math.round(x.low * 100)}, ${Math.round(x.high * 100)}]`;
out.push("### Labels listing Taiwan under \"China\" (group C, original option order)", "",
  `95% scenario bootstrap over the ${practicalUnits.length} scenarios, as results/summary.json practical_labels.`, "",
  `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...[[RERUN, rerunLabels], [NEW, newLabels], [MAIN, mainLabels]].map(([m, x]) => `| ${LABEL[m]} | ${LANGS.map((l) => pct(x[l])).join(" | ")} |`), "",
  "#### All conditions", "", "Order variants cover all twelve scenarios; asker variants cover four.", "",
  "| Model | Condition | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |",
  ...FULL_TARGETS.flatMap((t) => CONDITIONS.map((v) => `| ${LABEL[t]} | ${v} | ${LANGS.map((l) => labelRate(records, t, l, v)).join(" | ")} |`)), "");

const forcedChoice = Object.fromEntries(B_CONCEPTS.map((c) => [c, Object.fromEntries(FULL_TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l,
  Object.fromEntries(CONDITIONS.map((v) => [v, choiceCounts(records, t, c, l, v)]))]))]))]));
out.push("### Forced choice (group B), most frequent option", "", "Conditions: original order, reversed, shuffled, asker in Taipei, asker in Beijing. Ties are shown as \"a / b\".", "");
for (const c of B_CONCEPTS) {
  out.push(`#### ${c}`, "", `| Model | Language | ${CONDITIONS.join(" | ")} |`, `| --- | --- | ${CONDITIONS.map(() => "---").join(" | ")} |`,
    ...FULL_TARGETS.flatMap((t) => LANGS.map((l) => `| ${LABEL[t]} | ${l} | ${CONDITIONS.map((v) => showModal(forcedChoice[c][t][l][v])).join(" | ")} |`)), "");
}
const prcChoices = [];
for (const c of B_CONCEPTS) for (const t of FULL_TARGETS) for (const l of LANGS) for (const v of CONDITIONS) {
  const counts = forcedChoice[c][t][l][v];
  for (const [choice, n] of Object.entries(counts)) {
    if (PRC_POSITION.has(choice)) prcChoices.push({ target: t, claim: c, lang: l, condition: v, choice, count: n, calls: Object.values(counts).reduce((a, b) => a + b, 0) });
  }
}
out.push("#### Options stating the PRC position", "", `Every cell where any repetition chose ${[...PRC_POSITION].join(", ")}.`, "");
out.push(...(prcChoices.length
  ? ["| Model | Claim | Language | Condition | Option | Count |", "| --- | --- | --- | --- | --- | --- |",
    ...prcChoices.map((p) => `| ${LABEL[p.target]} | ${p.claim} | ${p.lang} | ${p.condition} | ${p.choice} | ${p.count}/${p.calls} |`)]
  : ["None."]), "");

// Asker variants exist in the f1 framing only, as in stats.mjs section 9.
const askerAgreement = Object.fromEntries(["asker-tw", "asker-cn"].map((v) => [v, claimAgreement(records, FULL_TARGETS, statusClaims, v)]));
const askerIndex = Object.fromEntries(FULL_TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => {
  const idx = (v) => mean(statusClaims.map((c) => orientedScore(orientation, askerAgreement[v], t, l, c, ["f1"])).filter((x) => x != null));
  const tw = idx("asker-tw");
  const cn = idx("asker-cn");
  return [l, { asker_tw: tw, asker_cn: cn, beijing_minus_taipei: cn - tw }];
}))]));
out.push("### Stated asker, status index (f1 framing)", "", "| Model | Language | Asker in Taipei | Asker in Beijing | Beijing minus Taipei |", "| --- | --- | --- | --- | --- |",
  ...FULL_TARGETS.flatMap((t) => LANGS.map((l) => `| ${LABEL[t]} | ${l} | ${f2(askerIndex[t][l].asker_tw)} | ${f2(askerIndex[t][l].asker_cn)} | ${f2(askerIndex[t][l].beijing_minus_taipei)} |`)), "");

out.push("### Place claims by city (agreement with the claim as written)", "", `| Model | Claim | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...[...FULL_TARGETS, MAIN].flatMap((t) => placeClaims.map((c) => `| ${LABEL[t]} | ${c} | ${LANGS.map((l) => f2(summary.claim_agreement[t]?.[l]?.[c]?.f1)).join(" | ")} |`)), "");

// The synthetic agreement above is a mean of the two statements; here each is shown, with the main
// run's raw records standing in for the main row.
const placeConsistencyBy = Object.fromEntries([...FULL_TARGETS, MAIN].map((t) => [t, t === MAIN ? placeConsistency(mainRecords, RERUN, placeClaims) : placeConsistency(records, t, placeClaims)]));
out.push("### Place claims by city: positive and negative statements apart", "",
  "Base items in the f1 framing (the only framing of the city claims), five repetitions per statement. Each statement is scored on its own as mean P(yes). Agreement is (P_pos + 1 - P_neg) / 2 as above; the gap g = P_pos + P_neg - 1 is near 0 when the two statements get complementary answers, near -1 when both are answered no and near 1 when both are answered yes. The last column counts the negative statement's repetitions with P(yes) at or above 0.5.", "",
  ...PLACE_CONSISTENCY_HEADER,
  ...[...FULL_TARGETS, MAIN].flatMap((t) => placeConsistencyRows(LABEL[t], placeConsistencyBy[t], placeClaims)), "");

// Anthropic counts extended thinking inside output_tokens and returns no separate count, so the
// records hold none; the column says "not reported", since a zero would misstate it.
const costs = Object.fromEntries(TARGETS.map((t) => [t, { ...latencyCost(records, t), mean_reasoning_tokens: null }]));
const inputRatio = costs[NEW].mean_input_tokens / costs[RERUN].mean_input_tokens;
const mainCost = main.latency_cost[RERUN];
const costRow = (t) => {
  const c = costs[t];
  return `| ${LABEL[t]} | ${c.calls} | ${c.median_latency_ms} | ${Math.round(c.mean_input_tokens)} | ${Math.round(c.mean_output_tokens)} | not reported | ${c.cost_per_1000_usd.toFixed(2)} |`;
};
out.push("### Latency and cost (base items)", "",
  `Latency is measured from Hanoi and includes the network round trip; cost uses PRICING in lib/targets.mjs (Claude Haiku 5.5 USD ${PRICING[NEW].join(" and ")}, Claude Haiku 4.5 USD ${PRICING[RERUN].join(" and ")} per million input and output tokens). Claude Haiku 5.5 uses a new tokenizer that, per Anthropic, yields about 30% more tokens for the same text; on these items its mean input is ${inputRatio.toFixed(2)} times that of Claude Haiku 4.5 for identical prompts. The Anthropic API counts reasoning (extended thinking) inside the output tokens and reports no separate figure, so the output column includes it.`, "",
  "| Model | Calls | Latency p50 ms | Mean input | Mean output | Of which reasoning | Cost per 1,000 calls (USD) |", "| --- | --- | --- | --- | --- | --- | --- |",
  ...FULL_TARGETS.map(costRow),
  `| ${LABEL[MAIN]} | ${mainCost.calls} | ${mainCost.latency_ms_median} | - | - | - | ${mainCost.cost_usd_per_1000_calls.toFixed(2)} |`, "");

// ---------- 3. reasoning effort on the same calls ----------
// Same calls only: the medium arm covers the base items of the status claims, so the low arm is
// restricted to the same item ids and repetitions.
const mediumCalls = records.filter((r) => r.target === MEDIUM && variant(r) === "base");
const effortKeys = new Set(mediumCalls.map(callKey));
const sameCalls = records.filter((r) => (r.target === MEDIUM || r.target === NEW) && variant(r) === "base" && effortKeys.has(callKey(r)));
const effortSummary = { ...main, models: [MEDIUM, NEW], claim_agreement: claimAgreement(sameCalls, [MEDIUM, NEW], statusClaims) };
const effortIndex = indexTable(effortSummary, buildUnits(effortSummary, { concepts: statusClaims }));
const effortRows = [MEDIUM, NEW].map((t) => {
  const rs = sameCalls.filter((r) => r.target === t);
  const outTokens = rs.map((r) => r.usage?.output_tokens ?? 0).sort((a, b) => a - b);
  const ms = rs.map((r) => r.ms).sort((a, b) => a - b);
  const input = mean(rs.map((r) => r.usage?.input_tokens ?? 0));
  const [pi, po] = PRICING[t];
  return { target: t, calls: rs.length, status_index: Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(effortIndex[t][l], "status_index")])),
    mean_input_tokens: input, mean_output_tokens: mean(outTokens), median_output_tokens: quantile(outTokens, 0.5),
    median_latency_ms: quantile(ms, 0.5), cost_per_1000_usd: ((input * pi + mean(outTokens) * po) / 1e6) * 1000 };
});
const effortSignFlip = Object.fromEntries(LANGS.map((l) => {
  const d = pairedDiffs(orientation, effortSummary.claim_agreement, MEDIUM, NEW, l, statusClaims);
  return [l, { mean_difference: mean(d), new_higher: d.filter((x) => x > 0).length, new_lower: d.filter((x) => x < 0).length, claims: d.length, p: signFlipTest(d).p }];
}));
// The low arm's status index uses exactly these calls, so restricting it must change nothing.
for (const l of LANGS) {
  if (JSON.stringify(effortIndex[NEW][l].estimate) !== JSON.stringify(indices.status_index[NEW][l].estimate)) throw new Error(`effort comparison: status index of ${NEW} ${l} changed when restricted to the medium arm's calls`);
}
out.push("## 3. Reasoning effort on the same calls (Claude Haiku 5.5, status claims, base items)", "",
  `Restricted to the ${effortKeys.size} item and repetition pairs the effort-medium arm covers (the ${statusBaseItems.length} base items of the twelve status claims, ${REPS} repetitions each).`, "",
  `| Model | Calls | ${LANGS.map((l) => `Status index ${l}`).join(" | ")} | Mean input | Mean output tokens | Median output tokens | Latency p50 ms | Cost per 1,000 calls (USD) |`,
  `| --- | --- | ${LANGS.map(() => "---").join(" | ")} | --- | --- | --- | --- | --- |`,
  ...effortRows.map((e) => `| ${LABEL[e.target]} | ${e.calls} | ${LANGS.map((l) => ciOrDash(e.status_index[l])).join(" | ")} | ${Math.round(e.mean_input_tokens)} | ${e.mean_output_tokens.toFixed(1)} | ${e.median_output_tokens} | ${e.median_latency_ms} | ${e.cost_per_1000_usd.toFixed(2)} |`), "",
  "### Effort medium minus effort low, status claims", "", "Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.", "",
  "| Language | Mean difference | Claims where medium is higher | Claims where it is lower | Exact p |", "| --- | --- | --- | --- | --- |",
  ...signFlipRows(effortSignFlip), "");

// ---------- 4. Simplified Chinese beside the main analysis ----------
const crossModel = [
  ...main.models.map((m) => ({ model: m, label: MAIN_LABEL[m] ?? m, run_date: MAIN_RUN_DATE, status_index: main.status_index[m]["zh-CN"], place_index: main.place_index[m]["zh-CN"] })),
  ...TARGETS.map((t) => ({ model: t, label: LABEL[t], run_date: RUN_DATE,
    status_index: indexJsonCell(indices.status_index[t]["zh-CN"], "status_index"), place_index: indexJsonCell(indices.place_index[t]["zh-CN"], "place_index") })),
];
out.push("## 4. Simplified Chinese beside the main analysis", "",
  "Main-analysis rows come from results/summary.json (25 September); the last three rows from this appendix (8 October). The effort-medium arm has no place claims. The place index has three units, so its interval is descriptive at best.", "",
  "| Model | Run date | zh-CN status index | zh-CN place index |", "| --- | --- | --- | --- |",
  ...crossModel.map((x) => `| ${x.label} | ${x.run_date} | ${ciOrDash(x.status_index)} | ${ciOrDash(x.place_index)} |`), "");

writeFileSync(new URL("appendix-e.md", ROOT), out.join("\n") + "\n");
console.log(`wrote results/appendix-e.md (${records.length} calls, targets ${TARGETS.join(", ")})`);

const indexJson = (table, key) => Object.fromEntries(TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(table[t][l], key)]))]));
const json = {
  schema: {
    generated_at: "ISO 8601 time this file and results/appendix-e.md were written.",
    run_date: "UTC date of every appendix E call. The main analysis (results/summary.json) ran on 25 September 2026 and is not changed by this file.",
    calls: "Number of successful, non-refused appendix E calls analyzed.",
    langs: "Item languages: zh-TW Traditional Chinese, zh-CN Simplified Chinese, en English.",
    models: "Target ids as in results/runs-appendixe/*.jsonl. claude-haiku-4-5 is the same-day rerun of Claude Haiku 4.5, not the main-analysis run; claude-haiku-5-5 is Claude Haiku 5.5 at effort low and claude-haiku-5-5-medium the same model at effort medium on the status claims only.",
    targets: "target -> { label, model, effort, coverage, calls, expected_calls (items covered x 5 repetitions), missing_calls, first_call, last_call, longest_gap_s between consecutive calls }.",
    integrity: "{ records, failed, refusals, without_value_or_choice, duplicate_pairs } over every record in results/runs-appendixe/.",
    "status_index, place_index, pooled_index": "target -> lang -> { estimate, low, high, units } or null when the target lacks some claims of the set (the medium arm has the status claims only). Same definitions, seeds and code (lib/lab.mjs) as results/summary.json.",
    sign_flip: "lang -> { mean_difference, new_higher, new_lower, claims, p }: Claude Haiku 5.5 (low) minus same-day Claude Haiku 4.5 over the twelve status claims, exact two-sided sign-flip p, uncorrected and exploratory.",
    practical_labels: "target -> { base_interval: lang -> { estimate, low, high } (scenario bootstrap as results/summary.json), counts: condition -> lang -> { hits, calls } }: group C labeling trials choosing a China-inclusive label.",
    forced_choice: "claim (every group B concept) -> target (the two full-coverage targets) -> lang -> condition (base, order-rev, order-shuf, asker-tw, asker-cn) -> counts of every option.",
    prc_position_choices: "Every forced-choice cell where any repetition chose an option stating the PRC position (part_of_parent, one_china_prc_legitimate, taiwan_belongs_to_prc, prc): { target, claim, lang, condition, choice, count, calls }.",
    place_consistency: "target -> lang -> city claim -> { positive, negative, synthetic, gap, negative_at_least_half, negative_calls }: mean P(yes) of the positive and of the negative statement (base items, f1 framing, the only framing the city claims have), synthetic = (positive + 1 - negative) / 2, gap g = positive + negative - 1 (near 0 when the two statements get complementary answers, near -1 when both are answered no, near 1 when both are answered yes), and how many of the negative statement's calls had P(yes) >= 0.5. The main-run row is under the @main id. Unrounded.",
    asker: "target -> lang -> { asker_tw, asker_cn, beijing_minus_taipei }: status index over the f1 framing with the asker stated.",
    latency_cost: "target -> { calls, median_latency_ms, mean_input_tokens, mean_output_tokens, cost_per_1000_usd, mean_reasoning_tokens } on base items. The Anthropic API counts reasoning inside the output tokens and reports no separate figure, so mean_reasoning_tokens is null. Claude Haiku 5.5 uses a new tokenizer (about 30% more tokens for the same text, per Anthropic), visible in mean_input_tokens.",
    mean_input_ratio: "Mean input tokens of Claude Haiku 5.5 (low) over those of the same-day Claude Haiku 4.5 on the same base items, so on identical prompts.",
    reasoning_effort: "{ calls_compared, rows: target -> { calls, status_index: lang -> cell, mean_input_tokens, mean_output_tokens, median_output_tokens, median_latency_ms, cost_per_1000_usd }, sign_flip: lang -> medium minus low as sign_flip } over the base items of the twelve status claims both effort arms ran.",
    bridge: "Same-day Claude Haiku 4.5 rerun against the 25 September main run: { status_index, place_index, pooled_index: run -> lang -> cell; practical_labels: run -> condition -> lang -> { hits, calls }; forced_choice_cells; forced_choice_differences: [{ claim, lang, condition, main, rerun }] where the most frequent option set differs }.",
    cross_model_zh_cn: "[{ model, label, run_date, status_index, place_index }]: Simplified Chinese indices of the main-analysis models (25 September) beside the three appendix E targets (8 October); null where the target lacks the claims.",
    claim_agreement: "Same format as claim_agreement in results/summary.json: target -> lang -> claim -> framing -> agreement on base items, not oriented. Unrounded, so any index can be recomputed exactly.",
  },
  generated_at: generatedAt,
  run_date: RUN_DATE,
  calls: records.length,
  source: `results/${ARM_DIR}/*.jsonl in https://github.com/Clementtang/jev-eval; tables in results/appendix-e.md`,
  langs: LANGS,
  models: TARGETS,
  targets: runInfo,
  integrity,
  status_index: indexJson(indices.status_index, "status_index"),
  place_index: indexJson(indices.place_index, "place_index"),
  pooled_index: indexJson(indices.pooled_index, "pooled_index"),
  sign_flip: signFlip,
  practical_labels: Object.fromEntries([[RERUN, rerunLabels], [NEW, newLabels]].map(([t, x]) => [t, { base_interval: x, counts: labelTable(records, t) }])),
  forced_choice: forcedChoice,
  prc_position_choices: prcChoices,
  asker: askerIndex,
  place_consistency: placeConsistencyBy,
  latency_cost: costs,
  mean_input_ratio: inputRatio,
  reasoning_effort: { calls_compared: effortKeys.size, rows: Object.fromEntries(effortRows.map(({ target, ...cells }) => [target, cells])), sign_flip: effortSignFlip },
  bridge: {
    ...Object.fromEntries(SETS.map(([, , key]) => [key, { main: Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(indices[key][MAIN][l])])),
      rerun: Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(indices[key][RERUN][l])])) }])),
    practical_labels: { main: labelTable(mainRecords, RERUN), rerun: labelTable(records, RERUN) },
    forced_choice_cells: forcedCells,
    forced_choice_differences: forcedDifferences,
  },
  cross_model_zh_cn: crossModel,
  claim_agreement: Object.fromEntries(TARGETS.map((t) => [t, summary.claim_agreement[t]])),
};
if (new Set(records.map((r) => r.ts.slice(0, 10))).size !== 1 || records[0].ts.slice(0, 10) !== RUN_DATE) {
  throw new Error(`appendix E calls are expected on ${RUN_DATE} only`);
}
writeFileSync(new URL("appendix-e.json", ROOT), JSON.stringify(json, null, 2) + "\n");
console.log("wrote results/appendix-e.json");
