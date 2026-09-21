# 社群與業界對 AI 模型「台灣主權／兩岸關係」立場的實測調查

調查日期：2026-09-21
目的：為 jev-eval（測試 TypeSafe Jev 結構化判斷模型在台灣主權議題上是否有偏向）尋找可借用的題庫、方法論、常見批評。
驗證方式：每筆 URL 皆以 WebFetch 實際打開確認，內容與摘要相符者列入主清單；打不開或無法確認者標記 [UNVERIFIED] 並列於文末，不計入主清單。

---

## 一、可直接借用的題庫／資料集（最優先）

### 1. Taiwan Sovereignty Benchmark Pro（含論文＋GitHub 題庫）

- **標題**：Bilingual Bias in Large Language Models: A Taiwan Sovereignty Benchmark Study
- **作者／單位**：Ju-Chun Ko（台灣立法委員）與 Littl3Lobst3r（AI 研究助手），透過個人部落格與 arXiv 發表，非傳統學術機構產出，屬「政治工作者＋工程師」的社群型研究
- **日期**：2026-02（部落格發文 2026-02-06）
- **URL**：
  - 部落格：https://blog.juchunko.com/en/taiwan-sovereignty-benchmark-arxiv/
  - 論文：https://arxiv.org/html/2602.06371v1
  - 題庫與程式碼：https://github.com/dAAAb/ai-taiwan-sovereignty-benchmark-pro
  - 較早版本／原始 repo：https://github.com/hsiaoa/ai-taiwan-sovereignty-benchmark
- **測了哪些模型**：17 個主流 LLM，涵蓋美、法、中系（含 DeepSeek R1、Qwen3 Max、GPT-5.2、GPT-4o Mini 等）
- **題目與方法**：
  - Stage 1「主權辨識」：10 題成對題（S1-001~S1-010），繁體中文／英文雙語各一版，用紅旗關鍵字表（`red_flags.json`）自動判斷是否出現「不可分割領土」「台灣省」等親中共論述關鍵字，命中即判 fail
  - 另有 Stage 2 知識深度（歷史/政治/文化/經濟各 25 分）與 Stage 3 壓力測試（敏感話題處理、事實正確性）
  - 自創指標：Language Bias Score（語言方向性差異）、Quality-Adjusted Consistency（一致性×品質）
  - 用 McNemar's test 做統計顯著性檢定
- **主要發現**：17 個模型中 15 個有可測得的語言偏向；6 個中國系模型全數不合格（部分中英文皆 0/10，屬「語言一致性審查」）；西方模型也出現中文版表現明顯劣於英文版（如 GPT-5.2 中文 7/10、英文 10/10），推測受中文語料汙染；只有 GPT-4o Mini 雙語皆滿分
- **可借用之處**：
  - 題目設計本身（成對句 + 紅旗關鍵字判斷）與 jev-eval 的「正反句對」「B 立場選擇」「C 實務分類」設計高度可對照，可直接比對題型覆蓋率、互相補題
  - `results/bilingual/` 原始回應與 `RESULTS.md` 呈現格式可參考做跨模型比較表
  - Language Bias Score／Quality-Adjusted Consistency 這兩個指標可考慮引入 jev-eval 做語言間一致性度量（目前 jev-eval 有 zh-TW/zh-CN/en 三語，正好可套用同樣邏輯）
  - MIT License，可直接取用題目 JSON

### 2. mgoldey/censorship（Qwen 審查與偏見測試集）

- **標題**：Repo used to evaluate censorship and bias in Qwen models and derivatives
- **作者**：GitHub 帳號 mgoldey（個人專案，非機構）
- **URL**：https://github.com/mgoldey/censorship
- **測了哪些模型**：Qwen 3.5 系列（2B/4B/9B）之 base 版、abliterated（消融移除拒答機制）版、以及 DavidAU 之 HERETIC 優化蒸餾版，共 7 個模型
- **題目與方法**：54 題分 5 類——拒答類（天安門、維吾爾、西藏、香港、法輪功）、中共立場框架類（**台灣**、新疆、審查有效性）、暗語規避類、對照組（美方歷史事件如虐囚案、肯特州事件）；用 Claude Haiku 做 LLM-judge，評分維度含「拒答／親中共立場／捏造／模糊／坦率」＋嚴重度分數
- **主要發現**：base 模型在台灣等政治題上 30-35% 拒答、72-78% 親中共立場回答；abliterated 2B/9B 版嚴重度大幅下降（2.23→0.90）、親中共立場降到 16%；但 4B 版消融反而讓捏造率飆到 63%，顯示技術對模型大小敏感
- **可借用之處**：其「對照組」設計（用美方歷史爭議事件做基準，避免只測中國敏感詞）與 jev-eval 的「D 對照組地區」精神一致，可互相參照設計對照題；LLM-judge 多維度評分法可作為文字生成模型的比較基準（jev-eval 測的是結構化機率模型，但仍可用來對照 Claude/Opus 對照組的文字回應）

### 3. reinthal/deception-detection-in-chinese-models

- **標題**：Detecting Censorship, Deception and alignment problems in politically sensitive questions
- **URL**：https://github.com/reinthal/deception-detection-in-chinese-models
- **測了哪些模型**：Qwen2.5-72B 對照 Llama-3.3-70B
- **題目與方法**：340 題政治敏感題＋718 題對照題（Hugging Face 上開放資料集），用「線性欺騙探針」（linear deception probes，基於模型內部 activation 訓練）偵測策略性欺騙，另用「黨語詞頻」（party-line word frequency）與 LLM 評分（evasiveness／faulty logic／narrative divergence）比對
- **主要發現**：Qwen 在敏感題上的迴避程度落差（+20.74 分）遠高於 Llama（+8.62）；黨語詞頻與評判分數相關係數 ρ=0.72；提出「中國模型可能主觀認為政治正確回答即為『誠實』」的假說，與西方評審標準衝突
- **可借用之處**：這是少數用「模型內部表徵」而非純粹輸出文字做偵測的方法，如果 jev-eval 未來想從純機率輸出往內部機制延伸，可參考其方法論；718 題對照組資料集可能有可用素材，但需人工篩出台灣相關子集

### 4. ChinaBench V2

- **標題**：ChinaBench V2 — LLM Censorship Benchmark
- **URL**：https://china-bench.vercel.app/
- **測了哪些模型**：約 10 個模型（含中國系標記模型與參照基準模型）
- **題目與方法**：涵蓋天安門、西藏、**台灣**、新疆、審查等 10 大主題；同一 prompt 同時送給多模型，用可設定的 LLM-as-judge（2-3 個快速模型做主評審，另設 master judge 處理分歧）自動分類為「直接回答（綠）／迴避或模糊（黃）／拒答（紅）」三級；工具可本機執行、自帶 OpenRouter API key，結果可重現
- **可借用之處**：三級（直接／模糊／拒答）的呈現法比二元判斷更貼近實務語感，jev-eval 目前是「是非機率＋選項機率」，可考慮在呈現層加一個「模糊帶」的視覺化分級，方便非技術讀者理解；其「本機可重現」設計理念（不上傳資料、用自己的 API key）也值得參考，降低發表時的資料外洩疑慮

### 5. SpeechMap.AI（Free Speech / Refusal Rate Leaderboard）

- **標題**：SpeechMap.AI - AI Refusal Rates & Free Speech Leaderboard
- **作者**：xlr8harder（獨立研究者，社群知名的 LLM 審查測試作者）
- **URL**：https://speechmap.ai/ ；方法論說明：https://speechmap.substack.com/p/debuting-speechmap-index-and-lab
- **測了哪些模型**：涵蓋 ChatGPT、Claude、Gemini、Grok、DeepSeek 等近 400 個模型，累積 84.5 萬則回應
- **題目與方法**：對所有模型送出相同的「爭議性請求」（政治論證、諷刺、宗教、歷史、權利倡議等），記錄「完整回答／迴避／拒答」三態，隨時間追蹤拒答率變化；以「Free Speech Index」做廠商排行榜
- **備註**：本次抓取到的頁面內容未直接顯示台灣／中國專屬題目分類，但其「Political」大類極可能涵蓋兩岸議題，建議之後另外查證其題庫明細（本次未逐題核對，故此點列為待確認事項，不影響主體引用）
- **可借用之處**：其「隨時間追蹤同一模型不同版本的拒答率變化」呈現法（time-weighted leaderboard）值得參考，可用來呈現 Claude Sonnet/Opus 各代版本在台灣主權題上是否隨版本更新而變化

---

## 二、政府／智庫報告（提供題目設計與批評視角）

### 6. 數發部 AIEC「台灣主權 AI」評測（iThome 報導）

- **標題**：數發部AIEC公布國內外通用模型主權AI評測結果，模型不只要懂繁中、社會環境，還要懂臺灣價值觀
- **單位**：數位發展部 AI 產品與系統評測中心（AIEC）
- **日期**：2026-09-03
- **URL**：https://www.ithome.com.tw/news/178626
- **測了哪些模型**：188 個各國模型
- **題目與方法**：三面向——語言能力（用學測國文題）、文化理解（用社會科題）、台灣價值觀（反映「媒體與政府關係」等本土共識議題的題目）
- **主要發現**：前三名為 GPT-5.6-Sol、Claude-Fable-5、Gemini-2.5-Pro；本土模型「雅婷智慧」以 300 億參數排第四，小模型仍具競爭力
- **可借用之處**：官方「台灣價值觀」評測題型可作為 jev-eval K 能力基準之外的第四維度參考；三面向分拆（語言／文化／價值觀）的架構值得對照 jev-eval 現有的 B/C/D/K 四類設計是否有缺口

### 7. 同一評測的公視新聞網報導（第一波，較早版本）

- **標題**：數發部台灣主權AI評測出爐 本土模型「雅婷智慧」奪第4
- **單位**：公視新聞網 PNN
- **URL**：https://news.pts.org.tw/article/825337
- **內容**：與上則 iThome 報導對應同一評測事件，可互相佐證
- **可借用之處**：媒體角度的報導方式（如何向大眾解釋「懂台灣」這件事），可作為 jev-eval 對外發表時的科普語言參考

### 8. 晶創臺灣推動辦公室「最懂台灣的AI」評測公告（較早一波，2025-05）

- **標題**：最懂台灣的AI是「它」？最新評測出爐、台灣價值觀獲滿分
- **單位**：晶創臺灣推動辦公室（國科會系統）
- **日期**：2025-05-01
- **URL**：https://cbi.nstc.gov.tw/Page/DA25AE82C805449D/1093412a-4141-47c9-9b44-5e0ce96fb933
- **測了哪些模型**：本土與國際開源模型（含 APMIC ACE-1-24B、TAIDE 12B、Qwen、GLM 等）
- **主要發現**：APMIC ACE-1 在「台灣價值觀」拿到 100%，TAIDE 12B 拿 84%；中國系模型 Qwen、GLM 學科能力強但「台灣價值觀」僅 40-60%，反映訓練語料來源差異
- **可借用之處**：這是數發部 AIEC 評測的前身／同系列調查，兩者對照可看出官方評測題庫的演進，題目本身（若能取得）可作為 jev-eval C 分類題的交叉驗證來源

### 9. 台灣國安局（NSB）中國 AI 模型風險報告（Taipei Times 報導）

- **標題**：China's AI models pose risks, NSB says
- **單位**：Taipei Times 報導台灣國家安全局調查
- **日期**：2025-11-17
- **URL**：https://www.taipeitimes.com/News/front/archives/2025/11/17/2003847325
- **測了哪些模型**：DeepSeek、豆包（Doubao）、文心一言（Yiyan）、通義（Tongyi）、元寶（Yuanbao）共 5 個中國模型
- **主要發現**：除資安風險（未授權存取定位、螢幕截圖、強制接受不合理隱私條款）外，明確點出政治立場問題——模型會生成「台灣目前由中國中央政府管轄」「台灣不是一個國家」「台灣是中國不可分割的一部分」等論述，並刻意迴避「民主」「自由」「人權」等關鍵字
- **可借用之處**：這是官方（國安機關）版本的「紅旗關鍵字」清單，可直接與 juchunko 部落格的 red_flags.json 比對互補，強化 jev-eval C 分類（Taiwan / Taiwan (China) / Taiwan, China / China）的關鍵字判準基礎

### 10. ASPI 報告：中國 AI 系統如何重塑人權敘事（The Register 報導）

- **標題**：China using AI as 'precision instrument' of censorship and repression, at home and abroad（報導 ASPI 報告 "The Party's AI: How China's New AI Systems Are Reshaping Human Rights"）
- **單位**：Australian Strategic Policy Institute (ASPI)，The Register 報導
- **日期**：2025-12-03
- **URL**：https://www.theregister.com/2025/12/03/aspi_china_ai_report/
- **測了哪些模型**：Baidu ERNIE Bot、Alibaba Qwen、Zhipu AI GLM、DeepSeek VL2（圖像模型）
- **題目與方法**：用 2019 香港反送中、天安門事件、法輪功等敏感圖像資料集，測模型對圖像的審查反應（拒答／空白輸出／出錯訊息），新加坡地區的推論服務商觸發拒答的頻率明顯高於美國
- **備註**：本文未提及台灣文字題型（該篇聚焦圖像審查），但同系列研究（見第 9 則國安局報告）明確涵蓋台灣論述，可視為互補
- **可借用之處**：多模態（圖像）審查測試是 jev-eval 目前未涵蓋的面向，若未來擴充可參考其「地區推論節點差異」（新加坡 vs 美國伺服器回應不同）這個變因設計

### 11. RSF（無國界記者組織）調查：中國聊天機器人的國家宣傳與審查

- **標題**：Controlling information in the age of AI: how state propaganda and censorship are baked into Chinese chatbots
- **單位**：Reporters Without Borders (RSF)，調查負責人 Arnaud Froger
- **日期**：2025-09-30
- **URL**：https://rsf.org/en/controlling-information-age-ai-how-state-propaganda-and-censorship-are-baked-chinese-chatbots
- **測了哪些模型**：DeepSeek V3、文心一言（Baidu ERNIE）、通義千問（Alibaba Qwen）
- **題目與方法**：帳號設定為紐約、簡體中文介面，就約 30 個主題送出 100 多則提問，另測英/法/日文版本以檢驗能否繞過審查
- **備註**：本篇聚焦劉曉波、張展、維吾爾拘留營、中國政治體制，內文未提及台灣，是方法論可借鏡但主題不直接命中的案例
- **可借用之處**：「同帳號跨語言測同一議題以檢驗審查是否可被語言繞過」的設計，與 jev-eval 的三語（zh-TW/zh-CN/en）架構目的高度一致，可作為方法論佐證引用

---

## 三、業界／新聞媒體對單一模型的實測報導

### 12. 中央社報導：中國式審查滲入美國 AI 模型（引述 WSJ／Meta Oversight Board 研究）

- **標題**：中國式審查正滲入美國AI模型 相關公司改善意願低
- **單位**：中央社 CNA（轉引華爾街日報報導 Meta Oversight Board 研究）
- **日期**：2026-08-14
- **URL**：https://www.cna.com.tw/news/acn/202608140051.aspx
- **主要發現**：Meta 監督委員會研究（Nicolas Suzor 主持）指出 OpenAI、Anthropic、Google、Meta 的模型對威權政府的批評明顯少於對民主國家，**Claude 曾以「安全」為由拒絕批評習近平**；研究認為原因出在訓練資料含大量中國官媒內容，科技公司改善意願低
- **可借用之處**：這是直接點名 Anthropic Claude 的第三方研究，jev-eval 用 Claude Sonnet/Opus 做對照組時，這篇是重要的「已知偏向」背景資料，發表時應主動引用並說明 jev-eval 的對照組設計是否受此影響、如何緩解

### 13. 報導者：台灣主權 AI 語料困局（著作權爭議）

- **標題**：和解案後，未解的台灣主權AI語料困局：開發者和內容方能否終結授權衝突？
- **單位**：報導者 The Reporter
- **日期**：2026-03-22
- **URL**：https://www.twreporter.org/a/taiwan-sovereign-ai-zhtw-llm-copyright-conflict
- **內容**：中央社對開源繁中語料集 fineweb2-zhtw 開發者洪浩霖提告的爭議，突顯台灣主權 AI 語料庫在著作權上的法律真空；數位部推出「台灣主權 AI 訓練語料庫」以自願貢獻方式因應
- **可借用之處**：非直接的模型測試，但說明了「台灣本土語料稀缺」是造成模型偏向的結構性原因之一，可在 jev-eval 報告的背景／動機段落引用，解釋為何三語測試中 zh-TW 語料訓練不足可能導致偏向

### 14. The Hacker News：台灣以資安理由禁用 DeepSeek

- **標題**：Taiwan Bans DeepSeek AI Over National Security Concerns, Citing Data Leakage Risks
- **日期**：2025-02（禁令發布於 2025-02-03/04）
- **URL**：https://thehackernews.com/2025/02/taiwan-bans-deepseek-ai-over-national.html
- **內容**：數位發展部公告政府機關與關鍵基礎設施禁用 DeepSeek，理由聚焦跨境傳輸與資安風險（**未**直接以「立場偏向」為由，此點與坊間常見誤解不同，須留意）
- **可借用之處**：反面教材——說明台灣官方公開禁令的正式理由是資安而非內容立場，jev-eval 若引用「台灣禁用 DeepSeek」佐證立場問題時，措辭需精確，避免與官方原始理由混淆（常見的公開發表誤區）

---

## 四、常見的方法論批評（整理自上述來源，供 jev-eval 發表前自我檢查）

1. **語言即實驗變因，但常被忽略**：多篇來源（juchunko 研究、RSF）證實「用簡體中文問 vs 用英文問 vs 用繁體中文問」會得到系統性不同答案。jev-eval 已有 zh-TW/zh-CN/en 三語設計，方向正確，但應明確報告「語言間一致性」而非只看單語結果（可借用 Language Bias Score 概念）。
2. **關鍵字比對法（red-flag keyword）容易被句式繞過**：juchunko 的方法論用固定紅旗詞表，容易被模型用同義詞或委婉語迴避，命中率會隨模型版本迭代而失準；mgoldey 的多維度 LLM-judge 法更穩健但成本高。jev-eval 若在 C 分類上依賴固定選項機率，需注意選項設計本身是否窮盡了各種迴避式措辭。
3. **「拒答」與「模糊回答」常被混為一談**：ChinaBench 的三級分類（直接/模糊/拒答）點出二元判斷會低估「表面中立實則選邊」的模糊回答比例，這是結構化機率模型（如 Jev）理論上的優勢（不用文字迴避），但也要注意選項機率若集中在中間值，本身也是一種「模糊」，發表時需說明如何解讀。
4. **對照組設計不足會讓結果失去說服力**：mgoldey 用美方歷史事件（虐囚案等）做對照組，避免「只測中國敏感詞」被質疑選擇性攻擊；jev-eval 已有 D 對照組地區設計，建議在發表時明確闡述對照組的選題邏輯，對應這類常見質疑。
5. **官方禁令理由與內容立場問題常被媒體混用**：如 DeepSeek 禁令是資安理由而非立場理由，但社群常見報導直接連結兩者。jev-eval 發表時若引用政府行動佐證，需查證官方原始文件的措辭，避免被讀者抓出事實錯誤。
6. **模型版本迭代快，測試結果保存期短**：SpeechMap 用「近 6 個月時間加權」的排行榜設計因應此問題；jev-eval 每題測 5 次的重複測試設計是對的方向，但應同時記錄模型版本號與測試日期，供未來版本比較。
7. **小型社群評測（GitHub repo）樣本數普遍偏少（10-54 題）**：與 jev-eval 的 351 題相比，樣本規模是本次調查中數一數二大的，這是可以在發表時強調的差異化優勢，但也代表可借鏡的「題庫」多是零散小樣本，難以直接整批併入，需要逐題篩選對應 jev-eval 既有分類架構。

---

## 五、未能驗證的來源（[UNVERIFIED]，WebFetch 多次嘗試皆失敗，不列入主清單引用）

- Hacker News「Questions censored by DeepSeek」討論串：https://news.ycombinator.com/item?id=42858552 [UNVERIFIED — 伺服器持續回傳 429，無法確認內容]
- Hong Kong Free Press：DeepSeek 審查香港/台灣提問報導：https://hongkongfp.com/2025/01/28/lets-talk-about-something-else-chinas-ai-chatbot-deepseek-answers-questions-on-hong-kong-tiananmen-crackdown/ [UNVERIFIED — 伺服器持續回傳 429]
- Forbes：Does DeepSeek Censor Its Answers?：https://www.forbes.com/sites/maryroeloffs/2025/01/27/does-deepseek-censor-its-answers-we-asked-5-questions-on-sensitive-china-topics/ [UNVERIFIED — 403 Forbidden]
- pith.science 論文轉載頁：https://pith.science/paper/2602.06371 [UNVERIFIED — 頁面內容為空，可能為動態載入頁面，WebFetch 未能取得實際內容]
- CBC News、Euronews 等 DeepSeek 審查測試報導（僅出現在搜尋摘要中，未逐一 WebFetch 驗證，故不列入主清單，如需要可另行查證）

以上未驗證項目若日後需要引用，建議改用瀏覽器實際開啟或透過 Wayback Machine 存檔確認。
