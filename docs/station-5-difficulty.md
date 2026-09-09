# Station 5 is too easy — options for a second part

_For the conversation with Lotem. Raised by Hadas 2026-09-09. **Nothing here is built.** Station 5 ships as it is until this is decided._

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

## Option B — a second labelled set with a two-feature rule ← Hadas leans here

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
