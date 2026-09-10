# Station 3's sorting rule is stated twice, differently

_For the conversation with Lotem. Written 2026-09-10, alongside building the station. **Station 3 is now built and playable on `dev`** — this is not a blocker on implementation. It is a blocker on trusting the digit._

## The station works

Transcribed from `תחנה_3.docx`: six pre-sorted example cards in three unlabelled boxes, twenty cards to sort the same way, a live tally of each box. It plays. The boxes go in with no labels, as the source insists, and the group is told nothing about which card it got wrong.

One change to the interaction, worth flagging: the source has the group **drag paper cards into boxes**. On screen each card carries three buttons instead. Dragging twenty cards on a tablet, in a dark room, against a seven-minute clock is a dexterity test rather than a thinking one, and the outcome is identical.

The concept stays in the header like every other station's. It was briefly hidden on the grounds that `סיווג מול חיזוי` names two of the three boxes; Hadas overruled that, correctly — the group has not met either term yet, so the words carry no meaning to give away.

## The station is solvable from the first word of each card

Hadas solved it in a few minutes and got all twenty right first time, by this route: everything opening `האם` into one box, everything opening `כמה` into the second — then noticing that the third box already held a `כמה` card naming ג'נתא, and sending the matching card there.

Checked mechanically over all twenty: **the opening word predicts the box correctly nineteen times out of twenty.**

| opener | cards | box |
|---|---|---|
| `האם` | 9 | א׳, all nine |
| `כמה` / `בכמה` | 8 | ב׳, seven of the eight |
| `מה` | 3 | ג׳, all three |

The single exception is **card 3**, `כמה שיירות חצו ב-ג'נתא אתמול?`, which the key puts in ג׳ — and it is catchable purely by resemblance to ג׳'s own example card, which is the same question about the same place on a different day. No understanding of classification or regression is required at any point.

This cuts two ways.

**It makes the rule contest below much less dangerous in practice.** All seven contested cards open with `האם` or `כמה`, so the grammatical shortcut sends every one of them exactly where the union sheet sends them. Groups will overwhelmingly produce the sheet's key, which is the one the app grades against. The contest is still a real defect — a group that reasons semantically can still be marked wrong — but it is a tail risk rather than a coin flip.

**It also means the station can be beaten without meeting its idea.** Whether that is a problem is a judgement about the event, not about the code. The event is a competition and a preview rather than a lesson, so a group finishing fast on a word pattern is not a failure. But nothing in the seven minutes pushes anyone toward "is the answer a category or a number", which is the thing station 3 exists to preview. If that matters, the fix is to break the correlation deliberately — a few `מה` questions whose answer is a category and belong in א׳ (`מה סוג הרכב?`), and a few `האם` questions that belong in ג׳. That is content, so it is Lotem's to write.

## The problem: the sheet and the example cards teach different rules

The union sheet defines the boxes by **the type of the answer**:

| קופסה | סוג השאלה |
|---|---|
| א׳ | סיווג — התשובה היא קטגוריה (כן/לא, **שם**, סוג) |
| ב׳ | חיזוי — התשובה היא מספר רציף (**כמות**, זמן, מרחק) |
| ג׳ | לא קשור — אין לנו את המידע / לא ניתן לחיזוי |

The six example cards, which are the only thing a group actually sees, sort by **whether the answer is available**:

- ג׳ example 1 — `מה שמו של מפקד יחידה 4400?` — is a **name**. The sheet puts names in א׳.
- ג׳ example 2 — `כמה שיירות תועדו ב-ג'נתא ביום שלישי?` — is a **quantity**. The sheet puts quantities in ב׳.

So a group that reads the examples correctly learns "ג׳ is for things we can't get", and then meets seven cards where that reading and the sheet's reading disagree. There is no way for the group to know which one is being scored.

## What each reading does to the counts

The app currently follows **the sheet**, because it is the only rule written down anywhere.

| קופסה | by the sheet (built) | by the examples |
|---|---|---|
| א׳ | **9** | 5 |
| ב׳ | **7** | 4 |
| ג׳ | **4** | 11 |

The seven contested cards, all of which the sheet sends to א׳ or ב׳ and the examples send to ג׳:

| # | הכרטיס | sheet | examples |
|---|---|---|---|
| 12 | האם יש מצלמות אבטחה במעבר? | א׳ | ג׳ |
| 13 | כמה אנשים נסעו בשיירה? | ב׳ | ג׳ |
| 15 | האם המשאית עצרה בדרך? | א׳ | ג׳ |
| 16 | כמה שעות נסעה השיירה? | ב׳ | ג׳ |
| 18 | האם יש ציוד נוסף ברכב? | א׳ | ג׳ |
| 19 | כמה ליטרים דלק נצרכו בדרך? | ב׳ | ג׳ |
| 20 | האם הנהג עבר הכשרה מיוחדת? | א׳ | ג׳ |

Card 13 is the sharpest case: it asks for a quantity about a convoy that has already driven, which is the same shape as ג׳'s own second example, word for word — and the sheet sends it to ב׳.

Note that the sheet's own check, `סה"כ חייב להיות 20`, is satisfied by both readings, so it does not settle anything.

## Where the roster's 7 came from — settled 2026-09-10

Reading the original draft answers this. **The draft's station 3 gives 7**: a different set of twenty cards, split across four pairs, putting 2 + 1 + 2 + 2 into box א׳. So the roster's 7 was never arbitrary — it is the draft's own answer for a **card set that no longer exists**. Lotem's later `תחנה_3.docx` replaced the cards and reworded the rule without re-deriving the digit, and the new set gives 9.

That also explains the shape of the problem below: the draft's box א׳ is defined as *התשובה היא קטגוריה*, cleanly, and its ג׳ examples are annotated in the draft as two deliberately different reasons — *דוגמה אחת היא מידע שלא קיים אצלנו, והשנייה היא מידע שכבר רשום בטבלה*. The two-rule confusion is not in the draft. It arrived with the rewrite.

## The lock code — closed, not a question for anyone

The union sheet says the digit is the count in box א׳, which over this card set is 9 rather than the roster's 7. **This is not a problem.** Which box gets counted is arbitrary — the group sorts the same twenty cards either way and sees the same three tallies — so the station counts box ב׳, which is 7, and `CFG.lockCode` stays `3274227`. The physical lock is untouched. It also happens that 7 is a number visible on their own screen, so nothing on the page contradicts the digit they are handed.

## What is needed from Lotem

0. **Whether the grammar shortcut is acceptable — a question, not a recommendation.** Nineteen of twenty cards are sorted correctly by their opening word alone. **Hadas's position is that the difficulty is already right** (she solved it in a few minutes, got it first time, and does not want it made harder), so this goes to Lotem only to check whether the shortcut is what she intended. If it is, nothing changes.
1. **Which rule governs** — the sheet's answer-type rule, or the availability rule the example cards actually demonstrate? If it is availability, the sheet's wording for א׳ and ב׳ needs rewriting, and two example cards need replacing so the two rules stop pointing in opposite directions.
2. **The seven contested cards.** Whichever rule wins, these should be reworded so they cannot be argued both ways. Three submissions with no feedback is unforgiving of a card that has two defensible homes.

**Only the rule matters.** The digit is settled and needs nobody. What is not settled is that a group can reason correctly from what it is shown and still be marked wrong.
