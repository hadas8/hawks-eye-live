// Station 2 — הגרפים המשקרים. Source: תחנה_2_גרפים_סופי.docx.
//
// Seven envelopes, each holding two charts of identical data where one has
// been distorted; the group picks the honest one in every pair. The digit
// is 2, which the source states outright: "עדכנו את ספרת תחנה 2 ל-2
// (במקום 6). הקוד המעודכן: 3274227".
//
// EVERY SERIES BELOW IS TRANSCRIBED FROM LOTEM'S ORIGINAL CHART IMAGES,
// supplied 2026-09-10 and kept in docs/source-charts. An earlier version
// reconstructed them from the docx's prose because the images could not be
// read out of the file, and five of the seven were wrong. Nothing here is
// invented any more.
//
// ONE DEPARTURE FROM THE SOURCE, agreed with Hadas: the lying chart is
// GRAPH 1 in six of the source's seven envelopes, so "always pick graph 2"
// scored six of seven. The liar's position is redistributed — three of the
// seven show it first — so there is no position to learn instead of reading
// the charts. Which chart of each pair is honest is unchanged; only where
// it appears.
//
// The source's numeric chain, 5+4+3+4+4+4+5 = 29 → 2, is unused. It does
// not derive from its own answers, and `נראות התחנות` replaces the numeric
// task with click-the-honest-chart, so the digit is simply 2.

const MONTHS_6 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ'];
const MONTHS_12 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
const weeks = n => Array.from({ length: n }, (_, i) => 'ש' + (i + 1));

export const ENVELOPES = [
  {
    id: 'א׳',
    title: 'מדד פעילות שיירות לפי חודשים',
    question: 'האם הפעילות זינקה בין ינואר ליוני?',
    hint: 'בדקו איפה מתחיל הציר האנכי בכל גרף. ציר שלא מתחיל באפס מגדיל הפרשים קטנים.',
    trick: 'ציר Y מ-96 עד 103 — עלייה של חמש נקודות על מדד של מאה נראית כמו מדרגות',
    lyingFirst: false,
    honest: { kind: 'bars', labels: MONTHS_6, values: [97, 98, 99, 100, 101, 102], yFloor: 0, yCeil: 120 },
    lying:  { kind: 'bars', labels: MONTHS_6, values: [97, 98, 99, 100, 101, 102], yFloor: 96, yCeil: 103 }
  },
  {
    id: 'ב׳',
    title: 'חלוקת שיירות לפי מעבר גבול',
    question: 'איזה מעבר הוא הגדול ביותר?',
    hint: 'קראו את המספרים שכתובים על העמודות, לא את הצבע.',
    trick: 'העמודה הקטנה ביותר צבועה בצבע ההדגשה — העין נופלת עליה למרות שהיא הכי נמוכה',
    lyingFirst: true,
    honest: { kind: 'bars', labels: ["ג'נתא", 'קוסייא', 'אסאל אל-וורד', 'ציר צפוני'],
              values: [38, 35, 27, 8], yFloor: 0, yCeil: 50, showValues: true, unit: '%' },
    lying:  { kind: 'bars', labels: ["ג'נתא", 'קוסייא', 'אסאל אל-וורד', 'ציר צפוני'],
              values: [38, 35, 27, 8], yFloor: 0, yCeil: 50, showValues: true, unit: '%', highlight: 3 }
  },
  {
    id: 'ג׳',
    title: 'אירועי חצייה לפי חודש',
    question: 'כמה אירועים תועדו מינואר עד אפריל?',
    hint: 'ספרו את החודשים על הציר האופקי. האם כל המרווחים שווים, או שחודשים נעלמו?',
    trick: 'הציר האופקי מציג רק ינו, מרץ, יול, נוב במרווחים שווים — תשעה חודשי אפס נעלמים',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_12,
              values: [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], yFloor: 0, yCeil: 2 },
    lying:  { kind: 'line', labels: MONTHS_12,
              values: [1, 0, 1, 0, 0, 0, 1, 0, 0, 0, 0, 0], yFloor: 0, yCeil: 2,
              pick: [0, 2, 6, 10] }
  },
  {
    id: 'ד׳',
    title: 'שיירות שחצו לפי שבוע',
    question: 'האם יש מגמת ירידה בין שבוע 1 לשבוע 6?',
    hint: 'הסתכלו על מספרי השבועות מתחת לעמודות. האם הם בסדר עולה?',
    trick: 'העמודות מסודרות מהגדולה לקטנה ולא לפי סדר השבועות — נראית ירידה מתמדת שלא קיימת',
    lyingFirst: false,
    honest: { kind: 'bars', labels: weeks(6), values: [3, 6, 4, 5, 2, 4], yFloor: 0, yCeil: 8 },
    lying:  { kind: 'bars', labels: weeks(6), values: [3, 6, 4, 5, 2, 4], yFloor: 0, yCeil: 8, order: 'desc' }
  },
  {
    id: 'ה׳',
    title: 'שיירות לפי שבוע ולפי חודש',
    question: 'האם הפעילות עלתה בהתמדה מחודש 1 עד חודש 4?',
    hint: 'הסתכלו על החץ. הוא מחבר את ההתחלה לסוף ומדלג על כל מה שקרה באמצע.',
    trick: 'ממוצע חודשי ועליו חץ מגמה מחודש 1 לחודש 4 — הצניחה של חודש 2 נעלמת מתחת לחץ',
    lyingFirst: false,
    honest: { kind: 'line', labels: weeks(12),
              values: [4, 5, 6, 3, 2, 3, 4, 5, 6, 7, 6, 7], yFloor: 0, yCeil: 10 },
    lying:  { kind: 'bars', labels: ['חודש 1', 'חודש 2', 'חודש 3', 'חודש 4'],
              values: [5, 2.7, 5, 6.7], yFloor: 0, yCeil: 10, arrow: { from: 0, to: 3 } }
  },
  {
    id: 'ו׳',
    title: 'מדד פעילות — קו מול עמודות',
    question: 'בכמה גדל מדד הפעילות בין ינואר ליוני?',
    hint: 'שלוש נקודות על ציר שמתחיל ב-96 נראות כמו הר. בדקו את קצה הציר.',
    trick: 'גרף קווי עם ציר Y מ-96 ושטח צבוע מתחתיו — עלייה של 3 נקודות נראית דרמטית',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_6, values: [98, 99, 99, 100, 100, 101], yFloor: 0, yCeil: 120 },
    lying:  { kind: 'line', labels: MONTHS_6, values: [98, 99, 99, 100, 100, 101], yFloor: 96, yCeil: 103, area: true }
  },
  {
    id: 'ז׳',
    title: 'שיירות שחצו — ינואר עד מאי',
    question: 'כמה שיירות חצו בסך הכול בחמשת החודשים?',
    hint: 'קו ישר אומר שכל חודש יצא אותו דבר. האם זה מה שקרה, או שזה הממוצע?',
    trick: 'הגרף מציג את הממוצע החודשי, 5, כאילו הוא הנתון — הסכום האמיתי הוא 25',
    lyingFirst: false,
    honest: { kind: 'bars', labels: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי'],
              values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 10, showValues: true,
              refLine: { value: 5, label: 'ממוצע 5' } },
    lying:  { kind: 'line', labels: ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי'],
              values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 10, flatten: true, area: true }
  }
];

// The two charts in display order, and which position holds the honest one.
export const chartsOf = env => (env.lyingFirst ? [env.lying, env.honest] : [env.honest, env.lying]);
export const honestPosition = env => (env.lyingFirst ? 2 : 1);
