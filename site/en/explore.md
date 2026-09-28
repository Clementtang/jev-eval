---
title: Item browser
description: Every one of the study's 957 items in three languages, with each model's aggregated answers.
aside: false
outline: false
pageClass: tool-page
---

# Item browser

This page lists all 957 items used in the study: 139 base item types, each in Traditional Chinese, Simplified Chinese and English, plus option-order and asker variants. Open an item to see its wording side by side in the three languages, the six models' results in every language and variant, and a link you can share.

<div class="tool-notes">

- **Agreement**: for one claim, the mean probability of the positive sentence p<sub>pos</sub> and of the negated sentence p<sub>neg</sub> combine into (p<sub>pos</sub> + 1 − p<sub>neg</sub>) / 2. 1 means full agreement with the statement, 0 full disagreement and 0.5 neutral. The positive and the negated sentence show the same agreement.
- **Colours**: claims that enter an index are coloured by the researcher's coding of their direction. Green leans toward Taiwan or the ROC being a sovereign state, pink toward the position of the People's Republic of China, and grey is neutral. The direction is a researcher judgement, defined in [section 3.3 of the paper](./paper#_3-3-measures). Yes or no items outside the indices are shaded in grey by agreement only. Options of choice items about Taiwan use the same coding; options about other regions are grey.
- **Where the probabilities come from**: Jev is a structured decision model and outputs a probability directly; the generative models report a probability in their answer. The two are on different scales, so compare direction across models, not the size of differences.
- Values aggregate every successful call in [results/runs](https://github.com/Clementtang/jev-eval/tree/main/results/runs), the same records the paper and the statistics use.

</div>

<ItemExplorer locale="en" />
