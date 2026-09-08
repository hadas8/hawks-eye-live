// The screen router. One SPA, one URL, no router library: the state machine
// is boot -> briefing -> per station (locked -> active -> solved | expired)
// -> vault -> reveal.
import { S, station, onChange } from '../state.js';
import { esc } from '../lib/text.js';
import { renderChip, renderRibbon } from './chrome.js';
import { tick } from './clock.js';
import { renderDev } from '../dev.js';

import { viewBoot, mountBoot } from '../screens/boot.js';
import { viewBriefing } from '../screens/briefing.js';
import { viewLocked } from '../screens/locked.js';
import { viewOutcome } from '../screens/outcome.js';
import { viewVault } from '../screens/vault.js';
import { viewReveal } from '../screens/reveal.js';
import { rendererFor } from '../stations/registry.js';

const viewUnbuilt = () => {
  const s = station();
  return `<div class="lockwrap unbuilt">
    <div class="eyebrow">תחנה ${s.n}</div>
    <h1>${esc(s.name)}</h1>
    <p>התחנה הזאת עוד לא נבנתה. היא תיכנס לתוך אותו מבנה בדיוק.</p>
    <p>${esc(s.concept)}</p>
  </div>`;
};

function viewStation() {
  if (S.phase === 'locked') return viewLocked();
  if (S.phase === 'solved') return viewOutcome(false);
  if (S.phase === 'expired') return viewOutcome(true);
  const view = rendererFor(station().kind);
  return view ? view() : viewUnbuilt();
}

const SCREENS = {
  boot: viewBoot,
  briefing: viewBriefing,
  station: viewStation,
  vault: viewVault,
  reveal: viewReveal
};

export function render() {
  const stage = document.getElementById('stage');
  stage.innerHTML = (SCREENS[S.screen] || viewBoot)();
  if (S.screen === 'boot') mountBoot();

  renderChip();
  renderRibbon();
  renderDev();
  tick();
}

onChange(render);
