// The closing reveal. Deliberately short: one dramatic consequence, the
// score, and the name of the thing they just did.
//
// It does not recap the seven algorithms. Each station already names its own
// concept on its solved screen, and the ribbon already shows all seven
// digits, so a summary list said both things a second time and blunted the
// ending. Shows only this group's technical score; facilitators add the
// social bonus points on paper. No cross-group comparison, by design.
import { CFG } from '../config.js';
import { S, reset } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { register } from '../ui/actions.js';
import { resetBootTyping } from './boot.js';

const MAX_TECH = STATIONS.length * CFG.pointsPerStation;

export function viewReveal() {
  const solved = STATIONS.filter(s => S.digits[s.n] != null && !S.given[s.n]).length;

  return `<div class="stack reveal-in">
    <div>
      <div class="eyebrow">מעבר ג'נתא · 03:41</div>
      <h1>כל הכבוד, סיכלתם את המבצע</h1>
      <p class="lead">המשלוח נעצר, והרקטות שלהם ימשיכו לפספס.</p>
    </div>

    <div class="scorebox">
      <div class="label">ניקוד התחנות</div>
      <div class="n">${S.score}</div>
      <p>מתוך ${MAX_TECH} · ${solved} מתוך ${STATIONS.length} תחנות נפתרו בזמן</p>
      <p class="showto">הציגו את המסך הזה למדריכים.</p>
      <p class="fine">הם מוסיפים לניקוד את נקודות המשימות החברתיות שלכם, ואז מכריזים על המנצחים.</p>
    </div>

    <div class="close">
      <div class="finale">לזה קוראים למידת מכונה</div>
      <p class="finale-sub">כל תחנה כאן היא שיטה שמנתחי מודיעין עובדים איתה באמת.</p>
    </div>

    <div class="row" style="justify-content:center">
      <button class="btn-ghost" data-act="reset">איפוס המכשיר</button>
    </div>
  </div>`;
}

register('click', {
  reset() { resetBootTyping(); reset(); }
});
