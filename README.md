# מבצע עין הנץ — Hawk's Eye Live

A digital escape room for a live, in-person data science seminar (8200 Alumni Association / Techlift). Seven stations, seven digits, one physical box.

Static site: vanilla HTML/CSS/JS as ES modules. No build step, no bundler, no backend. Deployed to GitHub Pages.

## Running locally

Serve over HTTP rather than opening `index.html` directly — ES modules will not load over `file://`, and `localStorage` behaves differently.

```
npm start
```

That runs `tools/dev-server.js`, a zero-dependency Node static server (no `npm install` needed), on <http://localhost:5173>. Pass a port to change it: `npm start -- 8080`.

Any other static server works too, e.g. `npx serve .`.

Append `?dev` for the test strip that solves stations and prints the passwords. **It must be removed before the event.**

## Layout

| Path | What it is |
|---|---|
| `index.html` | The shell: atmosphere layers, top bar, `#stage`, ribbon, fx overlay. Everything else is rendered into it. |
| `styles/` | `tokens` → `base` → `effects` → `chrome` → `screens` → `station-tables`, loaded in that order. |
| `src/main.js` | Entry point: wires the delegated listeners, starts the clock, renders. |
| `src/config.js` | Global rules only. Anything per-station lives on the station. |
| `src/state.js` | The single state object, its persistence, and the change subscription that drives rendering. |
| `src/flow.js` | Transitions shared across modules: open, solve, close, next. |
| `src/lib/` | `text.js` (Hebrew normalization, escaping), `storage.js` (localStorage with a memory fallback). |
| `src/engine/answers.js` | The declarative answer engine: sub-answer kinds and combine rules. |
| `src/data/` | `stations.js` (the roster), `station-1.js` (the eight tables). |
| `src/screens/` | One file per screen: boot, briefing, locked, outcome, vault, reveal. |
| `src/stations/` | One file per station *kind*, plus `registry.js` mapping kind → renderer. |
| `src/ui/` | `render.js` (screen router), `chrome.js` (ribbon), `clock.js`, `fx.js`, `actions.js`. |
| `src/dev.js` | The `?dev` strip. Delete before the event. |
| `tools/dev-server.js` | Local static server. Not deployed. |
| `CLAUDE.md` | Constraints and workflow. |
| `docs/build-spec.md` | The spec: frame, timer, scoring, answer engine, station 1 data, open content questions. |
| `docs/prototype.html` | The Cowork prototype. **Reference only, superseded by the code above.** |

### How a screen gets on the page

`state.set()` → subscribers → `ui/render.js` picks a view for `S.screen` → `stage.innerHTML`. There is no router and no framework. Views are template-literal functions; interaction goes through delegated `data-act` / `data-submit` / `data-input` attributes on `#app` rather than inline handlers or globals.

### Adding a station

1. Put its content in `src/data/station-N.js`.
2. Fill in its roster entry in `src/data/stations.js`: `kind`, `maxAttempts`, `revealWhichWrong`, and an `answer` of `{ parts, rule }`.
3. If its interaction is a new shape, add `src/stations/<kind>.js` exporting a view and registering its actions, then list it in `src/stations/registry.js`.
4. Add whatever sub-answer kind it needs to `KINDS` in `src/engine/answers.js`. Unimplemented kinds throw rather than grading as wrong.

A station with no `kind` renders a plain "not built yet" panel, so the flow runs end to end regardless. Stations 2 to 7 are in that state on purpose.

## Content

Per-station content is written separately in Drive and is not final. Station 1 is done and verified. Stations 2 to 7 are roster entries only, with placeholder passwords and several disputed digits; the open questions are listed at the end of the build spec.
