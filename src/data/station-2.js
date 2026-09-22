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
//   FALSE FRAMING      the chart FORM claims a relationship   kind: 'pie'
//                      the data does not have
//
// One envelope per class, and OMISSION IS DELIBERATELY DOUBLED to reach six
// (ב׳ hunts for gaps in the middle, ה׳ checks where the axis stops).
//
// False framing is the sixth class, added 2026-09-22 from Lotem's suggestion,
// and it is the ONE case where chart type is a lie rather than an implication.
// The line-over-categories proposal was rejected because it only implies an
// order; a pie does not imply, it ASSERTS — a closed circle states that its
// parts are exclusive shares of one whole. When they are not, the chart says
// something false while every number on it stays true. That is the test any
// future chart-type envelope has to pass.
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
// three of seven, in the order F T F T T F F. In the source it was graph 1 in
// six of seven, so "always pick graph 2" scored six of seven.
//
// `highlight`, `showValues` and `unit` are now UNUSED by this station — the
// colour envelope was cut and ד׳ dropped its printed values. They are general
// renderer capabilities and stay; removing them is a separate decision.

const MONTHS_5 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי'];
const MONTHS_6 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ'];
const MONTHS_12 = ['ינו', 'פבר', 'מרץ', 'אפר', 'מאי', 'יונ', 'יול', 'אוג', 'ספט', 'אוק', 'נוב', 'דצמ'];
const weeks = n => Array.from({ length: n }, (_, i) => 'ש' + (i + 1));

// ז׳'s four crossings and their shares of the traffic, transcribed from the
// source image behind the old ב׳. They sum to 108, not 100, and that is the
// envelope rather than a transcription error — see the note on ז׳ below.
const CROSSINGS = ["ג'נתא", 'קוסייא', 'אסאל אל-וורד', 'ציר צפוני'];
const SHARES = [38, 35, 27, 8];

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
    // OMISSION, by cherry-picking. Lotem's lesson, her data replaced: the
    // source ran counts of 0 or 1 on a 0-to-2 axis, which draws as nine bars
    // showing nothing and three one-unit stubs.
    //
    // Both charts are bars. In the old build the honest one was bars and the
    // liar was a line, so the pair differed in chart type AND category count
    // and a group could not tell which difference was the lie.
    //
    // THE QUIET MONTHS CARRY 1 OR 2, NOT 0 — Cowork and Hadas, 2026-09-21,
    // replacing a version where eight of the twelve were zero. Two thirds of
    // the honest chart was blank and it read as a broken render rather than
    // as a year of surveillance. Dropping months instead would have deleted
    // the lie along with them, so the fix had to come from the values.
    //
    // WHAT MOVED WITH THEM IS THE FALSE CLAIM, and the question had to move
    // too. It was CONTINUITY — האם הפעילות נמשכה ברציפות — which stops
    // being false once activity never actually stops. It is now LEVEL: the
    // liar shows four months running 5 to 7 and says the year held up, while
    // those four spikes really sit in eight months of 1s and 2s. Still
    // omission, still one class, and arguably the sharper version of it,
    // because showing only the peaks is what people actually do with data.
    //
    // The price, on the record: eight months of literally nothing was a
    // bigger thing to conceal than eight months of near-nothing, so the lie
    // is a notch less theatrical. An honest chart that reads as broken is
    // the worse problem.
    id: 'ב׳',
    title: 'אירועי חצייה לפי חודש',
    question: 'האם רמת הפעילות נשמרה גבוהה לאורך כל השנה?',
    hint: 'אילו חודשים מופיעים מתחת לעמודות בכל גרף?',
    trick: 'הציר מציג רק ינו, מרץ, יול ונוב צמודים זה לזה — ארבעת השיאים בלבד, ושמונה חודשי השפל שביניהם נעלמו',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_12, values: [6, 1, 5, 1, 2, 1, 7, 2, 1, 1, 6, 2], yFloor: 0, yCeil: 8 },
    lying:  { kind: 'bars', labels: MONTHS_12, values: [6, 1, 5, 1, 2, 1, 7, 2, 1, 1, 6, 2], yFloor: 0, yCeil: 8,
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
    // and breaks the one-difference rule this file runs on.
    //
    // THE ממוצע 5 RULE IS ON BOTH CHARTS — Hadas, 2026-09-22, reversing the
    // honest-only version of the day before. This is the fix for the only
    // envelope that did not work, and the reason is worth keeping:
    //
    // `flatten` REPLACES every value, so unlike every other envelope here the
    // two charts share nothing a group can see. א׳ keeps its bars and moves
    // the axis, ב׳ and ה׳ keep theirs and drop some, ג׳ keeps and reorders,
    // ו׳ keeps and draws on top — in all five the liar carries a visible
    // TELL and the pair reads as one data set twice. ד׳ had neither: five
    // equal bars is a perfectly well-formed chart, so it looked like a second
    // measurement rather than the same one aggregated. Hadas: "it still looks
    // like two different sets of data."
    //
    // The shared rule fixes both halves at once. It is the bridge — both
    // charts agree the average is 5, so they are visibly about one thing —
    // and it is the tell, because on the liar every bar top sits EXACTLY on
    // the average line, which is what "this is the average, not the data"
    // looks like. The redundancy that was the argument against putting it
    // there is precisely what gives it away.
    //
    // It also closes the shortcut the honest-only version opened: "pick the
    // one with the dashed line" no longer decides anything, and ד׳ becomes
    // the cleanest pair in the set — `flatten` is now the ONLY difference.
    //
    // THE QUESTION ASKS FOR A FACT ABOVE THE LINE, not for a judgement about
    // constancy. האם קצב החצייה היה קבוע invited "roughly, yes";
    // months above five is checkable against the rule now drawn on both
    // charts. Honest: פבר and אפר poke above it. Liar: nothing does,
    // because nothing can. That is exactly what an average destroys.
    //
    // showValues stays off. The bars are read against the rule, which is the
    // skill, and printing 5,5,5,5,5 would hand the answer over.
    id: 'ד׳',
    title: 'שיירות שחצו — ינואר עד מאי',
    question: 'האם היו חודשים שבהם חצו יותר מחמש שיירות?',
    hint: 'כמה ערכים שונים מציג כל גרף?',
    trick: 'הגרף מצייר את הממוצע החודשי, 5, כאילו הוא הנתון של כל אחד מהחודשים — כל העמודות יושבות בדיוק על קו הממוצע',
    lyingFirst: true,
    honest: { kind: 'bars', labels: MONTHS_5, values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 10,
              refLine: { value: 5, label: 'ממוצע 5' } },
    lying:  { kind: 'bars', labels: MONTHS_5, values: [3, 6, 4, 7, 5], yFloor: 0, yCeil: 10, flatten: true,
              refLine: { value: 5, label: 'ממוצע 5' } }
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
  },
  {
    // FALSE FRAMING. Lotem's suggestion, 2026-09-22: "לשים גרף עוגה שהסכום
    // הוא 105% ולא 100% והשני תקין". Built with one change to her framing:
    // BOTH CHARTS CARRY THE SAME TRUE FIGURES, and the pie is the lie. Two
    // pies with different percentages would be two different data sets, which
    // is the fault ד׳ was just repaired for.
    //
    // THE NUMBERS ARE LOTEM'S OWN, from the source image behind the old ב׳:
    // 38 / 35 / 27 / 8. docs/build-spec.md recorded that they sum to 108 and
    // not 100 and listed it as a question for her — "either the categories
    // overlap or one figure is off". The categories overlap: a convoy that
    // splits uses more than one crossing and is counted at each. So the
    // inconsistency in her own spreadsheet IS the envelope, and the open
    // question closes by being taught rather than corrected.
    //
    // The bars claim nothing. They are four independent measurements and
    // adding them is the reader's business. The pie claims the four ARE the
    // whole, and a closed circle cannot be argued with. Every figure printed
    // on it is true; the shape around them is false.
    //
    // Conveniently for a group under a clock, 38 + 35 + 27 already makes
    // exactly 100, so the fourth crossing is visibly surplus rather than
    // needing four numbers held at once.
    //
    // WEAKEST POINT, AND IT IS REAL: this is the only envelope in the set
    // whose tell is arithmetic rather than something you see. Normalising the
    // slices is deliberate — see renderPie — so the circle always closes and
    // nothing looks broken. If it plays too subtle, the lever is a larger
    // overshoot, not a redrawn pie.
    id: 'ז׳',
    title: 'נתח התנועה לפי מעבר',
    question: 'האם כל שיירה נספרה במעבר אחד בלבד?',
    hint: 'חברו את ארבעת המספרים בכל גרף. מה אמור לצאת?',
    trick: 'עוגה מציגה את ארבעת המעברים כחלוקה של שלם אחד, אבל הנתונים מסתכמים ב-108% — שיירה שהתפצלה נספרה בשני מעברים',
    lyingFirst: false,
    honest: { kind: 'bars', labels: CROSSINGS, values: SHARES, yFloor: 0, yCeil: 40,
              showValues: true, unit: '%', shade: true },
    lying:  { kind: 'pie',  labels: CROSSINGS, values: SHARES, unit: '%' }
  }
];

// The two charts in display order, and which position holds the honest one.
export const chartsOf = env => (env.lyingFirst ? [env.lying, env.honest] : [env.honest, env.lying]);
export const honestPosition = env => (env.lyingFirst ? 2 : 1);
