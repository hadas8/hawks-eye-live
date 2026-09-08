// The 7-minute station clock. Remaining time is recomputed from the stored
// start timestamp on every tick — there is no decrementing counter anywhere,
// so a refresh, a sleeping tab or a clock drift cannot grant extra minutes.
import { CFG } from '../config.js';
import { S, station } from '../state.js';
import { closeStation } from '../flow.js';

export function remainingMs() {
  const t0 = S.startedAt[station().n];
  if (S.phase === 'locked' || !t0) return null;
  return Math.max(0, CFG.stationSeconds * 1000 - (Date.now() - t0));
}

export function tick() {
  const val = document.getElementById('clockval');
  if (!val) return;
  const lab = document.getElementById('clocklab');
  const wrap = document.getElementById('clock');
  const app = document.getElementById('app');

  document.getElementById('scoreval').textContent = S.score;

  if (S.screen !== 'station') {
    val.textContent = '--:--';
    lab.textContent = 'תחנה';
    wrap.className = 'meter';
    app.classList.remove('critical');
    return;
  }

  const left = remainingMs();
  if (left == null) {
    val.textContent = '7:00';
    lab.textContent = 'טרם החל';
    wrap.className = 'meter';
    app.classList.remove('critical');
    return;
  }

  const m = Math.floor(left / 60000);
  const sec = Math.floor((left % 60000) / 1000);
  val.textContent = `${m}:${String(sec).padStart(2, '0')}`;
  lab.textContent = 'תחנה ' + station().n;

  const critical = left <= 60000;
  wrap.className = 'meter' + (critical ? ' crit' : left <= 120000 ? ' warn' : '');
  app.classList.toggle('critical', critical && S.phase === 'active');

  if (left === 0 && S.phase === 'active') closeStation('time');
}

export const startClock = () => setInterval(tick, 250);
