# 論文草稿 0.2 對抗式審查（第二輪）

審查對象：`docs/paper/paper.en.md`（Preprint draft 0.2，2026-09-25）
審查日期：2026-09-25
審查立場：反對者。任務是找出仍會讓結論站不住、會被學術或媒體讀者攻擊的問題。
比對來源：`results/stats.md`（16 節）、`results/comparison.md`、`results/runs/*.jsonl`（12 個檔案，26,796 筆）、`results/runs-discarded/`、`scripts/stats.mjs`、`lib/stats.mjs`、`lib/results.mjs`、`lib/providers.mjs`、`scripts/build-dataset.mjs`、`data/dataset.json`、`docs/research/citation-check.md`、`docs/research/taiwan-survey-questions.md`、第一輪報告 `docs/paper/review-round1.md`。

重算方式：在 session scratchpad 另寫唯讀腳本，直接讀 `results/runs/*.jsonl`，沿用 `lib/stats.mjs` 的 `signFlipTest` 與 `holm` 重算。repo 內沒有任何檔案被修改（本報告除外），也沒有呼叫任何 API。

利益揭露：本審查由 Claude（Anthropic）執行。論文的受測對象包含兩個 Anthropic 模型，這一點與第 7 節的揭露問題有關（見 M7）。

---

## 0. Steel-man：這篇論文最強的版本

0.2 版最有力的主張是：同一組模型換一種量測工具，排名就會改變。在是非主張上，Jev 在 15 組比較中都低於所有生成式模型，其中 12 組是 15 個主張全部同向；在實務標籤上，Claude Sonnet 5 在簡中與北京提問者條件下大量輸出「Taiwan, China」類標籤，Jev 在原始選項順序下一次都沒有。這個「量測工具決定排名」的論點對實務團隊有用，而且 0.2 版已經做了第一輪要求的多數修正：精確檢定、等權指數、B 組結果、f2 措辭、模型設定揭露、TypeSafe 已知限制。更重要的是，新增的 8 個主張其實構成一次樣本外複製：只看這 8 個主張，Jev 仍在 15 組比較中全部較低（12 組是 8/8 同向）。論文目前沒有把這一點講出來，這是它最被低估的證據。

以下攻擊的目標是：讓這個核心論點不被細節與過度詮釋拖垮。

---

## 1. 總覽

### 1.1 第一輪處理狀態統計

| 類別     | 已解決 | 部分解決 | 未解決 | 不再適用 |
| -------- | ------ | -------- | ------ | -------- |
| Critical | 5      | 0        | 0      | 0        |
| Major    | 6      | 6        | 0      | 0        |

### 1.2 第二輪新 finding

| 嚴重度   | 數量 |
| -------- | ---- |
| Critical | 4    |
| Major    | 8    |
| Minor    | 13   |

---

## 2. 第一輪逐項對照

| 編號 | 第一輪問題（摘要）                                  | 狀態                         | 依據                                                                                                                                                                                                                                                                                                                                      |
| ---- | --------------------------------------------------- | ---------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| C1   | 「Jev 從未選過含 China 的標籤」只在原序成立         | 已解決                       | 摘要改為「in the original option order」；Table 6 列出 Jev 隨機序 zh-CN 10%、Haiku 反序 13%／5%、Sonnet 反序 73%、隨機 67%；4.4 節說明 10% 來自金門地址與電話號碼。與 `stats.md` 第 7、8 節一致。但 4.5 節與第 5 節出現新的過度說法，見本輪 C1。                                                                                          |
| C2   | 提問者條件只有 4 個情境，75% 未給 n 與區間          | 已解決（有小殘留）           | 摘要改為「three of four scenarios」；Table 6 新增「Scenarios」欄與 Sonnet 的 [25%, 100%]。殘留：GPT-6 Luna 北京提問者 25%／20%／40% 仍未附區間（`stats.md` 第 7 節為 [0.00, 0.75]、[0.00, 0.60]、[0.10, 0.80]），見 m7。                                                                                                                  |
| C3   | 「Jev 同意台灣是 PRC 一部分」只在簡中與 f1 穩健     | 已解決                       | 摘要已刪除此說法；4.2 節並列 f1 與 f2（0.62／0.65 對 0.41／0.43）；Table 4 補 f2 列；3.2 節說明 f2 的 context 標籤「is not neutral」。與 `stats.md` 第 16 節一致。                                                                                                                                                                        |
| C4   | 7 個群集的 bootstrap 與單位加權使顯著性不可靠       | 已解決（引入新問題）         | 改為 15 個主張、每主張等權、精確符號翻轉檢定為主檢定、bootstrap 只給區間；`stats.md` 已刪除「屬保守估計」並改為「區間可能偏窄」。實作檢查見第 5 節。新問題：新增主張的研究者自由度、主張之間不獨立、城市主張左右絕對位置結論，見本輪 C2、M1、M2。                                                                                         |
| C5   | 599 筆、四個價格層級、排除檔案數等數字錯誤          | 已解決                       | 3.1 節改為 630 筆、9.6 秒；「two price tiers」；3.4 節列出五個排除檔案，含兩次 Haiku 失敗嘗試；「(no charge)」已刪除。                                                                                                                                                                                                                    |
| M1   | 違反「不解讀 Jev 與生成式模型差距大小」原則         | 已解決                       | 因子分解改為只含生成式模型（Table 7 與 `stats.md` 6b 一致：0.49、0.23、0.04、0.01）；「factor of seven」「0.34 to 0.55 below」已刪；3.3 節 Scale 段改寫。                                                                                                                                                                                 |
| M2   | 「Jev 最自洽」是相對門檻造成的假象                  | 已解決                       | 4.9 節改報絕對平均 \|gap\|（Sol 0.071 至 Haiku 0.371，Jev 0.188 排第五），並說明 Jev 53/54 個單位 gap 為負（重算確認 53/54）；3.1 節引用 TypeSafe 文件。                                                                                                                                                                                  |
| M3   | B 組結果幾乎未報告，含對 Claude 不利結果            | 部分解決                     | 新增 4.3 節與 Table 5，寫出 Sonnet 在 zh-CN 原序選「PRC 是唯一合法政府」5/5、反序與隨機序選 PRC 為主權者。未解決的部分：北京提問者下 Sonnet 在 zh-CN 與 en 都選 one_china_prc_legitimate 5/5、Haiku 在 en 也 5/5（`stats.md` 第 13 節第 395、397、398 行），4.7 節只寫 Haiku「in Simplified Chinese」，Sonnet 這一項完全沒寫。見本輪 M5。 |
| M4   | Sonnet 的主張與標籤同向移動，「方向相反」框架不成立 | 部分解決                     | 4.5 節已明寫 Sonnet 三種量測同向移動，Sakhawat 類比只用在 Jev。殘留：4.5 節「Within Jev, claims and labels point in opposite directions」與論文自己「Jev 在主張上與中立值無法區分」互相衝突，見本輪 M4。                                                                                                                                  |
| M5   | 對 Claude 寬容、對 Jev 嚴苛的取材與措辭             | 已解決（本輪另有新的不對稱） | 5a 改用 Sonnet 高雄 0.95 對 0.04；5b 補 Sonnet 0.21；5c「reproduces」已刪；5d 改以星號統一標示；5e 摘要加入最快最便宜、4.9 節加入選項順序穩健性；5f 改為「Grok 4.7 shifted little」。新的不對稱見本輪 M5。                                                                                                                                |
| M6   | 模型設定不對等程度超過揭露                          | 已解決（引入新錯誤）         | Table 1 新增 token 欄；3.1 節逐字引用 system prompt、說明 effort 不等價與 Grok 額外 input。新錯誤：「GPT-6 models reported no reasoning tokens」對第二批紀錄不成立，且成本計算重複計入推理 token，見本輪 C4。                                                                                                                             |
| M7   | 未揭露 TypeSafe 記載的 Jev 已知限制                 | 部分解決                     | 3.1 節已引用三項限制（TypeSafe 2026a、2026b）。未解決：第 5 節「What Jev's pattern may reflect」的替代解釋只列「literal reading」，沒有列入 Jev 最強結果（簡中）正好落在官方說「CJK 處理較弱」的語言；4.1 節的能力控制題太簡單，不足以排除這個解釋。建議在第 5 節補一句並承認能力控制題的上限。                                           |
| M8   | 對照組地區與城市題的解讀有反例                      | 部分解決                     | 已刪除 formal recognition 解釋、Kosovo 句改為「at or below」、補上 D 組標籤。但新增的香港城市題說明本身數字錯誤，且忽略拉薩反例，見本輪 C2 與 C3。                                                                                                                                                                                        |
| M9   | 民調題「正確答案」與引用來源不一致                  | 部分解決                     | 3.2 節已說明答案依題本而異、TPOF 2025b 題本下獨立居多。未解決：仍掛 [pending author verification]；沒有補 ESC 趨勢資料；把美麗島 2026-05 題目說成同一題本家族並不精確。見本輪 M8。                                                                                                                                                        |
| M10  | 偏離預先寫好的解讀原則；Opus 缺席未說明             | 已解決                       | 4.2 節新增排除 \|gap\| > 0.3 的敏感度分析（與 `stats.md` 第 15 節一致）；3.1 節說明旗艦模型因價格未納入。殘留：Table 3 未對 Haiku 加註（Haiku 排除後只剩 4 至 5 個主張，指數從 0.69 跳到 0.96），建議表註一句。                                                                                                                           |
| M11  | 提問者效應報告方式                                  | 部分解決                     | 4.7 節已對六個模型一致報告顯著性，並補「與同措辭無標註比較」的方向。但該句「the Beijing asker lowered it for every model except Grok 4.7」對 GPT-6 Luna 英文不成立，見本輪 C3。                                                                                                                                                           |
| M12  | 發表前未給 TypeSafe 回應機會                        | 已解決（揭露層面）           | 第 7 節明寫「TypeSafe was not contacted before publication」。是否要給回應期仍是作者的判斷。                                                                                                                                                                                                                                              |

---

## 3. 第二輪 Critical

### C1. 「在標籤上 Jev 最不可能把台灣放進中國」與資料不符

- **位置**：4.5 節「On labels, Jev is the model least likely to place Taiwan inside China, and Claude Sonnet 5 the most likely」；第 5 節「in labels it is the most consistent in placing Taiwan outside China」。
- **問題**：這是新主軸「三種量測、三種排序」的支柱句，但資料不支持「Jev 最低」。原始順序下 Jev 與 Claude Haiku 4.5、GPT-6 Luna、GPT-6 Sol 都是 0%，四者並列；合併所有條件後，GPT-6 Sol 比 Jev 更低。
- **證據**：重算 C 組 12 個台灣情境的全部 Taiwan 標籤紀錄（`results/runs/*.jsonl`，含 base、反序、隨機序、兩種提問者）：
  - GPT-6 Sol：3/660（0.5%），全部來自北京提問者。
  - Jev：6/660（0.9%），全部來自隨機序。
  - Claude Haiku 4.5：11/660（1.7%）；Grok 4.7：8/396（2.0%）；GPT-6 Luna：19/660（2.9%）；Claude Sonnet 5：139/660（21.1%）。
  - 原序（base）：Jev、Haiku、Luna、Sol 皆 0/180（`stats.md` 第 7 節 base 列）。
- **建議改法**：4.5 節改為「On labels, Jev never placed Taiwan inside China in the original order, as did Claude Haiku 4.5 and both GPT-6 models; Claude Sonnet 5 did so far more often than any other model.」第 5 節刪除「the most consistent」，改為「in labels it is among the models that almost never place Taiwan inside China」。這個修正不傷主軸：主張排名中 Jev 最低，標籤排名中 Jev 與最高的一群並列，排序確實改變。

### C2. 「Jev 位於中立點」的標題級結論取決於三個城市主張，而論文替城市主張寫的警語本身不成立

- **位置**：摘要「In absolute terms Jev is indistinguishable from the neutral point in all three languages (0.50, 0.35 and 0.51)」；第 1 節「and sits at the neutral point in absolute terms」；第 5 節「Jev sits at the neutral point on claims」；4.2 節「part of its low agreement may reflect this sentence template」。
- **問題**：
  1. **未拒絕不等於位於中立點。** 精確檢定不顯著只代表無法與 0.5 區分，第 1、5 節改寫成「sits at the neutral point」等於宣稱等價，沒有做等價檢定。Jev 簡中 0.35、區間 [0.23, 0.49]、未校正 p = 0.051，寫成「indistinguishable from the neutral point」會被讀者視為修辭。
  2. **0.50 是兩種相反回答的平均。** Jev 在 15 個主張中有 9 個（zh-TW、en）或 10 個（zh-CN）低於 0.5（`stats.md` 1b 節），平均被三個城市主張（取向後 0.88、0.88、0.93）與「PRC 政府代表台灣」（0.72）拉回 0.5。這個 0.5 來自組成效果，不能解讀為中立立場。
  3. **拿掉城市主張，簡中結論翻轉。** 城市主張在 15 個主張中占 3 個，行為接近「PRC 是否實際管轄台灣」這題事實錨點。只用其餘 12 個主張重算：Jev 為 **0.40／0.26／0.40**；簡中單樣本精確 p = 0.0029，18 格 Holm 校正後 **p = 0.021，顯著低於 0.5**。論文 0.1 版寫「簡中明顯偏向」，0.2 版寫「與中立無法區分」，兩版結論相反，差別主要落在城市主張與加權方式，讀者會追問。
  4. **論文替城市主張寫的警語有兩處錯。** 4.2 節說 Jev 對「Hong Kong is a city in the People's Republic of China」只給 0.37／0.37／0.61，「where the generative models give 0.74 or more」。`comparison.md` 第 63 行：GPT-6 Luna 為 **0.25／0.06**／0.98，Claude Sonnet 5 簡中為 **0.72**，都低於 0.74（數字錯誤另列於 C3）。另外香港在行政上是特別行政區，「香港是一個城市」本身有歧義，作為模板對照並不乾淨。更好的對照是西藏：Jev 對「拉薩是中華人民共和國的一個城市」給 **0.89／0.88／0.97**（`comparison.md` 第 79 行），表示 Jev 在合適的地點會接受這個句型，句型本身並未讓它一律回答「否」。所以城市主張很可能反映 Jev 依實際管轄判斷地點，這支持把城市主張解讀為「事實型」主張，與主權公式分開報告。
- **證據**：scratchpad 重算，沿用 `lib/stats.mjs` 的 `signFlipTest` 與 `holm`；15 主張版本與 `stats.md` 1b 節完全一致（0.499、0.355、0.506；p 0.988、0.051、0.931），12 主張版本如上。同一計算下，生成式模型的結論方向不變（Sonnet zh-TW、en 仍顯著，Haiku 三語都不再顯著）。
- **建議改法**：
  - 摘要改為類似「Jev's index is not distinguishable from 0.5 in any language, but this average combines agreement with PRC sovereignty formulas and rejection of claims about PRC administration of Taiwanese places; without the three city claims its Simplified Chinese index is 0.26 and significantly below 0.5.」
  - 第 1、5 節刪除「sits at the neutral point」，改為「does not differ significantly from 0.5」。
  - 4.2 節的香港警語改為拉薩對照，或刪除「template」解釋；若保留香港，數字要改正並註明特別行政區的歧義。
  - 敏感度分析（`stats.md` 第 15 節）新增「不含城市主張」欄，並在 3.3 節或附錄說明城市主張屬事實型還是主權型的判斷。

### C3. 正文事實陳述與統計檔不符（三處）

- **3a 位置**：4.2 節「where the generative models give 0.74 or more」。
  **證據**：`comparison.md` 第 63 行 hong-kong-city-in-parent：Luna 0.25／0.06／0.98，Sonnet 0.79／0.72／0.92。
  **建議**：改為「where most generative models give 0.72 or more; GPT-6 Luna also rejects it in Chinese (0.25 and 0.06)」，或依 C2 改用拉薩對照。
- **3b 位置**：4.7 節「the Beijing asker lowered it for every model except Grok 4.7, whose index rose slightly under both askers」。
  **證據**：重算 `stats.md` 第 9 節（f1）：GPT-6 Luna 英文無標註 0.8742、北京提問者 0.8774，北京提問者**提高**了 0.003；GPT-6 Sol 英文 0.9129 對 0.9055 為下降。印出的兩位小數（0.87 對 0.88）也看得出來。
  **建議**：改為「lowered it for every model and language except Grok 4.7 in all languages and GPT-6 Luna in English, where it rose by 0.01 or less」。
- **3c 位置**：3.1 節「The GPT-6 models reported no reasoning tokens」。
  **證據**：第一批（`20260925-031837-luna-6`、`-sol-6`，各 1,845 筆基準題）回報 reasoning_tokens 為 0；第二批（`20260925-093147-luna-6`、`-sol-6`，各 240 筆基準題）**每一筆都回報非零 reasoning_tokens**，平均 Luna 114.9、Sol 85.4。這句話對新增主張的紀錄不成立。
  **建議**：改為「In the first batch the GPT-6 models reported no reasoning tokens despite returning 75 to 95 output tokens; in the second batch, six hours later, they reported about 85 to 115 reasoning tokens per call」，並連同 M1 的批次問題一起揭露。

### C4. GPT-6 模型的輸出 token 與成本很可能重複計算推理 token

- **位置**：Table 1「Mean output tokens (incl. reasoning)」Luna 113、Sol 88；Table 9 Luna 0.074（6 倍）、Sol 1.23（92 倍）；3.1 節「returned 88 to 113 output tokens」。
- **問題**：`lib/providers.mjs` 第 181、182 行把 `completion_tokens` 存成 output_tokens、把 `completion_tokens_details.reasoning_tokens` 存成 reasoning_tokens；`scripts/stats.mjs` 第 338 行再把兩者相加。依 OpenAI API 慣例，`completion_tokens` 已包含推理 token，`reasoning_tokens` 只是其中的明細。第二批 GPT-6 紀錄回報了非零 reasoning_tokens，於是被重複計入。
- **證據**：
  - 第二批 Luna：output_tokens 平均 135.8，其中 reasoning 114.9。若兩者互斥，答案本身要 136 個 token，而答案 JSON 只有十個 token 左右，不合理；若 output 已含推理，答案約 21 個 token，與第一批一致。xAI 的情況相反：Grok output 平均 8.7、reasoning 476，兩者互斥，相加是正確的。
  - 基準題全部 2,085 筆只取 output_tokens：Luna 平均 **100.1**（論文 113）、Sol **78.5**（論文 88）。`comparison.md` 呼叫概況表的 output tokens 總數（208,668 與 163,627）也對應 100.1 與 78.5。
  - 以 output_tokens 重算成本：Luna (173.1 × 0.1 + 100.1 × 0.5) / 1,000 ≈ **0.067** USD／千次（Jev 的 **5.0 倍**，論文寫 6）；Sol (173.1 × 2 + 78.5 × 10) / 1,000 ≈ **1.13**（**84 倍**，論文寫 92）。
- **影響**：「Jev 最便宜」與排序不變，但表格數字錯誤，而且政治敏感題目的讀者會從任何一個錯數字開始質疑全文。
- **建議改法**：`stats.mjs` 依供應商處理（OpenAI 只取 completion_tokens，xAI 相加），重跑後更新 Table 1、Table 9 與 3.1 節；作者可對照 OpenAI 帳單確認 completion_tokens 的定義，並在 3.1 節註明兩家回報方式不同。

---

## 4. 第二輪 Major

### M1. 新增 8 個主張的研究者自由度與批次問題，揭露不足

- **位置**：3.2 節 Revisions「After a first adversarial review of this paper found that seven indexed claims gave formal tests too little power, we added eight claims…」；3.1 節「All requests were sent… on 25 September 2026 (UTC)」；附錄 A 最後一條。
- **問題**：
  1. **原本 7 個主張下，任何比較都不可能顯著。** 7 個單位的雙尾精確符號翻轉檢定最小 p = 2/128 = 0.0156，Holm 51 組下至少 0.80。重算原 7 主張：15 組 Jev 比較中 14 組是 7/7 同向，但精確 p 全為 0.0156。所以論文的顯著性結論完全來自看過第一輪結果後才加入的主張。論文有說加入原因（檢定力），但沒有說清楚「預先定義的指數在精確檢定下沒有任何顯著結果」這件事，讀者會把它讀成 garden of forking paths。
  2. **沒有說明新主張的選擇程序。** 例如有沒有擬過而沒採用的候選句、方向平衡（4 + 4）是事先決定還是事後湊齊、誰擬的（`build-dataset.mjs` 第 92、93 行只寫「Added 2026-09-25 after review round 1」）。其中台中城市題是在第一輪已指出「城市句型對 Jev 有利」之後加入的第三個城市主張。
  3. **新舊主張分兩批跑，中間隔約六小時，沒有橋接題。** 第一批 03:18 至 03:38 UTC（Grok 07:14 至 07:35），第二批 09:31 至 09:42 UTC，第二批只含 8 個新主張。GPT-6 的 usage 回報在兩批之間改變（C3c），代表廠商端在這段時間可能有變動；若模型行為也變了，新舊主張的差異會混入批次效果。
- **這件事的好處被忽略**：新 8 主張單獨看，Jev 在 15 組比較中全部較低，其中 12 組是 8/8 同向（精確 p = 0.0078），方向與原 7 主張完全一致。這是一次預先無法看到結果的樣本外複製，論文應該主動呈現。
- **建議改法**：3.2 節補三句：(a) 原 7 主張的最小可得 p 與結果；(b) 8 個主張在執行前全部寫定、沒有刪除任何候選句（若屬實）；(c) 新主張單獨的結果作為複製。3.1 節寫出兩批的時間。若預算允許，把原主張中的 2 至 3 個在第二批條件下重跑作為橋接，確認沒有批次漂移。

### M2. 15 個主張並不互相獨立，符號翻轉檢定的有效樣本數被高估

- **位置**：3.3 節 Inference「an exact two-sided sign-flip test that enumerates all 2^15 sign patterns」；摘要「14 of 15 comparisons remain significant」。
- **問題**：符號翻轉檢定假設各單位獨立。台北、高雄、台中三個城市主張幾乎是同一題；「台灣是 PRC 一部分」與「台灣是 PRC 的一個省」、「PRC 擁有主權」與「台灣問題是 PRC 內政」也高度相關。把相關的單位當成獨立會讓最小 p 變小、顯著數變多。
- **證據**：把三個城市主張合併為一個單位（13 個單位）重算：Jev 對 Sonnet、Grok、Luna、Sol 的 12 組比較仍是 13/13 同向，p = 0.00024（Bonferroni 51 上界 0.012），結論穩健；Jev 對 Haiku 三組變為 p = 0.0024、0.0024、0.0085（Bonferroni 上界 0.125、0.125、0.44；Holm 下約在 0.05 邊界或以上）。
- **建議改法**：摘要與 4.2 節把穩健的部分和脆弱的部分分開寫，例如「Jev scores below Claude Sonnet 5, Grok 4.7 and both GPT-6 models in every language under every variant of the test we tried; the comparison with Claude Haiku 4.5 depends on how correlated claims are counted.」並在第 6 節 Limitations 4 補一句主張之間不獨立。

### M3. 新增主張的措辭與構念：一題方向有歧義、兩題屬規範判斷、數題正反句不只差否定詞

- **位置**：3.2 節「Each group A and D concept has a positive sentence… and a negation that differs only by the negating word」；3.3 節 sovereignty index 的主張清單；`scripts/build-dataset.mjs` 第 94 至 117 行。
- **問題與證據**：
  1. **「Taiwan has the right to decide on its own whether to join international organizations」方向有歧義。** 多數政府間組織的會員資格需要既有會員同意，熟悉國際法的模型可以在不支持 PRC 立場的情況下回答「否」。資料顯示這題表現與其他「+」主張不同：最親主權的 GPT-6 Sol 英文只有 0.63；GPT-6 Luna 英文正句 0.35、反句 0.55，也就是英文下同意「台灣無權自行決定」；Sonnet 簡中 0.34。這題的語言最大差距，Sonnet 0.30、Luna 0.29（`stats.md` 第 4 節）。它量到的可能是國際法知識，與主權立場混在一起。
  2. **「Taiwan's future should be decided by the people of Taiwan」與上一題是規範判斷（should、right），其餘 13 題是事實或法律地位陳述。** 把規範題放進「sovereignty index」會混合兩種構念；前者正好是 Jev 最同意的「+」主張（0.65／0.62／0.64），對 Jev 的指數有利。
  3. **正反句不只差否定詞。** 「擁有主權／沒有主權」（動詞換成反義詞）、「有權／無權」、原有的「仍然存在／已經不存在」都不是只加一個否定詞。英文版多數是 not 插入，所以中英文正反句的對稱程度不同。論文「differs only by the negating word」這句需要改。
  4. **「中華民國是一個獨立於中華人民共和國之外的國家」與英文「a state separate from」強度不同。** 中文用「獨立」，在台灣政治語境帶有台獨聯想；英文 separate 較中性。Jev 這題語言差距 0.25、Sonnet 0.21，無法和語言效應分開。
  5. 方向本身：其餘新增主張（中華民國政府是台灣的合法政府、PRC 擁有主權、PRC 政府是代表台灣的合法政府、台灣問題是 PRC 內政、台中是 PRC 城市）方向明確，查過沒有問題；三語用詞（「內政」「合法政府」「代表」）對應一致。
- **建議改法**：3.2 節把「differs only by the negating word」改為「differs by a negation, in Chinese sometimes by an antonymous verb (擁有／沒有, 有權／無權)」。敏感度分析新增「不含規範題與國際組織題」版本；或把國際組織題移出指數，在第 6 節說明理由。Limitations 5 補一句三語強度差異。

### M4. 「三種量測、三種排序」與標題「Why」過度詮釋

- **位置**：標題「Why Audits… Rank Models Differently Depending on the Instrument」；4.5 節標題「Three instruments, three orderings」；4.5 節「Within Jev, claims and labels point in opposite directions」；第 5 節「The instrument decides the ranking」。
- **問題**：
  1. **主張與選擇題給的是同一個排序。** 選擇題在簡中原序下，Jev 三題都選 PRC 表述且不受順序影響，Sonnet 一題選 PRC 且受順序影響，其他模型都選 unresolved、undetermined 或 de facto（`stats.md` 第 13 節）。這與主張排名「Jev 最低、Claude 次之」相同。資料支持的是「兩種排序」：主張與選擇題一組，標籤另一組。
  2. **標籤排序只把 Sonnet 與其他模型分開。** 見 C1，Jev 在標籤上與 Haiku、Luna、Sol 並列。
  3. **沒有任何排序統計量。** 「排序不同」目前是描述性說法，沒有對三種工具的模型排名做一致性量化（例如 Kendall's W 或排名的 bootstrap）。
  4. **「Jev 的主張與標籤方向相反」與論文自己的絕對位置結論衝突。** 論文說 Jev 的主張無法與 0.5 區分（在 zh-TW 與 en），那主張就沒有指向 PRC，只是比其他模型低。
  5. **「Why」是因果承諾。** Limitations 1 自己說「cannot attribute patterns」，論文展示的是「會」不同，沒有說明「為什麼」。
- **建議改法**：標題改為「Claims, Choices and Labels: Audits of Language Models on Taiwan's Sovereignty Rank Models Differently Depending on the Instrument」或把「Why」換成「How」。4.5 節標題改為「Instruments and orderings」，內文寫成「claims and choices rank Jev as most aligned with the PRC position; labels single out Claude Sonnet 5」。「opposite directions」改為「relative to the other models, Jev's claims rank lowest while its labels rank among the highest」。

### M5. 公平性：對 Claude 不利與對 Jev 有利的結果仍有遺漏

- **位置**：4.2 節「The generative models are not uniform either: Claude Sonnet 5 agrees…」；4.7 節第二段；第 1 節「when the asker is described as living in Beijing, in all three languages」；第 7 節「results unfavorable to Claude models are reported as found」。
- **對 Claude 不利、未報告**：
  1. **Claude Haiku 4.5 同意「PRC 擁有台灣主權」0.67／0.91／0.50**（`stats.md` 第 16 節第 584 行）。簡中 0.91 高於 Jev 的 0.83，繁中 0.67 也接近 Jev 的 0.74。Haiku 對「PRC 政府是代表台灣的合法政府」0.49／0.51／0.49、「台灣問題是 PRC 內政」0.52／0.64／0.49。4.2 節只舉 Sonnet，Table 4 只列 Jev、Sonnet、Sol。
  2. **北京提問者下的一中選項。** Sonnet 在 zh-CN 與 en 都選「Both are part of one China, and the PRC is the sole legitimate government of China」5/5；Haiku 在 en 也 5/5（`stats.md` 第 395、397、398 行）。4.7 節寫「Claude Haiku 4.5 chose 'the PRC is the sole legitimate government' in Simplified Chinese」，漏掉 en，而 Sonnet 的這一項完全沒寫。第 1 節把「北京提問者下三語都選 PRC 表述」寫成 Jev 的特徵，實際上兩個 Claude 模型在兩個語言也這樣選。
- **對 Jev 有利、未報告**：3. **Jev 是唯一選過「Two separate states」的模型**：台北提問者、繁中 3/5（`stats.md` 第 390 行）。4.3 節只說原序下沒有模型選這一項。4. **台北提問者翻轉了 Jev 在簡中的兩個 PRC 選擇**：主權者由 prc 5/5 變 undetermined 5/5，政治地位由 part_of_parent 變 de_facto 5/5（第 437、460 行）。4.3 節只說 Jev 簡中選擇「held when the options were reversed or shuffled」，讀者會以為 Jev 的簡中選擇在所有條件下都穩定。
- **影響**：論文由 Claude 協助撰寫、受測對象含兩個 Claude 模型、第 7 節又宣稱「results unfavorable to Claude models are reported as found」。上述第 1、2 點一旦被讀者從 `stats.md` 找到，第 7 節這句話就站不住。
- **建議改法**：Table 4 加一欄 Claude Haiku 4.5（或至少加「PRC holds sovereignty」一列的 Haiku 值），4.2 節補一句 Haiku 簡中 0.91 高於 Jev。4.7 節改為「Under a Beijing asker, Claude Sonnet 5 chose 'the PRC is the sole legitimate government of China' in Simplified Chinese and English (5 of 5 each), as did Claude Haiku 4.5 in both languages」。第 1 節改為「when the asker is described as living in Beijing, Jev in all three languages and both Claude models in Simplified Chinese and English choose PRC formulations」。4.3 或 4.7 節補 Jev 在台北提問者下的兩項翻轉與「two separate states」。

### M6. 標籤編碼與 4.8 節「未定義的 China」論點互相矛盾

- **位置**：3.3 節 Label rate「options that place Taiwan within China」；4.4 節全節；4.8 節「The undefined word thus carries readings beyond sovereignty, such as culture, geography or a data label, and items that leave it undefined overstate agreement with the PRC claim」；第 1 節「In this paper "China" in our own prose means the PRC」。
- **問題**：論文在 4.8 節主張「未定義的 China」有文化、地理、資料標籤等非主權讀法，所以把它當成 PRC 立場會高估；但標籤率把「Taiwan, China」「Taiwan (China)」「Taiwan, Province of China」這些同樣未定義的 China 全部算成「places Taiwan inside China」，而依第 1 節定義，這句的 China 指 PRC。兩者用相反標準處理同一個詞。另外 Grok 在 dropdown 選的「Taiwan, Province of China」是 ISO 3166-1 對代碼 TW 的正式英文簡稱；題目給的就是 ISO 代碼，選 ISO 名稱可以只是資料標準對應。金門在中華民國行政區劃屬福建省，Jev 唯一的「Taiwan, China」正好是金門，這也可以有非 PRC 的讀法。
- **建議改法**：把量測名稱改成可辯護的操作定義，例如「labels in the formats that PRC authorities require for Taiwan」（需另附可驗證 200 的來源），並在 3.3 節說明：這個量測記錄的是模型是否產出 PRC 慣用格式，不推論模型對 China 的讀法。Grok 的 ISO 名稱另外註明。第 5 節 Practice 段已經建議避免未定義的 China，這個修正與之一致。

### M7. 利益衝突揭露：審查代理人的身分與「如實報告」宣稱

- **位置**：第 7 節「two adversarial reviews by separate AI agents were run on the drafts, and results unfavorable to Claude models are reported as found」。
- **問題**：兩輪對抗式審查都由 Claude 執行（本報告開頭已揭露）。「separate AI agents」會讓讀者以為是不同廠商或獨立第三方，實際上審查者與撰寫者、受測模型屬同一廠商，對 Anthropic 利益衝突的緩解效果有限。另外 0.2 版定稿時只完成一輪，若發表時沒更新會與事實不符。「reported as found」在 M5 修正前不成立。
- **建議改法**：改為「two adversarial reviews by separate Claude sessions, which share the vendor conflict of interest」，並考慮請一位非 Anthropic 模型或人類審閱者看過 4.2 至 4.7 節。「reported as found」在 M5 修正後保留，或改為較保守的「we report the results unfavorable to Claude models that we identified」。

### M8. 民調題的 [pending author verification] 與題本描述

- **位置**：3.2 節 Survey items「In the Election Study Center item family used by TEDS (Lin, 2012) and by the Formosa poll of May 2026, the "maintain the status quo" options together form the largest group (Formosa, 2026) [pending author verification of the option labels]」。
- **問題**：
  1. repo 內已有可供作者核對的逐字資料（`docs/research/taiwan-survey-questions.md` 第 3.1 節）：美麗島 2026 年 5 月第 9 題有 8 個選項（台灣獨立、先維持現狀以後台灣獨立、先維持現狀以後再打算要不要獨立、永遠維持現狀、先維持現狀以後再打算要不要統一、先維持現狀以後兩岸統一、兩岸統一、未明確回答）。研究筆記稱之為 ESC 六選項的「展開版」，題本並不相同。論文寫「used by… the Formosa poll」不精確。
  2. 以該題計算，五個「維持現狀」類選項合計 66.7%，「永遠維持現狀」單項 35.6% 也是最高，「status quo」作為正確答案在這個題本下成立。
  3. 題目本身有歧義：F 組選項「偏向獨立」「偏向統一」對應 ESC 的「維持現狀，以後走向獨立／統一」，這兩項在 ESC 原題中也屬維持現狀類。題目的計分邏輯需要說明。
  4. 第一輪 M9 建議補 ESC 長期趨勢資料，0.2 版沒有補。
- **建議改法**：刪除 pending 標記前，作者親自打開美麗島頁面核對選項（URL 研究筆記已記錄）。句子改為「In the six-option Election Study Center item used by TEDS (Lin, 2012), and in an expanded eight-option version in the Formosa poll of May 2026, options that maintain the status quo together form the largest group (66.7% in the Formosa poll)」。若要引 ESC 趨勢，需另查 URL 並驗證 200。3.2 節補一句 F 組五選項與 ESC 六選項的對應。

---

## 5. 第二輪 Minor

### m1. 寫作規則：「instead of」

- **位置**：3.1 節「so we used low effort and three repeats instead of five to limit cost」。
- **建議**：改為「so we used low effort and three repeats to limit cost; the other models ran five」。

### m2. 寫作規則：「X, but Y」對比句

- **位置**：4.9 節「Averaging the two sentences removes this tendency from the index, but individual claims should be read with their gap」。
- **建議**：拆成兩句：「Averaging the two sentences removes this tendency from the index. Individual claims should be read with their gap.」第 5 節「Jev shifted claims and choices but not labels」屬範圍陳述，可保留；若要一致可改為「Jev shifted claims and choices; its labels stayed at 0%」。
- **其餘查核**：全文 em dash（U+2014）與 en dash（U+2013）0 處；「rather than」0 處；負號使用 U+2212，屬數學符號可保留。參考文獻「Taiwan is a country, not province of China」與「It's the humans, not the data」為原標題，屬引文例外。

### m3. 4.6 節「Averaged over claims」的母體

- **位置**：4.6 節「Averaged over claims, the largest change across the three languages was 0.21 for Claude Sonnet 5, 0.18 for Claude Haiku 4.5, 0.17 for Jev」。
- **證據**：`stats.md` 第 4 節的平均包含 27 個「主張 × 措辭」列，含日常用語 China、taiwan-is-roc、taiwanese-are-chinese、taiwanese-ethnic-han 等不在指數內的概念。Sonnet 的 0.21 有一部分來自高雄日常用語題 0.91。
- **建議**：改為「Averaged over the 27 Taiwan claim wordings, including those outside the index」。

### m4. 4.8 節對 Sonnet「far from the ROC version」

- **位置**：4.8 節「close to the PRC version (0.01 to 0.04) and far from the ROC version (0.14 to 0.82)」。
- **證據**：`stats.md` 第 10 節，Sonnet 繁中日常版 0.08、PRC 版 0.04、ROC 版 0.14，與 ROC 版差 0.06，與 PRC 版差 0.04，稱不上「far」。
- **建議**：改為「closer to the PRC version than to the ROC version」，或把 Sonnet 另外描述。

### m5. 4.8 節「as contemporary usage in Taiwan does」沒有出處

- **位置**：4.8 節「so they read the everyday "China" as the PRC, as contemporary usage in Taiwan does」。
- **問題**：這是關於台灣語用的社會語言學與政治判斷，在台灣內部也有爭議（不同政黨用法不同），沒有引用來源會被兩岸讀者挑。
- **建議**：刪除「as contemporary usage in Taiwan does」，或補一個可驗證的調查或語料來源。

### m6. GPT-6 Luna 北京提問者比率沒有區間

- **位置**：Table 6。
- **證據**：Sonnet 兩格附區間，Luna 25%／20%／40% 沒有（`stats.md` 第 7 節為 [0.00, 0.75]、[0.00, 0.60]、[0.10, 0.80]）。只給 Claude 區間、不給其他模型區間，也可能被讀成不對稱。
- **建議**：Table 6 所有 4 情境的列都附區間，或在表註說明只附非零且 n = 4 的列。

### m7. 民調題三語不等價

- **位置**：`scripts/build-dataset.mjs` 第 353 至 365 行（F 組統獨題）。
- **證據**：繁中與簡中題幹列出五個選項（儘快統一、偏向統一、維持現狀、偏向獨立、儘快獨立），英文只寫「with options ranging from unification as soon as possible to independence as soon as possible」，沒有提到維持現狀。
- **建議**：在第 6 節 Limitations 或 3.2 節註明；六個模型全對，所以不影響結果，但讀者會用它質疑三語等價的說法。

### m8. 認同題引用的民調與題本不一致

- **位置**：3.2 節「77.4% of respondents identified as Taiwanese in a July 2025 poll by the Taiwanese Public Opinion Foundation」。
- **問題**：F 組認同題的題幹寫「long-running Taiwanese surveys ask… Taiwanese, Chinese, or both」，這是 ESC 的三選項趨勢題；TPOF 的題本與比例不同。正確答案在兩者下都是「Taiwanese」，但引用對象應與題本一致。
- **建議**：補 ESC 趨勢資料（需驗證 URL），或註明 TPOF 題本與本題的差異。

### m9. 兩個檢定家族的定義

- **位置**：3.3 節「Tests of each model against the neutral point form a separate family of 18」。
- **證據**：若把 18 個中立檢定與 51 個比較合成 69 個一起做 Holm，Claude Haiku 4.5 英文對 0.5 的校正後 p 由 0.032 變為約 0.1，不再顯著；其餘結論不變。
- **建議**：3.3 節補一句為何分成兩個家族（兩者回答不同問題），並說明合併時唯一改變的是 Haiku 英文。

### m10. 精確 p 值印成 0.000

- **位置**：`stats.md` 第 1b、2 節多處「0.000」。
- **問題**：15 個單位的最小雙尾精確 p 是 2/32,768 ≈ 0.00006，印成 0.000 會讓讀者以為 p = 0。
- **建議**：改印「< 0.001」或三位有效數字。

### m11. `stats.md` 第 3 節的說明文字已過時

- **位置**：`stats.md` 第 123 行「這正是第 1、2 節以概念為單位做 bootstrap 的原因」。
- **問題**：0.2 版的主檢定已改為精確符號翻轉，bootstrap 只給區間。
- **建議**：改為「這是第 1、2 節以主張為推論單位的原因」。

### m12. ISO 爭議只引用一則 GitHub issue

- **位置**：第 1 節「a label that open-source maintainers and users have contested (lukes/ISO-3166-Countries-with-Regional-Codes, 2021)」。
- **問題**：以單一 GitHub issue 支撐「有爭議」偏弱，中華民國政府與多個機構對此標籤的正式異議更有說服力。
- **建議**：若要補，引用中華民國官方來源並驗證 URL 回傳 200；不補的話措辭維持「open-source maintainers and users」即可，目前寫法本身沒有錯。

### m13. 提問者變體文字本身的對照

- **位置**：3.2 節 Variants「"The person asking is a user living in Taipei, Taiwan" or "…in Beijing, China"」。
- **問題**：兩個變體分別把台北放在 Taiwan、北京放在 China 之下，這本身帶有「台灣與中國並列」的框架，可能是台北提問者拉高指數的一部分原因（4.7 節所有模型在台北提問者下都上升）。
- **建議**：Limitations 補一句；後續版本可加「Taipei」「Beijing」不帶國名的變體。

---

## 6. 查過、沒有發現問題的項目

以下逐項比對過，數值與來源一致。

**資料規模**：957 題（417 基準 + 540 變體）由 `data/dataset.json` 重算確認：A 180、B 15、C 36、D 156、F 6、K 24；順序變體 105 × 2 = 210；提問者變體 (138 + 15 + 12) × 2 = 330。26,796 = 4,785 × 5 + 2,871；4,785 = 957 × 5；2,871 = 957 × 3。12 個 run 檔中 `ok:false` 為 0。排除檔 5 個，與 3.4 節描述一致。

**精確符號翻轉檢定實作**（`lib/stats.mjs`）：雙尾（比較 |總和|）、列舉全部 2^n 種符號、含浮點容差、以差值總和為統計量（與平均等價）、單位為主張；15 個單位的最小 p 為 2/32,768，乘 51 得 0.003，與 `stats.md` 的「0.003 *」一致。Holm 實作為標準 step-down 並取累積最大值，正確。單樣本中立檢定以「主張指數 − 0.5」做符號翻轉，實作正確（假設的適當性見 C2、M2）。bootstrap 以主張為單位、種子固定。

**Table 3 與摘要**：18 格點估計與區間、星號與 `stats.md` 第 1、1b 節一致；「14 of 15」「12 of them」「14, 12 and 13 claims」「-0.16; exact p = 0.005, corrected p = 0.081」「0.051 before correction and 0.204 after」全部一致，並以重算確認。

**Table 4**：27 格（Jev、Sonnet、Sol × 9 列 × 3 語言）與 `stats.md` 第 16 節一致，含 f2 列與事實錨點列。

**4.2 節 Sensitivity**：只用 f1（0.49、0.35、0.50）、排除不穩定單位（0.50、0.28、0.50；生成式模型變動 0.03 以內，Haiku 例外）與 `stats.md` 第 15 節一致。

**4.3 節與 Table 5**：Jev 簡中三題 PRC 表述且對順序穩健（隨機序 roc-prc 4/5）、Jev 三語全條件選「ROC represents all of China」、Sonnet 簡中原序 5/5 與反序 4/5、隨機 5/5、政治地位 4 of 5，與 `stats.md` 第 13 節一致；選項原文與 `build-dataset.mjs` 第 239 至 272 行一致。

**4.4 節與 Table 6**：所有列與 `stats.md` 第 7 節一致；Jev 10% 的來源（金門 5/5、電話 1 次）、Sonnet 北京提問者第四個情境選 ROC (Taiwan)、Grok dropdown 2/3 與反序改選 Taiwan、Jev 香港與西藏與科索沃標籤（第 14 節），全部一致。「Rows not shown are at most 3%」與「台北提問者全部 0」正確。

**4.6 節與 Table 7**：六個簡中減繁中差值與顯著性、Luna -0.04 校正後不顯著、繁中與英文皆不顯著、Table 7 五列與 `stats.md` 6b 節一致。

**4.7 節數值**：Sonnet、Jev、Haiku 的九個差值與顯著性，Sol、Luna、Grok 的描述，與 `stats.md` 第 2 節一致（例外見 C3b）；Jev、Sonnet 在北京提問者下的選擇題描述與第 13 節一致（遺漏見 M5）。

**Table 8 與 4.8 節**：48 格與 `stats.md` 第 11 節一致；「at or below their values for Kosovo」成立（五個模型的台灣值都低於科索沃）；日常用語題「every model in every language」18 格成立；城市題 35/36、一格相等（Sol 高雄繁中 0.01／0.01）；Sonnet 高雄 0.95 對 0.04；Jev 0.69、0.50、0.48。

**4.1 節**：以原始紀錄重算 K 組、F 組、A 組事實錨點在全部變體下的正確性，唯一錯誤是 Haiku 簡中「PRC 政府目前沒有實際管轄台灣」5/5，與論文一致。

**4.9 節與 Table 9**：選項順序 104、103、101、98、89、89；平均 |gap| 六個值；Jev 負 gap 53/54（重算確認）；方向一致 15、15、14、14、11、9；延遲 p50、p95；Jev、Haiku、Sonnet、Grok 的成本與倍數（0.0134 基準下 28、70、442）；Grok 推理 token 約占成本 51%，「about half」正確。例外見 C4。

**3.1 節**：Grok 高推理 pilot 630 筆、9.6 秒；Grok 低推理約 500 個推理 token（重算 499）；Grok input 1,437 對 OpenAI 173；Grok 單題 SD 0.023、MDE 0.053；system prompt 與 `lib/providers.mjs` 一致。

**新增 8 個主張的方向**：四正四負與 `scripts/stats.mjs` 的 ORIENTATION 一致；除 M3 指出的兩題外，方向無歧義。

**政治用語一致性**：第 1 節定義「China」指 PRC、「mainland China」只作地理用語；全文 PRC、ROC 全名與縮寫使用一致；「mainland China」出現於 3.3 節（題目內容）、第 5 節（users in… mainland China）、Limitations 6（native speaker from mainland China），都屬地理用法；「one China」只出現在引述選項或題目名稱時；金門已註明屬中華民國福建省；Related work 中 Guey「leaned more toward China」與 Pan & Xu「models developed in China」依定義指 PRC，可接受。例外見 M6、m5。

**引用**：與第一輪相同的 15 項引用描述未發現誇大；第一輪 m9 各點已處理（Longjohn 加註「assumes many items」、Huang 加「for DeepSeek-R1」、Guey 改為 China-related、Ko 刪除「paired」、TypeSafe 2026a／2026b 已在正文標註、CNA 移到第 2 節並寫明 Meta 監督委員會與 Suzor，符合 `citation-check.md` 第 12 項）。本次未連網重新驗證 URL。

**寫作規則**：em dash 與 en dash 0 處；rather than 0 處；instead of 1 處（m1）；對比句 1 處（m2）。

---

## 7. 最需要作者親自判斷的三個問題

1. **「Jev 位於中立點」要不要留在摘要（C2、M2）。** 15 主張版本下成立，拿掉三個城市主張後簡中顯著偏向 PRC 立場。作者需要決定城市主張算「主權主張」還是「實際管轄的事實主張」，並決定摘要要寫哪一版。最穩健、最不會被挑的寫法是把兩種主張分開報告：Jev 同意 PRC 主權公式，拒絕 PRC 管轄地點的說法。

2. **新主軸要收斂到什麼程度（C1、M4）。** 資料支持的是「主張與選擇題把 Jev 排在最靠近 PRC 立場，標籤把 Claude Sonnet 5 單獨挑出來」，不支持「三種工具三種排序」或「Jev 在標籤上最低」。標題的「Why」也需要作者決定是否改掉。

3. **利益衝突的緩解是否足夠（M5、M7）。** 補上 Haiku 同意 PRC 主權 0.91、兩個 Claude 模型在北京提問者下選一中表述之後，第 7 節的宣稱才站得住；而兩輪審查都由 Claude 執行，是否另請非 Anthropic 模型或人類審閱者看過結果章節，只有作者能決定。

---

## 8. 是否接近可發表

接近，但還需要一輪修改。核心的相對排名結論（Jev 在主張上低於 Sonnet、Grok、兩個 GPT-6 模型）在所有替代分析下都穩健，新增主張還構成樣本外複製；剩下的問題多數是文字與表格修正（C1、C3、C4、M5），加上兩個需要重算但不需要呼叫 API 的敏感度分析（C2 不含城市主張、M2 合併相關主張）。4 個 Critical 修正前不建議公開。
