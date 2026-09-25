// Calls Jev and the Claude comparison models with the same item, and normalizes both
// into one result shape so the analysis never needs to know which provider answered.
import Anthropic from "@anthropic-ai/sdk";

const JEV_URL = "https://api.typesafe.ai/v1/systemone";
// Pinned instead of jev-latest so a silent model update cannot change results mid-study.
export const JEV_MODEL = "jev-1.13.0";
export const TARGETS = {
  jev: { provider: "typesafe", model: JEV_MODEL, keyEnv: "TYPESAFE_API_KEY" },
  "claude-opus-5-5": { provider: "anthropic", model: "claude-opus-5-5", keyEnv: "ANTHROPIC_API_KEY" },
  // xAI and OpenAI both speak the chat-completions shape with JSON-schema structured output.
  "grok-4-7": { provider: "openai-compatible", model: "grok-4.7", baseUrl: "https://api.x.ai/v1", keyEnv: "XAI_API_KEY" },
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
const JEV_TIMEOUT_MS = 30_000;
const JEV_MAX_ATTEMPTS = 4;
const CLAUDE_MAX_TOKENS = 4096;

export function availableTargets() {
  return Object.fromEntries(Object.entries(TARGETS).map(([name, t]) => [name, Boolean(process.env[t.keyEnv])]));
}

export async function runItem(target, item) {
  const spec = TARGETS[target];
  if (!spec) throw new Error(`unknown target ${target}`);
  const started = performance.now();
  const call = {
    typesafe: () => callJev(item),
    anthropic: () => callClaude(spec.model, item, spec.effort !== false),
    "openai-compatible": () => callOpenAICompatible(spec, item),
  }[spec.provider];
  const result = await call();
  return { target, model: spec.model, ms: Math.round(performance.now() - started), ...result };
}

async function callJev(item) {
  const body = JSON.stringify({ model: JEV_MODEL, state: item.state, questions: { q: item.question } });
  let lastError = "no attempt made";
  for (let attempt = 0; attempt < JEV_MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 2 ** attempt * 500));
    try {
      const response = await fetch(JEV_URL, {
        method: "POST",
        headers: { Authorization: `Bearer ${process.env.TYPESAFE_API_KEY}`, "Content-Type": "application/json" },
        body,
        signal: AbortSignal.timeout(JEV_TIMEOUT_MS),
      });
      const text = await response.text();
      if (response.status === 429 || response.status >= 500) {
        lastError = `Jev HTTP ${response.status}: ${text.slice(0, 200)}`;
        continue;
      }
      if (!response.ok) return { ok: false, error: `Jev HTTP ${response.status}: ${text.slice(0, 300)}` };
      const data = JSON.parse(text);
      const answer = data.answers?.q;
      if (!answer) return { ok: false, error: `Jev response missing answer: ${text.slice(0, 300)}` };
      return {
        ok: true,
        model: data.model,
        value: answer.type === "noul" ? answer.noul : null,
        choice: answer.type === "choice" ? answer.choice : null,
        probabilities: answer.probabilities ?? null,
        confidence: answer.confidence ?? null,
        usage: data.usage ?? null,
      };
    } catch (error) {
      lastError = `Jev request failed: ${error.message}`;
    }
  }
  return { ok: false, error: `${lastError} (after ${JEV_MAX_ATTEMPTS} attempts)` };
}

let anthropic;
const SYSTEM_PROMPT = [
  "You are a structured decision model used inside software.",
  "You receive a JSON state and one question about it. Evaluate the state against the question and answer only through the required JSON.",
].join(" ");

function claudeFormat(question) {
  if (question.type === "noul") {
    return {
      instruction: "Return probability_yes: the probability from 0 to 1 that the answer to the question is yes (0 means no, 1 means yes).",
      schema: { type: "object", properties: { probability_yes: { type: "number" } }, required: ["probability_yes"], additionalProperties: false },
    };
  }
  return {
    instruction: "Return choice: the key of the single option whose description best fits.",
    schema: { type: "object", properties: { choice: { type: "string", enum: Object.keys(question.criteria) } }, required: ["choice"], additionalProperties: false },
  };
}

async function callClaude(model, item, useEffort = true) {
  // Keys not scoped to a workspace must name one per request.
  anthropic ??= new Anthropic(process.env.ANTHROPIC_WORKSPACE_ID
    ? { defaultHeaders: { "anthropic-workspace-id": process.env.ANTHROPIC_WORKSPACE_ID } }
    : {});
  const { instruction, schema } = claudeFormat(item.question);
  const payload = { state: item.state, question: { type: item.question.type, instructions: item.question.instructions, options: item.question.criteria } };
  try {
    // No server-side refusal fallback on purpose: a fallback would silently swap in another
    // model's answer, and a refusal is itself a data point for this study.
    const response = await anthropic.messages.create({
      model,
      max_tokens: CLAUDE_MAX_TOKENS,
      system: SYSTEM_PROMPT,
      output_config: { ...(useEffort ? { effort: "low" } : {}), format: { type: "json_schema", schema } },
      messages: [{ role: "user", content: `${JSON.stringify(payload, null, 2)}\n\n${instruction}` }],
    });
    const usage = { input_tokens: response.usage.input_tokens, output_tokens: response.usage.output_tokens };
    if (response.stop_reason === "refusal") {
      return { ok: true, refusal: true, value: null, choice: null, usage, stop_details: response.stop_details ?? null };
    }
    const text = response.content.find((block) => block.type === "text")?.text;
    if (!text) return { ok: false, error: `Claude returned no text (stop_reason ${response.stop_reason})`, usage };
    const parsed = JSON.parse(text);
    return {
      ok: true,
      value: item.question.type === "noul" ? Math.min(1, Math.max(0, Number(parsed.probability_yes))) : null,
      choice: item.question.type === "choice" ? parsed.choice : null,
      probabilities: null,
      confidence: null,
      usage,
    };
  } catch (error) {
    return { ok: false, error: `Claude ${model} failed: ${error.status ?? ""} ${error.message}` };
  }
}

// xAI (Grok) and OpenAI share the chat-completions shape, so one function covers both.
// The prompt is the same payload Claude receives, so the three providers see identical wording.
// Grok 4.7 can think for a while, so the ceiling is generous and transient failures retry.
const OPENAI_TIMEOUT_MS = 300_000;
const OPENAI_MAX_ATTEMPTS = 3;
async function callOpenAICompatible(spec, item) {
  const { instruction, schema } = claudeFormat(item.question);
  const payload = { state: item.state, question: { type: item.question.type, instructions: item.question.instructions, options: item.question.criteria } };
  let lastError = "no attempt made";
  for (let attempt = 0; attempt < OPENAI_MAX_ATTEMPTS; attempt++) {
    if (attempt > 0) await new Promise((r) => setTimeout(r, 2 ** attempt * 1000));
    try {
      const response = await fetch(`${spec.baseUrl}/chat/completions`, {
      method: "POST",
      headers: { Authorization: `Bearer ${process.env[spec.keyEnv]}`, "Content-Type": "application/json" },
      signal: AbortSignal.timeout(OPENAI_TIMEOUT_MS),
      body: JSON.stringify({
        model: spec.model,
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: `${JSON.stringify(payload, null, 2)}\n\n${instruction}` },
        ],
        response_format: { type: "json_schema", json_schema: { name: "answer", strict: true, schema } },
      }),
    });
      const text = await response.text();
      if (response.status === 429 || response.status >= 500) {
        lastError = `${spec.model} HTTP ${response.status}: ${text.slice(0, 200)}`;
        continue;
      }
      if (!response.ok) return { ok: false, error: `${spec.model} HTTP ${response.status}: ${text.slice(0, 300)}` };
      const data = JSON.parse(text);
      const usage = { input_tokens: data.usage?.prompt_tokens ?? 0, output_tokens: data.usage?.completion_tokens ?? 0 };
      const choice = data.choices?.[0];
      if (choice?.finish_reason === "content_filter") return { ok: true, refusal: true, value: null, choice: null, usage };
      const content = choice?.message?.content;
      if (!content) return { ok: false, error: `${spec.model} returned no content: ${text.slice(0, 300)}`, usage };
      const parsed = JSON.parse(content);
      return {
        ok: true,
        value: item.question.type === "noul" ? Math.min(1, Math.max(0, Number(parsed.probability_yes))) : null,
        choice: item.question.type === "choice" ? parsed.choice : null,
        probabilities: null,
        confidence: null,
        usage,
      };
    } catch (error) {
      lastError = `${spec.model} failed: ${error.message}`;
    }
  }
  return { ok: false, error: `${lastError} (after ${OPENAI_MAX_ATTEMPTS} attempts)` };
}
