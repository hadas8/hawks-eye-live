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
- **There is no facilitator panel.** Facilitators hold the password list on paper. The `?dev` strip is for testing only and must be removed before the event.
- **Never reveal a station's answer, digit or password in the DOM, in a comment, or in a data attribute** on a screen a participant can reach. Teenagers will open devtools.
- **Amber `#ffb238` is the only UI accent.** An earlier attempt at per-column and per-rule colour coding tested worse and was reverted. Do not reintroduce it.
- Instructions stay minimal. When a station reads as unclear, the fix is fewer words, not more explanation.
- **`#app` uses `overflow-x: clip`, never `hidden`.** `hidden` computes `overflow-y` to `auto`, which makes `#app` a scroll container and silently kills every `position: sticky` inside it. That already shipped once: the station clock scrolled off the top of the screen on any page taller than the viewport, which is every station.
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

A colleague (Lotem) is still writing the final per-station data in Drive. Station 1's content is final and verified. Stations 2 to 7 exist only as roster entries with placeholder passwords; each has open content questions listed at the end of the build spec. Do not invent station content to fill the gaps, and do not build placeholder stations.
