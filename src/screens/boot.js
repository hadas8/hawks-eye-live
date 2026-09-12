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
  // The terminal asks for the name and the field answers it directly below.
  // "ממתין לזיהוי צוות" alone left a group unsure that anything was being
  // asked of them, or where the answer went.
  "<span class='hi'>נדרש זיהוי צוות</span>",
  'הקלידו את שם הצוות שלכם כדי להיכנס.'
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

// The name field lives INSIDE the terminal panel, directly under the line
// that asks for it. As a separate quiet box below the panel it read as
// optional and groups walked straight past it to the button — which is how
// teams ended up scored as ללא שם on the facilitators' sheet.
export const viewBoot = () => `<div class="stack">
  <div class="panel">
    <div class="term" id="term"></div>
    <div class="idblock">
      <label class="idlabel" for="gname">שם הצוות</label>
      <div class="idrow">
        <span class="idmark" aria-hidden="true">&gt;</span>
        <input type="text" id="gname" value="${esc(S.group)}" placeholder="הקלידו כאן" autocomplete="off">
      </div>
    </div>
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
