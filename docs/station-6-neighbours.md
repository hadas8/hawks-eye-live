# Station 6: too hard as written, cut down 2026-09-10

_For the conversation with Lotem. Written 2026-09-10 alongside building the station, then revised twice the same day: once after Hadas played it and found it far too hard, and again after she decided what to do about it. **Station 6 is built and playable on `dev`.**_

## What was changed, and what it did to the digit

Hadas's calls, applied:

1. **N-04 is dropped.** It was a duplicate of N-02 — see below — so the station is three crossings, not four.
2. **A rejected submission now names which crossings are wrong**, the way station 1 does. Never what is wrong inside one.
3. **The table filters live** to whichever crossing is being worked on: rows that fail its שעת פעילות dim out. First step of the rule only.

Together those take the station from 48 comparisons to 36, halve each one's scan, and make a failed attempt worth something. Problems 1, 2 and 6 below are substantially addressed; 3, 4 and 5 are content and remain for Lotem.

**The digit is now 7.** The three remaining crossings score 2 + 3 + 2 = 7, so `CFG.lockCode` is **`3294277`**. It was going to be 1 with N-04 in (2+3+2+3 = 10). The roster wanted 2 and no arrangement of the source's own data produces it.

## The station works, and its rule is clean

Transcribed from `תחנה_6_מעברים.xlsx`. Twelve assessed crossings in a pinned table, four new ones, three neighbours each, the average of their risk scores.

This is the one station whose rule is **given rather than discovered** — the xlsx prints it in its own header, in priority order:

> כיצד מוצאים שכנים קרובים: (1) שעת פעילות (2) סוג כביש (3) כיסוי עצים (4) גובה (5) רכבים ביום. שני מעברים דומים = חולקים כמה שיותר תכונות מהתחלת הרשימה.

So the comparison is lexicographic: agree on the first feature, then the second, and so on. The key in the app is **computed from that rule** rather than typed in, so it cannot drift from it.

**A correction to the first version of this document, which called the rule "fully determined" and "unambiguous".** It is, for the first three features. It is not defined at all for the last two. `שני מעברים דומים = חולקים כמה שיותר תכונות` — *sharing* is a clear idea for יום/לילה, for road type, for tree cover. Two crossings cannot share 360 מ׳ and 350 מ׳. The app reads features 4 and 5 as *closeness*, which is the only workable reading, but the source never says so and a group has to invent that step themselves. Below is why that matters more than it sounds.

One change to the source's presentation: the table's columns run in the **rule's** priority order, not the spreadsheet's. The xlsx puts `רכבים/יום` third, which is the feature the rule cares about least, and buries `סוג כביש` behind it. Reading left to right now matches working down the rule.

## The digit does not come out at 2

Working the rule over the data:

| מעבר חדש | שלושת השכנים | ציונים | ממוצע | ציון |
|---|---|---|---|---|
| N-01 | K-10, K-06, K-02 | 2, 2, 1 | 1.67 | **2** |
| N-02 | K-11, K-07, K-03 | 3, 3, 4 | 3.33 | **3** |
| N-03 | K-12, K-06, K-10 | 3, 2, 2 | 2.33 | **2** |
| N-04 | K-11, K-07, K-03 | 3, 3, 4 | 3.33 | **3** |

With all four crossings, sum **10** → 1 + 0 = **1**. With N-04 dropped, sum **7** → **7**. The roster wanted **2**, and neither figure is it.

The draft asserted 2 + 3 + 3 + 3 = 11, which is the 2. The single disagreement is **N-03**, where the draft says 3 and the rule gives 2 — and the rule *cannot* give 3. Its only same-time, same-road match is K-12, which scores 3; every remaining daytime crossing scores 1 or 2, so the best three available sum to 3 + 2 + 2 = 7 and average 2.33. Reaching 3 would mean taking a night crossing, which the rule's first feature forbids.

No rounding convention rescues it either. Rounding every average **down** gives 9; rounding every average **up** gives 13 → 4. Only ordinary rounding gives a sum in the right neighbourhood at all, and it lands one short: the digit would need a sum of 11 or 20.

So `CFG.lockCode` is now **`3294277`** — station 3 having already moved position three from 7 to 9. **Two of the seven digits no longer match the draft's code, and both move the physical lock.** Neither is a transcription error; each is what the station's own rule does to its own data.

## Why it plays too hard

**1. The volume.** *Four* new crossings against twelve known ones was 48 comparisons, each over up to five features, read off a 12-row table, inside seven minutes. **Addressed:** three crossings is 36, and the live שעת פעילות filter halves each scan.

**2. All-or-nothing over four sets, with no feedback.** One slip anywhere failed the station and the group was told nothing about where. **Addressed:** a rejection now marks which crossings were right and which were not, so a second attempt starts from somewhere.

**3. The undefined step is the step that decides every answer.** Because no new crossing has three neighbours of its own kind (below), the third pick always comes from a group of four or five candidates *tied on all three categorical features* and separated only by altitude. Checked for all four: the numeric tie-break decides the third neighbour every single time. So the one part of the rule the source never defines is the part that settles all four answers — and it is arithmetic (|360−200| against |360−150| against |360−100| against |360−700|), four times over, at the point where a group is most rushed.

**4. N-03 looks wrong even when it is right.** Its neighbours are K-12, K-06 and K-10: one mountain crossing plus two *forest* crossings at 350–400 m, for a mountain crossing at 710 m. Correct under the stated rule. A group that gets there will not believe it and will spend time undoing it.

**5. Three of the five features do all the work; two do none.** Checked exhaustively: dropping `כיסוי עצים`, or `רכבים/יום`, or both, leaves all four answers unchanged. Only שעת פעילות, סוג כביש and גובה ever decide anything. The station asks a group to hold a five-step priority list under a clock, and two of the steps never fire.

**6. Five of the twelve known crossings are never an answer.** K-01, K-04, K-05, K-08 and K-09 appear in none of the correct sets. Distractors are legitimate, but they are also 40% of a table that has to be read and re-read. **Partly addressed:** the live filter dims six rows at a time, so half the table is quiet at any moment.

**A second correction.** The first version of this document said a group reasoning loosely would get it wrong on all four. That is false, and it is the good news here: a group that matches on שעת פעילות, then on סוג כביש, then takes the closest by גובה — skipping tree cover and vehicles entirely — gets **all four sets exactly right**. The intuitive route works. What punishes is the amount of it, not the shape of it.

## Two more things worth Lotem's eye

### N-02 and N-04 are the same puzzle

| | שעת פעילות | סוג כביש | כיסוי עצים | גובה | רכבים/יום |
|---|---|---|---|---|---|
| N-02 | לילה | מיוער | בינוני | 570 מ׳ | 7 |
| N-04 | לילה | מיוער | בינוני | 560 מ׳ | 6 |

Identical on the three features that decide anything, ten metres and one vehicle apart on the two that only break ties. They get **the same three neighbours** and therefore the same score. A group that solves N-02 gets N-04 free, so the station is really three cases, not four — and one of the four scores is not independent evidence that the group understood anything.

### No new crossing has three neighbours of its own kind

The rule leans hardest on the first two features, so the honest question is how many known crossings share a new one's שעת פעילות **and** סוג כביש:

| מעבר חדש | | כמה תואמים |
|---|---|---|
| N-01 | יום / מיוער | **2** — K-06, K-10 |
| N-02 | לילה / מיוער | **2** — K-07, K-11 |
| N-03 | יום / הררי | **1** — K-12 |
| N-04 | לילה / מיוער | **2** — K-07, K-11 |

Every one of the four is short. So the third neighbour — and for N-03, the second and third — always comes from a crossing that fails on road type, decided by altitude among a tied group. That is the mechanism behind problem 3 above.

## Ways to bring the difficulty down

Roughly by how much they cost. None applied yet.

~~Show the first filter live~~ · ~~Drop N-04~~ · ~~Name which crossing is wrong~~ — all three done, above.

Still available if it is still too hard:

- **Cut some of the five never-used crossings.** Checked: removing K-04 and K-08 leaves every answer unchanged and takes two rows off the table.
- **Say what closeness means for גובה** in the rule text, so problem 3 stops being a guess. This one is Lotem's and worth doing regardless — it is the step that decides all three answers.
- **More than three attempts**, now that a rejection carries information.

## What is needed from Lotem

1. **The digit.** Three crossings give 7, so the lock code is `3294277`. If it must be 2, the data has to change — the rule cannot be argued into it.
2. **What "closest" means for גובה and רכבים/יום.** The rule says crossings *share* features, which is meaningless for numbers, and that undefined step decides all three answers.
3. **The known set.** Adding a day/mountain and a day/forest crossing would give each new one three real neighbours and make the third pick feel earned rather than residual — and would fix problem 4, where N-03's neighbours look wrong to a person.

Until 1 is settled, the digit is 7 and the physical lock has to match.
