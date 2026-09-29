// The 29 September addendum (results/runs-addendum/, results/addendum.json) as the site shows it.
// Browser-safe: the sensitivity lab imports it, so it must not import node modules.

// Addendum targets reuse main-analysis ids (claude-sonnet-5), so they get a suffix on the site.
export const ADDENDUM_SUFFIX = "@addendum";
export const ADDENDUM_TARGETS = ["claude-sonnet-5-5", "claude-sonnet-5", "claude-sonnet-5-5-high"];
export const ADDENDUM_RUN_DATE = "2026-09-29";
export const isAddendum = (model) => model.endsWith(ADDENDUM_SUFFIX);

// A summary-shaped object with the main models first and the addendum models after them, so
// lib/lab.mjs can compute every index in one pass. Each model's bootstrap depends only on its own
// scores and the per-language seed, so adding models leaves the main numbers unchanged.
export function mergeAddendum(summary, addendum) {
  const extra = ADDENDUM_TARGETS.filter((t) => addendum.claim_agreement[t]);
  return {
    ...summary,
    models: [...summary.models, ...extra.map((t) => t + ADDENDUM_SUFFIX)],
    claim_agreement: {
      ...summary.claim_agreement,
      ...Object.fromEntries(extra.map((t) => [t + ADDENDUM_SUFFIX, addendum.claim_agreement[t]])),
    },
  };
}
