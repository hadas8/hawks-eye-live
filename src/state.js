// The single state object, its persistence, and the change subscription that
// drives rendering. Nothing else in the app writes to storage directly.
import { load, persist, wipe } from './lib/storage.js';
import { STATIONS } from './data/stations.js';

export const freshState = () => ({
  screen: 'boot',          // boot | briefing | station | vault | reveal
  phase: 'locked',         // within screen 'station': locked | active | solved | expired
  group: '',
  idx: 0,                  // index into STATIONS

  startedAt: {},           // station number -> ms epoch. The clock derives from this.
  digits: {},              // station number -> digit
  given: {},               // station number -> true when the digit was handed over unsolved
  score: 0,
  attempts: {},            // station number -> submissions used
  hints: {},               // station number -> hints revealed
  draft: {},               // station number -> per-station working state

  tab: 0,
  submitBlocked: false,    // set after a failed submit, cleared when an input changes
  lastResult: null,
  fresh: null,             // station number whose ribbon slot should ignite once
  closedBy: null,          // 'time' | 'attempts'
  vaultErr: ''
});

// Live binding: importers see reassignment from reset().
export let S = Object.assign(freshState(), load() || {});

const subscribers = [];
export const onChange = fn => subscribers.push(fn);

export const save = () => persist(S);

export function set(patch = {}) {
  Object.assign(S, patch);
  save();
  subscribers.forEach(fn => fn());
}

export function reset() {
  S = freshState();
  wipe();
  save();
  subscribers.forEach(fn => fn());
}

// Convenience accessors used throughout.
export const station = () => STATIONS[S.idx];
export const draftOf = n => (S.draft[n] ||= {});
export const attemptsLeft = () => {
  const s = station();
  return (s.maxAttempts ?? Infinity) - (S.attempts[s.n] || 0);
};
