// The password gate. The facilitator announces the password out loud; the
// station clock starts the moment a correct one is submitted.
import { S, station } from '../state.js';
import { STATIONS } from '../data/stations.js';
import { esc } from '../lib/text.js';
import { openStation } from '../flow.js';
import { shake } from '../ui/fx.js';
import { register } from '../ui/actions.js';

export function viewLocked() {
  const s = station();
  return `<div class="lockwrap">
    <svg class="glyph" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.2" aria-hidden="true">
      <rect x="4" y="10.5" width="16" height="10" rx="1"/>
      <path d="M8 10.5V7a4 4 0 0 1 8 0v3.5"/>
      <circle cx="12" cy="15.5" r="1.3" fill="currentColor" stroke="none"/>
    </svg>
    <div class="eyebrow">תחנה ${s.n} מתוך ${STATIONS.length}</div>
    <h1>${esc(s.name)}</h1>
    <p>המדריך יכריז על הסיסמה כשכל החדר מוכן, והשעון שלכם מתחיל ברגע שהיא נכנסת.</p>
    <form class="lockform" data-submit="password">
      <input type="text" id="pw" placeholder="סיסמה" autocomplete="off" autocapitalize="off" autocorrect="off">
      <button class="btn" type="submit">פתיחה</button>
    </form>
    <p class="err" id="pwerr"></p>
  </div>`;
}

register('submit', {
  password() {
    const input = document.getElementById('pw');
    if (openStation(input.value)) return;
    document.getElementById('pwerr').textContent = 'זו לא הסיסמה, חכו להכרזת המדריך.';
    input.value = '';
    input.focus();
    shake();
  }
});
