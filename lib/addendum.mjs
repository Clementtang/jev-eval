// The appendix arms as the site shows them: appendix C (the 29 September addendum,
// results/runs-addendum/, results/addendum.json), appendix D (GPT-6.1 Sol, results/runs-appendixd/,
// results/appendix-d.json) and appendix E (Claude Haiku 5.5, results/runs-appendixe/,
// results/appendix-e.json). Each ran on its own day, outside the main analysis.
// Browser-safe: the sensitivity lab imports it, so it must not import node modules.

// Arm targets reuse main-analysis ids (claude-sonnet-5, sol-6, claude-haiku-4-5), so each arm gets its own suffix on the
// site. Appendix C keeps "@addendum" so links and item-browser data published before appendix D
// still resolve. Targets are listed in display order: the new model first, then the same-day rerun.
export const APPENDIX_ARMS = [
  { id: "C", suffix: "@addendum", runDate: "2026-09-29", runsDir: "runs-addendum", data: "addendum.json", markdown: "addendum.md",
    targets: ["claude-sonnet-5-5", "claude-sonnet-5", "claude-sonnet-5-5-high"] },
  { id: "D", suffix: "@appendix-d", runDate: "2026-10-01", runsDir: "runs-appendixd", data: "appendix-d.json", markdown: "appendix-d.md",
    targets: ["sol-6-1", "sol-6"] },
  { id: "E", suffix: "@appendix-e", runDate: "2026-10-08", runsDir: "runs-appendixe", data: "appendix-e.json", markdown: "appendix-e.md",
    targets: ["claude-haiku-5-5", "claude-haiku-4-5", "claude-haiku-5-5-medium"] },
];
export const armModels = (arm) => arm.targets.map((t) => t + arm.suffix);
export const APPENDIX_MODELS = APPENDIX_ARMS.flatMap(armModels);
export const armOf = (model) => APPENDIX_ARMS.find((arm) => model.endsWith(arm.suffix)) ?? null;
export const isAppendix = (model) => armOf(model) != null;
// The provider target behind a site id, for pricing and token rules.
export const baseTarget = (model) => {
  const arm = armOf(model);
  return arm ? model.slice(0, -arm.suffix.length) : model;
};

// Appendix C names kept for scripts/verify-addendum.mjs and other readers of the addendum alone.
const [ADDENDUM] = APPENDIX_ARMS;
export const ADDENDUM_SUFFIX = ADDENDUM.suffix;
export const ADDENDUM_TARGETS = ADDENDUM.targets;
export const ADDENDUM_RUN_DATE = ADDENDUM.runDate;

// A summary-shaped object with the main models first and the appendix models after them, so
// lib/lab.mjs can compute every index in one pass. Each model's bootstrap depends only on its own
// scores and the per-language seed, so adding models leaves the main numbers unchanged.
// armData maps an arm id to its results JSON (claim_agreement keyed by plain target); arms without
// data are skipped.
export function mergeAppendices(summary, armData) {
  const extra = APPENDIX_ARMS.flatMap((arm) => arm.targets
    .filter((t) => armData[arm.id]?.claim_agreement[t])
    .map((t) => [t + arm.suffix, armData[arm.id].claim_agreement[t]]));
  return {
    ...summary,
    models: [...summary.models, ...extra.map(([m]) => m)],
    claim_agreement: { ...summary.claim_agreement, ...Object.fromEntries(extra) },
  };
}
