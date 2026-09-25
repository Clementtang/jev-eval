先把論文、統計、前兩輪審查和原始紀錄對起來看，再核數字與公平性。論文 0.3 與統計檔比較長，我分段讀，並對照前兩輪 finding 有沒有真的改掉。接著把論文後半、統計第 7 節以後，以及中文稿對起來核。接著核對統計後段、主張編碼與中文稿差異，並用腳本重算關鍵數字。開始重算指數、標籤率與複製主張，並對照中文稿 4.2–4.7。接著用腳本重算指數、標籤、檢定家族與主張分數，確認論文數字是否站得住。最後核對 4.8 的「一格相同」、Holm 家族切換，以及中文稿有沒有獨有的意思漂移。# 論文草稿 0.3 對抗式審查（第三輪）

審查對象：`docs/paper/paper.en.md`（Preprint draft 0.3），並抽查 `docs/paper/paper.zh-TW.md`。  
審查日期：2026-09-25。  
審查立場：反對者；執行者為 xAI 的 Grok，受測對象含 Grok 4.7，利益衝突與前兩輪的 Anthropic 審查對稱。  
比對來源：`results/stats.md`（17 節）、`results/runs/*.jsonl`（26,796 筆）、`data/dataset.json`、`lib/stats.mjs`、`scripts/stats.mjs`、`scripts/build-dataset.mjs`、前兩輪 `docs/paper/review-round1.md`、`docs/paper/review-round2.md`。  
重算：以 Python 直接讀 jsonl，重寫符號翻轉與 Holm，未改 repo、未呼叫 API。

---

## 1. 總評

0.3 版把前兩輪多數 Critical 收進正文了：標籤不再寫成 Jev 最低、絕對位置不再寫成「位於中立點」、B 組與 Haiku 0.91 有寫、token 重複計算已改、標題的 Why 已拿掉。主張上 Jev 低於 Sonnet、Grok 與兩個 GPT-6，以及原序標籤把 Sonnet 單獨挑出來，這兩句有資料撐著。摘要卻把 Haiku 比較的脆弱性寫成「相關主張怎麼算」，這與統計檔第 17 節自己的 Holm（15 組）不符，正文敏感度又改用 Bonferroni 51；這會讓讀者以為合併城市主張後比較就沒了，其實在同一套 15 組校正下三語都還顯著。另外，事先定義的 7 主張指數（0.55／0.34／0.53）正文沒給點估計，摘要卻放了看過結果後才切出來的 12 主張「簡中 0.26 顯著低於 0.5」。核心相對排名不必推翻，這兩處會讓絕對位置與 Haiku 比較被讀錯。

---

## 2. 第二輪 finding 處理狀態

| 編號 | 狀態 | 一句理由 |
| ---- | ---- | -------- |
| C1 標籤「Jev 最低」 | 已處理 | 4.5 與第 5 節改為原序並列 Haiku／GPT-6，合併條件給出 0.5% 至 21.1%，與重算 3／6／11／8／19／139 次一致。 |
| C2 「位於中立點」 | 部分處理 | 「sits at」已刪，15 主張與 0.5 的關係寫對了；摘要仍把事後切掉城市主張的 0.26 當標題句，見本輪 C2。 |
| C3 三處事實錯誤 | 部分處理 | 拉薩數字與 GPT-6 推理 token 已改；4.7「上升 0.01 以內」對 Grok 繁中不成立，見本輪 M3。 |
| C4 GPT-6 token 重複計算 | 已處理 | Table 1／9 為 Luna 100、Sol 78、成本 0.067／1.13，與 `stats.md` 第 12 節一致。 |
| M1 新增 8 主張研究者自由度 | 部分處理 | 3.2 已寫原 7 主張不可能顯著、一次寫定、未刪題；仍稱為 replication，見本輪 M1。 |
| M2 主張不獨立 | 部分處理 | 3.3／4.2 有合併版本；摘要把 Haiku 的不顯著歸因於相關主張，校正方法卻換了，見本輪 C1。 |
| M3 規範題與國際組織題 | 部分處理 | 3.3 已標示並給不含這兩題的敏感度（0.51／0.35／0.52）；兩題仍在主指數裡。 |
| M4 三種工具三種排序 | 部分處理 | 標題改 How，Sakhawat 限於相對排名；4.5 仍寫 choices 與 claims 同一排序，見本輪 M2。 |
| M5 Claude 不利結果 | 部分處理 | 4.2 有 Haiku 0.91、4.7 有兩個 Claude 的一中選項、4.3 有 Jev 的 two separate states；摘要把 Haiku 與 Jev 在北京提問者下寫成同一件事，見本輪 M4。 |
| M6 標籤編碼與未定義 China | 已處理 | 3.3 改為輸出格式的操作定義，4.4 註明 ISO 名稱與金門。 |
| M7 審查代理人身分 | 已處理（揭露層面） | 第 7 節改為 separate Claude sessions, which share the vendor conflict of interest。本輪即該節所缺的非 Anthropic 審查。 |
| M8 民調 pending | 未處理 | 3.2 仍有 `[pending author verification of the option labels]`，66.7% 未寫入。 |
| 第二輪 m1–m13 | 大致已處理 | `instead of`／`rather than`／破折號 0 處；Luna 區間、27 個措辭、問者框架的 Limitations 8 已補。殘留見本輪 Minor。 |

---

## 3. Critical

### C1. 摘要把 Haiku 比較的脆弱性寫成「相關主張怎麼算」，正文與統計檔用了兩套校正

- **位置**：摘要「against Claude Haiku 4.5 its significance depends on how correlated claims are counted」；4.2「With the city claims merged, the exact p-values are 0.002, 0.002 and 0.009, which exceed 0.05 after a Bonferroni bound over 51 comparisons (statistics file, section 17)」。
- **問題**：主分析用 Holm、51 組，英文 Jev−Haiku 校正後 p = 0.081，這一格本來就不顯著，原因是 51 組家族，不是城市主張相關。統計檔第 17 節對同一套「城市合併為 13 單位」用的是該集合內 15 組 Holm，三語皆顯著（0.007、0.007、0.009，格內有 `*`）。正文不引這組 Holm，改用 Bonferroni 51 上界再說「超過 0.05」。主結果用較寬的 Holm、敏感度用較嚴的 Bonferroni，讀者會以為合併相關主張後比較就消失。
- **證據**：獨立重跑符號翻轉（與 `lib/stats.mjs` 相同列舉）。15 主張、只對 15 組 Jev 比較做 Holm：英文 Haiku p = 0.00543，Holm-15 = 0.005，顯著。13 單位合併城市：精確 p = 0.00244、0.00244、0.00854；Holm-15 = 0.007、0.007、0.009（與 `stats.md` 第 700–716 行一致）；Bonferroni 51 上界 = 0.12、0.12、0.44。主分析 `stats.md` 第 2 節 Holm-51 下英文 Haiku 為 0.081。
- **建議改法**：摘要改成「與 Haiku 的英文比較在 51 組 Holm 下不顯著（校正後 p = 0.081）；若只對 15 組模型比較做校正，合併城市主張後三語仍顯著」。4.2 同時報 section 17 的 Holm-15 與 Bonferroni 51，不要只報後者。敏感度與主分析用同一種校正。

### C2. 摘要的「簡中 0.26 顯著低於 0.5」是看過結果後切掉城市主張得到的；事先定義的指數點估計沒進正文

- **位置**：摘要「Without the three city claims its Simplified Chinese index is 0.26, significantly below 0.5」；3.2 只說原 7 主張「no comparison could be significant」，沒給 7 主張指數。
- **問題**：城市主張有兩題在事先定義的 7 題裡。拿掉三個城市等於把預先寫好的指數拆掉再檢定。15 主張主分析與 0.5 無顯著差異（簡中精確 p = 0.051，校正後 0.204）。原 7 主張點估計為 0.55／0.34／0.53（繁中與英文在 0.5 之上），只出現在 `stats.md` 第 17 節。摘要並列「與 0.5 無差異」與「0.26 顯著偏低」，讀者會帶走後者。
- **證據**：`stats.md` 17a 原 7 主張：Jev 0.55／0.34／0.53；不含城市（12）：0.40／0.26／0.40，簡中校正後 p = 0.021（該 18 格家族內）。獨立重算 12 主張簡中精確 p = 0.0029，與檔案一致。
- **建議改法**：摘要只保留 15 主張與 0.5 的主結果，12 主張放到 4.2 當組成說明。正文補一句原 7 主張指數 0.55／0.34／0.53。若作者認為城市主張是管轄事實、不該進主權指數，就把主分析改成 12 主張並重寫摘要，不要兩種標題並存。

---

## 4. Major

### M1. 「複製」說得過重

- **位置**：3.2「Section 4.2 reports them separately as a replication」；4.2「this replication is directional: it reproduces the sign of every comparison on the original seven claims」。
- **問題**：八題是看過原七題方向之後才寫的，題型同屬主權公式與城市句。第二批看不到新結果，這只排除了依新結果刪題，沒有排除依舊結果選題。對 Haiku 簡中，八題裡 Jev 較低的只有 5／8（精確 p = 0.109）。平均差值仍為負（−0.15），「每一組比較的正負號」指的是 15 個平均差，不是每一題。
- **證據**：`stats.md` 第 759–777 行；重算 Haiku 簡中三題 Jev 較高：`taichung-in-prc` +0.036、`prc-holds-sovereignty-over-taiwan` +0.084、`prc-govt-represents-taiwan` +0.174。後兩題與 Table 4 的 Haiku 0.91／0.51 對得上。
- **建議改法**：改稱「同一方向的延伸樣本」，刪掉 replication。補 Haiku 簡中 5／8。若要保留複製一詞，限於「12 組對 Sonnet／Grok／GPT-6 的平均差符號」。

### M2. 「主張與選擇同一排序」不成立

- **位置**：摘要「Forced choice gives the same ordering as claims」；4.5「choices thus give the same ordering as claims」；第 1 節「Claims and choices therefore give one ordering of the models」。
- **問題**：簡中原序選擇題：Jev 三題都選 PRC 表述；Sonnet 只在「中華民國與中華人民共和國關係」選一中（且受順序影響）；Haiku、Grok、兩個 GPT-6 都選 unresolved／undetermined／de facto。主張指數簡中排序是 Jev 0.35 ＜ Haiku 0.59 ＜ Sonnet 0.65 ＜ Grok 0.78 ＜ Luna／Sol 0.85。Haiku 在主張上緊挨 Jev，在選擇上與 Grok／GPT-6 同一群。資料支持的是：主張與選擇都會把 Jev 放在最靠近 PRC 的一端；六個模型的排列並不相同。
- **證據**：`stats.md` 第 1 節與第 13 節（roc-prc-relation、taiwan-sovereignty-holder、taiwan-status 的 base 欄）。
- **建議改法**：改為「主張與選擇都會把 Jev 排在最靠近 PRC 立場的一端；選擇題不會重現六個模型在主張指數上的排列」。

### M3. 4.7「上升 0.01 以內」對 Grok 繁中為假

- **位置**：4.7「the Beijing asker lowered it for every model and language except Grok 4.7 in all languages and GPT-6 Luna in English, where it rose by 0.01 or less」。
- **問題**：例外名單對（Grok 三語與 Luna 英文未下降）。幅度不對。這句是第二輪 C3b 建議稿，0.3 直接沿用，沒核 Grok 繁中。
- **證據**：`stats.md` 第 9 節 f1：Grok 繁中無標註 0.85、北京 0.88；英文 0.85、0.87。重算：Grok 繁中 +0.039、簡中 +0.011、英文 +0.011；Luna 英文 +0.003。
- **建議改法**：改為「Grok 三語皆上升，繁中約 0.04，簡中與英文約 0.01；Luna 英文上升不到 0.01」。

### M4. 摘要把兩個 Claude 與 Jev 在北京提問者下寫成同一種強迫選擇行為

- **位置**：摘要「When the asker was described as living in Beijing, Jev and both Claude models chose PRC formulations in forced choice in Simplified Chinese and English」。
- **問題**：Jev 在簡中與英文三題都選 PRC（唯一合法政府、主權者、領土一部分）。Sonnet 選一中與「領土一部分」，主權者仍為 undetermined。Haiku 只在 roc-prc-relation 選一中（5／5），主權者與政治地位仍為 undetermined／de facto。4.7 正文較準；摘要把 Haiku 說成與 Jev 相同。
- **證據**：`stats.md` 第 390–477 行 asker-cn 欄。
- **建議改法**：摘要改為「北京提問者下，Jev 在簡中與英文三題都選 PRC 表述；兩個 Claude 模型在簡中與英文的『兩岸關係』題選『中華人民共和國是唯一合法政府』（各 5／5）」。這對 Claude 較不利的細節留在 4.7 即可，摘要不要加碼。

### M5. 「生成式模型偏向台灣主權」蓋過 Claude 在簡中與 0.5 無差異

- **位置**：第 1 節「the generative models lean toward Taiwan's sovereignty」；第 5 節「while generative models lean toward Taiwan's sovereignty」；4.2 已寫兩個 Claude 簡中與 0.5 無顯著差異。
- **問題**：Table 3：Haiku 簡中 0.59、Sonnet 簡中 0.65，皆無星號（`stats.md` 1b 校正後 p = 0.409、0.125）。12 主張下 Haiku 三語都與 0.5 無差異。第 1、5 節的全稱與 4.2 自己的表矛盾。
- **證據**：`stats.md` 第 26–45、624–633 行。
- **建議改法**：改為「Grok 與兩個 GPT-6 模型在三語都高於 0.5；兩個 Claude 模型在繁中與英文高於 0.5，簡中與 0.5 無顯著差異」。

### M6. 「兩種相反傾向」收得太乾淨

- **位置**：摘要「this average combines two opposite tendencies: Jev agrees with PRC sovereignty formulas and rejects claims that Taiwanese cities belong to the PRC」。
- **問題**：拉高平均的不只城市主張。取向後高於 0.5 的還有「PRC 政府代表台灣」（Jev 同意度 0.28／0.34／0.31，取向約 0.72／0.66／0.69）與「前途由台灣人民決定」（0.65／0.62／0.64）。低於 0.5 的 9 或 10 題裡，也包括「台灣有權加入國際組織」（0.23／0.16／0.18）與簡中「中華民國今天仍然存在」（0.28）。4.2 正文有治理／地點／前途，摘要只留套語對城市。
- **證據**：對 `results/runs/*.jsonl` 重算 15 題取向分數；Table 4 與 `stats.md` 第 16 節。
- **建議改法**：摘要改為「平均掩蓋了組成：Jev 同意主權套語，否定管轄與城市主張，對前途自決則同意」。簡中「中華民國仍然存在」0.28 建議在 4.2「哪些主張」補一句。

### M7. 第 5 節仍未把官方記載的 CJK 限制列為替代解釋

- **位置**：第 5 節「What Jev's pattern may reflect」；3.1 已引 TypeSafe（2026a）「handled but not equally well」。
- **問題**：Jev 最靠近 PRC 的語言是簡中（0.35），正好落在廠商說表現較弱的 CJK。第 5 節只列「套語當命題」與「照字面讀」。4.1 的能力題全對，只能排除完全看不懂，不能排除中文校準較差。第二輪 M7 這一截仍在。
- **證據**：3.1 原文；第 5 節兩段替代解釋；Table 3 簡中 0.35 為六個模型最低。
- **建議改法**：第 5 節加一句 CJK 限制，並寫能力題不足以排除語言校準差異。

### M8. 民調題仍標 pending，預印本不能帶這個括號

- **位置**：3.2「(Formosa, 2026) [pending author verification of the option labels]」。
- **問題**：第二輪已指出 repo 內 `docs/research/taiwan-survey-questions.md` 有美麗島 2026 年 5 月第 9 題八選項，五個維持現狀類合計 66.7%。0.3 沒核、沒寫數字、括號還在。
- **證據**：論文 3.2 原文；研究筆記第 3.1 節（本次未連網重驗 URL，標 未驗證）。
- **建議改法**：作者打開美麗島頁面核對後刪 pending；寫入 66.7%，並註明本題五選項是 ESC 六選項的合併。核對前不要公開。

### M9. 符號翻轉仍把高度相關的單位當獨立（主分析 14／15）

- **位置**：摘要「Fourteen of these fifteen differences remain significant」；3.3 已承認有效單位少於 15。
- **問題**：14／15 仍是主結論。三個城市、part／province、主權／內政、ROC 主權／獨立於 PRC／仍然存在，都不是獨立試驗。C1 的家族切換會讓「14／15」與「Haiku 視相關而定」綁在一起被高估。
- **證據**：4.2 自己報 12／12、13／13 對 Sonnet／Grok／GPT-6 穩健；Haiku 合併後 12／13、11／13、11／13。
- **建議改法**：摘要主句改為「對 Sonnet、Grok 與兩個 GPT-6，在所有嘗試過的單位定義下 Jev 都較低」；14／15 留在 4.2 並加「以主張為獨立單位」。

---

## 5. Minor

### m1. 「35 of 36、一格相同」是四捨五入造成的假平手

- **位置**：4.8「in 35 of 36 cells (one tie)」。
- **證據**：`stats.md` 第 10 節 Sol 高雄繁中印成 0.01／0.01。原始值 colloquial 0.013、PRC 0.005，日常用語版仍較高。36 格全部日常用語 ≥ PRC 版，沒有真正平手。
- **建議**：改為「36 格中日常用語版都不低於 PRC 版；四捨五入到兩位時，Sol 高雄繁中同為 0.01」。

### m2. 英文 4.2「on all fifteen claims」易讀成每一題都高於 0.5

- **位置**：4.2「Every generative model lies above 0.5 in Traditional Chinese and English on all fifteen claims」。
- **證據**：Haiku 繁中 2／15、英文 2／15 低於 0.5（`stats.md` 1b）。中文稿寫「以十五個主張計算…都高於 0.5」，較不易誤讀。
- **建議**：英文改齊中文：「the fifteen-claim index is above 0.5」。

### m3. 中文稿把 PRC 簡稱為「中國」，與 4.8 的論點打架

- **位置**：中文摘要「中華人民共和國（以下簡稱中國）」；4.8 討論未定義的「中國」。
- **問題**：英文在技術陳述多用 PRC。中文簡稱之後，讀者不容易分「本文用語」與「題目裡未定義的中國」。數字與論點與英文一致，這是用詞。
- **建議**：技術段落維持「中華人民共和國」或「中國（中華人民共和國）」；4.8 明寫「題目裡未定義的『中國』」。

### m4. Table 4 仍未列 Haiku「中華民國今天仍然存在」英文 0.49

- **位置**：Table 4 與 4.2「哪些主張」。
- **證據**：`stats.md` 第 16 節 `roc-exists-today` Haiku 0.95／0.84／0.49。與 Jev 簡中 0.28 同屬「存在」題上的低同意，目前都沒進表。
- **建議**：Table 4 加一列，或 4.2 一句帶過。

### m5. 因子分解 Table 7 未獨立重跑 OLS

- **位置**：4.6 Table 7。
- **證據**：五列與 `stats.md` 6b 一致。本次未重解正規方程，標 未驗證（計算過程）。
- **建議**：無；僅註明審查範圍。

### m6. 引用 URL 本次未連網重驗 200

- **位置**：參考文獻。
- **說明**：第一、二輪依 `citation-check.md` 查過的描述，本輪未再 HEAD/GET。標 未驗證。

---

## 6. 查過沒有問題的項目

以下與 `stats.md` 或 jsonl 重算一致。

**規模**：26,796 筆、`ok:false` = 0、`refusal` = 0；基準 417、變體 540（asker 165×2、順序 105×2）；A 180、B 15、C 36、D 156、F 6、K 24；呼叫數 2,085×5 + 1,251。

**Table 3**：18 格點估計、區間、星號與第 1／1b 節一致；14／15、英文 Haiku −0.16、精確 p = 0.005、校正後 0.081；12 組 15／15、對 Haiku 14／12／13。

**4.2 組成與敏感度**：低於 0.5 為 9／10／9；城市取向平均 0.90／0.74／0.92；12 主張 0.40／0.26／0.40；只 f1 0.49／0.35／0.50；排除 |gap|＞0.3 為 0.50／0.28／0.50；不含規範題 0.51／0.35／0.52；拉薩 0.89／0.88／0.97（重算 0.888／0.878／0.974）；新增八題差值 −0.15 至 −0.47、12 組 8／8、精確 p = 0.008、最小 Holm-15 = 0.117。

**Table 4**：抽查 Jev 主權 f1 0.17／0.08／0.12、Haiku 擁有主權 0.67／0.91／0.50、Sonnet 內政 0.65／0.74／0.63、Haiku 代表台灣 0.49／0.51／0.49，與第 16 節一致。

**4.3／Table 5**：Jev 簡中三題 PRC 且對順序穩健（roc-prc 隨機序 4／5）；台北提問者下主權者 undetermined、地位 de facto（各 5／5）；繁中台北提問者 two_separate_states 3／5；Sonnet 簡中原序 5／5 一中、反序 4／5 與隨機 5／5 改為 PRC 為主權者。

**Table 6／4.4**：原序、反序、隨機、北京提問者各格與第 7 節一致，含 Luna 區間與 Sonnet [17%, 67%]、[25%, 100%]；Jev 10% 來自金門 5／5 與電話 1 次；合併條件 0.5%、0.9%、1.7%、2.0%、2.9%、21.1%（3／6／11／8／19／139 次）；Grok 下拉 2／3 選 ISO 名稱；Jev 香港 x_comma_parent、西藏 parent、科索沃 x；台北提問者全 0。

**4.6／Table 7**：簡中減繁中 −0.16、−0.14、−0.10、−0.07、−0.06、−0.04 與顯著性；繁中對英文皆不顯著；27 措辭平均 0.21／0.18／0.17；Table 7 與 6b 列印值一致。

**4.7 差值**：Sonnet −0.13／−0.24／−0.27、Jev −0.11／−0.09／−0.15、Haiku −0.07／−0.10／−0.10，與第 2 節一致；台北提問者六模型三語皆上升（重算 tw−base 全為正）。例外見 M3、M4。

**4.8／Table 8**：48 格與第 11 節一致；生成式台灣 0.58–0.74、科索沃 0.60–0.85；日常用語省陳述 18 格皆高於 PRC 版；Sonnet 高雄 0.95 對 0.04；Jev 0.69／0.50／0.48；「closer to the PRC version than to the ROC version」在 Sonnet 繁中成立（0.08 對 0.04 對 0.14）。

**4.1／F 組**：六模型民調兩題全選 taiwanese 與 status_quo；聯合國會員同意度皆 ≤ 0.04；Haiku 簡中「管轄」正句五次 0.05、反句 0.15／0.15／0.05／0.05／0.05，與「否定反句」相符。

**4.9／Table 9**：順序 104／103／101／98／89／89；|gap| 0.071 至 0.371；Jev 負 gap 53／54；方向一致 15／15／14／14／11／9；成本倍數 5／28／70／84／442（以 0.0134 計）。

**符號翻轉實作**：雙尾、列舉 2^n、以差值總和為統計量；15 單位全同號 p = 2／32768 ≈ 0.00006，Holm-51 約 0.003，與第 2 節「＜ 0.001／0.003 *」一致。

**中文稿抽查**：4.2–4.7 數字與英文相同；4.1 中文把例外限在反句，比英文「except that case」清楚。未發現中文獨有的數字錯誤。意思漂移見 m2、m3。

---

## 7. 是否可以發表

還不行。相對排名（主張上 Jev 低於 Sonnet、Grok、兩個 GPT-6；原序標籤把 Sonnet 挑出來）在這次重算裡站得住，前兩輪要的多數表格與揭露也補了。C1 與 C2 會讓摘要層的 Haiku 比較與 Jev 絕對位置被讀成另一個研究。建議至少：統一校正家族並改寫摘要的 Haiku 句；把 0.26 從摘要移到 4.2；刪掉 replication 或降級；改 4.7 的 0.04；拿掉 pending 後再公開。這幾句改完，作為預印本可以出。現在這稿，標題句還會被統計讀者拆掉。

這樣就可以了吧？
