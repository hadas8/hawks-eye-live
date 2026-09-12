// The "forest" station kind — station 7, שמונה אנליסטים.
//
// Eight analysts, each holding two readings and a three-row decision table.
// The group fires one row per analyst and the eight verdicts are counted;
// the site with the most votes gives the digit.
//
// WHAT THE GROUP DOES IS PICK THE ROW, not read off an answer. The draft
// hands each analyst's verdict straight to the person holding the card,
// which on paper is fine because the work was the isolation. On one screen
// that would be eight sentences to copy, so the lookup itself becomes the
// task: two readings against three conditions, eight times.
//
// The isolation cannot survive one device — the draft's drama is eight
// people writing covered notes and revealing on a countdown, and here
// everyone sees everything. What is kept is the shape of it: no tally is
// shown until all eight rows are fired, and then all eight resolve at once.
// "No analyst sees the whole picture" is still true, and still the point.
//
// Feedback is all-or-nothing. Eight picks from three is 6561, so there is
// nothing to sweep, and naming the wrong analyst would turn a lookup into
// a guessing game.

import { S, set, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { ANALYSTS, SITES, tally, winnerOf, codeOf } from '../data/station-7.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

const N = ANALYSTS.length;

/* ── draft accessors ──────────────────────── */
const d = () => draftOf(station().n);
const picks = () => (d().picks ||= {});
const rowOf = n => picks()[n];                     // 0 | 1 | 2 | undefined
const answers = () => ANALYSTS.map(a => rowOf(a.n) ?? null);
const done = () => answers().filter(v => v !== null).length;
const allIn = () => done() === N;

const verdictOf = n => d().verdict?.[n];
const clearVerdict = n => { if (d().verdict) delete d().verdict[n]; };

/* ── view ─────────────────────────────────── */
function analystCard(a) {
  const row = rowOf(a.n);
  const v = verdictOf(a.n);
  const mark = v === undefined ? '' : (v ? 'hit' : 'miss');
  return `<div class="acard ${row === undefined ? '' : 'fired'} ${mark}">
    <div class="ahead">
      <span class="anum">אנליסט ${a.n}</span>
      ${v === undefined ? '' : `<span class="amark">${v ? '✓' : '✗'}</span>`}
    </div>
    <div class="asees">${a.readings.map(r =>
      `<span class="areading">${esc(r.k)}: <b>${esc(r.v)}</b></span>`).join('')}</div>
    <div class="arules">${a.rules.map((r, i) =>
      `<button class="arow ${row === i ? 'on' : ''}" data-act="fireRow" data-arg="${a.n}:${i}">
        <span class="awhen">${esc(r.when)}</span>
        <span class="asite">${esc(r.site)}</span>
      </button>`).join('')}</div>
  </div>`;
}

// Eight covered slips until the last row is fired, then all eight at once.
function slipsBlock() {
  if (!allIn()) {
    return `<div class="slips">
      <div class="eyebrow">שמונה פתקים מכוסים · ${done()} מתוך ${N} הוכרעו</div>
      <div class="sliprow">${ANALYSTS.map(a =>
        `<span class="slip ${rowOf(a.n) === undefined ? '' : 'ready'}">${a.n}</span>`).join('')}</div>
      <p class="sub">אף אנליסט לא רואה את התמונה המלאה. הקולות ייחשפו רק כששמונתם יוכרעו.</p>
    </div>`;
  }
  const votes = tally(answers());
  const win = winnerOf(votes);
  return `<div class="slips open">
    <div class="eyebrow">שמונת הקולות</div>
    <div class="sliprow">${ANALYSTS.map(a =>
      `<span class="slip said">${a.n}<b>${esc(a.rules[rowOf(a.n)].site)}</b></span>`).join('')}</div>
    <div class="tallyrow">${SITES.map(s =>
      `<div class="vote ${win === s.name ? 'won' : ''}">
        <span class="vname">${esc(s.name)}</span>
        <span class="vn">${votes[s.name]}</span>
      </div>`).join('')}</div>
  </div>`;
}

export function viewForest() {
  const s = station();
  const shown = S.hints[s.n] || 0;
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
      <p class="q">איזו שורה מתאימה לכל אנליסט?</p>
      <p class="sub">לכל אנליסט שני נתונים בלבד ושלוש שורות. סמנו את השורה הראשונה שמתאימה לשניהם, והיא זו שקובעת את האתר שלו.</p>
      <p class="cap"><b>${s.maxAttempts} ניסיונות בלבד.</b> תדעו רק אם הכל נכון, לא איפה טעיתם.</p>
    </div>

    <div class="acards">${ANALYSTS.map(analystCard).join('')}</div>

    ${slipsBlock()}

    ${result ? '<p class="verdict bad">לא. אצל לפחות אחד מהם השורה שסימנתם לא מתאימה לשני הנתונים שלו. עברו עליהם שוב מלמעלה למטה — השורה הראשונה שמתאימה היא הקובעת.</p>' : ''}

    ${hints}

    <div class="row">
      <button class="btn" data-act="submitForest" ${S.submitBlocked || !allIn() ? 'disabled' : ''}>${
        !allIn() ? `הוכרעו ${done()} מתוך ${N} אנליסטים`
        : S.submitBlocked ? 'שנו הכרעה כדי לנסות שוב'
        : 'שליחת פענוח'}</button>
      ${shown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintForest">רמז (${shown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} ניסיונות נותרו</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  fireRow(arg) {
    const [n, row] = arg.split(':').map(Number);
    const was = allIn();
    picks()[n] = row;
    clearVerdict(n);
    S.submitBlocked = false;
    S.lastResult = null;
    set();
    // The reveal: the moment the eighth analyst is decided, all eight slips
    // turn over at once. This is the countdown from the draft, which is the
    // only part of its isolation that a single screen can keep.
    if (!was && allIn()) fx('wipe', 'שמונה קולות', 900, 'נחשפים');
  },

  hintForest() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submitForest() {
    const s = station();
    const submitted = answers();
    const result = grade(s, submitted);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      if (s.revealWhichWrong) {
        d().verdict = Object.fromEntries(ANALYSTS.map((a, i) => [a.n, result.res[i]]));
      }
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

export { codeOf };
