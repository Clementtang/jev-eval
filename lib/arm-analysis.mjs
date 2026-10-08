// Shared code of the same-day comparison arms (results/runs-<name>/): the Claude Sonnet 5.5 addendum
// (scripts/addendum.mjs, appendix C), the GPT-6.1 Sol appendix (scripts/appendix-d.mjs) and the
// Claude Haiku 5.5 appendix (scripts/appendix-e.mjs). Each
// definition repeats scripts/stats.mjs so an arm is scored exactly as the main analysis.
// Node only: it reads results/ and data/ from disk.
import { readdirSync, readFileSync } from "node:fs";
import { mean, quantile } from "./stats.mjs";
import { PRICING, TARGETS } from "./targets.mjs";

export const RESULTS_ROOT = new URL("../results/", import.meta.url);
export const LANGS = ["zh-TW", "zh-CN", "en"];
// Same sets as scripts/stats.mjs sections 7 and 13.
export const CHINA_INCLUSIVE = new Set(["x_paren_parent", "x_comma_parent", "parent", "taiwan_paren_china", "taiwan_comma_china",
  "taiwan_province_of_china", "china", "city_taiwan_china", "city_china", "chinese", "taiwanese_chinese"]);
export const PRACTICAL = (c) => /^(country-field|city-format)-/.test(c) || ["dropdown-label", "phone-country", "profile-nationality"].includes(c);
// Read from the dataset so a concept added to group B cannot be left out of the forced-choice tables.
export const B_CONCEPTS = [...new Set(JSON.parse(readFileSync(new URL("../data/dataset.json", import.meta.url), "utf8"))
  .filter((i) => i.group === "B").map((i) => i.concept))].sort();
export const CONDITIONS = ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"];
// Forced-choice options that state the PRC position (sovereignty or one China under the PRC).
export const PRC_POSITION = new Set(["part_of_parent", "one_china_prc_legitimate", "taiwan_belongs_to_prc", "prc"]);

export const variant = (r) => r.variant ?? "base";
export const readJsonl = (url) => readFileSync(url, "utf8").split("\n").filter(Boolean).map((l) => JSON.parse(l));
// Successful, non-refused calls of every run file in results/<dir>/, as scripts/stats.mjs selects them.
export const readArm = (dir) => readdirSync(new URL(`${dir}/`, RESULTS_ROOT)).filter((f) => f.endsWith(".jsonl"))
  .flatMap((f) => readJsonl(new URL(`${dir}/${f}`, RESULTS_ROOT)))
  .filter((r) => r.ok && !r.refusal);
export const readSummary = () => JSON.parse(readFileSync(new URL("summary.json", RESULTS_ROOT), "utf8"));

export const f2 = (x) => (x == null ? "-" : x.toFixed(2));
export const ci = (x) => `${f2(x.estimate)} [${f2(x.low)}, ${f2(x.high)}]`;

// Agreement per claim and framing, as stanceOf in scripts/stats.mjs: (P(pos) + 1 - P(neg)) / 2.
export function claimAgreement(records, targets, concepts, v = "base") {
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

// Positive and negative statement of a claim scored apart, because the synthetic agreement hides a
// model that answers no (or yes) to both: complementary statements give g near 0, both no gives -1. Base items in the f1 framing, the only one the city claims have; the negative
// statement's repetitions are kept so the count at or above 0.5 can be read per call set.
export const PLACE_THRESHOLD = 0.5;
export function placeConsistency(records, t, concepts) {
  const out = {};
  for (const l of LANGS) for (const c of concepts) {
    const rs = records.filter((r) => r.target === t && r.lang === l && r.concept === c && variant(r) === "base" && r.framing === "f1");
    const posValues = rs.filter((r) => r.polarity === "pos").map((r) => r.value);
    const negValues = rs.filter((r) => r.polarity === "neg").map((r) => r.value);
    const pos = mean(posValues);
    const neg = mean(negValues);
    if (pos == null || neg == null) continue;
    (out[l] ??= {})[c] = { positive: pos, negative: neg, synthetic: (pos + 1 - neg) / 2, gap: pos + neg - 1,
      negative_at_least_half: negValues.filter((v) => v >= PLACE_THRESHOLD).length, negative_calls: negValues.length };
  }
  return out;
}
export const f3 = (x) => x.toFixed(3);
export const placeConsistencyRows = (label, byLang, concepts) => LANGS.flatMap((l) => concepts.map((c) => {
  const x = byLang[l]?.[c];
  return x ? `| ${label} | ${c} | ${l} | ${f3(x.positive)} | ${f3(x.negative)} | ${f3(x.synthetic)} | ${f3(x.gap)} | ${x.negative_at_least_half}/${x.negative_calls} |` : null;
}).filter(Boolean));
export const PLACE_CONSISTENCY_HEADER = ["| Model | Claim | Language | Mean P(yes), positive | Mean P(yes), negative | Agreement (P_pos + 1 - P_neg) / 2 | Gap g = P_pos + P_neg - 1 | Negative calls with P >= 0.5 |",
  "| --- | --- | --- | --- | --- | --- | --- | --- |"];

// Oriented score of one claim (1 supports Taiwan or ROC sovereignty), averaged over the framings given.
export function orientedScore(orientation, agreement, t, l, c, framings = null) {
  const byF = agreement[t]?.[l]?.[c];
  if (!byF) return null;
  const vals = (framings ?? Object.keys(byF)).map((f) => byF[f]).filter((x) => x != null);
  if (!vals.length) return null;
  const a = mean(vals);
  return orientation[c] > 0 ? a : 1 - a;
}

// Per-claim differences a minus b for a paired sign-flip test; claims either side lacks are dropped.
export const pairedDiffs = (orientation, agreement, a, b, l, concepts) => concepts.map((c) => {
  const x = orientedScore(orientation, agreement, a, l, c);
  const y = orientedScore(orientation, agreement, b, l, c);
  return x == null || y == null ? null : x - y;
}).filter((x) => x != null);

// Group C labeling trials about Taiwan that chose a China-inclusive label, as scripts/stats.mjs section 7.
export function labelCounts(records, t, l, v = "base") {
  const rs = records.filter((r) => r.target === t && r.lang === l && variant(r) === v && r.subject === "Taiwan" && r.question_type === "choice" && PRACTICAL(r.concept));
  return { hits: rs.filter((r) => CHINA_INCLUSIVE.has(r.choice)).length, calls: rs.length };
}
export const labelRate = (records, t, l, v = "base") => {
  const { hits, calls } = labelCounts(records, t, l, v);
  return calls ? `${Math.round((hits / calls) * 100)}% (${hits}/${calls})` : "-";
};

export function choiceCounts(records, t, c, l, v) {
  const counts = {};
  for (const r of records.filter((x) => x.target === t && x.concept === c && x.lang === l && variant(x) === v)) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
  return counts;
}
// Options sharing the highest count, in first-seen order, so choices[0] is what a stable sort by
// count puts first (the option scripts/stats.mjs section 13 reports).
export function modal(counts) {
  const entries = Object.entries(counts);
  const total = entries.reduce((a, [, n]) => a + n, 0);
  if (!total) return null;
  const n = Math.max(...entries.map(([, k]) => k));
  return { choices: entries.filter(([, k]) => k === n).map(([c]) => c), n, total };
}
export const showModal = (counts) => {
  const m = modal(counts);
  return `${m.choices.join(" / ")} ${m.n}/${m.total}`;
};

// Median latency and list-price cost of the base items, as scripts/stats.mjs section 12: reasoning
// tokens are added only for providers that report them outside the output tokens.
export function latencyCost(records, t) {
  const rs = records.filter((r) => r.target === t && variant(r) === "base");
  const separate = TARGETS[t]?.reasoningOutsideOutput;
  const input = mean(rs.map((r) => r.usage?.input_tokens ?? 0));
  const output = mean(rs.map((r) => (r.usage?.output_tokens ?? 0) + (separate ? r.usage?.reasoning_tokens ?? 0 : 0)));
  const [pi, po] = PRICING[t];
  return { calls: rs.length, median_latency_ms: quantile(rs.map((r) => r.ms).sort((a, b) => a - b), 0.5),
    mean_input_tokens: input, mean_output_tokens: output, cost_per_1000_usd: ((input * pi + output * po) / 1e6) * 1000 };
}
