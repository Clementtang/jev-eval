// Model targets and prices, kept free of SDK imports so the static site export can read them
// without installing the provider SDKs.

// Pinned instead of jev-latest so a silent model update cannot change results mid-study.
export const JEV_MODEL = "jev-1.13.0";
export const TARGETS = {
  jev: { provider: "typesafe", model: JEV_MODEL, keyEnv: "TYPESAFE_API_KEY" },
  "claude-opus-5-5": { provider: "anthropic", model: "claude-opus-5-5", keyEnv: "ANTHROPIC_API_KEY" },
  // xAI and OpenAI both speak the chat-completions shape with JSON-schema structured output.
  // xAI reports reasoning tokens outside completion_tokens (output ~9, reasoning ~500 per call);
  // OpenAI counts them inside completion_tokens. Cost adds reasoning only when it is separate.
  "grok-4-7": { provider: "openai-compatible", model: "grok-4.7", baseUrl: "https://api.x.ai/v1", keyEnv: "XAI_API_KEY", reasoningEffort: "low", reasoningOutsideOutput: true },
  "luna-6": { provider: "openai-compatible", model: "gpt-6-luna", baseUrl: "https://api.openai.com/v1", keyEnv: "OPENAI_API_KEY" },
  "sol-6": { provider: "openai-compatible", model: "gpt-6-sol", baseUrl: "https://api.openai.com/v1", keyEnv: "OPENAI_API_KEY" },
  // Kept so the first-round records stay replayable.
  "claude-sonnet-5": { provider: "anthropic", model: "claude-sonnet-5", keyEnv: "ANTHROPIC_API_KEY" },
  "claude-haiku-4-5": { provider: "anthropic", model: "claude-haiku-4-5", keyEnv: "ANTHROPIC_API_KEY", effort: false },
  "claude-opus-5": { provider: "anthropic", model: "claude-opus-5", keyEnv: "ANTHROPIC_API_KEY" },
};
// USD per million tokens [input, output]; Jev output is free per TypeSafe's model page.
export const PRICING = {
  jev: [0.042, 0],
  "claude-sonnet-5": [2, 10],
  "claude-opus-5": [5, 25],
  // Verified 2026-09-24 from each vendor's pricing page.
  "claude-opus-5-5": [4, 20],
  "grok-4-7": [2, 6],
  "luna-6": [0.1, 0.5],
  "sol-6": [2, 10],
  "claude-haiku-4-5": [1, 5],
};
