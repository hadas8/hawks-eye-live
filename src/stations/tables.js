// The "tables" station kind — station 1, הטבלאות המשקרות.
//
// Groups mark rows: one row per unique convoy that actually crossed. The
// marked count auto-fills that table's number in the union sheet. Typing a
// number overrides the marks; clearing the field reverts to them. Each cell
// says מסומן or ידני so the source of the number is never ambiguous.
//
// Only the count is checked, never which rows were marked. Duplicated
// convoys appear twice, so either copy is a legitimate representative and
// there are many valid mark-sets; checking exact rows would fail correct
// reasoning.
//
// Verdicts are sticky per table: a table confirmed correct keeps its tick
// until that table changes. Without this a group re-verifies confirmed work
// inside a 7-minute window.

import { S, set, save, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { TABLES, COLUMNS, isJunkRow, isMissing } from '../data/station-1.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

const N = TABLES.length;

/* ── draft accessors ──────────────────────── */
const d = () => draftOf(station().n);

function marksOf(ti) {
  const draft = d();
  draft.marks ||= {};
  draft.marks[ti] ||= {};
  return draft.marks[ti];
}
const markCount = ti => Object.keys(marksOf(ti)).length;
const isManual = ti => !!d().man?.[ti];
const verdictOf = ti => d().verdict?.[ti];

function clearVerdict(ti) {
  const draft = d();
  if (draft.verdict) delete draft.verdict[ti];
}

// The number this table currently contributes: typed if manual, else the
// mark count, else empty.
function valueOf(ti) {
  const draft = d();
  if (isManual(ti)) return String(draft.typed?.[ti] ?? '');
  const c = markCount(ti);
  return c > 0 ? String(c) : '';
}
function numOf(ti) {
  const n = parseInt(valueOf(ti), 10);
  return Number.isNaN(n) ? null : n;
}
const values = () => TABLES.map((_, i) => numOf(i));
const filledCount = () => values().filter(v => v !== null).length;
const enteredSum = () => values().reduce((a, v) => a + (v ?? 0), 0);

// Any edit invalidates the previous submit's aggregate message and re-enables
// the submit button.
function touched(ti) {
  clearVerdict(ti);
  S.submitBlocked = false;
  S.lastResult = null;
}

/* ── view ─────────────────────────────────── */

// The table footer says where the current table's number came from and offers
// the way back. It is rebuilt on its own after typing, because typing takes
// the in-place patch path below rather than a full re-render.
function tfootHtml(tab) {
  const marked = markCount(tab);
  return `<span class="cnt">סומנו <b>${marked}</b> שורות בטבלה ${tab + 1}${
      isManual(tab) ? ' · המספר הוזן ידנית ודוחה את הסימון' : ''}</span>
    <span class="row">
      ${marked ? '<button class="btn-mini" data-act="clearMarks">נקה סימונים</button>' : ''}
      ${isManual(tab) ? '<button class="btn-mini" data-act="unmanual">חזרה לספירה אוטומטית</button>' : ''}
    </span>`;
}

export function viewTables() {
  const s = station();
  const tab = S.tab;
  const table = TABLES[tab];
  const hintsShown = S.hints[s.n] || 0;
  const filled = filledCount();
  const sum = enteredSum();
  const inRange = sum >= s.truth.min && sum <= s.truth.max;
  const result = S.lastResult;

  const rows = table.rows.map((row, i) => {
    const junk = isJunkRow(row);
    const on = !!marksOf(tab)[i];
    const missing = isMissing(row);
    return `<tr class="${junk ? 'junk ' : ''}${on ? 'mk' : ''}" data-act="mark" data-arg="${i}">
      <td class="pick">${on ? '✔' : ''}</td>
      <td class="m">${esc(row[0])}</td>
      <td class="m">${esc(row[1])}</td>
      <td>${esc(row[2])}</td>
      <td class="m ${missing ? 'miss' : ''}">${missing ? '—' : esc(row[3])}</td>
      <td>${missing ? '<span class="miss">—</span>' : esc(row[4])}</td>
      <td>${esc(row[5])}</td>
    </tr>`;
  }).join('');

  const tabs = TABLES.map((_, i) =>
    `<button class="tab ${i === tab ? 'on' : ''} ${numOf(i) !== null ? 'done' : ''}"
             data-act="tab" data-arg="${i}">טבלה ${i + 1}</button>`).join('');

  const cells = TABLES.map((_, i) => {
    const v = s.revealWhichWrong ? verdictOf(i) : undefined;
    const cls = v === undefined ? '' : (v ? 'hit' : 'miss');
    const manual = isManual(i);
    const has = numOf(i) !== null;
    const tag = v !== undefined
      ? `<span class="src ${v ? 'good' : 'wrong'}">${v ? '✓ נכון' : '✗ לא נכון'}</span>`
      : `<span class="src ${manual ? 'man' : 'auto'}">${has ? (manual ? 'ידני' : 'מסומן') : ''}</span>`;
    return `<label class="cell ${cls} ${i === tab ? 'cur' : ''}">
      <span class="k">טבלה ${i + 1}</span>
      <input type="number" inputmode="numeric" value="${esc(valueOf(i))}"
             data-input="cell" data-arg="${i}">
      ${tag}
    </label>`;
  }).join('');

  const hints = Array.from({ length: hintsShown },
    (_, i) => `<p class="hintbar">${esc(s.hints[i])}</p>`).join('');

  return `<div class="stack">
    <div>
      <div class="eyebrow">תחנה ${s.n} מתוך ${STATIONS.length} · ${esc(s.concept)}</div>
      <h1>${esc(s.name)}</h1>
      <p class="lead">${esc(s.brief)}</p>
    </div>

    <div class="ask">
      <p class="q">כמה שיירות ייחודיות חצו בפועל?</p>
      <p class="sub">סמנו את כל השורות שנספרות, אחת לכל שיירה, והמונה יספור בשבילכם.</p>
      <ul class="keys">
        <li><b>חצה · הושלם · CROSSED</b> נחשבים חצייה. ממתין · בוטל · כשל · נכשל — לא.</li>
        <li>אותו מזהה פעמיים הוא אותה שיירה — סמנו אחת.</li>
        <li>שורה עם <span class="dash">—</span> לא נספרת, גם אם חצתה.</li>
      </ul>
      <p class="cap"><b>${s.maxAttempts} שליחות בלבד.</b> בכל שליחה תראו איזו טבלה נכונה ואיזו לא. נגמרו השליחות, נגמרה התחנה.</p>
    </div>

    <div class="tabs">${tabs}</div>

    <div>
      <div class="tablewrap"><table>
        <thead><tr><th></th>${COLUMNS.map(c => `<th>${esc(c)}</th>`).join('')}</tr></thead>
        <tbody>${rows}</tbody>
      </table></div>
      <div class="tfoot">${tfootHtml(tab)}</div>
    </div>

    <div class="panel"><div class="stack">
      <div class="eyebrow">דף האיחוד</div>
      <div class="strip">${cells}</div>
      <div class="sums">
        <div><span class="label">מולאו</span><div class="b">${filled}/${N}</div></div>
        <div><span class="label">סכום</span>
          <div class="b ${filled === N ? (inRange ? 'good' : 'off') : ''}">${sum}</div></div>
        <div><span class="label">בדיקת אמת</span>
          <div class="b small">${s.truth.min}–${s.truth.max}</div></div>
      </div>
      ${result ? `<p class="verdict ${result.allCorrect ? 'ok' : 'bad'}">${
        result.allCorrect
          ? 'כל השמונה נכונים'
          : `${result.correct} מתוך ${result.total} נכונים. תקנו את המסומנות ושלחו שוב.`}</p>` : ''}
      <p class="note">הספרה נגזרת מסכום שמונה המספרים (digital root), והאפליקציה תחשב אותה בשבילכם.</p>
    </div></div>

    ${hints}

    <div class="row">
      <button class="btn" data-act="submit" ${S.submitBlocked || filled < N ? 'disabled' : ''}>${
        filled < N ? `נותרו ${N - filled} טבלאות`
        : S.submitBlocked ? 'שנו תשובה כדי לשלוח שוב'
        : 'שליחת פענוח'}</button>
      ${hintsShown < s.hints.length
        ? `<button class="btn-ghost" data-act="hint">רמז (${hintsShown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} שליחות נותרו</span>
    </div>
  </div>`;
}

/* ── in-place patch on typing ─────────────────
   A full re-render on every keystroke would steal focus from the cell being
   typed into, so the handful of things a typed digit changes are patched
   directly instead. */
function patchAfterTyping() {
  const s = station();
  const filled = filledCount();
  const sum = enteredSum();

  const btn = document.querySelector('[data-act="submit"]');
  if (btn) {
    btn.disabled = filled < N;
    btn.textContent = filled < N ? `נותרו ${N - filled} טבלאות` : 'שליחת פענוח';
  }

  const b = document.querySelectorAll('.sums .b');
  if (b[0]) b[0].textContent = `${filled}/${N}`;
  if (b[1]) {
    b[1].textContent = sum;
    b[1].className = 'b' + (filled === N
      ? (sum >= s.truth.min && sum <= s.truth.max ? ' good' : ' off') : '');
  }

  document.querySelectorAll('.tab').forEach((el, i) =>
    el.classList.toggle('done', numOf(i) !== null));

  document.querySelectorAll('.cell').forEach((cell, i) => {
    const span = cell.querySelector('.src');
    if (!span) return;
    const v = s.revealWhichWrong ? verdictOf(i) : undefined;
    cell.classList.remove('hit', 'miss');
    if (v !== undefined) {
      span.textContent = v ? '✓ נכון' : '✗ לא נכון';
      span.className = 'src ' + (v ? 'good' : 'wrong');
      cell.classList.add(v ? 'hit' : 'miss');
    } else {
      const has = numOf(i) !== null;
      span.textContent = has ? (isManual(i) ? 'ידני' : 'מסומן') : '';
      span.className = 'src ' + (isManual(i) ? 'man' : 'auto');
    }
  });

  const verdict = document.querySelector('.verdict');
  if (verdict) verdict.remove();

  // The footer's revert affordance has to appear the moment a table goes
  // manual. Rebuilding it does not disturb focus, which sits in a cell input.
  const tfoot = document.querySelector('.tfoot');
  if (tfoot) tfoot.innerHTML = tfootHtml(S.tab);
}

/* ── actions ──────────────────────────────── */
register('click', {
  tab(arg) { set({ tab: Number(arg) }); },

  mark(arg) {
    const i = Number(arg);
    const marks = marksOf(S.tab);
    if (marks[i]) delete marks[i]; else marks[i] = true;
    touched(S.tab);
    set();
  },

  clearMarks() {
    d().marks[S.tab] = {};
    touched(S.tab);
    set();
  },

  unmanual() {
    const draft = d();
    if (draft.man) delete draft.man[S.tab];
    if (draft.typed) delete draft.typed[S.tab];
    touched(S.tab);
    set();
  },

  hint() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submit() {
    const s = station();
    const submitted = values();
    const result = grade(s, submitted);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    const draft = d();
    draft.verdict ||= {};
    result.res.forEach((ok, i) => { draft.verdict[i] = ok; });

    if (!result.allCorrect) {
      S.lastResult = result;
      S.submitBlocked = true;
      // Running out closes the station immediately rather than leaving the
      // group idle at a dead button.
      if (attemptsLeft() <= 0) return closeStation('attempts');
      const left = attemptsLeft();
      fx('reject', 'נדחה', 2100, left === 1 ? 'נותרה שליחה אחת' : `נותרו ${left} שליחות`);
      shake();
      return set();
    }

    solveStation(deriveDigit(s, submitted));
  }
});

register('input', {
  cell(arg, el) {
    const i = Number(arg);
    const draft = d();
    draft.man ||= {};
    draft.typed ||= {};
    if (String(el.value).trim() === '') {
      delete draft.man[i];
      delete draft.typed[i];
    } else {
      draft.man[i] = true;
      draft.typed[i] = el.value;
    }
    touched(i);
    save();
    patchAfterTyping();
  }
});
