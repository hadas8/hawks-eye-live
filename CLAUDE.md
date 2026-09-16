# מבצע עין הנץ — Hawk's Eye Live

A one-off digital escape room for a live, in-person data science seminar run by the 8200 Alumni Association (Techlift). Seven stations teach the intuition behind an ML concept before naming it; each yields one digit; the seven digits open a real physical box in the room.

**Read `docs/build-spec.md` before writing any code.** It carries the frame, the timer and scoring rules, the answer-engine shape, station 1's verified data, and the known content problems in stations 2 to 7.

`docs/prototype.html` is a working Cowork prototype: station 1 end to end, the timer, the password gate, the scoring and all the visual/motion direction. It is a **reference, not the codebase**. Do not port it wholesale. What carries over is the design tokens, the screen state machine, the answer-engine shape, the Hebrew normalization, and station 1's data and interaction.

## Stack and constraints

- Vanilla HTML, CSS and JS. No framework, no build step, no bundler.
- **No backend. No auth, no database, no network calls at runtime.** Station content and answers are hardcoded. This is deliberate and permanent for v1.
- Hosted on GitHub Pages. Nothing shared with the techlift-interactive project's GCP/Firebase account.
- Group state persists in `localStorage`, wrapped in try/catch with an in-memory fallback. A mid-seminar refresh must never lose a group's earned digits or hand them extra time.
- **RTL Hebrew throughout.** All participant-facing copy is Hebrew. Fonts: Heebo for text, IBM Plex Mono for digits, codes and timers.
- Single dark theme, committed. No light theme, no theme toggle.
- Runs on one device per group, in a darkened room, on laptops and tablets. Touch targets must be finger-sized; nothing may depend on hover or a keyboard.

## Hard rules that are easy to break by accident

- **The 7-minute station clock is derived from a stored start timestamp**, never a decrementing counter. Recompute remaining time from `Date.now()` on every tick.
- **There is no facilitator panel.** Facilitators hold the password list on paper — `docs/facilitator-sheet.md` is that sheet, and it is the only copy that reaches the room. **Run `npm run check` after touching a password, a digit, the lock code or the scoring**; it fails if the sheet and the build disagree. A sheet that has drifted is worse than no sheet, because nobody finds out until a room full of teenagers is typing a password that does not work. The `?dev` strip is for testing only and must be removed before the event.
- **Never reveal a station's answer, digit or password in the DOM, in a comment, or in a data attribute** on a screen a participant can reach. Teenagers will open devtools.
- **Amber `#ffb238` is the only UI accent, with two scoped exceptions.** Per-column and per-rule colour coding inside station 1's tables was tried and reverted — colour cutting across rows that are being scanned made them harder to read, not easier — and the coral `--miss` dash survives from it. Do not reintroduce colour into a table.
- **Stations 2 and 3 are the second exception, and it is deliberate.** Three shared hues, `--hue-1/2/3`. In station 3 a box carries one and so does a card sent to it; in station 2 an envelope carries one and both charts of its pair share it, so a pair reads as a pair. In station 2 the hue must never track which chart is honest, or the graph's position — either would be the answer, in colour. Colour marks a *place* or a *pair* rather than cutting across a scan, which is the opposite situation to the tables, and the source colour-codes both for the same reason. Hadas's call, 2026-09-10. Do not generalise it to other stations without asking.
- Instructions stay minimal. When a station reads as unclear, the fix is fewer words, not more explanation.
- **`#app` uses `overflow-x: clip`, never `hidden`.** `hidden` computes `overflow-y` to `auto`, which makes `#app` a scroll container and silently kills every `position: sticky` inside it. That already shipped once: the station clock scrolled off the top of the screen on any page taller than the viewport, which is every station.
- **Any pane that scrolls inside a station needs `data-keep-scroll="<name>"`.** Every interaction calls `set()`, which replaces `stage.innerHTML` and throws away the scroll position of everything inside it. Without the attribute, tapping something halfway down a scrolling pane sends the group back to the top and they cannot see what they just did. This has now shipped twice — station 4's question list, then station 6's crossings pane, where the table beside it had the attribute and the pane being clicked did not.
- **Never use `<input type="number">` for an answer.** A focused number input steps its value on a mouse wheel or a two-finger trackpad swipe, and on arrow keys. A group scrolling the page over an answer they had already typed changed it silently — 5 became 8 in three notches, with nothing on screen to say so. Reported from Macs, where trackpad scrolling is frictionless, but it is every browser. Use `type="text"` with `inputmode="numeric" pattern="[0-9]*"` and strip non-digits in the input handler; the numeric keypad still appears on a tablet.
- **A full-screen effect means something has been decided.** The `fx` layer is for solved, rejected and out-of-time — moments a group has arrived at. Never fire one part-way through a station: station 7 staged a curtain reading שמונה קולות when the eighth analyst was decided, and it read as a verdict on an answer nobody had submitted. No station interrupts itself; live feedback belongs in the page.
- `prefers-reduced-motion` must disable the effects layer, not just slow it.

## Workflow

- **Cowork** (a separate Claude session, attached to a Cowork project) handles planning, structuring content from the Drive source, and resolving station content problems with the content author. Cowork projects are not visible to Claude Code, so anything durable is copied into `docs/` here.
- **Claude Code** (here) handles implementation, git, the local dev server, and deployment to GitHub Pages.

When a decision changes something meaningful, update `docs/build-spec.md` in the same commit so the two surfaces do not drift.

### Branching and deployment

**`main` is live.** GitHub Pages serves it at <https://hadas8.github.io/hawks-eye-live/>, and Hadas has shared that link with the team. Anything merged to `main` is in front of other people within about a minute.

- **All work happens on `dev`.** Commit and push there freely.
- **Never merge or push to `main` unless Hadas asks for it in that turn.** Not "it's finished", not "it's verified", not "it's a small fix" — only on an explicit say-so. Treat a push to `main` as a publish, because it is one.
- Preview `dev` locally with `npm start`; there is no hosted preview for it, since Pages builds a single branch.
- When Hadas does ask, merge `dev` into `main`, push, wait for the Pages build to report `built`, and confirm against the live URL rather than assuming.

## Content status

**All seven stations are built, and all seven passwords are final** — נוצה, אופק, מדף, ענף, מצפן, גדר, חורש. They were chosen here rather than supplied by the source, and Hadas adopted them as the real ones on 2026-09-16. Facilitators announce them from paper, so changing one means reprinting; do not touch them casually.

Stations 1, 4, 5 and 7 are verified and closed. **Station 5 has a second round that is not from the source** — a two-feature rule written here on 2026-09-16 because the station ran in ninety seconds; its cards were verified by sweeping 144 candidate rules, and its concept is now `למידה מפוקחת` alone, which means unsupervised learning is previewed nowhere in the evening. Two still have open questions for the content author, both about whether the station plays fairly rather than about the digits: station 2 reads as unclear, and station 6 never defines what "closest" means for a number. See `docs/station-2-clarity.md` and `docs/station-6-neighbours.md`. Do not invent content to close them.

**Station 3 was closed on 2026-09-16 by rewriting its cards** — see `docs/station-3-rewrite.md`. Its source held two incompatible rules and no answer key; the rewrite removes the ambiguity rather than choosing between readings, and also breaks the opening-word shortcut that let the old set be sorted without meeting the station's idea. **The new card texts still need Hadas's Hebrew pass and Lotem's confirmation.**
