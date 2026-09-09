// The ?dev strip. Testing only — it prints the current station's password
// and the lock code, so it MUST be removed before the event. There is no
// facilitator panel: facilitators hold the password list on paper.
import { CFG, DEV } from './config.js';
import { S, set, station } from './state.js';
import { STATIONS } from './data/stations.js';
import { esc } from './lib/text.js';
import { register } from './ui/actions.js';

export function renderDev() {
  document.getElementById('devstrip')?.remove();
  if (!DEV) return;

  const el = document.createElement('div');
  el.className = 'dev';
  el.id = 'devstrip';
  // Jump straight into any station, built or not. Numbered left to right
  // like the ribbon, so 1 is leftmost.
  const jumps = STATIONS.map(st =>
    `<button class="${st.n === station().n ? 'here' : ''} ${st.kind ? '' : 'unbuilt'}"
             data-act="devGo" data-arg="${st.n}" title="${esc(st.name)}">${st.n}</button>`).join('');

  el.innerHTML = `<span class="label">dev — הסירו לפני האירוע</span>
    <div class="devrow">${jumps}</div>
    <button data-act="devSolve">פתור תחנה</button>
    <button data-act="devAll">מלא הכל</button>
    <button data-act="reset">איפוס</button>
    <span class="label">${esc(station().password[0])} · קוד ${CFG.lockCode}</span>`;
  document.getElementById('app').appendChild(el);
}

register('click', {
  // Drop straight into a station, mid-run, clock ticking. Anything that
  // station had already earned or used is cleared first, so jumping in
  // twice behaves the same both times — otherwise a second visit would
  // start with spent attempts, revealed hints and a digit already banked.
  devGo(arg) {
    const s = STATIONS[Number(arg) - 1];
    if (S.digits[s.n] != null && !S.given[s.n]) S.score -= CFG.pointsPerStation;
    delete S.digits[s.n];
    delete S.given[s.n];
    delete S.attempts[s.n];
    delete S.hints[s.n];
    delete S.draft[s.n];
    S.startedAt[s.n] = Date.now();
    set({
      screen: 'station', idx: s.n - 1, phase: 'active',
      tab: 0, lastResult: null, submitBlocked: false, fresh: null, closedBy: null
    });
  },

  devSolve() {
    const s = station();
    if (S.digits[s.n] == null) {
      S.digits[s.n] = s.digit;
      S.given[s.n] = false;
      S.fresh = s.n;
      S.score += CFG.pointsPerStation;
    }
    S.startedAt[s.n] ||= Date.now();
    set({ screen: 'station', phase: 'solved' });
  },

  devAll() {
    STATIONS.forEach(s => {
      if (S.digits[s.n] == null) {
        S.digits[s.n] = s.digit;
        S.given[s.n] = false;
        S.score += CFG.pointsPerStation;
      }
    });
    set({ screen: 'vault' });
  }
});
