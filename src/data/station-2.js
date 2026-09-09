// Station 2 — הגרפים המשקרים. Source: תחנה_2_גרפים_סופי.docx.
//
// Seven pairs of charts. Each pair plots identical data and one of the two
// has been distorted; the group picks the honest one in every pair. The
// digit is 2, which the source states outright: "עדכנו את ספרת תחנה 2 ל-2
// (במקום 6). הקוד המעודכן: 3274227".
//
// TWO DEPARTURES FROM THE SOURCE, both agreed with Hadas:
//
//   1. The lying chart is GRAPH 1 in six of the source's seven envelopes,
//      so "always pick graph 2" scored six of seven. The liar's position is
//      redistributed here — three of the seven show it first — so there is
//      no position to learn instead of reading the charts.
//
//   2. The source also carries a numeric chain, 5+4+3+4+4+4+5=29 → 2, but
//      it does not derive from its own answers: envelope ו׳'s stated answer
//      is a rise of 3 points while the chain uses 4, and ז׳'s is 25 while
//      the chain uses 5. `נראות התחנות` replaces the numeric task with
//      click-the-honest-chart, so the chain is dropped and the digit is
//      simply 2, awarded on a clean sweep.
//
// The series below are reconstructed. The source's charts are images that
// cannot be read out of the docx, so where it states figures — Northern
// Route 8%, ג'נתא 38%, the 98→101 activity index, 3+6+4+7+5, an average of
// 4, three events between January and April — those are used exactly, and
// the rest is built to produce precisely the described distortion. Every
// invented series is listed in the build spec for the content author.

const MONTHS_6 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ'];
const MONTHS_12 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
const weeks = n => Array.from({ length: n }, (_, i) => 'ש' + (i + 1));

export const ENVELOPES = [
  {
    id: 'א׳',
    title: 'מדד פעילות שיירות לפי חודשים',
    question: 'האם הפעילות זינקה בין ינואר ליוני?',
    hint: 'בדקו איפה מתחיל הציר האנכי בכל גרף. ציר שלא מתחיל באפס מגדיל הפרשים קטנים.',
    trick: 'ציר Y מתחיל ב-96 ולא ב-0 — הפרשים של נקודה או שתיים נראים כמו זינוק',
    lyingFirst: false,
    honest: { kind: 'bars', labels: MONTHS_6, values: [98, 99, 100, 99, 101, 100], yFloor: 0, yCeil: 110 },
    lying:  { kind: 'bars', labels: MONTHS_6, values: [98, 99, 100, 99, 101, 100], yFloor: 96, yCeil: 102 }
  },
  {
    id: 'ב׳',
    title: 'חלוקת שיירות לפי מעבר גבול',
    question: 'איזה מעבר הוא הגדול ביותר?',
    hint: 'קראו את המספרים שכתובים על העמודות, לא את הצבע.',
    trick: 'העמודה הקטנה ביותר צבועה בצבע ההדגשה והשאר עומעמו — העין נופלת על הקטנה',
    lyingFirst: true,
    honest: { kind: 'bars', labels: ["ג'נתא", 'קוסייא', 'אסאל אל-וורד', 'ציר צפוני'],
              values: [38, 31, 23, 8], yFloor: 0, yCeil: 46, showValues: true, unit: '%' },
    lying:  { kind: 'bars', labels: ["ג'נתא", 'קוסייא', 'אסאל אל-וורד', 'ציר צפוני'],
              values: [38, 31, 23, 8], yFloor: 0, yCeil: 46, showValues: true, unit: '%', highlight: 3 }
  },
  {
    id: 'ג׳',
    title: 'אירועי חצייה לפי חודש',
    question: 'כמה אירועים תועדו מינואר עד אפריל?',
    hint: 'ספרו את החודשים על הציר האופקי. האם כל המרווחים שווים, או שחודשים נעלמו?',
    trick: 'הציר האופקי מציג רק ינו, מרץ, יול, נוב במרווחים שווים — החודשים החסרים נעלמים והקו נראה חלק',
    lyingFirst: true,
    honest: { kind: 'line', labels: MONTHS_12, values: [1, 1, 1, 0, 2, 3, 4, 5, 4, 6, 7, 8], yFloor: 0, yCeil: 9 },
    lying:  { kind: 'line', labels: MONTHS_12, values: [1, 1, 1, 0, 2, 3, 4, 5, 4, 6, 7, 8], yFloor: 0, yCeil: 9,
              pick: [0, 2, 6, 10] }
  },
  {
    id: 'ד׳',
    title: 'שיירות שחצו לפי שבוע',
    question: 'האם יש מגמת ירידה בין שבוע 1 לשבוע 8?',
    hint: 'הסתכלו על מספרי השבועות מתחת לעמודות. האם הם בסדר עולה?',
    trick: 'העמודות מסודרות מהגדולה לקטנה ולא לפי סדר השבועות — נראית ירידה מתמדת שלא קיימת',
    lyingFirst: false,
    honest: { kind: 'bars', labels: weeks(8), values: [3, 6, 2, 5, 4, 4, 5, 3], yFloor: 0, yCeil: 8 },
    lying:  { kind: 'bars', labels: weeks(8), values: [3, 6, 2, 5, 4, 4, 5, 3], yFloor: 0, yCeil: 8, order: 'desc' }
  },
  {
    id: 'ה׳',
    title: 'שיירות לפי שבוע ולפי חודש',
    question: 'האם הפעילות עלתה בהתמדה מחודש 1 עד חודש 4?',
    hint: 'ממוצע חודשי מחליק אירועים חדים. חפשו את הגרף שמראה כל שבוע בנפרד.',
    trick: 'הממוצע החודשי מעלים את הצניחה של שבוע 5 — המגמה נראית עלייה נקייה',
    lyingFirst: false,
    honest: { kind: 'line', labels: weeks(16),
              values: [4, 5, 4, 5, 1, 5, 6, 6, 6, 6, 7, 5, 7, 6, 7, 8], yFloor: 0, yCeil: 9 },
    lying:  { kind: 'line', labels: ['חודש 1', 'חודש 2', 'חודש 3', 'חודש 4'],
              values: [4.5, 4.5, 6, 7], yFloor: 0, yCeil: 9, showValues: true }
  },
  {
    id: 'ו׳',
    title: 'מדד פעילות — קו מול עמודות',
    question: 'בכמה גדל מדד הפעילות בין ינואר ליוני?',
    hint: 'שלוש נקודות על ציר שמתחיל ב-96 נראות כמו הר. בדקו את קצה הציר.',
    trick: 'גרף קווי עם ציר Y שמתחיל ב-96 — עלייה של 3 נקודות, מ-98 ל-101, נראית דרמטית',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_6, values: [98, 99, 99, 100, 100, 101], yFloor: 0, yCeil: 110 },
    lying:  { kind: 'line', labels: MONTHS_6, values: [98, 99, 99, 100, 100, 101], yFloor: 96, yCeil: 102 }
  },
  {
    id: 'ז׳',
    title: 'שיירות שחצו — ינואר עד מאי',
    question: 'כמה שיירות חצו בסך הכול בחמשת החודשים?',
    hint: 'קו ישר אומר שכל חודש יצא אותו דבר. האם זה מה שקרה, או שזה הממוצע?',
    trick: 'הגרף מציג את הממוצע החודשי, 5, כאילו הוא הנתון — הסכום האמיתי הוא 25',
    lyingFirst: false,
    honest: { kind: 'bars', labels: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי'],
              values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 9, showValues: true },
    lying:  { kind: 'line', labels: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי'],
              values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 9, flatten: true, showValues: true }
  }
];

// The two charts in display order, and which position holds the honest one.
export const chartsOf = env => (env.lyingFirst ? [env.lying, env.honest] : [env.honest, env.lying]);
export const honestPosition = env => (env.lyingFirst ? 2 : 1);
