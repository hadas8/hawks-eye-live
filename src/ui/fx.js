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

// Two effects hide the screen rather than glow over it, and both of them
// exist so the screen can change out of sight. Swapping on the way in shows
// the destination, covers it, then uncovers the same thing — which reads as
// the screen loading twice.
//
//   wipe    #fx.wipe reaches clip-path:inset(0) at 45% of its 0.9s run
//   timeout coldIn peaks at 86% black at 30% of its 1.4s run
const COVERS = {
  wipe:    { total: 950,  cover: 405 },
  timeout: { total: 1400, cover: 420 }
};

// Run a covering effect and change the screen underneath it at the moment
// it is opaque. Under reduced motion there is nothing to hide behind, so
// the swap is immediate rather than a wait in front of an invisible frame.
export function coverThen(kind, text, swap, sub) {
  if (reduced.matches) return swap();
  const c = COVERS[kind];
  fx(kind, text, c.total, sub);
  setTimeout(swap, c.cover);
}

export function shake() {
  if (reduced.matches) return;
  const app = document.getElementById('app');
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
  setTimeout(() => app.classList.remove('shake'), 500);
}
