---
title: 敏感度實驗室
description: 自行選擇哪些主張計入地位指數，即時重算六個模型在三種語言的指數與 95% bootstrap 區間。
aside: false
outline: false
pageClass: tool-page
---

# 敏感度實驗室

論文的主分析以 12 個地位主張組成地位指數，三個城市主張另成地點指數。這個分拆是看過結果之後才採用的，其他合理的主張組合也可能得到不同的數值。本頁讓讀者自行勾選要計入指數的主張、決定是否合併高度相關的主張，並立即看到六個模型在三種語言的指數，以及 Jev 與每個模型的比較。

計算在瀏覽器中執行，使用與 `scripts/stats.mjs` 相同的方向編碼、bootstrap 演算法、種子與重抽次數，輸入為 [results/summary.json](https://github.com/Clementtang/jev-eval/blob/main/results/summary.json) 中各主張的同意度。選擇論文主分析時，數值與論文表 3 相同。

<SensitivityLab locale="zh" />
