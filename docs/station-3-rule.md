# Station 3's sorting rule is stated twice, differently

_For the conversation with Lotem. Written 2026-09-10, alongside building the station. **Station 3 is now built and playable on `dev`** — this is not a blocker on implementation. It is a blocker on trusting the digit._

## The station works

Transcribed from `תחנה_3.docx`: six pre-sorted example cards in three unlabelled boxes, twenty cards to sort the same way, a live tally of each box. It plays. The boxes go in with no labels, as the source insists, and the group is told nothing about which card it got wrong.

One change to the interaction, worth flagging: the source has the group **drag paper cards into boxes**. On screen each card carries three buttons instead. Dragging twenty cards on a tablet, in a dark room, against a seven-minute clock is a dexterity test rather than a thinking one, and the outcome is identical.

One thing had to be hidden. Every other station prints its concept in the header — `ניקוי נתונים`, `עצי החלטה`. Station 3's concept is **`סיווג מול חיזוי`**, which names two of the three boxes outright. It is now shown only on the solved screen, which is where the seminar's own "intuition first, name after" rule wants it.

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

## What this does to the lock code

The union sheet says `הספרה = כרטיסים בקופסה א׳`. Under the sheet's rule that is **9**, not the **7** the roster carried.

So `CFG.lockCode` has moved from `3274227` to **`3294227`**, which is what the app now expects at the vault. **This is a physical lock in the room** and it has to be reset to match, so it is worth deciding before anyone sets it.

The alternative is a one-character change. **7 is the count in box ב׳** under the sheet's rule, so redefining the digit as box ב׳ restores the old code exactly:

```js
// src/data/station-3.js
export const DIGIT_BOX = 'ב';   // was 'א'
```

Nothing else changes; the roster digit and the lock code both derive from it.

## What is needed from Lotem

1. **Which rule governs** — the sheet's answer-type rule, or the availability rule the example cards actually demonstrate? If it is availability, the sheet's wording for א׳ and ב׳ needs rewriting, and two example cards need replacing so the two rules stop pointing in opposite directions.
2. **Whether the digit is box א׳ or box ב׳**, given that box א׳ means resetting the physical lock to 3294227.
3. **The seven contested cards.** Whichever rule wins, these should be reworded so they cannot be argued both ways. Three submissions with no feedback is unforgiving of a card that has two defensible homes.

Until 1 and 3 are settled the station is playable but its key is not safe: a group can reason correctly from what it is shown and still be marked wrong.
