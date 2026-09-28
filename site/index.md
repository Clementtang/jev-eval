---
title: 語言模型台灣主權立場稽核
titleTemplate: false
description: 以主張、強迫選擇與實務標籤三種工具，稽核 TypeSafe Jev 與五個生成式模型在台灣主權議題上的判斷，得到不同的模型排序。預印本，未經同儕審查。
aside: false
outline: false
---

<script setup>
import { withBase } from "vitepress";
</script>

# 主張、選擇與標籤

<p class="home-subtitle">以不同量測工具稽核語言模型的台灣主權立場，會得到不同的模型排序</p>

<p class="home-meta">Clement Tang（獨立研究者，越南河內）｜預印本草稿 0.6，2026 年 9 月 28 日｜未經同儕審查</p>

本研究以是非題主張、強迫選擇與實務標籤三種工具，稽核結構化判斷模型 TypeSafe Jev（jev-1.13.0）與五個生成式模型（Claude Haiku 4.5、Claude Sonnet 5、Grok 4.7、GPT-6 Luna、GPT-6 Sol）在台灣主權議題上的判斷。題目有繁體中文、簡體中文與英文版本，共分析 26,796 次呼叫。

在主張上，Jev 的地位指數在每一種語言都低於每一個生成式模型；在實務標籤上，Jev 在原始選項順序下從未選擇把台灣列在「China」之下的標籤，Claude Sonnet 5 則在 42% 的簡體中文試驗中如此標註。稽核哪一種任務，決定了 Jev 與 Claude Sonnet 5 之中哪一個看起來較接近中華人民共和國的立場。

## 主要結果

<table class="result-table">
  <thead>
    <tr><th rowspan="2">模型</th><th colspan="3">地位指數</th><th>標籤列於 China 之下</th></tr>
    <tr><th>繁體中文</th><th>簡體中文</th><th>英文</th><th>簡體中文</th></tr>
  </thead>
  <tbody>
    <tr class="jev"><td>Jev</td><td class="num low">0.40</td><td class="num low">0.26 *</td><td class="num low">0.40</td><td class="num">0%</td></tr>
    <tr><td>Claude Haiku 4.5</td><td class="num">0.62</td><td class="num">0.52</td><td class="num">0.59</td><td class="num">0%</td></tr>
    <tr><td>Claude Sonnet 5</td><td class="num high">0.77 *</td><td class="num">0.58</td><td class="num high">0.75 *</td><td class="num low">42%</td></tr>
    <tr><td>Grok 4.7</td><td class="num high">0.82 *</td><td class="num high">0.74 *</td><td class="num high">0.82 *</td><td class="num">6%</td></tr>
    <tr><td>GPT-6 Luna</td><td class="num high">0.86 *</td><td class="num high">0.82 *</td><td class="num high">0.84 *</td><td class="num">0%</td></tr>
    <tr><td>GPT-6 Sol</td><td class="num high">0.91 *</td><td class="num high">0.82 *</td><td class="num high">0.89 *</td><td class="num">0%</td></tr>
  </tbody>
</table>

<p class="table-note">地位指數由十二個關於主權、正當性與法律關係的主張組成，每個主張等權。0 代表完全同意中華人民共和國的立場，0.5 為中立，1 代表完全同意台灣或中華民國是獨立的主權國家。星號表示在精確符號翻轉檢定加 Holm 校正後與 0.5 有顯著差異；Jev 簡體中文的結果在跨所有主張集合校正後不顯著，論文視為探索性結果。標籤欄是十二個填表情境、原始選項順序下，模型選擇把台灣列在「China」之下之標籤的試驗比例。95% 區間與完整檢定見論文表 3 與 <a href="https://github.com/Clementtang/jev-eval/blob/main/results/stats.md">results/stats.md</a>。</p>

Jev 也是六個模型中回應最快、成本最低的：基準題延遲中位數 267 毫秒，每 1,000 次呼叫約 0.013 美元（河內實測，含網路往返）。

## 閱讀與資料

<ul class="link-list">
  <li><a :href="withBase('/paper')">論文全文</a><span class="desc">研究方法、全部結果、研究限制與四輪對抗式審查後的修訂。另有<a :href="withBase('/en/paper')">英文版</a>。</span></li>
  <li><a :href="withBase('/replay/stance.html')" target="_self">互動重播：同題對照</a><span class="desc">六個模型對同一題的判斷，依章節逐題播放。桌機橫向瀏覽；手機請改看<a :href="withBase('/replay/stance.html?layout=portrait&cut=short')" target="_self">直式短版</a>。</span></li>
  <li><a :href="withBase('/replay/race.html')" target="_self">互動重播：速度對照</a><span class="desc">以實測延遲重播每一次呼叫，比較六個模型答完題庫所需的時間與成本。</span></li>
  <li><a href="https://github.com/Clementtang/jev-eval">GitHub repo</a><span class="desc">題庫產生程式、分析腳本與重播頁的原始碼。</span></li>
  <li><a href="https://github.com/Clementtang/jev-eval/tree/main/results/runs">原始資料</a><span class="desc">每一次模型呼叫的原始紀錄（JSONL），以及<a href="https://github.com/Clementtang/jev-eval/blob/main/data/dataset.json">題庫</a>與<a href="https://github.com/Clementtang/jev-eval/blob/main/results/stats.md">統計輸出</a>。</span></li>
</ul>

<p class="table-note">題目生成、程式、統計分析與論文撰寫由 Claude（Anthropic）協助完成，受測模型包含兩個 Claude 模型。作者與 TypeSafe、Anthropic、xAI、OpenAI 均無財務關係，API 費用自付。</p>
