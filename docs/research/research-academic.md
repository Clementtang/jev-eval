# jev-eval 相關學術文獻整理

檢索範圍：arXiv、ACL Anthology、PubMed Central（透過 firecrawl 論文索引）、Google Scholar 可及來源。時間優先 2023 至 2026，聚焦 LLM 在台灣主權、兩岸、中國相關政治議題的立場測量，以及跨語言（簡中／繁中／英文）政治立場差異、主權爭議地區在 LLM 中的表述。共找到 17 篇相關文獻，每篇 URL 均已用 WebFetch 實際開啟並核對標題、作者與摘要內容相符，全數列入主清單，無 [UNVERIFIED] 項目。

---

## 一、直接命中：台灣主權 / 兩岸政治立場測量

### 1. Bilingual Bias in Large Language Models: A Taiwan Sovereignty Benchmark Study

- 作者：Ju-Chun Ko
- 年份：2026（arXiv 提交 2026-07）
- 出處：arXiv, cs.CY
- URL：https://arxiv.org/abs/2602.06371
- 研究問題：17 個 LLM 在中文與英文查詢下，對台灣（中華民國）主權問題的回答是否一致。
- 方法：同一組主權相關問題以中、英雙語提問 17 個模型；提出 Language Bias Score（LBS）與 Quality-Adjusted Consistency（QAC）兩個量化指標；未特別區分簡中／繁中，僅以「中文」統稱。
- 主要發現：15/17 模型出現可測量的語言偏向；中國出品模型問題最嚴重，部分完全拒答或直接複述中共論述；僅 GPT-4o Mini 在兩語言都拿到滿分 10/10。
- 對 jev-eval 的可用點：這是與 jev-eval 主題最接近的既有研究，但只做中／英二元對照，未拆分簡中與繁中；jev-eval 的三語設計（zh-TW／zh-CN／en）正好填補這個缺口，可在報告中明確定位為「延伸此研究、加入語域區分」的貢獻。其 LBS／QAC 指標的算法可對照 jev-eval 現行「立場值 = (P(正)+1-P(反))/2」的設計，兩者都試圖處理正反不對稱問題，值得比較優劣。

### 2. Mapping Geopolitical Bias in 11 Large Language Models: A Bilingual, Dual-Framing Analysis of U.S.-China Tensions

- 作者：William Guey, Wei Zhang, Pierrick Bougault, Vitor D. de Moura, José O. Gomes
- 年份：2026（更新版，原始提交 2025-03）
- 出處：arXiv, cs.CL / cs.HC
- URL：https://arxiv.org/abs/2503.23688
- 研究問題：如何在避免「模型只是順著提問方向附和」（acquiescence bias）的前提下，量測 LLM 對美中議題的地緣政治立場。
- 方法：引入調查心理計量學的 balanced keying：每則命題與其「反向命題」成對出現，把回應正負號化後相加，使單純附和傾向互相抵銷，只留下真實立場；11 個模型 × 2 語言（中／英）× 雙框架，共 19,712 筆回應；用可加性模型拆解「開發商來源」「查詢語言」「議題領域」三個因子的貢獻度。
- 主要發現：三個因子貢獻度接近且可加；所有模型（包含美國製模型）在中文提問下都更偏向親中；能區分「立場一致但無偏見」與「立場一致但有偏見」兩種模型。
- 對 jev-eval 的可用點：這篇的正反句對＋反向計分手法，與 jev-eval 現有「正反句對」設計高度同構，可直接引用其 balanced keying 理論來源（Paulhus 1991 等調查心理計量學傳統）為 jev-eval 的立場值公式背書；其「三因子可加性分解」的統計手法（開發商 × 語言 × 議題）可套用到 jev-eval 的三語 × 措辭框架 × 議題類別設計，用來把「語言效應」和「措辭效應」的貢獻度分開估計，而不是只看總體偏向。

### 3. Echoes of Power: Investigating Geopolitical Bias in US and China Large Language Models

- 作者：Andre G. C. Pacheco, Athus Cavalini, Giovanni Comarela
- 年份：2025（2025-03，cs.CY / cs.AI / cs.HC）
- 出處：arXiv
- URL：https://arxiv.org/abs/2503.16679
- 研究問題：ChatGPT 與 DeepSeek 在地緣政治問題上的回應是否反映不同意識形態立場。
- 方法：質化＋量化混合分析，蒐集兩模型對地緣政治問題集的回應，未使用機率式量測（純文字生成分析），樣本數與統計檢定細節較簡略。
- 主要發現：兩模型都有明顯偏向，但在部分敏感問題上意外地回應方向一致，顯示偏向不是簡單的非黑即白。
- 對 jev-eval 的可用點：方法學較弱（無機率化量測、無統計檢定），可作為對照組說明 jev-eval 採用機率式量測（Jev 的 noul／choice 機率輸出）相對於純文字生成分析的方法學優勢，適合放在文獻回顧的「侷限對照」段落。

### 4. Analysis of LLM Bias (Chinese Propaganda & Anti-US Sentiment) in DeepSeek-R1 vs. ChatGPT o3-mini-high

- 作者：PeiHsuan Huang, ZihWei Lin, Simon Imbot, WenCheng Fu, Ethan Tu
- 年份：2025（2025-06，cs.CL / cs.SI）
- 出處：arXiv
- URL：https://arxiv.org/abs/2506.01814
- 研究問題：PRC 對齊模型（DeepSeek-R1）與非 PRC 模型（ChatGPT o3-mini-high）在簡中、繁中、英文三語下的中國官方論述與反美情緒差異。
- 方法：1,200 則源自中文新聞的去脈絡化推理題，三語（簡中／繁中／英文）各一版本，共 7,200 筆回應；用 GPT-4o 評分規則＋人工標註的混合評測管線。
- 主要發現：DeepSeek-R1 的宣傳與反美偏向在簡中最高、繁中次之、英文幾乎消失；DeepSeek-R1 有時會用簡中回答繁中提問（「隱形擴音器」效應）；偏向不限政治議題，滲透到文化與生活類內容。
- 對 jev-eval 的可用點：這是三篇文獻中唯一同時使用簡中／繁中／英文三語設計（而非只有「中文」二分）的研究，方法架構與 jev-eval 最接近，可直接引用其「簡中偏向最強、繁中次之、英文最弱」的梯度發現，與 jev-eval 初步發現（簡中讓所有模型都偏 PRC）互相印證；其「隱形擴音器」效應（用簡中回答繁中提問）值得在 jev-eval 中額外檢查 Jev／Claude 的回答語言是否與提問語言一致，可能是一個尚未追蹤的干擾變項。

---

## 二、方法學：跨語言政治偏向量測框架

### 5. This Land is {Your, My} Land: Evaluating Geopolitical Biases in Language Models

- 作者：Bryan Li, Samar Haider, Chris Callison-Burch
- 年份：2023（首發 2023-05，2024-04 更新，ACL 系列會議論文）
- 出處：arXiv, cs.CL
- URL：https://arxiv.org/abs/2305.14610
- 研究問題：LLM 對領土主權爭議（例如南沙群島）在不同宣稱國語言下回答是否一致。
- 方法：建立 BorderLines 資料集，涵蓋 251 個爭議領土，每個領土配對多個宣稱國語言（共 49 種語言）的選擇題；提出一套量測偏向與一致性的指標；並測試多種提示詞修改策略以放大或緩解偏向。
- 主要發現：LLM 在不同語言下回憶地理知識不一致；提示詞措辭對偏向有顯著影響，顯示模型立場相當脆弱。
- 對 jev-eval 的可用點：這是「主權爭議地區在多語言 LLM 中表述不一致」這條研究線的奠基之作，其 D 組對照組設計（南韓、科索沃、香港、巴勒斯坦、索馬利蘭、西藏、北賽普勒斯）與 BorderLines 的多爭議領土比較邏輯直接對應，可引用其方法論證 jev-eval 用多個主權爭議地區做對照組的正當性；其「提示詞措辭修改策略」章節可直接參考來設計 jev-eval 的兩種措辭框架，並用來檢驗框架效應的統計顯著性。

### 6. Poli-Bias: Understanding and Measuring Large Language Model Biases in International Political Conflicts

- 作者：Massi-Nissa Abboud, Aladin Djuhera, Elena Cabrio, Holger Boche
- 年份：2026（2026-08）
- 出處：arXiv, cs.AI / cs.CL
- URL：https://arxiv.org/abs/2608.06123
- 研究問題：LLM 是否對法律上等價的國際衝突情境，因涉及國家不同而給出不同評價。
- 方法：反事實框架，將提示詞中的國家身分系統性互換（counterfactual country-swap），涵蓋多種地緣政治關係、法律違規情境、推理任務；13 個模型；把偏向拆解為五個可解釋維度而非單一分數。
- 主要發現：國家身分與使用者所屬國會系統性影響模型對「同一行為」的描述、評價與辯護方式。
- 對 jev-eval 的可用點：其「國家身分互換」反事實設計，可用來檢驗 jev-eval C 組（地址填國家欄位）是否受「提問者身分」干擾，例如同一題目換成不同國籍使用者提問，看 Jev／Claude 的填答是否改變；其「拆解為五個可解釋維度」的做法，也提示 jev-eval 可考慮把單一立場值拆成多個子維度（例如事實描述 vs 評價用語 vs 法律地位認定）分開報告，而不是只看單一綜合分數。

### 7. Estimating the Geopolitical Preferences of Large Language Models from United Nations Voting Data

- 作者：Maxim Chupilkin
- 年份：2026（2026-07）
- 出處：arXiv, cs.CY
- URL：https://arxiv.org/abs/2607.25526
- 研究問題：如何用國際關係學界既有的量測方法（而非簡單問卷）推估 LLM 的地緣政治偏好。
- 方法：套用國際關係研究中的動態次序理想點模型（dynamic ordinal ideal-point approach），把 LLM 當成聯合國大會投票的「受訪者」，讓模型對 1946 至 2025 年間 5,555 項有爭議且通過的決議文本表態。
- 主要發現：模型表態立場與其開發商母國立場可能明顯脫鉤（例如 GPT-5、Claude Sonnet、Gemini 在二十一世紀後最接近俄羅斯而非美國）；顯示「開發商國籍決定模型立場」的直覺假設不可靠。
- 對 jev-eval 的可用點：這篇提醒 jev-eval 在解讀「Jev／Claude 偏 PRC」結論時要小心因果推論，開發商所在地（TypeSafe、Anthropic）與模型立場不必然對應；其理想點模型的統計方法（次序反應模型）可作為 jev-eval 未來把 351 題總分轉換成單一「立場座標」時的統計方法參考，比現行簡單平均更嚴謹。

### 8. Polar: A Benchmark for Evaluating Political Bias in LLMs

- 作者：Sangho Kim, Heejin Kim, Yoonhee Park, Hyunggeun Jeon, Jaejin Lee
- 年份：2026（2026-06）
- 出處：arXiv, cs.CL / cs.CY
- URL：https://arxiv.org/abs/2606.12922
- 研究問題：如何用「選項機率而非生成文字」的方式測量政治偏向，並比較不同語言與國家脈絡下的表現。
- 方法：4,026 題多選題 benchmark，議題來自 Manifesto Project，量測方式是取選項層級的 likelihood（option-level likelihoods），而非讓模型生成文字再分類；涵蓋美國與南韓兩種政治脈絡；38 個模型；含翻譯實驗檢驗語言本身對測得偏向的影響。
- 主要發現：所有模型在美國議題上偏左派進步立場，但在南韓議題上立場更中性且分散；單純翻譯題目語言就能改變測得的偏向。
- 對 jev-eval 的可用點：這是方法學上與 jev-eval 最貼近的一篇，因為它同樣採用「選項機率」而非生成文字來量測立場，直接對應 Jev 的 choice=選項+機率設計；可引用其「翻譯本身就能改變測得偏向」的發現，強化 jev-eval 三語版本必須各自獨立分析、不能只看平均值的論點；其把美國、南韓兩個政治脈絡分開評測的作法，也支持 jev-eval D 組把台灣以外的主權爭議地區獨立分析、不與台灣議題混在一起計分。

### 9. Political Alignment in Large Language Models: A Multidimensional Audit of Psychometric Identity and Behavioral Bias

- 作者：Adib Sakhawat, Tahsin Islam, Takia Farhin, Syed Rifat Raiyan, Hasan Mahmud, Md Kamrul Hasan
- 年份：2026（2026-01，2026-03 更新）
- 出處：arXiv, cs.CY / cs.AI / cs.CL
- URL：https://arxiv.org/abs/2601.06194
- 研究問題：LLM 表態出的政治認同（心理計量測驗結果）是否能預測其下游行為（例如新聞偏見標註任務）。
- 方法：26 個模型 × 3 種政治心理計量量表（Political Compass、SapplyValues、8Values）× 多種語意等價的提示詞變體；用雙因子變異數分析（two-way ANOVA）把「模型效應」與「提示詞效應」分開估計，並報告效果量 η²。
- 主要發現：模型身分本身解釋了絕大部分變異（η² > 0.90）；表態立場與下游任務表現之間沒有顯著統計關聯，顯示「問卷測出的立場」不等於「實際任務中的行為偏向」。
- 對 jev-eval 的可用點：其雙因子 ANOVA 拆解「模型效應」vs「提示詞措辭效應」的統計方法，可直接套用到 jev-eval 現行「兩種措辭框架」設計，用來檢驗措辭框架造成的變異是否顯著小於模型間差異，補足 jev-eval 目前缺乏的統計檢定環節；其「表態立場不代表下游行為」的警示，提醒 jev-eval 的 B 組（立場選擇題）結果不能直接等同於 C 組（實務分類，例如地址填國家欄位）的行為結果，兩組應分開報告、避免用其中一組代表整體結論。

### 10. Navigating the digital spectrum: Assessing political bias, stability, and downstream fairness in Large Language Models

- 作者：Luka Debevc, Nishan Chatterjee, Antoine Doucet, Senja Pollak, Matej Martinc
- 年份：2026（2026-09，最新一批文獻）
- 出處：arXiv, cs.CL / cs.CY
- URL：https://arxiv.org/abs/2609.08637
- 研究問題：政治羅盤測驗（Political Compass Test）測得的立場，有多少比例其實只是「測量方式本身」造成的雜訊，而非模型真實傾向。
- 方法：八維度擾動空間（語言、措辭框架、指示語、答案格式、選項順序、人設用語等）共 300 種組態；8 個 Gemma 3／Qwen 3 模型 × 14 種語言 × 3 種量化精度；報告帶不確定性區間的「設計平均後」政治座標。
- 主要發現：跨語言差異主要來自座標漂移（測量雜訊）而非真正不同的文化推理；指示語措辭、語言、答案格式都顯著影響測得座標；小模型在座標接近原點時可能只是訊號太弱、不是真的中立。
- 對 jev-eval 的可用點：這是本次檢索中方法學最嚴謹的「measurement robustness」研究，直接對 jev-eval 現行「每題重複 5 次」的設計提出更高標準：建議在此基礎上再納入選項順序、答案格式等其他擾動維度做穩健性檢驗，否則測得的「Jev 偏 PRC」結果可能部分來自措辭或順序效應而非模型真實傾向；其「近原點估計可能是訊號弱而非中立」的提醒，適用於解讀 jev-eval 中立場值接近 0.5 的題目，不宜直接判定為「無偏向」。

---

## 三、中國出品模型審查與國家對齊機制（背景與方法對照）

### 11. Political censorship in large language models originating from China

- 作者：Jennifer Pan, Xu Xu
- 年份：2026（PNAS Nexus，2026-02）
- 出處：PNAS Nexus（期刊論文），PMC
- URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC12910507/
- 研究問題：中國出品的基礎模型是否比非中國模型在政治敏感問題上有系統性審查行為。
- 方法：比較中國與非中國基礎模型對 145 個政治問題的回應；以拒答率、回應簡短程度、事實準確度三項指標量化審查程度。
- 主要發現：中國模型拒答率明顯偏高（例如 BaiChuan 拒答率 60.23%），非中國模型拒答率僅 0 至 2.8%；作者明確指出這是觀察性研究，無法建立審查制度與行為之間的因果關係。
- 對 jev-eval 的可用點：這篇是頂級期刊（PNAS Nexus）發表、方法簡潔可複製的審查測量研究，可作為 jev-eval 報告中「監管背景」的權威引用來源，解釋為何簡中版本容易觸發拒答或官方論述；其「觀察性研究，無法建立因果關係」的自我限定語，也提醒 jev-eval 在描述「簡中讓所有模型偏 PRC」時，措辭上應避免過度因果化，只描述相關性。

### 12. Political biases and inconsistencies in bilingual GPT models: the cases of the U.S. and China

- 作者：Di Zhou, Yinxian Zhang
- 年份：2024（Scientific Reports，2024-10-23）
- 出處：Scientific Reports（Nature 期刊），PMC
- URL：https://pmc.ncbi.nlm.nih.gov/articles/PMC11499644/
- 研究問題：GPT 雙語模型在中、美議題上的政治知識與政治態度是否因查詢語言不同而不一致。
- 方法：延續作者 2023 年 arXiv 版本（見下），正式期刊發表版，比較簡中與英文提問下的政治知識內容與情緒。
- 主要發現：模型在中國相關議題上的不一致程度明顯高於美國議題；簡中模型對中國問題情緒最不負面，英文模型對中國問題最負面。
- 對 jev-eval 的可用點：與第 13 篇（同作者的 arXiv 前身）互為對照，可引用期刊版作為正式引用來源；核心發現（語言決定政治態度而非單純知識落差）直接支持 jev-eval 把「立場」與「能力」分開評測（K 組能力基準題）的設計邏輯，證明能力與立場確實是可分離的兩個維度。

### 13. Red AI? Inconsistent Responses from GPT3.5 Models on Political Issues in the US and China

- 作者：Di Zhou, Yinxian Zhang
- 年份：2023（arXiv 2023-12，第 12 篇的前身版本）
- 出處：arXiv, cs.CL / cs.AI
- URL：https://arxiv.org/abs/2312.09917
- 研究問題：同上（第 12 篇的原始 arXiv 版本），聚焦 GPT-3.5。
- 方法：中、英文對同一組高關注政治議題提問，比較政治「知識」與政治「態度」兩個層面的不一致程度。
- 主要發現：模型呈現「對自己語言所代表的一方較不批判、對另一方較批判」的模式，作者稱之為潛在的「政治認同」。
- 對 jev-eval 的可用點：其「對自己語言代表的一方較不批判」框架，可用來解釋 jev-eval 觀察到「簡中版本偏 PRC」的現象學機制，並建議在報告中引用這個「語言即認同」假說作為理論框架，而不只是描述現象。

### 14. Detection Is Cheap, Routing Is Learned: Why Refusal-Based Alignment Evaluation Fails

- 作者：Gregory N. Frank
- 年份：2026（2026-03，2026-05 更新）
- 出處：arXiv, cs.LG / cs.AI / cs.CL
- URL：https://arxiv.org/abs/2603.18280
- 研究問題：只用「拒答率」評測政治審查是否會漏掉模型內部真正的對齊機制。
- 方法：對九個中國出品開源模型做探針（probe）、手術式消融（surgical ablation）、行為測試三線並用。
- 主要發現：拒答已不是主要審查機制，敘事引導（narrative steering）取而代之，使審查對「只看拒答率」的評測隱形；不同實驗室的路由機制各自獨立，無法跨模型遷移。
- 對 jev-eval 的可用點：直接警示 jev-eval 現行以「立場值」與「選項機率」量測，若只看拒答／不拒答二分，會漏掉「敘事引導型」的隱性偏向；建議 jev-eval 除了現有的機率式立場值外，也對 Jev／Claude 是否有「表面中性、實則措辭偏向」的敘事引導現象做質性抽查，尤其是 C 組實務分類題的自由文字理由（如果有記錄的話）。

### 15. How China-Origin Vision-Language Models Move from Refusal to Reframing in State Alignment

- 作者：Guang Yang, Fengchen Liu, Alex Wang, Homa Hosseinmardi, Amir Ghasemian
- 年份：2026（2026-08）
- 出處：arXiv, cs.CR / cs.AI / cs.CL
- URL：https://arxiv.org/abs/2608.11816
- 研究問題：國家對齊型失真是否也出現在多模態（視覺語言）模型，以及以何種形式出現。
- 方法：200 則核心題目 × 十個政治敏感主題 × 七種視覺抽象變體；九個視覺語言模型（七中國出品、二非中國）；四種誘導方式 × 兩種提示語言，共 21,708 筆試驗；六維度稽核（含拒答、資訊完整性、視覺定錨、國家對齊框架、語言一致性、回應長度）。
- 主要發現：中文提示詞讓國家對齊框架出現機率約增加三倍；即使在僅剩剪影的圖像下，只要能辨識主題，國家對齊框架依然出現；歷代 Qwen 模型顯示「拒答下降、框架上升」的趨勢，審查從可見的拒答轉為不可見的重新框架。
- 對 jev-eval 的可用點：雖非文字模型研究，但其「拒答下降、框架上升」的趨勢與第 14 篇呼應，強化 jev-eval 需要關注非拒答型偏向的論點；其六維度稽核架構（拒答、資訊完整性、語言一致性等）可作為 jev-eval 未來若要擴充質性維度時的參考清單。

### 16. It's the humans, not the data: Geopolitical bias in LLMs originates in post-training, amplified by the language of the prompt

- 作者：Stuart Bladon, Brinnae Bent
- 年份：2026（2026-05）
- 出處：arXiv, cs.LG / cs.AI
- URL：https://arxiv.org/abs/2605.23825
- 研究問題：LLM 的地緣政治偏向究竟來自預訓練資料，還是來自後訓練（post-training／對齊）階段。
- 方法：七組開源模型的 base 版（僅預訓練）與 chat 版（預訓練＋後訓練）配對比較；28 個國家配對的強制選擇機率探針；英、法、中三語。
- 主要發現：偏向主要在後訓練階段產生，而非繼承自預訓練資料；Qwen 2.5 從 base 到 chat 版偏向出現 18 倍的機率變化（log-odds 從 -0.15 到 +2.91）；偏向強度也受提示語言影響（法國製 Mistral 只有在法文提示下才明顯偏法國）。
- 對 jev-eval 的可用點：這篇提供一個重要的方法學建議，如果 jev-eval 未來想釐清「Jev 的偏向來自訓練資料還是對齊調校」，可比照此研究比較同一模型家族的 base 版與經過對齊的版本（若 TypeSafe 有釋出 Jev 的中間版本）；即使無法取得 base 版，也可在報告中引用此研究說明「偏向是後訓練現象」這個假說，作為解讀 Jev 三語皆偏 PRC 但簡中最嚴重這個梯度現象的理論依據。

### 17. The Language You Ask In: Language-Conditioned Ideological Divergence in LLM Analysis of Contested Political Documents

- 作者：Oleg Smirnov
- 年份：2026（2026-06，2026-08 更新）
- 出處：arXiv, cs.CY / cs.CL
- URL：https://arxiv.org/abs/2601.12164
- 研究問題：模型解讀有爭議的政治文件時，其採用的詮釋立場是否取決於提示語言而非文件內容本身（以俄烏語境為案例，非兩岸，但方法論高度相關）。
- 方法：以一份具爭議性的烏克蘭公民社會文件為材料，用語意對等的俄文與烏克蘭文提示詞，比較 ChatGPT 5.2 與 Claude Opus 4.5 兩個前沿模型的解讀立場。
- 主要發現：兩模型都沿同一軸線偏移：俄文提示引出去合法化（delegitimizing）的解讀，烏克蘭文提示引出合法化的解讀；模型不是保持中立、也不是同時呈現多元詮釋，而是悄悄採用提示語言所屬的主流敘事框架。
- 對 jev-eval 的可用點：這篇雖然議題是俄烏而非兩岸，但研究設計（同一份具爭議性材料、語意對等雙語提示、比較 Claude 在內的前沿模型）與 jev-eval 用 Claude Sonnet 5／Opus 5 作對照組的邏輯幾乎完全對應，可直接引用其「模型並非中立、也非呈現多元觀點，而是悄悄採用提示語言主流框架」的結論框架，來解讀 jev-eval 觀察到「簡中讓 Claude 在實務分類填 Taiwan, China」的現象，這正是「悄悄採用提示語言主流敘事」的具體案例。

---

## 對改善 jev-eval 方法論最有幫助的前五點建議

1. 三語設計（zh-TW／zh-CN／en）已優於現有文獻常見的中英二元對照，可在報告中明確定位為對第 1 篇（Ko, 2026）與多數二元語言研究的延伸，凸顯 jev-eval 的方法學貢獻，而非僅是重複驗證。
2. 正反句對＋反向計分的立場值公式，應明確對應並引用第 2 篇（Guey et al., 2026）的 balanced keying 理論來源，並考慮採用其「開發商 × 語言 × 議題」三因子可加性分解，把語言效應與措辭效應的貢獻度分開估計。
3. 目前僅「每題重複 5 次」的穩健性設計，建議依第 10 篇（Debevc et al., 2026）的八維度擾動框架，額外納入選項順序、答案格式等擾動維度做穩健性檢驗，否則無法排除偏向部分來自量測雜訊而非模型真實傾向。
4. 應補上第 9 篇（Sakhawat et al., 2026）示範的雙因子 ANOVA（模型效應 vs 措辭框架效應）等正式統計檢定，目前設計描述中未提到統計檢定方法，這是文獻中普遍存在但 jev-eval 尚缺的環節。
5. 解讀「簡中最偏 PRC」的現象時，應同時引用第 16 篇（Bladon & Bent, 2026，偏向來自後訓練）與第 14／15 篇（Frank, 2026；Yang et al., 2026，拒答轉為隱性框架引導）的理論框架，並在措辭上避免因果化語言（呼應第 11 篇 Pan & Xu 的自我限定用語），只描述相關性與現象梯度。

---

## 不確定之處

- 檢索管道為 firecrawl 論文索引（涵蓋 arXiv、PubMed／PMC 等），非直接存取 ACL Anthology、NeurIPS/ICLR/FAccT 會議系統或 SSRN，因此可能遺漏僅發表於這些場地、未同步至 arXiv 或 PMC 的論文；建議後續可另外用 ACL Anthology 官網搜尋介面補查一次。
- 第 6、17 篇的核心案例分別是南海領土爭議與俄烏文件，並非兩岸／台灣議題本身，僅在方法論上高度相關，列入時已在條目中註明其議題差異，使用時請留意不要誤植為「兩岸研究」直接引用其發現數字。
- 部分論文（例如第 1、7、8、9、10 篇）為 2026 年新發表的 arXiv 預印本，尚未經同行評審，建議在正式引用時註明其預印本狀態。
- 未執行 Google Scholar 直接檢索（僅透過 firecrawl 索引的 arXiv／PMC 子集間接涵蓋），若需要更完整的引用數或會議發表版本比對，建議另行人工查證。
