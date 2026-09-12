// The "boxes" station kind — station 3, הכלל הנסתר.
//
// Six pre-sorted cards sit in three unlabelled boxes. The group works out
// what the sorting rule is and applies it to twenty new cards, then counts
// one box. The rule itself is never written down by the group: getting all
// twenty right is the proof they found it, the same shape as station 5.
//
// The source has the group physically drag paper cards into boxes. Here a
// card carries three buttons instead. Dragging on a tablet, in a dark room,
// with twenty cards and a seven-minute clock, is a dexterity test rather
// than a thinking one, and the result is identical.
//
// The boxes stay unlabelled on screen. The source is explicit — "אין
// תוויות על הקופסאות!" — and the labels are the answer.
//
// Feedback is all-or-nothing. Twenty cards over three boxes with per-card
// verdicts and three submissions would let a group read the rule off the
// app one card at a time.

import { S, set, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { BOXES, EXAMPLES, CARDS, DIGIT_BOX } from '../data/station-3.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

const N = CARDS.length;

/* ── draft accessors ──────────────────────── */
const picks = () => (draftOf(station().n).picks ||= {});
const pickOf = n => picks()[n];                    // 'א' | 'ב' | 'ג' | undefined
const answers = () => CARDS.map(c => pickOf(c.n) ?? null);
const answered = () => answers().filter(v => v !== null).length;
const tally = box => CARDS.filter(c => pickOf(c.n) === box).length;

/* ── view ─────────────────────────────────── */
// A box, and inside it two cards that look exactly like the twenty below.
// The first cut drew the box and its contents as one panel, so it read as a
// paragraph with two sentences rather than as a container holding two of the
// same objects the group is about to sort. The source draws them as separate
// cards for that reason — it colour-codes them too, which this cannot follow,
// so the containment has to carry the whole job.
// Each box carries its own colour, and so does a card sent to it. One
// class, `bx1`..`bx3`, sets --bc and --bcs for everything downstream.
const boxClass = box => `bx${BOXES.indexOf(box) + 1}`;

const exampleBox = box => `<div class="ebox ${boxClass(box)}">
    <div class="eblid"><span class="ebletter">${esc(box)}׳</span>
      <span class="ebnote">כבר מוינו</span></div>
    <div class="ebwell">${EXAMPLES.filter(e => e.box === box).map((e, k) =>
      `<div class="ecard"><div class="ecn">כרטיס דוגמה ${k + 1}</div>
        <p class="ect">${esc(e.text)}</p></div>`).join('')}</div>
  </div>`;

const sortCard = c => {
  const pick = pickOf(c.n);
  return `<div class="qcard ${pick ? 'placed ' + boxClass(pick) : ''}">
    <div class="qn">${c.n}</div>
    <p class="qt">${esc(c.text)}</p>
    <div class="qboxes">${BOXES.map(b =>
      `<button class="qb ${boxClass(b)} ${pick === b ? 'on' : ''}" data-act="putCard"
        data-arg="${c.n}:${b}" aria-label="כרטיס ${c.n} לקופסה ${b}">${esc(b)}׳</button>`).join('')}</div>
  </div>`;
};

export function viewBoxes() {
  const s = station();
  const shown = S.hints[s.n] || 0;
  const done = answered();
  const result = S.lastResult;

  const hints = Array.from({ length: shown },
    (_, i) => `<p class="hintbar">${esc(s.hints[i])}</p>`).join('');

  return `<div class="stack">
    <div>
      <div class="eyebrow">תחנה ${s.n} מתוך ${STATIONS.length} · ${esc(s.concept)}</div>
      <h1>${esc(s.name)}</h1>
      <p class="lead">${esc(s.brief)}</p>
    </div>

    <div class="ask">
      <p class="q">לאיזו קופסה שייך כל כרטיס?</p>
      <p class="sub">שישה כרטיסים כבר מוינו. מצאו לפי מה, והמשיכו באותו כלל.</p>
      <p class="cap"><b>${s.maxAttempts} ניסיונות בלבד.</b> תדעו רק אם הכל נכון, לא איפה טעיתם.</p>
    </div>

    <div>
      <div class="eyebrow">שלוש קופסאות · שני כרטיסים כבר בפנים</div>
      <div class="eboxes">${BOXES.map(exampleBox).join('')}</div>
    </div>

    <div class="exercise-set">
      <div class="eyebrow">עשרים כרטיסים · שלחו כל אחד לקופסה</div>
      <div class="qcards">${CARDS.map(sortCard).join('')}</div>
    </div>

    <div class="tallies">
      ${BOXES.map(b => `<div class="tal ${boxClass(b)}"><span class="tk">קופסה ${esc(b)}׳</span>
        <span class="tv">${tally(b)}</span></div>`).join('')}
      <div class="tal total"><span class="tk">סה"כ</span><span class="tv">${done}</span></div>
    </div>

    ${result ? '<p class="verdict bad">לא. חזרו לשישה הכרטיסים שכבר מוינו ובדקו מה באמת משותף לכל זוג.</p>' : ''}

    ${hints}

    <div class="row">
      <button class="btn" data-act="submitBoxes" ${S.submitBlocked || done < N ? 'disabled' : ''}>${
        done < N ? `נותרו ${N - done} כרטיסים`
        : S.submitBlocked ? 'שנו מיון כדי לנסות שוב'
        : 'שליחת פענוח'}</button>
      ${shown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintBoxes">רמז (${shown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} ניסיונות נותרו</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  putCard(arg) {
    const [n, box] = arg.split(':');
    picks()[n] = box;
    S.submitBlocked = false;
    S.lastResult = null;
    set();
  },

  hintBoxes() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submitBoxes() {
    const s = station();
    const submitted = answers();
    const result = grade(s, submitted);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      S.lastResult = result;
      S.submitBlocked = true;
      if (attemptsLeft() <= 0) return closeStation('attempts');
      const left = attemptsLeft();
      fx('reject', 'נדחה', 2100, left === 1 ? 'נותר ניסיון אחד' : `נותרו ${left} ניסיונות`);
      shake();
      return set();
    }

    solveStation(deriveDigit(s, submitted));
  }
});

export { DIGIT_BOX };
