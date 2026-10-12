## 1. 總評（先揭露你所屬廠商與受測模型的關係）

我是 xAI 的 Grok 4.6。主分析受測模型包含同廠商的 Grok 4.7；附錄 F 沒有重跑它。Hsiao（2026）也沒有測 Grok。本輪由作者委託、唯讀獨立審查；我沒有參與撰寫本文。對 xAI、OpenAI、Anthropic、TypeSafe 有利的寫法我會同樣檢查。

數字與 Hsiao README 一致：Index S 繁／簡／英，Decisions API 0.85／0.68／0.84，Jev 0.11／−0.16／0.07，Clef 0.15／−0.32／−0.10，Clef-flash −0.11／−0.46／−0.23，Haiku 5.5 0.58／0.56／0.56。原句「All four decision models move toward the PRC position when the same statement is written in Simplified characters.」論文的「四個判斷模型」忠於這句；對照組 Haiku 不算在四個裡。README 沒有提到本研究。

時間線把可核對的時間點都寫出來了，也沒有寫「設計不受影響」。附錄 F 解讀有標不同陳述、不同指數、不同比較對象，沒有把兩個 0.16 拿來對齊。優先權方面，論文交代先後，沒有宣稱誰抄誰。

還沒收斂。一項 Major：第 2 節把 Hsiao 加進同一段後，結尾「四個面向延伸」的第一條（測試結構化判斷模型）已經不成立。三項 Minor：repo 早於詢問約 14 小時這件事，沒有像「早 12 分鐘」那樣算給讀者；英文「all four」前面的清單標點含糊；討論「語言」段仍只引 Huang 與 Guey。

## 2. 發現

### Critical

沒有。

### Major

**M1　第 2 節把 Hsiao 算進「這些研究」後，仍寫「測試結構化判斷模型」為延伸**

- 位置：中文第 2 節「Hsiao（2026）於 2026 年 10 月 8 日（UTC）獨立公開一項研究……該研究比較 Decisions API、Jev 與 Cloudflare 的 Clef、Clef-flash 等結構化判斷模型……本研究在四個面向延伸這些研究：測試結構化判斷模型；在主張之外同時量測強迫選擇與實務標籤；比較日常用語與明確指名的「中國」；以及標明提問者所在地，藉以區分語言本身與模型推測的受眾。」英文對應句 "We extend this work in four ways: we test a structured decision model; ..."
- 問題：這四條原本是對著 Ko、Huang、Guey、Zhou 寫的。Hsiao 已經測了四個結構化判斷模型，其中包含 Jev（`jev-1.13.0`）與 Decisions API（`gpt-6-luna`）；README 也寫有三種角色設定。把 Hsiao 放進同一段後，「這些研究／this work」會把 Hsiao 算進去，第一條延伸不再成立，第四條（提問者／受眾）也變弱。強迫選擇、實務標籤、日常用語對指名「中國」，相對 Hsiao 仍站得住。
- 證據：Hsiao README 列出 Decisions API、Jev、Clef、Clef-flash，並寫 "under three phrasings and three personas"。中文 README：「每句分別用繁體中文、簡體中文、英文提問，搭配三種措辭與三種角色設定」。
- 建議修法：四條延伸改回只對著先前的生成式文獻；另寫一句本研究與 Hsiao 的差別（題庫與指數、強迫選擇與標籤、日常用語對指名、端點對字形）。中英同步。

### Minor

**m1　貼文「早 12 分鐘」有算給讀者，repo 早於詢問約 14 小時要讀者自己減**

- 位置：中文附錄 F「10 月 9 日 06:44（UTC），作者詢問它與 Jev 是否類似；……Hsiao（2026）的研究在 10 月 8 日 16:22 公開，該研究作者的 Facebook 貼文在 10 月 9 日 16:16 發出，比本附錄的決定早 12 分鐘；本文作者在 10 月 10 日上午（河內時間）才看到這則貼文並得知該研究」。英文對應段同樣只把 12 分鐘算清楚。
- 問題：兩個時間點都在，細心的讀者可以判斷附錄 F 是否受其影響。論文沒有寫「設計不受影響」，也把時間來源標成工作紀錄。不對稱的是：貼文與決定的 12 分鐘寫明白了；repo 16:22（GitHub `created_at` 為 16:21:04Z）比 06:44 的詢問早約 14 小時 22 分，段落順序先寫完 10 月 9 日的詢問與決定，才補 Hsiao 的 10 月 8 日公開時間。掃過的讀者比較不容易看到「詢問時 repo 已經公開」。
- 證據：作者提供的時間線與 GitHub API `created_at` 相符。論文自己寫「這些時間來自作者的工作紀錄；git 紀錄只能證明附錄的文稿與程式寫在批次之後」。
- 建議修法：在 Hsiao 公開時間旁加一句，它早於 10 月 9 日 06:44 的詢問約 14 小時，與「早 12 分鐘」同一種算法。中英同步。不必加「因此設計獨立」這類句子。

**m2　英文「all four」前面的清單標點含糊**

- 位置：英文第 2 節 "It compared structured decision models, the Decisions API, Jev and Cloudflare's Clef and Clef-flash, in Traditional characters, Simplified characters and English, and found that all four moved toward the PRC position in Simplified characters"
- 問題：中文用「等結構化判斷模型」把四個名字收在類別底下，清楚。英文讀起來像把「structured decision models」當成清單第一項，後面再接 Decisions API、Jev、Clef 與 Clef-flash。「all four」仍對得上 Hsiao 的四個判斷模型，意思沒寫錯，只是英文比中文難讀。
- 證據：Hsiao README："We tested four of them"，名單為 Decisions API、Jev、Clef、Clef-flash，Haiku 5.5 是 control。
- 建議修法：改成 "four structured decision models (the Decisions API, Jev, and Cloudflare's Clef and Clef-flash)"。中文可維持。

**m3　討論「語言」段仍只引 Huang 與 Guey，最近、也最像的是 Hsiao**

- 位置：中文第 5 節「簡體中文降低了六個模型中五個的指數，與 Huang 等人（2025）及 Guey 等人（2025）的發現一致。」英文 "consistent with Huang et al. (2025) and Guey et al. (2025)"。
- 問題：Huang、Guey 談的是語言或 Mandarin。Hsiao 的自變項是同一句話的繁簡字形，受測對象含 Jev 與 Decisions API。第 2 節與附錄 F 已經引了 Hsiao；討論這一段是主分析語言效應最自然的對讀位置。不引也可以，讀者找得到第 2 節。引的時候必須把「字形」與本研究「三種語言各自撰寫」分開，否則會把 Hsiao 的 IV 讀成跟主分析同一件事。
- 證據：Hsiao README："the two differ only in script"；本研究第 3 節題目是三種語言各自撰寫，不是 OpenCC 轉換。
- 建議修法：在「語言」段加一句 Hsiao，並沿用附錄 F 那組限定（不同陳述、不同指數、該研究比字形）。摘要、第 6 節限制、第 7 節揭露不必加，理由見第 3 節。

## 3. 不需修改但值得記錄的觀察

描述整體公允。模型名單、逐字轉換、改寫自 Taiwan Sovereignty Benchmark、四個判斷模型在簡體下往 PRC 方向移動，都對得上 README。沒有把 Haiku 算進四個，也沒有貶低或誇大。CITATION.cff 的 `date-released` 是 2026-10-09，論文用 repo 公開日 10 月 8 日，與 GitHub `created_at` 一致。中文 README 署名蕭上農（Shang Nung Hsiao），本文中英都寫 Hsiao，與 Ko、Huang 同一套處理。

時間線夠讀者判斷，沒有超出工作紀錄的句子。「設計沒有因此調整」的「因此」指 5 題格式確認；「指令與程式沒有再修改」指中止到重跑；「才看到這則貼文並得知該研究」是作者對自己何時知道的陳述，標成工作紀錄。分析腳本寫在批次開始之後，與「指令沒改」不衝突。Facebook 貼文本輪無法獨立核對，論文沒有把它寫成 git 證據。

優先權：第 2 節寫 Hsiao 晚於草稿 0.7 至 0.9、早於附錄 F 批次，這兩句都成立。草稿 0.9.1 的 git 時間是 2026-10-08T14:49:45+07:00（07:49 UTC），也早於 Hsiao 的 16:22；相關研究沒寫 0.9.1，附錄 F 有寫它在 10 月 8 日公開。這是少寫，不是把後到的版本提前。Hsiao 的 Decisions API 結果公開在前，附錄 F 批次在後，論文沒有把附錄 F 寫成比較字形的先驅。摘要不必引 Hsiao：摘要報告本研究結果，塞進去會變成相互印證，篇幅也不夠寫尺度與對比差異。第 7 節是廠商利益衝突與審查程序，同時期獨立研究放在第 2 節與附錄 F 即可。限制第 4 條「其他題目可能得到不同的數值」可以指向 Hsiao，不是必須。

「方向一致」寫得克制。附錄 F 給 0.85／0.68，並標 −1 至 1；下一句就寫該研究比同一端點下的字形，本附錄比同一語言下的端點。Hsiao 的繁減簡也是 0.16，本研究簡中地位差也是 0.16，兩個 0.16 的尺度與對比都不同，論文沒有把它們對齊。Hsiao 的 Decisions API 簡體 0.68 在該尺度上仍偏台灣自主治理一側，「較偏向／closer to」是相對移動，與 README 的 "move toward" 同方向。

中英大意相同。相關研究談 Hsiao 時用「繁體字／簡體字／characters」，談本研究時用「繁體中文／簡體中文／Traditional Chinese」，這組用字把字形與語言分開了。中文「較偏向中國立場」與英文 related work 的 "moved toward the PRC position"、解讀的 "closer to the PRC position" 對得上；本文行文約定「中國」指中華人民共和國。台灣用語這一段沒有大陸用語問題。緒論仍寫判斷模型較少受到關注，相關研究已補 Hsiao，往下讀會接上。

Haiku 對照組（0.58／0.56／0.56，只差 0.05）與 28 句、18,225 次、10 月 8 日執行，相關研究一句話可以不寫。寫了會讓「四個」更好懂，也更接近 Hsiao 把決策模型與聊天模型分開的設計。

## 本文的回應（2026-10-12，草稿 0.10.1）

兩份第 9 輪報告（Codex、Grok）的回應合併於此表，兩個檔案附上同一份。

| 發現 | 處理 |
| --- | --- |
| 把 Hsiao（2026）放進相關研究同一段後，「四個面向延伸這些研究」的第一項（測試結構化判斷模型）不再成立，英文 "this work" 也可能被讀成延伸 Hsiao（Codex Major 1、Grok M1） | 採納。四項延伸改為限定「上述生成式模型的研究」；Hsiao（2026）移到該句之後另述，寫明兩者都評測結構化判斷模型，本研究另外並列主張、強迫選擇與實務標籤，比較日常用語與指名的「中國」，三種語言各自撰寫，附錄 F 比較兩種端點。刪除「獨立」二字，只寫公開日期與先後。 |
| 時間線混用執行程式、分析程式與 git 提交時間（Codex Major 2） | 採納。改寫為：依工作紀錄，首次中止到重新啟動前批次指令與執行程式都沒有變更；依作者陳述，作者在 10 月 10 日上午（UTC+7）得知該研究，之後在 12:16 UTC 重新發出同一行指令；分析程式於 12:18、批次仍在執行時寫成；git 只顯示提交晚於批次，無法證明首次寫成時間。整段標明 UTC。 |
| repo 早於作者詢問約 14 小時，沒有像「早 12 分鐘」那樣算出（Grok m1） | 採納，補上「比上述 10 月 9 日 06:44 的詢問早約 14 小時」。 |
| 「方向一致」應指明比較軸（Codex Minor 1） | 採納。改為兩者都觀察到同一 Decisions API 端點的繁體高於簡體（表 F1 為 0.83 對 0.66），只比較描述性方向，不比較數值或差距；補上 Index S 的 +1 代表與台灣自主治理一致。 |
| 英文 "all four" 前的清單標點含糊（Grok m2） | 採納，改為 "four structured decision models (the Decisions API, Jev, and Cloudflare's Clef and Clef-flash)"。 |
| 第 5 節「語言」段可引 Hsiao（Grok m3） | 採納，補一句並註明該研究比較同一陳述的字形，本研究三種語言的題目各自撰寫。 |
| 相關研究寫「晚於草稿 0.7 至 0.9」，0.9.1 也早於 Hsiao（Grok 觀察） | 採納，改為 0.7 至 0.9.1。 |
| 摘要、第 7 節、限制是否需要引用（兩份報告） | 不加。兩份報告都認為第 2 節、第 5 節與附錄 F 已足夠。 |

