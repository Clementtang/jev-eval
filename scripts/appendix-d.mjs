// Appendix D: GPT-6.1 Sol (released after the main runs) against a same-day rerun of GPT-6 Sol, both
// at the vendor default reasoning effort like the main runs. Reads results/runs-appendixd/ (and
// results/runs/ for the bridge to the main GPT-6 Sol run), reuses the definitions in
// results/summary.json and the code shared with the appendix C addendum (lib/arm-analysis.mjs,
// lib/lab.mjs), and writes results/appendix-d.md and results/appendix-d.json.
// Usage: node scripts/appendix-d.mjs
import { readdirSync, writeFileSync } from "node:fs";
import { B_CONCEPTS, CONDITIONS, LANGS, PRACTICAL, PRC_POSITION, RESULTS_ROOT as ROOT, CHINA_INCLUSIVE, choiceCounts, ci, claimAgreement, f2,
  labelCounts, labelRate, latencyCost, modal, orientedScore, pairedDiffs, PLACE_CONSISTENCY_HEADER, placeConsistency, placeConsistencyRows, readArm, readJsonl, readSummary, showModal, variant } from "../lib/arm-analysis.mjs";
import { buildUnits, indexTable } from "../lib/lab.mjs";
import { bootstrap, mean, quantile, signFlipTest } from "../lib/stats.mjs";

const ARM_DIR = "runs-appendixd";
const RUN_DATE = "2026-10-01";
const NEW = "sol-6-1";
const RERUN = "sol-6";
const MAIN = "sol-6@main";
const TARGETS = [RERUN, NEW];
// The resume after the credit outage left one long pause in each run file; anything shorter is the
// ordinary spacing of concurrent calls.
const SEGMENT_GAP_MS = 30 * 60 * 1000;
const DISCARDED_FILE = new URL("runs-discarded/20261001-openai-credits-exhausted.jsonl", ROOT);
const LABEL = {
  [RERUN]: "GPT-6 Sol (same-day rerun)",
  [NEW]: "GPT-6.1 Sol",
  [MAIN]: "GPT-6 Sol (main runs, 25 September)",
};
const MAIN_LABEL = { jev: "Jev", "claude-haiku-4-5": "Claude Haiku 4.5", "claude-sonnet-5": "Claude Sonnet 5", "grok-4-7": "Grok 4.7",
  "luna-6": "GPT-6 Luna", "sol-6": "GPT-6 Sol" };
const MAIN_RUN_DATE = "2026-09-25";

const main = readSummary();
const { orientation, status_concepts: statusClaims, place_concepts: placeClaims } = main.definitions;
const concepts = Object.keys(orientation);
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
const out = ["# Appendix D: GPT-6.1 Sol", "",
  `Generated ${generatedAt} from results/${ARM_DIR}/ (${records.length} successful calls) and, for the bridge, the GPT-6 Sol records of results/runs/. Definitions, seeds and index code are those of the main analysis.`, ""];

// ---------- runs, including the pause caused by the credit outage ----------
const discarded = readJsonl(DISCARDED_FILE);
const callKey = (r) => `${r.item_id}#${r.rep}`;
const runInfo = Object.fromEntries(TARGETS.map((t) => {
  const rs = records.filter((r) => r.target === t);
  const ts = rs.map((r) => r.ts).sort();
  const segments = [[ts[0], ts[0]]];
  for (let i = 1; i < ts.length; i++) {
    if (Date.parse(ts[i]) - Date.parse(ts[i - 1]) > SEGMENT_GAP_MS) segments.push([ts[i], ts[i]]);
    else segments.at(-1)[1] = ts[i];
  }
  const failed = discarded.filter((r) => r.target === t);
  const failedTs = failed.map((r) => r.ts).sort();
  const okKeys = new Set(rs.map(callKey));
  return [t, {
    label: LABEL[t], model: rs[0].model, effort: "vendor default", coverage: "all 957 items", calls: rs.length,
    first_call: ts[0], last_call: ts.at(-1),
    segments: segments.map(([from, to]) => ({ from, to, calls: ts.filter((x) => x >= from && x <= to).length })),
    discarded_failures: { calls: failed.length, first: failedTs[0] ?? null, last: failedTs.at(-1) ?? null,
      http_429: failed.filter((r) => /HTTP 429/.test(r.error ?? "")).length, all_redone: failed.every((r) => okKeys.has(callKey(r))) },
  }];
}));
const duplicates = records.length - new Set(records.map((r) => `${r.target}|${callKey(r)}`)).size;
out.push("## Runs", "", "Both targets ran in one batch. OpenAI credits ran out partway; the run was resumed with `run-all.mjs --resume` into the same run files, and the failed calls were moved to results/runs-discarded/20261001-openai-credits-exhausted.jsonl.", "",
  "| Target | Model ID | Calls | First call (UTC) | Last call (UTC) |", "| --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => `| ${LABEL[t]} | ${runInfo[t].model} | ${runInfo[t].calls} | ${runInfo[t].first_call} | ${runInfo[t].last_call} |`), "",
  "### Segments and interruption", "", "| Target | Segment | From (UTC) | To (UTC) | Calls |", "| --- | --- | --- | --- | --- |",
  ...TARGETS.flatMap((t) => runInfo[t].segments.map((s, i) => `| ${LABEL[t]} | ${i + 1} | ${s.from} | ${s.to} | ${s.calls} |`)), "",
  "| Target | Pause (UTC) | Failed calls discarded | Of which HTTP 429 | Failed calls first to last (UTC) | Every failed call later succeeded |", "| --- | --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => {
    const { segments, discarded_failures: d } = runInfo[t];
    const pauses = segments.slice(1).map((s, i) => `${segments[i].to} to ${s.from}`).join("; ") || "none";
    return `| ${LABEL[t]} | ${pauses} | ${d.calls} | ${d.http_429} | ${d.first} to ${d.last} | ${d.all_redone ? "yes" : "no"} |`;
  }), "",
  `Records in results/${ARM_DIR}/: ${rawRecords.length}; failed (ok false) ${rawRecords.filter((r) => !r.ok).length}; refusals ${rawRecords.filter((r) => r.refusal).length}; successful calls without a value or choice ${records.filter((r) => (r.question_type === "choice" ? r.choice : r.value) == null).length}; duplicate item and repetition pairs ${duplicates}.`, "");

// ---------- indices ----------
const SETS = [["Status index (12 status claims, main analysis)", statusClaims, "status_index"],
  ["Place index (3 city claims)", placeClaims, "place_index"],
  ["Pooled index (15 claims)", concepts, "pooled_index"]];
const indices = Object.fromEntries(SETS.map(([, cs, key]) => [key, indexTable(summary, buildUnits(summary, { concepts: cs }))]));
// Each model's bootstrap depends only on its own scores, so the main row must equal results/summary.json.
for (const [, , key] of SETS) for (const l of LANGS) {
  if (JSON.stringify(indices[key][MAIN][l].estimate) !== JSON.stringify(main[key][RERUN][l].estimate)) throw new Error(`${key} ${l} of the main run differs from results/summary.json`);
}

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

// ---------- 1. bridge: same-day GPT-6 Sol rerun against the main run ----------
out.push("## 1. Bridge: GPT-6 Sol rerun (1 October) against the main run (25 September)", "",
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

// ---------- 2. GPT-6.1 Sol against the same-day GPT-6 Sol ----------
out.push("## 2. GPT-6.1 Sol against the same-day GPT-6 Sol", "");
for (const [title, , key] of SETS) {
  out.push(`### ${title}`, "", "95% cluster bootstrap intervals over claims.", "",
    `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
    ...summary.models.map((m) => `| ${LABEL[m]} | ${LANGS.map((l) => ci(indices[key][m][l])).join(" | ")} |`), "");
}

// One family per question, reported uncorrected; the appendix is exploratory, as appendix C.
const signFlip = Object.fromEntries(LANGS.map((l) => {
  const d = pairedDiffs(orientation, summary.claim_agreement, NEW, RERUN, l, statusClaims);
  return [l, { mean_difference: mean(d), new_higher: d.filter((x) => x > 0).length, new_lower: d.filter((x) => x < 0).length, claims: d.length, p: signFlipTest(d).p }];
}));
out.push("### GPT-6.1 Sol minus same-day GPT-6 Sol, status claims", "",
  "Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.", "",
  "| Language | Mean difference | Claims where GPT-6.1 Sol is higher | Claims where it is lower | Exact p |", "| --- | --- | --- | --- | --- |",
  ...LANGS.map((l) => `| ${l} | ${f2(signFlip[l].mean_difference)} | ${signFlip[l].new_higher}/${signFlip[l].claims} | ${signFlip[l].new_lower}/${signFlip[l].claims} | ${signFlip[l].p.toFixed(3)} |`), "");

const newLabels = Object.fromEntries(LANGS.map((l) => [l, labelInterval(records, NEW, l)]));
const rerunLabels = Object.fromEntries(LANGS.map((l) => [l, labelInterval(records, RERUN, l)]));
const pct = (x) => `${Math.round(x.estimate * 100)}% [${Math.round(x.low * 100)}, ${Math.round(x.high * 100)}]`;
out.push("### Labels listing Taiwan under \"China\" (group C, original option order)", "",
  `95% scenario bootstrap over the ${practicalUnits.length} scenarios, as results/summary.json practical_labels.`, "",
  `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...[[RERUN, rerunLabels], [NEW, newLabels], [MAIN, mainLabels]].map(([m, x]) => `| ${LABEL[m]} | ${LANGS.map((l) => pct(x[l])).join(" | ")} |`), "",
  "#### All conditions", "", "Order variants cover all twelve scenarios; asker variants cover four.", "",
  "| Model | Condition | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |",
  ...TARGETS.flatMap((t) => CONDITIONS.map((v) => `| ${LABEL[t]} | ${v} | ${LANGS.map((l) => labelRate(records, t, l, v)).join(" | ")} |`)), "");

const forcedChoice = Object.fromEntries(B_CONCEPTS.map((c) => [c, Object.fromEntries(TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l,
  Object.fromEntries(CONDITIONS.map((v) => [v, choiceCounts(records, t, c, l, v)]))]))]))]));
out.push("### Forced choice (group B), most frequent option", "", "Conditions: original order, reversed, shuffled, asker in Taipei, asker in Beijing. Ties are shown as \"a / b\".", "");
for (const c of B_CONCEPTS) {
  out.push(`#### ${c}`, "", `| Model | Language | ${CONDITIONS.join(" | ")} |`, `| --- | --- | ${CONDITIONS.map(() => "---").join(" | ")} |`,
    ...TARGETS.flatMap((t) => LANGS.map((l) => `| ${LABEL[t]} | ${l} | ${CONDITIONS.map((v) => showModal(forcedChoice[c][t][l][v])).join(" | ")} |`)), "");
}
const prcChoices = [];
for (const c of B_CONCEPTS) for (const t of TARGETS) for (const l of LANGS) for (const v of CONDITIONS) {
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
const askerAgreement = Object.fromEntries(["asker-tw", "asker-cn"].map((v) => [v, claimAgreement(records, TARGETS, statusClaims, v)]));
const askerIndex = Object.fromEntries(TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => {
  const idx = (v) => mean(statusClaims.map((c) => orientedScore(orientation, askerAgreement[v], t, l, c, ["f1"])).filter((x) => x != null));
  const tw = idx("asker-tw");
  const cn = idx("asker-cn");
  return [l, { asker_tw: tw, asker_cn: cn, beijing_minus_taipei: cn - tw }];
}))]));
out.push("### Stated asker, status index (f1 framing)", "", "| Model | Language | Asker in Taipei | Asker in Beijing | Beijing minus Taipei |", "| --- | --- | --- | --- | --- |",
  ...TARGETS.flatMap((t) => LANGS.map((l) => `| ${LABEL[t]} | ${l} | ${f2(askerIndex[t][l].asker_tw)} | ${f2(askerIndex[t][l].asker_cn)} | ${f2(askerIndex[t][l].beijing_minus_taipei)} |`)), "");

out.push("### Place claims by city (agreement with the claim as written)", "", `| Model | Claim | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...[...TARGETS, MAIN].flatMap((t) => placeClaims.map((c) => `| ${LABEL[t]} | ${c} | ${LANGS.map((l) => f2(summary.claim_agreement[t]?.[l]?.[c]?.f1)).join(" | ")} |`)), "");

// The synthetic agreement above is a mean of the two statements; here each is shown, with the main
// run's raw records standing in for the main row.
const placeConsistencyBy = Object.fromEntries([...TARGETS, MAIN].map((t) => [t, t === MAIN ? placeConsistency(mainRecords, RERUN, placeClaims) : placeConsistency(records, t, placeClaims)]));
out.push("### Place claims by city: positive and negative statements apart", "",
  "Base items in the f1 framing (the only framing of the city claims), five repetitions per statement. Each statement is scored on its own as mean P(yes). Agreement is (P_pos + 1 - P_neg) / 2 as above; the gap g = P_pos + P_neg - 1 is near 0 when the two statements get complementary answers, near -1 when both are answered no and near 1 when both are answered yes. The last column counts the negative statement's repetitions with P(yes) at or above 0.5.", "",
  ...PLACE_CONSISTENCY_HEADER,
  ...[...TARGETS, MAIN].flatMap((t) => placeConsistencyRows(LABEL[t], placeConsistencyBy[t], placeClaims)), "");

const costs = Object.fromEntries(TARGETS.map((t) => {
  const base = records.filter((r) => r.target === t && variant(r) === "base");
  return [t, {
    ...latencyCost(records, t),
    // OpenAI counts reasoning inside the output tokens; shown separately because it drives the cost.
    mean_reasoning_tokens: mean(base.map((r) => r.usage?.reasoning_tokens ?? 0)),
    // The two targets split differently across the pause, so latency is also shown per segment.
    median_latency_ms_by_segment: runInfo[t].segments.map((s) => {
      const ms = base.filter((r) => r.ts >= s.from && r.ts <= s.to).map((r) => r.ms).sort((a, b) => a - b);
      return { calls: ms.length, median_latency_ms: ms.length ? quantile(ms, 0.5) : null };
    }),
  }];
}));
const mainCost = main.latency_cost[RERUN];
const segmentLatency = (c) => c.median_latency_ms_by_segment.map((s) => `${s.median_latency_ms ?? "-"} (${s.calls})`).join("; ");
out.push("### Latency and cost (base items)", "", "Latency is measured from Hanoi and includes the network round trip; cost uses PRICING in lib/targets.mjs. Per-segment latency lists p50 ms (base calls) for each segment of the Runs table.", "",
  "| Model | Calls | Latency p50 ms | Latency p50 by segment | Mean input | Mean output | Of which reasoning | Cost per 1,000 calls (USD) |", "| --- | --- | --- | --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => {
    const c = costs[t];
    return `| ${LABEL[t]} | ${c.calls} | ${c.median_latency_ms} | ${segmentLatency(c)} | ${Math.round(c.mean_input_tokens)} | ${Math.round(c.mean_output_tokens)} | ${Math.round(c.mean_reasoning_tokens)} | ${c.cost_per_1000_usd.toFixed(2)} |`;
  }),
  `| ${LABEL[MAIN]} | ${mainCost.calls} | ${mainCost.latency_ms_median} | - | - | - | - | ${mainCost.cost_usd_per_1000_calls.toFixed(2)} |`, "");

// ---------- 3. Simplified Chinese beside the main analysis ----------
const crossModel = [
  ...main.models.map((m) => ({ model: m, label: MAIN_LABEL[m] ?? m, run_date: MAIN_RUN_DATE, status_index: main.status_index[m]["zh-CN"], place_index: main.place_index[m]["zh-CN"] })),
  ...[RERUN, NEW].map((t) => ({ model: t, label: LABEL[t], run_date: RUN_DATE,
    status_index: indexJsonCell(indices.status_index[t]["zh-CN"]), place_index: indexJsonCell(indices.place_index[t]["zh-CN"]) })),
];
function indexJsonCell(cell) {
  return cell.units ? { estimate: cell.estimate, low: cell.low, high: cell.high, units: cell.units } : null;
}
out.push("## 3. Simplified Chinese beside the main analysis", "",
  "Main-analysis rows come from results/summary.json (25 September); the last two rows from this appendix (1 October). The place index has three units, so its interval is descriptive at best.", "",
  "| Model | Run date | zh-CN status index | zh-CN place index |", "| --- | --- | --- | --- |",
  ...crossModel.map((x) => `| ${x.label} | ${x.run_date} | ${ci(x.status_index)} | ${ci(x.place_index)} |`), "");

writeFileSync(new URL("appendix-d.md", ROOT), out.join("\n") + "\n");
console.log(`wrote results/appendix-d.md (${records.length} calls, targets ${TARGETS.join(", ")})`);

const indexJson = (table) => Object.fromEntries(TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(table[t][l])]))]));
const json = {
  schema: {
    generated_at: "ISO 8601 time this file and results/appendix-d.md were written.",
    run_date: "UTC date of every appendix D call. The main analysis (results/summary.json) ran on 25 September 2026 and is not changed by this file.",
    calls: "Number of successful, non-refused appendix D calls analyzed.",
    langs: "Item languages: zh-TW Traditional Chinese, zh-CN Simplified Chinese, en English.",
    models: "Target ids as in results/runs-appendixd/*.jsonl. sol-6 is the same-day rerun of GPT-6 Sol, not the main-analysis run.",
    targets: "target -> { label, model, effort, coverage, calls, first_call, last_call, segments: [{ from, to, calls }] split at pauses over 30 minutes, discarded_failures: { calls, first, last, http_429, all_redone } from results/runs-discarded/20261001-openai-credits-exhausted.jsonl }.",
    "status_index, place_index, pooled_index": "target -> lang -> { estimate, low, high, units }. Same definitions, seeds and code (lib/lab.mjs) as results/summary.json.",
    sign_flip: "lang -> { mean_difference, new_higher, new_lower, claims, p }: GPT-6.1 Sol minus same-day GPT-6 Sol over the twelve status claims, exact two-sided sign-flip p, uncorrected and exploratory.",
    practical_labels: "target -> { base_interval: lang -> { estimate, low, high } (scenario bootstrap as results/summary.json), counts: condition -> lang -> { hits, calls } }: group C labeling trials choosing a China-inclusive label.",
    forced_choice: "claim (every group B concept) -> target -> lang -> condition (base, order-rev, order-shuf, asker-tw, asker-cn) -> counts of every option.",
    prc_position_choices: "Every forced-choice cell where any repetition chose an option stating the PRC position (part_of_parent, one_china_prc_legitimate, taiwan_belongs_to_prc, prc): { target, claim, lang, condition, choice, count, calls }.",
    place_consistency: "target -> lang -> city claim -> { positive, negative, synthetic, gap, negative_at_least_half, negative_calls }: mean P(yes) of the positive and of the negative statement (base items, f1 framing, the only framing the city claims have), synthetic = (positive + 1 - negative) / 2, gap g = positive + negative - 1 (near 0 when the two statements get complementary answers, near -1 when both are answered no, near 1 when both are answered yes), and how many of the negative statement's calls had P(yes) >= 0.5. The main-run row is under the @main id. Unrounded.",
    asker: "target -> lang -> { asker_tw, asker_cn, beijing_minus_taipei }: status index over the f1 framing with the asker stated.",
    latency_cost: "target -> { calls, median_latency_ms, mean_input_tokens, mean_output_tokens, cost_per_1000_usd, mean_reasoning_tokens, median_latency_ms_by_segment: [{ calls, median_latency_ms }] } on base items; OpenAI counts reasoning tokens inside the output tokens, and segments follow targets.segments.",
    bridge: "Same-day GPT-6 Sol rerun against the 25 September main run: { status_index, place_index, pooled_index: run -> lang -> cell; practical_labels: run -> condition -> lang -> { hits, calls }; forced_choice_cells; forced_choice_differences: [{ claim, lang, condition, main, rerun }] where the most frequent option set differs }.",
    cross_model_zh_cn: "[{ model, label, run_date, status_index, place_index }]: Simplified Chinese indices of the main-analysis models (25 September) beside the two appendix D targets (1 October).",
    claim_agreement: "Same format as claim_agreement in results/summary.json: target -> lang -> claim -> framing -> agreement on base items, not oriented. Unrounded, so any index can be recomputed exactly.",
  },
  generated_at: generatedAt,
  run_date: RUN_DATE,
  calls: records.length,
  source: `results/${ARM_DIR}/*.jsonl in https://github.com/Clementtang/jev-eval; tables in results/appendix-d.md`,
  langs: LANGS,
  models: TARGETS,
  targets: runInfo,
  status_index: indexJson(indices.status_index),
  place_index: indexJson(indices.place_index),
  pooled_index: indexJson(indices.pooled_index),
  sign_flip: signFlip,
  practical_labels: Object.fromEntries([[RERUN, rerunLabels], [NEW, newLabels]].map(([t, x]) => [t, { base_interval: x, counts: labelTable(records, t) }])),
  forced_choice: forcedChoice,
  prc_position_choices: prcChoices,
  asker: askerIndex,
  place_consistency: placeConsistencyBy,
  latency_cost: costs,
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
  throw new Error(`appendix D calls are expected on ${RUN_DATE} only`);
}
writeFileSync(new URL("appendix-d.json", ROOT), JSON.stringify(json, null, 2) + "\n");
console.log("wrote results/appendix-d.json");
