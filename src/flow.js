// State transitions that more than one module needs: opening a station with
// its password, closing it, solving it, and moving on.
import { CFG } from './config.js';
import { S, set, station } from './state.js';
import { STATIONS } from './data/stations.js';
import { fx, shake } from './ui/fx.js';
import { matchAny } from './lib/text.js';

export const openStation = value => {
  const s = station();
  if (!matchAny(value, s.password)) return false;
  // The clock is a stored start timestamp, never a counter. Do not reset it
  // if one already exists: a refresh must not buy a group more time.
  S.startedAt[s.n] ||= Date.now();
  fx('wipe', 'תחנה ' + s.n, 950);
  set({ phase: 'active', tab: 0, lastResult: null, submitBlocked: false });
  return true;
};

// Solved in time: 10 points, digit earned.
export function solveStation(digit) {
  const s = station();
  if (S.digits[s.n] != null) return;          // never score the same station twice
  S.digits[s.n] = digit;
  S.given[s.n] = false;
  S.fresh = s.n;
  S.score += CFG.pointsPerStation;
  fx('accept', String(digit), 1100);
  set({ phase: 'solved', lastResult: null, submitBlocked: false, closedBy: null });
}

// Closed unsolved, by clock or by exhausted submissions: the group still
// receives the digit so the box can open, but it scores 0 and lands struck
// through in the ribbon.
export function closeStation(reason) {
  const s = station();
  if (S.digits[s.n] != null) return;
  S.digits[s.n] = s.digit;
  S.given[s.n] = true;
  S.fresh = null;
  S.closedBy = reason;
  fx('timeout', reason === 'attempts' ? 'נגמרו הניסיונות' : 'נגמר הזמן', 1400);
  shake();
  set({ phase: 'expired' });
}

export function nextStation() {
  S.fresh = null;
  if (S.idx === STATIONS.length - 1) return set({ screen: 'vault' });
  set({ idx: S.idx + 1, phase: 'locked', tab: 0, lastResult: null, submitBlocked: false, closedBy: null });
}
