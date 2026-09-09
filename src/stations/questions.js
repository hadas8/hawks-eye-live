// The "questions" station kind — station 4, השאלה ששווה לשאול.
//
// The fleet of sixteen is on screen. Twenty candidate questions sit below
// it and the group picks four. Filtering is commutative, so the four are a
// set and the order they were picked in is never checked.
//
// What the screen deliberately does NOT show, because working it out is the
// station: how many vehicles each question would cut, and which vehicles
// survive. Printing "cuts 8" beside each question would reduce the whole
// thing to picking the four largest numbers.
//
// After a submit — right or wrong — the group is shown the funnel their own
// four questions produced, question by question. On a wrong answer that is
// the only feedback given: it describes what they chose without pointing at
// what they should have chosen, and it is what makes a rejection legible
// when the group is staring at a single surviving vehicle. A set built on
// question 5 lands on vehicle 4 with cuts of 15, 0, 0, 0, and seeing those
// three zeros is the lesson arriving on its own.

import { S, set, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { FLEET, QUESTIONS, COLUMNS, PICK, answerOn, funnel } from '../data/station-4.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

/* ── draft accessors ──────────────────────── */
const chosen = () => (draftOf(station().n).chosen ||= []);
const isChosen = id => chosen().includes(id);

/* ── view ─────────────────────────────────── */
const cell = (v, key) => `<td class="${key === 'n' ? 'm' : ''}">${esc(v[key])}</td>`;

const fleetRow = v => `<tr>
    <td class="m">${v.n}</td>
    ${['colour', 'antenna', 'wheels', 'box', 'dir', 'glass', 'flag'].map(k => cell(v, k)).join('')}
  </tr>`;

// Each question states what the real vehicle answers, exactly as the source
// card does. That is given; what it costs you is not.
const questionRow = q => {
  const on = isChosen(q.id);
  return `<button class="qrow ${on ? 'on' : ''}" data-act="pickQ" data-arg="${q.id}">
      <span class="qn">${q.id}</span>
      <span class="qt">${esc(q.text)}</span>
      <span class="qa">הרכב עונה <b>${answerOn(q)}</b></span>
    </button>`;
};

export function viewQuestions() {
  const s = station();
  const picked = chosen();
  const shown = S.hints[s.n] || 0;
  const result = S.lastResult;

  const hints = Array.from({ length: shown },
    (_, i) => `<p class="hintbar">${esc(s.hints[i])}</p>`).join('');

  // Shown after a submit, right or wrong: what their own four did.
  const trace = result ? `<div class="funnel">
      <div class="eyebrow">מה שארבע השאלות שלכם עשו</div>
      <div class="frow head"><span>שאלה</span><span>פסלה</span><span>נשארו</span></div>
      ${funnel(result.picked).map(f => `<div class="frow">
          <span class="fq">${f.id}. ${esc(f.text)}</span>
          <span class="fc ${f.cut === 0 ? 'nil' : ''}">${f.cut}</span>
          <span class="fl">${f.left}</span>
        </div>`).join('')}
    </div>
    <p class="verdict bad">${esc(result.message)}</p>` : '';

  return `<div class="stack">
    <div>
      <div class="eyebrow">תחנה ${s.n} מתוך ${STATIONS.length} · ${esc(s.concept)}</div>
      <h1>${esc(s.name)}</h1>
      <p class="lead">${esc(s.brief)}</p>
    </div>

    <div class="ask">
      <p class="q">איזה רכב נושא את המטען?</p>
      <p class="sub">בחרו ארבע שאלות שיצמצמו את הצי לרכב אחד. הסדר לא משנה.</p>
      <p class="cap"><b>${s.maxAttempts} שליחות בלבד.</b> אחרי כל שליחה תראו מה כל שאלה שלכם פסלה.</p>
    </div>

    <div>
      <div class="eyebrow">הצי · שישה־עשר רכבים</div>
      <div class="tablewrap"><table>
        <thead><tr>${COLUMNS.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${FLEET.map(fleetRow).join('')}</tbody>
      </table></div>
    </div>

    <div class="qset">
      <div class="eyebrow">עשרים שאלות · בחרו ${PICK}</div>
      <div class="qlist">${QUESTIONS.map(questionRow).join('')}</div>
    </div>

    ${trace}
    ${hints}

    <div class="row">
      <button class="btn" data-act="submitQ" ${S.submitBlocked || picked.length !== PICK ? 'disabled' : ''}>${
        picked.length !== PICK ? `נבחרו ${picked.length} מתוך ${PICK}`
        : S.submitBlocked ? 'שנו בחירה כדי לשלוח שוב'
        : 'שליחת פענוח'}</button>
      ${shown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintQ">רמז (${shown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} שליחות נותרו</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  pickQ(arg) {
    const id = Number(arg);
    const picked = chosen();
    const at = picked.indexOf(id);
    if (at >= 0) picked.splice(at, 1);
    else if (picked.length < PICK) picked.push(id);
    else return;                       // four already; deselect one first
    S.submitBlocked = false;
    S.lastResult = null;
    set();
  },

  hintQ() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submitQ() {
    const s = station();
    const picked = chosen().slice();
    const result = grade(s, [picked]);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      const steps = funnel(picked);
      const left = steps[steps.length - 1].left;
      // Two different failures, and they need different sentences. Landing
      // on one vehicle via a giveaway is the interesting one: the group is
      // looking at a correct-looking screen and being told no.
      S.lastResult = {
        picked,
        message: left === 1
          ? 'הגעתם לרכב אחד, אבל שאלה אחת עשתה את כל העבודה והשאר לא פסלו כלום. חפשו ארבע שאלות שכל אחת מהן חותכת את הצי בחצי.'
          : `נשארו ${left} רכבים. שאלה שרוב הצי עונה עליה אותו דבר כמעט לא מצמצמת.`
      };
      S.submitBlocked = true;
      if (attemptsLeft() <= 0) return closeStation('attempts');
      const n = attemptsLeft();
      fx('reject', 'נדחה', 2100, n === 1 ? 'נותרה שליחה אחת' : `נותרו ${n} שליחות`);
      shake();
      return set();
    }

    solveStation(deriveDigit(s, [picked]));
  }
});
