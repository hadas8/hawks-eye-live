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
  "<span class='hi'>שבע תחנות. שבע ספרות. מטען אחד.</span>",
  '',
  'ממתין לזיהוי צוות_'
];

// Typing speeds. Tuned so the whole sequence lands near 4s: slower and a
// room full of teenagers is waiting on an animation, faster and it stops
// reading as a terminal.
const CHAR_MS = 11;   // one visible character
const DOT_MS  = 4;    // the dotted leaders are filler — run them through
const LINE_MS = 70;   // a beat at each line break
const CARET = '<span class="caret"></span>';

const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

// Split a line into atoms: single characters, plus any whole HTML tag as
// one atom. Without this the status lines would type out their markup —
// "<span cla..." — as literal text.
function atomize(line) {
  const atoms = [];
  let at = 0;
  for (const m of line.matchAll(/<[^>]+>/g)) {
    for (const ch of line.slice(at, m.index)) atoms.push(ch);
    atoms.push({ tag: m[0] });
    at = m.index + m[0].length;
  }
  for (const ch of line.slice(at)) atoms.push(ch);
  return atoms;
}

let typing = false;
let run = 0;   // guards against a stale timer writing into a fresh terminal

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
  const term = document.getElementById('term');
  if (!term || typing) return;

  // Typing is motion: under reduced motion the log is simply already there.
  if (reduced.matches) {
    term.innerHTML = LINES.join('\n') + CARET;
    return;
  }

  const script = [];
  LINES.forEach((line, i) => {
    if (i) script.push('\n');
    atomize(line).forEach(atom => script.push(atom));
  });

  typing = true;
  const me = ++run;
  let out = '';
  let i = 0;

  (function step() {
    if (me !== run) return;                    // a newer run owns the terminal
    const el = document.getElementById('term');
    if (!el) { typing = false; return; }       // screen changed under us

    if (i >= script.length) { typing = false; return; }

    const atom = script[i++];
    let wait;
    if (typeof atom === 'object') { out += atom.tag; wait = 0; }
    else if (atom === '\n')       { out += atom;     wait = LINE_MS; }
    else if (atom === '.')        { out += atom;     wait = DOT_MS; }
    else                          { out += atom;     wait = CHAR_MS; }

    el.innerHTML = out + CARET;
    setTimeout(step, wait);
  })();
}

export const resetBootTyping = () => { typing = false; run++; };

register('click', {
  enter() {
    const name = document.getElementById('gname').value.trim();
    set({ group: name || 'ללא שם', screen: 'briefing' });
  }
});
