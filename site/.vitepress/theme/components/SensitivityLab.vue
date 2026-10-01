<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { withBase } from "vitepress";
// scripts/verify-lab.mjs checks this same module against results/stats.md.
import { buildUnits, indexTable, jevComparisons, presets } from "../../../../lib/lab.mjs";
import { APPENDIX_ARMS, APPENDIX_MODELS, armOf, mergeAppendices } from "../../../../lib/addendum.mjs";
import { resultsUrl, LANG_SHORT, LANGS, STATS_URL, f2, loadJson, modelName, runDateLabel, orientedColor, textOn, type Lang, type Locale } from "../shared";

const props = defineProps<{ locale: Locale }>();
const locale = props.locale;

interface Summary {
  models: string[];
  langs: Lang[];
  definitions: { orientation: Record<string, number>; status_concepts: string[]; place_concepts: string[]; part_of_concepts: string[] };
}
interface ArmData { run_date: string; claim_agreement: Record<string, unknown> }
interface ItemsPayload { types: { group: string; concept: string; polarity: string | null; framing: string; text: Record<Lang, { statement?: string }> }[] }

const T = {
  zh: {
    loading: "載入資料中…",
    failed: "資料載入失敗：",
    presets: "預設組合",
    presetNames: { main: "論文主分析（12 個地位主張）", pooled: "15 個主張合併", original: "原 7 個主張", noNormative: "地位主張，不含規範題（10）" },
    claims: "納入指數的主張",
    status: "地位主張",
    place: "地點主張（城市）",
    plus: "同意即支持台灣或中華民國主權",
    minus: "同意即支持中華人民共和國立場",
    options: "計算選項",
    mergePartOf: "「一部分」與「一個省」合併為一個單位",
    mergeCities: "三個城市合併為一個單位",
    framing: "措辭",
    framingBoth: "兩種措辭平均（論文作法）",
    framingF1: "只用 f1 措辭",
    units: (units: number, claims: number) => `目前 ${claims} 個主張，${units} 個單位`,
    none: "請至少勾選一個主張。",
    indexTitle: "指數與 95% bootstrap 區間",
    indexNote: "0 表示完全同意中華人民共和國的立場，0.5 為中立，1 表示完全同意台灣或中華民國是主權國家。以單位為抽樣單位重抽 10,000 次，種子與 scripts/stats.mjs 相同，因此論文主分析的組合會重現論文表 3 的數值。",
    compareTitle: "Jev 與各模型的比較",
    compareNote: "每格為 Jev 減該模型的平均差值，以及 Jev 較低的單位數／單位總數。",
    jevLower: "Jev 較低",
    model: "模型",
    exploratory: "自選主張組合屬探索性分析，不做多重比較校正，因此本頁不顯示 p 值。論文的推論只以主分析為準，其他組合的檢定與跨集合校正見",
    paperLink: "論文 3.3 節",
    statsLink: "統計檔第 17 節",
    and: "與",
    period: "。",
    appendices: "附錄模型（另日執行，不屬主分析）",
    appendixIntro: "主分析的六個模型在 2026 年 9 月 25 日執行，每個附錄各在另一天執行。附錄模型不列入下方與 Jev 的比較。",
    armNotes: {
      C: "附錄 C 在 9 月 29 日執行。同日重跑 Claude Sonnet 5，是為了把模型版本的差異與執行日期的差異分開。effort high 只測了 12 個地位主張，勾選的主張含其他主張時顯示「未測」。統計結果見",
      D: "附錄 D 在 10 月 1 日執行，同日重跑 GPT-6 Sol 的用途相同。統計結果見",
    } as Record<string, string>,
    armHead: (id: string, date: string) => `附錄 ${id}：${date} 另行執行，不屬主分析`,
    notTested: "未測",
  },
  en: {
    loading: "Loading data…",
    failed: "Could not load the data: ",
    presets: "Presets",
    presetNames: { main: "Paper's main analysis (12 status claims)", pooled: "All 15 claims pooled", original: "Original 7 claims", noNormative: "Status claims without normative ones (10)" },
    claims: "Claims in the index",
    status: "Status claims",
    place: "Place claims (cities)",
    plus: "agreeing supports Taiwan or ROC sovereignty",
    minus: "agreeing supports the PRC position",
    options: "Options",
    mergePartOf: "Merge \"part of\" and \"province of\" into one unit",
    mergeCities: "Merge the three cities into one unit",
    framing: "Wording",
    framingBoth: "Average both wordings (as in the paper)",
    framingF1: "Wording f1 only",
    units: (units: number, claims: number) => `${claims} claims in ${units} units`,
    none: "Select at least one claim.",
    indexTitle: "Index with 95% bootstrap interval",
    indexNote: "0 means full agreement with the PRC position, 0.5 is neutral and 1 means full agreement that Taiwan or the ROC is a sovereign state. Units are resampled 10,000 times with the seeds of scripts/stats.mjs, so the paper's main set reproduces Table 3 of the paper.",
    compareTitle: "Jev compared with each model",
    compareNote: "Each cell shows Jev minus that model, averaged over units, and the number of units on which Jev is lower out of all units.",
    jevLower: "Jev lower",
    model: "Model",
    exploratory: "A self-chosen set of claims is an exploratory analysis with no correction for multiple comparisons, so this page shows no p-values. The paper's inferences rest on the main analysis only; for tests of the other sets and the correction across sets see",
    paperLink: "section 3.3 of the paper",
    statsLink: "section 17 of the statistics file",
    and: " and ",
    period: ".",
    appendices: "Appendix models (run on other days, outside the main analysis)",
    appendixIntro: "The six main models ran on 25 September 2026, and each appendix ran on a day of its own. Appendix models are left out of the comparison with Jev below.",
    armNotes: {
      C: "Appendix C ran on 29 September. Claude Sonnet 5 was rerun on the same day to separate the change of model version from the change of run date. Effort high answered the 12 status claims only, so it shows \"not tested\" when the selection includes other claims. Statistics in",
      D: "Appendix D ran on 1 October, with a same-day rerun of GPT-6 Sol for the same purpose. Statistics in",
    } as Record<string, string>,
    armHead: (id: string, date: string) => `Appendix ${id}: run separately on ${date}, outside the main analysis`,
    notTested: "not tested",
  },
}[props.locale];

const summary = ref<(Summary & Record<string, unknown>) | null>(null);
const armData = ref<Record<string, ArmData> | null>(null);
const shownAppendix = ref<string[]>([]);
const statements = ref<Record<string, string>>({});
const error = ref("");
const selected = ref<string[]>([]);
const mergePartOf = ref(false);
const mergeCities = ref(false);
const framing = ref<"both" | "f1">("both");
const statementLang: Lang = props.locale === "zh" ? "zh-TW" : "en";
const langShort = LANG_SHORT[props.locale];
const paperHref = withBase(props.locale === "zh" ? "/paper#_3-3-量測指標" : "/en/paper#_3-3-measures");

const presetList = computed(() => (summary.value ? presets(summary.value) : {}) as Record<string, string[]>);
const statusClaims = computed(() => summary.value?.definitions.status_concepts ?? []);
const placeClaims = computed(() => summary.value?.definitions.place_concepts ?? []);

function applyPreset(name: string) {
  selected.value = [...presetList.value[name]];
  mergePartOf.value = false;
  mergeCities.value = false;
  framing.value = "both";
}
const activePreset = computed(() => {
  if (mergePartOf.value || mergeCities.value || framing.value !== "both") return "";
  const key = [...selected.value].sort().join();
  return Object.entries(presetList.value).find(([, cs]) => [...cs].sort().join() === key)?.[0] ?? "";
});

const units = computed(() => (summary.value ? buildUnits(summary.value, { concepts: selected.value, mergePartOf: mergePartOf.value, mergeCities: mergeCities.value }) : []));
// Only the ticked appendix models are bootstrapped; the main models come first as in the paper.
const tableSummary = computed(() => {
  if (!summary.value || !armData.value) return summary.value;
  const merged = mergeAppendices(summary.value, armData.value);
  return { ...merged, models: merged.models.filter((m: string) => summary.value!.models.includes(m) || shownAppendix.value.includes(m)) };
});
// The arm whose group heading goes above model m: set only on the first shown model of each arm.
const armHeadOf = (m: string) => {
  const arm = armOf(m);
  return arm && tableSummary.value!.models.find((x: string) => armOf(x) === arm) === m ? arm : null;
};
const table = computed(() => (tableSummary.value && units.value.length ? indexTable(tableSummary.value, units.value, framing.value) : null));
// A cell missing some units (effort high has no place claims) would be a different index.
const complete = (m: string, l: Lang) => table.value![m][l].units === units.value.length;
const comparisons = computed(() => (summary.value && units.value.length ? jevComparisons(summary.value, units.value, framing.value) : null));

// Interval drawn on a 0 to 1 axis; percentages position the marks.
const pct = (x: number) => `${Math.min(100, Math.max(0, x * 100))}%`;
const signed = (x: number | null) => (x == null ? "-" : `${x < 0 ? "−" : "+"}${Math.abs(x).toFixed(2)}`);

onMounted(async () => {
  try {
    const [s, items, ...arms] = await Promise.all([
      loadJson<Summary & Record<string, unknown>>("summary.json"), loadJson<ItemsPayload>("items.json"),
      ...APPENDIX_ARMS.map((arm) => loadJson<ArmData>(arm.data)),
    ]);
    const text: Record<string, string> = {};
    for (const t of items.types) {
      if (t.group === "A" && t.polarity === "pos" && t.framing === "f1" && t.text[statementLang]?.statement) text[t.concept] = t.text[statementLang].statement!;
    }
    statements.value = text;
    armData.value = Object.fromEntries(APPENDIX_ARMS.map((arm, i) => [arm.id, arms[i] as ArmData]));
    summary.value = s;
    applyPreset("main");
  } catch (e) {
    error.value = e instanceof Error ? e.message : String(e);
  }
});
</script>

<template>
  <div class="lab">
    <p v-if="error" class="state error">{{ T.failed }}{{ error }}</p>
    <p v-else-if="!summary" class="state">{{ T.loading }}</p>
    <template v-else>
      <p class="exploratory">
        {{ T.exploratory }} <a :href="paperHref">{{ T.paperLink }}</a>{{ T.and }}<a :href="STATS_URL">{{ T.statsLink }}</a>{{ T.period }}
      </p>

      <div class="panel">
        <h3>{{ T.presets }}</h3>
        <div class="presets">
          <button v-for="(_, name) in presetList" :key="name" type="button" :class="{ active: activePreset === name }" @click="applyPreset(String(name))">
            {{ T.presetNames[name as keyof typeof T.presetNames] }}
          </button>
        </div>

        <h3>{{ T.claims }}</h3>
        <div class="claim-groups">
          <fieldset v-for="group in [{ label: T.status, claims: statusClaims }, { label: T.place, claims: placeClaims }]" :key="group.label">
            <legend>{{ group.label }}</legend>
            <label v-for="c in group.claims" :key="c" class="claim">
              <input v-model="selected" type="checkbox" :value="c" />
              <span class="sign" :class="summary.definitions.orientation[c] > 0 ? 'plus' : 'minus'" :title="summary.definitions.orientation[c] > 0 ? T.plus : T.minus">{{ summary.definitions.orientation[c] > 0 ? "+" : "−" }}</span>
              <span class="claim-text">{{ statements[c] ?? c }} <code>{{ c }}</code></span>
            </label>
          </fieldset>
        </div>
        <p class="legend">
          <span><span class="sign plus">+</span> {{ T.plus }}</span>
          <span><span class="sign minus">−</span> {{ T.minus }}</span>
        </p>

        <h3>{{ T.options }}</h3>
        <div class="options">
          <label><input v-model="mergePartOf" type="checkbox" /> {{ T.mergePartOf }}</label>
          <label><input v-model="mergeCities" type="checkbox" /> {{ T.mergeCities }}</label>
          <span class="framing">
            {{ T.framing }}
            <label><input v-model="framing" type="radio" value="both" /> {{ T.framingBoth }}</label>
            <label><input v-model="framing" type="radio" value="f1" /> {{ T.framingF1 }}</label>
          </span>
        </div>
        <p class="count">{{ T.units(units.length, selected.length) }}</p>

        <h3>{{ T.appendices }}</h3>
        <div class="options">
          <label v-for="m in APPENDIX_MODELS" :key="m"><input v-model="shownAppendix" type="checkbox" :value="m" /> {{ modelName(m, locale) }}</label>
        </div>
        <p class="count">{{ T.appendixIntro }}</p>
        <p v-for="arm in APPENDIX_ARMS" :key="arm.id" class="count arm-note">{{ T.armNotes[arm.id] }} <a :href="resultsUrl(arm.markdown)">results/{{ arm.markdown }}</a>{{ T.period }}</p>
      </div>

      <p v-if="!units.length" class="state">{{ T.none }}</p>
      <template v-else-if="table && comparisons">
        <h3>{{ T.indexTitle }}</h3>
        <div class="table-wrap">
          <table class="index">
            <thead>
              <tr>
                <th>{{ T.model }}</th>
                <th v-for="l in LANGS" :key="l">{{ langShort[l] }}</th>
              </tr>
            </thead>
            <tbody>
              <template v-for="m in tableSummary!.models" :key="m">
              <tr v-if="armHeadOf(m)" class="addendum-head">
                <th :colspan="LANGS.length + 1" scope="rowgroup">{{ T.armHead(armHeadOf(m)!.id, runDateLabel(armHeadOf(m)!.runDate, locale)) }}</th>
              </tr>
              <tr :class="{ jev: m === 'jev', addendum: APPENDIX_MODELS.includes(m) }">
                <th scope="row">{{ modelName(m, locale) }}</th>
                <td v-for="l in LANGS" :key="l">
                  <span v-if="!complete(m, l)" class="untested">{{ T.notTested }}</span>
                  <template v-else>
                  <div class="value">
                    <span class="dot" :style="{ background: orientedColor(table[m][l].estimate), color: textOn(table[m][l].estimate) }">{{ f2(table[m][l].estimate) }}</span>
                    <span class="range">[{{ f2(table[m][l].low) }}, {{ f2(table[m][l].high) }}]</span>
                  </div>
                  <div class="axis" aria-hidden="true">
                    <span class="mid" />
                    <span class="interval" :style="{ left: pct(table[m][l].low), width: `calc(${pct(table[m][l].high)} - ${pct(table[m][l].low)})` }" />
                    <span class="point" :style="{ left: pct(table[m][l].estimate) }" />
                  </div>
                  </template>
                </td>
              </tr>
              </template>
            </tbody>
          </table>
        </div>
        <p class="note">{{ T.indexNote }}</p>

        <h3>{{ T.compareTitle }}</h3>
        <div class="table-wrap">
          <table class="compare">
            <thead>
              <tr>
                <th>{{ T.model }}</th>
                <th v-for="l in LANGS" :key="l">{{ langShort[l] }}</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="m in summary.models.filter((x) => x !== 'jev')" :key="m">
                <th scope="row">{{ modelName(m, locale) }}</th>
                <td v-for="l in LANGS" :key="l">
                  <span class="diff">{{ signed(comparisons[m][l].diff) }}</span>
                  <span class="lower">{{ T.jevLower }} {{ comparisons[m][l].jevLower }}/{{ comparisons[m][l].n }}</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p class="note">{{ T.compareNote }}</p>
      </template>
    </template>
  </div>
</template>

<style scoped>
.lab {
  margin-top: 16px;
}
.state {
  color: var(--vp-c-text-2);
}
.state.error {
  color: var(--jev-pink);
}
.exploratory {
  border-left: 4px solid var(--jev-pink);
  background: var(--jev-panel);
  padding: 8px 12px;
  font-size: 14.5px;
  text-align: left !important;
}
.panel {
  border: 1px solid var(--jev-rule);
  border-radius: 8px;
  background: var(--jev-panel);
  padding: 4px 16px 12px;
  margin: 16px 0 24px;
}
h3 {
  font-size: 16px !important;
  margin: 18px 0 8px !important;
  padding: 0 !important;
  border: 0 !important;
}
.presets {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}
.presets button {
  border: 1px solid var(--jev-rule);
  border-radius: 16px;
  padding: 3px 14px;
  font-size: 14px;
  background: #ffffff;
  text-align: left;
}
.presets button.active {
  background: var(--jev-green);
  border-color: var(--jev-green);
  color: #ffffff;
}
.claim-groups {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px;
}
fieldset {
  border: 1px solid var(--jev-rule);
  border-radius: 6px;
  padding: 6px 12px 10px;
  margin: 0;
  min-width: 0;
  background: #ffffff;
}
legend {
  font-size: 13px;
  color: var(--vp-c-text-2);
  padding: 0 4px;
}
.claim {
  display: flex;
  gap: 8px;
  align-items: baseline;
  padding: 3px 0;
  font-size: 14.5px;
  line-height: 1.5;
  cursor: pointer;
}
.claim input {
  flex: none;
  transform: translateY(2px);
}
.claim-text {
  min-width: 0;
  overflow-wrap: anywhere;
}
.claim code {
  font-size: 11.5px;
}
.sign {
  flex: none;
  display: inline-block;
  width: 18px;
  height: 18px;
  line-height: 18px;
  border-radius: 3px;
  text-align: center;
  color: #ffffff;
  font-size: 13px;
  font-weight: 700;
}
.sign.plus {
  background: var(--jev-green);
}
.sign.minus {
  background: var(--jev-pink);
}
.legend {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 20px;
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 8px 0 0 !important;
}
.options {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 14.5px;
}
.options label {
  cursor: pointer;
}
.framing {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 16px;
  align-items: baseline;
}
.count {
  font-size: 14px;
  color: var(--vp-c-text-2);
  margin: 10px 0 0 !important;
}
.count.arm-note {
  margin-top: 4px !important;
}
.table-wrap {
  overflow-x: auto;
}
table {
  display: table !important;
  width: 100%;
  table-layout: fixed;
  margin: 0 !important;
}
th,
td {
  padding: 6px 10px !important;
  font-size: 14px;
  vertical-align: top;
}
thead th:first-child {
  width: 24%;
}
tbody th {
  text-align: left;
  font-weight: 500;
  background: transparent;
}
tr {
  background: #ffffff !important;
}
tr.jev th,
tr.jev td {
  background: #e6f1ee;
}
tr.addendum-head th {
  background: var(--jev-panel);
  font-size: 12.5px;
  font-weight: 600;
  color: var(--vp-c-text-2);
}
tr.addendum th,
tr.addendum td {
  background: #f7f6f2;
}
.untested {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}
.value {
  display: flex;
  flex-wrap: wrap;
  gap: 2px 6px;
  align-items: baseline;
}
.dot {
  border-radius: 4px;
  padding: 0 6px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
}
.range {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
  font-variant-numeric: tabular-nums;
}
.axis {
  position: relative;
  height: 10px;
  margin-top: 6px;
  background: #eeede8;
  border-radius: 5px;
}
.axis .mid {
  position: absolute;
  left: 50%;
  top: -2px;
  bottom: -2px;
  width: 1px;
  background: #6b707a;
}
.axis .interval {
  position: absolute;
  top: 3px;
  height: 4px;
  background: #6b707a;
  border-radius: 2px;
}
.axis .point {
  position: absolute;
  top: 1px;
  width: 8px;
  height: 8px;
  margin-left: -4px;
  border-radius: 50%;
  background: #1b1f24;
}
.diff {
  display: block;
  font-weight: 600;
  font-variant-numeric: tabular-nums;
}
.lower {
  font-size: 12.5px;
  color: var(--vp-c-text-2);
}
.note {
  font-size: 13px;
  color: var(--vp-c-text-2);
  margin: 8px 0 24px !important;
  text-align: left !important;
}

@media (max-width: 760px) {
  .claim-groups {
    grid-template-columns: minmax(0, 1fr);
  }
  .panel {
    padding: 4px 10px 10px;
  }
  th,
  td {
    padding: 5px 4px !important;
    font-size: 12.5px;
  }
  thead th:first-child {
    width: 26%;
  }
  .range {
    font-size: 11px;
  }
}
</style>
