// Hebrew normalization, applied to every password and free-text comparison.
// Strips niqqud and bidi marks, drops quote marks, folds case and whitespace,
// and folds the final letter forms so נוצה/נוצה-with-a-typed-ף style slips pass.
const FINALS = { 'ם':'מ', 'ן':'נ', 'ץ':'צ', 'ף':'פ', 'ך':'כ' };

export const norm = s => String(s ?? '')
  .replace(/[\u0591-\u05C7]/g, '')      // niqqud and cantillation
  .replace(/[\u200E-\u202E]/g, '')      // bidi control marks
  .replace(/["'\u05F3\u05F4`]/g, '')    // quotes, geresh, gershayim
  .trim()
  .toLowerCase()
  .replace(/\s+/g, ' ')
  .replace(/[םןץףך]/g, c => FINALS[c]);

// Each password is an array of accepted strings.
export const matchAny = (value, accepted) => accepted.some(a => norm(a) === norm(value));

export const esc = s => String(s).replace(/[&<>"]/g, c =>
  ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;' }[c]));
