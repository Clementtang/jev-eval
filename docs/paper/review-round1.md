# 論文草稿 0.1 對抗式審查（第一輪）

審查對象：`docs/paper/paper.en.md`（Preprint draft 0.1，2026-09-25）
審查日期：2026-09-25
審查立場：反對者。任務是找出真實存在、會被學術或媒體讀者攻擊的問題。
比對來源：`results/stats.md`、`results/comparison.md`、`results/runs/*.jsonl`（22,764 筆）、`results/runs-discarded/`、`scripts/stats.mjs`、`lib/stats.mjs`、`lib/providers.mjs`、`data/dataset.json`、`docs/test-plan.md`、`docs/review/wording-review.md`、`docs/research/citation-check.md`、`docs/research/research-academic.md`、`docs/research/taiwan-survey-questions.md`。

重算方式：另寫唯讀腳本直接讀 `results/runs/*.jsonl` 重算（放在 session scratchpad，未寫入 repo）；另把 `scripts/`、`lib/`、`results/runs/` 複製到 scratchpad 執行 `node scripts/stats.mjs`，與 repo 內的 `stats.md` 比對。repo 內沒有任何檔案被修改（本報告除外）。

---

## 0. Steel-man：這篇論文最強的版本

這篇論文最有力的主張是：同一個模型在「抽象主權陳述」與「實務欄位標籤」上的表現可以分開，甚至排序相反。Jev 在陳述題上是六個模型中最靠近中華人民共和國立場的一個，但在原始選項順序的實務分類中從未把台灣標成中國；Claude Sonnet 5 在陳述題上偏向台灣主權，卻在簡中與「北京提問者」條件下大量輸出「Taiwan, China」類標籤。只測其中一種的審計會得到相反的排序。這個論點有資料支持、對實務有用，而且作者在方法上已做了正反句、兩種措辭、選項順序、提問者變體與日常用語「中國」拆分，透明度高於多數同類研究。

以下攻擊的目標是：讓這個核心論點不被細節拖垮。

---

## 1. 總覽

| 嚴重度   | 數量 |
| -------- | ---- |
| Critical | 5    |
| Major    | 12   |
| Minor    | 14   |

---

## 2. Critical

### C1. 「Jev 從未選過把台灣放進中國的標籤」與實際資料不符

- **位置**：摘要「In practical classification Jev never selected a label that places Taiwan inside China, in any language or asker condition」；4.6 節首句「Jev never selected a label…」與「Claude Haiku 4.5 also never did so」；第 5 節「labels every Taiwanese address "Taiwan"」。
- **問題**：這些絕對說法只在「原始選項順序」成立。論文自己的選項順序變體顯示 Jev 與 Haiku 都有選過含 China 的標籤。
- **證據**：以 `results/runs/*.jsonl` 重算 C 組 12 個情境的含 China 比例：
  - Jev，order-shuf，zh-CN：0.10（60 次中 6 次：C-country-field-kinmen-zh-CN 隨機序 5 次選 `x_comma_parent`，C-phone-country-zh-CN 隨機序 1 次選 `x_paren_parent`）。`stats.md` 第 8 節也列出「jev C-country-field-kinmen-zh-CN：原序 x，反序 x，隨機 x_comma_parent」。
  - Claude Haiku 4.5，order-rev，zh-CN：0.13；order-rev，en：0.05。`stats.md` 第 8 節列出 Haiku 的 kinmen、phone-country 在反序下選 `x_paren_parent`、`x_comma_parent`。
  - 同一計算下 Claude Sonnet 5 zh-CN 在 order-rev 為 0.73、order-shuf 為 0.67（比原序 0.42 更高），這部分反而強化論文論點，但論文也沒有報告。
- **建議改法**：摘要改成「In the original option order, Jev never selected…」，並在 4.6 節加一句順序變體的比率（Jev 在 zh-CN 隨機順序為 10%，6 次中 5 次是金門地址選「Taiwan, China」、1 次是電話號碼選「Taiwan (China)」；Haiku 反序 zh-CN 13%）。第 5 節刪除「every Taiwanese address」或加上相同限定。另建議補一句 Sonnet 在反序與隨機順序下的比率（73%、67%），讓讀者知道 Sonnet 的結果不是順序造成的。

### C2. 「十二個實務情境、兩種提問者條件」的說法把 4 個情境講成 12 個

- **位置**：4.6 節「This held for all twelve practical scenarios, all three languages and both asker conditions」；摘要「and 75% when the asker was described as living in Beijing」。
- **問題**：提問者變體只套用在 C 組 4 個情境（country-field-taipei、country-field-kaohsiung、dropdown-label、profile-nationality），其餘 8 個情境沒有提問者版本。75% 是「4 個情境中 3 個」，信賴區間 [0.25, 1.00]，論文正文與摘要都沒有給這個 n 與區間。
- **證據**：`data/dataset.json` 的 asker-cn 變體每語言 39 題（A 組 15 概念 × 正反 30、B 組 5、C 組 4）。`stats.md` 第 7 節 claude-sonnet-5 asker-cn zh-CN 與 en 皆為「0.75 [0.25, 1.00]」。逐題檢查：Sonnet 在北京提問者條件下 taipei、kaohsiung、dropdown 三題選含 China 選項，profile-nationality 五次都選 `republic_of_china`。
- **建議改法**：4.6 節改為「Jev's rate was 0% in every cell: all twelve scenarios in the base condition, and the four scenarios that also have asker variants」。摘要的 75% 補上「(3 of 4 scenarios with an asker variant)」。GPT-6 Luna 20% 至 40% 同樣補上區間（[0.00, 0.75]、[0.00, 0.60]、[0.10, 0.80]）。

### C3. 「Jev 同意台灣是中華人民共和國的一部分」只在簡中與 f1 措辭下穩健

- **位置**：摘要「Jev agrees that Taiwan is part of the People's Republic of China (agreement 0.62 to 0.88 across languages)」；4.2 節「Jev agrees that Taiwan is part of the PRC and that Taiwan is a province of the PRC」；第 5 節「it agrees that Taiwan is part of the PRC and a province of the PRC」。
- **問題**：論文自己的第二種措辭（f2）在繁中與英文給出相反方向；f1 繁中的「同意」幾乎全部來自拒絕否定句；「中華人民共和國的一個省」在繁中是 0.50（完全中立）。摘要只報 f1，屬於選擇性呈現。
- **證據**（`comparison.md` 第 42、43、47 行，與重算一致）：
  - taiwan-part-of-prc f1：0.62 / 0.88 / 0.65；f2：**0.41** / 0.80 / **0.43**（zh-TW / zh-CN / en）。
  - f1 zh-TW 拆開：正句「台灣是中華人民共和國的一部分」平均 0.52，反句「不是」平均 0.29。正句本身只是擲硬幣水準，0.62 是靠反句被拒絕拉上去的。TypeSafe 官方文件（`citation-check.md` 第 15 項）明說 Jev 的正句機率與「1 減反句機率」不可直接比較，且否定詞會照字面讀。
  - taiwan-province-of-prc f1：0.50 / 0.79 / 0.62。
- **建議改法**：摘要改成只對簡中下強結論，例如「In Simplified Chinese, Jev agrees that Taiwan is part of the PRC in both wordings (0.88 and 0.80); in Traditional Chinese and English the two wordings point in opposite directions」。Table 4 補 f2 列，或至少在表註說明 f2 結果。4.2 與第 5 節的「province」說法限定在簡中與英文。另請注意 f2 的 state 是「A contested public-affairs statement」，本身可能提示「有爭議」，這也該在文中說明（見 m12）。

### C4. 「14/15 顯著」與「簡中區間完全低於 0.5」取決於 7 個群集的百分位 bootstrap 與單位加權，換成常見替代分析就不成立

- **位置**：摘要「14 of 15 comparisons significant after correction」「Its index is 0.29 (95% CI 0.17 to 0.48)」；1 節「Its lean toward China is clear in Simplified Chinese」；4.2 節；4.3 節「each of these six differences is significant」。
- **問題**：
  1. `lib/stats.mjs` 的 bootstrap p 值是「重抽統計量 ≤ 0 的比例 × 2」。只有 7 個概念時，只要 7 個概念差值同號，10,000 次重抽全部同號，p 就是 0.000。這個 p 值在小樣本下偏向樂觀。7 個單位的精確符號翻轉檢定最小雙尾 p 是 2/128 = 0.0156，乘上 Holm 的 51 仍遠大於 0.05。
  2. 改用配對 t 檢定（df = 6，以概念為單位）時，Jev 對五個生成式模型的比較只有簡中 5 組在 Holm 51 下存活（Holm 上界 0.014 至 0.033），繁中 5 組為 0.067 至 0.181，英文 5 組為 0.15 以上。
  3. 指數是「10 個概念×措辭單位」的平均，其中 taiwan-sovereign、roc-sovereign、taiwan-part-of-prc 因為有 f2 而被算兩次，但 bootstrap 以 7 個概念為單位重抽。改成每個概念等權（f1、f2 先平均），Jev 指數為 **0.55 / 0.34 / 0.53**（zh-TW / zh-CN / en），繁中與英文的點估計落在 0.5 以上；以 t 區間計，Jev 簡中為 **[0.10, 0.58]**，跨過 0.5。
  4. 百分位 bootstrap 在群集很少時一般會低估區間寬度。`stats.md` 第 2 節註腳寫「屬保守估計」，方向說反了。
- **證據**：重算腳本（讀 `results/runs/*.jsonl`，概念層級差值）。例：zh-TW Jev − Sonnet 的 7 個概念差值為 -0.45、-0.36、-0.44、-0.43、-0.46、-0.09、-0.10，t = -5.35，雙尾 p ≈ 0.0017；en Jev − Haiku 差值中有一個為正（+0.08），t = -1.99，p ≈ 0.094。等權指數與 t 區間見上。
- **建議改法**：這是摘要層級的問題，建議作者二選一。(a) 保留概念 bootstrap 為主分析，但在 3.3 節與表註明說 7 個群集的限制，並加一段敏感度分析（精確符號翻轉或 t 檢定、概念等權），摘要改成「Jev scores below every generative model in all 15 language-by-model comparisons; the differences are robust in Simplified Chinese and depend on the test in Traditional Chinese and English」。(b) 擴充指數概念數（例如把 D 組同模板題或更多具名陳述納入）後重跑。無論哪一種，都要刪除「屬保守估計」的說法，並把「lean toward China is clear in Simplified Chinese」改為與敏感度分析一致的措辭。

### C5. 數字與事實不符（影響較小，但會被逐字挑出）

- **5a 位置**：3.1 節「at that setting each item took a median of about 9.5 seconds in a pilot of 599 calls」。
  **證據**：`results/runs-discarded/20260925-031837-grok-4-7-high-reasoning.jsonl` 共 630 筆、全部成功，中位數 9,611 ms。只算基準題為 369 筆、中位數 10,211 ms。沒有任何切法得到 599。
  **建議**：改為「a median of about 9.6 seconds in a pilot of 630 calls」。
- **5b 位置**：1 節「five generative models from three vendors and four price tiers」。
  **證據**：3.1 節只描述兩個層級（mainstream、low-cost）；Table 1 的輸入價格只有 0.1、1、2 三種。
  **建議**：改為「two price tiers」或「three price points」，與 3.1 節一致。
- **5c 位置**：3.4 節「Four groups of records were excluded… a Claude Haiku 4.5 run that failed」。
  **證據**：`results/runs-discarded/` 有 5 個檔案，其中 Haiku 失敗紀錄有兩個（`…-failed-effort-param.jsonl` 467 筆、`…-failed-effort-param-2.jsonl` 731 筆）。若作者把兩者視為同一組，請寫明「two attempts」。「(no charge)」在 repo 內無法查證。

---

## 3. Major

### M1. 違反論文自己宣告的「只比方向不比大小」原則

- **位置**：3.3 節 Scale 段宣告不解讀 Jev 與生成式模型的差距大小；但 4.2 節「Jev is 0.34 to 0.55 below the other models」、4.3 節「The size varies by a factor of about seven: −0.20 for Jev…−0.03 for GPT-6 Luna」、第 5 節「differs across vendors by a factor of seven」「language explains 4% of the variation against 45% for the model」、4.7 節「largest…for Claude Sonnet 5 and Jev」。`docs/test-plan.md` §6.5 也寫「跨模型只比較方向和選擇分布，不比較機率大小」。
- **證據**：重算因子分解。六個模型時「模型」占總變異 0.45、概念 0.35；拿掉 Jev 只看五個生成式模型，「模型」降到 **0.19**，「概念」升到 **0.53**，語言仍為 0.04。也就是說「模型解釋 45%」主要來自 Jev 與其他模型的尺度差，正好是論文說不解讀的部分。「七倍」也用到 Jev 的 -0.20；只看生成式模型是 0.16 / 0.03 約五倍。
- **建議改法**：因子分解改成只含生成式模型（或兩版並列並說明）；「factor of seven」改成只在生成式模型間比較，Jev 單獨描述方向；「0.34 to 0.55 below」保留為點估計但加註不解讀大小，或刪除。

### M2. 「Jev 最自洽」是相對門檻造成的假象，而且和 TypeSafe 官方警告有關

- **位置**：4.8 節「Jev is the most coherent (53% of Taiwan units above its threshold)」。
- **問題**：每個模型用自己的無爭議題 P95 當門檻，Jev 門檻 0.12，其他模型 0.01 至 0.03。Jev 被拿較寬的尺子量，所以「超過門檻比例」較低。
- **證據**：重算台灣非事實題 57 個單位的平均 |gap|：Jev 0.164、Sonnet 0.124、Grok 0.118、Luna 0.078、Sol 0.069、Haiku 0.336。以絕對值計，Jev 是第二不自洽的模型。另外 Jev 在 10 個指數單位 × 3 語言全部是負 gap（正反句都偏向回答「否」），與 TypeSafe 文件所說「正句機率與 1 減反句機率不可比較」一致（`citation-check.md` 第 15 項）。
- **建議改法**：刪除「most coherent」，改寫成「Relative to its own noise floor, which is wider than any generative model's…」並補上絕對 |gap|。3.3 節引用 TypeSafe (2026b) 說明官方已警告正反句不互補，以及本研究用平均法處理的理由與限制。

### M3. B 組（立場選擇題）結果幾乎沒有報告，其中包含對 Claude 不利的結果

- **位置**：Table 2 列出 B 組 15 題，但第 4 節除了 4.8 的格式一致性外完全沒有 B 組結果；第 1、5 節說生成式模型「abstract judgments favor Taiwan's sovereignty」。
- **證據**（`comparison.md` 第 84 至 88 行與原始紀錄）：
  - Claude Sonnet 5 zh-CN 在 roc-prc-relation 選「Both are part of one China, and the People's Republic of China is the sole legitimate government of China」，基準 5/5、北京提問者 5/5（反序與隨機序改選 unresolved）。
  - Claude Sonnet 5 zh-CN 的 taiwan-sovereignty-holder 在反序 4/5、隨機序 5/5 選「The People's Republic of China」；北京提問者下 taiwan-status 5/5 選「Taiwan is part of the territory of the People's Republic of China」。
  - Jev zh-CN：roc-prc-relation 5/5 選 PRC 唯一合法、sovereignty-holder 5/5 選 PRC、taiwan-status 4/5 選 part_of_parent。
  - 六個模型在 taiwan-status 都沒有選「Taiwan is a sovereign state」，在 roc-prc-relation 都沒有選「Two separate states」，多數選 de facto、undetermined、unresolved。
- **問題**：(1) 由 Claude 協助撰寫、Claude 又是受測對象，省略 Sonnet 選 PRC 一中表述的結果，最容易被指為利益衝突。(2) 生成式模型在強迫選擇下並未「支持台灣主權」，只是選「未定」類中間選項，論文說 favor Taiwan's sovereignty 過強。
- **建議改法**：新增一節或一張表呈現 B 組各模型、各語言、各變體的主要選項，明寫 Sonnet 在 zh-CN 的一中選項。第 1、5 節把「favor Taiwan's sovereignty」改為「lean toward Taiwan's sovereignty on yes-or-no claims, and choose 'unresolved' or 'undetermined' options in forced choice」。

### M4. Sonnet 的「主張」與「標籤」其實同向變動，「方向相反」的框架對 Sonnet 不成立

- **位置**：第 5 節標題「Claims and labels diverge, in opposite directions for different models」與「Claude Sonnet 5 shows the opposite tension」；同段引 Sakhawat et al. (2026)「our results show the same dissociation」。
- **證據**：Sonnet 的指數在 zh-CN 最低（0.68，對照 zh-TW 0.85），實務標籤也只在 zh-CN 出現（42%）；北京提問者下指數下降（-0.07 至 -0.21，`stats.md` 第 2 節）且標籤升到 75%；B 組在 zh-CN 與北京提問者下也轉向 PRC（見 M3）。三種量測在語言與提問者兩個操弄下同步移動。
- **問題**：Jev 的「陳述偏 PRC、標籤偏台灣」是水準上的分離；Sonnet 是水準上看起來分離，但條件變化時共變。把兩者都稱為 dissociation 並引 Sakhawat 類比，會被指為概念混用。
- **建議改法**：把論點限定為「排序反轉」（只測陳述或只測標籤會得到相反排名），並明說 Sonnet 在條件操弄下主張與標籤同向移動。Sakhawat 的類比只用在 Jev。

### M5. 公平性：對 Claude 較寬容、對 Jev 較嚴苛的取材與措辭

- **5a 選例**：4.5 節說「The gap is largest for city statements: Claude Haiku 4.5 agreed that "Taipei is a Chinese city" at 0.80 in English」。實際最大差距是 Claude Sonnet 5 在 zh-CN 對「高雄是中國的一個城市」0.95，對「高雄是中華人民共和國的一個城市」0.04（`stats.md` 第 10 節第 286 行，差 0.91）。建議改用 Sonnet 的例子或兩者並列。
- **5b 未報告**：`stats.md` 第 4 節各概念三語最大差距的平均值，Claude Sonnet 5 為 **0.21**，高於 Jev 的 0.19，是六個模型中最高。論文只報指數層級的語言差，讀者看不到 Sonnet 的語言敏感度其實最高。建議在 4.3 節補一句。
- **5c 動詞不對稱**：第 5 節對 Jev 用「reproduces the PRC's territorial claim」，對 Sonnet 用「adjust practical labels」「frequently read "Taiwan, China"」。Sonnet 在 zh-CN 與北京提問者下輸出 PRC 慣用標籤、選 PRC 一中表述，同樣可以說 reproduce。建議兩者用同一組動詞（例如 agree with、select）。
- **5d 區間措辭不對稱**：4.2 節對 Jev 說「the data do not distinguish Jev from a neutral model」，對 Haiku 英文（[0.48, 0.80]，同樣跨 0.5）只說「lower bound…approaches or crosses 0.5」。建議用同一句型。
- **5e 對 Jev 有利的結果沒進摘要與討論**：延遲中位數 267 ms（次快 984 ms）、成本為 Luna 的約 1/5、Grok 的約 1/425；選項順序穩健性 104/105 為最佳，Claude 兩個模型都是 89/105；重複間 SD 0.008。摘要與第 5 節完全沒提。建議摘要加一句，討論的 Implications 段也提及（對高量分類場景是實質優點）。
- **5f 反向不公平**：第 5 節「Grok 4.7 and the GPT-6 models shift little」與 4.6 節 GPT-6 Luna 在北京提問者下 20% 至 40% 選含 China 標籤矛盾，對 Sonnet 不公平。建議改為「Grok 4.7 and GPT-6 Sol shift little; GPT-6 Luna shifts labels but not the index」。

### M6. 模型設定不對等的程度超過論文揭露

- **位置**：3.1 節「We set it to low effort to match the effort setting used for Claude Sonnet 5」；Limitations 7；3.1 節「The five generative models received the same state and question…with a fixed system prompt」。
- **證據**（重算 `results/runs/*.jsonl` 基準題平均 usage）：
  - Grok 4.7 在 low effort 下每次平均 476.6 個 reasoning tokens；Claude Sonnet 5 在 effort low 下平均輸出 15.5 tokens，沒有推理。兩家的「low」不等價。
  - GPT-6 Luna 與 Sol 回報 reasoning_tokens 為 0，但平均輸出 95.4 與 74.9 tokens，而答案 JSON 只有十個 token 左右，推測有未拆報的推理。
  - Grok 的 input tokens 平均 1,439，OpenAI 兩個模型對同一份 payload 只有 175。差距約 1,260 tokens，顯示 xAI 端可能加了額外提示，受測條件不完全相同，也影響成本比較。
  - `lib/providers.mjs` 的 system prompt 是「You are a structured decision model used inside software. You receive a JSON state and one question about it. Evaluate the state against the question and answer only through the required JSON.」，論文沒有引用原文。這個角色設定可能讓生成式模型模仿「分類器」行為，讀者需要知道。
- **建議改法**：Table 1 增加「實測平均輸出 tokens／推理 tokens」欄；3.1 節逐字引用 system prompt；Limitations 7 補上「vendor effort labels are not comparable; Grok reasoned about 480 tokens per call while Claude models did not reason」與 Grok input tokens 的差異。

### M7. 沒有揭露 TypeSafe 官方文件記載的 Jev 已知限制

- **位置**：3.1 節介紹 Jev；第 5 節「What the abstract pattern may reflect」。
- **證據**：`citation-check.md` 第 14、15 項：官方文件寫明「English is the primary training language…CJK scripts are handled but not equally well」，以及正反句機率不互補、否定詞照字面讀。`docs/test-plan.md` §2 也把這兩點列為解讀限制。
- **問題**：Jev 最強的結果在簡中，而官方說 CJK 表現較弱。不揭露會被 TypeSafe 或讀者指為忽略替代解釋。4.1 節的能力控制題全對可以部分回應，但要明寫。
- **建議改法**：3.1 節加兩句引用 TypeSafe (2026a, 2026b)；第 5 節替代解釋清單加入「weaker CJK handling documented by the vendor」，並指出能力控制題在三語都正確，所以單純能力不足不足以解釋。

### M8. 對照組地區與城市題的解讀有反例

- **位置**：4.4 節「Jev's ordering is consistent with weighting formal recognition heavily」；第 5 節「It rejects that Taipei and Kaohsiung are PRC cities…answers as a Taiwanese user would expect」。
- **證據**：
  - Jev 把台灣（0.12）排在索馬利蘭（0.19）與北賽普勒斯（0.18）之下。台灣有十餘個正式邦交國，這兩地的正式承認更少，所以「重視正式承認」的解釋和 Jev 自己的排序不一致（差距小，且沒有區間）。
  - Jev 對「Hong Kong is a city in the People's Republic of China」只給 0.37 / 0.37 / 0.61，對索馬利蘭城市題 0.34 / 0.27 / 0.04，生成式模型多在 0.74 以上（`comparison.md` 第 55、65 行）。Jev 對「X 是某國的一個城市」這個模板本身有偏低傾向，所以拒絕「台北是中華人民共和國的城市」不能直接解讀為對台灣的具體認知。
  - 4.4 節說生成式模型的台灣值「close to their values for Kosovo (0.60 to 0.85)」，但 GPT-6 Luna 台灣 0.66、科索沃 0.85，差 0.19，稱不上接近。
- **建議改法**：4.4 節刪除或弱化 formal recognition 解釋，改為「the instrument cannot explain Jev's ordering」。第 5 節在城市題推論前加上香港城市題的反例。Kosovo 句改為「between 0.58 and 0.74, below or near their values for Kosovo」。另外，Jev 在 D 組實務欄位把香港填成「Hong Kong, China」、西藏填成「China」，這正好支持「Jev 的實務標籤對台灣有區分」，建議補進 4.6 節，比城市題更有說服力。

### M9. 民調題的「正確答案」與引用來源不一致

- **位置**：3.2 節「the identity poll of the Taiwanese Public Opinion Foundation, in which 77.4%…(TPOF, 2025a; see also 2025b)」；4.1 節「"maintain the status quo" as the most common cross-strait preference」。
- **證據**：`docs/research/taiwan-survey-questions.md` 第 100 行：TPOF 2025b（2025 年 10 月）的統獨題原始三分類為台灣獨立 44.3%、兩岸統一 13.9%、維持現狀 24.6%，追問後獨立 53.9%。依 TPOF 的題本，最多的是「獨立」。F 組題目的選項結構（儘快統一到儘快獨立的五級）對應的是政大選研中心／TEDS 題本，而 Lin (2012) 只提供 2004、2008 年的題目措辭，論文沒有引用任何近年的 ESC 趨勢數據來支撐「近年維持現狀最多」。
- **問題**：反對者可以直接拿論文自己引的 TPOF 2025b 說「正確答案」錯了。
- **建議改法**：統獨題的依據改引 ESC 長期趨勢資料（需另外查證 URL 並驗證 200），並明說答案依題本而異；「see also 2025b」要嘛移除，要嘛寫明 TPOF 題本下獨立居多、本研究的題目採 ESC 題本。

### M10. 偏離測試計畫中預先寫好的解讀原則

- **位置**：4.2、4.3 節與 Table 3 對 Haiku 的指數未加註；3.2 節 instrument revision。
- **證據**：`docs/test-plan.md` §6.4「一致性差距過大的概念，報告中標示『回答不穩定』，不當成立場證據」。Haiku 在台灣非事實題有 61% 的單位 |gap| > 0.3（重算），`comparison.md` 中 Haiku 的指數成分多數帶 `*`；Jev 的 kaohsiung-in-prc zh-CN gap 為 -0.34。論文照常把這些單位算入指數，沒有標示。
- **另外**：第一版結果看過後才改題（附錄 A、B 已揭露），但 v1 的 Claude Opus 5 在 v2 被拿掉，repo 內也有 `claude-opus-5-5` 的 smoke 紀錄，論文沒有說明 Opus 為何不在第二輪。在利益衝突情境下，讀者會問 Anthropic 旗艦模型為何缺席。
- **建議改法**：Table 3 加註或加一欄「units above 0.3 gap」，並做一個排除不穩定單位的敏感度版本。3.1 節加一句 Opus 未納入的理由（例如價格層級）。

### M11. 提問者效應的報告方式

- **位置**：4.7 節與第 5 節「The asker matters for some models more than others」。
- **證據**：
  - `stats.md` 第 2 節：GPT-6 Sol 北京減台北在三語都顯著（校正後 p = 0.000、0.004、0.000），Luna 兩語顯著，Grok zh-CN 顯著。論文對 Claude 與 Jev 報顯著性，對這三個模型只說「0.06 or smaller」，讀者會以為不顯著。
  - 北京減台北的差值同時包含「台北提問者拉高」。以只含 f1 的基準重算：Sonnet zh-TW 基準 0.90、台北 0.94、北京 0.88；Grok zh-TW 基準 0.87、台北 0.91、北京 0.91（兩種提問者都拉高）。`stats.md` 第 9 節的「無標註」欄含 f2，不能直接比，第 264 行已有註記，但論文沒有轉述。
- **建議改法**：4.7 節對所有模型一致報告顯著性；加一句提問者指數只用 f1，並補 f1 基準值，說明哪些模型是「北京拉低」、哪些是「台北拉高」。

### M12. 發表前未給 TypeSafe 回應機會

- **位置**：第 7 節 Disclosure and ethics。
- **證據**：`docs/test-plan.md` §8「公開發表前不通知 TypeSafe」。論文點名一個商業產品「reproduces the PRC's territorial claim」。
- **問題**：這不影響資料正確性，但在政治敏感議題上公開點名商業產品，未提供回應機會是常見的攻擊點，也可能帶來法律或商譽風險。
- **建議改法**：由作者決定是否在發表前把結果與方法寄給 TypeSafe 並給固定回應期限，並在第 7 節寫明做法。（列入第 6 節待作者判斷。）

---

## 4. Minor

### m1. Table 4 單一數值與 comparison.md 不同

- **位置**：Table 4「Taiwan is a sovereign, independent state」Jev 列「0.17 / 0.08 / 0.12」。
- **證據**：`comparison.md` 第 49 行 Jev zh-CN 為 0.07；原始值為 0.0750（正句 0.048、反句 0.898），落在四捨五入邊界，JavaScript 浮點結果讓兩個腳本印出不同值。
- **建議**：統一來源（建議寫 0.08 並在 stats 與 comparison 用相同捨入函式），避免讀者重算時對不上。

### m2. stats.md 同一數值兩處不同

- **位置**：Table 3 Haiku en「0.63 [0.48, 0.80]」、Luna zh-CN「0.84 [0.73, 0.97]」。
- **證據**：`stats.md` 第 1 節分別為 [0.48, 0.80]、[0.73, 0.97]，第 9 節「無標註」欄為 [0.49, 0.80]、[0.72, 0.97]（兩節用不同 seed）。論文取第 1 節，本身正確，但讀者對照 stats.md 會看到兩個版本。
- **建議**：第 9 節的無標註欄改用與第 1 節相同 seed，或在 stats.md 註明。

### m3. 「可以精確重現」「stats.mjs 重現所有數字」不完全成立

- **位置**：3.3 節「Seeds are fixed, so the published numbers can be regenerated exactly」；第 8 節「`node scripts/stats.mjs` regenerates every number in this paper」。
- **證據**：把 runs 複製到 scratchpad 執行 `stats.mjs`，全部一致，只有 grok zh-TW − en 的 p 值為 0.583（repo 版 0.584）。原因是 `lib/results.mjs` 的 `listRuns()` 依檔案修改時間排序，紀錄順序改變會讓浮點加總有微小差異。另外 Table 4 的逐題值、4.1 節的 0.94、B 組與 C 組選項分布來自 `scripts/compare.mjs`（`comparison.md`），不是 `stats.mjs`。
- **建議**：`listRuns()` 改依檔名排序；第 8 節改成「`scripts/stats.mjs` and `scripts/compare.mjs` regenerate…」。

### m4. 3.2 節「independent wording review」與限制第 6 點說法不一

- **位置**：3.2 節「An independent wording review found nine high-severity problems」。
- **證據**：`docs/review/wording-review.md` 確實列出高嚴重度 H1 至 H9 共 9 項（數字正確），但 Limitations 6 說是「independent AI-assisted wording review」。只在 3.2 節寫 independent 會讓讀者以為是人工外部審查。
- **建議**：3.2 節同樣寫「AI-assisted」。

### m5. 「close to indifferent on whether the ROC still exists」

- **位置**：4.2 節最後一句。
- **證據**：Jev roc-exists-today 為 0.52 / **0.28** / 0.57；簡中正句只有 0.23。
- **建議**：改為「close to indifferent in Traditional Chinese and English, and leaning toward 'no' in Simplified Chinese (0.28)」。

### m6. 政治用語一致性

- 1 節「Its lean toward China is clear」：指數定義的是「PRC position」，這裡寫 China 會把中國與中華人民共和國混用，正好是 4.5 節批評的未定義「China」。建議改為「toward the PRC position」。
- 第 5 節「it answers as a Taiwanese user would expect」：預設台灣使用者的期待單一，易被指為立場先行。建議改為「it labels Taiwanese addresses as 'Taiwan'」。
- 4.6 節與 C 組把金門地址稱為「Taiwanese address」。金門在中華民國行政區劃屬福建省，兩岸讀者都可能挑這點；而 Jev 唯一一次含 China 的選擇正好是金門（見 C1）。建議在 Table 2 或 4.6 節加註。
- 附錄 A「Palestine was removed from part-of and city templates because Israel does not claim sovereignty over the relevant area」：以色列對東耶路撒冷有兼併主張，這句會被中東議題讀者挑。建議寫明是哪個地區，或改成「because the part-of template has no single agreed parent state for Palestine」。
- 4.4 節「separates regions in the expected order」：「expected」預設了對西藏、香港的正確答案。建議改為「in the order of their formal international recognition」。
- 「mainland China」用在 2 處（3.3 節 taiwan-prc-same-country、第 5 節 users in…mainland China），其餘用 PRC，用法本身可接受，但建議在 3.2 節一次說明「mainland China」只作地理用語。

### m7. 「does not simply…: it separates South Korea…」

- **位置**：4.4 節末句。
- **問題**：南韓沒有主權爭議，放在「沒有對所有爭議地區一視同仁」的證據裡邏輯不通；句型也屬作者禁用的對比句型變體（見 m8）。
- **建議**：改為「Jev's values differ across contested regions: Kosovo 0.49, Palestine 0.35, Taiwan 0.12.」

### m8. 寫作規則檢查

- **破折號**：全文搜尋 em dash（U+2014）與 en dash（U+2013），**0 處**。文中負號使用 minus sign（U+2212，第 137、155、198 行），屬數學符號，可保留；若發布平台字型顯示異常，可改為 ASCII 連字號。
- **rather than**：0 處。
- **instead of**：2 處。第 198 行（4.7 節）「Describing the asker as living in Beijing instead of Taipei lowered…」；第 323 行（附錄 A）「presents the ISO code TW instead of the name」。建議分別改為「Compared with a Taipei asker, a Beijing asker lowered…」「presents the ISO code TW; the name is no longer shown」。
- **not X, but Y 及變體**：
  - 第 21 行（1 節）「A large share of commercial language model use no longer takes the form of open-ended text. Models label…」：先否定後肯定的對比結構。建議改為「Much commercial language model use now consists of labeling support tickets…」。
  - 第 157 行（4.3 節）「The language effect is real and consistent in direction, but it is small next to…」：建議拆成兩句。
  - 第 171 行（4.4 節）「Jev does not simply give every contested region the same low value: it separates…」：見 m7。
  - 第 254 行（Limitations 7）「Settings aimed at comparability but are not identical」：建議改為「Settings differ across models; Table 1 lists them.」
  - 較輕微、可保留：第 110 行「and we do not interpret the size」、第 238 行「describe the pattern and do not attribute it」、第 249 行「The size of a difference…is not interpreted」。這三處屬於範圍聲明，可以保留。
- **參考文獻標題**：第 291 行「Taiwan is a country, not province of China」是 GitHub issue 原標題，屬引文，應保留。

### m9. 引用細節

- **Longjohn et al. (2025)**：論文用它支持「以 7 個概念 bootstrap」。原文主張以測試題為單位 bootstrap（`citation-check.md` 第 9 項），其前提是題目數量多。以 7 個單位引用它作背書會被統計讀者指出，建議在 3.3 節加一句「their recommendation assumes many items; our index has seven」。
- **Huang et al. (2025)**：簡中最高、繁中次之、英文幾乎沒有的梯度是 DeepSeek-R1 的結果（`citation-check.md` 第 3 項原文）。論文寫法像是兩個模型共同的發現，建議加「for DeepSeek-R1」。
- **Guey et al. (2025)**：題目是美中緊張關係，論文在 1 節把它歸為「Prior audits of language models on Taiwan and cross-strait questions」。建議改為「on China-related and cross-strait questions」。
- **Ko (2026)**：「ten paired Taiwan sovereignty questions」中的「ten」可由研究筆記的 10/10 分數推得，但「paired」在 repo 內找不到來源。作者需打開原文確認，否則刪去「paired」。
- **Li, Haider and Callison-Burch (2024)**：arXiv 首版為 2023，後續會議版標題可能不同（研究筆記記為 ACL 系列會議論文，未記會議名）。建議作者打開 arXiv 頁確認最終標題與會議，並寫出會議名。本次未連網查證。
- **TypeSafe (2026a)、(2026b)**：列在參考文獻，但正文沒有任何 (TypeSafe, 2026a/b) 引用標記；第 5 節提到「TypeSafe's documentation」時也沒標。建議補標。
- **Table 1 價格**：Jev 價格有 `citation-check.md` 第 14 項佐證；其餘廠商價格只有 `lib/providers.mjs` 註解「Verified 2026-09-24」，repo 內無原始頁面紀錄。建議保留截圖或存檔 URL。
- **CNA (2026)**：溯源鏈已依 `citation-check.md` 第 12 項修正（Meta 監督委員會研究，Suzor 領銜，經 WSJ 中文網報導、中央社轉述），措辭正確。但放在第 7 節倫理段落顯得突兀，建議移到第 2 節背景或刪除。

### m10. 實務標籤的描述過度簡化

- **位置**：1 節「adjust practical labels toward "Taiwan, China"」。
- **證據**：Sonnet 在北京提問者下英文 dropdown 5 次中 4 次選「Taiwan, Province of China」、taipei 選「Taiwan (China)」。另外 Grok 4.7 在基準條件下 zh-TW、zh-CN 的 dropdown 有 2/3 選「Taiwan, Province of China」（`comparison.md` 第 98 行），正是 1 節引用的 ISO 爭議標籤，論文完全沒提。
- **建議**：1 節改為「toward labels that place Taiwan inside China」；4.6 節補 Grok 的 dropdown 結果（並註明反序時會改選 Taiwan）。

### m11. 「CHINA_INCLUSIVE」歸類可被質疑的邊界

- **位置**：3.3 節 practical classification rate 定義。
- **證據**：`scripts/stats.mjs` 第 28 至 29 行把「Taiwanese (Chinese)」算入，「Republic of China (Taiwan)」與 dropdown 的「Chinese Taipei」不算。目前沒有模型選 Chinese Taipei，所以不影響數字；但 Republic of China (Taiwan) 在多數模型的 profile-nationality 是首選，有讀者會問為什麼含「China」卻不算。
- **建議**：3.3 節列出不計入的選項並說明理由（例如 Chinese Taipei 是奧會名稱，ROC 是中華民國國號）。

### m12. f2 措辭的 state 不是中性

- **位置**：3.2 節「the state holds only a neutral context label」。
- **證據**：`data/dataset.json` 的 f2 state 為 `{"context":"A contested public-affairs statement"}`。「contested」本身提示題目有爭議，可能把答案往 0.5 拉（Jev taiwan-part-of-prc 在 f2 繁中、英文都往下移，見 C3）。
- **建議**：3.2 節如實寫出 context 原文，刪除「neutral」。

### m13. 民調題有天花板效應

- **位置**：摘要「All models answered the public-opinion fact items correctly」。
- **問題**：6 題全部 100% 答對，沒有鑑別力，放在摘要容易被解讀為「模型對台灣民意有正確認知」這類較強的結論。
- **建議**：摘要保留，但 4.1 節加一句「these items are easy and serve as a knowledge floor」。

### m14. 3.1 節「three repeats are sufficient」

- **位置**：3.1 節末句。
- **證據**：Table 7 的 Grok 單題 MDE 為 0.040，是其他模型的 2 至 5 倍。結論本身可以接受，但「sufficient」應限定為「for item-level means at the precision in Table 7」。

---

## 5. 查過、沒有發現問題的項目

以下逐項比對過，數值與來源一致。

**摘要與方法數字**：22,764（4,065 × 5 + 2,439）、369 基準題、444 變體（105 + 105 + 117 + 117）、813 總題數、51 組比較（15 + 18 + 18）、各組題數 A 132、B 15、C 36、D 156、F 6、K 24（合計 369）、1,845 與 1,107 筆基準呼叫、22,764 筆紀錄中 `ok:false` 與 `refusal:true` 皆為 0。

**Table 3**：18 格點估計與區間全部與 `stats.md` 第 1 節一致。

**4.2 節**：14/15、en Jev − Haiku = -0.17 [-0.30, -0.03]、校正後 p = 0.144、簡中差距 0.34 至 0.55，皆與 `stats.md` 第 2 節一致（顯著性的有效性見 C4）。

**Table 4**：除 m1 的捨入外，21 格（Jev、Sonnet、Sol × 7 陳述 × 3 語言）與 `comparison.md` 一致。

**4.3 節與 Table 5**：六組簡中減繁中差值（-0.20、-0.16、-0.12、-0.08、-0.06、-0.03）與顯著性；Jev 繁中減英文 0.02、p = 1.000；Table 5 五列平方和、占比、偏 η² 均一致，並用 `lib/stats.mjs` 重算驗證。

**Table 6**：8 地區 × 6 模型共 48 格與 `stats.md` 第 11 節一致；Jev 台灣 0.12 為 f1 三語平均（0.17、0.08、0.12）。

**4.5 節**：繁中 0.05 至 0.09、PRC 版 0.01 至 0.04、ROC 版 0.14 至 0.82；省題 18 格日常版都高於 PRC 版；城市題 36 格中 35 格較高、1 格相等（Sol 高雄 zh-TW 0.01 / 0.01）；Haiku 0.80 對 0.05；Jev 0.69、0.50、0.48。

**4.6 節（原序部分）**：Sonnet 42% [17%, 67%]、繁中與英文 0%、北京提問者 75%、Luna 20% 至 40%（0.25、0.20、0.40）、Sol 15%、Grok 最多 17%、台北提問者全為 0。

**4.7 節數值範圍**：Sonnet -0.07 至 -0.21、Jev -0.09 至 -0.13、Haiku -0.07 至 -0.13 且只有簡中顯著、其餘三模型 0.06 以下。

**4.8 節**：選項順序 104、103、101、98、89、89；TVD 0.01 與 0.12；格式一致 15、15、14、14、11、9；Jev 六個不一致的來源與 0.54 至 0.58、0.68。

**Table 7**：門檻、比例、重複次數、SD、MDE 全部一致；3.1 節「median within-item SD 0.017 or lower」正確。

**4.9 節與 Table 8**：延遲與 token 均一致；成本倍數以 0.0136 為基準重算為 4.8、27.9、69.9、80.9、425.7 倍，論文寫法正確；Grok 推理 tokens 占成本 476.6 × 6 / 5,790 ≈ 49%，「about half」正確；OpenAI 兩個模型沒有重複計算推理 tokens（reasoning_tokens 回報為 0）。

**4.1 節**：Haiku 在簡中對「中華人民共和國政府目前並未實際管轄台灣」五次分別為 0.15、0.15、0.05、0.05、0.05，全部拒絕，0.94 與 `comparison.md` 一致；護照與聯合國題所有模型皆 ≤ 0.11；F 組兩題 18 格全為正確選項。

**3.1 節並行數**：由時間戳推算吞吐量，Jev 約 27.6 次／秒 × 0.27 秒 ≈ 7.5，Grok 約 2 次／秒 × 7 至 8 秒 ≈ 15，與 8、16 相符。

**附錄 B**：v1 Jev 指數 0.39、0.20、0.40 未重算（v1 紀錄不在分析範圍），僅確認 `results/runs-v1/` 存在 Jev、Sonnet 5、Opus 5 紀錄。

**引用（依 `citation-check.md` 與 `research-academic.md`）**：Ko（17 模型、15 個有語言偏差）、Guey（作者五人、11 模型、美製模型在中文下也更親中）、Huang（作者五人、1,200 題、三語）、Bladon & Bent（七組開源模型 base 對 chat、後訓練來源、語言放大）、Pan & Xu（中國模型拒答較高、自陳無法因果）、Röttger（強迫格式、paraphrase 不穩）、Pezeshkpour & Hruschka（13% 至 75%，作者已由先前誤植的 Zheng 更正）、Törnberg & Schimmel、Longjohn（作者三人）、Kim et al.（作者五人、option-level likelihood、翻譯改變偏向）、Sakhawat（作者六人、表態不預測行為）、Zhou & Zhang（Scientific Reports 2024）、Frank（拒答率漏掉框架引導）、lukes Issue 43（2021）、TPOF 2025a 的 77.4%。以上作者、年份、標題與描述均未發現誇大，例外見 m9 與 M9。

**寫作規則**：全文沒有 em dash 與 en dash；沒有「rather than」。其餘見 m8。

---

## 6. 最需要作者親自判斷的三個問題

1. **主分析要怎麼定，摘要的強度要怎麼調（C3、C4）。** 「簡中區間完全低於 0.5」與「14/15 顯著」只在「10 單位加權 + 7 群集百分位 bootstrap」下成立；改成概念等權或 t 檢定、符號翻轉檢定後，只有簡中的差異站得住，Jev 在繁中與英文的點估計甚至會高於 0.5。作者要決定：接受較弱的摘要（「簡中穩健、繁中英文取決於檢定」），還是擴充指數概念後重跑。這個選擇會直接決定 Threads 與 X 上那一句標題能寫多重。

2. **Claude 不利結果的呈現，以及「方向相反」這個主軸還要不要（M3、M4、M5）。** Sonnet 在簡中選了「一個中國、中華人民共和國是唯一合法政府」，在北京提問者下選「台灣是中華人民共和國領土的一部分」，而且主張與標籤同向移動。論文由 Claude 協助撰寫，這些結果目前不在正文。作者需要決定：補上 B 組結果之後，第 5 節的主軸改成「排序反轉」，還是保留「方向相反」但只用在 Jev。

3. **發表前是否通知 TypeSafe，以及要不要把官方已知限制寫進正文（M7、M12）。** 測試計畫決定發表前不通知。論文點名 Jev「reproduces the PRC's territorial claim」，而 TypeSafe 文件本來就寫明 CJK 較弱、正反句不互補。先給廠商回應期、並在正文引用官方限制，可以降低被指為「刻意打擊產品」的風險，但也會延後發表。這是信譽與時程的取捨，只有作者能決定。
