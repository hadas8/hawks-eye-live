# Station 7 is salvageable, and its content is sound

_Written 2026-09-10, from `חדר בריחה 7 תחנות - מבצע עין הנץ.docx` — the original draft. Lotem never wrote a standalone doc for this station. **Nothing is built yet.**_

## The blocker in the build spec was wrong on every count

It said station 7 needs seven analysts in isolation against a group of three, that its vote table reads 7/2/5 which is fourteen votes from seven analysts, that its title says eight, and that working the rules gives ג'נתא 5 / קוסייא 1 / אסאל 1.

None of that survives the draft. There are **eight** analysts, in four pairs, which is the draft's group of eight. The sites are **סמנאן, תבריז, אצפהאן** — ג'נתא and קוסייא are station *2's* border crossings, so that check was run against the wrong station's data. And the vote count is 5 / 2 / 1, which is eight.

## The logic is fully consistent — all eight verified

Each analyst holds two readings and a three-row decision table, and reads down to the first row that fits. Every one reproduces the draft's key exactly:

| אנליסט | צמד | מה הוא רואה | התשובה | דיוק |
|---|---|---|---|---|
| 1 | א׳ | 02:40 · 6 שומרים | סמנאן | 61% |
| 2 | א׳ | קרקע חולית · 12 ק״מ | סמנאן | 58% |
| 3 | ב׳ | 78° · אות חלש | **תבריז** | **68%** |
| 4 | ב׳ | דרך 4 מ׳ · 6 שומרים | סמנאן | 55% |
| 5 | ג׳ | 78° · 02:40 | **אצפהאן** | 60% |
| 6 | ג׳ | 6 גלגלים · לבן | סמנאן | 57% |
| 7 | ד׳ | 12 ק״מ · אות חלש | **תבריז** | **66%** |
| 8 | ד׳ | 6 שומרים · קרקע חולית | סמנאן | 54% |

Five for סמנאן, two for תבריז, one for אצפהאן. Eight votes, no ties, no ambiguity, and exactly one rule fires per analyst — no row is unreachable and none overlaps.

**The digit is 7**, the site code for סמנאן, which is what the roster already carries. **Station 7 needs no change to the lock code**, unlike 3 and 6.

## Its punchline is the best thing in the whole draft

The two most accurate analysts are #3 at 68% and #7 at 66%. **Both said תבריז. Both were wrong.** A group that decided to trust the two best would have failed; only counting all eight got there.

And the reason is the actual Random Forest idea: each analyst sees a *different pair* of readings, so their errors point in different directions and cancel instead of stacking. The draft's closing line is already the right one — *שמונה בינוניים שרואים דברים שונים מנצחים שני מומחים טובים שרואים אותו דבר*.

## What actually needs solving

### 1. The site-code table is missing from the draft

Both a hint and the union sheet tell the group to look at `טבלת קודי האתרים`, and the draft never prints it. It is recoverable: the solution says `קוד האתר של סמנאן הוא 7`, and the union sheet's vote table carries **7 / 2 / 5** against סמנאן / תבריז / אצפהאן — which are the *codes*, printed one column to the left of where they belong. So:

| האתר | קוד |
|---|---|
| סמנאן | 7 |
| תבריז | 2 |
| אצפהאן | 5 |

Worth one line of confirmation from Lotem, but the reading is forced: as vote counts, 7 + 2 + 5 = 14 from eight analysts, and the truth check on the same page says the votes must total eight.

### 2. The isolation mechanic cannot survive one screen

This is the real design problem. The draft's drama is that eight people each hold two readings, write a covered note, and reveal together — *אף אחד לא רואה את התמונה המלאה*. On one device per group, everyone sees everything.

What survives without isolation is the substance: eight small decision trees, each on a different pair of features, disagreeing, with the majority right and the best two wrong. What is lost is the theatre.

A digital analogue that keeps most of it: the group works the analysts **one at a time**, and no vote tally is shown until all eight are done — then all eight resolve at once. The "nobody sees the whole picture" line becomes "no analyst sees the whole picture", which is still true and still the point.

### 3. It is a lookup, not a puzzle

Once you have an analyst's two readings and their three rules, the answer is mechanical — about twenty seconds each, eight times. There is no insight required until the reveal.

That may be exactly right for the last station of an event: the payoff is the accuracy card, not the difficulty, and after stations 4 and 6 a light finish is welcome. But it should be a deliberate choice rather than an accident. Making the group *pick which row fires* for each analyst, rather than reading them the answer, is the difference between doing the work and watching it.

## A finding that belongs to station 3, not station 7

The draft settles where the roster's digits came from, and it matters for [station-3-rule.md](station-3-rule.md).

**The draft's station 3 gives 7** — its twenty cards split 2 / 1 / 2 / 2 into box א׳ across the four pairs, summing to exactly the 7 the roster carries. So the roster's 7 was never arbitrary: it is the draft's own answer, for a **different set of cards**. Lotem's later `תחנה_3.docx` replaced the card set and the rule wording without re-deriving the digit, and that new set gives 9.

Checking the rest of the roster against the draft:

| תחנה | draft | roster | source of the roster's digit |
|---|---|---|---|
| 1 | 3 | 3 | draft ✓ |
| 2 | 9 | 2 | Lotem's docx, which states it outright |
| 3 | 7 | 7 | draft ✓ — but her new card set gives 9 |
| 4 | 4 | 4 | draft ✓ |
| 5 | 0 | 2 | Lotem's docx |
| 6 | 0 | **2** | **neither — unexplained** |
| 7 | 7 | 7 | draft ✓ |

So `3274227` is a mix of draft digits and Lotem's newer per-station docs — and **station 6's 2 comes from nowhere at all.** The draft says 0, the xlsx says 1 with four crossings or 7 with three. That is worth putting to Lotem directly.
