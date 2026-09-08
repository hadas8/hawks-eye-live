// localStorage wrapped so a blocked or full store degrades to memory rather
// than throwing. A mid-seminar refresh must never lose earned digits — and
// must never hand a group extra time, which is why we persist start
// timestamps and not remaining seconds.
const KEY = 'hawkseye.v1';
const SCHEMA = 1;

let backing = null;
try {
  localStorage.setItem('__probe', '1');
  localStorage.removeItem('__probe');
  backing = localStorage;
} catch { /* private mode, blocked storage — fall through to memory */ }

let memory = null;

export function load() {
  if (!backing) return memory;
  try {
    const raw = backing.getItem(KEY);
    if (!raw) return null;
    const data = JSON.parse(raw);
    if (!data || data.schema !== SCHEMA) return null;   // old shape: start clean
    return data.state;
  } catch { return null; }
}

export function persist(state) {
  memory = state;
  if (!backing) return;
  try { backing.setItem(KEY, JSON.stringify({ schema: SCHEMA, state })); } catch { /* quota */ }
}

export function wipe() {
  memory = null;
  if (!backing) return;
  try { backing.removeItem(KEY); } catch { /* ignore */ }
}
