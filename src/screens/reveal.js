// The closing reveal. Shows only this group's technical score; facilitators
// add the social bonus points on paper. No cross-group comparison, by design.
import { CFG } from '../config.js';
import { S, reset } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { esc } from '../lib/text.js';
import { register } from '../ui/actions.js';
import { resetBootTyping } from './boot.js';

const MAX_TECH = STATIONS.length * CFG.pointsPerStation;

export function viewReveal() {
  const solved = STATIONS.filter(s => S.digits[s.n] != null && !S.given[s.n]).length;

  const roster = STATIONS.map(s => {
    const given = !!S.given[s.n];
    return `<span class="k ${given ? 'g' : ''}">${s.n} · ${S.digits[s.n] ?? '·'}</span>
      <span class="v">${esc(s.concept)}<small>${esc(s.name)}${given ? ' · נמסרה' : ''}</small></span>`;
  }).join('');

  return `<div class="stack">
    <div>
      <div class="eyebrow">הקופסה נפתחה</div>
      <h1>לא פתרתם חידות. הפעלתם אלגוריתמים.</h1>
      <p class="lead">שבע התחנות לא היו משחק. כל אחת מהן היא שיטה אמיתית שמערכות מודיעין משתמשות בה, ואתם הפעלתם אותה בידיים לפני שמישהו אמר לכם איך היא נקראת.</p>
    </div>

    <div class="panel"><div class="faculty">${roster}</div></div>

    <div class="scorebox">
      <div class="label">ניקוד התחנות</div>
      <div class="n">${S.score}</div>
      <p>מתוך ${MAX_TECH} · ${solved} מתוך ${STATIONS.length} תחנות נפתרו בזמן</p>
      <p class="fine">המדריכים מוסיפים לזה את נקודות המשימות החברתיות שלכם, ואז מכריזים על המנצחים.</p>
    </div>

    <div>
      <div class="finale">כל זה יחד נקרא למידת מכונה</div>
      <p class="finale-sub">הנתונים היו כאן מההתחלה. מה שהיה חסר זה מי שיודע מה לשאול אותם.</p>
    </div>

    <div class="row" style="justify-content:center">
      <button class="btn-ghost" data-act="reset">איפוס המכשיר</button>
    </div>
  </div>`;
}

register('click', {
  reset() { resetBootTyping(); reset(); }
});
