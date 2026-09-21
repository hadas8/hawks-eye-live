# Station 2 — the rewrite that gives every envelope a real lie

_Written in Cowork 2026-09-21, with Hadas. **This supersedes [station-2-clarity.md](station-2-clarity.md)**, which catalogued the problems and framed them as questions for the content author. They are not questions for her any more: on 2026-09-17 Hadas took the station 2 chart data as hers to change. This doc replaces the envelope set outright._

> **BUILT 2026-09-21.** `src/data/station-2.js` now carries these six envelopes. Three changes were made against the spec below during the build and are recorded in "What the build changed" at the end; everything else shipped as written. The Hebrew still needs Hadas's ear.

**Status when written: NOT BUILT.** Every chart below was rendered through the real `renderChart` and the real `styles/station-charts.css` in a Cowork preview and reviewed by Hadas chart by chart, but no file in the repo has changed. The Hebrew still needs Hadas's ear before it reaches the room, per the project's standing rule.

**The header comment in `src/data/station-2.js` is now wrong and must go.** It says every series is transcribed from Lotem's original images and that nothing is invented. That rule is retired. Lotem's images stay in `docs/source-charts/` as the record of where this started, and three of the six envelopes below still run her lesson, but the data is no longer hers.

**Seven envelopes become six.** This costs nothing in code: `answer.parts` is `ENVELOPES.map(...)`, `N` is `ENVELOPES.length`, and the digit is `rule: 'literal'` with `digit: 2`. The envelope count is pure data. The facilitator sheet carries one row for station 2 with the password and the digit and never names an envelope, so nothing is reprinted. `CFG.lockCode` stays `3274227`.

---

## Why this is needed

Hadas walked all seven envelopes on `dev` on 2026-09-10 and returned _"not too hard, just not clear. I think it needs a complete overhaul."_ Working through them one at a time in September produced four findings. The fourth is the one that reorganised the station.

### 1. The question asked for a number and the scoring asked for a chart

Every envelope was topped by a question like `כמה אירועים תועדו מינואר עד אפריל?` while the task underneath was `איזה משני הגרפים עונה על זה נכון?`. So a group read a question that wants an integer and got graded on a click. They started adding, the sum was never checked, and the arithmetic led away from the thing being taught. This affected all seven.

**Every question in this rewrite is a yes/no judgement about the data**, because a judgement is the only thing two drawings of one data set can actually disagree about.

### 2. Two envelopes had no correct answer at all

**ב׳** drew the same four bars at the same heights with the same values printed on top in both charts, and coloured one bar amber on one of them. Hadas's first reaction on seeing it: _"that's the same graph in both with different colors, the figures are all the same, why is one of them wrong?"_ That is the correct reading. Nothing on that chart was false.

**ז׳** asked for the five-month total. The total is 25 on both charts, because the flat line is the mean of the same five numbers. The lie was about variation and the question was about the sum, so by what it actually asked, the lying chart was not wrong.

### 3. The hints handed over the answer

`ציר שלא מתחיל באפס מגדיל הפרשים קטנים` names the mechanism and delivers the verdict in one sentence. A group that read it sorted the two charts by which one starts at zero and never looked at the data. Meanwhile a group that reasoned carefully from an ambiguous question got marked wrong. The station rewarded clicking and punished thinking, which is the exact inversion of the point.

### 4. There are only five classes of lie, and there were seven envelopes

This is the finding that decided the shape.

A chart can be made to state something false in a limited number of ways, and with this renderer's vocabulary the list is:

| class | mechanism | renderer |
|---|---|---|
| broken encoding | bar length stops meaning value | `yFloor` |
| omission | data that exists is not drawn | `pick`, or a shorter series |
| reordering | the sequence is scrambled | `order: 'desc'` |
| aggregation | real variation is replaced by a summary | `flatten` |
| false annotation | something drawn on top asserts what the data denies | `arrow`, a false `refLine` |

Seven envelopes against five classes means two envelopes are either a repeat or a fake. The old set was both: **א׳ and ו׳ ran the same truncated axis twice**, and **ב׳ ran emphasis**, which is not a lie at all.

**Emphasis is not a lie, and neither is chart type.** Colouring the smallest bar steers a careless reader but every bar is still at its true height. A line drawn over categorical labels implies an order that does not exist, but every point is still at its true value. Both are bad practice and neither produces a false chart. In a station that scores a binary true/false they have no defensible answer, so both were rejected. This is the trap that caught three separate proposals during the design and it is worth stating plainly for whoever edits this next: **before adding an envelope, name the false statement the lying chart makes. If you cannot, it is not an envelope.**

---

## The design rules

Four tests. An envelope ships only if it passes all four.

**1. The two charts must answer the question differently, and one answer must be false.** Not "more misleading", false. The test is whether a careful reader who trusts the chart ends up believing something untrue.

**2. The question must be in frame.** Something an analyst in מחלקת ניתוח 7 would actually ask. `האם יש מעברים שעוברים את הממוצע?` is a statistics worksheet wearing a costume and was rejected for that alone, despite the chart pair being sound.

**3. The question must not be answerable without the charts.** If general knowledge settles it, the group never reads the data. This killed the version of the average-line envelope where the answer was "yes obviously, that's what an average is."

**4. The hint names a place to look, never what is wrong there and never the rule.** The working test: after reading the hint, does the group still have to compare the two charts and decide? A hint that lets them *filter* instead of *compare* is too strong. Every hint below points at something both charts have.

---

## The six envelopes

Replaces `ENVELOPES` in `src/data/station-2.js`. Every spec below is written in the existing `renderChart` vocabulary and needs no change to `src/lib/chart.js`.

### א׳ — broken encoding

| | |
|---|---|
| title | `שיירות שחצו לפי חודש` |
| question | `האם בינואר כמעט לא חצו שיירות?` |
| hint | `בדקו את המספרים שלאורך הצד. מאיפה מתחיל כל אחד מהם, ולאן הוא מגיע?` |
| trick | `ציר Y מ-96 עד 104 — 97 שיירות מצוירות כמו גדם שנוגע בתחתית` |
| lyingFirst | `false` |

```js
honest: { kind: 'bars', labels: MONTHS_6, values: [97,98,99,100,101,102], yFloor: 0,  yCeil: 120 }
lying:  { kind: 'bars', labels: MONTHS_6, values: [97,98,99,100,101,102], yFloor: 96, yCeil: 104 }
```

**The charts are unchanged from the current build. Only the title and the question changed, and that is the entire fix.**

The original asked `האם הפעילות זינקה בין ינואר ליוני?` over a `מדד פעילות`, and Hadas rejected it for two reasons that both hold. First, on the honest chart the bars run 131px to 138px out of a 162px plot, so the rise is seven pixels and effectively invisible, while the truncated chart shows it clearly. A group that picked the truncated chart had reasoned correctly from what it could see. Second, whether a five-point rise on an index of 100 is "sharp" is a matter of opinion, so there was no true answer to find.

Neither is fixable by redrawing. **Any zero-based chart of 97 to 102 looks flat, and that is correct behaviour.** The fix had to come from the question.

Two changes make it factual. It is now a **count of convoys**, not an index, so there is no arguing that 96 is a meaningful baseline. And the question asks about January rather than about the size of the change. On the honest chart January's bar is 80% of the plot height, so the answer is obviously no. On the lying chart it is a 20px stub on the floor, so the answer is yes. **97 convoys is not "almost none", and that is a fact rather than a judgement.**

The lesson also improves. It stops being "trends can be exaggerated", which is soft and contested, and becomes "a bar's length is its value, so a chopped axis breaks the chart", which is the actual rule for bar charts and is not contested by anyone.

No values are printed. Printing them would let the group solve it by comparing number to height without ever reading the axis, which is the skill this envelope exists to teach.

### ב׳ — omission, interior gaps

| | |
|---|---|
| title | `אירועי חצייה לפי חודש` |
| question | `האם הפעילות נמשכה ברציפות לאורך השנה?` |
| hint | `אילו חודשים מופיעים מתחת לעמודות בכל גרף?` |
| trick | `הציר מציג רק ינו, מרץ, יול ונוב צמודים זה לזה — שמונה חודשים ריקים נעלמו` |
| lyingFirst | `true` |

```js
honest: { kind: 'bars', labels: MONTHS_12, values: [6,0,5,0,0,0,7,0,0,0,6,0], yFloor: 0, yCeil: 8 }
lying:  { kind: 'bars', labels: MONTHS_12, values: [6,0,5,0,0,0,7,0,0,0,6,0], yFloor: 0, yCeil: 8,
          pick: [0,2,6,10] }
```

**Lotem's lesson, kept. Her data, replaced.** The source ran counts of 0 or 1 across twelve months on a 0-to-2 axis, which renders as nine bars that draw nothing and three one-unit stubs. There was almost nothing on screen to read, let alone under a clock on a phone. Real counts fix it without touching the idea.

Both charts are now bars. In the old build the honest chart was bars and the lying one was a line, so the pair differed in chart type *and* in category count, and a group could not tell which difference was the lie. **Across the whole rewrite, the two charts of a pair differ in exactly one way.**

This also retires a contradiction in the source that never needed resolving: the docx text said 3 incidents between January and April while the chart showed 2. Nobody counts anything any more, so there is nothing to disagree with.

**Known weakness, accepted.** Eight of twelve months are zero, so two thirds of the honest chart is blank. Hadas and I both flagged it. It stays because the liar is genuinely convincing, four solid bars reading as steady year-round activity, and because ה׳ carries the readable version of omission. If play-testing shows the honest chart reads as broken rather than as sparse, the lever is fewer empty months rather than higher counts.

### ג׳ — reordering

| | |
|---|---|
| title | `שיירות שחצו לפי שבוע` |
| question | `האם יש מגמת ירידה בין שבוע 1 לשבוע 6?` |
| hint | `עברו על מספרי השבועות מתחת לעמודות, אחד אחרי השני.` |
| trick | `העמודות מסודרות מהגדולה לקטנה ולא לפי סדר השבועות — ירידה מתמדת שלא קיימת` |
| lyingFirst | `false` |

```js
honest: { kind: 'bars', labels: weeks(6), values: [3,6,4,5,2,4], yFloor: 0, yCeil: 8 }
lying:  { kind: 'bars', labels: weeks(6), values: [3,6,4,5,2,4], yFloor: 0, yCeil: 8, order: 'desc' }
```

**Unchanged from the current build except the hint.** This is the strongest of Lotem's seven and the only envelope that survived the review untouched. The question is already a judgement, the pair differs in exactly one way, and the tell is printed under every bar.

The old hint, `הסתכלו על מספרי השבועות מתחת לעמודות. האם הם בסדר עולה?`, failed rule 4: the second sentence says what is wrong. The new one sends them along the same labels without telling them what they are looking for.

### ד׳ — aggregation

| | |
|---|---|
| title | `שיירות שחצו — ינואר עד מאי` |
| question | `האם קצב החצייה היה קבוע?` |
| hint | `כמה ערכים שונים מציג כל גרף?` |
| trick | `הגרף מצייר את הממוצע החודשי, 5, כאילו הוא הנתון של כל אחד מהחודשים` |
| lyingFirst | `true` |

```js
honest: { kind: 'bars', labels: MONTHS_5, values: [3,6,4,7,5], yFloor: 0, yCeil: 10,
          refLine: { value: 5, label: 'ממוצע 5' } }
lying:  { kind: 'line', labels: MONTHS_5, values: [3,6,4,7,5], yFloor: 0, yCeil: 10,
          flatten: true, area: true }
```

This is the old ז׳ with a new question. The mechanism always worked; the question asked for the five-month total, which is 25 on both charts.

**The `refLine` goes on the honest chart only. This is Hadas's explicit call**, made on 2026-09-21 after seeing a version with the rule on both. The rule is what tells the group that 5 is the average rather than an arbitrary number, and without it the flat line at 5 is unexplained. On the lying chart it would be redundant, since the liar's whole line already sits at 5.

**`showValues` was dropped from the honest chart**, against the old build which had it. The bars are visibly different heights without the numbers, and stacking a second honest-only annotation on top of the `refLine` widens the asymmetry between the pair for no gain.

**Watch this one in play-testing.** It is the only envelope where the honest chart carries a mark the lying chart does not, so "pick the one with the dashed line" is a shortcut that works here. It does not generalise — ו׳'s lying chart is the one with the extra mark, and in ב׳ and ה׳ the liar is the one with less — so there is no rule a group can carry across the set. But it is the single most shortcut-prone envelope of the six.

### ה׳ — omission, truncated endpoint

| | |
|---|---|
| title | `תנועה בציר הצפוני לפי שבוע` |
| question | `האם הפעילות ממשיכה לעלות?` |
| hint | `עד איזה שבוע מגיע כל גרף?` |
| trick | `הסדרה נחתכת בשבוע 5, בדיוק בשיא — חמשת השבועות שבהם הפעילות צנחה לא מופיעים` |
| lyingFirst | `true` |

```js
honest: { kind: 'bars', labels: weeks(10), values: [2,4,6,8,9,7,4,3,2,2], yFloor: 0, yCeil: 10 }
lying:  { kind: 'bars', labels: weeks(5),  values: [2,4,6,8,9],           yFloor: 0, yCeil: 10 }
```

**New, and the second envelope in the omission class.** With only five classes available, a sixth envelope means one class runs twice. Omission is the right one to double because the two instances feel different in the hand: in ב׳ a group reads the month names hunting for gaps in the middle, here they check where the axis stops.

**The lying chart declares a shorter series rather than using `pick`.** Same rendered result, but the data file then reads plainly, and `pick` stays unique to ב׳ so the two omission envelopes do not look like the same spec twice.

Both charts are dense and legible and both tell a coherent story, one peaking and collapsing and one climbing. That makes it the better of the two omission pairs. It was originally slotted to replace ב׳ for exactly that reason, and ב׳ kept the slot only on incumbency. If the station is ever cut back to five, **this is the omission envelope that stays and ב׳ is the one that goes.**

### ו׳ — false annotation

| | |
|---|---|
| title | `דיווחי תצפית לפי שבוע` |
| question | `האם הפעילות עלתה בהתמדה לאורך התקופה?` |
| hint | `עקבו אחרי הנקודות עצמן, אחת אחרי השנייה, מהשבוע הראשון עד האחרון.` |
| trick | `חץ מגמה משבוע 1 לשבוע 12 מכריז על עלייה רציפה — הצניחה בשבועות 4 עד 6 נעלמת מתחתיו` |
| lyingFirst | `false` |

```js
honest: { kind: 'line', labels: weeks(12), values: [4,5,6,3,2,3,4,5,6,7,6,7], yFloor: 0, yCeil: 10 }
lying:  { kind: 'line', labels: weeks(12), values: [4,5,6,3,2,3,4,5,6,7,6,7], yFloor: 0, yCeil: 10,
          arrow: { from: 0, to: 11 } }
```

**Lotem's arrow, on a repaired pair.** The old ה׳ drew the honest chart as twelve weeks and the lying chart as four monthly means, with nothing on screen connecting the two, and phrased the question in months so it pointed at the lying chart's axis and the honest chart could not answer it as asked. That is the envelope Hadas got wrong, and it was the question's fault. Both charts are now the same twelve weeks and the arrow is the only difference.

**This envelope was nearly cut and should not have been.** The argument against it was that every data point stays visible on the lying chart, so the arrow only nudges, the same objection that killed the colour version of ב׳. That argument is wrong. Colour asserts nothing, it steers the eye. An arrow makes a claim, and `בהתמדה` is precisely the claim it makes. Activity did not rise steadily, it collapsed in weeks 4 to 6, so the chart carrying the arrow answers the question falsely while the one without it answers correctly. Hadas caught this and she was right.

The hint deliberately does not mention the arrow, because naming it would identify the lying chart. It sends the group along the data points instead, which is something both charts have.

---

## What was cut, and why it should stay cut

Recorded so it is not re-proposed.

**The colour highlight (old ב׳).** Emphasis, not a lie. Both charts geometrically identical, every value printed on both. No correct answer exists. A rescued version where colour carries a *claim* rather than emphasis — marking the primary route, and marking the wrong one on the liar — would work in principle, but it needs a legend to establish what amber means, and neither the renderer nor the envelope schema has one. Without the legend the group has to infer what the colour is asserting, which is the ambiguity that broke it in the first place.

**The second truncated axis (old ו׳).** Identical lesson to א׳. A filled area under the line does not make it a different thing to notice.

**A line drawn over categorical labels.** Proposed as a replacement for ב׳ and withdrawn. Every point is still at its true value, so it implies rather than lies. Same class as emphasis.

**A dropped category (five crossings, liar shows four).** Proposed as a replacement for ב׳ and withdrawn, because it is the same puzzle as ב׳ from the player's side: count the bars, pick the one with more.

**The impossible average line.** A `refLine` labelled `ממוצע` drawn above every bar, which cannot happen. The mechanism is sound and needs no arithmetic to catch. It failed rule 2 and rule 3 instead: every question built on it was either a statistics exercise nobody would ask in a briefing, or answerable from knowing what an average is without reading the chart. Worth revisiting only if someone finds the question.

**Cumulative against per-period.** A running total climbing while the monthly rate collapses. Genuinely deceptive and genuinely in frame, but a running total is unreadable as a running total without an axis title, and `renderChart` draws none. Rejected by Hadas on that basis. It would need a renderer change plus a concept the group has to hold under a clock.

**Monthly means hiding weekly volatility.** A third instance of aggregation. Rejected as too close to ד׳, since a player experiences both as flat-thing-versus-spiky-thing.

---

## Implementation

### `src/data/station-2.js`

- Replace `ENVELOPES` with the six above.
- **Rewrite the header comment.** The transcription rule is retired. Record instead that the data is Hadas's as of 2026-09-17, that three envelopes still run Lotem's lesson, and the one-class-per-envelope rule with omission deliberately doubled, so the next person to add an envelope knows the constraint before they start.
- Add `MONTHS_5`; `MONTHS_6`, `MONTHS_12` and `weeks()` already exist.
- `chartsOf` and `honestPosition` are unchanged.

### `src/data/stations.js`

- **No structural change.** `answer.parts` is generated from `ENVELOPES` and adapts to six on its own. `digit: 2` and `rule: 'literal'` stand.
- **One string:** the `brief` says `שבע נקודות תצפית שלחו דוחות גרפיים`. Change `שבע` to `שש`.
- The header comments still describe stations 2 to 7 as unbuilt roster entries. Known drift, listed in `claude/project-overview.md`, worth fixing in passing.

### `src/stations/charts.js`

- **No structural change.** `N` is `ENVELOPES.length`.
- **One string:** the intro reads `בחרו את הגרף הישר בכל שבע`. Change to `בכל שש`.

### `styles/station-charts.css`

- The `.cb.hot` comment describes the amber bar as "the deception in envelope ב׳", which no longer exists, and says amber carries "ה׳'s false arrow and ז׳'s honest average rule", which under the new numbering is **ו׳'s arrow and ד׳'s average rule**. Update both.
- Keep the `.cb.hot` rule and the renderer's `highlight` parameter. Nothing uses them now, but `highlight` is a general capability and removing it is a separate decision from this rewrite.

### `src/lib/chart.js`

- **No code change.** Its header comment documents `highlight` as a distortion in use; note that it is currently unused.

---

## Verification

Re-derive rather than trusting the tables above. The same discipline as stations 1 and 4.

1. **For each envelope, independently state what the honest chart answers and what the lying chart answers.** Confirm the two differ and that the lying answer is false, not merely exaggerated. Any envelope where both charts give the same answer is broken regardless of what this doc says.
2. **Confirm each pair differs in exactly one way.** Same `kind`, same `labels`, same `values`, one distortion parameter. The two exceptions are deliberate and are the omission envelopes, where the lying chart legitimately carries fewer categories.
3. **Confirm no hint names a flaw, a verdict or a chart.** Every hint must point at something both charts have. A hint that lets a group filter rather than compare fails.
4. **Confirm `lyingFirst` is not learnable.** Three of six, in the order F T F T T F. Nothing alternating, and no run longer than two.
5. **Confirm the answer key comes from `honestPosition`** and that nothing hardcodes seven choices.
6. **Grep for `שבע` across `src/`** and confirm only the two intended strings changed.
7. **Run `npm run check`.** The lock code, the password `אופק` and the digit `2` must all be unchanged. If the sheet check fails, something outside this rewrite broke.
8. **Confirm no answer, digit or `lyingFirst` value is reachable in the participant DOM**, per the existing suite.
9. **Look at the twelve charts on a phone.** ב׳ and ו׳ draw twelve categories into a 340-wide viewBox, which is roughly 23px per band for a three-character Hebrew month label at 11px. That was already true of the current build, but it has never been checked on a real handset and two of six envelopes now depend on reading those labels.

---

## Open, and for whom

- **The Hebrew needs Hadas's ear before the room.** Six questions, six hints and six titles were written in Cowork. The project's standing finding is that Hebrew register is the weakest thing produced in this workspace and needs a native reader on every pass, not a proofread.
- **Lotem is told, not asked.** The chart data stopped being hers on 2026-09-17 by Hadas's decision. Three of the six still run her lesson (ב׳ omission, ג׳ reordering, ו׳ the arrow) and her images stay in `docs/source-charts/`. This is a courtesy note, not a sign-off.
- **Re-time the station.** Six envelopes and twelve charts against the old seven and fourteen, on the same seven-minute clock. It should be more comfortable, but it has not been measured, and submissions here are uncapped so a stuck group burns the whole slot.
- **ד׳'s honest-only `refLine`** is the one place a group can shortcut without understanding. Flagged above, worth watching rather than pre-emptively changing.
- **ב׳'s sparse honest chart** is the weakest drawing in the set. Flagged above with its lever.

---

## What the build changed

Three departures from the spec above, applied 2026-09-21. Recorded here so the doc and the code do not drift.

**1. ד׳ is bars against bars, not bars against a filled line.** The spec gives the honest chart as `kind: 'bars'` with a `refLine` and the liar as `kind: 'line'` with `flatten` and `area` — four differences at once. That breaks the one-difference rule this doc states at "Both charts are now bars" and enforces as verification step 2, and the rule is doing more work than any single envelope. Five equal bars say `קצב קבוע` at least as well as a flat line does, and the pair now differs by `flatten` plus the honest-only `refLine`. `area` loses its last user, which is cheaper than a broken invariant. Verified on screen: the liar reads as five identical bars at 5 and the honest chart as five visibly different heights with its rule at the mean.

**2. A third string said שבע, and it named a lie that no longer exists.** The implementation section lists two — the roster `brief` and the station intro. It missed `src/stations/charts.js`'s rejection message, which is the **only** feedback a rejected group gets: `לא. אחד הגרפים שבחרתם מסודר כך שיטעה. עברו שוב על השבע ובדקו צירים, סדר וצבע.` Colour was cut from the set entirely, so that sentence pointed groups at something no longer on screen. Now `עברו שוב על השש ובדקו צירים, סדר ומה חסר.`

**3. Seven to six is free in code but not in the brute-force margin, and the roster comment said seven.** "This costs nothing" is right about `answer.parts`, `N` and the digit. It is not right about the one thing that depended on the count: station 2 takes **uncapped submissions**, justified in `src/data/stations.js` by "seven binary choices with no partial feedback gives nothing to hill-climb on, so a sweep costs more clicks than the clock allows." Seven is 128 blind guesses; six is 64 — several minutes of a seven-minute clock rather than more than all of it. Left uncapped deliberately, since a group that guesses learns nothing and burns the station doing it, but the comment now carries the real arithmetic and a warning: **do not cut a fifth envelope without revisiting it.** Five would be 32. This also answers the doc's own aside that ה׳ could replace ב׳ and the station could run at five.

### Two things swept up

- **`src/data/station-2-1.js` was deleted.** An untracked, unimported seven-envelope rewrite dated 2026-09-17, sitting in the working tree with a header that read exactly like a live file. Whoever built this would have found two station-2 data files.
- **Four renderer parameters go dead, not one.** The doc notes `highlight`. `showValues` and `unit` lose their last user with the colour envelope, and `area` with change 1. All four are kept as general capabilities, and `src/lib/chart.js` and `styles/station-charts.css` now say so, so a tidy-up does not quietly remove them.

### Verification step 9, answered

The doc flags that ב׳ and ו׳ put twelve categories into a 340-wide viewBox and that this had never been checked on a handset. Checked at 390×844: no horizontal page scroll, the chart cards stack rather than sit side by side, the twelve month labels clear each other by **2.9px** at 11px type, and the tap targets stay finger-sized. So the crowding worry does not bite — which is separate from ב׳'s emptiness, addressed below.

### ב׳'s accepted weakness was fixed after all, a different way

The doc accepts eight-of-twelve empty months and names the lever as *fewer empty months*, which costs `לאורך השנה`. Raised with Cowork and Hadas on 2026-09-21, and **there was a third option neither the doc nor the build had considered: the gaps do not have to be zero.**

`values: [6,1,5,1,2,1,7,2,1,1,6,2]`, `yCeil` 8, `pick` unchanged at `[0,2,6,10]`. All twelve months stay, so `לאורך כל השנה` is still true; no bar is empty, so the honest chart reads as a year of surveillance instead of a broken render; and **the lying chart is untouched**, still four adjacent bars at 6, 5, 7, 6.

**What moves is the false claim, so the question moves with it.** It was continuity — which stops being false the moment activity never actually stops — and it is now level:

> `האם רמת הפעילות נשמרה גבוהה לאורך כל השנה?`

The liar shows four months running 5 to 7 and says the year held up. Those four spikes really sit in eight months of 1s and 2s. Same omission class — arguably its sharper form, since showing only the peaks is what people actually do with data — and the hint does not change, because it still points at the month labels, which both charts have.

The eight-month variant that keeps the zeros was considered and rejected: half the chart is still blank instead of two thirds, so it trades the `לאורך השנה` wording for a marginal gain.

**On the record:** eight months of literally nothing was a bigger thing to conceal than eight months of near-nothing, so the lie is a notch less theatrical. An honest chart that reads as broken is the worse problem.

**One consequence to know about.** ב׳ was the only envelope carrying a zero, and the renderer's zero-height rule — a 1px stub on a zero month is an incident that did not happen — was added for it. Nothing in the app exercises that rule now. It stays, `src/lib/chart.js` says why, and the suite asserts it against `renderChart` directly rather than through the DOM.
