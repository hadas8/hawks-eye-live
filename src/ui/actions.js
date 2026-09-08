// One delegated listener per event type on #app, instead of inline handlers
// and a global. Modules register by name:
//
//   <button data-act="hint">           click
//   <form  data-submit="password">     submit
//   <input data-input="cell" data-arg="3">   input
//
// data-arg carries the single argument, as a string.
const clicks = new Map();
const submits = new Map();
const inputs = new Map();

const REGISTRIES = { click: clicks, submit: submits, input: inputs };

export function register(type, map) {
  const reg = REGISTRIES[type];
  for (const [name, fn] of Object.entries(map)) reg.set(name, fn);
}

export function initActions(root) {
  root.addEventListener('click', e => {
    const el = e.target.closest('[data-act]');
    if (!el || !root.contains(el)) return;
    clicks.get(el.dataset.act)?.(el.dataset.arg, el, e);
  });

  root.addEventListener('submit', e => {
    const el = e.target.closest('[data-submit]');
    if (!el) return;
    e.preventDefault();
    submits.get(el.dataset.submit)?.(el.dataset.arg, el, e);
  });

  root.addEventListener('input', e => {
    const el = e.target.closest('[data-input]');
    if (!el) return;
    inputs.get(el.dataset.input)?.(el.dataset.arg, el, e);
  });
}
