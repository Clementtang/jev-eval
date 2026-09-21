// Shared item validation, used by the CLI validator and by the server before saving edits.
export const LANGS = ["zh-TW", "zh-CN", "en"];
export const GROUPS = ["A", "B", "C", "D", "K"];
const QUESTION_TYPES = ["noul", "choice"];
const MIN_CHOICE_OPTIONS = 2;

export function validateItem(item) {
  const problems = [];
  if (typeof item.id !== "string" || !/^[A-Za-z0-9._-]+$/.test(item.id)) problems.push("id must be a non-empty slug");
  if (!GROUPS.includes(item.group)) problems.push(`group must be one of ${GROUPS.join("/")}`);
  if (!LANGS.includes(item.lang)) problems.push(`lang must be one of ${LANGS.join("/")}`);
  for (const field of ["topic", "concept", "subject"]) {
    if (typeof item[field] !== "string" || !item[field]) problems.push(`${field} is required`);
  }
  if (item.state === null || typeof item.state !== "object" || !Object.keys(item.state).length) problems.push("state must be a non-empty object");
  const q = item.question;
  if (!q || !QUESTION_TYPES.includes(q.type)) {
    problems.push(`question.type must be one of ${QUESTION_TYPES.join("/")}`);
    return problems;
  }
  if (typeof q.instructions !== "string" || !q.instructions.trim()) problems.push("question.instructions is required");
  if (q.type === "noul") {
    if (!["pos", "neg"].includes(item.polarity)) problems.push("noul items need polarity pos/neg");
    if (item.expected !== null && item.expected !== undefined && ![0, 1].includes(item.expected)) problems.push("noul expected must be 0, 1 or null");
  }
  if (q.type === "choice") {
    const keys = Object.keys(q.criteria ?? {});
    if (keys.length < MIN_CHOICE_OPTIONS) problems.push(`choice needs at least ${MIN_CHOICE_OPTIONS} criteria`);
    if (keys.some((k) => !/^[a-z0-9_]+$/.test(k))) problems.push("choice keys must be snake_case ascii");
    if (item.expected && !keys.includes(item.expected)) problems.push("choice expected must be one of the criteria keys");
  }
  return problems;
}
