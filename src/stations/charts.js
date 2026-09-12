// The "charts" station kind — station 2, הגרפים המשקרים.
//
// Seven envelopes, each holding two charts of identical data where one has
// been distorted. The group picks the honest chart in every envelope.
//
// Feedback is pass or fail and nothing else, per נראות התחנות: "רק בסוף יש
// הערה אם ניתן לעבור לשלב הבא או שצריך לחזור לבחור שוב את הכל בלי לדעת
// איפה הטעות". Submissions are therefore uncapped, which is safe precisely
// because nothing is revealed: seven binary choices is 128 combinations,
// and with no partial feedback there is nothing to hill-climb on, so a
// sweep costs more clicks than the seven minutes hold.
//
// Hints are per envelope rather than station-wide. The envelopes are seven
// independent puzzles, so a group stuck on ד׳ should not have to spend
// three hints on א׳ to ג׳ to reach it.

import { S, set, station, draftOf } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { ENVELOPES, chartsOf, honestPosition } from '../data/station-2.js';
import { renderChart } from '../lib/chart.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

const N = ENVELOPES.length;

/* ── draft accessors ──────────────────────── */
const picks = () => (draftOf(station().n).picks ||= {});
const pickOf = i => picks()[i];                    // 1 | 2 | undefined
const shownHints = () => (draftOf(station().n).envHints ||= {});
const answers = () => ENVELOPES.map((_, i) => pickOf(i) ?? null);
const answered = () => answers().filter(v => v !== null).length;

/* ── view ─────────────────────────────────── */
// Three hues cycle down the seven envelopes, and BOTH charts in an
// envelope get the same one. Colouring by position instead would be a
// tell, and colouring honest against lying would hand over the answer.
const hueOf = envIndex => `h${(envIndex % 3) + 1}`;

const chartCard = (spec, pos, envIndex, chosen) => `<button
    class="gcard ${chosen === pos ? 'on' : ''}" data-act="pickChart" data-arg="${envIndex}:${pos}">
    <span class="glabel">גרף ${pos}${chosen === pos ? ' · נבחר' : ''}</span>
    ${renderChart(spec, hueOf(envIndex))}
  </button>`;

function envelopeBlock(env, i) {
  const chosen = pickOf(i);
  const hinted = !!shownHints()[i];
  return `<div class="envelope ${chosen ? 'answered' : ''}">
    <div class="ehead">
      <div class="eyebrow">מעטפה ${esc(env.id)} · ${esc(env.title)}</div>
      <p class="eq">${esc(env.question)}</p>
      <p class="ehow">איזה משני הגרפים עונה על זה נכון?</p>
    </div>
    <div class="gpair">${chartsOf(env).map((spec, k) => chartCard(spec, k + 1, i, chosen)).join('')}</div>
    ${hinted
      ? `<p class="hintbar">${esc(env.hint)}</p>`
      : `<div class="row"><button class="btn-mini" data-act="hintEnv" data-arg="${i}">רמז למעטפה ${esc(env.id)}</button></div>`}
  </div>`;
}

export function viewCharts() {
  const s = station();
  const done = answered();
  const result = S.lastResult;

  return `<div class="stack">
    <div>
      <div class="eyebrow">תחנה ${s.n} מתוך ${STATIONS.length} · ${esc(s.concept)}</div>
      <h1>${esc(s.name)}</h1>
      <p class="lead">${esc(s.brief)}</p>
    </div>

    <div class="ask">
      <p class="q">איזה גרף אומר את האמת?</p>
      <p class="sub">בכל מעטפה שני הגרפים מציגים בדיוק את אותם נתונים, ואחד מהם מסודר כך שיטעה אותך. בחרו את הגרף הישר בכל שבע.</p>
      <p class="cap"><b>הכל או כלום.</b> אם משהו לא נכון תצטרכו לבחור מחדש, ולא נאמר לכם באיזו מעטפה טעיתם.</p>
    </div>

    ${ENVELOPES.map(envelopeBlock).join('')}

    ${result ? `<p class="verdict bad">${esc(result.message)}</p>` : ''}

    <div class="row">
      <button class="btn" data-act="submitCharts" ${S.submitBlocked || done < N ? 'disabled' : ''}>${
        done < N ? `נבחרו ${done} מתוך ${N}`
        : S.submitBlocked ? 'שנו בחירה כדי לנסות שוב'
        : 'שליחת פענוח'}</button>
      <span class="label">${done} מתוך ${N} מעטפות</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  pickChart(arg) {
    const [i, pos] = arg.split(':').map(Number);
    picks()[i] = pos;
    S.submitBlocked = false;
    S.lastResult = null;
    set();
  },

  hintEnv(arg) {
    shownHints()[Number(arg)] = true;
    set();
  },

  submitCharts() {
    const s = station();
    const submitted = answers();
    const result = grade(s, submitted);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      // Nothing about which envelope is wrong, deliberately.
      S.lastResult = { message: 'לא. אחד הגרפים שבחרתם מסודר כך שיטעה. עברו שוב על השבע ובדקו צירים, סדר וצבע.' };
      S.submitBlocked = true;
      fx('reject', 'נדחה', 2100, 'בחרו מחדש');
      shake();
      return set();
    }

    solveStation(deriveDigit(s, submitted));
  }
});

export { honestPosition };
