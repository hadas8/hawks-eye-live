# Station 6's own rule gives digit 1, not 2

_For the conversation with Lotem. Written 2026-09-10, alongside building the station. **Station 6 is built and playable on `dev`.** The rule is sound and unambiguous — unlike station 3's. What does not work is the arithmetic at the end._

## The station works, and its rule is clean

Transcribed from `תחנה_6_מעברים.xlsx`. Twelve assessed crossings in a pinned table, four new ones, three neighbours each, the average of their risk scores.

This is the one station whose rule is **given rather than discovered** — the xlsx prints it in its own header, in priority order:

> כיצד מוצאים שכנים קרובים: (1) שעת פעילות (2) סוג כביש (3) כיסוי עצים (4) גובה (5) רכבים ביום. שני מעברים דומים = חולקים כמה שיותר תכונות מהתחלת הרשימה.

So the comparison is lexicographic: agree on the first feature, then the second, and the numeric features break ties by closeness. That is fully determined — there is no interpretation to argue about, which is a real strength and the opposite of station 3. The key in the app is **computed from that rule** rather than typed in, so it cannot drift from it.

One change to the source's presentation: the table's columns run in the **rule's** priority order, not the spreadsheet's. The xlsx puts `רכבים/יום` third, which is the feature the rule cares about least, and buries `סוג כביש` behind it. Reading left to right now matches working down the rule.

## The digit does not come out at 2

Working the rule over the data:

| מעבר חדש | שלושת השכנים | ציונים | ממוצע | ציון |
|---|---|---|---|---|
| N-01 | K-10, K-06, K-02 | 2, 2, 1 | 1.67 | **2** |
| N-02 | K-11, K-07, K-03 | 3, 3, 4 | 3.33 | **3** |
| N-03 | K-12, K-06, K-10 | 3, 2, 2 | 2.33 | **2** |
| N-04 | K-11, K-07, K-03 | 3, 3, 4 | 3.33 | **3** |

Sum **10** → 1 + 0 = **1**. The roster wanted **2**.

The draft asserted 2 + 3 + 3 + 3 = 11, which is the 2. The single disagreement is **N-03**, where the draft says 3 and the rule gives 2 — and the rule *cannot* give 3. Its only same-time, same-road match is K-12, which scores 3; every remaining daytime crossing scores 1 or 2, so the best three available sum to 3 + 2 + 2 = 7 and average 2.33. Reaching 3 would mean taking a night crossing, which the rule's first feature forbids.

No rounding convention rescues it either. Rounding every average **down** gives 9; rounding every average **up** gives 13 → 4. Only ordinary rounding gives a sum in the right neighbourhood at all, and it lands one short: the digit would need a sum of 11 or 20.

So `CFG.lockCode` is now **`3294217`** — station 3 having already moved position three from 7 to 9. **Two of the seven digits no longer match the draft's code, and both move the physical lock.** Neither is a transcription error; each is what the station's own rule does to its own data.

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

Every one of the four is short. So the third neighbour — and for N-03, the second and third — always comes from a crossing that fails on road type, and which one it is gets decided by כיסוי עצים and then by altitude. The rule handles that correctly and the answer is well defined, but it means **the third pick is never the intuitive one**, and a group reasoning loosely ("same kind of road, roughly the same size") will get it wrong on all four.

For N-03 in particular, two of its three neighbours are forest crossings at 350–400 m when N-03 is a mountain crossing at 710 m. That is defensible under the stated rule and looks wrong to a person.

## What is needed from Lotem

1. **The digit.** Its own data gives 1. Either the lock code becomes `3294217`, or the data changes: raising any one crossing's risk score by enough to move one average up by one gets the sum to 11 and the digit to 2.
2. **N-04.** Make it a genuinely different crossing, or drop it to three cases and adjust the target sum.
3. **The known set.** Adding a couple of day/mountain and day/forest crossings would give each new one three real neighbours and make the third pick feel earned rather than residual.

Until 1 is settled, the digit is 1 and the physical lock has to match.
