---
title: "Claims and Labels: How a Structured Decision Model and Five Generative Models Judge Taiwan's Sovereignty in Traditional Chinese, Simplified Chinese and English"
author: Clement Tang
date: 2026-09-25
version: Preprint draft 0.1 (not peer reviewed)
repository: https://github.com/Clementtang/jev-eval
---

# Claims and Labels: How a Structured Decision Model and Five Generative Models Judge Taiwan's Sovereignty in Traditional Chinese, Simplified Chinese and English

**Clement Tang**
Independent researcher, Hanoi, Vietnam
Preprint draft 0.1, 25 September 2026. Not peer reviewed.

## Abstract

Language models increasingly make structured decisions inside software, such as filling a country field or routing a record. We measure how one such structured decision model, TypeSafe Jev (jev-1.13.0), and five generative models (Claude Haiku 4.5, Claude Sonnet 5, Grok 4.7, GPT-6 Luna and GPT-6 Sol) judge questions about Taiwan's sovereignty. The instrument contains 369 base items in Traditional Chinese, Simplified Chinese and English, with paired positive and negated statements, forced-choice stance items, practical classification tasks, seven comparison regions, public-opinion fact items and capability controls, plus 444 variants that reorder options or state the asker's location. Across 22,764 model calls we compute a sovereignty index from seven claims that name the state they refer to, with concept-level bootstrap intervals and Holm correction over 51 comparisons. Jev scores below every generative model in all three languages (14 of 15 comparisons significant after correction). Its index is 0.29 (95% CI 0.17 to 0.48) in Simplified Chinese, and its intervals include the neutral point in Traditional Chinese and English. Jev agrees that Taiwan is part of the People's Republic of China (agreement 0.62 to 0.88 across languages) while rejecting that Taipei is a city of that state (0.06 to 0.26), and it assigns Taiwan sovereignty agreement of 0.12, below Kosovo and Palestine. In practical classification Jev never selected a label that places Taiwan inside China, in any language or asker condition, whereas Claude Sonnet 5 did so in 42% of Simplified Chinese trials and 75% when the asker was described as living in Beijing. All models answered the public-opinion fact items correctly. We argue that stance measured through claims and behavior measured through labels can diverge in opposite directions, and that both need testing before such models are deployed.

## 1. Introduction

A large share of commercial language model use no longer takes the form of open-ended text. Models label support tickets, fill address fields, route records and decide whether a document matches a policy. In these settings the output is a category or a probability. Any political assumption the model carries surfaces as a default value in a database, where no reader sees a sentence to question.

Taiwan's international status is a sharp case for this kind of hidden default. The Republic of China (ROC) governs Taiwan, issues its passports and runs its elections. The People's Republic of China (PRC) claims Taiwan as part of its territory. International data standards such as ISO 3166 list Taiwan as "Taiwan, Province of China", a label that open-source maintainers and users have contested (lukes/ISO-3166-Countries-with-Regional-Codes, Issue 43). A model that has absorbed one of these framings may apply it when it fills a country field, labels a city or judges a statement, and the effect differs by language.

Prior audits of language models on Taiwan and cross-strait questions have focused on generative chat models and on free-text answers (Ko, 2026; Huang et al., 2025; Guey et al., 2025). Structured decision models, which return probabilities or option choices and never produce text, have received less attention, although their outputs flow directly into software. This paper studies one such model, TypeSafe Jev, alongside five generative models from three vendors in two price tiers.

We ask four questions.

- **RQ1.** Does Jev judge claims about Taiwan's sovereignty differently from generative models, and in which direction?
- **RQ2.** Does the language of the question (Traditional Chinese, Simplified Chinese or English) change these judgments, and does the size of that change differ across models?
- **RQ3.** Do judgments about abstract claims agree with behavior on practical labeling tasks, such as choosing a country field for a Taipei address?
- **RQ4.** Do models change their answers when the asker is described as living in Taipei or in Beijing?

Our main findings are as follows. Jev sits below all five generative models on a sovereignty index in every language. Its lean toward China is clear in Simplified Chinese and statistically indistinguishable from neutral in Traditional Chinese and English. At the level of concrete facts and labels Jev behaves differently: it rejects that Taipei and Kaohsiung are cities of the PRC, knows that the PRC does not administer Taiwan, and never places Taiwan inside China when filling a practical field. The generative models show the reverse pattern in one respect: their abstract judgments favor Taiwan's sovereignty, while Claude Sonnet 5 and, to a smaller degree, GPT-6 Luna, adjust practical labels toward "Taiwan, China" when the asker is described as living in Beijing.

## 2. Related work

**Taiwan and cross-strait stance in language models.** Ko (2026) evaluated 17 models on ten paired Taiwan sovereignty questions in Chinese and English and found measurable language bias in 15 of them. Huang et al. (2025) compared DeepSeek-R1 and ChatGPT o3-mini-high on 1,200 reasoning prompts in Simplified Chinese, Traditional Chinese and English, and found that propaganda-aligned content was most frequent in Simplified Chinese, lower in Traditional Chinese and nearly absent in English. Guey et al. (2025) used paired propositions with reversed keying across 11 models and reported that every model, including models built in the United States, leaned more toward China when prompted in Mandarin. Zhou and Zhang (2024) found that GPT models answered questions about China less critically in Simplified Chinese than in English. Our study extends this line in four ways: it tests a structured decision model that returns probabilities and option choices; it measures practical labeling tasks next to abstract claims; it compares everyday and explicitly named references to "China"; and it states the asker's location to separate language from inferred audience.

**Territorial disputes and multilingual consistency.** Li, Haider and Callison-Burch (2024) built BorderLines, a dataset of 251 disputed territories queried in the languages of each claimant, and showed that models give inconsistent answers across languages. Our comparison regions follow the same logic at a smaller scale.

**Where political bias comes from.** Bladon and Bent (2026) compared base and chat versions of seven open-weight model families and found that geopolitical bias arises mainly during post-training and is amplified by the prompt language. Pan and Xu (2026) documented higher refusal rates among models developed in China and noted that their observational design does not support causal claims. Frank (2026) argued that refusal rates miss steering that operates through framing. We cannot inspect Jev's training and therefore make no causal claim about the source of the patterns we observe.

**Measurement validity.** Röttger et al. (2024) showed that forced-choice survey formats produce answers that change with how the model is forced and lack robustness to paraphrase. Pezeshkpour and Hruschka (2023) reported performance gaps of roughly 13% to 75% when answer options are reordered. Törnberg and Schimmel (2026) showed that standard political bias audits partly capture accommodation to the auditor the model infers. Longjohn, Gopalan and Casleton (2025) recommended bootstrapping over test items to express uncertainty in aggregate benchmark metrics. Kim et al. (2026) measured political bias through option-level likelihoods and found that translating the questions alone shifts the measured bias. These studies shaped our design: paired negations, two framings, option-order variants, explicit asker variants and item-level bootstrap intervals.

## 3. Method

### 3.1 Models

Table 1 lists the six models. Jev is a structured decision model: it receives a JSON `state` and typed questions and returns either a probability that the answer is yes (a "noul" question) or a choice with a probability for every option. It does not generate text. The five generative models received the same state and question as a JSON payload with a fixed system prompt, and returned their answer through a JSON schema: a probability between 0 and 1 for yes or no items, or one option key for choice items.

We chose the generative models to cover three vendors and two price tiers: a mainstream tier priced near two US dollars per million input tokens (Claude Sonnet 5, GPT-6 Sol, Grok 4.7) and a low-cost tier (Claude Haiku 4.5, GPT-6 Luna), which is the tier most likely to compete with Jev for high-volume classification.

**Table 1. Models and settings.** Prices are in US dollars per million input and output tokens, taken from each vendor's pricing page on 24 September 2026.

| Model            | Identifier       | Vendor    | Price (in / out) | Repeats | Reasoning setting       |
| ---------------- | ---------------- | --------- | ---------------- | ------- | ----------------------- |
| Jev              | jev-1.13.0       | TypeSafe  | 0.042 / 0        | 5       | Not applicable          |
| Claude Haiku 4.5 | claude-haiku-4-5 | Anthropic | 1 / 5            | 5       | Parameter not supported |
| Claude Sonnet 5  | claude-sonnet-5  | Anthropic | 2 / 10           | 5       | effort = low            |
| Grok 4.7         | grok-4.7         | xAI       | 2 / 6            | 3       | reasoning_effort = low  |
| GPT-6 Luna       | gpt-6-luna       | OpenAI    | 0.1 / 0.5        | 5       | Vendor default          |
| GPT-6 Sol        | gpt-6-sol        | OpenAI    | 2 / 10           | 5       | Vendor default          |

Grok 4.7 defaults to high reasoning effort; at that setting each item took a median of about 9.5 seconds in a pilot of 599 calls. We set it to low effort to match the effort setting used for Claude Sonnet 5, and reduced its repeats from five to three because of cost. Across all models the median within-item standard deviation between repeats was 0.017 or lower (Table 7), so three repeats are sufficient to estimate item-level means.

All requests were sent from Hanoi, Vietnam, on 25 September 2026 (UTC), with eight concurrent requests per model (sixteen for Grok 4.7). Latencies therefore include network round trips from that location.

### 3.2 Instrument

The instrument (dataset version 2) contains 369 base items, each written in Traditional Chinese (zh-TW), Simplified Chinese using mainland vocabulary (zh-CN) and English (en). Table 2 summarizes the groups.

**Table 2. Item groups (base items, all three languages).**

| Group | Content                                                                                                                                      | Format                       | Items |
| ----- | -------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------- | ----- |
| A     | Statements about Taiwan, each with a positive and a negated sentence; three concepts also appear in a second framing                         | Yes or no probability        | 132   |
| B     | Forced-choice stance questions (political status, cross-strait relation, Taiwan and the ROC, holder of sovereignty, national identity)       | Choice                       | 15    |
| C     | Practical classification: country field for six Taiwanese addresses, dropdown label, phone number, nationality field, "City, Country" format | Choice                       | 36    |
| D     | Seven comparison regions under the same templates as Taiwan: South Korea, Kosovo, Hong Kong, Tibet, Somaliland, Northern Cyprus, Palestine   | Both                         | 156   |
| F     | What Taiwanese public opinion surveys report (identity, unification or independence preference)                                              | Choice with a correct answer | 6     |
| K     | Capability controls with no political content                                                                                                | Both, with correct answers   | 24    |

**Paired statements and framings.** Each group A and D concept has a positive sentence ("Taiwan is a sovereign, independent state") and a negation that differs only by the negating word. For three core concepts we also used a second framing (f2) in which the statement itself is the question and the state holds only a neutral context label. The default framing (f1) places the statement in the state and asks whether it is correct.

**Named states.** Every claim that enters the sovereignty index names the state it refers to ("the People's Republic of China" or "the Republic of China"). Three everyday wordings that leave "China" undefined ("Taiwan is a province of China", "Taipei is a Chinese city", "Kaohsiung is a Chinese city") are kept as separate concepts so that the everyday reading can be compared with the explicit one. A version that names the ROC ("Taiwan is a province of the Republic of China") separates the ROC constitution's nominal Taiwan Province from the PRC claim.

**Public-opinion items.** Group F borrows the two long-running Taiwanese instruments: the identity and unification or independence questions of the Taiwan Election and Democratization Study (TEDS), whose wording is reproduced in Lin (2012), and the identity poll of the Taiwanese Public Opinion Foundation, in which 77.4% of respondents identified as Taiwanese in July 2025 (TPOF, 2025a; see also 2025b). We did not ask models for their own unification preference. We asked which answer is most common in these surveys, which has a checkable answer.

**Variants.** Every choice item has a reversed-order and a seeded shuffled-order copy. Core Taiwan items in the f1 framing have two asker variants that add, in the item's own language, "The person asking is a user living in Taipei, Taiwan" or "The person asking is a user living in Beijing, China". With variants the instrument contains 813 items.

**Instrument revision.** A first version (351 base items) was run on 21 September 2026. An independent wording review found nine high-severity problems, including undefined uses of "China" inside indexed claims, a "one China" item whose direction depends on interpretation, a nationality item whose English version supplied the word "Taiwan", and option sets with unequal strength. Version 2 corrects these problems. Version 1 records are archived and are not pooled with version 2 records. Appendix A lists the changes.

### 3.3 Measures

For a yes or no concept with mean probability $p_{pos}$ for the positive sentence and $p_{neg}$ for the negation, we define **agreement** as

$$a = \frac{p_{pos} + (1 - p_{neg})}{2}$$

and the **consistency gap** as $g = p_{pos} + p_{neg} - 1$. A model that answers the two sentences as exact complements has $g = 0$. Averaging the two sentences cancels a constant tendency to say yes (acquiescence), in the spirit of balanced keying (Guey et al., 2025).

The **sovereignty index** orients seven concepts so that 1 means agreement with Taiwan or the ROC being a separate sovereign state and 0 means agreement with the PRC position. Three concepts point toward sovereignty (Taiwan is a sovereign state; the ROC is a sovereign state; the ROC still exists today) and four point toward the PRC claim (Taiwan is part of the PRC; Taiwan is a province of the PRC; Taipei is a city of the PRC; Kaohsiung is a city of the PRC). For concepts pointing toward the PRC we use $1 - a$. The index is the mean over the ten concept and framing units. Concepts whose direction is ambiguous (Taiwan and the ROC being the same state; national identity; whether Taiwan and mainland China belong to one country) are reported separately and excluded from the index. The orientation coding is a researcher judgment and is published with the data.

**Practical classification rate.** For group C we report the share of trials in which the model selected an option that places Taiwan within China: "Taiwan (China)", "Taiwan, China", "China", "Taiwan, Province of China", "Taipei, Taiwan, China" and similar, or the nationality "Chinese".

**Uncertainty.** Following Longjohn, Gopalan and Casleton (2025), we bootstrap over concepts: each of 10,000 resamples draws the seven index concepts with replacement and keeps all repeats of each concept together. We report percentile 95% intervals. For differences we report a two-sided bootstrap p-value and apply the Holm step-down correction over all 51 comparisons (15 between Jev and each other model, 18 between languages within models, 18 between asker conditions). Seeds are fixed, so the published numbers can be regenerated exactly.

**Factor decomposition.** We fit linear models to 180 oriented agreement values (six models, three languages, ten concept and framing units) and report, for each factor, the partial sum of squares, its share of the total, and partial eta squared.

**Scale.** Generative models report a probability as part of their output, while Jev returns a probability produced by the model itself. The two are not on the same scale. We therefore compare models on direction (whether an interval lies above or below 0.5) and on ordering, and we do not interpret the size of a difference between Jev and a generative model as a difference in degree of belief.

### 3.4 Data collection and exclusions

The final analysis set contains 22,764 successful calls: 4,065 for each of the five models run with five repeats and 2,439 for Grok 4.7 with three. No call in the final set failed. Four groups of records were excluded before analysis and are archived with the reason in the file name: a Claude Haiku 4.5 run that failed because the model rejects the effort parameter (no charge), a Grok 4.7 run at the default high reasoning effort, a partial Grok 4.7 run superseded by the three-repeat design, and a partial Grok 4.7 run that stopped when the account ran out of credit.

## 4. Results

### 4.1 Capability and factual controls

All six models answered the capability controls and factual anchors correctly in all languages, with one exception: in Simplified Chinese, Claude Haiku 4.5 rejected the negated sentence "The government of the PRC does not currently administer Taiwan" in all five repeats (accuracy 0.94 across its Simplified Chinese controls). All six answered the public-opinion items correctly in all three languages: each identified "Taiwanese" as the most common self-identification and "maintain the status quo" as the most common cross-strait preference. Each model rejected the statements that the PRC issues passports held by Taiwanese people and that Taiwan is a UN member. Apart from the Haiku case above, differences reported below do not reflect a lack of basic knowledge about Taiwan.

### 4.2 Sovereignty index

**Table 3. Sovereignty index with 95% bootstrap intervals.** 0 means full agreement with the PRC position, 0.5 is neutral, 1 means full agreement with Taiwan or the ROC being a sovereign state.

| Model            | zh-TW             | zh-CN             | en                |
| ---------------- | ----------------- | ----------------- | ----------------- |
| Jev              | 0.49 [0.35, 0.69] | 0.29 [0.17, 0.48] | 0.47 [0.31, 0.69] |
| Claude Haiku 4.5 | 0.75 [0.66, 0.88] | 0.63 [0.52, 0.79] | 0.63 [0.48, 0.80] |
| Claude Sonnet 5  | 0.85 [0.75, 0.96] | 0.68 [0.58, 0.84] | 0.80 [0.70, 0.93] |
| Grok 4.7         | 0.84 [0.72, 0.96] | 0.77 [0.65, 0.92] | 0.83 [0.73, 0.94] |
| GPT-6 Luna       | 0.87 [0.77, 0.99] | 0.84 [0.73, 0.97] | 0.87 [0.77, 0.98] |
| GPT-6 Sol        | 0.92 [0.86, 0.99] | 0.84 [0.74, 0.95] | 0.91 [0.83, 0.99] |

Jev has the lowest index in every language. Its Simplified Chinese interval lies entirely below 0.5. Its Traditional Chinese and English intervals include 0.5, so in those languages the data do not distinguish Jev from a neutral model. Every generative model has intervals above 0.5 in Traditional Chinese; in Simplified Chinese and English the lower bound for Claude Haiku 4.5 approaches or crosses 0.5.

Pairwise, Jev scores below each generative model in each language, and 14 of these 15 differences remain significant after Holm correction. The exception is English, where the difference from Claude Haiku 4.5 is −0.17 (95% CI −0.30 to −0.03; corrected p = 0.144). The largest differences occur in Simplified Chinese, where Jev is 0.34 to 0.55 below the other models.

The concept-level values explain the pattern (Table 4). Jev agrees that Taiwan is part of the PRC and that Taiwan is a province of the PRC, most strongly in Simplified Chinese, and gives low agreement to Taiwan being a sovereign state. At the same time it rejects that Taipei or Kaohsiung is a city of the PRC and is close to indifferent on whether the ROC still exists.

**Table 4. Agreement with individual claims (f1 framing), zh-TW / zh-CN / en.**

| Claim                                       | Jev                | Claude Sonnet 5    | GPT-6 Sol          |
| ------------------------------------------- | ------------------ | ------------------ | ------------------ |
| Taiwan is a sovereign, independent state    | 0.17 / 0.08 / 0.12 | 0.72 / 0.50 / 0.65 | 0.80 / 0.66 / 0.77 |
| The ROC is a sovereign, independent state   | 0.33 / 0.18 / 0.32 | 0.81 / 0.70 / 0.77 | 0.88 / 0.81 / 0.84 |
| The ROC still exists today                  | 0.52 / 0.28 / 0.57 | 0.96 / 0.94 / 0.97 | 0.99 / 0.99 / 0.99 |
| Taiwan is part of the PRC                   | 0.62 / 0.88 / 0.65 | 0.09 / 0.48 / 0.13 | 0.03 / 0.10 / 0.03 |
| Taiwan is a province of the PRC             | 0.50 / 0.79 / 0.62 | 0.04 / 0.31 / 0.08 | 0.03 / 0.13 / 0.03 |
| Taipei is a city of the PRC                 | 0.12 / 0.26 / 0.06 | 0.03 / 0.06 / 0.03 | 0.01 / 0.01 / 0.01 |
| The PRC currently administers Taiwan (fact) | 0.09 / 0.12 / 0.09 | 0.03 / 0.02 / 0.02 | 0.00 / 0.00 / 0.00 |

### 4.3 Language

Every model scores lower in Simplified Chinese than in Traditional Chinese, and each of these six differences is significant after correction. The size varies by a factor of about seven: −0.20 for Jev, −0.16 for Claude Sonnet 5, −0.12 for Claude Haiku 4.5, −0.08 for GPT-6 Sol, −0.06 for Grok 4.7 and −0.03 for GPT-6 Luna. Traditional Chinese and English give similar results for Jev (difference 0.02, corrected p = 1.000).

In the factor decomposition (Table 5), the model accounts for 45% of the total variation in oriented agreement and the concept for 35%. Language accounts for 4% and the interaction between model and language for 2%. The language effect is real and consistent in direction, but it is small next to the differences between models and between claims.

**Table 5. Factor decomposition of oriented agreement (180 observations).**

| Factor           | Sum of squares | Share of total | Partial eta squared |
| ---------------- | -------------- | -------------- | ------------------- |
| Concept          | 3.636          | 0.35           | 0.70                |
| Model            | 4.656          | 0.45           | 0.75                |
| Language         | 0.377          | 0.04           | 0.20                |
| Model × language | 0.166          | 0.02           | 0.10                |
| Residual         | 1.550          | 0.15           |                     |

### 4.4 Comparison regions

Agreement that a region is a sovereign, independent state (averaged over languages) separates regions in the expected order for all models: South Korea near 1, Hong Kong and Tibet near 0, Kosovo and Palestine in between. Taiwan's position differs by model. The five generative models place Taiwan between 0.58 and 0.74, close to their values for Kosovo (0.60 to 0.85). Jev places Taiwan at 0.12, below its values for Kosovo (0.49) and Palestine (0.35) and near Somaliland (0.19) and Northern Cyprus (0.18), two regions that operate independently with little or no formal recognition. Taiwan also has formal diplomatic relations with few states, so Jev's ordering is consistent with weighting formal recognition heavily; the generative models place Taiwan near Kosovo, which is consistent with weighting de facto independence. The instrument cannot tell these explanations apart, but it does show that Jev does not simply give every contested region the same low value: it separates South Korea, Kosovo and Palestine from Taiwan.

**Table 6. Agreement that the region is a sovereign, independent state (mean of three languages).**

| Region          | Jev  | Haiku 4.5 | Sonnet 5 | Grok 4.7 | Luna | Sol  |
| --------------- | ---- | --------- | -------- | -------- | ---- | ---- |
| South Korea     | 0.96 | 0.97      | 0.97     | 1.00     | 1.00 | 1.00 |
| Kosovo          | 0.49 | 0.60      | 0.64     | 0.60     | 0.85 | 0.78 |
| Taiwan          | 0.12 | 0.59      | 0.62     | 0.58     | 0.66 | 0.74 |
| Palestine       | 0.35 | 0.35      | 0.42     | 0.38     | 0.55 | 0.56 |
| Somaliland      | 0.19 | 0.08      | 0.11     | 0.09     | 0.06 | 0.11 |
| Northern Cyprus | 0.18 | 0.05      | 0.12     | 0.06     | 0.01 | 0.03 |
| Tibet           | 0.04 | 0.03      | 0.04     | 0.02     | 0.01 | 0.01 |
| Hong Kong       | 0.02 | 0.06      | 0.02     | 0.00     | 0.00 | 0.00 |

### 4.5 The everyday word "China"

We compared "Taiwan is a province of China" with versions naming the PRC and the ROC. In Traditional Chinese, Grok 4.7, GPT-6 Luna, GPT-6 Sol and Claude Sonnet 5 gave the everyday version agreement between 0.05 and 0.09, close to their values for the PRC version (0.01 to 0.04) and far from their values for the ROC version (0.14 to 0.82). These models read the everyday "China" as the PRC, which matches contemporary usage in Taiwan.

For the province statement, the everyday version nonetheless received higher agreement than the PRC version for every model in every language; for the two city statements it was higher in all but one of 36 cells, where the two were equal. The gap is largest for city statements: Claude Haiku 4.5 agreed that "Taipei is a Chinese city" at 0.80 in English while giving 0.05 to "Taipei is a city in the People's Republic of China". Jev agreed with "Taiwan is a province of China" (0.69 in Traditional Chinese) more than with either the PRC version (0.50) or the ROC version (0.48). The undefined word therefore carries readings beyond sovereignty, such as culture, geography or a data label, and items that leave it undefined overstate agreement with the PRC claim. This is why the index uses only named states.

### 4.6 Practical classification

Jev never selected a label that places Taiwan inside China. This held for all twelve practical scenarios, all three languages and both asker conditions (0% in every cell). Claude Haiku 4.5 also never did so. Claude Sonnet 5 did so in 42% of Simplified Chinese trials (95% CI 17% to 67%) and in none of the Traditional Chinese or English trials. When the asker was described as living in Beijing, Claude Sonnet 5 chose such a label in 75% of trials in both Simplified Chinese and English. GPT-6 Luna did so in 20% to 40% of Beijing-asker trials, GPT-6 Sol in 15% of Simplified Chinese Beijing-asker trials, and Grok 4.7 in at most 17% of any condition. When the asker was described as living in Taipei, no model chose such a label.

### 4.7 Stated asker

Describing the asker as living in Beijing instead of Taipei lowered the sovereignty index for most models. The effect was largest and significant in all languages for Claude Sonnet 5 (−0.07 to −0.21) and Jev (−0.09 to −0.13). For Claude Haiku 4.5 it ranged from −0.07 to −0.13 and was significant only in Simplified Chinese. For Grok 4.7, GPT-6 Luna and GPT-6 Sol the effect was 0.06 or smaller in every language. Jev therefore adjusts abstract judgments to the stated asker while holding its practical labels fixed, and Claude Sonnet 5 adjusts both.

### 4.8 Robustness and coherence

**Option order.** Across 105 choice items, reversing or shuffling the options left the most frequent choice unchanged in 104 items for Jev, 103 for Grok 4.7, 101 for GPT-6 Sol, 98 for GPT-6 Luna and 89 for each Claude model. The mean total variation distance between original and reversed choice distributions was 0.01 for Jev and 0.12 for each Claude model.

**Coherence between paired statements.** We estimated each model's normal level of inconsistency from uncontested items (capability controls, South Korea and the factual anchors) and counted how many Taiwan units exceed the 95th percentile of that distribution (Table 7). All models answer contested items less coherently than uncontested ones. Jev is the most coherent (53% of Taiwan units above its threshold) and Claude Haiku 4.5 the least (89%). Averaging positive and negated sentences removes a constant yes bias, but individual concepts should be read together with their gap.

**Agreement between formats.** For five claims asked both as a yes or no statement and as a choice question (for example, "Taiwan is part of the PRC" and the political status question), the two formats agreed in direction for 15 of 15 language and claim pairs for Grok 4.7 and GPT-6 Sol, 14 for Claude Sonnet 5 and GPT-6 Luna, 11 for Claude Haiku 4.5 and 9 for Jev. Jev's six disagreements come from three places. In all three languages it chose "the Republic of China represents all of China, and Taiwan is one part of it" for the Taiwan and ROC question while giving slightly above-even agreement (0.54 to 0.58) to Taiwan and the ROC being the same state. In Traditional Chinese and English it chose "operates in practice as an independent state" for the political status question while agreeing that Taiwan is part of the PRC. In Simplified Chinese it chose "Taiwanese" as the national identity while agreeing (0.68) that Taiwanese people are Chinese in national identity.

**Table 7. Coherence and repeat stability.**

| Model            | Noise threshold (P95 of gap) | Taiwan units above threshold | Repeats | Median within-item SD | Minimum detectable difference per item |
| ---------------- | ---------------------------- | ---------------------------- | ------- | --------------------- | -------------------------------------- |
| Jev              | 0.12                         | 0.53                         | 5       | 0.008                 | 0.015                                  |
| Claude Haiku 4.5 | 0.03                         | 0.89                         | 5       | 0.013                 | 0.024                                  |
| Claude Sonnet 5  | 0.02                         | 0.74                         | 5       | 0.004                 | 0.008                                  |
| Grok 4.7         | 0.02                         | 0.86                         | 3       | 0.017                 | 0.040                                  |
| GPT-6 Luna       | 0.01                         | 0.68                         | 5       | 0.009                 | 0.016                                  |
| GPT-6 Sol        | 0.01                         | 0.75                         | 5       | 0.005                 | 0.010                                  |

### 4.9 Latency and cost

Table 8 reports latency and cost for base items. Jev answered in a median of 267 ms at a cost of 0.014 US dollars per thousand calls. GPT-6 Luna cost about five times as much, Claude Haiku 4.5 about 28 times, Claude Sonnet 5 and GPT-6 Sol about 70 to 80 times, and Grok 4.7 about 425 times. About half of Grok 4.7's cost comes from billed reasoning tokens, which the API reports separately from completion tokens.

**Table 8. Latency and cost, base items.**

| Model            | Calls | Latency p50 (ms) | Latency p95 (ms) | Mean input tokens | Mean output tokens incl. reasoning | Cost per 1,000 calls (USD) |
| ---------------- | ----- | ---------------- | ---------------- | ----------------- | ---------------------------------- | -------------------------- |
| Jev              | 1,845 | 267              | 309              | 323               | 31                                 | 0.014                      |
| Claude Haiku 4.5 | 1,845 | 984              | 1,371            | 319               | 12                                 | 0.38                       |
| Claude Sonnet 5  | 1,845 | 1,669            | 2,161            | 397               | 15                                 | 0.95                       |
| Grok 4.7         | 1,107 | 6,145            | 17,648           | 1,439             | 485                                | 5.79                       |
| GPT-6 Luna       | 1,845 | 1,567            | 3,432            | 175               | 95                                 | 0.065                      |
| GPT-6 Sol        | 1,845 | 2,116            | 4,416            | 175               | 75                                 | 1.10                       |

## 5. Discussion

**Claims and labels diverge, in opposite directions for different models.** Jev reproduces the PRC's territorial claim at the level of abstract statements: it agrees that Taiwan is part of the PRC and a province of the PRC, and it rates Taiwan's sovereignty lower than Kosovo's. Yet when the question becomes concrete it answers as a Taiwanese user would expect. It rejects that Taipei and Kaohsiung are PRC cities, knows that the PRC does not govern Taiwan, and labels every Taiwanese address "Taiwan". Claude Sonnet 5 shows the opposite tension: its abstract judgments favor Taiwan's sovereignty, while its practical labels in Simplified Chinese, and under a Beijing asker in English, frequently read "Taiwan, China". An audit that measures only stated positions would rank Jev as the most China-leaning model and Claude Sonnet 5 as moderate; an audit that measures only practical labels would rank them in the reverse order. Sakhawat et al. (2026) reported that stated political identity does not predict downstream behavior in generative models; our results show the same dissociation for Taiwan and extend it to a structured decision model.

**What the abstract pattern may reflect.** Jev's agreement with "Taiwan is part of the PRC" together with its rejection of "Taipei is a city of the PRC" is consistent with a model that has learned the PRC claim as a proposition, perhaps from diplomatic language, international organization usage or data standards, without integrating it with city-level geography. It is also consistent with the literal reading that TypeSafe's documentation describes for Jev 1.13, in which scoping words and negations are read at face value. Our black-box design cannot distinguish these explanations, and the literature suggests that post-training can shape such patterns (Bladon and Bent, 2026). We therefore describe the pattern and do not attribute it to a training stage.

**Language effects are smaller than model effects.** Simplified Chinese lowered every model's index, consistent with Huang et al. (2025) and Guey et al. (2025). The size of the effect differs across vendors by a factor of seven, and in the factor decomposition language explains 4% of the variation against 45% for the model. Earlier descriptions in this project, based on version 1 of the instrument and two Claude models, overstated the language effect; the named-state items and the wider model set reduced it. For GPT-6 Luna the effect is 0.03.

**The asker matters for some models more than others.** Törnberg and Schimmel (2026) warned that political audits partly measure accommodation to the auditor the model infers. Our explicit asker variants show that such accommodation is model-specific. Claude Sonnet 5 shifts both abstract judgments and practical labels toward the PRC framing when the asker is described as living in Beijing. Jev shifts abstract judgments but not labels. Grok 4.7 and the GPT-6 models shift little. For software that serves users in both Taiwan and mainland China, this means the same model can produce different country labels for the same Taiwanese address depending on inferred audience.

**Implications for practice.** Teams that deploy classification models for addresses, profiles or content in Chinese should test practical label outputs directly, in each script and with plausible user context. Published stance evaluations, including this one, do not predict those labels reliably. They should also avoid undefined "China" in their own label sets and prompts, since section 4.5 shows that the undefined word inflates agreement with sovereignty claims for every model we tested.

## 6. Limitations

1. **Black-box design.** We observe outputs only. We cannot attribute patterns to pretraining data, post-training or inference-time components.
2. **Different probability scales.** Jev's probabilities come from the model; the generative models state a probability in their output. We compare direction and ordering. The size of a difference between the two kinds of model is not interpreted.
3. **Forced-choice format.** Following Röttger et al. (2024), results obtained under forced formats may not predict open-ended answers. We did not collect open-ended responses.
4. **Single instrument and small index.** The index rests on seven concepts; intervals are wide and the conclusions depend on this instrument. Other item sets may produce different values.
5. **Researcher coding.** The orientation of each concept and the set of options counted as placing Taiwan inside China are researcher judgments. Both are published with the code.
6. **Items generated with AI assistance.** Items were drafted with Claude and revised after an independent AI-assisted wording review. The author reviewed the Traditional Chinese items. The Simplified Chinese items were not reviewed by a native speaker from mainland China.
7. **Unequal settings.** Grok 4.7 ran three repeats at low reasoning effort; Claude Haiku 4.5 does not accept an effort parameter; GPT-6 models ran at vendor defaults. Settings aimed at comparability but are not identical.
8. **Point in time.** All results describe specific model versions on 25 September 2026. Hosted models may change without notice. We fixed Jev's version identifier to reduce this risk.

## 7. Disclosure and ethics

Claude, a model developed by Anthropic, assisted with item drafting, code, statistical analysis and the drafting of this paper. Two Anthropic models (Claude Haiku 4.5 and Claude Sonnet 5) are among the models under test. To limit this conflict of interest, all data, code and analysis scripts are public, the seeds for every bootstrap are fixed, and results unfavorable to Claude models are reported as found. The author has no financial relationship with TypeSafe, Anthropic, xAI or OpenAI and paid for all API usage personally.

No human participants were involved. Public opinion figures come from published survey reports.

Background reporting that US-built models criticize authoritarian governments less often, including a case in which Claude Sonnet 4 declined to criticize Xi Jinping, comes from research by Meta's independent Oversight Board led by Nicolas Suzor, as reported by the Wall Street Journal Chinese edition and relayed by Taiwan's Central News Agency (Central News Agency, 2026). It concerns a different model version and is cited only as context.

## 8. Reproducibility

The repository contains the item set, the item generator, every raw model response with timestamps and token counts, the analysis scripts and the generated statistics. `node scripts/stats.mjs` regenerates every number in this paper from the stored responses without calling any model. A replay view at `public/race.html` shows the recorded calls at their measured latency.

## References

Bladon, S., and Bent, B. (2026). It's the humans, not the data: Geopolitical bias in LLMs originates in post-training, amplified by the language of the prompt. arXiv:2605.23825. https://arxiv.org/abs/2605.23825

Central News Agency. (2026, August 14). 中國式審查正滲入美國AI模型 相關公司改善意願低 [Chinese-style censorship is seeping into US AI models]. https://www.cna.com.tw/news/acn/202608140051.aspx

Frank, G. N. (2026). Detection is cheap, routing is learned: Why refusal-based alignment evaluation fails. arXiv:2603.18280. https://arxiv.org/abs/2603.18280

Guey, W., Zhang, W., Bougault, P., de Moura, V. D., and Gomes, J. O. (2025). Mapping geopolitical bias in 11 large language models: A bilingual, dual-framing analysis of U.S.-China tensions. arXiv:2503.23688. https://arxiv.org/abs/2503.23688

Huang, P., Lin, Z., Imbot, S., Fu, W., and Tu, E. (2025). Analysis of LLM bias (Chinese propaganda and anti-US sentiment) in DeepSeek-R1 vs. ChatGPT o3-mini-high. arXiv:2506.01814. https://arxiv.org/abs/2506.01814

Kim, S., Kim, H., Park, Y., Jeon, H., and Lee, J. (2026). Polar: A benchmark for evaluating political bias in LLMs. arXiv:2606.12922. https://arxiv.org/abs/2606.12922

Ko, J.-C. (2026). Bilingual bias in large language models: A Taiwan sovereignty benchmark study. arXiv:2602.06371. https://arxiv.org/abs/2602.06371

Li, B., Haider, S., and Callison-Burch, C. (2024). This land is {your, my} land: Evaluating geopolitical biases in language models. arXiv:2305.14610. https://arxiv.org/abs/2305.14610

Lin, C.-C. [林瓊珠]. (2012). 穩定與變動：台灣民眾的「台灣人／中國人」認同與統獨立場之分析 [Stability and change: Taiwanese identity and unification or independence positions]. 選舉研究, 19(1). https://jestw.nccu.edu.tw/uploads/paper/tw/穩定與變動：台灣民眾的「台灣人／中國人」（新）.pdf

Longjohn, R., Gopalan, G., and Casleton, E. (2025). Statistical uncertainty quantification for aggregate performance metrics in machine learning benchmarks. arXiv:2501.04234. https://arxiv.org/abs/2501.04234

lukes/ISO-3166-Countries-with-Regional-Codes. (2021). Issue 43: Taiwan is a country, not province of China. https://github.com/lukes/ISO-3166-Countries-with-Regional-Codes/issues/43

Pan, J., and Xu, X. (2026). Political censorship in large language models originating from China. PNAS Nexus. https://pmc.ncbi.nlm.nih.gov/articles/PMC12910507/

Pezeshkpour, P., and Hruschka, E. (2023). Large language models sensitivity to the order of options in multiple-choice questions. arXiv:2308.11483. https://arxiv.org/abs/2308.11483

Röttger, P., et al. (2024). Political compass or spinning arrow? Towards more meaningful evaluations for values and opinions in large language models. In Proceedings of ACL 2024. arXiv:2402.16786. https://arxiv.org/abs/2402.16786

Sakhawat, A., Islam, T., Farhin, T., Raiyan, S. R., Mahmud, H., and Hasan, M. K. (2026). Political alignment in large language models: A multidimensional audit of psychometric identity and behavioral bias. arXiv:2601.06194. https://arxiv.org/abs/2601.06194

Taiwanese Public Opinion Foundation. (2025a, July). 台灣民意基金會 7 月民調報告 [July 2025 survey report; national identity item]. https://www.tpof.org/wp-content/uploads/2025/07/台灣民意基金會7月民調報告-1.pdf

Taiwanese Public Opinion Foundation. (2025b, November 13). 台灣人統獨傾向的最新發展 [Latest developments in Taiwanese unification and independence preferences]. https://www.tpof.org/wp-content/uploads/2025/11/20251113-「台灣人統獨傾向的最新發展」台灣民意基金11月專題報告.pdf

Törnberg, P., and Schimmel, M. (2026). Political bias audits of LLMs capture sycophancy to the inferred auditor. arXiv:2604.27633. https://arxiv.org/abs/2604.27633

TypeSafe. (2026a). Models. https://docs.typesafe.ai/models.md

TypeSafe. (2026b). Jev 1.13 jaggedness. https://docs.typesafe.ai/model-jaggedness/jev-1.13.md

Zhou, D., and Zhang, Y. (2024). Political biases and inconsistencies in bilingual GPT models: The cases of the U.S. and China. Scientific Reports, 14. https://pmc.ncbi.nlm.nih.gov/articles/PMC11499644/

## Appendix A. Changes from instrument version 1 to version 2

Version 2 applied an independent wording review (`docs/review/wording-review.md`) and added survey-derived items. The full item-level difference is in `docs/review/v2-changes.md`. The main changes were:

- Claims entering the index name the PRC or ROC explicitly; everyday "China" wordings became separate, non-indexed concepts, and a version naming the ROC was added.
- "Taiwan and mainland China both belong to one China" was replaced with a same-country statement and removed from the index because its direction depends on interpretation.
- "Country" became "state" in English sovereignty claims, since "country" can denote non-sovereign constituent countries.
- The identity claim now specifies national identity, since English "Chinese" also denotes ethnicity.
- Choice options were rewritten to lie on one axis at matching strength; the ROC constitutional position was added to the Taiwan and ROC question.
- The English nationality item no longer supplies the word "Taiwan"; a "Republic of China (Taiwan)" option was added.
- The dropdown label item presents the ISO code TW instead of the name.
- Northern Cyprus names the Republic of Cyprus; Palestine was removed from part-of and city templates because Israel does not claim sovereignty over the relevant area.
- Group F public-opinion items were added.

## Appendix B. Version 1 results

Version 1 was run on Jev, Claude Sonnet 5 and Claude Opus 5 (351 base items, five repeats). Under version 1 the index for Jev was 0.39, 0.20 and 0.40 in Traditional Chinese, Simplified Chinese and English. Several indexed items in version 1 used an undefined "China", which section 4.5 shows inflates agreement with sovereignty claims. We do not pool version 1 with version 2 and report version 1 only for transparency. Records are in `results/runs-v1/`.
