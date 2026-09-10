// The "neighbours" station kind — station 6, ארבעה כוכבים.
//
// Twelve assessed crossings sit in a pinned table. Three new ones need three
// neighbours each, chosen from the twelve; the average of those three risk
// scores is the new crossing's score, and the three scores make the digit.
//
// The rule is on screen, in the order the source gives it. This station is
// not a discovery puzzle like 3 or 5 — the xlsx hands the priority list to
// the group in its own header. The work is applying it twelve comparisons
// at a time under a clock, which is exactly what KNN feels like from the
// inside.
//
// The table's columns run in the rule's priority order rather than the
// spreadsheet's, so "start at the left of the rule" is also "start at the
// first column". The source's own column order buries סוג כביש behind
// רכבים/יום, which is the one feature the rule cares about least.
//
// The layout is station 4's, for the same reason: a group cannot pick
// neighbours from a table it has to scroll away from. Side by side above
// 900px with the table pinned; stacked below it.
//
// A rejected submission names WHICH crossings are wrong, not what is wrong
// inside one — station 1's trade. Three sets of three from twelve is 220^3,
// so there is nothing to sweep, and knowing that N-02 is wrong tells a group
// to re-read the rule rather than which chip to swap.
//
// The table has a filter the GROUP drives, not the app: three buttons, one
// per matchable feature, each dimming the rows that fail the active crossing
// on that feature. An earlier version applied שעת פעילות automatically and
// was wrong twice over — it made the first decision before the group had
// done anything, and there was no principle by which step 1 should be
// automatic and steps 2 to 5 not. Driven by the group, applying the rule in
// priority order stops being something the app hides and becomes something
// they do, in whatever order they choose, including the wrong one.

import { S, set, station, draftOf, attemptsLeft } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { KNOWN, NEW, FEATURES, MATCHABLE, K, scoreFrom, isCorrectFor } from '../data/station-6.js';
import { grade, deriveDigit } from '../engine/answers.js';
import { esc } from '../lib/text.js';
import { fx, shake } from '../ui/fx.js';
import { solveStation, closeStation } from '../flow.js';
import { register } from '../ui/actions.js';

const N = NEW.length;

/* ── draft accessors ──────────────────────── */
const d = () => draftOf(station().n);
const picks = () => (d().picks ||= {});
const pickedFor = nId => (picks()[nId] ||= []);
const answers = () => NEW.map(n => pickedFor(n.id));
const complete = () => answers().filter(a => a.length === K).length;

// Which crossing the filters measure against. There always has to be one:
// the first unfinished crossing, until the group says otherwise.
const activeId = () => d().active
  || (NEW.find(n => pickedFor(n.id).length < K) || NEW[0]).id;
const active = () => NEW.find(n => n.id === activeId()) || NEW[0];

// Which features the group has switched on. Empty by default: the table
// starts whole, and nothing dims until they ask for it.
const filters = () => (d().filters ||= {});
const filterOn = key => !!filters()[key];
const anyFilter = () => MATCHABLE.some(f => filterOn(f.key));
const failsFilter = k => MATCHABLE.some(f => filterOn(f.key) && k[f.key] !== active()[f.key]);
const litCount = () => KNOWN.filter(k => !failsFilter(k)).length;

// Per-crossing verdicts, kept until that crossing is edited. Station 1 does
// the same: naming WHICH one is wrong, never what is wrong inside it.
const verdictOf = nId => d().verdict?.[nId];
const clearVerdict = nId => { if (d().verdict) delete d().verdict[nId]; };

/* ── view ─────────────────────────────────── */
const cell = (row, f) => `<td>${esc(String(row[f.key]))}${f.unit ? esc(f.unit) : ''}</td>`;

// Every crossing a group has chosen anywhere, so the table can show where
// each one went without the group having to hold it in their head.
const usedIn = kId => NEW.filter(n => pickedFor(n.id).includes(kId)).map(n => n.id);

// Where a crossing has been used rides in the id cell rather than in a
// column of its own: eight columns did not fit the pinned pane, and the one
// that got cut off at the edge was this one.
// The filter bar. Only the three matchable features get a button: you cannot
// filter on גובה, because no known crossing is AT 360 מ׳ — that one is read
// off the table by eye, which is the whole of the tie-break.
const filterBar = () => `<div class="fbar">
    <span class="flabel">מודדים מול <b>${esc(activeId())}</b></span>
    <div class="fbtns">${MATCHABLE.map(f =>
      `<button class="fb ${filterOn(f.key) ? 'on' : ''}" data-act="toggleFilter"
        data-arg="${f.key}">${esc(f.label)}</button>`).join('')}</div>
    <span class="fcount ${anyFilter() ? 'on' : ''}">${
      anyFilter() ? `${litCount()} מתוך ${KNOWN.length}` : `${KNOWN.length} מעברים`}</span>
  </div>`;

const knownTable = () => {
  return `<div class="ktable" data-keep-scroll="known">
    <table>
      <thead><tr><th>מזהה</th>${FEATURES.map(f =>
        `<th class="${f.match && filterOn(f.key) ? 'filtered' : ''}">${esc(f.label)}</th>`).join('')}
        <th>ציון</th></tr></thead>
      <tbody>${KNOWN.map(k => {
        const used = usedIn(k.id);
        const out = failsFilter(k);
        return `<tr class="${used.length ? 'used' : ''} ${out ? 'out' : ''}">
          <td class="kid">${esc(k.id)}${used.length
            ? `<span class="kused">${used.map(u => esc(u.replace('N-', ''))).join(' ')}</span>` : ''}</td>
          ${FEATURES.map(f => cell(k, f)).join('')}
          <td class="kscore">${k.score}</td>
        </tr>`;
      }).join('')}</tbody>
    </table>
  </div>`;
};

function newBlock(n, i) {
  const chosen = pickedFor(n.id);
  const full = chosen.length === K;
  const cur = n.id === activeId();
  const v = verdictOf(n.id);
  const mark = v === undefined ? '' : (v ? 'hit' : 'miss');
  return `<div class="ncase ${full ? 'done' : ''} ${cur ? 'cur' : ''} ${mark}">
    <button class="nhead" data-act="focusNb" data-arg="${n.id}">
      <span class="nid">${esc(n.id)}</span>
      <span class="nfeat">${FEATURES.map(f =>
        `${esc(f.label)}: <b>${esc(String(n[f.key]))}${f.unit ? esc(f.unit) : ''}</b>`).join(' · ')}</span>
      ${v === undefined ? '' : `<span class="nmark">${v ? '✓ נכון' : '✗ לא נכון'}</span>`}
    </button>
    <div class="nchips">${KNOWN.map(k =>
      `<button class="chip ${chosen.includes(k.id) ? 'on' : ''}"
        data-act="pickNb" data-arg="${n.id}:${k.id}"
        ${!chosen.includes(k.id) && full ? 'disabled' : ''}>${esc(k.id)}</button>`).join('')}</div>
    <div class="nfoot">
      <span class="label">${chosen.length} מתוך ${K} שכנים</span>
      ${full ? `<span class="navg">ציון ממוצע · <b>${scoreFrom(chosen)}</b></span>` : ''}
    </div>
  </div>`;
}

export function viewNeighbours() {
  const s = station();
  const shown = S.hints[s.n] || 0;
  const done = complete();
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
      <p class="q">מי שלושת השכנים של כל מעבר חדש?</p>
      <p class="sub">שני מעברים דומים ככל שהם חולקים תכונות מתחילת הרשימה. השוו לפי הסדר הזה:</p>
      <ol class="prio">${FEATURES.map(f => `<li>${esc(f.label)}</li>`).join('')}</ol>
      <p class="cap"><b>${s.maxAttempts} שליחות בלבד.</b> תדעו רק אם הכל נכון, לא איפה טעיתם.</p>
    </div>

    <div class="nwrap">
      <div class="nside">
        <div class="eyebrow">שנים־עשר מעברים שכבר נבדקו</div>
        ${filterBar()}
        ${knownTable()}
      </div>
      <!-- This pane scrolls, and every pick re-renders the whole stage, so
           without data-keep-scroll a tap on N-03 throws the group back up to
           N-01 and they cannot see what they just chose. Station 4 hit this
           exact bug; the table pane below was given the attribute and this
           one, the pane that actually scrolls while picking, was not. -->
      <div class="ncases" data-keep-scroll="ncases">
        <div class="eyebrow">שלושה מעברים חדשים · שלושה שכנים לכל אחד</div>
        ${NEW.map(newBlock).join('')}
      </div>
    </div>

    ${result ? '<p class="verdict bad">לא. עברו שוב על הרשימה מלמעלה — תכונה ראשונה קודמת לשנייה, ורק אחר כך הגובה ומספר הרכבים.</p>' : ''}

    ${hints}

    <div class="row">
      <button class="btn" data-act="submitNb" ${S.submitBlocked || done < N ? 'disabled' : ''}>${
        done < N ? `הושלמו ${done} מתוך ${N} מעברים`
        : S.submitBlocked ? 'שנו בחירה כדי לשלוח שוב'
        : 'שליחת פענוח'}</button>
      ${shown < s.hints.length
        ? `<button class="btn-ghost" data-act="hintNb">רמז (${shown + 1}/${s.hints.length})</button>`
        : '<span class="label">אין רמזים נוספים</span>'}
      <span class="label">${attemptsLeft()} מתוך ${s.maxAttempts} שליחות נותרו</span>
    </div>
  </div>`;
}

/* ── actions ──────────────────────────────── */
register('click', {
  // Tapping a crossing's header points the filters at it. Nothing else
  // changes: it is a lens, not a commitment.
  focusNb(arg) {
    d().active = arg;
    set();
  },

  // The filters persist across crossings on purpose. A group that has
  // settled on "time, then road" keeps that set-up when they move to the
  // next one, instead of rebuilding it three times.
  toggleFilter(arg) {
    const f = filters();
    f[arg] = !f[arg];
    set();
  },

  pickNb(arg) {
    const [nId, kId] = arg.split(':');
    d().active = nId;
    const list = pickedFor(nId);
    const at = list.indexOf(kId);
    if (at >= 0) list.splice(at, 1);
    else if (list.length < K) list.push(kId);
    // Editing a crossing retires its verdict: it is about the set that was
    // submitted, and that set no longer exists.
    clearVerdict(nId);
    S.submitBlocked = false;
    S.lastResult = null;
    set();
  },

  hintNb() {
    const s = station();
    S.hints[s.n] = Math.min((S.hints[s.n] || 0) + 1, s.hints.length);
    set();
  },

  submitNb() {
    const s = station();
    const submitted = answers();
    const result = grade(s, submitted);

    S.attempts[s.n] = (S.attempts[s.n] || 0) + 1;

    if (!result.allCorrect) {
      if (s.revealWhichWrong) {
        d().verdict = Object.fromEntries(NEW.map((n, i) => [n.id, result.res[i]]));
      }
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
