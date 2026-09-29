// Recomputes the index for any reader-chosen set of claims from results/summary.json, with the same
// cluster bootstrap, seeds and iteration count as scripts/stats.mjs. Used by the site's sensitivity
// lab in the browser and by its verification in Node, so both run exactly this code.
import { bootstrap, mean } from "./stats.mjs";

// Merged groups go after the single claims, in this order, as in stats.mjs section 17.
const MERGE_ORDER = ["place", "partOf"];

// options: { concepts: string[], mergePartOf: boolean, mergeCities: boolean }
// Returns units (arrays of claims) in the order stats.mjs builds them; order matters because the
// bootstrap resamples units by position.
export function buildUnits(summary, { concepts, mergePartOf = false, mergeCities = false }) {
  const { orientation, place_concepts: place, part_of_concepts: partOf } = summary.definitions;
  const selected = Object.keys(orientation).filter((c) => concepts.includes(c));
  const groups = { place: mergeCities ? place : [], partOf: mergePartOf ? partOf : [] };
  const merged = new Set([...groups.place, ...groups.partOf]);
  const units = selected.filter((c) => !merged.has(c)).map((c) => [c]);
  for (const name of MERGE_ORDER) {
    const members = groups[name].filter((c) => selected.includes(c));
    if (members.length) units.push(members);
  }
  return units;
}

// Oriented score of one claim: 1 supports Taiwan or ROC sovereignty, 0 the PRC position.
// framing "both" averages the wordings a claim has; "f1" keeps the first wording only.
export function claimScore(summary, model, lang, concept, framing = "both") {
  const byFraming = summary.claim_agreement[model]?.[lang]?.[concept] ?? {};
  const framings = framing === "f1" ? ["f1"] : Object.keys(byFraming);
  const direction = summary.definitions.orientation[concept];
  const values = framings.map((f) => byFraming[f]).filter((a) => a != null).map((a) => (direction > 0 ? a : 1 - a));
  return values.length ? mean(values) : null;
}

export function unitScore(summary, model, lang, unit, framing = "both") {
  const scores = unit.map((c) => claimScore(summary, model, lang, c, framing)).filter((x) => x != null);
  return scores.length ? mean(scores) : null;
}

// Index with its 95% percentile bootstrap interval for every model and language.
export function indexTable(summary, units, framing = "both") {
  const { iterations, seed } = summary.definitions.bootstrap.index;
  return Object.fromEntries(summary.models.map((model) => [model, Object.fromEntries(summary.langs.map((lang) => {
    const scores = units.map((u) => unitScore(summary, model, lang, u, framing));
    const statistic = (sample) => {
      const valid = sample.filter((x) => x != null);
      return valid.length ? mean(valid) : null;
    };
    const { estimate, low, high } = bootstrap(scores, statistic, { iterations, seed: seed[lang] });
    return [lang, { estimate, low, high, units: scores.filter((x) => x != null).length }];
  }))]));
}

// Jev against each other model: mean difference and how many units have Jev lower.
export function jevComparisons(summary, units, framing = "both") {
  return Object.fromEntries(summary.models.filter((m) => m !== "jev").map((model) => [model, Object.fromEntries(summary.langs.map((lang) => {
    const diffs = units.map((u) => {
      const jev = unitScore(summary, "jev", lang, u, framing);
      const other = unitScore(summary, model, lang, u, framing);
      return jev == null || other == null ? null : jev - other;
    }).filter((d) => d != null);
    return [lang, { diff: diffs.length ? mean(diffs) : null, jevLower: diffs.filter((d) => d < 0).length, n: diffs.length }];
  }))]));
}

export function presets(summary) {
  const { orientation, status_concepts: status, original_concepts: original, normative_concepts: normative } = summary.definitions;
  return {
    main: status,
    pooled: Object.keys(orientation),
    original,
    noNormative: status.filter((c) => !normative.includes(c)),
  };
}
