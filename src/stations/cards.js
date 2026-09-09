// The "cards" station kind — station 5, מי קיבל תשובות ומי לא.
//
// Ten labelled trucks sit above six unlabelled ones. The group reads the
// rule out of the labelled set and applies it to the six, answering כן or
// לא on each. The digit is how many of the six they mark as carrying.
//
// The six answers are checked, not the rule itself: the group never writes
// the rule down anywhere, exactly as in the source. Getting all six right
// is the proof they found it.
//
// Feedback is all-or-nothing (`revealWhichWrong: false`). With six binary
// answers, saying which ones are wrong — or even how many — would let a
// group flip one card at a time and read the rule off the app instead of
// off the data.

import { S, set, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { LABELLED, UNLABELLED, FEATURES } from '../data/station-5.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

const N = UNLABELLED.length;

/* ── draft accessors ──────────────────────── */
const picks = () => (draftOf(station().n).picks ||= {});
const pickOf = i => picks()[i];               // true | false | undefined
const answers = () => UNLABELLED.map((_, i) => pickOf(i) ?? null);
const answered = () => answers().filter(v => v !== null).length;

/* ── view ─────────────────────────────────── */

// The feature rows are identical on every card, labelled or not. The
// answer key on an unlabelled card is never rendered — only the engine
// ever sees it.
const featureRows = c => FEATURES.map(f =>
  `<div class="frow"><span class="fk">${esc(f.label)}</span><span class="fv">${esc(c[f.key])}</span></div>`
).join('');

const labelledCard = c => `<div class="card ${c.carries ? 'pos' : 'neg'}">
    <div class="cid">${esc(c.id)}</div>
    ${featureRows(c)}
    <div class="tag">${c.carries ? 'נושאת אמל"ח' : 'לא נושאת'}</div>
  </div>`;

const unlabelledCard = (c, i) => {
  const pick = pickOf(i);
  return `<div class="card ask-card ${pick === undefined ? '' : 'answered'}">
    <div class="cid">${esc(c.id)}</div>
    ${featureRows(c)}
    <div class="choose">
      <button class="pick ${pick === true ? 'on' : ''}" data-act="pick" data-arg="${i}:1">כן</button>
      <button class="pick ${pick === false ? 'on' : ''}" data-act="pick" data-arg="${i}:0">לא</button>
    </div>
  </div>`;
};

export function viewCards() {
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
      <p class="q">כמה מהשש נושאות אמל"ח?</p>
      <p class="sub">מצאו מה מבדיל בין העשר שכבר נבדקו, ואז החליטו על כל אחת מהשש.</p>
      <p class="cap"><b>${s.maxAttempts} שליחות בלבד.</b> תדעו רק אם הכל נכון, לא איפה טעיתם.</p>
    </div>

    <div>
      <div class="eyebrow">עשר משאיות שכבר נבדקו</div>
      <div class="cards taught">${LABELLED.map(labelledCard).join('')}</div>
    </div>

    <div class="exercise-set">
      <div class="eyebrow">שש משאיות שלא נבדקו · החליטו על כל אחת</div>
      <div class="cards">${UNLABELLED.map(unlabelledCard).join('')}</div>
    </div>

    ${result ? '<p class="verdict bad">לא. חזרו לעשר הראשונות ובדקו שוב מה מבדיל בין הנושאות ללא נושאות.</p>' : ''}

    ${hints}

    <div class="row">
      <button class="btn" data-act="submitCards" ${S.submitBlocked || done < N ? 'disabled' : ''}>${
        done < N ? `נותרו ${N - done} משאיות`
        : S.submitBlocked ? 'שנו תשובה כדי לשלוח שוב'
        : 'שליחת פענוח'}</button>
      ${shown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintCards">רמז (${shown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} שליחות נותרו</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  pick(arg) {
    const [i, value] = arg.split(':');
    picks()[i] = value === '1';
    S.submitBlocked = false;
    S.lastResult = null;
    set();
  },

  hintCards() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submitCards() {
    const s = station();
    const submitted = answers();
    const result = grade(s, submitted);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      S.lastResult = result;
      S.submitBlocked = true;
      if (attemptsLeft() <= 0) return closeStation('attempts');
      const left = attemptsLeft();
      fx('reject', 'נדחה', 2100, left === 1 ? 'נותרה שליחה אחת' : `נותרו ${left} שליחות`);
      shake();
      return set();
    }

    solveStation(deriveDigit(s, submitted));
  }
});
