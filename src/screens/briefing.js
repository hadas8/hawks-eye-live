import { CFG } from '../config.js';
import { set } from '../state.js';
import { register } from '../ui/actions.js';

export const viewBriefing = () => `<div class="stack">
  <div>
    <div class="eyebrow">תדריך פתיחה · מבצע עין הנץ</div>
    <h1>יש לנו הכל, אבל אנחנו לא רואים כלום</h1>
    <p class="lead">אתם קציני מודיעין במחלקת ניתוח 7 ביחידה 8200. הלילה חוצה שיירה של חיזבאללה את ציר ההברחה מסוריה ללבנון, ויש לנו את כל מה שצריך כדי לעצור אותה — רק שאף אחד עוד לא הצליח לקרוא את הנתונים.</p>
    <p>שבע תחנות מפרידות בינינו ובין המעבר הנכון. כל תחנה נותנת ספרה אחת, ושבע הספרות פותחות את הקופסה.</p>
  </div>

  <div class="panel">
    <div class="eyebrow">נהלים</div>
    <div class="faculty">
      <span class="k">01</span>
      <span class="v">המדריך מכריז את סיסמת התחנה בקול, ובלעדיה המסך לא נפתח.
        <small>כל הצוותים פותחים כל תחנה יחד</small></span>
      <span class="k">02</span>
      <span class="v">מרגע הסיסמה יש לכם 7 דקות לתחנה.
        <small>השעון מתחיל כשאתם מקלידים אותה, לא לפני</small></span>
      <span class="k">03</span>
      <span class="v">תחנה שנפתרה בזמן שווה ${CFG.pointsPerStation} נקודות.
        <small>נגמר הזמן ולא פתרתם? תקבלו את הספרה בכל מקרה, בלי נקודות</small></span>
      <span class="k">04</span>
      <span class="v">סיימתם מוקדם? פנו למדריך למשימה חברתית.
        <small>כל משימה כזאת שווה ${CFG.bonusQuestPoints} נקודות שהמדריכים סופרים בנפרד</small></span>
    </div>
  </div>

  <div class="row"><button class="btn" data-act="toStation">לתחנה הראשונה</button></div>
</div>`;

register('click', {
  toStation() { set({ screen: 'station', phase: 'locked' }); }
});
