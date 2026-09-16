# Station 5 is too easy — options for a second part

_Raised by Hadas 2026-09-09. **Settled and built 2026-09-16: option B.** What follows is the reasoning as it stood; the outcome is at the bottom._

## The problem

Station 5 as specified is one comparison. Ten labelled trucks, four features, find the one feature that explains the labels, apply it to six unlabelled ones. Realistically **60 to 90 seconds** in a 7-minute slot.

Set against station 1:

| | Station 1 | Station 5 |
|---|---|---|
| Material | 8 tables, 12–18 rows each | 16 cards |
| Rules to hold at once | 3 (status, duplicates, missing values) | 1 |
| Passes through the data | 8 | 1 |
| Realistic time | over 7 minutes | 60–90 seconds |

This is not a healthy spread of difficulty across an event. Station 1 is already flagged in the build spec as probably *too much* for 7 minutes; station 5 is at the opposite extreme. A group that flies through station 5 in 90 seconds and grinds through station 1 for the full 7 gets a very uneven evening.

Worth being clear that **this is not a flaw in the transcription.** `תחנה_5_.docx` is internally consistent, its key is correct, and the app implements it faithfully — verified mechanically: of the four features, colour, wheels and box each appear on both sides of the labelled split, so only `אנטנה` can be the rule. The station is simply small as designed.

## What is not the answer

- **More trucks.** Going from 6 unlabelled to 16 adds tedium, not difficulty. It is still one insight, just typed more times. It would also change the digit.
- **A reflection or discussion screen.** This is an event, not a lesson, and the time after a station is solved already belongs to the bonus quests. Ruled out — see *What this is, and what it is not* in the build spec.

## Option A — clustering, graded as a partition

Show 8–10 trucks with **no labels at all** and have the group sort each into pile א or pile ב. The app grades **which trucks end up together**, not which pile is which — both orientations count as correct.

- Delivers the concept's missing half: the station is `למידה מפוקחת ולא מפוקחת` and currently exercises only the supervised side.
- The grading rule *is* the teaching: without labels you can find the structure but you cannot name it, and the app enforcing that says it better than any text would.

**The risk, and it is a serious one.** Clustering has no determinate answer unless the groups are genuinely well separated. This is exactly what has blocked station 6: its KNN has no answer because "similar" was never defined numerically. If the trucks vary loosely across four features, "how would you group these" has several defensible answers and you get an argument at the table with three attempts on the clock.

It only works if the card set is built so that **every truck in א is alike on every feature and differs from every truck in ב on every feature**, with nothing sitting between the two clusters. That is a real constraint on whoever writes the cards, and it can be checked mechanically before shipping.

## Option B — a second labelled set with a two-feature rule ← CHOSEN, built 2026-09-16

After the one-feature rule, a second batch of labelled trucks where the rule is a **conjunction** — antenna *and* closed box, for instance — then a fresh set of unlabelled ones to apply it to.

- Genuinely harder: a conjunction cannot be found by scanning one column, so it forces a real second pass.
- **Completely unambiguous.** Unlike option A there is exactly one right answer and nothing to argue about.
- It is the same skill escalated rather than a new one, which is why Hadas finds it more intuitive.
- Cheapest to build: it reuses the interaction that already exists, just twice.

**Consequence to decide deliberately:** if station 5 becomes two supervised rounds, its concept label should change from `למידה מפוקחת ולא מפוקחת` to `למידה מפוקחת`. That is honest, and it is a small change in the app — but it means **unsupervised learning is then previewed nowhere in the event.** Given that the evening previews seven algorithms and cannot cover everything, that is a defensible trade, but it should be a decision rather than a drift.

## What is needed from Lotem, either way

A card set. Specifically:

- **For option B:** a second labelled batch where exactly one *pair* of features explains all the labels and no single feature does, plus a set of unlabelled trucks to apply it to. The number of trucks does not matter much; 8 labelled and 6 unlabelled would roughly double the station.
- **For option A:** 8–10 unlabelled trucks forming two tight, well-separated clusters.

## Constraints that hold whichever way this goes

- **The digit stays 2 and keeps coming from part 1** — how many of the first six carry. Part 2 becomes an extra gate to solve the station, so `3274227` is untouched and no other station is affected.
- Both parts must be right to solve the station; there is no partial credit, consistent with the rest of the app.
- The attempt policy is currently 3 submissions with no per-card feedback. If the station doubles in size, 3 may want to become 4 — worth revisiting at the same time.
- Whatever the new cards are, the key gets verified mechanically before it ships, the way the antenna rule was: prove the intended rule works, and prove no *other* rule also works.


---

## What was built

Option B, on 2026-09-16, with the card set written here rather than by the content author.

### The conjunction that was built first, and thrown away

Round two started as `אנטנה יש AND ארגז סגור`. Hadas played it: **too easy.** The reason is worth keeping, because it is not obvious and it disqualifies every AND rule:

> With a conjunction, *the features that all the carriers share **are** the rule.* One pass over the carriers hands it over, and the non-carriers never get read at all.

That is the same one-step move round one teaches — scan a column — just with two columns instead of one. The traps built into the non-carriers were never reached.

### What shipped: two features that only mean anything together

**A truck carries when exactly one of `אנטנה יש` / `ארגז סגור` holds — never both, never neither.**

| | צבע | אנטנה | גלגלים | ארגז | |
|---|---|---|---|---|---|
| W-01 | לבן | יש | 6 | פתוח | נושאת |
| W-02 | חול | יש | 8 | פתוח | נושאת |
| W-03 | חול | אין | 6 | סגור | נושאת |
| W-04 | לבן | אין | 8 | סגור | נושאת |
| W-05 | לבן | יש | 8 | סגור | לא |
| W-06 | חול | יש | 6 | סגור | לא |
| W-07 | חול | אין | 8 | פתוח | לא |
| W-08 | לבן | אין | 6 | פתוח | לא |

Six to classify: V-01 (לבן·יש·8·פתוח ✓), V-02 (חול·יש·6·פתוח ✓), V-03 (חול·אין·8·סגור ✓), V-04 (לבן·יש·6·סגור), V-05 (חול·יש·8·סגור), V-06 (חול·אין·6·פתוח).

**Why this one cannot be shortcut.** The four carriers share **no** feature. Neither do the four non-carriers. So intersecting either side yields nothing, and the only way in is to notice that `אנטנה` means the opposite thing depending on the `ארגז` beside it. That is what "two differentiating features" actually looks like, as against two features stacked.

**Verified, not asserted.** 144 rules a person might propose — every single feature, every AND / OR / XOR of two, every AND / OR of three — swept over the eight labels. Two survive, and they are the same function written from opposite ends (negating both sides of an XOR leaves it unchanged); they agree on every unlabelled truck. No single feature fits. Round one was swept identically and is unique at `אנטנה יש`.

The six to classify cover all four `(אנטנה, ארגז)` combinations, and **no single feature predicts their answers either** — so a group cannot get all six right while holding a wrong rule. None repeats a labelled truck, in either round.

It also splits 4/4, which round one does and the conjunction could not: an AND rule is true of one combination in four, so it could only ever produce two carriers out of eight.

**Decisions taken with it:**

- **Concept is now `למידה מפוקחת`.** Unsupervised learning is previewed nowhere in the evening. This was the known cost of option B and Hadas took it deliberately.
- **3 attempts** — briefly 4, back to 3 on 2026-09-16 — and a rejected submit frames each round green or red with a ✓ or ✗ in its header, never a truck. The frame is the feedback, matching how stations 3 and 7 mark a card; the verdict sentence is generic and just points at the ✗.
- **One submit for both rounds**, like station 1. No phases; no other station has them.
- **The digit is unchanged at 2** and still comes from round one alone.

**The risk to watch.** This is the harder direction, and an interaction rule is a real step up from a column scan — it is the classic case a single split cannot separate. If groups stall on round two in testing, the lever is hint 2, which already points at "two features that depend on each other" without naming them.