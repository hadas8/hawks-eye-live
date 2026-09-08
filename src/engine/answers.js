// The answer engine. A station declares what a correct answer looks like;
// the engine grades submitted values and derives the digit.
//
//   station.answer = {
//     parts: [ { kind, ...spec }, ... ],   // one sub-answer per checked unit
//     rule:  'digitalRoot' | 'count' | 'literal' | 'custom'
//   }
//
// Only the kinds and rules that a built station needs are implemented.
// The remaining kinds the roster will eventually need — choice, multiChoice,
// rows, dragToBucket, pickN, pairPick — go in KINDS as their stations land.
// An unimplemented kind throws rather than silently grading as wrong.

export const digitalRoot = n => (n <= 0 ? 0 : 1 + ((n - 1) % 9));

const KINDS = {
  // A number, optionally with tolerance. `value` may be null for "not answered".
  number(spec, value) {
    if (value == null || Number.isNaN(value)) return false;
    return Math.abs(value - spec.value) <= (spec.tolerance ?? 0);
  }
};

const RULES = {
  digitalRoot: (_station, values) => digitalRoot(values.reduce((a, v) => a + (v ?? 0), 0)),
  count:       (_station, values) => values.filter(Boolean).length,
  literal:     (station) => station.digit,
  custom:      (station, values) => station.answer.derive(values)
};

// -> { res: bool[], correct, total, allCorrect }
export function grade(station, values) {
  const parts = station.answer.parts;
  const res = parts.map((spec, i) => {
    const check = KINDS[spec.kind];
    if (!check) throw new Error(`answer kind not implemented: ${spec.kind}`);
    return check(spec, values[i]);
  });
  const correct = res.filter(Boolean).length;
  return { res, correct, total: res.length, allCorrect: correct === res.length };
}

export function deriveDigit(station, values) {
  const rule = RULES[station.answer.rule];
  if (!rule) throw new Error(`combine rule not implemented: ${station.answer.rule}`);
  return rule(station, values);
}
