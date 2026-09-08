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
  el.innerHTML = `<span class="label">dev — הסירו לפני האירוע</span>
    <button data-act="devSolve">פתור תחנה</button>
    <button data-act="devAll">מלא הכל</button>
    <button data-act="reset">איפוס</button>
    <span class="label">${esc(station().password[0])} · קוד ${CFG.lockCode}</span>`;
  document.getElementById('app').appendChild(el);
}

register('click', {
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
