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

  return `<div class="stack reveal-in">
    <div>
      <div class="eyebrow">דוח סיכום · מבצע עין הנץ</div>
      <h1>השיירה נעצרה במעבר ג'נתא</h1>
      <p class="lead">שבע התשובות שלכם צמצמו מאות דיווחים מלוכלכים לרכב אחד מתוך שישה־עשר, במעבר אחד מתוך שלושה, בלילה אחד.</p>
      <p>בקופסה לא היה חומר נפץ, אלא ערכות הכוונה — רכיבים קטנים שהופכים רקטה סטטיסטית לרקטה מדויקת. ההבדל בין השתיים הוא לא כמות הנפץ אלא מידע: רקטה סטטיסטית נוחתת אי־שם, ומדויקת פוגעת בבניין שבחרו לה מראש. המשלוח הזה היה אמור לשדרג עשרות רקטות, והוא נעצר במעבר.</p>
      <p>שני הצדדים של הלילה הזה עבדו על אותו חומר גלם. הם ניסו להפוך מידע לנשק, ואתם הפכתם מידע לתפיסה שלהם.</p>
    </div>

    <div class="panel">
      <p class="turn">לא פתרתם חידות — הפעלתם אלגוריתמים</p>
      <div class="faculty">${roster}</div>
    </div>

    <div class="scorebox">
      <div class="label">ניקוד התחנות</div>
      <div class="n">${S.score}</div>
      <p>מתוך ${MAX_TECH} · ${solved} מתוך ${STATIONS.length} תחנות נפתרו בזמן</p>
      <p class="fine">המדריכים מוסיפים לזה את נקודות המשימות החברתיות שלכם, ואז מכריזים על המנצחים.</p>
    </div>

    <div>
      <div class="finale">כל זה יחד נקרא למידת מכונה</div>
      <p class="finale-sub">הנתונים היו כאן מההתחלה — מה שחסר היה מישהו שיודע מה לשאול אותם.</p>
    </div>

    <div class="row" style="justify-content:center">
      <button class="btn-ghost" data-act="reset">איפוס המכשיר</button>
    </div>
  </div>`;
}

register('click', {
  reset() { resetBootTyping(); reset(); }
});
