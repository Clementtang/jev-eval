---
title: Auditing Language Models on Taiwan's Sovereignty
titleTemplate: false
description: An audit of TypeSafe Jev and five generative models on Taiwan's sovereignty with claims, forced choices and practical labels, which rank the models differently. Preprint, not peer reviewed.
aside: false
outline: false
---

<script setup>
import { withBase } from "vitepress";
</script>

# Claims, Choices and Labels

<p class="home-subtitle">How audits of language models on Taiwan's sovereignty rank models differently depending on the instrument</p>

<p class="home-meta">Hong-Rui (Clement) Tang (independent researcher, Hanoi, Vietnam) · Preprint draft 0.8, 6 October 2026 · Not peer reviewed</p>

We audit one structured decision model, TypeSafe Jev (jev-1.13.0), and five generative models (Claude Haiku 4.5, Claude Sonnet 5, Grok 4.7, GPT-6 Luna and GPT-6 Sol) on Taiwan's sovereignty with three instruments: yes or no claims, forced-choice stance questions and practical labeling tasks, each in Traditional Chinese, Simplified Chinese and English. We analyze 26,796 calls.

On the claims, Jev's status index is lower than every generative model's in every language (the gap to Claude Haiku 4.5 is not statistically significant). In practical labeling, Jev never chose a label that lists Taiwan under "China" in the original option order, while Claude Sonnet 5 did so in 42% of Simplified Chinese trials. Which task an audit measures decides which of the two looks closer to the PRC position.

## Main results

<table class="result-table">
  <thead>
    <tr><th rowspan="2">Model</th><th colspan="3">Status index</th><th>Taiwan listed under China</th></tr>
    <tr><th>Traditional Chinese</th><th>Simplified Chinese</th><th>English</th><th>Simplified Chinese</th></tr>
  </thead>
  <tbody>
    <tr class="jev"><td>Jev</td><td class="num">0.40</td><td class="num low">0.26 *</td><td class="num">0.40</td><td class="num">0%</td></tr>
    <tr><td>Claude Haiku 4.5</td><td class="num">0.62</td><td class="num">0.52</td><td class="num">0.59</td><td class="num">0%</td></tr>
    <tr><td>Claude Sonnet 5</td><td class="num high">0.77 *</td><td class="num">0.58</td><td class="num high">0.75 *</td><td class="num low">42%</td></tr>
    <tr><td>Grok 4.7</td><td class="num high">0.82 *</td><td class="num high">0.74 *</td><td class="num high">0.82 *</td><td class="num">6%</td></tr>
    <tr><td>GPT-6 Luna</td><td class="num high">0.86 *</td><td class="num high">0.82 *</td><td class="num high">0.84 *</td><td class="num">0%</td></tr>
    <tr><td>GPT-6 Sol</td><td class="num high">0.91 *</td><td class="num high">0.82 *</td><td class="num high">0.89 *</td><td class="num">0%</td></tr>
  </tbody>
</table>

<p class="table-note">The status index averages twelve equally weighted claims about sovereignty, legitimacy and legal relations. 0 means full agreement with the PRC position, 0.5 is neutral and 1 means full agreement that Taiwan or the ROC is a separate sovereign state. An asterisk marks a significant difference from 0.5 under the exact sign-flip test with Holm correction; Jev's Simplified Chinese value is not significant after correction across all claim sets, and the paper treats it as exploratory. The label column is the share of trials, over twelve form-filling scenarios in the original option order, in which the model chose a label that lists Taiwan under "China". For 95% intervals and the full tests see Table 3 of the paper and <a href="https://github.com/Clementtang/jev-eval/blob/main/results/stats.md">results/stats.md</a>.</p>

Jev was also the fastest and cheapest of the six models: a median latency of 267 ms on the base items and about USD 0.013 per 1,000 calls (measured from Hanoi, network round trip included).

## Read and explore

<ul class="link-list">
  <li><a :href="withBase('/en/paper')">Full paper</a><span class="desc">Method, all results, limitations and the revisions after six adversarial review rounds. Also available in <a :href="withBase('/paper')">Traditional Chinese</a>.</span></li>
  <li><a :href="withBase('/en/explore')">Item browser</a><span class="desc">All 957 items in three languages with the six models' results on each, searchable and filterable, with a link for every item.</span></li>
  <li><a :href="withBase('/en/lab')">Sensitivity lab</a><span class="desc">Choose which claims enter the index and recompute it for the six models, with 95% bootstrap intervals.</span></li>
  <li><a :href="withBase('/replay/stance.html')" target="_self">Replay: stance comparison</a><span class="desc">The six models' judgments on the same question, played chapter by chapter. Best viewed on a landscape desktop screen; on a phone, open the <a :href="withBase('/replay/stance.html?layout=portrait&cut=short')" target="_self">portrait short cut</a>. Interface in Traditional Chinese.</span></li>
  <li><a :href="withBase('/replay/race.html')" target="_self">Replay: speed race</a><span class="desc">Every call replayed at its measured latency, comparing how long and how much each model takes to answer the item set. Interface in Traditional Chinese.</span></li>
  <li><a href="https://github.com/Clementtang/jev-eval">GitHub repository</a><span class="desc">Item generator, analysis scripts and the replay source.</span></li>
  <li><a href="https://github.com/Clementtang/jev-eval/tree/main/results/runs">Raw data</a><span class="desc">The raw record of every model call (JSONL), plus the <a href="https://github.com/Clementtang/jev-eval/blob/main/data/dataset.json">item set</a> and the <a href="https://github.com/Clementtang/jev-eval/blob/main/results/stats.md">statistical output</a>.</span></li>
  <li><a :href="withBase('/data/summary.json')" target="_self">Summary results (JSON)</a><span class="desc">Indices with 95% bootstrap intervals, neutrality tests, label rates, latency and cost, with a schema field describing every key. For programs and AI agents there is also <a :href="withBase('/llms.txt')" target="_self">llms.txt</a>, the paper as Markdown (<a :href="withBase('/en/paper.md')" target="_self">English</a>, <a :href="withBase('/paper.md')" target="_self">Traditional Chinese</a>) and <a href="https://github.com/Clementtang/jev-eval/blob/main/CITATION.cff">CITATION.cff</a>.</span></li>
  <li><a href="https://github.com/Clementtang/jev-eval/blob/main/results/addendum.md">Appendix C: Claude Sonnet 5.5</a><span class="desc">Outside the main analysis, Claude Sonnet 5.5 was tested on 29 September 2026 beside a same-day rerun of Claude Sonnet 5, which separates the change of model version from the change of run date; the main analysis is unchanged. Machine-readable data in <a :href="withBase('/data/addendum.json')" target="_self">addendum.json</a>; the item browser and the sensitivity lab can show the addendum models.</span></li>
  <li><a href="https://github.com/Clementtang/jev-eval/blob/main/results/appendix-d.md">Appendix D: GPT-6.1 Sol</a><span class="desc">GPT-6.1 Sol, which OpenAI released the same day as Claude Sonnet 5.5, was tested on 1 October 2026 beside a same-day rerun of GPT-6 Sol and showed no discernible difference from its predecessor. Machine-readable data in <a :href="withBase('/data/appendix-d.json')" target="_self">appendix-d.json</a>; the item browser, the sensitivity lab and the replays can show these models.</span></li>
</ul>

## License

The paper, items and results are licensed under <a href="https://creativecommons.org/licenses/by/4.0/">CC BY 4.0</a>: reuse, adaptation and redistribution are allowed with attribution. The code is licensed under <a href="https://github.com/Clementtang/jev-eval/blob/main/LICENSE">MIT</a>. Third-party material cited in the paper remains under the terms of its original source.

<p class="table-note">Items, code, statistical analysis and the paper were drafted with the help of Claude (Anthropic), and two Claude models are among those tested. The author has no financial relationship with TypeSafe, Anthropic, xAI or OpenAI and paid for all API usage.</p>
