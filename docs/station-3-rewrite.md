# Station 3 — the rewrite that closes the rule contest

_Written in Cowork 2026-09-16, with Hadas. **This supersedes [station-3-rule.md](station-3-rule.md)**, which framed the problem as a question for the content author. It is not one. This doc replaces the six example cards, rewords or replaces nine of the twenty, and states the rule the station is actually built on._

**Status: BUILT on `dev` 2026-09-16, with two changes from the plan below. Still pending Hadas's Hebrew pass and Lotem's confirmation.** The Hebrew on the new cards has not had a native reader's eye, and the project's standing rule is that Hebrew register needs one on every pass.

**Change 1 — card 12.** The plan's `מה סוג המטען ברכב?` was replaced with **`מה כיוון הנסיעה של השיירה?`**. The cargo is *the thing being concealed* in this scenario, so a group that had correctly learned "ג׳ is what they are keeping from us" had a real case for putting it there — the same failure the rewrite exists to remove, reintroduced by a card the rewrite itself added. A direction is a label with more than two values that nobody hides. Hadas also rejected an intermediate suggestion, `מה רמת האיום… נמוכה, בינונית או גבוהה?`, for being long and printing three options where every other card prints two or none.

**Change 2 — per-card feedback after a rejected submit.** Hadas's request: *"after each submit, I want the cards to show which are right and which are wrong."* Every card now carries a ✓ or a ✗ and a green or red edge, the verdict counts them (`16 מתוך 20 כרטיסים במקום הנכון`), and a card's mark drops the moment it is moved while the others keep theirs. It never says which box a wrong card belongs in.

The reason it is worth having: *"you are wrong somewhere in twenty cards"* gives a group nothing to act on, which is the same complaint that reshaped station 6.

**But it opens a brute-force, and the maths is exact.** Submit any sort and you learn which cards are wrong. Move every wrong card to a second box and submit again; the ones still wrong must be the third. **Three attempts is exactly enough to place all twenty without ever finding the rule.** That is not hypothetical — it is the obvious move for a group that notices, and it costs them nothing but bookkeeping.

**Closed by dropping to `maxAttempts: 2`**, Hadas's call the same day. With two attempts the second submit has to be a simultaneous two-way guess on every wrong card at once, which no group lands, so the feedback stays precise and the exploit disappears.

**The two settings are now locked together and the code says so.** Three attempts plus per-card marks *is* the brute-force — raising the attempt count without turning `revealWhichWrong` off reopens it exactly. That makes station 3 the strictest station of the evening, deliberately: the feedback is the most precise in the app, so the budget is the shortest.

Worth re-reading after play-testing. If two attempts proves too harsh, the lever is not a third attempt — it is coarser feedback. Per-box error counts (`בקופסה א׳ יש 2 כרטיסים לא נכונים`) are actionable, not exploitable, and would carry three attempts safely.

**Change 3 — the digit, and the tally stays.** The plan proposed awarding 7 outright, which is right, but did not note that station 3 is the only station that **shows box counts on screen** — so a group would read 8 / 8 / 4 and be handed a 7. Hadas's call was to keep the counts, because they help a group see they have sorted all twenty. That turns out to cost nothing: the union sheet's `הספרה = כרטיסים בקופסה א׳` is **not rendered anywhere**, the boxes carry no labels, and nothing on screen claims the digit comes from a tally. There is no contradiction to see. `digit: 7`, `rule: 'literal'`, counts still displayed.

---

## Why this is needed

Four findings, each one narrowing the problem. The fourth is the one that decides it.

### 1. The source contradicts itself, and it is Lotem's contradiction, not a transcription error

`תחנה_3.docx` was re-read in full on 2026-09-16. All six example cards and all twenty card texts in `src/data/station-3.js` match it verbatim. Nothing was introduced during the build.

But the same file contains both readings. Its union sheet types the answers:

| קופסה | סוג השאלה |
|---|---|
| א׳ | סיווג — התשובה היא קטגוריה (כן/לא, **שם**, סוג) |
| ב׳ | חיזוי — התשובה היא מספר רציף (**כמות**, זמן, מרחק) |
| ג׳ | לא קשור — אין לנו את המידע / לא ניתן לחיזוי |

and its two ג׳ example cards are a **name** (`מה שמו של מפקד יחידה 4400?`) and a **quantity** (`כמה שיירות תועדו ב-ג'נתא ביום שלישי?`), both of which that table assigns elsewhere.

### 2. The source has no answer key, so nobody ever decided

Nowhere does the docx say which box any of the twenty cards belongs to. On paper there is no grading step at all: the group sorts, counts box א׳, writes the number down, and nothing checks the sort.

So this is not Lotem's decision being misread. It is a decision that was never made, which the paper version could leave open and an app cannot. The build had to grade against something, picked the only rule stated in prose, and recorded the choice in a comment. That was the right default at the time.

### 3. ג׳ was never one category

Its two examples are in ג׳ for two *different* reasons. The commander's name is there because nobody can know it. The documented convoys are there because it already happened and was written down. The superseded draft says so outright: *דוגמה אחת היא מידע שלא קיים אצלנו, והשנייה היא מידע שכבר רשום בטבלה*.

A group is asked to infer one rule from two cards that are there for two reasons. That is the root cause, and it is why no consistent sort of the twenty exists.

### 4. The station shows the group no data, so "do we have this?" is unaskable

This is the finding that settles it, and it came from Hadas.

Station 1 has its tables. Station 4 has the fleet. Station 5 has the ten labelled trucks. **Station 3 has twenty question cards and three boxes, and nothing else.** There is no corpus, no table, no file anywhere in the station.

So any rule that turns on "is this already in our data" cannot be evaluated by a group, because they have never been shown what our data is. That is why both Hadas, solving it cold, and Claude Code, building it, independently reached the answer-type reading: it is the only rule judgeable from the card text alone.

The availability idea is therefore not a competing rule the station could adopt. It is unaskable here. And the only thing in the entire station that implies a corpus is one example card, `כמה שיירות תועדו ב-ג'נתא ביום שלישי?`. Replace that card and the contradiction has nowhere left to live.

### What this means for the current build

The app's existing key is **right on nineteen of twenty**. Only card 3 (`כמה שיירות חצו ב-ג'נתא אתמול?`) sits in the wrong box, and only because it was matched to the example card being replaced. The seven `contested: true` flags describe a real ambiguity in the source, and the rewrite removes the ambiguity rather than resolving it card by card.

---

## The rule

- **א׳** — the answer is a label, and it is something we work out. (סיווג)
- **ב׳** — the answer is a number, and it is something we work out. (חיזוי)
- **ג׳** — not a prediction at all: the answer is a fact someone is deliberately hiding, and no amount of data produces it.

The test that decides every card: **is there a moment ahead of us, or a hidden fact, where the answer gets revealed and we could check whether we were right?** If yes, it is a prediction, and then it is א׳ for a label or ב׳ for a number. If the answer is something a person is keeping from us, it is ג׳.

**These definitions are for this doc, Lotem and the facilitator sheet. They must not appear on screen.** The boxes stay unlabelled, per the source's *אין תוויות על הקופסאות!* and the existing note in `src/stations/boxes.js`. The labels are the answer.

---

## The six example cards

Replaces `EXAMPLES` in `src/data/station-3.js`.

| קופסה | כרטיס | |
|---|---|---|
| א׳ | האם הרכב אזרחי או צבאי? | from source, unchanged |
| א׳ | מה סוג הכביש שבו תיסע השיירה? | **new** |
| ב׳ | כמה שעות ייקח להעביר את המטען? | from source, unchanged |
| ב׳ | בכמה ק"מ לשעה תאט השיירה בכביש ההררי? | from source, unchanged |
| ג׳ | מה שמו של מפקד יחידה 4400? | from source, unchanged |
| ג׳ | האם הנהג יודע מה הוא מוביל? | **new**, replaces `כמה שיירות תועדו ב-ג'נתא ביום שלישי?` |

The two new cards do the teaching, and neither is decorative:

**`האם הנהג יודע מה הוא מוביל?`** is the card that carries the whole station. Set against א׳'s `האם הרכב אזרחי או צבאי?`, it shows two yes/no questions in different boxes: one is on the outside of the truck, the other is inside someone's head. Without it, ג׳ contains only `מה` questions and the station collapses into grammar.

**`מה סוג הכביש שבו תיסע השיירה?`** puts a `מה` card in א׳, so the examples themselves demonstrate that the opening word is not the rule. Strictly optional — the station works with the source's original א׳ pair — but dropping it costs a signal that only the examples can send.

The old א׳ example `האם המעבר פעיל או חסום?` leaves the example set because card 1 of the twenty is effectively the same question, and an example that duplicates a card to be sorted is a free point.

---

## The twenty cards

Replaces `CARDS` in `src/data/station-3.js`.

| # | הכרטיס | קופסה | change |
|---|---|---|---|
| 1 | האם מעבר הגבול פעיל או חסום? | א׳ | — |
| 2 | בכמה ק"מ לשעה נוסעת השיירה כרגע? | ב׳ | — |
| 3 | כמה שיירות יחצו ב-ג'נתא הלילה? | ב׳ | reworded |
| 4 | האם המשאית צבועה לבן או חול? | א׳ | — |
| 5 | כמה טונות שוקל המטען? | ב׳ | — |
| 6 | האם הנהג אזרח או חייל? | א׳ | — |
| 7 | מה כמות הגשם הצפויה הלילה? | ב׳ | reworded |
| 8 | האם הציר פעיל כרגע? | א׳ | — |
| 9 | כמה אנשים בחוליה יודעים על המשלוח? | ג׳ | **replaced** |
| 10 | האם הרכב רשום כאזרחי? | א׳ | — |
| 11 | בכמה דקות ייסגר המעבר? | ב׳ | — |
| 12 | מה סוג המטען ברכב? | א׳ | **replaced** |
| 13 | כמה אנשים נוסעים בשיירה? | ב׳ | reworded |
| 14 | מה הסיסמה הפנימית של יחידה 4400? | ג׳ | — |
| 15 | האם המשאית תעצור בדרך? | א׳ | reworded |
| 16 | כמה שעות תיסע השיירה עד הגבול? | ב׳ | reworded |
| 17 | מה תוכן השיחה בין הנהגים? | ג׳ | — |
| 18 | האם יש ציוד נוסף ברכב? | א׳ | — |
| 19 | כמה ליטרים דלק תצרוך השיירה בדרך? | ב׳ | reworded |
| 20 | האם הנהג יודע שעוקבים אחריו? | ג׳ | **replaced** |

**Counts: א׳ 8, ב׳ 8, ג׳ 4.**

### Why each change

**Five are pure tense fixes: 3, 13, 15, 16, 19.** Every one was past tense (`חצו`, `נסעו`, `עצרה`, `נסעה`, `נצרכו`), which is precisely what made them read as lookups rather than predictions and is where six of the seven `contested` flags came from. In the future tense they are plainly predictions with no second reading available. This is the single highest-value edit in the set and it changes almost nothing else about the cards.

**Card 7 changed its opener only**, `כמה מ"מ גשם יירד הלילה?` to `מה כמות הגשם הצפויה הלילה?`. Same question, same box, different first word. It exists to break the grammar correlation — see below.

**Card 9 was a verbatim duplicate of ג׳'s first example card.** A card that is already sitting in a box is a free point. Replaced with `כמה אנשים בחוליה יודעים על המשלוח?`, which is a hidden fact in `כמה` clothing.

**Card 12 (`האם יש מצלמות אבטחה במעבר?`) was genuinely arguable** and had to go regardless of which rule won: infrastructure you would scout rather than predict, defensible in either א׳ or ג׳. Replaced with `מה סוג המטען ברכב?`, a label we work out, in `מה` clothing.

**Card 20 (`האם הנהג עבר הכשרה מיוחדת?`) was the other genuinely arguable one** — biographical, neither clearly inferable nor clearly hidden. Replaced with `האם הנהג יודע שעוקבים אחריו?`, which is unambiguously a hidden mental state.

**Eleven cards are untouched.** The rewrite is deliberately conservative: it is Lotem's card set with its ambiguities removed, not a new one.

### Cards that survived a second look

**Card 10, `האם הרכב רשום כאזרחי?`** The word **רשום** points at a registry, the same way **תועדו** did in the example card being deleted, and under the old availability reading it was arguable. Under this rule it is not: ג׳ no longer means "recorded", so there is no competing box and the card is a plain label question. Kept as-is. If it still reads as a lookup to Hadas or Lotem, `האם הרכב מוגדר כאזרחי?` removes the last trace.

**Card 18, `האם יש ציוד נוסף ברכב?`** Stays in א׳. It is the thing the night's analysis is actually classifying, inferred from what can be observed, which is the same shape as station 5's task one station later. It was flagged `contested` in the old build; it is not contested under this rule.

---

## The grammar shortcut

The old set was sortable by the opening word **nineteen times out of twenty** (`האם`→א׳ nine of nine, `כמה`→ב׳ seven of eight, `מה`→ג׳ three of three). Hadas solved the station that way in a few minutes and got all twenty first time, which means the station could be beaten without ever meeting its idea.

Four cards now break that pattern deliberately:

| # | opener | box |
|---|---|---|
| 7 | מה | ב׳ |
| 9 | כמה | ג׳ |
| 12 | מה | א׳ |
| 20 | האם | ג׳ |

Plus both new example cards, which show `מה` in א׳ and `האם` in ג׳ before the group touches a single card.

A group sorting purely by grammar now scores **16 of 20**, and with all-or-nothing grading that fails. The shortcut stops working without any card becoming ambiguous. That is the trade: difficulty from a clean line drawn in a non-obvious place, never from a blurry line.

**This makes the station harder than the version Hadas solved**, and her difficulty read came from a route that no longer exists. Re-time it with real participants before the event. `maxAttempts: 3` with `revealWhichWrong: false` may no longer be the right setting; 4 is the obvious lever if it plays too hard, and it is a one-line change.

---

## Implementation

### `src/data/station-3.js`

- Replace `EXAMPLES` and `CARDS` with the tables above.
- **Drop the `contested` flag and the `contested()` helper entirely.** Nothing is contested any more, and leaving the flag invites someone to re-litigate a closed question. Rewrite the file's header comment: the source contradiction is resolved, not documented-and-worked-around.
- **`DIGIT_BOX` and `countIn` no longer produce the digit.** Under the new set the boxes are 8/8/4 and no box holds 7. Keep `countIn` if the tally rendering wants it, but the digit is awarded outright.

### `src/data/stations.js`

Station 3's entry changes in two places:

- `digit: countIn(DIGIT_BOX)` becomes `digit: 7`.
- `answer.rule` becomes `'literal'`, and the `derive` function goes.

Station 6 already awards its digit outright for the same reason and no participant can tell, because nothing on screen shows a sum. That precedent is in `docs/build-spec.md`; follow it and note the change there.

**`CFG.lockCode` does not move.** It stays `3274227`, the facilitator sheet stays as printed, and `npm run check` should pass unchanged. If it does not, something else broke.

### `src/stations/boxes.js`

No structural change. The three-button-per-card interaction, the unlabelled boxes, the `--box-1/2/3` hues and the all-or-nothing verdict all stand.

### The hints

Both current hints were written against the old rule and both survive, but re-read them against the new set before shipping:

1. *שני הכרטיסים שבכל קופסה חולקים משהו, וזה לא הנושא שלהם. הסתכלו על סוג התשובה שהשאלה מבקשת.* — still correct, and still the right first push.
2. *קופסה אחת לא ממוינת לפי סוג התשובה. שאלו מה משותף דווקא לשני הכרטיסים שבה.* — still correct, and sharper than before: under the new rule ג׳ genuinely is the box that is not sorted by answer type, and its two cards now share exactly one thing.

### Docs to update in the same commit

- `docs/build-spec.md` — rewrite the station 3 blocker (item 3 under *Blockers on stations 2 to 7*). It is closed, not open.
- `docs/station-3-rule.md` — mark superseded by this file at the top. Do not delete it; the analysis of how the contradiction arose is the reason this rewrite is trustworthy.
- `CLAUDE.md` — *Content status* says three stations have open questions. It is now two, stations 2 and 6.
- `claude/project-overview.md` and `claude/build-spec.md` in the Cowork project are copies and get refreshed from the repo.

### Verification

Do this the way stations 1 and 4 were verified, by re-deriving rather than trusting the table above:

1. Independently sort all twenty cards from the stated rule and compare against this key. Any disagreement is a card that needs rewording, not a key to patch.
2. Assert no card text appears in more than one box, and no card duplicates an example card.
3. Assert the opening word of a card does not determine its box across the set, so the shortcut cannot silently come back if cards are edited later.
4. Confirm no answer, digit or box assignment is reachable in the participant DOM, per the existing suite.

---

## Open, and for whom

- **The Hebrew on the six new cards needs Hadas's ear before it reaches the room.** They were written here, and the project's standing finding is that Hebrew register is the weakest thing produced in this workspace and needs a native reader on every pass, not a proofread.
- **Lotem confirms rather than decides.** The evidence for this rule is her own: ג׳'s first example card, the draft's annotation of the two ג׳ examples as two different reasons, and the docx's discussion card framing the task as *קיבלתם דוגמאות, חילצתם כלל, החלתם אותו על 20 מקרים חדשים*. The station's stated design is that the rule comes out of the examples. The union sheet is a counting aid, not the definition.
- **Re-time the station with real participants.** It is meaningfully harder than the version that was play-tested.
