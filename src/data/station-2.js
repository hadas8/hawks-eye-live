// Station 2 — הגרפים המשקרים. Six envelopes, each holding two charts of the
// same data where one has been arranged to mislead; the group picks the
// honest one in every pair. The digit is 2 and does not move.
//
// REWRITTEN 2026-09-21 from docs/station-2-rewrite.md, which supersedes
// docs/station-2-clarity.md. THE TRANSCRIPTION RULE IS RETIRED. The series
// here are no longer Lotem's originals — Hadas walked all seven envelopes on
// 2026-09-10 ("not too hard, just not clear"), and on 2026-09-17 she took the
// chart data as hers to change. Her images stay in docs/source-charts as the
// record of where this started, and three of the six below still run her
// lesson: ב׳ omission, ג׳ reordering, ו׳ the arrow.
//
// ── THE RULE FOR ADDING AN ENVELOPE ──────────────────────────────────────
//
// A chart can be made to state something false in five ways, and that is the
// whole list in this renderer's vocabulary:
//
//   broken encoding    bar length stops meaning value        yFloor
//   omission           data that exists is not drawn         pick, short series
//   reordering         the sequence is scrambled             order: 'desc'
//   aggregation        real variation replaced by a summary  flatten
//   false annotation   a mark on top asserts what data denies  arrow, false refLine
//
// One envelope per class, and OMISSION IS DELIBERATELY DOUBLED to reach six
// (ב׳ hunts for gaps in the middle, ה׳ checks where the axis stops).
//
// EMPHASIS IS NOT A LIE, AND NEITHER IS CHART TYPE. Colouring the smallest
// bar steers a careless eye but every bar is still at its true height; a line
// over categorical labels implies an order that does not exist but every
// point is still at its true value. Both are bad practice, neither produces a
// false chart, and in a station scored true/false neither has a defensible
// answer. Three separate proposals died on this. So: BEFORE ADDING AN
// ENVELOPE, NAME THE FALSE STATEMENT THE LYING CHART MAKES. If you cannot,
// it is not an envelope. docs/station-2-rewrite.md lists what was cut.
//
// ── THE FOUR TESTS AN ENVELOPE MUST PASS ─────────────────────────────────
//
//   1. The two charts answer the question differently and one answer is
//      FALSE — not "more misleading", false.
//   2. The question is one an analyst in מחלקת ניתוח 7 would actually ask.
//   3. The question is not answerable without reading the charts.
//   4. The hint names a place to look, never what is wrong there and never
//      the rule. Every hint below points at something BOTH charts have.
//
// THE TWO CHARTS OF A PAIR DIFFER IN EXACTLY ONE WAY — same kind, same
// labels, same values, one distortion parameter. The only exceptions are the
// two omission envelopes, where the liar legitimately carries fewer
// categories, and ד׳'s refLine, which is an honest annotation rather than a
// second difference.
//
// `lyingFirst` is redistributed so the liar's position is not learnable:
// three of six, in the order F T F T T F. In the source it was graph 1 in six
// of seven, so "always pick graph 2" scored six of seven.
//
// `highlight`, `showValues` and `unit` are now UNUSED by this station — the
// colour envelope was cut and ד׳ dropped its printed values. They are general
// renderer capabilities and stay; removing them is a separate decision.

const MONTHS_5 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי'];
const MONTHS_6 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ'];
const MONTHS_12 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
const weeks = n => Array.from({ length: n }, (_, i) => 'ש' + (i + 1));

export const ENVELOPES = [
  {
    // BROKEN ENCODING. No values are printed, deliberately: printing them
    // would let a group compare number to height without ever reading the
    // axis, which is the one skill this envelope exists to teach.
    //
    // The question asks about January rather than about the size of the
    // change, and counts convoys rather than an index, because both of those
    // make the answer a fact instead of an opinion. 97 convoys is not
    // "almost none". An earlier version asked whether activity JUMPED from
    // January to June and had no true answer: on the honest chart the rise is
    // seven pixels of a 162px plot, so a group that picked the truncated
    // chart had reasoned correctly from what it could see. Any zero-based
    // chart of 97 to 102 looks flat, and that is correct behaviour — the fix
    // had to come from the question.
    id: 'א׳',
    title: 'שיירות שחצו לפי חודש',
    question: 'האם בינואר כמעט לא חצו שיירות?',
    hint: 'בדקו את המספרים שלאורך הצד. מאיפה מתחיל כל אחד מהם, ולאן הוא מגיע?',
    trick: 'ציר Y מ-96 עד 104 — 97 שיירות מצוירות כמו גדם שנוגע בתחתית',
    lyingFirst: false,
    honest: { kind: 'bars', labels: MONTHS_6, values: [97, 98, 99, 100, 101, 102], yFloor: 0, yCeil: 120 },
    lying:  { kind: 'bars', labels: MONTHS_6, values: [97, 98, 99, 100, 101, 102], yFloor: 96, yCeil: 104 }
  },
  {
    // OMISSION, interior gaps. Lotem's lesson, her data replaced: the source
    // ran counts of 0 or 1 on a 0-to-2 axis, which draws as nine bars showing
    // nothing and three one-unit stubs. Real counts fix it without touching
    // the idea.
    //
    // Both charts are bars. In the old build the honest one was bars and the
    // liar was a line, so the pair differed in chart type AND category count
    // and a group could not tell which difference was the lie.
    //
    // KNOWN WEAKNESS, ACCEPTED: eight of twelve months are zero, so two
    // thirds of the honest chart is blank. It stays because the liar is
    // genuinely convincing — four solid bars reading as steady year-round
    // activity — and because ה׳ carries the readable version of omission. If
    // the honest chart reads as broken rather than sparse in play-testing,
    // the lever is FEWER EMPTY MONTHS, not higher counts, and the question's
    // לאורך השנה has to change with them. Open with Hadas, 2026-09-21.
    id: 'ב׳',
    title: 'אירועי חצייה לפי חודש',
    question: 'האם הפעילות נמשכה ברציפות לאורך השנה?',
    hint: 'אילו חודשים מופיעים מתחת לעמודות בכל גרף?',
    trick: 'הציר מציג רק ינו, מרץ, יול ונוב צמודים זה לזה — שמונה חודשים ריקים נעלמו',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_12, values: [6, 0, 5, 0, 0, 0, 7, 0, 0, 0, 6, 0], yFloor: 0, yCeil: 8 },
    lying:  { kind: 'bars', labels: MONTHS_12, values: [6, 0, 5, 0, 0, 0, 7, 0, 0, 0, 6, 0], yFloor: 0, yCeil: 8,
              pick: [0, 2, 6, 10] }
  },
  {
    // REORDERING. The strongest of Lotem's seven and the only envelope that
    // survived the rewrite with its charts untouched: the question is already
    // a judgement, the pair differs in exactly one way, and the tell is
    // printed under every bar.
    //
    // Only the hint changed. The old one ended "האם הם בסדר עולה?", which
    // says what is wrong and fails test 4. This one sends them along the same
    // labels without naming what they are looking for.
    id: 'ג׳',
    title: 'שיירות שחצו לפי שבוע',
    question: 'האם יש מגמת ירידה בין שבוע 1 לשבוע 6?',
    hint: 'עברו על מספרי השבועות מתחת לעמודות, אחד אחרי השני.',
    trick: 'העמודות מסודרות מהגדולה לקטנה ולא לפי סדר השבועות — ירידה מתמדת שלא קיימת',
    lyingFirst: false,
    honest: { kind: 'bars', labels: weeks(6), values: [3, 6, 4, 5, 2, 4], yFloor: 0, yCeil: 8 },
    lying:  { kind: 'bars', labels: weeks(6), values: [3, 6, 4, 5, 2, 4], yFloor: 0, yCeil: 8, order: 'desc' }
  },
  {
    // AGGREGATION. The old ז׳ with a new question — the mechanism always
    // worked, but it asked for the five-month total, which is 25 on both
    // charts because the flat line is the mean of the same five numbers.
    //
    // BOTH CHARTS ARE BARS. The rewrite doc specified bars against a filled
    // line, which differs in four ways at once (kind, flatten, area, refLine)
    // and breaks the one-difference rule this file runs on. Five equal bars
    // say קצב קבוע at least as well as a flat line does. `area` loses its
    // last user, which is a cheaper price than the broken invariant.
    //
    // THE refLine IS ON THE HONEST CHART ONLY — Hadas's explicit call,
    // 2026-09-21, after seeing a version with it on both. It is what tells
    // the group that 5 is the average rather than an arbitrary number, and on
    // the liar it would be redundant since that whole series already sits at
    // 5. This is the one envelope where the honest chart carries a mark the
    // liar does not, so "pick the one with the dashed line" works HERE. It
    // does not generalise — ו׳'s liar is the one with the extra mark, and in
    // ב׳ and ה׳ the liar has less — but watch it in play-testing.
    //
    // showValues was dropped from the honest chart: the bars are visibly
    // different heights without the numbers, and a second honest-only
    // annotation widens the asymmetry for no gain.
    id: 'ד׳',
    title: 'שיירות שחצו — ינואר עד מאי',
    question: 'האם קצב החצייה היה קבוע?',
    hint: 'כמה ערכים שונים מציג כל גרף?',
    trick: 'הגרף מצייר את הממוצע החודשי, 5, כאילו הוא הנתון של כל אחד מהחודשים',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_5, values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 10,
              refLine: { value: 5, label: 'ממוצע 5' } },
    lying:  { kind: 'bars', labels: MONTHS_5, values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 10, flatten: true }
  },
  {
    // OMISSION, truncated endpoint. The second instance of the doubled class,
    // and the better of the two: both charts are dense and legible and both
    // tell a coherent story, one peaking and collapsing, one climbing.
    //
    // The liar declares a SHORTER SERIES rather than using `pick`. Same
    // rendered result, but the data reads plainly and `pick` stays unique to
    // ב׳, so the two omission envelopes do not look like one spec twice.
    //
    // If the station is ever cut back to five, THIS is the omission envelope
    // that stays and ב׳ is the one that goes.
    id: 'ה׳',
    title: 'תנועה בציר הצפוני לפי שבוע',
    question: 'האם הפעילות ממשיכה לעלות?',
    hint: 'עד איזה שבוע מגיע כל גרף?',
    trick: 'הסדרה נחתכת בשבוע 5, בדיוק בשיא — חמשת השבועות שבהם הפעילות צנחה לא מופיעים',
    lyingFirst: true,
    honest: { kind: 'bars', labels: weeks(10), values: [2, 4, 6, 8, 9, 7, 4, 3, 2, 2], yFloor: 0, yCeil: 10 },
    lying:  { kind: 'bars', labels: weeks(5),  values: [2, 4, 6, 8, 9],                yFloor: 0, yCeil: 10 }
  },
  {
    // FALSE ANNOTATION. Lotem's arrow on a repaired pair: the old version
    // drew the honest chart as twelve weeks and the liar as four monthly
    // means, and phrased the question in months so it pointed at the liar's
    // axis and the honest chart could not answer it as asked. That is the
    // envelope Hadas got wrong, and it was the question's fault. Both charts
    // are now the same twelve weeks and the arrow is the only difference.
    //
    // THIS ENVELOPE WAS NEARLY CUT AND SHOULD NOT HAVE BEEN. The argument
    // against it was that every data point stays visible under the arrow, so
    // it only nudges — the same objection that killed the colour envelope.
    // That argument is wrong. Colour asserts nothing, it steers the eye. An
    // arrow makes a claim, and בהתמדה is precisely the claim it makes.
    // Activity did not rise steadily, it collapsed in weeks 4 to 6.
    //
    // It is still the hardest envelope here, because the group has to catch a
    // CLAIM rather than a distorted geometry, and it is the only one where
    // the liar shows every true value. It goes last on purpose.
    //
    // The hint does not mention the arrow — naming it would identify the
    // lying chart. It sends them along the data points, which both charts
    // have.
    id: 'ו׳',
    title: 'דיווחי תצפית לפי שבוע',
    question: 'האם הפעילות עלתה בהתמדה לאורך התקופה?',
    hint: 'עקבו אחרי הנקודות עצמן, אחת אחרי השנייה, מהשבוע הראשון עד האחרון.',
    trick: 'חץ מגמה משבוע 1 לשבוע 12 מכריז על עלייה רציפה — הצניחה בשבועות 4 עד 6 נעלמת מתחתיו',
    lyingFirst: false,
    honest: { kind: 'line', labels: weeks(12), values: [4, 5, 6, 3, 2, 3, 4, 5, 6, 7, 6, 7], yFloor: 0, yCeil: 10 },
    lying:  { kind: 'line', labels: weeks(12), values: [4, 5, 6, 3, 2, 3, 4, 5, 6, 7, 6, 7], yFloor: 0, yCeil: 10,
              arrow: { from: 0, to: 11 } }
  }
];

// The two charts in display order, and which position holds the honest one.
export const chartsOf = env => (env.lyingFirst ? [env.lying, env.honest] : [env.honest, env.lying]);
export const honestPosition = env => (env.lyingFirst ? 2 : 1);
