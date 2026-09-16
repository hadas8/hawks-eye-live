// The "cards" station kind — station 5, מי קיבל תשובות ומי לא.
//
// TWO ROUNDS, one submit. Each round shows labelled trucks above unlabelled
// ones; the group reads the rule out of the labelled set and answers כן or
// לא on each unlabelled truck. Round one's rule is one feature, round two's
// is two at once — see src/data/station-5.js.
//
// The rules are never written down by the group. Getting the trucks right
// is the proof they found the rule, exactly as in the source.
//
// Feedback names the ROUND, never the truck. Ten binary answers with
// per-truck verdicts would let a group flip one card at a time and read the
// rule off the app instead of off the data; two rounds tell them only where
// to look again, which is what station 1 does with its tables.
//
// The digit is round one's count and nothing else, so round two is a second
// gate rather than a second number and the lock code never moves.

import { S, set, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { LABELLED, UNLABELLED, LABELLED_2, UNLABELLED_2, FEATURES } from '../data/station-5.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

// Round one occupies answer slots 0..N1-1, round two the rest. Everything
// that splits a result uses this, so the two never drift apart.
const N1 = UNLABELLED.length;
const N2 = UNLABELLED_2.length;
const N = N1 + N2;

const ROUNDS = [
  { id: 1, label: 'סבב א׳', taught: LABELLED, ask: UNLABELLED, from: 0 },
  { id: 2, label: 'סבב ב׳', taught: LABELLED_2, ask: UNLABELLED_2, from: N1 }
];

/* ── draft accessors ──────────────────────── */
const d = () => draftOf(station().n);
const picks = () => (d().picks ||= {});
const pickOf = i => picks()[i];               // true | false | undefined
const answers = () => Array.from({ length: N }, (_, i) => pickOf(i) ?? null);
const answered = () => answers().filter(v => v !== null).length;

// Which rounds were wrong last time. Cleared for a round as soon as any
// truck in it moves, because the verdict was about the answer that was
// submitted and that answer no longer exists.
const verdictOf = id => d().verdict?.[id];
const clearVerdict = id => { if (d().verdict) delete d().verdict[id]; };
const roundOf = i => (i < N1 ? 1 : 2);

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

function roundBlock(r) {
  const v = verdictOf(r.id);
  const mark = v === undefined ? '' : (v ? 'hit' : 'miss');
  const left = r.ask.filter((_, k) => pickOf(r.from + k) === undefined).length;
  return `<div class="round ${mark}">
    <div class="rhead">
      <span class="rname">${esc(r.label)}</span>
      ${v === undefined
        ? `<span class="rleft">${left ? `נותרו ${left} משאיות` : 'הושלם'}</span>`
        : `<span class="rmark">${v ? '✓ נכון' : '✗ לא נכון'}</span>`}
    </div>
    ${r.id === 2
      ? '<p class="rnote">הכלל בסבב הזה אינו הכלל של סבב א׳.</p>'
      : ''}
    <div class="eyebrow">${r.taught.length} משאיות שכבר נבדקו</div>
    <div class="cards taught t${r.taught.length}">${r.taught.map(labelledCard).join('')}</div>
    <div class="exercise-set">
      <div class="eyebrow">${r.ask.length} משאיות שלא נבדקו · החליטו על כל אחת</div>
      <div class="cards">${r.ask.map((c, k) => unlabelledCard(c, r.from + k)).join('')}</div>
    </div>
  </div>`;
}

function verdictText(res) {
  const bad = ROUNDS.filter(r => !res[r.id]);
  if (bad.length === 2) return 'לא. שני הסבבים לא נכונים. בכל סבב חזרו למשאיות שכבר נבדקו ובדקו מה באמת מבדיל ביניהן.';
  return `לא. ${bad[0].label} לא נכון. חזרו למשאיות שכבר נבדקו בסבב הזה ובדקו מה מבדיל ביניהן.`;
}

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
      <p class="q">אילו משאיות נושאות אמל"ח?</p>
      <p class="sub">שני סבבים, וכל אחד עובד לפי כלל אחר. בכל סבב: מצאו מה מבדיל בין המשאיות שכבר נבדקו, ואז החליטו על החדשות.</p>
      <p class="cap"><b>${s.maxAttempts} ניסיונות בלבד.</b> שולחים את שני הסבבים יחד, ונאמר לכם באיזה סבב טעיתם — לא באיזו משאית.</p>
    </div>

    ${ROUNDS.map(roundBlock).join('')}

    ${result ? `<p class="verdict bad">${esc(verdictText(d().verdict || {}))}</p>` : ''}

    ${hints}

    <div class="row">
      <button class="btn" data-act="submitCards" ${S.submitBlocked || done < N ? 'disabled' : ''}>${
        done < N ? `נותרו ${N - done} משאיות`
        : S.submitBlocked ? 'שנו תשובה כדי לנסות שוב'
        : 'שליחת פענוח'}</button>
      ${shown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintCards">רמז (${shown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} ניסיונות נותרו</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  pick(arg) {
    const [i, value] = arg.split(':');
    picks()[i] = value === '1';
    clearVerdict(roundOf(Number(i)));
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
      // Per ROUND, never per truck.
      d().verdict = Object.fromEntries(
        ROUNDS.map(r => [r.id, result.res.slice(r.from, r.from + r.ask.length).every(Boolean)]));
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
