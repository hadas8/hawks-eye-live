import { S, set } from '../state.js';
import { esc } from '../lib/text.js';
import { register } from '../ui/actions.js';

const LINES = [
  'עין הנץ — מחלקת ניתוח 7, יחידה 8200',
  'סיווג: סודי ביותר',
  '',
  "קליטת ציר סוריה–לבנון ......... <span class='ok'>פעיל</span>",
  "יומן דיווחי גבול ............... <span class='no'>מלוכלך</span>",
  "זיהוי השיירה ................... <span class='no'>נכשל</span>",
  '',
  'השעה 02:17.',
  'קלטנו תנועה חריגה על ציר ההברחה.',
  'יחידה 4400 של חיזבאללה מעבירה מטען אסטרטגי מסוריה ללבנון.',
  "<span class='hi'>שבע תחנות. שבע ספרות. קופסה אחת.</span>",
  '',
  'ממתין לזיהוי צוות_'
];

let typing = false;

export const viewBoot = () => `<div class="stack">
  <div class="panel"><div class="term" id="term"></div></div>
  <div class="field">
    <span class="label">שם הצוות</span>
    <input type="text" id="gname" value="${esc(S.group)}" placeholder="למשל: שלישייה 3" autocomplete="off">
  </div>
  <div class="row">
    <button class="btn" data-act="enter">כניסה למבצע</button>
    <span class="proto">אבטיפוס — סיסמאות ותוכן תחנות 2 עד 7 עדיין זמניים</span>
  </div>
</div>`;

// Runs after the boot markup is in the DOM.
export function mountBoot() {
  if (typing) return;
  typing = true;
  let i = 0;
  (function next() {
    const term = document.getElementById('term');
    if (!term) { typing = false; return; }
    term.innerHTML = LINES.slice(0, i + 1).join('\n') + '<span class="caret"></span>';
    if (++i < LINES.length) setTimeout(next, 320);
    else typing = false;
  })();
}

export const resetBootTyping = () => { typing = false; };

register('click', {
  enter() {
    const name = document.getElementById('gname').value.trim();
    set({ group: name || 'ללא שם', screen: 'briefing' });
  }
});
