// Persistent chrome: the group chip and the 7-slot code ribbon.
// The ribbon renders only digits the group already holds. An unearned slot
// is a dot — never the real digit in a hidden attribute or a title.
import { S } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { esc } from '../lib/text.js';

export function renderChip() {
  const chip = document.getElementById('groupchip');
  chip.hidden = !S.group;
  chip.textContent = S.group ? 'צוות ' + S.group : '';
}

export function renderRibbon() {
  const r = document.getElementById('ribbon');
  const slots = STATIONS.map((s, i) => {
    const has = S.digits[s.n] != null;
    const given = !!S.given[s.n];
    const cls = has
      ? (given ? 'given' : 'earned' + (S.fresh === s.n ? ' fresh' : ''))
      : (i === S.idx && S.screen === 'station' ? 'current' : '');
    const title = esc(s.name) + (given ? ' — נמסרה, לא נפתרה' : '');
    return `<div class="slot ${cls}" title="${title}">
        <span class="n">${s.n}</span>
        <span class="d">${has ? S.digits[s.n] : '·'}</span>
      </div>`;
  }).join('');

  // The label stays in the RTL flow with the rest of the chrome; the slots
  // sit in an LTR group so station 1 is leftmost and the digits read left to
  // right, in the order the code is entered into the physical lock.
  r.innerHTML = `<span class="label">קוד המנעול</span><div class="slots">${slots}</div>`;
}
