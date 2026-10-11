// Appendix F: GPT-6 Luna through OpenAI's Decisions API (public beta from 6 October 2026, after the
// main runs), against same-day reruns of GPT-6 Luna through chat completions and of Jev. The Decisions
// API takes the same shape as Jev (a state, a question, fixed answers) and returns the model's own
// probabilities, so one model is compared through two interfaces, and two structured endpoints on one
// probability scale. Reads results/runs-appendixf/ (and results/runs/ for the bridges to the main
// runs), reuses the definitions in results/summary.json and the code shared with appendices C to E
// (lib/arm-analysis.mjs, lib/lab.mjs), and writes results/appendix-f.md and results/appendix-f.json.
// Usage: node scripts/appendix-f.mjs
import { readdirSync, writeFileSync } from "node:fs";
import { B_CONCEPTS, CONDITIONS, LANGS, PRACTICAL, PRC_POSITION, RESULTS_ROOT as ROOT, CHINA_INCLUSIVE, choiceCounts, ci, claimAgreement, f2,
  labelCounts, labelRate, latencyCost, modal, orientedScore, pairedDiffs, PLACE_CONSISTENCY_HEADER, placeConsistency, placeConsistencyRows, readArm, readJsonl, readSummary, showModal, variant } from "../lib/arm-analysis.mjs";
import { buildUnits, indexTable } from "../lib/lab.mjs";
import { bootstrap, mean, signFlipTest } from "../lib/stats.mjs";

const ARM_DIR = "runs-appendixf";
const RUN_DATE = "2026-10-10";
const NEW = "luna-6-decisions";
const LUNA = "luna-6";
const JEV = "jev";
const RERUNS = [LUNA, JEV];
const mainId = (t) => `${t}@main`;
// Display order of the runs table and the JSON: the two reruns first, as appendices D and E.
const TARGETS = [LUNA, NEW, JEV];
const LABEL = {
  [LUNA]: "GPT-6 Luna, chat completions (same-day rerun)",
  [NEW]: "GPT-6 Luna, Decisions API",
  [JEV]: "Jev (same-day rerun)",
  [mainId(LUNA)]: "GPT-6 Luna, chat completions (main runs, 25 September)",
  [mainId(JEV)]: "Jev (main runs, 25 September)",
};
const INTERFACE = { [LUNA]: "chat completions, JSON schema, model writes the number", [NEW]: "Decisions API, model probabilities", [JEV]: "TypeSafe systemone, model probabilities" };
const MAIN_LABEL = { jev: "Jev", "claude-haiku-4-5": "Claude Haiku 4.5", "claude-sonnet-5": "Claude Sonnet 5", "grok-4-7": "Grok 4.7",
  "luna-6": "GPT-6 Luna", "sol-6": "GPT-6 Sol" };
const MAIN_RUN_DATE = "2026-09-25";

const main = readSummary();
const { orientation, status_concepts: statusClaims, place_concepts: placeClaims } = main.definitions;
const concepts = Object.keys(orientation);
const rawRecords = readdirSync(new URL(`${ARM_DIR}/`, ROOT)).filter((f) => f.endsWith(".jsonl")).flatMap((f) => readJsonl(new URL(`${ARM_DIR}/${f}`, ROOT)));
const records = readArm(ARM_DIR);
const mainRecords = readArm("runs").filter((r) => RERUNS.includes(r.target));

// The bridges compare against the main runs' raw records, so they must reproduce results/summary.json.
const rebuilt = claimAgreement(mainRecords, RERUNS, concepts);
for (const t of RERUNS) {
  let worst = 0;
  for (const l of LANGS) for (const c of concepts) for (const [f, v] of Object.entries(main.claim_agreement[t][l][c])) worst = Math.max(worst, Math.abs(v - rebuilt[t][l][c][f]));
  if (worst > 1e-12) throw new Error(`claim agreement rebuild of ${t} differs from results/summary.json by ${worst}`);
}

const summary = {
  ...main,
  models: [...TARGETS, ...RERUNS.map(mainId)],
  claim_agreement: { ...claimAgreement(records, TARGETS, concepts), ...Object.fromEntries(RERUNS.map((t) => [mainId(t), main.claim_agreement[t]])) },
};
const generatedAt = new Date().toISOString();
const out = ["# Appendix F: GPT-6 Luna through the Decisions API", "",
  `Generated ${generatedAt} from results/${ARM_DIR}/ (${records.length} successful calls) and, for the bridges, the GPT-6 Luna and Jev records of results/runs/. Definitions, seeds and index code are those of the main analysis.`, ""];

// ---------- runs ----------
const callKey = (r) => `${r.item_id}#${r.rep}`;
const runInfo = Object.fromEntries(TARGETS.map((t) => {
  const rs = records.filter((r) => r.target === t);
  const ts = rs.map((r) => r.ts).sort();
  return [t, { label: LABEL[t], model: rs[0].model, interface: INTERFACE[t], effort: "vendor default", coverage: "all 957 items", calls: rs.length,
    first_call: ts[0], last_call: ts.at(-1), failed: rawRecords.filter((r) => r.target === t && !r.ok).length }];
}));
const duplicates = records.length - new Set(records.map((r) => `${r.target}|${callKey(r)}`)).size;
out.push("## Runs", "", "The three targets ran in one batch on the same day. GPT-6 Luna through the Decisions API receives the state and question as Jev does, with no system prompt; through chat completions it receives the main analysis prompt.", "",
  "| Target | Model ID | Interface | Calls | Failed | First call (UTC) | Last call (UTC) |", "| --- | --- | --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => `| ${LABEL[t]} | ${runInfo[t].model} | ${runInfo[t].interface} | ${runInfo[t].calls} | ${runInfo[t].failed} | ${runInfo[t].first_call} | ${runInfo[t].last_call} |`), "",
  `Records in results/${ARM_DIR}/: ${rawRecords.length}; failed (ok false) ${rawRecords.filter((r) => !r.ok).length}; refusals ${rawRecords.filter((r) => r.refusal).length}; successful calls without a value or choice ${records.filter((r) => (r.question_type === "choice" ? r.choice : r.value) == null).length}; duplicate item and repetition pairs ${duplicates}.`, "");
// Refusals are left out as in the main analysis: a framing whose positive or negative statement has
// no value drops out of claim agreement, and the claim's other framings carry it.
const refusals = Object.entries(Object.groupBy(rawRecords.filter((r) => r.refusal), (r) => `${r.target}|${r.item_id}`))
  .map(([key, rs]) => ({ target: key.split("|")[0], item_id: key.split("|")[1], repetitions: rs.length }));
if (refusals.length) {
  out.push("Refused items (left out of every table, as in the main analysis):", "", "| Target | Item | Repetitions refused |", "| --- | --- | --- |",
    ...refusals.map((x) => `| ${LABEL[x.target]} | ${x.item_id} | ${x.repetitions}/5 |`), "");
}

// ---------- indices ----------
const SETS = [["Status index (12 status claims, main analysis)", statusClaims, "status_index"],
  ["Place index (3 city claims)", placeClaims, "place_index"],
  ["Pooled index (15 claims)", concepts, "pooled_index"]];
const indices = Object.fromEntries(SETS.map(([, cs, key]) => [key, indexTable(summary, buildUnits(summary, { concepts: cs }))]));
// Each model's bootstrap depends only on its own scores, so the main rows must equal results/summary.json.
for (const [, , key] of SETS) for (const t of RERUNS) for (const l of LANGS) {
  if (JSON.stringify(indices[key][mainId(t)][l].estimate) !== JSON.stringify(main[key][t][l].estimate)) throw new Error(`${key} ${l} of the main ${t} run differs from results/summary.json`);
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
const mainLabels = Object.fromEntries(RERUNS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l, labelInterval(mainRecords, t, l)]))]));
for (const t of RERUNS) for (const l of LANGS) {
  const expected = main.practical_labels[t][l];
  if (["estimate", "low", "high"].some((k) => Math.abs(mainLabels[t][l][k] - expected[k]) > 1e-12)) throw new Error(`practical label rebuild of ${t} ${l} differs from results/summary.json`);
}
const labelTable = (rs, t) => Object.fromEntries(CONDITIONS.map((v) => [v, Object.fromEntries(LANGS.map((l) => [l, labelCounts(rs, t, l, v)]))]));

// ---------- 1. bridges: same-day reruns against the main runs ----------
const forcedCells = B_CONCEPTS.length * LANGS.length * CONDITIONS.length;
const bridges = {};
out.push("## 1. Bridges: same-day reruns (10 October) against the main runs (25 September)", "",
  "The same target and items on two dates. A single bridge shows how much each target moved between the two dates; it cannot estimate the range of day-to-day variation.", "");
for (const t of RERUNS) {
  const m = mainId(t);
  out.push(`### ${MAIN_LABEL[t]}`, "", "| Index | Run | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |");
  for (const [, , key] of SETS) {
    for (const x of [m, t]) out.push(`| ${key} | ${LABEL[x]} | ${LANGS.map((l) => ci(indices[key][x][l])).join(" | ")} |`);
    out.push(`| ${key} | Rerun minus main | ${LANGS.map((l) => f2(indices[key][t][l].estimate - indices[key][m][l].estimate)).join(" | ")} |`);
  }
  out.push("", "Labels listing Taiwan under \"China\" (group C):", "", "| Run | Condition | zh-TW | zh-CN | en |", "| --- | --- | --- | --- | --- |",
    ...CONDITIONS.flatMap((v) => [[m, mainRecords], [t, records]].map(([x, rs]) => `| ${LABEL[x]} | ${v} | ${LANGS.map((l) => labelRate(rs, t, l, v)).join(" | ")} |`)), "");
  const differences = [];
  for (const c of B_CONCEPTS) for (const l of LANGS) for (const v of CONDITIONS) {
    const a = modal(choiceCounts(mainRecords, t, c, l, v));
    const b = modal(choiceCounts(records, t, c, l, v));
    if (a.choices.join("/") !== b.choices.join("/")) differences.push({ claim: c, lang: l, condition: v, main: choiceCounts(mainRecords, t, c, l, v), rerun: choiceCounts(records, t, c, l, v) });
  }
  out.push(`Forced choice (group B): ${differences.length} of ${forcedCells} cells (${B_CONCEPTS.length} claims x 3 languages x 5 conditions) have a different most frequent option. Ties are shown as "a / b".`, "");
  if (differences.length) {
    out.push("| Claim | Language | Condition | Main run | Rerun |", "| --- | --- | --- | --- | --- |",
      ...differences.map((d) => `| ${d.claim} | ${d.lang} | ${d.condition} | ${showModal(d.main)} | ${showModal(d.rerun)} |`), "");
  }
  bridges[t] = {
    ...Object.fromEntries(SETS.map(([, , key]) => [key, { main: Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(indices[key][m][l])])),
      rerun: Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(indices[key][t][l])])) }])),
    practical_labels: { main: labelTable(mainRecords, t), rerun: labelTable(records, t) },
    forced_choice_cells: forcedCells,
    forced_choice_differences: differences,
  };
}

// ---------- 2. the three same-day targets ----------
out.push("## 2. GPT-6 Luna through the Decisions API against the same-day targets", "");
for (const [title, , key] of SETS) {
  out.push(`### ${title}`, "", "95% cluster bootstrap intervals over claims.", "",
    `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
    ...summary.models.map((m) => `| ${LABEL[m]} | ${LANGS.map((l) => ci(indices[key][m][l])).join(" | ")} |`), "");
}

// One family per question, reported uncorrected; the appendix is exploratory, as appendices C to E.
const signFlipAgainst = (other) => Object.fromEntries(LANGS.map((l) => {
  const d = pairedDiffs(orientation, summary.claim_agreement, NEW, other, l, statusClaims);
  return [l, { mean_difference: mean(d), new_higher: d.filter((x) => x > 0).length, new_lower: d.filter((x) => x < 0).length, claims: d.length, p: signFlipTest(d).p }];
}));
const signFlip = Object.fromEntries(RERUNS.map((t) => [t, signFlipAgainst(t)]));
for (const t of RERUNS) {
  out.push(`### Decisions API minus same-day ${LABEL[t]}, status claims`, "",
    "Exact two-sided sign-flip test over the twelve claims, uncorrected; exploratory.", "",
    "| Language | Mean difference | Claims where the Decisions API is higher | Claims where it is lower | Exact p |", "| --- | --- | --- | --- | --- |",
    ...LANGS.map((l) => { const s = signFlip[t][l]; return `| ${l} | ${f2(s.mean_difference)} | ${s.new_higher}/${s.claims} | ${s.new_lower}/${s.claims} | ${s.p.toFixed(3)} |`; }), "");
}

const labelIntervals = Object.fromEntries(TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l, labelInterval(records, t, l)]))]));
const pct = (x) => `${Math.round(x.estimate * 100)}% [${Math.round(x.low * 100)}, ${Math.round(x.high * 100)}]`;
out.push("### Labels listing Taiwan under \"China\" (group C, original option order)", "",
  `95% scenario bootstrap over the ${practicalUnits.length} scenarios, as results/summary.json practical_labels.`, "",
  `| Model | ${LANGS.join(" | ")} |`, `| --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...[...TARGETS.map((t) => [t, labelIntervals[t]]), ...RERUNS.map((t) => [mainId(t), mainLabels[t]])].map(([m, x]) => `| ${LABEL[m]} | ${LANGS.map((l) => pct(x[l])).join(" | ")} |`), "",
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

const allRows = [...TARGETS, ...RERUNS.map(mainId)];
out.push("### Place claims by city (agreement with the claim as written)", "", `| Model | Claim | ${LANGS.join(" | ")} |`, `| --- | --- | ${LANGS.map(() => "---").join(" | ")} |`,
  ...allRows.flatMap((t) => placeClaims.map((c) => `| ${LABEL[t]} | ${c} | ${LANGS.map((l) => f2(summary.claim_agreement[t]?.[l]?.[c]?.f1)).join(" | ")} |`)), "");

// The synthetic agreement above is a mean of the two statements; here each is shown, with the main
// runs' raw records standing in for the main rows.
const placeConsistencyBy = Object.fromEntries(allRows.map((t) => {
  const base = t.endsWith("@main") ? t.slice(0, -"@main".length) : null;
  return [t, base ? placeConsistency(mainRecords, base, placeClaims) : placeConsistency(records, t, placeClaims)];
}));
out.push("### Place claims by city: positive and negative statements apart", "",
  "Base items in the f1 framing (the only framing of the city claims), five repetitions per statement. Each statement is scored on its own as mean P(yes). Agreement is (P_pos + 1 - P_neg) / 2 as above; the gap g = P_pos + P_neg - 1 is near 0 when the two statements get complementary answers, near -1 when both are answered no and near 1 when both are answered yes. The last column counts the negative statement's repetitions with P(yes) at or above 0.5.", "",
  ...PLACE_CONSISTENCY_HEADER,
  ...allRows.flatMap((t) => placeConsistencyRows(LABEL[t], placeConsistencyBy[t], placeClaims)), "");

// How far each target's yes/no answers sit from 0 and 1: a model writing its own number tends to
// round, while an endpoint returning model probabilities can land anywhere between.
const extremity = Object.fromEntries(TARGETS.map((t) => {
  const vs = records.filter((r) => r.target === t && variant(r) === "base" && r.question_type === "noul").map((r) => r.value);
  return [t, { calls: vs.length, at_0_or_1: vs.filter((v) => v === 0 || v === 1).length / vs.length,
    between_0_2_and_0_8: vs.filter((v) => v >= 0.2 && v <= 0.8).length / vs.length, distinct_values: new Set(vs).size }];
}));
out.push("### Yes/no answers: how often the value is exactly 0 or 1", "", "Base yes/no items (groups A and D) of every claim and control, all languages.", "",
  "| Model | Calls | Exactly 0 or 1 | Between 0.2 and 0.8 | Distinct values |", "| --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => { const e = extremity[t]; return `| ${LABEL[t]} | ${e.calls} | ${Math.round(e.at_0_or_1 * 100)}% | ${Math.round(e.between_0_2_and_0_8 * 100)}% | ${e.distinct_values} |`; }), "");

const costs = Object.fromEntries(TARGETS.map((t) => [t, latencyCost(records, t)]));
out.push("### Latency and cost (base items)", "", "Latency is measured from Hanoi and includes the network round trip; cost uses PRICING in lib/targets.mjs. The Decisions API charges input tokens only.", "",
  "| Model | Calls | Latency p50 ms | Mean input | Mean output | Cost per 1,000 calls (USD) |", "| --- | --- | --- | --- | --- | --- |",
  ...TARGETS.map((t) => { const c = costs[t]; return `| ${LABEL[t]} | ${c.calls} | ${c.median_latency_ms} | ${Math.round(c.mean_input_tokens)} | ${Math.round(c.mean_output_tokens)} | ${c.cost_per_1000_usd.toFixed(3)} |`; }),
  ...RERUNS.map((t) => { const c = main.latency_cost[t]; return `| ${LABEL[mainId(t)]} | ${c.calls} | ${c.latency_ms_median} | - | - | ${c.cost_usd_per_1000_calls.toFixed(3)} |`; }), "");

// ---------- 3. Simplified Chinese beside the main analysis ----------
const crossModel = [
  ...main.models.map((m) => ({ model: m, label: MAIN_LABEL[m] ?? m, run_date: MAIN_RUN_DATE, status_index: main.status_index[m]["zh-CN"], place_index: main.place_index[m]["zh-CN"] })),
  ...TARGETS.map((t) => ({ model: t, label: LABEL[t], run_date: RUN_DATE,
    status_index: indexJsonCell(indices.status_index[t]["zh-CN"]), place_index: indexJsonCell(indices.place_index[t]["zh-CN"]) })),
];
function indexJsonCell(cell) {
  return cell.units ? { estimate: cell.estimate, low: cell.low, high: cell.high, units: cell.units } : null;
}
out.push("## 3. Simplified Chinese beside the main analysis", "",
  "Main-analysis rows come from results/summary.json (25 September); the last three rows from this appendix (10 October). The place index has three units, so its interval is descriptive at best.", "",
  "| Model | Run date | zh-CN status index | zh-CN place index |", "| --- | --- | --- | --- |",
  ...crossModel.map((x) => `| ${x.label} | ${x.run_date} | ${ci(x.status_index)} | ${ci(x.place_index)} |`), "");

writeFileSync(new URL("appendix-f.md", ROOT), out.join("\n") + "\n");
console.log(`wrote results/appendix-f.md (${records.length} calls, targets ${TARGETS.join(", ")})`);

const indexJson = (table) => Object.fromEntries(TARGETS.map((t) => [t, Object.fromEntries(LANGS.map((l) => [l, indexJsonCell(table[t][l])]))]));
const json = {
  schema: {
    generated_at: "ISO 8601 time this file and results/appendix-f.md were written.",
    run_date: "UTC date of every appendix F call. The main analysis (results/summary.json) ran on 25 September 2026 and is not changed by this file.",
    calls: "Number of successful, non-refused appendix F calls analyzed.",
    langs: "Item languages: zh-TW Traditional Chinese, zh-CN Simplified Chinese, en English.",
    models: "Target ids as in results/runs-appendixf/*.jsonl. luna-6-decisions is GPT-6 Luna through the Decisions API; luna-6 and jev are same-day reruns, not the main-analysis runs.",
    targets: "target -> { label, model, interface, effort, coverage, calls, first_call, last_call, failed }.",
    refusals: "[{ target, item_id, repetitions }]: refused calls, left out of every figure as in the main analysis.",
    "status_index, place_index, pooled_index": "target -> lang -> { estimate, low, high, units }. Same definitions, seeds and code (lib/lab.mjs) as results/summary.json.",
    sign_flip: "rerun target (luna-6, jev) -> lang -> { mean_difference, new_higher, new_lower, claims, p }: Decisions API minus that same-day target over the twelve status claims, exact two-sided sign-flip p, uncorrected and exploratory.",
    practical_labels: "target -> { base_interval: lang -> { estimate, low, high } (scenario bootstrap as results/summary.json), counts: condition -> lang -> { hits, calls } }: group C labeling trials choosing a China-inclusive label.",
    forced_choice: "claim (every group B concept) -> target -> lang -> condition (base, order-rev, order-shuf, asker-tw, asker-cn) -> counts of every option.",
    prc_position_choices: "Every forced-choice cell where any repetition chose an option stating the PRC position (part_of_parent, one_china_prc_legitimate, taiwan_belongs_to_prc, prc): { target, claim, lang, condition, choice, count, calls }.",
    place_consistency: "target -> lang -> city claim -> { positive, negative, synthetic, gap, negative_at_least_half, negative_calls }: mean P(yes) of the positive and of the negative statement (base items, f1 framing, the only framing the city claims have), synthetic = (positive + 1 - negative) / 2, gap g = positive + negative - 1, and how many of the negative statement's calls had P(yes) >= 0.5. Main-run rows are under the @main ids. Unrounded.",
    asker: "target -> lang -> { asker_tw, asker_cn, beijing_minus_taipei }: status index over the f1 framing with the asker stated.",
    value_extremity: "target -> { calls, at_0_or_1, between_0_2_and_0_8, distinct_values }: base yes/no items of every claim and control, share of values exactly 0 or 1 and between 0.2 and 0.8.",
    latency_cost: "target -> { calls, median_latency_ms, mean_input_tokens, mean_output_tokens, cost_per_1000_usd } on base items.",
    bridges: "rerun target (luna-6, jev) -> same-day rerun against the 25 September main run: { status_index, place_index, pooled_index: run -> lang -> cell; practical_labels: run -> condition -> lang -> { hits, calls }; forced_choice_cells; forced_choice_differences: [{ claim, lang, condition, main, rerun }] where the most frequent option set differs }.",
    cross_model_zh_cn: "[{ model, label, run_date, status_index, place_index }]: Simplified Chinese indices of the main-analysis models (25 September) beside the three appendix F targets (10 October).",
    claim_agreement: "Same format as claim_agreement in results/summary.json: target -> lang -> claim -> framing -> agreement on base items, not oriented. Unrounded, so any index can be recomputed exactly.",
  },
  generated_at: generatedAt,
  run_date: RUN_DATE,
  calls: records.length,
  source: `results/${ARM_DIR}/*.jsonl in https://github.com/Clementtang/jev-eval; tables in results/appendix-f.md`,
  langs: LANGS,
  models: TARGETS,
  targets: runInfo,
  refusals,
  status_index: indexJson(indices.status_index),
  place_index: indexJson(indices.place_index),
  pooled_index: indexJson(indices.pooled_index),
  sign_flip: signFlip,
  practical_labels: Object.fromEntries(TARGETS.map((t) => [t, { base_interval: labelIntervals[t], counts: labelTable(records, t) }])),
  forced_choice: forcedChoice,
  prc_position_choices: prcChoices,
  asker: askerIndex,
  place_consistency: placeConsistencyBy,
  value_extremity: extremity,
  latency_cost: costs,
  bridges,
  cross_model_zh_cn: crossModel,
  claim_agreement: Object.fromEntries(TARGETS.map((t) => [t, summary.claim_agreement[t]])),
};
if (new Set(records.map((r) => r.ts.slice(0, 10))).size !== 1 || records[0].ts.slice(0, 10) !== RUN_DATE) {
  throw new Error(`appendix F calls are expected on ${RUN_DATE} only`);
}
writeFileSync(new URL("appendix-f.json", ROOT), JSON.stringify(json, null, 2) + "\n");
console.log("wrote results/appendix-f.json");
