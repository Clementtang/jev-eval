// Payload for the site's item browser: every item grouped by base item type, with its wording in
// the three languages and per-model aggregates over all analyzed calls. Imports no SDK.
import { readFileSync } from "node:fs";
import { LANGS, variantOf } from "./schema.mjs";
import { listRuns, readRun } from "./results.mjs";
import { mean, sd } from "./stats.mjs";
import { addendumRecords, loadDataset } from "./replay.mjs";
import { ADDENDUM_RUN_DATE, ADDENDUM_SUFFIX, ADDENDUM_TARGETS } from "./addendum.mjs";

const SUMMARY = new URL("../results/summary.json", import.meta.url);

const DECIMALS = 4;
const round = (x) => (x == null ? null : Number(x.toFixed(DECIMALS)));

// One base item type = the same item in every language: the id minus its language segment.
export const typeIdOf = (item) => item.id.replace(/--.*$/, "").replace(new RegExp(`-${item.lang}(?=-|$)`), "");

// The base item carries the full wording; variants only add an asker line or reorder options.
function wording(item) {
  const { question, state } = item;
  return {
    id: item.id,
    instructions: question.instructions,
    ...(state.statement ? { statement: state.statement } : {}),
    state: Object.fromEntries(Object.entries(state).filter(([key]) => key !== "statement" && key !== "asker")),
    ...(question.criteria ? { options: question.criteria } : {}),
  };
}

function variantWording(item) {
  return {
    id: item.id,
    ...(item.state.asker ? { asker: item.state.asker } : {}),
    ...(item.question.criteria ? { order: Object.keys(item.question.criteria) } : {}),
  };
}

function aggregate(records, questionType) {
  if (questionType === "choice") {
    const counts = {};
    for (const r of records) counts[r.choice] = (counts[r.choice] ?? 0) + 1;
    return { n: records.length, counts };
  }
  const values = records.map((r) => r.value).filter((v) => v != null);
  return { n: values.length, mean: mean(values), sd: sd(values) };
}

// Means and sd are rounded for size; agreement stays unrounded because values such as 0.945
// would round to a different two-decimal figure than results/stats.md shows.
const roundAggregate = (agg) => ({ ...agg, ...(agg.mean != null ? { mean: round(agg.mean), sd: round(agg.sd) } : {}) });

export function buildItems() {
  const summary = JSON.parse(readFileSync(SUMMARY, "utf8"));
  const { orientation, status_concepts: statusConcepts, place_concepts: placeConcepts } = summary.definitions;
  const dataset = loadDataset();
  // Same selection as scripts/stats.mjs: successful calls that were not refusals.
  const records = listRuns().flatMap((r) => readRun(r.run_id) ?? []).filter((r) => r.ok && !r.refusal);
  const extra = addendumRecords().filter((r) => r.ok && !r.refusal);
  const byItem = new Map();
  for (const r of [...records, ...extra]) {
    if (!byItem.has(r.item_id)) byItem.set(r.item_id, new Map());
    const perTarget = byItem.get(r.item_id);
    if (!perTarget.has(r.target)) perTarget.set(r.target, []);
    perTarget.get(r.target).push(r);
  }

  const types = new Map();
  for (const item of dataset) {
    const typeId = typeIdOf(item);
    if (!types.has(typeId)) {
      const indexed = statusConcepts.includes(item.concept) ? "status" : placeConcepts.includes(item.concept) ? "place" : null;
      types.set(typeId, {
        id: typeId, group: item.group, topic: item.topic, concept: item.concept, subject: item.subject,
        type: item.question.type, polarity: item.polarity, framing: item.framing, expected: item.expected ?? null,
        index: indexed, direction: indexed ? orientation[item.concept] : null,
        pair: null, text: {}, variants: {}, results: {},
      });
    }
    const entry = types.get(typeId);
    const v = variantOf(item);
    if (v === "base") entry.text[item.lang] = wording(item);
    else (entry.variants[v] ??= {})[item.lang] = variantWording(item);
    const perTarget = byItem.get(item.id) ?? new Map();
    const cell = ((entry.results[v] ??= {})[item.lang] ??= {});
    for (const [target, rs] of perTarget) cell[target] = aggregate(rs, item.question.type);
  }

  // Agreement pairs a statement with its negation: (P(pos) + 1 - P(neg)) / 2, as in stats.mjs.
  for (const entry of types.values()) {
    if (entry.type !== "noul") continue;
    const other = entry.id.replace(/-(pos|neg)(-f\d+)$/, (_, p, f) => `-${p === "pos" ? "neg" : "pos"}${f}`);
    if (!types.has(other)) continue;
    entry.pair = other;
    const pos = entry.polarity === "pos" ? entry : types.get(other);
    const neg = entry.polarity === "pos" ? types.get(other) : entry;
    for (const [v, langs] of Object.entries(entry.results)) for (const [lang, cell] of Object.entries(langs)) {
      for (const [target, agg] of Object.entries(cell)) {
        const p = pos.results[v]?.[lang]?.[target]?.mean;
        const n = neg.results[v]?.[lang]?.[target]?.mean;
        if (p != null && n != null) agg.agreement = (p + 1 - n) / 2;
      }
    }
  }

  const models = summary.models;
  const addendumModels = ADDENDUM_TARGETS.map((t) => t + ADDENDUM_SUFFIX).filter((m) => extra.some((r) => r.target === m));
  const shown = [...models, ...addendumModels];
  return {
    about: {
      license: "CC BY 4.0 (https://creativecommons.org/licenses/by/4.0/)",
      source: "data/dataset.json and results/runs/*.jsonl in https://github.com/Clementtang/jev-eval",
      calls: records.length,
      items: dataset.length,
      schema: {
        types: "One entry per base item type; text holds the base wording per language, variants the option-order and asker variants.",
        "types[].index": "status or place when the claim enters that index, else null; direction is the researcher coding (+1 agreeing supports Taiwan or ROC sovereignty, -1 supports the PRC position).",
        "types[].results": "variant -> lang -> model -> aggregate over repeats. Yes or no items: n, mean and sd of the returned probability, and agreement = (P(positive) + 1 - P(negated)) / 2 when the pair exists. Choice items: n and counts per option key.",
        addendum: "Addendum run on 29 September 2026 (results/runs-addendum/, results/addendum.md), outside the main analysis. Its models carry the suffix @addendum in types[].results; claude-sonnet-5@addendum is the same-day rerun of Claude Sonnet 5, and claude-sonnet-5-5-high@addendum answered the status claims only.",
      },
    },
    langs: LANGS,
    models,
    addendum: { run_date: ADDENDUM_RUN_DATE, calls: extra.length, models: addendumModels },
    types: [...types.values()].map((entry) => ({
      ...entry,
      results: Object.fromEntries(Object.entries(entry.results).map(([v, langs]) => [v, Object.fromEntries(Object.entries(langs).map(([l, cell]) =>
        [l, Object.fromEntries(shown.filter((m) => cell[m]).map((m) => [m, roundAggregate(cell[m])]))]))])),
    })),
  };
}
