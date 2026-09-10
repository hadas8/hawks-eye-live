// Station 3 — הכלל הנסתר. Source: תחנה_3.docx, transcribed 2026-09-10.
//
// Three unlabelled boxes hold two sorted cards each. The group reads the
// sorting rule off those six and applies it to twenty new cards. The digit
// is how many cards land in one named box.
//
// THE SOURCE CONTRADICTS ITSELF, and it matters here more than anywhere
// else in the seven stations. Its union sheet defines the boxes by the
// TYPE OF ANSWER:
//
//   א׳  סיווג — התשובה היא קטגוריה (כן/לא, שם, סוג)
//   ב׳  חיזוי — התשובה היא מספר רציף (כמות, זמן, מרחק)
//   ג׳  לא קשור — אין לנו את המידע / לא ניתן לחיזוי
//
// but the six example cards that teach the rule sort by AVAILABILITY:
// ג׳'s first example asks for a name, which the sheet assigns to א׳, and
// its second asks for a quantity, which the sheet assigns to ב׳. So the
// cards demonstrate one rule and the sheet states another, and they
// disagree on precisely the cards that decide the digit.
//
// The key below follows the SHEET, because it is the only rule written
// down: answer type decides, and ג׳ takes only the cards whose answer is
// genuinely out of reach. `contested: true` marks the cards a group can
// argue into a different box under the examples' rule instead — see
// docs/station-3-rule.md. Nothing is invented; the contest is the source's.
//
// The union sheet says the digit is the count in box א׳. That is 9, not
// the 7 the roster carried, so CFG.lockCode moves to 3294227. Flipping
// DIGIT_BOX to 'ב' restores 7 and the old code, and is a one-character
// change if the physical lock cannot be reset.

export const BOXES = ['א', 'ב', 'ג'];

// Which box the group counts for the digit. The source says א׳.
export const DIGIT_BOX = 'א';

// The six pre-sorted cards. The group sees which box each sits in and
// nothing else: the boxes carry no labels, exactly as the source insists
// ("אין תוויות על הקופסאות!"), so the rule has to come out of these.
export const EXAMPLES = [
  { box: 'א', text: 'האם המעבר פעיל או חסום?' },
  { box: 'א', text: 'האם הרכב אזרחי או צבאי?' },
  { box: 'ב', text: 'כמה שעות ייקח להעביר את המטען?' },
  { box: 'ב', text: 'בכמה ק"מ לשעה תאט השיירה בכביש ההררי?' },
  { box: 'ג', text: 'מה שמו של מפקד יחידה 4400?' },
  { box: 'ג', text: 'כמה שיירות תועדו ב-ג\'נתא ביום שלישי?' }
];

const card = (n, text, box, contested = false) => ({ n, text, box, contested });

export const CARDS = [
  card(1,  'האם מעבר הגבול פעיל או חסום?', 'א'),
  card(2,  'בכמה ק"מ לשעה נוסעת השיירה כרגע?', 'ב'),
  card(3,  'כמה שיירות חצו ב-ג\'נתא אתמול?', 'ג'),
  card(4,  'האם המשאית צבועה לבן או חול?', 'א'),
  card(5,  'כמה טונות שוקל המטען?', 'ב'),
  card(6,  'האם הנהג אזרח או חייל?', 'א'),
  card(7,  'כמה מ"מ גשם יירד הלילה?', 'ב'),
  card(8,  'האם הציר פעיל כרגע?', 'א'),
  card(9,  'מה שמו של מפקד יחידה 4400?', 'ג'),
  card(10, 'האם הרכב רשום כאזרחי?', 'א'),
  card(11, 'בכמה דקות ייסגר המעבר?', 'ב'),
  // A yes/no question about something nobody has looked at. The sheet says
  // א׳ because the answer is a category; the examples say ג׳ because the
  // answer is not in our hands.
  card(12, 'האם יש מצלמות אבטחה במעבר?', 'א', true),
  // A quantity about a convoy that has already driven. The sheet says ב׳;
  // ג׳'s own second example is the same shape and sits in ג׳.
  card(13, 'כמה אנשים נסעו בשיירה?', 'ב', true),
  card(14, 'מה הסיסמה הפנימית של יחידה 4400?', 'ג'),
  card(15, 'האם המשאית עצרה בדרך?', 'א', true),
  card(16, 'כמה שעות נסעה השיירה?', 'ב', true),
  card(17, 'מה תוכן השיחה בין הנהגים?', 'ג'),
  card(18, 'האם יש ציוד נוסף ברכב?', 'א', true),
  card(19, 'כמה ליטרים דלק נצרכו בדרך?', 'ב', true),
  card(20, 'האם הנהג עבר הכשרה מיוחדת?', 'א', true)
];

export const countIn = box => CARDS.filter(c => c.box === box).length;
export const contested = () => CARDS.filter(c => c.contested);
