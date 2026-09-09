// The "questions" station kind — station 4, השאלה ששווה לשאול.
//
// The fleet of sixteen sits at the top and stays there. Below it are the
// twenty candidate questions, each stating the answer as it applies to the
// real vehicle — תשובה על הרכב האמיתי, which the source gives away too.
// The group writes four question numbers into the union sheet.
//
// Tapping a question previews it: the vehicles it rules out go dim in the
// table, and the survivors stay lit. **No count is ever printed.** The
// source worksheet asks the group to write down כמה רכבים מסננת for each
// question, and printing the number would do that work for them — the
// station would collapse into reading twenty numbers and picking the four
// biggest. Highlighting shows them where to count, not what the answer is.
//
// The preview is always measured against the whole fleet of sixteen, never
// against what previously chosen questions already removed. That matches
// the worksheet, and it keeps the hard part hard: four questions can each
// halve the fleet and still be worthless together, because "is it white"
// and "is the number even" cut along exactly the same line. Nothing on
// screen reveals that — the funnel after a submit does.

import { S, set, save, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { FLEET, QUESTIONS, COLUMNS, PICK, answerOn, funnel, eliminatedBy } from '../data/station-4.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

/* ── draft accessors ──────────────────────── */
const sheet = () => (draftOf(station().n).slots ||= Array(PICK).fill(''));
const preview = () => draftOf(station().n).preview ?? null;

// The four numbers as written, ignoring blanks and anything out of range.
const chosenIds = () => sheet()
  .map(v => parseInt(v, 10))
  .filter(n => Number.isInteger(n) && n >= 1 && n <= QUESTIONS.length);
const filled = () => sheet().filter(v => String(v).trim() !== '').length;

/* ── view ─────────────────────────────────── */
const fleetRow = (v, out) => `<tr class="${out.has(v.n) ? 'out' : ''}">
    <td class="m">${v.n}</td>
    ${['colour', 'antenna', 'wheels', 'box', 'dir', 'glass', 'flag']
      .map(k => `<td${k === 'n' ? ' class="m"' : ''}>${esc(v[k])}</td>`).join('')}
  </tr>`;

const questionRow = (q, shown, picked) => `<button
    class="qrow ${q.id === shown ? 'shown' : ''} ${picked.includes(q.id) ? 'on' : ''}"
    data-act="showQ" data-arg="${q.id}">
    <span class="qn">${q.id}</span>
    <span class="qt">${esc(q.text)}</span>
    <span class="qa">תשובה על הרכב האמיתי <b>${answerOn(q)}</b></span>
  </button>`;

export function viewQuestions() {
  const s = station();
  const shownId = preview();
  const picked = chosenIds();
  const out = shownId ? eliminatedBy(shownId) : new Set();
  const hintsShown = S.hints[s.n] || 0;
  const result = S.lastResult;

  const hints = Array.from({ length: hintsShown },
    (_, i) => `<p class="hintbar">${esc(s.hints[i])}</p>`).join('');

  const slots = sheet().map((v, i) => `<label class="slot-q">
      <span class="k">שאלה ${i + 1}</span>
      <input type="number" inputmode="numeric" min="1" max="${QUESTIONS.length}"
             value="${esc(v)}" data-input="slotQ" data-arg="${i}">
    </label>`).join('');

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
      <p class="sub">בחרו ארבע שאלות שכל אחת חותכת את הצי בחצי, וביחד מצמצמות אותו לרכב אחד.</p>
      <ul class="keys">
        <li>לחצו על שאלה כדי לראות מי נפסל בגללה. הסדר לא משנה.</li>
      </ul>
      <p class="cap"><b>${s.maxAttempts} שליחות בלבד.</b> אחרי כל שליחה תראו כמה כל שאלה שלכם פסלה.</p>
    </div>

    <div>
      <div class="eyebrow">הצי · שישה־עשר רכבים${
        shownId ? ` · מוצגת שאלה ${shownId}` : ''}</div>
      <div class="tablewrap"><table class="fleet">
        <thead><tr>${COLUMNS.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${FLEET.map(v => fleetRow(v, out)).join('')}</tbody>
      </table></div>
      ${shownId ? `<div class="tfoot">
        <span class="cnt">הרכבים הכהים נפסלים בגלל שאלה ${shownId}. ספרו כמה נשארו.</span>
        <button class="btn-mini" data-act="clearShow">נקה הדגשה</button>
      </div>` : ''}
    </div>

    <div class="qset">
      <div class="eyebrow">עשרים שאלות</div>
      <div class="qlist">${QUESTIONS.map(q => questionRow(q, shownId, picked)).join('')}</div>
    </div>

    <div class="panel"><div class="stack">
      <div class="eyebrow">דף האיחוד · רשמו ארבעה מספרי שאלות</div>
      <div class="qsheet">${slots}</div>
    </div></div>

    ${trace}
    ${hints}

    <div class="row">
      <button class="btn" data-act="submitQ" ${S.submitBlocked || picked.length !== PICK ? 'disabled' : ''}>${
        filled() < PICK ? `נרשמו ${filled()} מתוך ${PICK}`
        : picked.length !== PICK ? 'מספרי שאלות לא תקינים'
        : S.submitBlocked ? 'שנו בחירה כדי לשלוח שוב'
        : 'שליחת פענוח'}</button>
      ${hintsShown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintQ">רמז (${hintsShown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} שליחות נותרו</span>
    </div>
  </div>`;
}

/* ── in-place patch on typing ─────────────────
   A full re-render on every keystroke would steal focus from the box being
   typed into, so only what a typed number changes is patched. */
function patchAfterTyping() {
  const picked = chosenIds();
  const btn = document.querySelector('[data-act="submitQ"]');
  if (btn) {
    btn.disabled = picked.length !== PICK;
    btn.textContent = filled() < PICK ? `נרשמו ${filled()} מתוך ${PICK}`
      : picked.length !== PICK ? 'מספרי שאלות לא תקינים'
      : 'שליחת פענוח';
  }
  document.querySelectorAll('.qrow').forEach(el => {
    const id = Number(el.dataset.arg);
    el.classList.toggle('on', picked.includes(id));
  });
  document.querySelector('.verdict')?.remove();
  document.querySelector('.funnel')?.remove();
}

/* ── actions ──────────────────────────────── */
register('click', {
  // Preview only. Choosing happens in the union sheet, so a group can weigh
  // all twenty questions without spending anything.
  showQ(arg) {
    const id = Number(arg);
    const d = draftOf(station().n);
    d.preview = d.preview === id ? null : id;
    set();
  },

  clearShow() {
    draftOf(station().n).preview = null;
    set();
  },

  hintQ() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submitQ() {
    const s = station();
    const picked = chosenIds();
    const result = grade(s, [picked]);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      const steps = funnel(picked);
      const left = steps.length ? steps[steps.length - 1].left : FLEET.length;
      const repeats = new Set(picked).size !== picked.length;
      // Three different failures needing three different sentences. Landing
      // on one vehicle anyway is the interesting one: the group is looking
      // at a correct-looking screen and being told no.
      S.lastResult = {
        picked,
        message: repeats
          ? 'רשמתם את אותה שאלה יותר מפעם אחת. ארבע שאלות שונות.'
          : left === 1
            ? 'הגעתם לרכב אחד, אבל שאלה אחת עשתה את כל העבודה והשאר לא פסלו כלום. חפשו ארבע שאלות שכל אחת מהן חותכת את הצי בחצי.'
            : `נשארו ${left} רכבים. שתי שאלות שחותכות את הצי באותו מקום שוות כמו שאלה אחת.`
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

register('input', {
  slotQ(arg, el) {
    const i = Number(arg);
    sheet()[i] = el.value;
    S.submitBlocked = false;
    S.lastResult = null;
    save();
    patchAfterTyping();
  }
});
