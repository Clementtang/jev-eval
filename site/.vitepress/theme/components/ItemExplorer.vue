<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
import {
  resultsUrl, CHOICE_PRC, CHOICE_TW, DATASET_URL, LANG_NAMES, LANG_SHORT, LANGS, RUNS_URL,
  f2, loadJson, modelName, orientedColor, plainColor, plainText, runDateLabel, textOn, type Lang, type Locale,
} from "../shared";
import { APPENDIX_ARMS } from "../../../../lib/addendum.mjs";

const props = defineProps<{ locale: Locale }>();
const locale = props.locale;

interface Wording { id: string; instructions: string; statement?: string; state: Record<string, string>; options?: Record<string, string> }
interface VariantWording { id: string; asker?: string; order?: string[] }
interface Aggregate { n: number; mean?: number; sd?: number; agreement?: number; counts?: Record<string, number> }
interface ItemType {
  id: string; group: string; topic: string; concept: string; subject: string; type: "noul" | "choice";
  polarity: "pos" | "neg" | null; framing: string; expected: number | string | null;
  index: "status" | "place" | null; direction: 1 | -1 | null; pair: string | null;
  text: Record<Lang, Wording>; variants: Record<string, Record<Lang, VariantWording>>;
  results: Record<string, Record<Lang, Record<string, Aggregate>>>;
}
interface Appendix { id: string; run_date: string; models: string[] }
interface Payload { models: string[]; appendices: Appendix[]; types: ItemType[] }

const T = {
  zh: {
    loading: "載入題庫中…",
    failed: "題庫資料載入失敗：",
    search: "搜尋題目文字、選項或主張代碼",
    group: "題組", type: "題型", lang: "語言", variant: "變體", index: "指數",
    all: "全部", noul: "是非題", choice: "選擇題",
    allLangs: "三種語言", withVariant: "有此變體",
    indexAll: "全部", indexStatus: "地位指數", indexPlace: "地點指數", indexAny: "計入任一指數", indexNone: "不計入指數",
    count: (n: number, total: number) => `${n} 個基準題型（共 ${total} 個）`,
    empty: "沒有符合條件的題目。",
    reset: "清除篩選",
    pos: "正句", neg: "反句",
    wording: "題目（三語並排）",
    options: "選項",
    results: "六個模型的結果",
    resultsWithAddendum: "六個模型與附錄模型的結果",
    agreementNote: "格內大字為同意度（正反句平均），小字為本句的平均機率 ± 標準差與重複次數。",
    choiceNote: "橫條為各選項被選的次數比例，下方為最常被選的選項與次數。",
    pairLink: "對應的另一句",
    permalink: "本題固定網址",
    copied: "已複製網址",
    copy: "複製網址",
    raw: "原始紀錄",
    rawRuns: "每次呼叫的 JSONL 紀錄",
    rawDataset: "dataset.json 題庫",
    itemIds: "題目代號",
    statusBadge: "地位指數", placeBadge: "地點指數",
    directionPlus: "同意即支持台灣或中華民國主權（研究者編碼 +）",
    directionMinus: "同意即支持中華人民共和國立場（研究者編碼 −）",
    expected: "正確答案",
    noData: "無資料",
    asker: "提問者",
    order: "選項順序",
    close: "收合",
    showAddendum: "顯示附錄模型（附錄 C 2026-09-29、附錄 D 2026-10-01）",
    armHead: (id: string, date: string) => `附錄 ${id}：${date} 另行執行，不屬主分析`,
    notTested: "未測",
    appendixIntro: "主分析的六個模型在 2026 年 9 月 25 日執行，每個附錄各在另一天執行，論文的推論只依據主分析。",
    armNotes: {
      C: "附錄 C 在 9 月 29 日執行。同日重跑 Claude Sonnet 5，是為了把模型版本的差異與執行日期的差異分開。effort high 只測了 12 個地位主張的原題，其他題目顯示「未測」。統計結果見",
      D: "附錄 D 在 10 月 1 日執行，同日重跑 GPT-6 Sol 的用途相同。統計結果見",
    } as Record<string, string>,
    colon: "：", sep: "、", period: "。",
  },
  en: {
    loading: "Loading the items…",
    failed: "Could not load the item data: ",
    search: "Search item text, options or claim codes",
    group: "Group", type: "Type", lang: "Language", variant: "Variant", index: "Index",
    all: "All", noul: "Yes or no", choice: "Choice",
    allLangs: "All three", withVariant: "Has this variant",
    indexAll: "All", indexStatus: "Status index", indexPlace: "Place index", indexAny: "In either index", indexNone: "Not in an index",
    count: (n: number, total: number) => `${n} of ${total} base item types`,
    empty: "No items match these filters.",
    reset: "Clear filters",
    pos: "Positive", neg: "Negated",
    wording: "Wording in three languages",
    options: "Options",
    results: "Results of the six models",
    resultsWithAddendum: "Results of the six models and the appendix models",
    agreementNote: "The large figure is the agreement (positive and negated sentences combined); the small one is this sentence's mean probability ± standard deviation and the number of repeats.",
    choiceNote: "Bars show the share of repeats choosing each option; below is the most chosen option and its count.",
    pairLink: "Paired sentence",
    permalink: "Link to this item",
    copied: "Link copied",
    copy: "Copy link",
    raw: "Raw records",
    rawRuns: "JSONL record of every call",
    rawDataset: "dataset.json item set",
    itemIds: "Item ids",
    statusBadge: "Status index", placeBadge: "Place index",
    directionPlus: "Agreeing supports Taiwan or ROC sovereignty (researcher coding +)",
    directionMinus: "Agreeing supports the PRC position (researcher coding −)",
    expected: "Correct answer",
    noData: "no data",
    asker: "Asker",
    order: "Option order",
    close: "Close",
    showAddendum: "Show appendix models (appendix C 29 Sep, appendix D 1 Oct 2026)",
    armHead: (id: string, date: string) => `Appendix ${id}: run separately on ${date}, outside the main analysis`,
    notTested: "not tested",
    appendixIntro: "The six main models ran on 25 September 2026, and each appendix ran on a day of its own; the paper's inferences rest on the main analysis only.",
    armNotes: {
      C: "Appendix C ran on 29 September. Claude Sonnet 5 was rerun on the same day to separate the change of model version from the change of run date. Effort high answered only the original items of the 12 status claims; other items show \"not tested\". Statistics in",
      D: "Appendix D ran on 1 October, with a same-day rerun of GPT-6 Sol for the same purpose. Statistics in",
    } as Record<string, string>,
    colon: ": ", sep: ", ", period: ".",
  },
}[props.locale];

const GROUPS: Record<Locale, Record<string, string>> = {
  zh: { A: "A 主張", B: "B 立場選擇", C: "C 實務標籤", D: "D 對照地區", F: "F 民調", K: "K 能力基準" },
  en: { A: "A Claims", B: "B Stance choice", C: "C Practical labels", D: "D Comparison regions", F: "F Surveys", K: "K Capability baseline" },
};
const VARIANTS: Record<Locale, Record<string, string>> = {
  zh: { base: "原題", "order-rev": "反序", "order-shuf": "隨機序", "asker-tw": "提問者台北", "asker-cn": "提問者北京" },
  en: { base: "Original", "order-rev": "Reversed order", "order-shuf": "Shuffled order", "asker-tw": "Asker in Taipei", "asker-cn": "Asker in Beijing" },
};
const groupNames = GROUPS[props.locale];
const variantNames = VARIANTS[props.locale];
const langNames = LANG_NAMES[props.locale];
const langShort = LANG_SHORT[props.locale];
const defaultLang: Lang = props.locale === "zh" ? "zh-TW" : "en";

const data = ref<Payload | null>(null);
const error = ref("");
const query = ref("");
const group = ref("");
const type = ref("");
const lang = ref<"" | Lang>("");
const variant = ref("");
const index = ref("");
const openId = ref("");
const openVariant = ref("base");
const copiedId = ref("");
const showAddendum = ref(false);
const HIGH_EFFORT = "claude-sonnet-5-5-high@addendum";

const rowModels = computed(() => (data.value ? [...data.value.models, ...(showAddendum.value ? data.value.appendices.flatMap((a) => a.models) : [])] : []));
// The appendix whose group heading goes above model m: set only on the arm's first model.
const armHeadOf = (m: string) => data.value?.appendices.find((a) => a.models[0] === m) ?? null;
const isAppendixModel = (m: string) => data.value?.appendices.some((a) => a.models.includes(m)) ?? false;
const armMarkdown = (id: string) => APPENDIX_ARMS.find((arm) => arm.id === id)!.markdown;
const displayLang = computed<Lang>(() => lang.value || defaultLang);
const byId = computed(() => new Map((data.value?.types ?? []).map((t) => [t.id, t])));

function haystack(item: ItemType) {
  const langs = lang.value ? [lang.value] : LANGS;
  const parts = [item.id, item.concept, item.subject];
  for (const l of langs) {
    const w = item.text[l];
    if (!w) continue;
    parts.push(w.id, w.instructions, w.statement ?? "", ...Object.values(w.state), ...Object.values(w.options ?? {}));
  }
  return parts.join(" ").toLowerCase();
}

const filtered = computed(() => {
  const q = query.value.trim().toLowerCase().split(/\s+/).filter(Boolean);
  return (data.value?.types ?? []).filter((item) =>
    (!group.value || item.group === group.value) &&
    (!type.value || item.type === type.value) &&
    (!variant.value || variant.value === "base" || item.variants[variant.value]) &&
    (!index.value || (index.value === "any" ? item.index != null : index.value === "none" ? item.index == null : item.index === index.value)) &&
    (!q.length || q.every((word) => haystack(item).includes(word))));
});

function summaryText(item: ItemType, l: Lang) {
  const w = item.text[l];
  if (!w) return "";
  if (w.statement) return w.statement;
  const context = Object.values(w.state).join(props.locale === "zh" ? "；" : "; ");
  if (!context) return w.instructions;
  return props.locale === "zh" ? `${w.instructions}（${context}）` : `${w.instructions} (${context})`;
}

function availableVariants(item: ItemType) {
  return ["base", "order-rev", "order-shuf", "asker-tw", "asker-cn"].filter((v) => item.results[v]);
}

// Option letters follow the base order, so a letter means the same option in every variant.
function optionKeys(item: ItemType) {
  return Object.keys(item.text[defaultLang]?.options ?? item.text["zh-TW"]?.options ?? {});
}
const letter = (i: number) => String.fromCharCode(65 + i);

function optionColor(item: ItemType, key: string, i: number) {
  if (item.subject === "Taiwan" && CHOICE_PRC.has(key)) return "#c4406f";
  if (item.subject === "Taiwan" && CHOICE_TW.has(key)) return "#1f8a78";
  const greys = ["#8d919b", "#b9bcc4", "#6b707a", "#d3d5da", "#a3a7b0", "#5a5e66"];
  return greys[i % greys.length];
}

function cellStyle(item: ItemType, agg: Aggregate | undefined) {
  const a = agg?.agreement;
  if (a == null) return {};
  if (item.direction) {
    const oriented = item.direction > 0 ? a : 1 - a;
    return { background: orientedColor(oriented), color: textOn(oriented) };
  }
  return { background: plainColor(a), color: plainText(a) };
}

function topOption(item: ItemType, agg: Aggregate | undefined) {
  if (!agg?.counts) return "";
  const keys = optionKeys(item);
  const [key, count] = Object.entries(agg.counts).sort((a, b) => b[1] - a[1])[0] ?? [];
  if (!key) return "";
  const i = keys.indexOf(key);
  return `${i >= 0 ? letter(i) : key} ${count}/${agg.n}`;
}

function segments(item: ItemType, agg: Aggregate | undefined) {
  if (!agg?.counts) return [];
  return optionKeys(item).map((key, i) => ({ key, width: ((agg.counts?.[key] ?? 0) / agg.n) * 100, color: optionColor(item, key, i) }))
    .filter((s) => s.width > 0);
}

function permalink(id: string) {
  return `${location.origin}${location.pathname}#item=${encodeURIComponent(id)}`;
}

async function copyLink(id: string) {
  try {
    await navigator.clipboard.writeText(permalink(id));
    copiedId.value = id;
  } catch (e) {
    // Clipboard access can be refused; the visible link still works, so report and carry on.
    console.warn("clipboard write failed", e);
  }
}

function toggle(item: ItemType) {
  if (openId.value === item.id) {
    openId.value = "";
    history.replaceState(null, "", location.pathname + location.search);
    return;
  }
  openId.value = item.id;
  openVariant.value = variant.value && item.results[variant.value] ? variant.value : "base";
  history.replaceState(null, "", `#item=${encodeURIComponent(item.id)}`);
}

function resetFilters() {
  query.value = group.value = type.value = lang.value = variant.value = index.value = "";
}

async function openFromHash() {
  const match = location.hash.match(/^#item=(.+)$/);
  if (!match) return;
  const id = decodeURIComponent(match[1]);
  if (!byId.value.has(id)) return;
  if (!filtered.value.some((t) => t.id === id)) resetFilters();
  openId.value = id;
  openVariant.value = "base";
  await nextTick();
  document.getElementById(`item-${id}`)?.scrollIntoView({ block: "start" });
}

watch(variant, (v) => {
  const item = byId.value.get(openId.value);
  if (item) openVariant.value = v && item.results[v] ? v : "base";
});

onMounted(async () => {
  try {
    data.value = await loadJson<Payload>("items.json");
    await openFromHash();
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
  window.addEventListener("hashchange", openFromHash);
});
onBeforeUnmount(() => window.removeEventListener("hashchange", openFromHash));
</script>

<template>
  <div class="explorer">
    <p v-if="error" class="state error">{{ T.failed }}{{ error }}</p>
    <p v-else-if="!data" class="state">{{ T.loading }}</p>
    <template v-else>
      <div class="controls">
        <input v-model="query" class="search" type="search" :placeholder="T.search" :aria-label="T.search" />
        <label>
          <span>{{ T.group }}</span>
          <select v-model="group">
            <option value="">{{ T.all }}</option>
            <option v-for="(name, key) in groupNames" :key="key" :value="key">{{ name }}</option>
          </select>
        </label>
        <label>
          <span>{{ T.type }}</span>
          <select v-model="type">
            <option value="">{{ T.all }}</option>
            <option value="noul">{{ T.noul }}</option>
            <option value="choice">{{ T.choice }}</option>
          </select>
        </label>
        <label>
          <span>{{ T.lang }}</span>
          <select v-model="lang">
            <option value="">{{ T.allLangs }}</option>
            <option v-for="l in LANGS" :key="l" :value="l">{{ langNames[l] }}</option>
          </select>
        </label>
        <label>
          <span>{{ T.variant }}</span>
          <select v-model="variant">
            <option value="">{{ T.all }}</option>
            <option v-for="(name, key) in variantNames" :key="key" :value="key">{{ name }}</option>
          </select>
        </label>
        <label>
          <span>{{ T.index }}</span>
          <select v-model="index">
            <option value="">{{ T.indexAll }}</option>
            <option value="status">{{ T.indexStatus }}</option>
            <option value="place">{{ T.indexPlace }}</option>
            <option value="any">{{ T.indexAny }}</option>
            <option value="none">{{ T.indexNone }}</option>
          </select>
        </label>
      </div>
      <label class="addendum-toggle"><input v-model="showAddendum" type="checkbox" /> {{ T.showAddendum }}</label>
      <p class="count">
        {{ T.count(filtered.length, data.types.length) }}
        <button v-if="query || group || type || lang || variant || index" type="button" class="link-button" @click="resetFilters">{{ T.reset }}</button>
      </p>
      <p v-if="!filtered.length" class="state">{{ T.empty }}</p>
      <ul class="items">
        <li v-for="item in filtered" :id="`item-${item.id}`" :key="item.id" :class="{ open: openId === item.id }">
          <button type="button" class="row" :aria-expanded="openId === item.id" @click="toggle(item)">
            <span class="meta">
              <span class="chip">{{ item.group }}</span>
              <span class="chip">{{ item.type === "noul" ? T.noul : T.choice }}</span>
              <span v-if="item.polarity" class="chip">{{ item.polarity === "pos" ? T.pos : T.neg }} {{ item.framing }}</span>
              <span v-if="item.index" class="chip index">{{ item.index === "status" ? T.statusBadge : T.placeBadge }}</span>
              <code>{{ item.concept }}</code>
            </span>
            <span class="summary">{{ summaryText(item, displayLang) }}</span>
          </button>

          <div v-if="openId === item.id" class="detail">
            <p v-if="item.direction" class="direction" :class="item.direction > 0 ? 'plus' : 'minus'">
              {{ item.direction > 0 ? T.directionPlus : T.directionMinus }}
            </p>
            <h4>{{ T.wording }}</h4>
            <div class="wording">
              <div v-for="l in LANGS" :key="l" class="lang-col" :class="{ dim: lang && lang !== l }">
                <div class="lang-name">{{ langNames[l] }}</div>
                <p class="instructions">{{ item.text[l].instructions }}</p>
                <p v-if="item.text[l].statement" class="statement">{{ item.text[l].statement }}</p>
                <p v-for="(value, key) in item.text[l].state" :key="key" class="state-line"><span class="key">{{ key }}</span> {{ value }}</p>
                <ul v-if="item.text[l].options" class="options">
                  <li v-for="(text, key, i) in item.text[l].options" :key="key">
                    <span class="swatch" :style="{ background: optionColor(item, String(key), i) }" />
                    <b>{{ letter(i) }}</b> {{ text }} <code>{{ key }}</code>
                  </li>
                </ul>
                <p v-if="openVariant !== 'base' && item.variants[openVariant]?.[l]?.asker" class="variant-line">
                  {{ T.asker }}{{ T.colon }}{{ item.variants[openVariant][l].asker }}
                </p>
                <p v-if="openVariant !== 'base' && item.variants[openVariant]?.[l]?.order" class="variant-line">
                  {{ T.order }}{{ T.colon }}{{ item.variants[openVariant][l].order!.map((k) => letter(optionKeys(item).indexOf(k))).join(" ") }}
                </p>
              </div>
            </div>
            <p v-if="item.expected != null" class="expected">{{ T.expected }}{{ T.colon }}{{ item.expected }}</p>

            <h4>{{ showAddendum ? T.resultsWithAddendum : T.results }}</h4>
            <div class="variant-tabs" role="tablist">
              <button v-for="v in availableVariants(item)" :key="v" type="button" role="tab" :aria-selected="openVariant === v" :class="{ active: openVariant === v }" @click="openVariant = v">
                {{ variantNames[v] }}
              </button>
            </div>
            <div class="table-wrap">
              <table class="results">
                <thead>
                  <tr>
                    <th />
                    <th v-for="l in LANGS" :key="l" :class="{ dim: lang && lang !== l }">{{ langShort[l] }}</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="m in rowModels" :key="m">
                  <tr v-if="armHeadOf(m)" class="addendum-head">
                    <th :colspan="LANGS.length + 1" scope="rowgroup">{{ T.armHead(armHeadOf(m)!.id, runDateLabel(armHeadOf(m)!.run_date, locale)) }}</th>
                  </tr>
                  <tr :class="{ addendum: isAppendixModel(m) }">
                    <th scope="row">{{ modelName(m, locale) }}</th>
                    <td v-for="l in LANGS" :key="l" :class="{ dim: lang && lang !== l }">
                      <template v-if="!item.results[openVariant]?.[l]?.[m]">
                        <span class="none">{{ m === HIGH_EFFORT ? T.notTested : T.noData }}</span>
                      </template>
                      <template v-else-if="item.type === 'noul'">
                        <div class="agree" :style="cellStyle(item, item.results[openVariant][l][m])">{{ f2(item.results[openVariant][l][m].agreement) }}</div>
                        <div class="sub">{{ f2(item.results[openVariant][l][m].mean) }} ± {{ f2(item.results[openVariant][l][m].sd) }} n={{ item.results[openVariant][l][m].n }}</div>
                      </template>
                      <template v-else>
                        <div class="bar">
                          <span v-for="s in segments(item, item.results[openVariant][l][m])" :key="s.key" :style="{ width: `${s.width}%`, background: s.color }" :title="s.key" />
                        </div>
                        <div class="sub">{{ topOption(item, item.results[openVariant][l][m]) }}</div>
                      </template>
                    </td>
                  </tr>
                  </template>
                </tbody>
              </table>
            </div>
            <p class="note">{{ item.type === "noul" ? T.agreementNote : T.choiceNote }}</p>
            <div v-if="showAddendum" class="note addendum-note">
              <p>{{ T.appendixIntro }}</p>
              <p v-for="a in data.appendices" :key="a.id">{{ T.armNotes[a.id] }} <a :href="resultsUrl(armMarkdown(a.id))">results/{{ armMarkdown(a.id) }}</a>{{ T.period }}</p>
            </div>
            <p v-if="item.pair" class="note">
              {{ T.pairLink }}{{ T.colon }}<a :href="`#item=${item.pair}`">{{ item.pair }}</a>
            </p>

            <div class="links">
              <a :href="`#item=${encodeURIComponent(item.id)}`">{{ T.permalink }}</a>
              <button type="button" class="link-button" @click="copyLink(item.id)">{{ copiedId === item.id ? T.copied : T.copy }}</button>
              <span>{{ T.raw }}{{ T.colon }}<a :href="RUNS_URL">{{ T.rawRuns }}</a>{{ T.sep }}<a :href="DATASET_URL">{{ T.rawDataset }}</a></span>
            </div>
            <p class="ids">
              {{ T.itemIds }}{{ T.colon }}<code v-for="l in LANGS" :key="l">{{ item.text[l].id }}</code>
              <template v-for="(langs, v) in item.variants" :key="v">
                <code v-for="l in LANGS" :key="`${v}-${l}`">{{ langs[l]?.id }}</code>
              </template>
            </p>
          </div>
        </li>
      </ul>
    </template>
  </div>
</template>

<style scoped>
.explorer {
  margin-top: 24px;
}
.state {
  color: var(--vp-c-text-2);
}
.state.error {
  color: var(--jev-pink);
}
.controls {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 10px 12px;
}
.controls .search {
  grid-column: 1 / -1;
}
.controls label {
  display: flex;
  flex-direction: column;
  gap: 2px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  min-width: 0;
}
input,
select {
  width: 100%;
  min-width: 0;
  border: 1px solid var(--jev-rule);
  border-radius: 6px;
  background: #ffffff;
  padding: 7px 10px;
  font: inherit;
  font-size: 15px;
  color: var(--vp-c-text-1);
}
select {
  appearance: auto;
}
.addendum-toggle {
  display: inline-flex;
  gap: 6px;
  align-items: center;
  margin-top: 12px;
  font-size: 14px;
  cursor: pointer;
}
.addendum-toggle input {
  width: auto;
}
.results tr.addendum-head th {
  background: var(--jev-panel);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-2);
  text-align: left;
}
.results tr.addendum th,
.results tr.addendum td {
  background: #f7f6f2;
}
.addendum-note {
  border-left: 3px solid var(--jev-rule);
  padding-left: 8px;
}
.addendum-note p {
  margin: 0 0 4px !important;
}
.count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 14px 0 8px;
}
.link-button {
  color: var(--vp-c-brand-1);
  text-decoration: underline;
  text-underline-offset: 3px;
  margin-left: 8px;
  font-size: 14px;
}
.items {
  list-style: none;
  padding: 0 !important;
  margin: 0;
  border-top: 1px solid var(--jev-rule);
}
.items > li {
  margin: 0 !important;
  border-bottom: 1px solid var(--jev-rule);
  scroll-margin-top: calc(var(--vp-nav-height) + 16px);
}
.row {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
  width: 100%;
  padding: 10px 4px;
  text-align: left;
}
.row:hover,
.open .row {
  background: var(--jev-panel);
}
.meta {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  align-items: center;
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}
.meta code {
  font-size: 12.5px;
  word-break: break-all;
}
.chip {
  border: 1px solid var(--jev-rule);
  border-radius: 4px;
  padding: 0 6px;
  line-height: 1.6;
}
.chip.index {
  border-color: var(--jev-green);
  color: var(--jev-green-dark);
}
.summary {
  font-size: 15.5px;
  line-height: 1.6;
  color: var(--vp-c-text-1);
}
.detail {
  padding: 4px 4px 18px;
  background: var(--jev-panel);
}
.detail h4 {
  font-size: 15px;
  margin: 16px 0 8px;
}
.direction {
  font-size: 13.5px;
  margin: 0;
  padding: 4px 8px;
  border-left: 4px solid;
}
.direction.plus {
  border-color: var(--jev-green);
}
.direction.minus {
  border-color: var(--jev-pink);
}
.wording {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}
.lang-col {
  background: #ffffff;
  border: 1px solid var(--jev-rule);
  border-radius: 6px;
  padding: 10px 12px;
  font-size: 14.5px;
  line-height: 1.6;
  min-width: 0;
  overflow-wrap: anywhere;
}
.dim {
  opacity: 0.45;
}
.lang-name {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}
.lang-col p {
  margin: 4px 0 !important;
  text-align: left !important;
}
.statement {
  font-weight: 600;
}
.state-line .key {
  font-size: 12px;
  color: var(--vp-c-text-2);
}
.options {
  margin: 6px 0 0 !important;
  padding-left: 0 !important;
  list-style: none !important;
}
.options li {
  margin: 2px 0 !important;
  text-align: left !important;
}
.options code,
.ids code {
  font-size: 11.5px;
}
.swatch {
  display: inline-block;
  width: 10px;
  height: 10px;
  border-radius: 2px;
  margin-right: 4px;
  vertical-align: baseline;
}
.variant-line {
  font-size: 13px;
  color: var(--vp-c-text-2);
}
.expected {
  font-size: 14px;
}
.variant-tabs {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: 8px;
}
.variant-tabs button {
  border: 1px solid var(--jev-rule);
  border-radius: 14px;
  padding: 2px 12px;
  font-size: 13.5px;
  background: #ffffff;
}
.variant-tabs button.active {
  background: var(--jev-green);
  border-color: var(--jev-green);
  color: #ffffff;
}
.table-wrap {
  overflow-x: auto;
}
.results {
  display: table !important;
  width: 100%;
  margin: 0 !important;
  table-layout: fixed;
}
.results th,
.results td {
  padding: 6px 8px !important;
  vertical-align: top;
  font-size: 13.5px;
}
.results thead th:first-child {
  width: 32%;
}
.results tbody th {
  text-align: left;
  font-weight: 500;
  background: transparent;
}
.results tr {
  background: #ffffff !important;
}
.agree {
  border-radius: 4px;
  text-align: center;
  font-weight: 700;
  font-size: 15px;
  padding: 2px 0;
}
.sub {
  font-size: 11.5px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
  line-height: 1.4;
}
.none {
  color: var(--vp-c-text-2);
  font-size: 12px;
}
.bar {
  display: flex;
  height: 14px;
  border-radius: 3px;
  overflow: hidden;
  background: #eeede8;
}
.bar span {
  display: block;
  height: 100%;
}
.note {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 8px 0 0 !important;
}
.links {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 16px;
  align-items: baseline;
  margin-top: 12px;
  font-size: 14px;
}
.links .link-button {
  margin-left: 0;
}
.ids {
  font-size: 12px;
  color: var(--vp-c-text-2);
  margin: 8px 0 0 !important;
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  text-align: left !important;
}

@media (max-width: 760px) {
  .controls {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
  .wording {
    grid-template-columns: minmax(0, 1fr);
  }
  .results th,
  .results td {
    padding: 5px 4px !important;
    font-size: 12.5px;
  }
  .results thead th:first-child {
    width: 28%;
  }
}
</style>
