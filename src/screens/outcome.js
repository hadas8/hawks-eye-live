// The screen a station lands on either way: solved in time, or closed
// unsolved. Both show the digit; the closed one shows it struck through,
// worth 0, and marked נמסרה, so the box can still open.
import { CFG } from '../config.js';
import { S, station } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { esc } from '../lib/text.js';
import { nextStation } from '../flow.js';
import { register } from '../ui/actions.js';

// A station may carry an epilogue: something shown once, after its digit,
// that is the point of the station rather than a question about it. Only
// station 7 has one — the accuracy card, which is the payoff of the whole
// evening and lands on the last station. It is never shown on a station
// that timed out, because it would be giving away an answer they never got.
const epilogueHtml = e => `<div class="epilogue">
  <div class="eyebrow">${esc(e.eyebrow)}</div>
  <div class="accrow">${e.accuracy.map(a =>
    `<span class="acc ${a.best ? 'best' : ''}">${a.n}<b>${a.pct}%</b></span>`).join('')}</div>
  ${e.lines.map(l => `<p>${l}</p>`).join('')}
</div>`;

export function viewOutcome(expired) {
  const s = station();
  const last = S.idx === STATIONS.length - 1;

  const eyebrow = expired
    ? (S.closedBy === 'attempts' ? 'נגמרו הניסיונות' : 'חלון הזמן נסגר')
    : `תחנה ${s.n} נפתרה`;

  return `<div class="solved">
    <div class="eyebrow">${eyebrow} · ${esc(s.name)}</div>
    <div class="bigdigit ${expired ? 'grey' : ''}">${S.digits[s.n]}</div>
    <p class="pts ${expired ? 'zero' : ''}">${expired
      ? 'הספרה נמסרה לכם · 0 נקודות'
      : `+${CFG.pointsPerStation} נקודות`}</p>
    <p class="say">${expired
      ? 'הקוד לא ייתקע בגללכם, והספרה מסומנת כדי שתדעו איפה נשארה עבודה.'
      : 'האלגוריתם שהרגע הפעלתם נקרא ' + esc(s.concept) + '.'}</p>
    ${!expired && s.epilogue ? epilogueHtml(s.epilogue) : ''}

    <p class="next">${last
      ? 'שבע התחנות מאחוריכם.'
      : 'פנו למדריך למשימה חברתית עד שכל החדר מסיים, ואז לסיסמה הבאה.'}</p>
    <button class="btn" data-act="next">${last ? 'לפתיחת המטען' : 'לתחנה הבאה'}</button>
  </div>`;
}

register('click', { next: nextStation });
