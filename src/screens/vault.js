import { CFG } from '../config.js';
import { S, set } from '../state.js';
import { esc } from '../lib/text.js';
import { shake } from '../ui/fx.js';
import { register } from '../ui/actions.js';

export const viewVault = () => `<div class="stack">
  <div>
    <div class="eyebrow">פתיחת הקופסה</div>
    <h1>שבע ספרות, סדר אחד</h1>
    <p class="lead">הזינו את הקוד כפי שנאסף, מתחנה 1 עד תחנה 7.</p>
  </div>
  <form class="lockform" style="max-width:470px" data-submit="vault">
    <input type="text" id="vin" class="vin" dir="ltr" inputmode="numeric" maxlength="7"
           placeholder="- - - - - - -" autocomplete="off">
    <button class="btn" type="submit">פתיחה</button>
  </form>
  <p class="err">${esc(S.vaultErr)}</p>
</div>`;

register('submit', {
  vault() {
    const value = document.getElementById('vin').value.replace(/\D/g, '');
    if (value === CFG.lockCode) return set({ screen: 'reveal', vaultErr: '' });
    shake();
    set({ vaultErr: 'הקוד נדחה, בדקו את הסדר.' });
  }
});
