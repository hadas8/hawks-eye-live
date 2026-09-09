// Station 4 — השאלה ששווה לשאול. Source: תחנה_4_.docx.
//
// Sixteen vehicles, one of them carrying. Twenty candidate questions, of
// which the group may ask four. The digit is the number of the vehicle
// still standing: 4.
//
// The fleet is a clean 4-bit encoding. Colour, antenna, wheels and box each
// split it exactly down the middle, and together they address all sixteen
// vehicles uniquely. Everything else on a vehicle — direction, flag — is
// constant across the fleet and therefore worthless as a question.
//
// Two consequences, both verified in the station-4 data test:
//
//   Ten of the twenty questions cut exactly 8, not four, because each split
//   has more than one phrasing: "is it white" and "is the number even"
//   divide the fleet identically, as do "is the box open" and "is the
//   number over 8". Those ten collapse to FOUR distinct splits, and a
//   correct answer takes one question from each — 3 × 2 × 2 × 3 = 36
//   accepted sets.
//
//   Questions 5, 8 and 18 single out vehicle 4 on their own, cutting 15.
//   Any set containing one of those lands on the right vehicle while
//   demonstrating the opposite of the lesson, so `isProperSet` requires
//   every chosen question to cut exactly 8. See the build spec.

export const COLUMNS = ['מס׳', 'צבע', 'אנטנה', 'גלגלים', 'ארגז', 'כיוון', 'שמשה', 'דגל'];

const vehicle = (n, colour, antenna, wheels, box, glass) =>
  ({ n, colour, antenna, wheels, box, glass, dir: 'מערבה', flag: 'אין' });

export const FLEET = [
  vehicle(1,  'חול', 'אין', '6', 'פתוח', 'נקיה'),
  vehicle(2,  'לבן', 'אין', '6', 'פתוח', 'נקיה'),
  vehicle(3,  'חול', 'יש',  '6', 'פתוח', 'נקיה'),
  vehicle(4,  'לבן', 'יש',  '6', 'פתוח', 'מוכתמת'),   // the one carrying
  vehicle(5,  'חול', 'אין', '8', 'פתוח', 'נקיה'),
  vehicle(6,  'לבן', 'אין', '8', 'פתוח', 'נקיה'),
  vehicle(7,  'חול', 'יש',  '8', 'פתוח', 'נקיה'),
  vehicle(8,  'לבן', 'יש',  '8', 'פתוח', 'נקיה'),
  vehicle(9,  'חול', 'אין', '6', 'סגור', 'נקיה'),
  vehicle(10, 'לבן', 'אין', '6', 'סגור', 'נקיה'),
  vehicle(11, 'חול', 'יש',  '6', 'סגור', 'נקיה'),
  vehicle(12, 'לבן', 'יש',  '6', 'סגור', 'נקיה'),
  vehicle(13, 'חול', 'אין', '8', 'סגור', 'נקיה'),
  vehicle(14, 'לבן', 'אין', '8', 'סגור', 'נקיה'),
  vehicle(15, 'חול', 'יש',  '8', 'סגור', 'נקיה'),
  vehicle(16, 'לבן', 'יש',  '8', 'סגור', 'נקיה')
];

export const TARGET = FLEET[3];

export const QUESTIONS = [
  { id: 1,  text: 'האם הרכב צבוע לבן?',        holds: v => v.colour === 'לבן' },
  { id: 2,  text: 'האם יש אנטנה על הגג?',      holds: v => v.antenna === 'יש' },
  { id: 3,  text: 'האם יש 6 גלגלים?',          holds: v => v.wheels === '6' },
  { id: 4,  text: 'האם ארגז המטען פתוח?',      holds: v => v.box === 'פתוח' },
  { id: 5,  text: 'האם השמשה הקדמית מוכתמת?',  holds: v => v.glass === 'מוכתמת' },
  { id: 6,  text: 'האם הרכב נוסע מערבה?',      holds: v => v.dir === 'מערבה' },
  { id: 7,  text: 'האם יש דגל על הרכב?',       holds: v => v.flag === 'יש' },
  { id: 8,  text: 'האם מספר הרכב הוא 4?',      holds: v => v.n === 4 },
  { id: 9,  text: 'האם מספר הרכב זוגי?',       holds: v => v.n % 2 === 0 },
  { id: 10, text: 'האם מספר הרכב גדול מ-8?',   holds: v => v.n > 8 },
  { id: 11, text: 'האם הרכב בצבע חול?',        holds: v => v.colour === 'חול' },
  { id: 12, text: 'האם אין אנטנה על הגג?',     holds: v => v.antenna === 'אין' },
  { id: 13, text: 'האם יש 8 גלגלים?',          holds: v => v.wheels === '8' },
  { id: 14, text: 'האם ארגז המטען סגור?',      holds: v => v.box === 'סגור' },
  { id: 15, text: 'האם מספר הרכב קטן מ-10?',   holds: v => v.n < 10 },
  { id: 16, text: 'האם מספר הרכב הוא 7?',      holds: v => v.n === 7 },
  { id: 17, text: 'האם הרכב נוסע מזרחה?',      holds: v => v.dir === 'מזרחה' },
  { id: 18, text: 'האם השמשה הקדמית נקיה?',    holds: v => v.glass === 'נקיה' },
  { id: 19, text: 'האם מספר הרכב מתחלק ב-4?',  holds: v => v.n % 4 === 0 },
  { id: 20, text: 'האם מספר הרכב בין 1 ל-4?',  holds: v => v.n >= 1 && v.n <= 4 }
];

export const PICK = 4;

const byId = id => QUESTIONS.find(q => q.id === id);

// The answer as it applies to the real vehicle — תשובה על הרכב האמיתי, the
// source's own phrase. A vehicle does not answer anything; this is what the
// intelligence already says about it.
export const answerOn = q => (q.holds(TARGET) ? 'כן' : 'לא');

// Vehicles left after asking these questions of the fleet. Filtering is
// commutative, so the order they were picked in does not matter.
export function survivors(ids) {
  return ids.reduce((rest, id) => {
    const q = byId(id);
    if (!q) return rest;
    return rest.filter(v => q.holds(v) === q.holds(TARGET));
  }, FLEET.slice());
}

// How many vehicles a question eliminates when asked of the whole fleet.
export const cutsOf = id => {
  const q = byId(id);
  return FLEET.filter(v => q.holds(v) !== q.holds(TARGET)).length;
};

// The vehicles a single question rules out, measured against the whole
// fleet — never against what earlier questions already removed. That is the
// number the source worksheet asks the group to write down, and it is what
// the table highlights while a question is being considered.
export function eliminatedBy(id) {
  const q = byId(id);
  if (!q) return new Set();
  return new Set(FLEET.filter(v => q.holds(v) !== q.holds(TARGET)).map(v => v.n));
}

// Step by step, for showing the group what their four questions did.
export function funnel(ids) {
  let rest = FLEET.slice();
  return ids.map(id => {
    const q = byId(id);
    const before = rest.length;
    rest = rest.filter(v => q.holds(v) === q.holds(TARGET));
    return { id, text: q.text, cut: before - rest.length, left: rest.length };
  });
}

// A set counts only if every question halves the field. Reaching vehicle 4
// is not enough on its own: questions 5, 8 and 18 each single it out alone,
// so 2,739 four-question sets land on it without the group having compared
// anything. Requiring every question to cut 8 leaves the 36 sets that
// actually run the search.
export const isProperSet = ids =>
  ids.length === PICK &&
  new Set(ids).size === PICK &&
  ids.every(id => cutsOf(id) === 8) &&
  survivors(ids).length === 1;
