// The station roster. Names are the real ones, from the draft.
//
// Station 1 is final and verified. Stations 2 to 7 are roster entries only:
// their passwords are placeholders, several of their digits are still
// disputed (see the blockers at the end of docs/build-spec.md), and none of
// them has a `kind`, so none renders an interaction. Do not invent content
// to fill those gaps — a station without a `kind` shows a plain "not built
// yet" panel and the flow still runs end to end.
//
// `maxAttempts` is per station, deliberately, and is coupled to
// `revealWhichWrong`: precise per-part feedback is only safe when there are
// too few submissions to sweep the answer space by watching the count move.

import { TABLES } from './station-1.js';
import { ENVELOPES, honestPosition } from './station-2.js';
import { PICK, isProperSet, survivors } from './station-4.js';
import { UNLABELLED } from './station-5.js';
import { CARDS, DIGIT_BOX, countIn } from './station-3.js';
import { NEW, NEIGHBOURS, isCorrectFor, scoreFrom, K as KNN } from './station-6.js';

export const STATIONS = [
  {
    n: 1,
    name: 'הטבלאות המשקרות',
    concept: 'ניקוי נתונים',
    password: ['נוצה'],
    digit: 3,
    kind: 'tables',

    maxAttempts: 3,
    revealWhichWrong: true,

    brief: 'קלטנו מאות דיווחים על תנועה בגבול הלילה, וכולם מלוכלכים. בלי לנקות אותם קודם, לא נזהה את השיירה האמיתית.',
    truth: { min: 30, max: 60 },

    answer: {
      parts: TABLES.map(t => ({ kind: 'number', value: t.count })),
      rule: 'digitalRoot'
    },

    hints: [
      'התחילו מהסטטוס: סמנו קודם רק שורות שחצו, ורק אחר כך טפלו בכפילויות.',
      'שני פורמטי תאריך מסתירים את אותה שיירה. השוו לפי המזהה, לא לפי התאריך.',
      'שורה עם — לא נספרת, גם אם הסטטוס שלה חצה. זה תופס גם כשזו השורה היחידה של אותה שיירה.'
    ]
  },

  // ── not built. Passwords and several digits are still placeholders. ──

  {
    n: 2,
    name: 'הגרפים המשקרים',
    concept: 'ויזואליזציית מידע',
    password: ['אופק'],          // still a placeholder
    digit: 2,
    kind: 'charts',

    // נראות התחנות: all or nothing, and the group is told nothing about
    // WHICH envelope is wrong. Uncapped submissions are safe because of
    // that: seven binary choices with no partial feedback gives nothing to
    // hill-climb on, so a sweep costs more clicks than the clock allows.
    revealWhichWrong: false,

    brief: 'שבע נקודות תצפית שלחו דוחות גרפיים, וכל דוח הגיע בשני עותקים עם אותם נתונים בדיוק. באחד מכל זוג מישהו סידר את הגרף כך שיטעה את מי שמסתכל.',

    answer: {
      parts: ENVELOPES.map(env => ({ kind: 'choice', value: honestPosition(env) })),
      // The digit is stated outright by the source, so it is not derived
      // from the answers: תחנה_2_גרפים_סופי.docx says
      // "עדכנו את ספרת תחנה 2 ל-2 (במקום 6). הקוד המעודכן: 3274227".
      rule: 'literal'
    },

    hints: []   // station 2's hints are per envelope, inside the station
  },

  {
    n: 3,
    name: 'הכלל הנסתר',
    concept: 'סיווג מול חיזוי',
    password: ['מדף'],           // still a placeholder
    // Not 7. The union sheet says the digit is the count in box א׳, and
    // working its own rule over the twenty cards puts 9 there. The roster's
    // 7 is the count in box ב׳. See docs/station-3-rule.md.
    digit: countIn(DIGIT_BOX),
    kind: 'boxes',

    // Twenty cards over three boxes. Per-card feedback across three
    // submissions would let a group read the rule off the app one card at
    // a time, so the verdict is all or nothing.
    maxAttempts: 3,
    revealWhichWrong: false,

    brief: 'שלוש קופסאות על השולחן ובכל אחת שני כרטיסים שמישהו כבר מיין, אבל אף קופסה לא מסמנת לפי מה.',

    answer: {
      parts: CARDS.map(c => ({ kind: 'choice', value: c.box })),
      rule: 'custom',
      // The group's own sort produces the digit, rather than the app
      // asserting it: count what they put in the box the sheet names.
      derive: values => values.filter(v => v === DIGIT_BOX).length
    },

    hints: [
      'שני הכרטיסים שבכל קופסה חולקים משהו, וזה לא הנושא שלהם. הסתכלו על סוג התשובה שהשאלה מבקשת.',
      'קופסה אחת לא ממוינת לפי סוג התשובה. שאלו מה משותף דווקא לשני הכרטיסים שבה.'
    ]
  },

  {
    n: 4,
    name: 'השאלה ששווה לשאול',
    concept: 'עצי החלטה',
    password: ['ענף'],           // still a placeholder
    digit: 4,
    kind: 'questions',

    // נראות התחנות: "אם הם לא מצליחים בסדר הנכון יש להם עוד אופציה אחת".
    maxAttempts: 2,
    revealWhichWrong: false,

    brief: 'זיהינו שישה־עשר רכבים על הציר, ואחד מהם נושא את המטען. יש לכם עשרים שאלות אפשריות ורשות לשאול ארבע.',

    answer: {
      // One set, graded whole: 36 different sets of four are equally
      // correct, so there is no per-question verdict to hand back.
      parts: [{ kind: 'pickN', count: PICK, valid: isProperSet }],
      rule: 'custom',
      // The digit is whichever vehicle is left standing, not an assertion.
      derive: ([ids]) => survivors(ids)[0]?.n ?? 0
    },

    hints: [
      'שאלה שכל הצי עונה עליה אותו דבר לא פוסלת אף אחד. לחצו על שאלה ותראו מיד אם היא מחלקת את הצי או לא.',
      'ארבע שאלות שחותכות את הצי באותו מקום שוות לשאלה אחת. בדקו שכל שאלה שבחרתם מסתכלת על עמודה אחרת.'
    ]
  },


  {
    n: 5,
    name: 'מי קיבל תשובות ומי לא',
    concept: 'למידה מפוקחת ולא מפוקחת',
    password: ['מצפן'],          // still a placeholder
    digit: 2,
    kind: 'cards',

    // Six binary choices is 64 combinations, so per-card feedback plus
    // retries would be brute-forceable. It is really one insight, not six
    // judgements: get the rule and all six follow. So the verdict is
    // all-or-nothing, and a wrong submit sends them back to the ten
    // labelled cards rather than telling them which of the six moved.
    maxAttempts: 3,
    revealWhichWrong: false,

    brief: 'עשר משאיות כבר נבדקו ואנחנו יודעים על כל אחת אם נשאה אמל"ח. על שש אחרות אין לנו כלום, ואין זמן לעצור כל אחת ולבדוק.',

    answer: {
      parts: UNLABELLED.map(c => ({ kind: 'choice', value: c.carries })),
      rule: 'count'
    },

    hints: [
      'חמש מהמשאיות שנבדקו נושאות אמל"ח וחמש לא. חפשו תכונה שיש לכל החמש הנושאות ואין לאף אחת מהאחרות.',
      'תכונה שמופיעה גם אצל נושאת וגם אצל לא נושאת לא יכולה להיות הכלל. עברו על ארבע התכונות ופסלו.'
    ]
  },

  {
    n: 6,
    name: 'ארבעה כוכבים',
    concept: 'KNN — שכנים קרובים',
    password: ['גדר'],           // still a placeholder
    // Not 2. Working the xlsx's own rule over its own twelve crossings gives
    // 2+3+2+3 = 10, and 1+0 = 1. No rounding convention rescues the 2:
    // rounding down gives 9, up gives 4. See docs/station-6-neighbours.md.
    digit: (() => {
      const sum = NEW.reduce((t, n) => t + scoreFrom(NEIGHBOURS[n.id]), 0);
      return sum <= 0 ? 0 : 1 + ((sum - 1) % 9);
    })(),
    kind: 'neighbours',

    // Three sets of three from twelve is 220^3, so there is nothing to
    // brute-force, and naming WHICH crossing is wrong says nothing about
    // what is wrong inside it — the same trade station 1 makes.
    maxAttempts: 3,
    revealWhichWrong: true,

    brief: 'שנים‑עשר מעברים כבר נבדקו ויש לנו עליהם ציון סיכון, ושלושה חדשים נפתחו הלילה בלי שום היסטוריה. מעבר שמושך למעברים שאנחנו מכירים מתנהג כמותם.',

    answer: {
      // One set of three per new crossing, graded whole: which three, not
      // in what order.
      parts: NEW.map(n => ({
        kind: 'pickN', count: KNN, valid: ids => isCorrectFor(n.id, ids)
      })),
      rule: 'custom',
      // The group's own picks make the digit: average each set of three,
      // sum the four, reduce to one digit.
      derive: sets => {
        const sum = sets.reduce((t, ids) => t + scoreFrom(ids), 0);
        return sum <= 0 ? 0 : 1 + ((sum - 1) % 9);
      }
    },

    hints: [
      'התחילו משעת הפעילות ופסלו את כל מי שלא מתאים. רק מהנותרים עוברים לתכונה הבאה.',
      'אם נשארו פחות משלושה שחולקים את שתי התכונות הראשונות, השלישי מגיע מהקרוב ביותר שנותר — לא ממי שדומה לכם במבט ראשון.'
    ]
  },
  { n: 7, name: 'שמונה אנליסטים',        concept: 'Random Forest — יער אקראי', password: ['חורש'], digit: 7, kind: null }
];
