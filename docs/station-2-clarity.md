# Station 2 reads as confusing — the problems, envelope by envelope

_For the conversation with Lotem. Raised by Hadas 2026-09-10, after walking the station envelope by envelope on `dev`. **Nothing here is built.** Station 2 ships exactly as transcribed until Lotem decides, because the data is hers._

Hadas's verdict after going through all seven: _"not too hard, just not clear. I think it needs a complete overhaul."_

Worth separating two things straight away. The **transcription is faithful** — every series is taken from Lotem's original chart images in `docs/source-charts/`, and the earlier reconstruction that got five of seven wrong has been replaced. What follows is not a fidelity problem. It is that the exercise, as designed, does not tell a group clearly enough what it is being asked to do.

## The headline problem: the question at the top asks for the wrong thing

Every envelope is topped by a question — `כמה שיירות חצו בסך הכול בחמשת החודשים?`, `כמה אירועים תועדו מינואר עד אפריל?` — and the actual task is `איזה משני הגרפים עונה על זה נכון?`

So the group reads a question that asks for **a number**, and is scored on **a chart**. In ז׳ a group starts adding 3+6+4+7+5. In ג׳ it starts counting January to April. Neither sum is wanted, neither is ever checked, and the arithmetic is a detour away from the thing being taught. The question is meant to be a lens for judging the charts; it reads as a task in its own right.

This is the most likely single cause of the confusion, and it affects all seven envelopes.

**Options.** Phrase every question so it can only be a lens — `איזה גרף מאפשר לענות על זה?` rather than the bare question; or keep the questions and make the envelope actually take the number as the answer, which changes the station's shape considerably.

## Per-envelope problems

### ה׳ — the pair is drawn at two different granularities

The only envelope where the two charts are not the same picture twice. The honest one is **12 weeks**; the lying one is **4 months**, each month the mean of three weeks. They do correspond exactly:

| | weeks | mean |
|---|---|---|
| חודש 1 | 4, 5, 6 | 5 |
| חודש 2 | 3, 2, 3 | 2.7 |
| חודש 3 | 4, 5, 6 | 5 |
| חודש 4 | 7, 6, 7 | 6.7 |

but nothing on screen says so, and no group is deriving that under a seven-minute clock. Worse, the question is phrased **in months** — `מחודש 1 עד חודש 4` — so it points at the lying chart's axis, and the honest chart cannot answer it as asked. Hadas got this one wrong for exactly that reason.

A one-line fix exists (phrase the question over the whole period rather than in months, so both charts can answer it) but it was deliberately **not** applied, since it edits Lotem's question.

### ב׳ — the deception is colour only, and the numbers still tell the truth

Values are 38 / 35 / 27 / 8. The lie is that the smallest bar, ציר צפוני at 8, is the only one in the accent colour. But every bar is still drawn at its true height, and the values are printed on them. A reader who looks at all is not misled, only nudged. This is by some distance the weakest of the seven, and it is the one Hadas queried first: _"that's the same graph in both with different colors, the figures are all the same, why is one of them wrong?"_ — which is a fair reading of what is on screen.

If it should bite, the amber bar needs to also be drawn taller than it is, or the value labels need to come off so colour is the only cue left.

### א׳ and ו׳ run the same trick twice

Both are a truncated value axis starting at 96. ו׳ adds a filled area under a line, but the thing a group has to notice is identical in both: where the axis starts. Out of seven envelopes, spending two on one lesson is a waste of two, and it makes the set feel repetitive rather than varied.

## Two contradictions inside the source

- **ג׳: the chart and the text disagree.** The chart shows incidents in ינו, מרץ and יול only, so January to April totals **2**. The docx text says 3. The app follows the chart. If 3 is intended, the chart needs a fourth incident.
- **ב׳: the percentages sum to 108%** — 38 + 35 + 27 + 8. Transcribed as-is from the image. Either the categories overlap, or one figure is off.

## One departure already made, for the record

In the source the lying chart is **graph 1 in six of the seven envelopes**, so "always pick graph 2" scored six of seven without reading anything. The liar's position is redistributed — three of the seven now show it first. Which chart of each pair is honest is unchanged; only where it appears.
