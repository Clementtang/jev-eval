// Labels and colour coding shared by the item browser and the sensitivity lab.
import { withBase } from "vitepress";

export type Locale = "zh" | "en";
export const LANGS = ["zh-TW", "zh-CN", "en"] as const;
export type Lang = (typeof LANGS)[number];

export const REPO_URL = "https://github.com/Clementtang/jev-eval";
export const RUNS_URL = `${REPO_URL}/tree/main/results/runs`;
export const DATASET_URL = `${REPO_URL}/blob/main/data/dataset.json`;
export const STATS_URL = `${REPO_URL}/blob/main/results/stats.md`;

export const COLORS = { green: "#1f8a78", pink: "#c4406f", grey: "#b9bcc4" };

export const MODEL_NAMES: Record<string, string> = {
  jev: "Jev",
  "claude-haiku-4-5": "Claude Haiku 4.5",
  "claude-sonnet-5": "Claude Sonnet 5",
  "grok-4-7": "Grok 4.7",
  "luna-6": "GPT-6 Luna",
  "sol-6": "GPT-6 Sol",
};

export const LANG_NAMES: Record<Locale, Record<Lang, string>> = {
  zh: { "zh-TW": "繁體中文", "zh-CN": "簡體中文", en: "英文" },
  en: {
    "zh-TW": "Traditional Chinese",
    "zh-CN": "Simplified Chinese",
    en: "English",
  },
};
export const LANG_SHORT: Record<Locale, Record<Lang, string>> = {
  zh: { "zh-TW": "繁中", "zh-CN": "簡中", en: "英文" },
  en: { "zh-TW": "zh-TW", "zh-CN": "zh-CN", en: "en" },
};

// Same sets as public/stance.html (CHOICE_PRC, CHOICE_TW): researcher coding of which options
// state the PRC position and which state Taiwan's separate status. Applied to Taiwan items only.
export const CHOICE_PRC = new Set([
  "part_of_parent",
  "one_china_prc_legitimate",
  "prc",
  "taiwan_belongs_to_prc",
  "chinese",
  "taiwanese_chinese",
  "x_paren_parent",
  "x_comma_parent",
  "parent",
  "taiwan_paren_china",
  "taiwan_comma_china",
  "taiwan_province_of_china",
  "china",
  "city_taiwan_china",
  "city_china",
]);
export const CHOICE_TW = new Set([
  "sovereign_state",
  "de_facto_limited_recognition",
  "two_separate_states",
  "taiwanese_people",
  "roc",
  "taiwanese",
  "x",
  "taiwan",
  "city_taiwan",
]);

export const dataUrl = (name: string) => withBase(`/data/${name}`);

export async function loadJson<T>(name: string): Promise<T> {
  const response = await fetch(dataUrl(name));
  if (!response.ok) throw new Error(`${name}: HTTP ${response.status}`);
  return response.json() as Promise<T>;
}

const hex = (c: string) =>
  [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16));
const mix = (a: string, b: string, t: number) => {
  const [x, y] = [hex(a), hex(b)];
  return `rgb(${x.map((v, i) => Math.round(v + (y[i] - v) * t)).join(", ")})`;
};

// Diverging scale on an oriented value: 0 pink (PRC position), 0.5 grey, 1 green.
export function orientedColor(value: number) {
  return value < 0.5
    ? mix(COLORS.pink, COLORS.grey, value / 0.5)
    : mix(COLORS.grey, COLORS.green, (value - 0.5) / 0.5);
}
// Text stays readable on the saturated ends of the scale.
export const textOn = (value: number) =>
  Math.abs(value - 0.5) > 0.3 ? "#ffffff" : "#1b1f24";

// Unoriented agreement for claims outside the indices: lighter means less agreement.
export const plainColor = (value: number) => mix("#f1f0ec", "#6b707a", value);
export const plainText = (value: number) =>
  value > 0.6 ? "#ffffff" : "#1b1f24";

export const f2 = (x: number | null | undefined) =>
  x == null ? "-" : x.toFixed(2);
