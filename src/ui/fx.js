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

export function shake() {
  if (reduced.matches) return;
  const app = document.getElementById('app');
  app.classList.remove('shake');
  void app.offsetWidth;
  app.classList.add('shake');
  setTimeout(() => app.classList.remove('shake'), 500);
}
