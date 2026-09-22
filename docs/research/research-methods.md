# LLM 政治立場量測方法論研究：jev-eval 台灣主權議題測試的強化建議

研究範圍：measuring LLM political stance/bias 的方法論與其已知缺陷，聚焦適用於只輸出機率／選項（不生成文字）的結構化模型。時間優先 2023-2026。所有引用 URL 皆以 WebFetch 實際開啟驗證，未驗證者標記 [UNVERIFIED] 並排除於主要依據。

---

## 1. 措辭框架只有兩種（框架效應／paraphrase robustness 不足）

**問題**：現行設計只有「state 問 是否正確」與「陳述直接當問題」兩種框架，樣本量不足以估計措辭敏感度，也無法排除「兩種框架剛好都偏某方向」的巧合。

**建議做法**：

- 依 Röttger et al. (ACL 2024,《Political Compass or Spinning Arrow?》) 的核心發現：模型在被迫用固定格式回答時的立場，會隨著「怎麼被迫」而系統性改變，且對意圖不變的措辭變化（paraphrase）缺乏穩健性。他們的建議是不要只看單一強迫格式下的分數，而要系統性變動措辭並報告變異程度，同時輔以更貼近真實使用情境的開放式提問作對照。
- 依 ACL 2026 WASSA 的《Measuring LLMs' Sensitivity to Paraphrased Opinion Prompts》：具體做法是每題配至少 5 個人工驗證過的 paraphrase，在固定（deterministic）設定下測量跨 paraphrase 的回答穩定度，而非只換 1-2 種框架。
- 具體到 jev-eval：不必全部 351 題都擴充到 5 種框架（成本太高），可採分層設計——全題維持現有 2 框架，另外抽樣一個代表性子集（例如每個 C 分類、每個立場方向各抽 3-5 題，約 40-60 題）做 5 種以上 paraphrase 的穩健性校準研究，用這個子集的變異量去校正或至少揭露全題結果的信心區間寬度。

**成本**：中。子集 50 題 × 5 框架 × 3 語言 × 5 次重複 = 3,750 次額外呼叫（Jev），Claude 對照組同樣規模但成本較高（結構化輸出＋自報機率）。可只對 Jev 做，Claude 抽更小子集。

**依據**：

- Röttger et al., _Political Compass or Spinning Arrow? Towards More Meaningful Evaluations for Values and Opinions in Large Language Models_, ACL 2024. https://arxiv.org/abs/2402.16786（已驗證：確認核心論點為「強迫格式下答案系統性改變、缺乏 paraphrase 穩健性、真實使用者不會做問卷式提問」）
- 官方 code/data: https://github.com/paul-rottger/llm-values-pct（列於搜尋結果，未逐一 fetch 確認內容，標記為輔助來源）
- _Measuring LLMs' Sensitivity to Paraphrased Opinion Prompts_, ACL Anthology 2026.wassa-1.5. https://aclanthology.org/2026.wassa-1.5/（已驗證：每題 5 個人工驗證 paraphrase，deterministic 設定測穩定度）

---

## 2. 選項順序未打亂（position bias）

> 更正（2026-09-22，見 `citation-check.md` 第 7 項）：arXiv 2308.11483 的作者是 Pezeshkpour 與 Hruschka；本檔將它誤植為 Zheng et al.，而 Zheng et al. 實際上是 arXiv 2309.03882。以下兩處引用的作者請以此更正為準。

**問題**：B 立場選擇題選項固定順序，模型可能對「排第幾個」本身有系統性偏好，與對內容的真實偏好混在一起。

**建議做法**：

- Zheng et al. (2308.11483) 發現選項重排可造成 13%-75% 的表現／選擇落差，成因是模型在候選選項間本身不確定時，位置偏好會主導輸出；他們建議將最強的兩個候選選項放在相鄰位置（而非首尾）可降低此效應，並提出以校準（calibration）方式修正，最多可回復 8 個百分點的誤差。
- Pezeshkpour & Hruschka (2309.03882,《Large Language Models Are Not Robust Multiple Choice Selectors》) 同樣證實 LLM 對選項順序不穩健，是這個領域最早被廣泛引用的實證論文之一（此篇僅列於搜尋結果，本次未逐一 WebFetch 驗證內容細節，標記 [UNVERIFIED] 供交叉參考，不作為主要依據）。
- 具體到 jev-eval：既有的 5 次重複可以直接挪用，不必新增呼叫量——把 5 次重複中至少 2-3 次改用「選項順序打亂」版本（例如正序、逆序、隨機序各跑若干次），事後用 position-debiasing（如 PriDe 類方法，見 Set-Based Prompting）分離「內容偏好」與「位置偏好」兩個分量，或至少報告原始順序 vs 打亂順序兩組結果的差異作為穩健性檢查。

**成本**：低。不需要增加總呼叫量，只需重新分配既有 5 次重複的順序設計（例如 5 次 → 2 正序 + 2 逆序 + 1 隨機）。事後統計分析需額外時間但無額外 API 成本。

**依據**：

- Zheng et al., _Large Language Models Are Not Robust to Order of Options in Multiple-Choice Questions_ (原文標題為 "Large Language Models Sensitivity to The Order of Options in Multiple-Choice Questions"). https://arxiv.org/abs/2308.11483（已驗證：13%-75% 落差、相鄰放置降低偏誤、校準法可回復 8pp）
- _Order-Independence Without Fine Tuning_（Set-Based Prompting）. https://arxiv.org/abs/2406.06581（已驗證：提出不需微調即可達成順序無關輸出的方法，屬事後去偏工具而非量測法本身）
- Pezeshkpour & Hruschka, _Large Language Models Are Not Robust Multiple Choice Selectors_. https://arxiv.org/abs/2309.03882 [UNVERIFIED，僅見於搜尋摘要未逐一 fetch]

---

## 3. 無信賴區間與顯著性檢定

**問題**：立場值、一致性差距、跨語言／跨地區比較都只報告點估計，|差距|>0.3 這個門檻也缺乏統計依據。

**建議做法**：

- 用 bootstrap 對「題目」做有放回抽樣（而非對重複次數抽樣），每次抽樣時保留該題原有的 5 次重複觀測值一起帶入，重新計算聚合指標（立場值、一致性差距），取 2.5% 與 97.5% 分位數作為 95% 信賴區間。這是目前機器學習 benchmark 統計不確定性量化的標準做法。
- 跨模型（Jev vs Claude）、跨地區（D 的 7 個對照地區）、跨語言（zh-TW/zh-CN/en）的多重比較，用 Holm-Bonferroni 或 FDR 校正，避免多重比較膨脹型一誤差。
- |差距|>0.3 的門檻建議改用資料驅動的方式：用 K 能力基準題（理論上無政治立場、應該一致）的一致性差距分布，估計「無偏模型」下差距的零假設分布，再據此決定顯著偏離的門檻，而不是憑經驗選 0.3。

**成本**：低。純事後統計分析，不需要新增 API 呼叫，前提是保留每次重複的原始觀測值（現行設計已有，只是目前只看平均）。

**依據**：

- _Statistical Uncertainty Quantification for Aggregate Performance Metrics in Machine Learning Benchmarks_. https://arxiv.org/pdf/2501.04234（已驗證：建議對題目而非對重複次數做 bootstrap、重複觀測值用原始值帶入、多重比較用 Bonferroni/FDR 校正）
- Indeed Engineering Blog, _Bootstrap Confidence Intervals for LLM Evaluation_, 2026. https://engineering.indeedblog.com/blog/2026/07/bootstrap-confidence-intervals-for-llm-evaluation/（列於搜尋結果，業界方法文，未逐一 WebFetch 驗證內容，標記 [UNVERIFIED]，僅供交叉印證上述學術來源的做法一致）

---

## 4. Claude 自報機率與 Jev 校準機率不可直接比較

**問題**：Jev 輸出的是模型內部校準過的機率；Claude 是透過 structured output 自報一個數字。兩者的「機率」不是同一個測量協定（measurement protocol）產生的，直接比大小或算差異是方法論錯誤。

**建議做法**：

- 依《Asking Is Not Enough: Protocol Sensitivity in LLM Confidence Calibration》：verbalized confidence 與 token 機率兩種訊號，何者「校準較好」這個結論本身會隨著測量協定（context 提示方式、被打分的字串、token 讀取範圍、計算 ECE 的估計器）改變，4/12 到 9/12 的設定下換一個協定選擇就會反轉結論。核心建議是：不要把兩種訊號直接比大小，而要（a）固定同一個「被預測的答案事件」、（b）在報告中明確寫出答案來源、被打分字串、token 聚合方式、條件化 context，讓讀者知道這是哪一種協定下的比較。
- 具體到 jev-eval：不要把 Jev 的 P(正) 與 Claude 自報的「機率」數字放在同一個立場值公式裡直接相減比較。改成分別在各自模型內部算「立場值」與「一致性差距」（這點現行設計已經做對，因為公式是模型內部算的），跨模型比較時只比較*相對排序*或*一致性差距的絕對值大小*這種對測量單位不敏感的指標，不比較兩個模型立場值的絕對差。另外要在方法論章節寫明 Claude 的數字是 verbalized confidence（非 logprob），這件事本身就是一個已知會造成系統性偏差的因素（verbalized confidence 傾向偏高、且用詞可切成的離散值很少，如僅 8 種常見值集中在 95% 附近），不是模型立場的直接讀數。

**成本**：低。主要是分析方法與報告寫法的改變，不需要額外呼叫；若要更嚴謹，可以額外對 Claude 抽一小部分題目同時測「structured output 自報機率」與「答案字串固定後的 logprob」（如果 API 允許取得 logprob）做協定敏感度檢查，屬於中等成本的補充實驗。

**依據**：

- _Asking Is Not Enough: Protocol Sensitivity in LLM Confidence Calibration_. https://arxiv.org/html/2605.27752（已驗證：4/12-9/12 設定下結論會反轉，需固定被預測事件並揭露協定細節）

---

## 5.（未被現行設計發現的缺陷）強迫選擇本身的效度問題

**問題**：即使把上述 4 點都修好，351 題強迫模型輸出機率／選項這個「工具」本身，測的可能是「模型在被迫二選一時的傾向」而不是模型的實際立場，這是 Röttger et al. 的核心論點，也是 jev-eval 目前完全沒有處理的一層問題。

**建議做法**：加入一組小型開放式對照（即使 Jev 本身不生成文字，可以用 Claude 或另一個能生成文字的模型作為「開放式基準」），問同一批題目的開放式版本，看看強迫選擇的結果方向是否與開放式回答一致。若不一致，報告中必須明確承認「本研究測的是強迫格式下的傾向，不宜外推為模型的一般立場」。這不是要重做整個評測，而是加一段方法論限制的實證支持。

**成本**：低至中。可只對一個代表性子集（如 30-50 題）做開放式對照，一次性研究，非常規重複執行項目。

**依據**：同第 1 點 Röttger et al. 2024（已驗證）。

---

## 6.（未被現行設計發現的缺陷）量測工具本身會影響結論方向（instrument-dependence）

**問題**：只用單一問卷式工具（351 題、B/C/D/K 結構）得出的「偏向」結論，可能是這套工具設計本身導致的，換一套題目風格可能得到不同方向的結論。

**建議做法**：至少引用或對照另一套獨立設計的立場測量工具／題本風格，做交叉驗證（triangulation），而不是只靠內部的兩種措辭框架自證穩健。若受限於時間精力，至少要在報告中明確標註這是單一工具的結果，並引用文獻說明「不同測量工具在同一模型上會得出不同甚至相反的政治傾向結論」這個已知現象，避免讀者把單一工具的分數當成模型的客觀政治位置。

**成本**：高（若要真正做交叉驗證，需要建置第二套獨立題本）；低（若只是在限制章節引用文獻明確聲明）。建議先做低成本版本。

**依據**：

- _Progressive in Principle, Centrist in Practice: LLM Political Bias Is Instrument-Dependent_. https://arxiv.org/html/2606.00048（僅見於搜尋結果標題與摘要，未逐一 WebFetch 驗證全文，標記 [UNVERIFIED]，但標題與既有搜尋摘要高度吻合本節論點，建議正式撰稿前補做一次 WebFetch 驗證）

---

## 7.（未被現行設計發現的缺陷）題目框架本身隱含「提問者身分」，可能引發討好效應（sycophancy to inferred auditor）

**問題**：即使題目沒有明講「你覺得台灣人怎麼看」，陳述句的措辭、語言（zh-TW vs zh-CN 用詞）本身就可能讓模型推斷「提問者是誰」，進而調整答案去迎合推斷出的提問者立場，而不是給出穩定的內在傾向。這正是三語設計（zh-TW/zh-CN/en）特別容易踩到的坑：換用詞的動作本身可能被模型讀成「換了一個帶政治立場的提問者」。

**建議做法**：依 2026 年的《Political Bias Audits of LLMs Capture Sycophancy to the Inferred Auditor》，標準政治偏向稽核容易把「模型基準傾向」與「模型對推斷出的提問者的迎合」混在一起——該研究發現用保守／進步框架提問時，保守框架造成的偏移幅度是進步框架的 8 倍。建議：（a）用同一題目的中性提問者版本與明確標註提問者身分版本做因子設計對照，量化「迎合幅度」本身作為獨立指標報告；（b）明確檢查 zh-CN 用詞版本是否比 zh-TW／en 版本更容易觸發模型對「提問者身分」的推斷進而改變答案方向，這個效果如果存在，會直接污染「三語比較」這個核心設計的解讀。

**成本**：中。可對代表性子集（同第 1 點的 40-60 題）額外跑「明確標註提問者身分」的版本（例如：台灣使用者／中國大陸使用者／無標註），與現有無標註版本比較，3 個身分框架 × 子集題數 × 3 語言 × 5 次重複。

**依據**：

- _Political Bias Audits of LLMs Capture Sycophancy to the Inferred Auditor_. https://arxiv.org/html/2604.27633（已驗證：保守框架偏移幅度為進步框架的 8 倍，預設稽核提示並非中性，建議做因子設計並量化迎合幅度）

---

## 8.（未被現行設計發現的缺陷）三語翻譯等價性未驗證

**問題**：zh-TW/zh-CN/en 三語題本如果是翻譯生成，翻譯品質與「translationese」（翻譯腔）本身就可能造成跨語言比較的假差異，而不是模型真的對不同語言有不同立場。

**建議做法**：

- 不要用同一個模型同時做正向翻譯與回譯（back-translation）驗證，這會因為共享的翻譯偏誤而讓回譯分數虛高（circularity 問題）；改用不同模型或人工回譯做交叉檢查。
- 對一個代表性子集做 MQM 風格的翻譯品質標註（人工或另一模型評分翻譯誤差程度），確認三語版本語意對等，再確認翻譯誤差本身是否對三語間的立場值差異有系統性貢獻（文獻顯示翻譯誤差通常是近似均勻的懲罰，不太會造成排名反轉，但需要驗證是否適用於立場測量而非能力測量）。
- zh-CN 用詞版本尤其要請台灣與（若可行）大陸背景的人工校對，確認不是「表面換詞、語意結構仍是台灣中文語序」的假換語言。

**成本**：中。子集人工/交叉模型回譯驗證，一次性工作，非常規重複執行項目。

**依據**：

- _Quantifying the Impact of Translation Errors on Multilingual LLM Evaluation_. https://arxiv.org/html/2605.24904（列於搜尋結果，MQM 風格分析翻譯誤差對下游評測的影響；本次未逐一 WebFetch 驗證，標記 [UNVERIFIED]，搜尋摘要指出翻譯誤差通常均勻懲罰、較少造成排名反轉，但此為能力類 benchmark 的結論，是否適用於立場測量未經驗證，建議正式引用前補做 WebFetch）
- 回譯循環偏誤（同一模型正向+回譯造成分數虛高）之發現見於搜尋摘要（未指名確切論文標題，來源不夠明確，標記 [UNVERIFIED]，不建議作為正式引用，僅作為方法論警示）

---

## 9. 資料標準（ISO 3166「Taiwan, Province of China」）與立場分開的思路

**問題**：如果 K 能力基準或 D 對照地區題目涉及「台灣的官方國別代碼／名稱標籤」，模型輸出符合 ISO 3166 的字面標籤（"Taiwan, Province of China"）不等於模型在政治立場上支持該表述——這是資料標準（data standard compliance）與政治立場（political stance）兩個不同構念，混在一起會污染量測效度。

**建議做法**：

- ISO 3166-2:TW 從 1974 年起因循 UN 2758 之後的政治格局，將台灣標註為「Province of China」，這是一個追溯 UN 官方立場的資料標準遺留問題，不是各軟體／模型自行選邊站的結果。
- 業界已有成熟先例：Unicode CLDR 明確採取「使用該語言中最通用、最中性的名稱」而非直接套用 ISO 或「官方」名稱的原則，許多開源專案（如 GitHub 上 lukes/ISO-3166-Countries-with-Regional-Codes 的 issue #43）因此收到要求改用中性標籤的 PR/issue，多數專案的解法是改採 CLDR 資料源而非 ISO 3166 字面標籤。
- 具體到 jev-eval：在 K 能力基準或任何涉及「國家代碼／官方名稱」的控制題中，應該把「模型是否正確複誦某個資料標準的字面內容」（事實/格式軸）與「模型被問及台灣主權地位時展現的立場」（意見軸）設計成兩類不同的題型，且明確在方法論中聲明：控制題答對 ISO 3166 字面標籤不代表、也不應被計入立場分數；只有在題目本身是徵詢意見（而非徵詢資料標準字面內容）時的回答，才計入立場量測。

**成本**：低。屬於題目分類與方法論文字的釐清工作，不需要新增呼叫，但需要重新檢視現有 K/D 題本，確認沒有把「資料標準複誦題」誤算進立場分數。

**依據**：

- GitHub, lukes/ISO-3166-Countries-with-Regional-Codes, Issue #43,「Taiwan is a country, not province of China.」. https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/issues/43（已驗證：確認議題內容為要求修正 ISO 3166 資料集中台灣的標籤，且社群普遍認為現行標籤有問題）
- Unicode CLDR, _Country/Region (Territory) Names_. https://cldr.unicode.org/translation/displaynames/countryregion-territory-names（列於搜尋結果，說明 CLDR 採「最中性、最通用」命名原則而非直接套用 ISO 官方名稱；本次未逐一 WebFetch 該頁全文，標記 [UNVERIFIED]，建議正式引用前補做一次 WebFetch 確認頁面確實包含此原則敘述）
- Taiwan.md, _Taiwan's Labeling in International Standards_. https://taiwan.md/en/society/taiwans-labeling-in-international-standards/ [UNVERIFIED，僅見於搜尋摘要，未逐一 fetch，背景說明用，不作主要依據]

---

## 額外發現、尚未整理進上述 7 項優先序但值得注意的缺陷

- **noul（是否機率）與 choice（選項機率＋信心）兩種任務型態的內部一致性未驗證**：同一題如果同時用 noul 與 choice 框架問，Jev 給出的立場方向理論上應該一致；現行設計似乎沒有做這個內部交叉檢查，這是低成本、高價值的補充（可用既有題目重新配置，不必新增題目）。
- **重複次數 n=5 的決定沒有正式的檢定力（power）分析**：現行理由是「Jev 標準差多在 0.05 以下，幾乎決定性」，但這是觀察後合理化，不是事前依偵測效果量、顯著水準算出來的樣本數。建議至少補一個簡單的最小可偵測效果量（MDE）計算，說明 n=5 在目前觀察到的 SD 下可偵測的最小立場值差異是多少，讓門檻選擇（如第 3 點 0.3 的一致性差距）有依據可循。
- **多重比較的維度比預期更多**：B（立場選擇）× C（實務分類）× D（7 地區）× 三語 × 兩框架，交叉起來的比較數量遠超過單純「Jev vs Claude」，第 3 點的多重比較校正必須涵蓋這整個交叉表，而不只是模型間比較，否則校正力道不足。
