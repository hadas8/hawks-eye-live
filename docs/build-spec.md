# עין הנץ — Build Spec

_Updated 2026-09-08 in Cowork. Read this first. It supersedes the mechanics sections of `project-overview.md`._

Source material: the Drive folder `1P9wJ3NlPZ6Er5CwdTQkQBl9JJfCW3nQa` (owner lotemtubul@8200.org.il). Per Hadas, the draft `חוסם_הציר_שלישייה.docx` is superseded by every other file in the folder. `נראות התחנות` is the authoritative per-station app interaction spec and is still partial (stations 6 and 7 not written).

## Naming and frame

**מבצע עין הנץ.** The draft's name חוסם הציר is dropped; the frame is unchanged. Intelligence analysis unit 7 of Unit 8200, the Syria to Lebanon smuggling route, **Hezbollah's** Unit 4400 moving a strategic cargo, 02:17, seven stations, seven digits, one physical box. Both attributions come from the draft's opening card (יחידת ניתוח 7 — אמ"ן, יחידה 4400 של חיזבאללה) and were missing from the prototype's copy; restored 2026-09-08. The draft's אמ"ן was replaced with יחידה 8200 per Hadas: the participants are high-schoolers who may not decode the acronym, and 8200 is the seminar's own frame.

## Timer

- **Per station, 7 minutes.** Starts the moment a group submits the correct password for that station. No global session clock.
- Groups are deliberately staggered. A late start means a late finish, so a bathroom break costs a group nothing.
- Solve early and the app holds the group. The room fills that gap with facilitator-given social quests that live entirely outside the app.
- Hit 0:00 unsolved and the station closes.
- Either way the group lands on the next station's password screen and waits. Only the facilitator's spoken password moves anyone forward, and the facilitator waits until every group's 7 minutes have elapsed.
- Persist the station's **start timestamp**, never a remaining count, so a mid-station refresh cannot grant extra minutes.
- The facilitator holds the password list on paper. **There is no facilitator panel in the app.** A `?dev` query param exposes a clearly-marked dev strip for testing; it must be removed before the event.

Timing to plan around: 7 × 7 = 49 minutes of station time plus password screens, opening and closing. The draft's "45 דקות" narration line needs rewriting.

## Expiry and scoring

- Solve in time: **10 points**, digit shown in amber in the ribbon.
- Station closes unsolved, whether by clock or by exhausted submissions: the group **still receives the correct digit** so the box can open, but it lands **greyed and struck through** in the ribbon and scores **0**. The reveal marks it נמסרה. The closing screen distinguishes נגמר הזמן from נגמרו הניסיונות.
- Social bonus quests: **5 points each**, counted by facilitators on paper. The app never sees them.
- The app shows only the technical score (max 70) on the reveal screen and states that facilitators add the bonus points and announce winners. No cross-group comparison in the app, by design.
- **No speed bonus, deliberately.** Finishing fast buys time, time buys social quests, and social quests buy points. The incentive to move fast already exists without the app scoring it.

## Screen model

One SPA, one URL, no router, a single state machine.

`boot` → `briefing` → per station (`locked` → `active` → `solved` | `expired`) → `vault` → `reveal`

Persistent chrome: the station clock and score in the top bar, and a 7-slot code ribbon at the bottom with three slot states (empty, earned, given).

**The code ribbon is the one part of the UI that runs left to right.** Station 1 is the leftmost slot, station 7 the rightmost, so reading the digits off the screen gives the code in the order it is entered into the physical lock. Laid out RTL like everything else it reads back-to-front, which is a real risk at the box with a room full of teenagers. The ribbon's Hebrew label stays in the RTL flow, to the right of the slots; only the slot group is LTR. The vault input is `dir="ltr"` for the same reason. Everything else in the app remains RTL.

## Answer engine

Declarative per station, with a `custom` escape hatch:

- Sub-answer kinds needed across the seven: `number` (with tolerance), `choice`, `multiChoice`, `rows`, `dragToBucket` (station 3), `pickN` (station 4), `pairPick` (station 2)
- Combine rules: `digitalRoot`, `count`, `literal`, `custom`
- **Attempt policy comes from the station config, not a global rule.** Station 1 allows 3 submissions; station 2 is all-or-nothing with unlimited redos; station 3 allows 3 attempts; station 4 allows one retry. Running out closes the station immediately rather than leaving a group idle at a dead button.
- No lockout timer. After a failed submit, disable submit until an input actually changes.
- **Feedback granularity is a config flag, and it is coupled to the attempt cap.** With unlimited submissions any numeric feedback is brute-forceable, including an aggregate "X of 8" count, because a group can change one field and watch the count move. Station 1 therefore pairs `revealWhichWrong: true` with `maxAttempts: 3`: precise per-table ✓/✗, but too few tries to sweep a single-digit answer space.
- **Verdicts are sticky per sub-answer.** A table confirmed correct keeps its tick until that table changes; only the changed one loses its mark. Without this, a group re-verifies confirmed work inside a 7-minute window.
- Hebrew normalization on every text and password comparison: strip niqqud and quote marks, collapse whitespace, case fold, fold final letter forms (ם→מ, ן→נ, ץ→צ, ף→פ, ך→כ). Each password is an array of accepted strings.

## Station roster

Names taken from the draft, which are the real ones. Passwords are still placeholders.

| # | Name | Concept | Digit |
|---|------|---------|-------|
| 1 | הטבלאות המשקרות | ניקוי נתונים | 3 |
| 2 | הגרפים המשקרים | ויזואליזציית מידע | 2 |
| 3 | הכלל הנסתר | סיווג מול חיזוי | 7 |
| 4 | השאלה ששווה לשאול | עצי החלטה | 4 |
| 5 | מי קיבל תשובות ומי לא | למידה מפוקחת ולא מפוקחת | 2 |
| 6 | ארבעה כוכבים | KNN | 2 |
| 7 | שמונה אנליסטים | Random Forest | 7 |

Lock code `3274227`.

## Station 1 — built and verified

Source: `תחנה_1_שמונה_טבלאות.xlsx`. Eight tables, one number each, digit is the digital root of the sum.

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

**The ton/kg mixed units are not mentioned at all.** They are a distractor by design, so explaining them worked against both the exercise and the clarity. It survives as the last of four hints for a group that gets stuck chasing it.

**Pacing risk:** eight tables of 12 to 18 rows each in 7 minutes is very tight for teenagers. Time it with real participants; the likely fix is fewer tables rather than more time, since 7 minutes is fixed across all stations.

## Implementation

Built 2026-09-08. `docs/prototype.html` is superseded by the code and is kept only as a look-and-feel reference.

Vanilla ES modules loaded straight from `index.html` — no build step, no bundler, so the served files are the source files. Split by job: `state` (the one state object plus persistence), `flow` (transitions more than one module needs), `engine/answers` (grading), `data` (content), `screens` (one per screen), `stations` (one per station *kind*, behind a registry), `ui` (router, chrome, clock, fx, event delegation). See the README for the file map and for how to add a station.

Decisions taken during the build:

- **Interaction goes through delegated `data-act` / `data-submit` / `data-input` attributes on `#app`**, not inline `onclick` and a `window.go` global as in the prototype. Modules register handlers by name, so a station file owns its own actions.
- **The answer engine implements only what a built station needs** — the `number` kind and the `digitalRoot` rule. The remaining kinds the roster will need (`choice`, `multiChoice`, `rows`, `dragToBucket`, `pickN`, `pairPick`) are absent by design, and an unimplemented kind throws rather than silently grading as wrong.
- **The prototype's leftover per-column colour tokens were dropped.** `--c-id`, `--c-st` and `--c-wt` are gone; only the coral missing-value dash survives, as `--miss`. The union sheet's ידני tag, which used the identifier colour in the prototype, is now plain `--ink-dim`.
- **Persisted state is versioned** under `hawkseye.v1` with a schema field. A stored blob from an older shape is ignored rather than half-restored.
- **A station clock is never restarted.** `openStation` sets the start timestamp only if one is not already stored, so re-submitting a password cannot buy a group more time.
- **Scoring is idempotent.** Solving and closing both no-op if the station already holds a digit, so no path can score a station twice.
- **Fixed a prototype bug:** typing into a union cell takes an in-place patch path so the field does not lose focus, and in the prototype that path never rebuilt the table footer — so חזרה לספירה אוטומטית never appeared, and a group that typed a number could not get back to its marks. The footer now rebuilds on that path too.
- **The code ribbon and the vault input run LTR**, per the screen-model note above. This is a deliberate exception to the RTL rule in `CLAUDE.md`, not an oversight — do not flip it back.
- **`prefers-reduced-motion` no-ops `fx()` in JS as well as hiding the layer in CSS**, so no effect timers run at all. Nothing in the effects layer gates a state transition.
- **Local dev server is `tools/dev-server.js`**, zero dependencies, so testing needs no `npm install`. It is not deployed.

Verified in headless Chrome across 61 checks: the full station 1 path, Hebrew password normalization, marks vs. manual override, sticky per-table verdicts, the attempts cap, both closing paths (clock and exhausted submissions), refresh persistence mid-station, the vault and reveal, that the ribbon's on-screen left-to-right order spells the code, and that no password, digit or lock code appears in a participant-reachable DOM.

## Visual direction

**מארג**, the dark-ops direction. Ground `#05080c`, hawk-amber `#ffb238`, hairline panels, scanlines, slow radar sweep, Heebo with letterspaced micro-labels, IBM Plex Mono for all digits and codes. Single dark theme. RTL throughout.

Colour discipline learned the hard way: amber is the only accent in the UI. The one exception is the coral `—` glyph, so a missing value stays scannable in a dense table. Do not reintroduce per-column or per-rule colour coding.

Dramatic moments in the prototype, to be pushed further here:

- Password accepted: amber vertical wipe with the station number, letterspacing collapsing inward
- Wrong submit: red strobe three times in the first half second, then a dark scrim so text stays readable; נדחה stamps in, then the remaining-submissions count rises under it a beat later. Runs 2.1s total, because 0.9s was unreadable.
- Correct submit: amber shockwave expanding from centre, the digit slamming in at scale with bloom, the ribbon slot igniting
- Under 60 seconds: clock goes red and pulses, a red vignette breathes at the screen edges
- Station closes unsolved: cold black flood, נגמר הזמן or נגמרו הניסיונות, shake, digit arrives struck through

Hadas has assets to bring in. The Cowork artifact is a look-and-feel reference; do not port it wholesale. What carries over is the token values, the state machine, the answer-engine shape, the Hebrew normalization, and station 1's data, rules and interaction.

## Blockers on stations 2 to 7

Being worked one at a time with the content author. Recorded here so nothing is lost.

1. **Station 2's digit has no source under the new interaction.** The draft derives it from numeric answers per chart pair (29 → 2), but `נראות התחנות` replaces that with click-the-honest-chart, 2 options, all-or-nothing. That produces no numbers. Recommendation: award the digit on a clean sweep.
2. **Station 3's key is wrong.** The draft claims box א holds 7 cards, then lists nine, then says "רגע, ספרו שוב". Working the stated rule gives א=9, ב=7, ג=4, so **7 is the count for box ב**. Redefining the digit as box ב keeps the code `3274227` intact; otherwise the digit is 9 and the code becomes `3294227`.
3. **Station 3's rule is ambiguous for about six cards**, because "is the answer a category" and "do we have this data" are independent axes but box ג mixes them. Cards 12, 15, 18 and 20 are yes/no questions with no available data and can be argued into either box. A drag-to-bucket station with 3 attempts needs one unambiguous key.
4. **Station 4's truth check is mathematically false.** `תחנה_4_.docx` says each of the 4 chosen questions must filter exactly 8 vehicles. The stained windshield is unique to vehicle 4, so it filters 15; heading west filters 0, since all 16 head west. The real rule is that each question halves *what remains*: 16→8→4→2→1. Also decide whether order matters; the correct set identifies vehicle 4 in any order.
5. **Station 6 has no distance metric, so no determinate answer.** For N-03 the three nearest neighbours are either the other mountain crossings (giving 4) or the other daytime crossings (giving 2). The draft asserts 3. The app cannot auto-check KNN until "similar" is defined numerically.
6. **Station 7 cannot run per-group as written.** It needs 7 analysts in isolation writing covered notes, and a group is 3 people. Its own numbers are also broken: the vote table reads 7/2/5, which is 14 votes from 7 analysts. Working the rules gives ג'נתא 5, קוסייא 1, אסאל 1, so the digit 7 is right and the table is wrong. The title says eight analysts.
7. **Station 5** has two conflicting card sets. Use `תחנה_5_.docx`, not the draft's. Both yield digit 2.
8. **Group size conflicts.** The draft says שלישייה, three officers. `project-overview.md` says four pairs. One device per group is settled; the group's size is not.

## Open, non-blocking

- Station 1 is now materially more forgiving than station 2 as `נראות התחנות` specifies it. Confirm with the content author whether that difference is intentional.
- Whether 3 submissions is right, or 4. A group that burns one by accident early has little room.
- Whether the solved screen should name the concept immediately, as it currently does, or hold it for the closing reveal. Naming it per station is friendlier but spends the reveal's punch seven times.
- Which parts stay physical props; the final locked box is presumably real.
- Repo name, GitHub account/org, Pages URL.
- Local folder path, to fill into the Cowork project's device-bridge instruction line.
