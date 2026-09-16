// Station 3 — הכלל הנסתר. Source: תחנה_3.docx, rewritten 2026-09-16.
//
// Three unlabelled boxes hold two sorted cards each. The group reads the
// sorting rule off those six and applies it to twenty new cards.
//
// THE RULE
//
//   א׳  the answer is a LABEL, and it is something we work out
//   ב׳  the answer is a NUMBER, and it is something we work out
//   ג׳  not a prediction at all — the answer is a fact someone is keeping
//       from us, and no amount of data produces it
//
// The test that decides every card: is there a moment ahead of us where the
// answer gets revealed and we could check whether we were right? If yes it
// is a prediction, and then it is א׳ for a label or ב׳ for a number. If the
// answer only exists inside somebody's head, it is ג׳.
//
// These definitions are for this file, the facilitator and Lotem. They must
// never reach the screen — the boxes go in unlabelled, per the source's
// "אין תוויות על הקופסאות!", and the labels are the answer.
//
// WHY THIS IS A REWRITE, not a transcription. The source contains two
// incompatible rules: its union sheet sorts by the type of the answer, and
// its ג׳ example cards were a name and a quantity, which that same sheet
// assigns to א׳ and ב׳. It also has no answer key — on paper nothing ever
// grades the sort, so the contradiction could sit there unresolved. An app
// has to grade against something.
//
// What settles it: THE STATION SHOWS THE GROUP NO DATA. No table, no fleet,
// no corpus — twenty question cards and three boxes. So any rule that turns
// on "do we already have this recorded?" cannot be judged from what is on
// screen, and is not a rule this station can hold. Answer type is the only
// rule judgeable from the card text alone, which is why Hadas solving cold
// and this build independently landed on it. Exactly one card in the source
// implied a corpus — ג׳'s "כמה שיירות תועדו ב-ג'נתא ביום שלישי?" — and
// replacing it leaves the contradiction nowhere to live.
//
// Full reasoning and the card-by-card rationale: docs/station-3-rewrite.md.
// The history of how the contradiction arose: docs/station-3-rule.md.
//
// Five cards are pure tense fixes (3, 13, 15, 16, 19). Every one was past
// tense, which is what made them read as lookups rather than predictions,
// and is where six of the seven ambiguities came from. There is no
// `contested` flag any more: nothing is contested.
//
// Four cards deliberately break the opening-word shortcut — 7 (מה→ב׳),
// 9 (כמה→ג׳), 12 (מה→א׳), 20 (האם→ג׳) — plus both new example cards. The
// old set was sortable by first word 19 times out of 20 and Hadas solved it
// that way without meeting the station's idea at all. Sorting by grammar
// now scores 16 of 20, which all-or-nothing grading fails.

export const BOXES = ['א', 'ב', 'ג'];

// Which box the tally counts for the digit. Nothing on screen links the
// digit to a count — the union sheet's "הספרה = כרטיסים בקופסה א׳" is not
// rendered anywhere — so this is bookkeeping, not an assertion a group can
// check. The digit itself is set in stations.js. See the note there.
export const DIGIT_BOX = 'א';

// The six pre-sorted cards. The group sees which box each sits in and
// nothing else, so the rule has to come out of these.
//
// "האם הנהג יודע מה הוא מוביל?" is the card the station turns on. Set
// against א׳'s "האם הרכב אזרחי או צבאי?", it puts two yes/no questions in
// different boxes: one is on the outside of the truck, the other is inside
// someone's head. Without it ג׳ holds only מה questions and the whole thing
// collapses back into grammar.
//
// "מה סוג הכביש שבו תיסע השיירה?" puts a מה card in א׳, so the examples
// themselves show that the opening word is not the rule before the group
// touches a single card.
export const EXAMPLES = [
  { box: 'א', text: 'האם הרכב אזרחי או צבאי?' },
  { box: 'א', text: 'מה סוג הכביש שבו תיסע השיירה?' },
  { box: 'ב', text: 'כמה שעות ייקח להעביר את המטען?' },
  { box: 'ב', text: 'בכמה ק"מ לשעה תאט השיירה בכביש ההררי?' },
  { box: 'ג', text: 'מה שמו של מפקד יחידה 4400?' },
  { box: 'ג', text: 'האם הנהג יודע מה הוא מוביל?' }
];

const card = (n, text, box) => ({ n, text, box });

export const CARDS = [
  card(1,  'האם מעבר הגבול פעיל או חסום?', 'א'),
  card(2,  'בכמה ק"מ לשעה נוסעת השיירה כרגע?', 'ב'),
  card(3,  'כמה שיירות יחצו ב-ג\'נתא הלילה?', 'ב'),
  card(4,  'האם המשאית צבועה לבן או חול?', 'א'),
  card(5,  'כמה טונות שוקל המטען?', 'ב'),
  card(6,  'האם הנהג אזרח או חייל?', 'א'),
  // מה, and a number: one of the four cards that break the opening-word
  // shortcut. Same question as the source's "כמה מ"מ גשם יירד הלילה?".
  card(7,  'מה כמות הגשם הצפויה הלילה?', 'ב'),
  card(8,  'האם הציר פעיל כרגע?', 'א'),
  // כמה, and still ג׳: a hidden fact wearing a number's clothes. Replaces a
  // card that was a verbatim copy of ג׳'s first example, which was a free
  // point for anyone who noticed.
  card(9,  'כמה אנשים בחוליה יודעים על המשלוח?', 'ג'),
  card(10, 'האם הרכב רשום כאזרחי?', 'א'),
  card(11, 'בכמה דקות ייסגר המעבר?', 'ב'),
  // מה, and א׳. Replaces "האם יש מצלמות אבטחה במעבר?", which was arguable
  // under any rule. A direction is a label with more than two values, and
  // — unlike the cargo — it is not something anyone is hiding.
  card(12, 'מה כיוון הנסיעה של השיירה?', 'א'),
  card(13, 'כמה אנשים נוסעים בשיירה?', 'ב'),
  card(14, 'מה הסיסמה הפנימית של יחידה 4400?', 'ג'),
  card(15, 'האם המשאית תעצור בדרך?', 'א'),
  card(16, 'כמה שעות תיסע השיירה עד הגבול?', 'ב'),
  card(17, 'מה תוכן השיחה בין הנהגים?', 'ג'),
  card(18, 'האם יש ציוד נוסף ברכב?', 'א'),
  card(19, 'כמה ליטרים דלק תצרוך השיירה בדרך?', 'ב'),
  // האם, and ג׳. Replaces "האם הנהג עבר הכשרה מיוחדת?", which was
  // biographical and neither clearly inferable nor clearly hidden.
  card(20, 'האם הנהג יודע שעוקבים אחריו?', 'ג')
];

export const countIn = box => CARDS.filter(c => c.box === box).length;
