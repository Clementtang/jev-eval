---
title: Sensitivity lab
description: Choose which claims enter the status index and recompute it for six models in three languages, with 95% bootstrap intervals.
aside: false
outline: false
pageClass: tool-page
---

# Sensitivity lab

The paper's main analysis builds a status index from twelve status claims and reports the three city claims as a separate place index. That split was adopted after the results were seen, and other reasonable sets of claims could give different values. On this page you choose the claims that enter the index, decide whether to merge closely related claims, and see at once the index for six models in three languages and how Jev compares with each model.

The calculation runs in your browser with the same direction coding, bootstrap algorithm, seeds and number of resamples as `scripts/stats.mjs`, taking the per-claim agreement in [results/summary.json](https://github.com/Clementtang/jev-eval/blob/main/results/summary.json) as input. With the paper's main set selected, the values match Table 3 of the paper.

<SensitivityLab locale="en" />
