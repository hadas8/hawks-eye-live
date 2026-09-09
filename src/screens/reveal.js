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
      <div class="eyebrow">השיירה נעצרה במעבר ג'נתא</div>
      <h1>עשרות רקטות לא יידעו לאן לפגוע</h1>
      <p class="punch">הנשק שעצר אותן היה מידע.</p>
    </div>

    <div class="scorebox">
      <div class="label">ניקוד התחנות</div>
      <div class="n">${S.score}</div>
      <p>מתוך ${MAX_TECH} · ${solved} מתוך ${STATIONS.length} תחנות נפתרו בזמן</p>
      <p class="fine">המדריכים מוסיפים לזה את נקודות המשימות החברתיות שלכם, ואז מכריזים על המנצחים.</p>
    </div>

    <div>
      <div class="finale">כל מה שעשיתם הלילה נקרא למידת מכונה</div>
      <p class="finale-sub">לא פתרתם חידות — הפעלתם שבעה אלגוריתמים אמיתיים, לפני שמישהו אמר לכם איך הם נקראים.</p>
    </div>

    <div class="row" style="justify-content:center">
      <button class="btn-ghost" data-act="reset">איפוס המכשיר</button>
    </div>
  </div>`;
}

register('click', {
  reset() { resetBootTyping(); reset(); }
});
