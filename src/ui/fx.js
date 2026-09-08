// The four dramatic moments and the shake. Purely decorative: no state
// transition waits on any of this, so reduced-motion can no-op the lot.
const reduced = window.matchMedia('(prefers-reduced-motion: reduce)');

let timer = null;

export function fx(kind, text, ms, sub) {
  if (reduced.matches) return;
  const el = document.getElementById('fx');
  if (!el) return;
  clearTimeout(timer);
  el.className = kind;
  document.getElementById('fxtxt').textContent = text || '';
  document.getElementById('fxsub').textContent = sub || '';
  void el.offsetWidth;             // restart the animations
  el.classList.add('on');
  timer = setTimeout(() => { el.className = ''; }, ms);
}

// The vault opening, the one moment the whole hour builds to. The seven
// ribbon slots verify left to right in the order the digits go into the
// physical lock, then the lock blows and the reveal assembles behind it.
//
// `done` switches the screen. It must run whatever happens — under reduced
// motion, immediately — so a group can never be stranded on the vault by a
// failed animation.
const SLOT_MS = 95;      // gap between slot verifications
const BLAST_MS = 1150;   // detonation before the reveal takes over

export function vaultUnlock(done) {
  if (reduced.matches) return done();

  const slots = [...document.querySelectorAll('.slot')];
  slots.forEach((el, i) => setTimeout(() => el.classList.add('verify'), i * SLOT_MS));

  const cascade = slots.length * SLOT_MS;
  setTimeout(() => {
    fx('unlock', 'הקוד אומת', 2000, 'המנעול נפתח');
    shake();
  }, cascade);

  // The reveal lands while the afterglow is still fading, so the two read as
  // one movement rather than two.
  setTimeout(done, cascade + BLAST_MS);
}

export function shake() {
  if (reduced.matches) return;
  const app = document.getElementById('app');
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
  setTimeout(() => app.classList.remove('shake'), 500);
}
