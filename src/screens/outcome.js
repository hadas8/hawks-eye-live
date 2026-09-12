// The screen a station lands on either way: solved in time, or closed
// unsolved. Both show the digit; the closed one shows it struck through,
// worth 0, and marked נמסרה, so the box can still open.
import { CFG } from '../config.js';
import { S, station } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { esc } from '../lib/text.js';
import { nextStation } from '../flow.js';
import { register } from '../ui/actions.js';

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
    <p class="next">${last
      ? 'שבע התחנות מאחוריכם.'
      : `פנו למדריך למשימה חברתית ועוד ${CFG.bonusQuestPoints} נקודות, עד שהטיימר מתאפס.`}</p>
    <button class="btn" data-act="next">${last ? 'לפתיחת המטען' : 'לתחנה הבאה'}</button>
  </div>`;
}

register('click', { next: nextStation });
