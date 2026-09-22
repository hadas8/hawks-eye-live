# עין הנץ — Build Spec

_Updated 2026-09-08 in Cowork. Read this first. It supersedes the mechanics sections of `project-overview.md`._

Source material: the Drive folder `1P9wJ3NlPZ6Er5CwdTQkQBl9JJfCW3nQa` (owner lotemtubul@8200.org.il). Per Hadas, the draft `חוסם_הציר_שלישייה.docx` is superseded by every other file in the folder. `נראות התחנות` is the authoritative per-station app interaction spec and is still partial (stations 6 and 7 not written).

## Naming and frame

**מבצע עין הנץ.** The draft's name חוסם הציר is dropped; the frame is unchanged. Intelligence analysis unit 7 of Unit 8200, the Syria to Lebanon smuggling route, **Hezbollah's** Unit 4400 moving a strategic cargo, 02:17, seven stations, seven digits, one physical box. Both attributions come from the draft's opening card (יחידת ניתוח 7 — אמ"ן, יחידה 4400 של חיזבאללה) and were missing from the prototype's copy; restored 2026-09-08. The draft's אמ"ן was replaced with יחידה 8200 per Hadas: the participants are high-schoolers who may not decode the acronym, and 8200 is the seminar's own frame.

## What this is, and what it is not

**It is an event, not a lesson.** A fast competitive round that previews algorithms the participants will learn over the coming year. It is not a teaching tool, and it does not owe any concept a full treatment.

Consequences, all of which have been got wrong at least once here:

- **No reflection or discussion screens in the app.** No "what did you notice", no debrief panels, no post-digit thinking questions. The draft's `לדיון אחרי הפתרון` cards on stations 5 and 7 are facilitator material and stay out of the app.
- **The time after a station is solved belongs to the bonus quests.** It is already designed and already scored, 5 points each, counted by facilitators on paper. Anything the app puts there is competing with it.
- **A concept gets named once and that is the whole dose.** The station's solved screen says `האלגוריתם שהרגע הפעלתם נקרא X`. That is the preview. The reveal names the field once more and stops.
- **A station does not have to exercise its whole concept.** Station 5 is `למידה מפוקחת ולא מפוקחת` and only exercises the supervised half. That is correct. An unsupervised second beat was designed and rejected on these grounds.
- **A short station is not a broken station.** Station 5 is one insight and will run well under its 7 minutes. Do not pad a station to fill the clock; the format already absorbs early finishers.

## Timer

- **Per station, 7 minutes.** Starts the moment a group submits the correct password for that station. No global session clock.
- Groups are deliberately staggered. A late start means a late finish, so a bathroom break costs a group nothing.
- Solve early and the app holds the group. The room fills that gap with facilitator-given social quests that live entirely outside the app.
- Hit 0:00 unsolved and the station closes.
- Either way the group lands on the next station's password screen and waits. Only the facilitator's spoken password moves anyone forward, and the facilitator waits until every group's 7 minutes have elapsed.
- Persist the station's **start timestamp**, never a remaining count, so a mid-station refresh cannot grant extra minutes.
- The facilitator holds the password list on paper. **There is no facilitator panel in the app.** A `?dev` query param exposes a clearly-marked dev strip for testing; it must be removed before the event. The strip carries a row of seven numbered buttons that drop straight into any station, mid-run with the clock started, built or not — ordered 1 to 7 left to right, matching the ribbon. A jump clears that station's digit, score, attempts, hints and draft first, so landing on a station twice behaves identically both times rather than starting with spent attempts and a banked digit.

Timing to plan around: 7 × 7 = 49 minutes of station time plus password screens, opening and closing. The draft's "45 דקות" narration line needs rewriting.

## Expiry and scoring

- Solve in time: **20 points**, digit shown in amber in the ribbon. Raised from 10 on 2026-09-12 — a station is worth four social quests, not two. Bonus quests stay at 5.
- Station closes unsolved, whether by clock or by exhausted submissions: the group **still receives the correct digit** so the box can open, but it lands **greyed** in the ribbon and scores **0**. **No strikethrough.** It was struck through in red until 2026-09-09; the ribbon is what the code is read off at the end, and a line through a digit at 23px is a misread waiting to happen at the lock. The dashed border and the muted colour carry the distinction on their own, and the closing screen says הספרה נמסרה לכם · 0 נקודות in words. The reveal marks it נמסרה. The closing screen distinguishes נגמר הזמן from נגמרו הניסיונות.
- Social bonus quests: **5 points each**, counted by facilitators on paper. The app never sees them.
- The app shows only the technical score (max 140) on the reveal screen and states that facilitators add the bonus points and announce winners. No cross-group comparison in the app, by design.
- **No speed bonus, deliberately.** Finishing fast buys time, time buys social quests, and social quests buy points. The incentive to move fast already exists without the app scoring it.

## Screen model

One SPA, one URL, no router, a single state machine.

`boot` → `briefing` → per station (`locked` → `active` → `solved` | `expired`) → `vault` → `reveal`

**Rendering replaces the whole stage, so anything scrolling inside it loses its position.** A pane that should survive a re-render carries `data-keep-scroll` with a stable name and `ui/render.js` restores it. Station 4 needed this: its question list is 1400px inside a 700px pane, so previewing question 14 sent the list back to question 1 and the group lost sight of what they had just tapped. The same applies to any future station with a scrolling pane.

Persistent chrome: the station clock and score in the top bar, and a code ribbon at the bottom, one slot per station (six) with three slot states (empty, earned, given).

**The code ribbon is the one part of the UI that runs left to right.** Station 1 is the leftmost slot, station 6 the rightmost, so reading the digits off the screen gives the code in the order it is entered into the physical lock. Laid out RTL like everything else it reads back-to-front, which is a real risk at the box with a room full of teenagers. The ribbon's Hebrew label stays in the RTL flow, to the right of the slots; only the slot group is LTR. The vault input is `dir="ltr"` for the same reason. Everything else in the app remains RTL.

- **The lock code is `327427`.** It moved exactly once, on 2026-09-21, when station 6 was removed and its digit came out with it; six stations means six digits. Which digit a station awards is arbitrary. A group solves the station, takes the number, and goes — nobody asks why station 3's digit is 7, the derivation is never on screen, and no participant can tell whether it came from their own arithmetic or from a table. Two stations award a digit their own data does not produce (3 counts box ב׳ rather than א׳; 6 is awarded outright) and it is invisible to everyone playing. **A station's digit disagreeing with the roster is not a defect and is not a question for the content author.** Set `station.digit`, move on. The physical lock in the room is set once.

- **Answer boxes are `type="text"`, never `type="number"`.** Fixed 2026-09-16 after Hadas reported Mac users' answers changing by themselves. A focused number input steps on a wheel or trackpad scroll and on arrow keys, so scrolling the page over a typed answer silently edited it — reproduced at 5 → 8 in three notches in station 1 and 7 → 10 in station 4. Both now use `type="text" inputmode="numeric" pattern="[0-9]*"` with the handler stripping non-digits, which keeps the tablet keypad and the digits-only guard that `type="number"` was providing. `wheelbug.mjs` dispatches a real CDP wheel event over each box — a synthetic `WheelEvent` from page JS is untrusted and will not step the value, so a JS-only test reports no bug and is wrong.

## Answer engine

Declarative per station, with a `custom` escape hatch:

- Sub-answer kinds needed across the seven: `number` (with tolerance), `choice` (stations 2, 3, 5 and 6), `pickN` (stations 4 and 6), `multiChoice`, `rows`, `pairPick`
- Combine rules: `digitalRoot`, `count`, `literal`, `custom`
- **Attempt policy comes from the station config, not a global rule.** Station 1 allows 3 submissions; station 2 is all-or-nothing with unlimited redos; station 3 allows 3 attempts; station 4 allows one retry. Running out closes the station immediately rather than leaving a group idle at a dead button.
- No lockout timer. After a failed submit, disable submit until an input actually changes.
- **Feedback granularity is a config flag, and it is coupled to the attempt cap.** With unlimited submissions any numeric feedback is brute-forceable, including an aggregate "X of 8" count, because a group can change one field and watch the count move. Station 1 therefore pairs `revealWhichWrong: true` with `maxAttempts: 3`: precise per-table ✓/✗, but too few tries to sweep a single-digit answer space.
- **Verdicts are sticky per sub-answer.** A table confirmed correct keeps its tick until that table changes; only the changed one loses its mark. Without this, a group re-verifies confirmed work inside a 7-minute window.
- Hebrew normalization on every text and password comparison: strip niqqud and quote marks, collapse whitespace, case fold, fold final letter forms (ם→מ, ן→נ, ץ→צ, ף→פ, ך→כ). Each password is an array of accepted strings.

## Station roster

Names taken from the draft, which are the real ones. **Passwords are final too**, adopted 2026-09-16: they were chosen here rather than supplied by the source, and Hadas took them as the real ones. Facilitators read them off paper, so a change means a reprint.

| # | Name | Concept | Digit | State |
|---|------|---------|-------|-------|
| 1 | הטבלאות המשקרות | ניקוי נתונים | 3 |
| 2 | הגרפים המשקרים | ויזואליזציית מידע | 2 | **built** |
| 3 | הכלל הנסתר | סיווג מול חיזוי | 7 |
| 4 | השאלה ששווה לשאול | עצי החלטה | 4 | **built** |
| 5 | מי קיבל תשובות ומי לא | למידה מפוקחת ולא מפוקחת | 2 | **built** |
| 6 | שמונה אנליסטים | Random Forest | 7 | **built** |

Lock code `327427`.

**ארבעה כוכבים (KNN) was station 6 and was removed on 2026-09-21**, at Hadas's call. It was the only station that **handed the group its rule** — the xlsx prints its five-step priority list in its own header — so it was execution rather than insight, and that is why none of the volume fixes landed: cutting 48 comparisons to 36 makes a chore shorter without making it a puzzle. Every other station asks a group to work out what is going on. `docs/station-6-neighbours.md` keeps the full analysis.

**The code lost that station's digit and nothing else moved:** `3274227` → `327427`. Old station 7 became station 6, keeping its password `חורש` and its digit 7; `גדר` retired and is not reused. Maximum technical score is now 120 rather than 140, derived from `STATIONS.length × pointsPerStation`. **Never add or remove a station without moving `CFG.lockCode` with it** — `npm run check` fails if the sheet and the build disagree, and it is the only thing that catches this.

## Station 1 — built and verified

Source: `תחנה_1_שמונה_טבלאות.xlsx`. **Five** tables, one number each, digit is the digital root of the sum.

The source has eight and Hadas cut it to five on 2026-09-12, after her team lead flagged the station as too long. Nothing was lost: the eight are not eight kinds of dirt, they are the same three rules — status wording, duplicate identifiers, missing values — run eight times over different data, so tables 6 to 8 taught nothing 1 to 5 had not. It takes a group from 128 rows to 80 inside the same seven minutes. **The digit survives honestly**: 5+6+4+8+7 = 30 and 3+0 = 3, the same digit the eight gave, so the digital root is still the group's own arithmetic rather than an awarded token.

Answers **5, 6, 4, 8, 7, 3, 6, 9**, sum 48, digital root **3**. Verified independently against tables 1, 3, 6 and 8 by hand, and since the build against **all eight** by re-deriving each count from the stated rule and comparing it to the key: status in {חצה, הושלם, CROSSED}, missing-value rows dropped first, then distinct identifiers counted. All eight match. Truth check shown to groups: the sum must fall between 30 and 60.

**The rule the answer key actually uses, which the source instructions never state:** a row with a missing value is unusable and is not counted, *even when its status says it crossed*. Without that rule table 1 gives 7, not 5. It must be stated on screen, and it is.

### Interaction

Groups **mark rows** in each table: one row per unique convoy that actually crossed. The marked count auto-fills that table's number in the union sheet. Typing a number overrides the marks; clearing the field or pressing חזרה לספירה אוטומטית reverts to them. Each cell shows מסומן or ידני so the source of the number is never ambiguous.

**Only the count is checked, not which rows were marked.** Duplicated convoys appear twice, so either copy is a legitimate representative and there are many valid mark-sets. Checking exact rows would fail correct reasoning.

### Instructions on screen

Deliberately minimal, after a first attempt at colour-coded rule cards tested worse than the plain version. One amber panel: the question, one line telling them to mark rows, three bullets, and a bolded attempts line.

1. חצה · הושלם · CROSSED count as crossings. ממתין · בוטל · כשל · נכשל do not.
2. The same identifier twice is the same convoy. Mark it once.
3. A row with — is not counted, even if it crossed.

**The ton/kg mixed units are not mentioned at all.** They are a distractor by design, so explaining them worked against both the exercise and the clarity. It used to survive as a fourth hint for a group stuck chasing it; **that hint was removed on 2026-09-09 as too revealing**, so the distractor now has no escape hatch anywhere in the app. Three hints remain. If groups are seen losing the station to the units rather than to the rules, that is the first thing to revisit.

**Pacing risk:** eight tables of 12 to 18 rows each in 7 minutes is very tight for teenagers. Time it with real participants; the likely fix is fewer tables rather than more time, since 7 minutes is fixed across all stations.

## Implementation

Built 2026-09-08. `docs/prototype.html` is superseded by the code and is kept only as a look-and-feel reference.

Vanilla ES modules loaded straight from `index.html` — no build step, no bundler, so the served files are the source files. Split by job: `state` (the one state object plus persistence), `flow` (transitions more than one module needs), `engine/answers` (grading), `data` (content), `screens` (one per screen), `stations` (one per station *kind*, behind a registry), `ui` (router, chrome, clock, fx, event delegation). See the README for the file map and for how to add a station.

Decisions taken during the build:

- **Interaction goes through delegated `data-act` / `data-submit` / `data-input` attributes on `#app`**, not inline `onclick` and a `window.go` global as in the prototype. Modules register handlers by name, so a station file owns its own actions.
- **The answer engine implements only what a built station needs** — the `number` kind and the `digitalRoot` rule. The remaining kinds the roster will need (`multiChoice`, `rows`, `pairPick`) are absent by design, and an unimplemented kind throws rather than silently grading as wrong.
- **The prototype's leftover per-column colour tokens were dropped.** `--c-id`, `--c-st` and `--c-wt` are gone; only the coral missing-value dash survives, as `--miss`. The union sheet's ידני tag, which used the identifier colour in the prototype, is now plain `--ink-dim`.
- **Persisted state is versioned** under `hawkseye.v1` with a schema field. A stored blob from an older shape is ignored rather than half-restored.
- **A station clock is never restarted.** `openStation` sets the start timestamp only if one is not already stored, so re-submitting a password cannot buy a group more time.
- **Scoring is idempotent.** Solving and closing both no-op if the station already holds a digit, so no path can score a station twice.
- **Fixed a prototype bug:** typing into a union cell takes an in-place patch path so the field does not lose focus, and in the prototype that path never rebuilt the table footer — so חזרה לספירה אוטומטית never appeared, and a group that typed a number could not get back to its marks. The footer now rebuilds on that path too.
- **The code ribbon and the vault input run LTR**, per the screen-model note above. This is a deliberate exception to the RTL rule in `CLAUDE.md`, not an oversight — do not flip it back.
- **`prefers-reduced-motion` no-ops `fx()` in JS as well as hiding the layer in CSS**, so no effect timers run at all. Nothing in the effects layer gates a state transition.
- **Local dev server is `tools/dev-server.js`**, zero dependencies, so testing needs no `npm install`. It is not deployed.

Verified in headless Chrome across 61 checks: the full station 1 path, Hebrew password normalization, marks vs. manual override, sticky per-table verdicts, the attempts cap, both closing paths (clock and exhausted submissions), refresh persistence mid-station, the vault and reveal, that the ribbon's on-screen left-to-right order spells the code, and that no password, digit or lock code appears in a participant-reachable DOM.

## Hebrew copy

Reviewed with Hadas 2026-09-08. The prototype's copy had a recurring tell: pairs of short declarative sentences separated by full stops where Hebrew wants one sentence and a connector. The pass joined those with אבל / ו / a colon / an em dash, dropped the full stops from headlines, and removed three word repetitions (יחידה twice in one clause, של twice in one clause, קוד twice in two adjacent sentences).

Rules that came out of it, for future copy:

- **Headlines take no closing full stop.** Where a headline is a deliberate antithesis, an em dash carries it: לא פתרתם חידות — הפעלתם אלגוריתמים.
- **Two short sentences in a row are a smell, not a rule.** Join them with a connector when the second depends on the first. Keep them apart when the break is the point.
- **The unit is יחידה 8200, and the team inside it is מחלקת ניתוח 7** — not יחידת ניתוח 7, which puts יחידה twice in one breath. This also departs from the draft, which says אמ"ן; the participants are high-schoolers who may not decode the acronym.

Deliberately left alone, so they do not get "fixed" later:

- **שש תחנות. שש ספרות. מטען אחד.** שבע until 2026-09-21. A rhetorical triad; the full stops are the rhythm and stay. The draft's third beat was קופסה אחת; changed to מטען אחד on Hadas's call 2026-09-09, so the opening names the thing they are actually hunting and pays off against המשלוח נעצר on the closing screen. A box is what the answer arrives in; the cargo is the point.
- **נגמרו השליחות, נגמרה התחנה.** Parallel construction, already comma-joined.
- **The station 1 rule bullets.** They are scanned under a 7-minute clock, not read; full stops separate rules faster than connectors would.
- Terse UI labels and result strings (נדחה, מסומן, ידני, X מתוך Y נכונים).

## Sizing

**The whole interface scales with the viewport.** Everything that should breathe — every font size, the reading column, the ribbon slots, the table, padding and gaps — is expressed in `rem`, and one fluid root size drives the lot:

```
html{font-size:clamp(15px, 0.3125vw + 12px, 20px)}
```

15px floor, 16px at 1280 wide, 17px at 1600, 18px at 1920, 20px ceiling from 2560 up. `--stage-max` is `64rem` rather than a pixel width, so the reading column grows with the type and the measure stays constant: 1024px at the 16px root, 1280px at the 20px root.

Why it was needed: at a fixed 16px inside a fixed 1020px column, the app read as a small island of text on anything larger than a laptop. A reviewer on a 27" monitor reported it as too small, correctly.

Two deliberate exceptions to the rem rule:

- **Media query breakpoints stay in px** (`@media (max-width:620px)`), because they measure the viewport, not the type.
- **`--tap` is `max(44px, 2.75rem)`.** Touch targets are physical: a finger does not get smaller on a small screen, so the 44px floor holds regardless of the root size. Verified at 44px on phone, tablet portrait and tablet landscape.
- Hairlines and 1–3px nudges stay in px. Scaling a 1px border produces blurry half-pixels for no gain.

The ceiling matters: the event runs on laptops and tablets, so 20px is where it stops rather than growing without limit on a desktop review screen. At 1280 the rendered values are within 4px of what they were before this change, so the machines the event actually runs on look the same as they did.

## Station 2 — rewritten, and the data is no longer the source's

Seven envelopes, each holding two charts of the same subject where one has been arranged to mislead. The group picks the honest chart in all seven. **Digit 2, `rule: 'literal'`, stated outright by the source and unmoved by the rewrite.** Password `אופק`. Full reasoning: [station-2-rewrite.md](station-2-rewrite.md); the history it replaces: [station-2-clarity.md](station-2-clarity.md).

**REWRITTEN 2026-09-21. The transcription rule is retired.** Every series used to be transcribed from Lotem's chart images and nothing was invented; Hadas walked all seven envelopes on 2026-09-10 (*"not too hard, just not clear. I think it needs a complete overhaul"*), and on 2026-09-17 she took the chart data as hers to change. The images stay in [`docs/source-charts/`](source-charts/) as the record of where this started, and three of the six still run Lotem's lesson — ב׳ omission, ג׳ reordering, ו׳ the arrow.

### What was actually wrong

Four findings. The first explains the confusion and the fourth decided the shape.

1. **The question asked for a number and the scoring asked for a chart.** Every envelope was topped by something like `כמה אירועים תועדו מינואר עד אפריל?` while the task underneath was *which of these two charts answers it correctly*. Groups started adding, the sum was never checked, and the arithmetic led away from the thing being taught. This affected all seven. **Every question is now a yes/no judgement**, because a judgement is the only thing two drawings of one data set can disagree about.
2. **Two envelopes had no correct answer at all.** ב׳ drew the same four bars at the same heights with the same printed values on both charts and coloured one bar amber — nothing on it was false. ז׳ asked for the five-month total, which is 25 on both charts, because the flat line is the mean of the same five numbers.
3. **The hints handed over the answer.** `ציר שלא מתחיל באפס מגדיל הפרשים קטנים` names the mechanism and delivers the verdict in one sentence. The station rewarded clicking and punished thinking.
4. **There are only five classes of lie, and there were seven envelopes.** So two were a repeat or a fake, and the old set was both: א׳ and ו׳ ran the same truncated axis twice, and ב׳ ran emphasis, which is not a lie.

### The five classes, and the rule for adding an envelope

| class | mechanism | renderer | envelope |
|---|---|---|---|
| broken encoding | bar length stops meaning value | `yFloor` | א׳ |
| omission | data that exists is not drawn | `pick`, or a shorter series | ב׳, ה׳ |
| reordering | the sequence is scrambled | `order: 'desc'` | ג׳ |
| aggregation | real variation replaced by a summary | `flatten` | ד׳ |
| false annotation | a mark on top asserts what the data denies | `arrow`, a false `refLine` | ו׳ |

One class per envelope, with **omission deliberately doubled** to reach six: ב׳ keeps only the peaks of a series, ה׳ stops the series before it turns, and the two feel different in the hand.

**ב׳'s quiet months carry 1 or 2, not 0** — Cowork and Hadas, 2026-09-21, replacing a build-day version where eight of the twelve were zero. Two thirds of the honest chart was blank and read as a broken render rather than as a year of surveillance. Dropping months instead would have deleted the lie along with them, so the fix had to come from the values. **The false claim moved with them, and the question had to move too:** it was continuity (`האם הפעילות נמשכה ברציפות`), which stops being false once activity never stops; it is now level (`האם רמת הפעילות נשמרה גבוהה לאורך כל השנה?`). The liar shows four months running 5 to 7 and says the year held up; those four spikes really sit in eight months of 1s and 2s. Still omission, and arguably the sharper version of it, because showing only the peaks is what people actually do with data. On the record: eight months of literally nothing was a bigger thing to conceal, so the lie is a notch less theatrical — an honest chart that reads as broken is the worse problem.

**Emphasis is not a lie, and neither is chart type.** Recolouring the smallest bar steers a careless reader but every bar is still at its true height; a line over categorical labels implies an order that does not exist but every point is still at its true value. Both are bad practice, neither produces a false chart, and in a station scored true/false neither has a defensible answer. Three separate proposals died on this. **Before adding an envelope, name the false statement the lying chart makes. If you cannot, it is not an envelope.** What was cut and why is recorded in the rewrite doc so it is not re-proposed.

An envelope also ships only if the question is one an analyst in מחלקת ניתוח 7 would ask, it cannot be answered without reading the charts, and **the hint names a place to look rather than what is wrong there** — every hint points at something both charts have, so a group has to compare rather than filter.

### The one-difference rule

**The two charts of a pair differ in exactly one way** — same kind, same labels, one distortion parameter. Three exceptions, all deliberate: the omission envelopes, where the liar legitimately carries fewer categories; ד׳'s `refLine`, an honest annotation rather than a second lie; and ז׳, the one envelope where **a figure differs**, because there the lie is a number rather than a drawing.

**"Both charts show identical data" was never a source rule — it was written here, and Hadas removed it on 2026-09-22:** *"the point is to have one graph answering the question and one graph lying about it."* The constraint had been enforced for two weeks and it killed the first build of ז׳. The station's on-screen intro said `שני הגרפים מציגים בדיוק את אותם נתונים` and now says `מתארים את אותו דבר`, which is true of all seven.

It remains the right default for six of the seven, and ז׳'s licence should not be copied without a reason as specific as its own — changing a figure is how you get two unrelated reports instead of one deception.

**This is why ד׳ is drawn bars-against-bars and not bars-against-a-filled-line**, which is what the rewrite doc specified. That pairing differs in four ways at once — kind, `flatten`, `area` and `refLine` — and five equal bars say `קצב קבוע` at least as well as a flat line does. `area` loses its last user, which is a cheaper price than a broken invariant. In the old build ב׳ had the same problem: honest bars against a lying line, so the pair differed in chart type *and* category count and a group could not tell which difference was the lie.

### ד׳'s average rule goes on BOTH charts, and this is the fix for the one envelope that did not work

Honest-only for a day, reversed 2026-09-22 after Hadas looked at it again: *"it still looks like two different sets of data."* She was right, and changing the question would not have fixed it, because the fault was structural.

**`flatten` is the only distortion here that REPLACES every value.** Every other envelope keeps its bars and does something to them — א׳ moves the axis, ב׳ and ה׳ drop some, ג׳ reorders, ו׳ draws on top — so in all five the pair visibly reads as one data set twice AND the liar carries a tell you can see on it: a strange axis, skipped months, scrambled labels, a series that stops, an arrow. ד׳ had neither. Five equal bars is a perfectly well-formed chart, and with nothing shared between the two, it read as a second measurement rather than the same one aggregated.

**The shared rule repairs both halves at once.** It is the bridge — both charts agree the average is 5, so they are visibly about one thing — and it is the tell, because on the liar every bar top sits *exactly* on the average line, which is what "this is the average, not the data" looks like. The redundancy that was the argument for keeping it off the liar is precisely what gives the liar away.

It also closes the shortcut the honest-only version opened. *"Pick the one with the dashed line"* no longer decides anything, and **ד׳ is now the cleanest pair in the set: `flatten` is the only difference between its two charts.**

**The question moved with it**, from `האם קצב החצייה היה קבוע?` to `האם היו חודשים שבהם חצו יותר מחמש שיירות?`. The old one asked for a judgement about constancy and invited "roughly, yes". The new one is a fact checkable against the rule now drawn on both charts: two bars clear it on the honest chart, none can on the liar. That is exactly what an average destroys.

`showValues` stays off. The bars are read against the rule, which is the skill, and printing 5,5,5,5,5 would hand the answer over.

### Feedback, and the attempt cap

Pass or fail and nothing else, per `נראות התחנות`. **`maxAttempts: 3`**, capped 2026-09-21 at Hadas's call; it ran uncapped until then, and the station module had no cap handling at all, so this was wiring as well as a number.

**Three rather than two, and station 2 is where that distinction matters most: it is the only station that gives no partial feedback whatsoever.** Station 4 is also `revealWhichWrong: false` but still shows how many each chosen question filtered; 1, 3, 5 and 6 all mark the parts right or wrong. Here a rejection says "no" and stops, so a second attempt is not informed by the first in any way — the group simply re-reads. An attempt therefore buys less here than anywhere else in the app.

The other half of it is that **a submission is seven independent judgements graded together**, and ז׳'s arrival made that worse rather than better. At 90% confidence per envelope a clean sweep is 48%; two attempts take that to roughly 73% and three to roughly 86%. Ending the station that teaches careful reading on one slip across fourteen charts is the wrong trade. Guessing is not the risk a cap defends against here — seven binary choices is 128 combinations, so three tries is a 2.3% guess; the cap exists so a stuck group cannot burn the whole slot resubmitting.

**Worth re-reading if an eighth envelope is ever proposed.** Each one added drags the clean-sweep odds down, and three attempts is already carrying a station with no partial feedback at all.

**Running out is not a dead end.** `closeStation('attempts')` hands over the digit so the code still completes, scores 0, and leaves the station struck through in the ribbon — the same treatment as running out of clock.

**Do not cut a fifth envelope without revisiting this.** Five would be 32 combinations, and would also drop the sweep probability the cap is sized against. If the station ever is cut to five, ה׳ is the omission envelope that stays and ב׳ is the one that goes.

**Hints are per envelope**, not station-wide: six independent puzzles, so a group stuck on ד׳ should not spend three hints reaching it.

### The charts are drawn, not imported

`src/lib/chart.js` renders inline SVG and takes the distortions as parameters rather than as faults to avoid — `yFloor`, `order`, `pick`, `flatten`, `area`, `arrow`, plus `refLine` as the one honest device. Drawing rather than importing keeps the distortions exact, keeps the repo free of an asset pipeline, and lets the charts theme to the dark palette and scale on a tablet.

**`highlight`, `showValues`, `unit` and `area` are now unused.** The colour envelope was cut, ד׳ dropped its printed values, and nothing fills an area any more. They are general renderer capabilities and stay; removing them is a separate decision. `styles/station-charts.css` keeps `.cb.hot` for the same reason, with a comment saying so.

**Amber inside a chart is not a tell.** It carries ו׳'s false arrow and ד׳'s honest average rule — one lying chart and one truthful one. That property has to survive any future edit.

### The liar's position is not learnable

The lying chart was GRAPH 1 in six of the source's seven envelopes, so "always pick graph 2" scored six of seven. It is redistributed: **four of seven, in the order F T F T T F T**, nothing alternating and no run longer than two. **The key is 1, 2, 1, 2, 2, 1, 2**, derived from `honestPosition` rather than written down anywhere.

The source's numeric chain, `5+4+3+4+4+4+5 = 29 → 2`, is unused: it does not derive from its own answers, and `נראות התחנות` replaces the numeric task with click-the-honest-chart. The digit is simply 2.

**A note on the source images themselves:** GRAPH 1 is titled in red and GRAPH 2 in blue, and red marks the liar in six of the seven. That is a facilitator aid, but if those images are ever put in front of participants the title colour gives the answer away. The app re-draws them, so it does not inherit the problem.

### ז׳ — the pie that cannot exist

Lotem's suggestion, 2026-09-22: *"לשים גרף עוגה שהסכום הוא 105% ולא 100% והשני תקין"*, built as she described it. Two pies over the same four crossings; one figure differs, אסאל אל-וורד at 22 against 27, taking the total from 100 to 105.

**A pie is a whole cut into parts, so parts totalling 105% describe nothing.** That chart is impossible rather than merely misleading, which makes this the sixth class of lie and the only one where the fault is in a figure rather than in the drawing. Question: `האם החלוקה בין ארבעת המעברים מסתכמת ב-100%?` — one pie answers yes, the other no.

**Both circles close**, because `renderPie` normalises. Drawing 105% at literal angles would lap the last slice over the first, which reads as a broken render rather than as a false report, and no real charting tool does it. The shape looks fine on both; the numbers are where the lie lives.

**Its weakness, on the record: this is the only envelope whose tell is arithmetic rather than something you see.** Four small numbers, twice. If it plays flat the lever is a bigger gap than five points, not a redrawn pie. An earlier build tried to avoid the arithmetic by making the pie's *form* the only lie, with identical figures on both charts and a bar chart as the honest twin — Hadas rejected it, correctly: with nothing wrong on the face of either chart, the question could not be answered by looking at them.

**The renderer gained `kind: 'pie'`** — normalised slices, one hue stepped by opacity (four flat slices in a single colour are unreadable, and a second hue inside one chart would break the pair-shares-a-colour rule), and a legend down the right where a Hebrew reader starts.

### Verified on build, 2026-09-21

Re-derived rather than trusted: each chart's drawn rows replayed through the renderer's own pipeline, and each pair confirmed to disagree in the one intended way. **א׳'s January bar is 81% of the plot honest and 13% lying**, which is the whole envelope. **ו׳'s arrow runs lower-right to upper-left**, which in RTL is the assertion of a rise, and sits on the chart that must be rejected. **ב׳'s liar keeps exactly the four peaks**, and the months it keeps are spread across the year rather than adjacent — the labels are the tell.

Checked on a 390px handset, which the old build never was: no horizontal scroll, the pair stacks rather than sitting side by side, and the twelve month labels clear each other by 2.9px at 11px type.

**No station carries a zero value any more.** The renderer's zero-height rule — a 1px stub on a zero month is an incident that did not happen — was added for ב׳ and is now unexercised by any station. It stays, and the scratchpad suite asserts it against `renderChart` directly rather than through the DOM, so it does not quietly rot.

Still open: **the Hebrew needs Hadas's ear** — six questions, six hints and six titles were written in Cowork, and Hebrew register is the weakest thing this workspace produces. **Lotem is told, not asked**, per Hadas's 2026-09-17 decision. And the station has not been **re-timed** at six envelopes against the old seven.


## Station 4 — built and verified

**The instructions say outright that more than one set of four works**, added 2026-09-16 at Hadas's request. Thirty-six of the 4,845 possible sets are valid. This is a *rule* of the puzzle rather than a clue toward it, which is why it sits in the instructions and not behind a hint: withholding it does not make the station harder, it makes a group that has already found a working set doubt it and go hunting for "the" one. The two hints stay for the two things that actually are clues — that a question the whole fleet answers alike eliminates nobody, and that four questions cutting in the same place are worth one.

Source: `תחנה_4_.docx`. Sixteen vehicles, twenty candidate questions, four allowed. The digit is the vehicle left standing: **4**.

### The maths, verified rather than trusted

The fleet is a clean 4-bit encoding — colour, antenna, wheels and box each split it exactly in half, and together they address all sixteen uniquely. Direction and flag are constant across the fleet and therefore worthless as questions.

- **All twenty questions' stated answers match the table.** Zero disagreements.
- **Ten questions cut exactly 8**, not four, because each split has more than one phrasing: *האם הרכב צבוע לבן* and *האם מספר הרכב זוגי* divide the fleet identically. Those ten collapse to four distinct splits: {1, 9, 11}, {2, 12}, {3, 13}, {4, 10, 14}.
- **There are therefore 36 correct answers**, one question from each split, 3 × 2 × 2 × 3. The app accepts all of them.
- **Order is irrelevant.** Filtering is commutative, so a set of four gives the same survivor in any order. `נראות התחנות` says "בסדר הנכון" but there is no order to get right.

### The grading decision

Questions 5, 8 and 18 each single out vehicle 4 on their own, cutting 15. **2,739 four-question sets reach the right vehicle by leaning on one of them** while demonstrating the opposite of the lesson — the other three questions cut nothing.

**The station rejects those.** `isProperSet` requires every chosen question to cut exactly 8 as well as the set narrowing to one, which leaves the 36. Accepting anything that reaches one vehicle would make the station passable by picking *האם מספר הרכב הוא 4* — a guess, not a question. **Reversible in one predicate** if it plays too hard.

### The instruction the source gets wrong

`תחנה_4_.docx` contradicts itself, and it is the reason this station was hard to understand. Step ב׳ says **בחרו את 4 השאלות שמסננות הכי הרבה**, while the truth check says each must filter **exactly 8**. Taken literally, "the four that filter most" gives questions 5, 8, 18 and 19 — filtering 15, 15, 15 and 12 — which does land on vehicle 4 and does fail the truth check. Three of those four are "is it this exact vehicle?" in disguise, so the literal instruction produces the anti-lesson.

Earlier notes here called the docx internally consistent. It is, in its **data** — all twenty stated answers match the fleet — but not in its **instructions**. The app states the corrected rule instead, agreed with Hadas as language rather than content: *בחרו ארבע שאלות שכל אחת חותכת את הצי בחצי, וביחד מצמצמות אותו לרכב אחד.* That makes a rejection fair: the group is told the rule up front, not after failing.

### The interaction

The group **writes four question numbers** into a union sheet, in station 1's idiom, rather than clicking questions in a list. Writing is the commitment; looking is free.

The twenty questions are laid out **column-major**, so they read 1 to 7 down the rightmost column rather than 1, 2, 3 across the first row. A CSS grid fills by row, and forcing column order in a grid means pinning a row count, which would break the responsive column count — so this uses multi-column instead: three columns on a laptop, two on a tablet held upright, one on a phone, and the numbering runs down each of them.

Each question card carries the number and the question on one line and `תשובה על הרכב האמיתי` beneath it, rather than the three of them side by side. Side by side the label took 134px of a 304px card and squeezed the question into 118px, so eighteen of the twenty wrapped to two lines and the two shortest did not — giving cards of two different heights. Stacking gives the question the full width, nothing wraps, and every card is the same height at every width from 430px to 1600px.

**Tapping a question previews it: the vehicles it rules out go dim in the fleet table, and the survivors stay lit.** No count is printed anywhere. The source worksheet asks the group to write `כמה רכבים מסננת` for each question, and printing that number would do the work for them — the station would collapse into reading twenty numbers and picking the four biggest. Highlighting shows them **where** to count, not what the answer is. Counting sixteen rows twenty times is not a shortcut; it is the exercise.

**The preview is always measured against the whole fleet of sixteen, never against what previously written questions already removed.** That matches the worksheet, and it keeps the hard part hard: four questions can each halve the fleet and still be worthless together, because *האם הרכב צבוע לבן* and *האם מספר הרכב זוגי* cut along exactly the same line. Nothing on screen reveals that, and finding it is the decision-tree insight.

**The fleet and the questions sit side by side above 900px, and the fleet pins.** Stacked, the station does not work: the
page ran to nearly three screens, and by the time the last question was reachable the fleet had scrolled 280px above the fold,
so tapping a question put its highlight somewhere you could not see. Two intermediate attempts failed for reasons worth not
repeating — pinning the fleet *above* the questions makes it cover them as they scroll underneath, and pinning it *beside*
them without capping the list lets the 1400px question column drag the pinned pane off the bottom of its own grid row, so the
fleet slides away exactly as you reach questions 14 to 20. What works is both: side by side, the fleet pinned, and the
question list capped to the viewport so it scrolls in place — as a plain vertical column, not a multi-column box. A
multi-column box with a capped height does not scroll down; it flows the overflow into further columns *sideways*, which
hid thirteen of the twenty questions off the right edge and made the list scroll horizontally. Verified at 1280×800, 1512×982, 1024×768 and 768×1024 that all
sixteen fleet rows stay countable while the twentieth question is reachable, and that the highlight a tap produces is fully on
screen. Below 900px there is no room to sit them side by side, so the fleet pins above the questions with a capped height.

Chasing this turned up an app-wide bug that had already shipped: `#app`'s `overflow-x: hidden` was killing every
`position: sticky`, so **the station clock scrolled off screen on every station**. Now a hard rule in `CLAUDE.md`.

**After every submit, right or wrong, the group sees the funnel their four produced**, question by question, with zero-cuts marked. It is the only feedback on failure and it does the work: a set built on question 5 reads 15, 0, 0, 0; four halvers on two splits read 8, 0, 0, 4. It also stops a rejection reading as a bug when the group is looking at one surviving vehicle. The funnel describes their choice and never points at a better one.

Three failure messages, because there are three ways to be wrong: a repeated question number, landing on one vehicle via a giveaway, and leaving several vehicles standing.

Two attempts, per `נראות התחנות`.

The hints and failure messages are written here, not by the content author, and need Lotem's eye.

### What this added to the engine

The `pickN` sub-answer kind: a whole set graded together by a predicate, for cases where several different sets are equally correct and there is no per-pick verdict to give. With the `custom` combine rule deriving the surviving vehicle, that is all of station 4.

## Station 5 — built and verified

Source: `תחנה_5_.docx`, which supersedes the draft's own card set. **Two rounds since 2026-09-16**: round one is the source's — ten labelled trucks, six unlabelled, and the digit is how many of the six carry — and round two was written here.

**The rule is the antenna, and it is the only rule that works.** Verified mechanically rather than by eye: of the four features, colour, wheels and box each appear on both sides of the labelled 5/5 split, so none of them can explain the labels; only `אנטנה` separates cleanly. Applying it to the six unlabelled gives U-01 and U-03, so the digit is **2**, matching the roster and keeping the lock code intact.

### Interaction

Per `נראות התחנות`: the cards are shown and the group answers כן / לא on each of the six. The rule itself is never typed anywhere — getting all six right is the proof they found it, exactly as in the source.

### Round two — a two-feature rule, added 2026-09-16

The station was one insight and ran in 60 to 90 seconds of a 7-minute slot. Hadas raised that on 2026-09-09; the options are in [station-5-difficulty.md](station-5-difficulty.md) and she chose option B, a second labelled round whose rule is a conjunction.

**The rule is: exactly one of `אנטנה יש` / `ארגז סגור` — never both, never neither.** Eight labelled trucks, six to classify.

**A conjunction was built first and thrown away for being too easy**, and the reason disqualifies every AND rule: *with a conjunction, the features all the carriers share **are** the rule.* One pass over the carriers hands it over and the non-carriers are never read — the same one-step move round one teaches, with two columns instead of one.

This rule cannot be reached that way. **The four carriers share no feature, and neither do the four non-carriers**, so intersecting either side yields nothing; the only route in is noticing that `אנטנה` means the opposite thing depending on the `ארגז` beside it. That is two features that only mean something together, as against two features stacked.

**These cards are not from the source** — there is no second round in `תחנה_5_.docx` — so they were designed here and then checked. A sweep of 144 rules a person might propose (every single feature, every AND / OR / XOR of two, every AND / OR of three) leaves **two**, and they are the same function written from opposite ends: negating both sides of an XOR leaves it unchanged, and they agree on every unlabelled truck. No single feature fits. Round one was swept identically and is unique at `אנטנה יש`. The six to classify cover all four `(אנטנה, ארגז)` combinations and **no single feature predicts their answers either**, so a group cannot land on all six holding a wrong rule. No unlabelled truck repeats a labelled one in either round.

Round two splits 4/4 like round one, at four cards per row rather than five.

**The risk to watch:** an interaction rule is the harder direction, and it is the classic case a single split cannot separate. If groups stall in testing, the lever is hint 2, which points at "two features that depend on each other" without naming them.

**The concept label changed with it**, from `למידה מפוקחת ולא מפוקחת` to `למידה מפוקחת`. Two supervised rounds do not touch the unsupervised half, so **unsupervised learning is now previewed nowhere in the evening.** Hadas's call, made deliberately rather than drifted into — the alternative was option A, clustering, which has no determinate answer unless the cards are built to an exacting standard and would have repeated station 6's problem.

**The digit is still round one's count and nothing else**, so it stays 2, `3274227` is untouched and the facilitator sheet does not move. Round two is a second gate, not a second number.

**Attempt policy: 2 submissions, per-ROUND feedback.** It went 4 → 3 → 2 across 2026-09-16, all Hadas's call, the last step because the station plays as an easy one and extra tries made it easier still. Here the attempt count is a **difficulty** lever rather than a safety one, and the direction that would need justifying is upward: the feedback is per round and never per truck, so a round is six binary answers and a rejection leaves 64 possibilities with nothing to sweep. Per-truck verdicts would let a group flip one card at a time and read the rule off the app instead of off the data — that is the constraint doing the work, not the budget. Station 3 is the opposite case, where two is forced rather than chosen.

**A judged round is framed, the way a judged card is everywhere else.** The verdict used to name the failing round in prose — "סבב ב׳ לא נכון" — which was the only place in the app where a sentence did a mark's job. Stations 3 and 7 put a green border on a right card and a red border plus a wash on a wrong one, and station 5 now does the same to a whole round: green frame and ✓ נכון, or red frame, red wash and ✗ לא נכון in the round header. Station 5 cannot mark a truck — twelve binary answers read one card at a time would hand over the rule — so the round is the smallest unit it can frame.

Two consequences worth keeping. **Each round is framed at all times**, in `--hair` before any verdict exists, so a rejected submit recolours an edge that is already there rather than inserting one and shifting the page under a group mid-read; this replaced the hairline rule that used to separate the two rounds. And **the miss wash is `--bad-wash`, not `--bad-soft`** — same red at a third of the alpha, because the .15 tuned for a card reads as a red page across a round. The verdict sentence survives as one generic line pointing at the ✗, which is the shape every other station's rejection has. A round's mark clears as soon as any truck in it moves, because the verdict was about an answer that no longer exists.

### Copy

The brief is adapted from the draft's own station card. **The hints are written here, not by the content author**, and need Lotem's eye like the rest of the invented copy. A third hint naming the antenna outright was **removed on 2026-09-09** as simply handing over the answer, along with the instruction line `תכונה אחת בדיוק עובדת על כל העשר`, which framed the task too generously for a station already considered too easy. Two hints remain.

Hint 2 originally ruled out colour, wheels and box by name, which with only four features on a card named the fourth by elimination — the same reveal as the hint that had just been removed, one step later. It now teaches the method instead of performing it: *תכונה שמופיעה גם אצל נושאת וגם אצל לא נושאת לא יכולה להיות הכלל. עברו על ארבע התכונות ופסלו.*

### Layout

**The ten labelled cards are pinned to five per row**, so the first row is the five that carry and the second is the five that do not. `auto-fill` packed six into the first row and split the group down the middle — the one thing that set exists to show. Below 700px five columns stop being readable and the grouping gives way to fitting on screen; verified holding at 1280, 1024 and 768 wide, which covers the laptops and tablets the event runs on.

There is deliberate air between the ten they learn from and the six they answer, about 48px, so the two halves read as data and exercise rather than one long wall of cards.

### What this added to the engine

The `choice` sub-answer kind, which covers the yes/no case and any future pick-from-a-set. Combined with the existing `count` rule, that is the whole of station 5. The remaining kinds — `multiChoice`, `rows`, `pairPick` — still land with their stations. `dragToBucket` was never needed: station 3 sorts twenty cards into three boxes with three buttons per card rather than by dragging, which grades as plain `choice` and is far kinder on a tablet.

## Visual direction

**מארג**, the dark-ops direction. Ground `#05080c`, hawk-amber `#ffb238`, hairline panels, scanlines, slow radar sweep, Heebo with letterspaced micro-labels, IBM Plex Mono for all digits and codes. Single dark theme. RTL throughout.

Colour discipline learned the hard way: amber is the only accent in the UI. **Inside a table** the rule is absolute — per-column and per-rule colouring cut across the rows a group is scanning and made station 1 harder to read, and the coral `—` glyph is all that survives of it. Do not reintroduce colour into a table.

**Station 2's chart pairs use the same three hues, added 2026-09-10.** Each envelope takes one, cycling `h1`/`h2`/`h3` down the seven, and **both charts of a pair share it** — so the two drawings read as one data set seen twice. It must never track which chart is honest, and never the graph's position, either of which would hand over the answer. Amber stays out of the series entirely, which is what lets it read as emphasis rather than as another category: it carries ב׳'s misleading highlight, ה׳'s false trend arrow and ז׳'s honest average rule — two lying charts and one truthful one, so it is not a tell. The source does the same thing with orange against grey.

A hazard the colour exposed: bars had a 1px minimum height, invisible while everything was grey. In colour, the nine empty months in ג׳ became nine visible stubs — in the one envelope whose question is *count the incidents*. A zero now draws nothing, and the station-2 suite asserts it.

**Station 3's boxes are a sanctioned exception, added 2026-09-10 at Hadas's request.** Three box colours (`--box-1/2/3`: violet `#b48af5`, teal `#3fc7d4`, pink `#ef7d9d`), applied to the box, to the button that sends a card there, to the card once placed, and to that box's tally. **None of the three is amber** — the first cut used amber for א׳ and it read as active UI rather than as a box, because amber is the app's own accent. Nor green, red or coral, all of which mean something else. Two rejects worth not repeating: blue for א׳ is indistinguishable from teal at the size of a 44px button, and a deeper pink for ג׳ starts reading as the red verdict colour. An indigo א׳ was also tried and came back too dark. This is not the table case — colour here belongs to a *place* a card was put, so it marks membership rather than cutting across a scan, and the source colour-codes its own boxes for exactly that reason. Deliberately not green or red, which are verdict colours everywhere else, and all three are equally saturated so no box reads as the reject pile before the group has worked out what the boxes mean. A placed card's border sits at 45% with a full-strength edge on the reader's side: at full strength twenty sorted cards drown out the chosen button on each one. **Do not generalise this to other stations without asking.**

Dramatic moments in the prototype, to be pushed further here:

- Password accepted: amber vertical wipe with the station number, letterspacing collapsing inward. **The wipe is a curtain, and the screen swap has to happen behind it.** `#fx.wipe` reaches full coverage at 45% of its 0.9s run, so the station is rendered at 405ms, not on submit. Rendering it immediately showed the station, drew the curtain over it, and revealed it again — which reads as the station loading twice, and was reported as exactly that.

**The rule, for any effect added later:** an effect that *hides* the screen owns the moment the screen changes underneath it, and the two live together in `COVERS` in `ui/fx.js` rather than being timed by hand at each call site. `coverThen()` runs the effect and swaps at its opaque point. Effects that only *glow* — `accept`, `reject` — are fired with `fx()` directly and change nothing behind them. Under reduced motion `coverThen` swaps immediately: there is nothing to hide behind, and waiting in front of an invisible animation is just a delay.
- Wrong submit: red strobe three times in the first half second, then a dark scrim so text stays readable; נדחה stamps in, then the remaining-submissions count rises under it a beat later. Runs 2.1s total, because 0.9s was unreadable.
- Correct submit: amber shockwave expanding from centre, the digit slamming in at scale with bloom, the ribbon slot igniting
- Under 60 seconds: clock goes red and pulses, a red vignette breathes at the screen edges
- Station closes unsolved: cold black flood, נגמר הזמן or נגמרו הניסיונות, shake, digit arrives muted. **The digit must arrive out of the black, not be waiting behind it.** `coldIn` peaks at 86% black at 30% of its 1.4s run, so the expired screen renders at 420ms. Rendering it on close showed the struck-through digit first and flooded over it afterwards, so the screen spoiled its own reveal.
- **The vault opening, the loudest moment in the app:** the ribbon slots verify left to right at 95ms intervals, in the order the digits go into the physical lock; then a white-hot core flash, two amber shockwave rings, a shake, and הקוד אומת / המנעול נפתח stamping in. The reveal assembles block by block while the afterglow is still fading, so the two read as one movement. ~1.9s to the reveal, ~2.8s to rest. This is the only moment that earns a white flash — everything else stays amber.

Hadas has assets to bring in. The Cowork artifact is a look-and-feel reference; do not port it wholesale. What carries over is the token values, the state machine, the answer-engine shape, the Hebrew normalization, and station 1's data, rules and interaction.

## What the box is, and the closing reveal

**THERE IS NO PHYSICAL BOX.** Confirmed by Hadas 2026-09-21: nothing is locked in the room and nothing is opened by hand. The crate is fiction, the lock is the vault screen's own, and **typing the six digits into the app is the ending** rather than a cue to go and open something. This was worth writing down because the box had been treated as real for two weeks — the facilitator sheet told someone to set a physical lock to 3274227 and to stock the crate with a prize, and the vault screen said the cargo `נמצא בחדר`, which would have sent a room of teenagers looking for it. All three are fixed.

The rest of this section is the fiction the screens carry, which still matters: it is what the reveal pays off.

**Status: proposed by Claude Code 2026-09-08, never approved by the content author.** The draft gave only `שבע תחנות. שבע ספרות. קופסה אחת.` and the lock code, and `נראות התחנות` stopped at station 6.

### What the cargo is, in the fiction

**The seized crate, not the enemy's.** The convoy was stopped because of the group's analysis, so the crate is ours and it opens to the code their answers produced, because that is the analysing desk's authorization. If it were Hezbollah's, the lock would open to the enemy's own combination and a sharp participant would ask why. The vault screen states it before they type anything.

### What the מטען אסטרטגי is

**ערכות הכוונה — precision-guidance kits.** Not explosives: the components that convert an unguided rocket into a precision weapon. This is the real, publicly reported rationale for interdicting the Syria-to-Lebanon route, so it costs nothing in plausibility, and it is why one truckload is worth a night of analysis.

It also carries the lesson without straining, which is the whole reason to choose it: **the difference between a statistical rocket and a precise one is not explosive, it is information.** The cargo the group hunted all evening turns out to be data. That lands the seminar's own cover line, `נתונים זה הזהב החדש`, without having to say it.

Rejected: **מטען חבלה.** A bomb implies a countdown, and the timer design deliberately refuses a speed incentive; it makes the payoff kinetic where the reveal is epistemic; and it is a poor prop for a room of high-schoolers.

### The reveal's shape

Rewritten with Hadas 2026-09-09. It is a closing frame, not another page: full screen, centred on both axes, roughly double the type size of every other screen, and it congratulates them before it does anything else.

```
[eyebrow]  מעבר ג'נתא · 03:41
[h1]       כל הכבוד, סיכלתם את המבצע
[lead]     המשלוח נעצר, והרקטות שלהם ימשיכו לפספס.
[punch]    מצאתם אותו בתוך טבלה.            (amber)

           ── 120 ──                       (amber rules, no box)

[finale]   לזה קוראים למידת מכונה            (amber, inside a faint ring)
[sub]      כל תחנה כאן היא שיטה שמנתחי מודיעין עובדים איתה באמת.
```

The station-to-concept roster was removed: each station already names its own concept on its solved screen and the ribbon already shows all seven digits.

**Impact comes from size, colour and shape, not from more words.** The score lost its filled box for a pair of amber hairlines, the closing block sits inside a faint amber ring echoing the insignia and the vault's shockwaves, and the amber accent is used harder here than anywhere else in the app.

**Every size on this screen is bounded by viewport height as well as width** — `clamp(1.75rem, min(5.4vw, 7.4vh), 4rem)` and similar. A closing frame has to fit the screen it closes on, and without the `vh` term the last line of the whole event slid under the ribbon on a 768-tall laptop. Verified clear of the ribbon at 1366×768, 1280×800, 1280×900, 1920×1080 and 2560×1440.

### Hebrew register on this screen

The first draft of this copy read as machine-written, and the diagnosis is worth keeping. Every line was an English rhetorical formula in Hebrew clothing:

- `עשרות רקטות לא יידעו לאן לפגוע` — personified the rockets. English copy does that; Hebrew does not.
- `הנשק שעצר אותן היה מידע` — the "the X that did Y was Z" reversal.
- `לא פתרתם חידות — הפעלתם אלגוריתמים` — "not X, but Y", the most recognisable LLM tic, and it appeared twice on one screen.

Three aphorisms stacked in six lines is itself the tell. The rewrite uses none of those structures: plain statements, concrete nouns, spoken forms (`לזה קוראים` rather than `זה נקרא`, `ימשיכו לפספס` rather than an abstraction). **Hebrew register is the weakest thing produced here — it needs a native reader's judgement on every pass, not just a proofread.**

### Dependencies and open points

- The reveal names **מעבר ג'נתא** (the forest station's answer, now station 6) and **רכב 4 מתוך 16** (station 4's). Both are solid in the draft's own working, and ג'נתא is load-bearing for digit 7. If either station's answer changes, this copy changes with it.
- **מטען is now the only word for it, on every screen.** קופסה is gone from the app: the opening triad, the briefing (`שבע הספרות פותחות את המטען`), the last station's button (`לפתיחת המטען`) and the vault all say מטען. The noun changed gender from feminine to masculine, so the agreements moved with it — שנתפסה→שנתפס, נמצאת→נמצא, סגורה→סגור, היא נפתחת→הוא נפתח, אותה→אותו. A mechanical find-and-replace here would have produced broken Hebrew on the screen immediately before the finale.
- The vault eyebrow was `שחרור התפוסה`, which is not really a Hebrew noun for a seized item; it is now `שחרור המטען`.
- **The briefing promises the mission, not the mechanic:** `שש הספרות עוצרות את המשלוח`, which the reveal pays off word for word with `המשלוח נעצר`. **מנטרלות was considered and rejected:** `לנטרל מטען` is the standard Hebrew collocation for defusing an explosive charge, so it drags back the מטען חבלה reading this frame deliberately rejected — you seize guidance kits, you do not neutralise them — and it promises an action the app never performs. פתיחה language is kept only where they physically open the thing: the last station's button and the vault.
- מנעול stays the word for the lock itself (`קוד המנעול` in the ribbon, `המנעול נפתח` on the unlock). Lock and cargo are different objects and keep different words.
- ~~**What physically goes in the box is still undecided.**~~ **Moot — there is no box.** It should read as the seized guidance kit — a component in foam, a drive, something that looks like a part rather than a prize — plus a card carrying `נתונים זה הזהב החדש`.
- One box for the room or one per group is still unanswered.
- Unused draft material a real closing screen could still draw on: the `לדיון אחרי הפתרון` cards on stations 5 and 7, and station 7's line *שמונה בינוניים שרואים דברים שונים מנצחים שני מומחים טובים שרואים אותו דבר.*

## Blockers on stations 2 to 7

Being worked one at a time with the content author. Recorded here so nothing is lost.

1. ~~**Station 2 reads as confusing.**~~ **Closed 2026-09-21 by rewriting the envelopes**, not by asking the author: on 2026-09-17 Hadas took the chart data as hers to change. Seven envelopes became six, every question became a yes/no judgement, and the two envelopes that had no correct answer are gone. Reasoning in [station-2-rewrite.md](station-2-rewrite.md), history in [station-2-clarity.md](station-2-clarity.md), and the section above carries the rules that keep it that way.

1. ~~**Station 2's digit has no source.**~~ **Resolved — the source states it outright.** `תחנה_2_גרפים_סופי.docx`: *עדכנו את ספרת תחנה 2 ל-2 (במקום 6). הקוד המעודכן: 3274227*. The digit is 2, awarded on a clean sweep, and the lock code is intact. Built 2026-09-09.
2. ~~**Station 3's digit is 9, not 7.**~~ **Not a problem — closed 2026-09-10.** The digit is a token, so station 3 counts box ב׳, which is 7, and the lock code never moved. The card set and the sorting are untouched.

3. ~~**Station 3's rule is stated twice, differently.**~~ **Closed 2026-09-16 by rewriting the cards.** The source held two incompatible rules — its union sheet sorts by answer type, its ג׳ examples sort by availability — and had no answer key at all, so nothing ever decided between them. What settles it: **the station shows the group no data.** No table, no fleet, no corpus, just twenty cards and three boxes. A rule turning on "do we already have this recorded?" is unjudgeable from what is on screen, which is why Hadas solving cold and this build independently reached the answer-type reading. Exactly one card implied a corpus; replacing it leaves the contradiction nowhere to live.

   The rewrite replaces two of the six examples, rewords or replaces nine of the twenty, and drops the `contested` flag — nothing is contested. It also breaks the opening-word shortcut, which used to sort the set correctly 19 times out of 20: four cards and both new examples now cut against it, and sorting purely by grammar scores 16 of 20, which all-or-nothing grading fails. **The station is therefore harder than the version that was play-tested** — see the attempt note below, which closes it at 2.

   **A rejected submit marks every card right or wrong**, added 2026-09-16 at Hadas's request — the old all-or-nothing verdict left a group with nowhere to look. It never says which box a wrong card belongs in, and a mark clears when its card moves. Per-card marks plus three attempts would have been a complete brute-force — submit to learn which cards are wrong, move them all to a second box to learn which of those were wrong again, and the rest must be the third — so **`maxAttempts` is 2**. The second submit then has to be a simultaneous two-way guess on every wrong card at once, which no group lands. **The two settings are locked together: raising the attempts without turning `revealWhichWrong` off reopens the exploit exactly.** This makes station 3 the strictest station of the evening, deliberately, because its feedback is the most precise. If two proves too harsh in play-testing, the lever is coarser feedback — per-box error counts would carry three attempts safely — not a third attempt.

   The set sorts **8 / 8 / 4**, so no box holds 7 and `digit: 7` is awarded outright with `rule: 'literal'`. The tally stays on screen at Hadas's call — it helps a group see they have placed all twenty — and costs nothing, because the union sheet's `הספרה = כרטיסים בקופסה א׳` is never rendered and nothing on screen claims the digit comes from a count. `CFG.lockCode` does not move. Full reasoning: [station-3-rewrite.md](station-3-rewrite.md); the history: [station-3-rule.md](station-3-rule.md).

4. ~~**Station 4's truth check is mathematically false.**~~ **Withdrawn 2026-09-09 — this blocker was written against the draft, not the authoritative file, and does not survive contact with it.** `תחנה_4_.docx` is internally consistent: all twenty questions' stated answers match the vehicle table, and its truth check — each chosen question must filter exactly 8 — is satisfiable. Ten of the twenty questions filter exactly 8. The error is in the *draft*, which nominates {1, 2, 3, 5} as the best four; question 5, the stained windshield, filters 15, so the draft's own key contradicts the docx's rule. The draft is superseded, so there is nothing to fix.

   What the verification did turn up, which matters more for building it:

   - **The answer is not unique. There are 36 valid sets.** The ten eight-filtering questions collapse to four distinct splits — {1, 9, 11} colour/parity, {2, 12} antenna, {3, 13} wheels, {4, 10, 14} box/position — and a correct answer takes one question from each. 3 × 2 × 2 × 3 = 36. The app has to accept all of them.
   - **2,739 other four-question sets also reach vehicle 4**, by including a giveaway: question 5 or 8 filters 15 on its own, so {5, anything, anything, anything} lands on vehicle 4 while demonstrating the opposite of the lesson. Grading on "did you narrow it to one" alone would accept these.
   - **Order is irrelevant.** Filtering is commutative, so a set of four questions gives the same survivor in any order. Grade as a set. `נראות התחנות` mentions "בסדר הנכון", but there is no order to get right.
   - The digit is the surviving vehicle number, **4**, matching the roster.
5. ~~**Station 6 has no distance metric.**~~ **MOOT — THE STATION WAS REMOVED 2026-09-21.** Everything below is kept as the record of why. The short version: the metric existed, the arithmetic never produced the roster's digit, three separate difficulty fixes were applied, and none of it addressed the real problem — it was the one station that handed over its rule, so it asked for execution rather than insight. Original entry follows.

   ~~**Station 6 has no distance metric.**~~ **It does — `תחנה_6_מעברים.xlsx` states one the draft never had**, checked 2026-09-09: *מתחילים בשעת פעילות, ממשיכים לסוג כביש, כיסוי עצים, גובה, רכבים ביום — שני מעברים דומים = חולקים כמה שיותר תכונות מהתחלת הרשימה*. That is a lexicographic match, and it is checkable.

   **Its own arithmetic does not give the roster's 2 — and that turned out not to matter. Built 2026-09-10.** Over the three crossings it gives 7, and over the original four it gave 1. Station 6 simply awards **2**: nothing on screen shows a sum, so nothing contradicts it, and the lock code never moved. The neighbour key in `src/data/station-6.js` is still *computed* from the stated rule rather than typed, so the puzzle itself cannot drift.

   **Station 6 played far too hard, and three fixes were applied 2026-09-10 at Hadas's request:** N-04 dropped (48 comparisons down to 36), a rejected submission now names which crossings are wrong the way station 1 does, and **no filter on the known table**. Two were built and both were dropped.

   The first applied שעת פעילות automatically and Hadas rejected it — *"the filter doesn't make any sense."* Two faults: it made the first decision before the group had acted, and no principle said step 1 should be automatic and steps 2 to 5 not. **That is a rule worth keeping for anything like it: the app shows the consequence of a choice the group made, it does not make the choice.** Station 4's fleet preview is the shape to follow.

   The second let the group drive it with a button per feature. Principled, and dropped anyway: two taps collapsed twelve rows to two, and **reading the table is what station 6 is.** A tool that does the reading leaves no station. Difficulty here gets managed by having less material, not by helping with it — which leaves cutting never-used rows as the remaining lever.

   Two further defects, neither blocking the build. **N-02 and N-04 were the same puzzle**: identical on שעת פעילות, סוג כביש and כיסוי עצים, ten metres and one vehicle apart, so they take the same three neighbours and the same score — the station is really three cases. And **no new crossing has three neighbours of its own kind**: N-01 and N-02 have two same-time-same-road matches, N-03 has one, so the third pick always comes from a crossing that fails on road type. Well defined, but never the intuitive choice. Full write-up in [station-6-neighbours.md](station-6-neighbours.md).

   **Two crossings are also genuinely ambiguous.** N-02 and N-04 both match K-07 and K-11 on the first three features; the third neighbour is any of four night mountain crossings scoring 4, 4, 5 and 5, giving an average that rounds to either 3 or 4. Breaking the tie on altitude gives 3, but nothing in the source says to.

   So the blocker moved rather than cleared: the metric exists, and it contradicts the digit. Needs the content author.
6. ~~**Station 7 cannot run per-group as written.**~~ **Built 2026-09-10.** The group fires one row per analyst rather than reading off a verdict, the eight slips stay covered until the last is decided and then turn over together, and the accuracy card deliberately **stays out of the app**. Station 7 is the only station whose digit the roster already had right.

   The accuracy card was built as an `epilogue` on the solved screen and removed the same day. **The rule it leaves behind: every station ends the same way.** Nobody reads a paragraph at the end of a station they have just finished, that slot in the schedule is the group's social quest, and a last screen that behaves differently reads as a bug rather than as a flourish. The payoff — the two most accurate analysts both said תבריז and both were wrong — belongs to the facilitator, spoken in the room, which is how the draft always had it. The figures stay in `src/data/station-7.js` unrendered, for them.

    **Withdrawn 2026-09-10 — this blocker was wrong on every count, and was checked against the wrong station's data.** There are **eight** analysts in four pairs, not seven; the sites are סמנאן / תבריז / אצפהאן, and ג'נתא and קוסייא belong to station *2*; and the votes are 5 / 2 / 1, which is eight. All eight analysts were verified against their own decision tables and reproduce the draft's key exactly, with exactly one rule firing each. **The digit is 7 and the roster already has it — station 7 needs no lock-code change**, unlike 3 and 6.

   Two things do need solving. The **site-code table is missing from the draft** although a hint and the union sheet both point at it; it is recoverable as סמנאן 7 / תבריז 2 / אצפהאן 5, which the union sheet prints one column to the left of where it belongs. And the **isolation mechanic cannot survive one screen** — the draft's drama is eight people holding covered notes, and on one device everyone sees everything. Full assessment in [station-7-forest.md](station-7-forest.md).
7. **Station 5** has two conflicting card sets. Use `תחנה_5_.docx`, not the draft's. Both yield digit 2.
8. **Group size conflicts.** The draft says שלישייה, three officers. `project-overview.md` says four pairs. One device per group is settled; the group's size is not.

## Open, non-blocking

- Station 1 is now materially more forgiving than station 2 as `נראות התחנות` specifies it. Confirm with the content author whether that difference is intentional.
- Whether 3 submissions is right, or 4. A group that burns one by accident early has little room.
- Whether the solved screen should name the concept immediately, as it currently does, or hold it for the closing reveal. Naming it per station is friendlier but spends the reveal's punch seven times.
- ~~Which parts stay physical props; the final locked box is presumably real.~~ **Answered 2026-09-21: none, and it is not.**
- Repo name, GitHub account/org, Pages URL.
- Local folder path, to fill into the Cowork project's device-bridge instruction line.
