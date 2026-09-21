// The station roster. Names are the real ones, from the draft.
//
// SIX STATIONS, ALL BUILT. It was seven until 2026-09-21, when Hadas
// removed ארבעה כוכבים (KNN) — the only station that HANDED THE GROUP ITS
// RULE instead of making them find it, which made it execution rather than
// insight and is why no amount of trimming fixed it. Old station 7 is now
// station 6. docs/station-6-neighbours.md keeps the analysis.
//
// Stations 1, 4, 5 and 6 are verified against their sources and closed; 2
// and 3 were closed by rewriting their content here. Nothing is open.
//
// A station's digit does not have to be derivable from its own data. The
// derivation is never on screen and no participant can tell, so a digit is
// a token that keeps CFG.lockCode where it is. Station 3 awards its
// outright for that reason. THE CODE IS NOW SIX DIGITS — `327427`, which is
// the old `3274227` with the removed station's 2 taken out. Nothing else
// moved, so every remaining station keeps the digit it already had.
//
// There is no physical box or lock; the vault screen is the whole ending.
// If a station is ever added or removed again, CFG.lockCode has to move
// with it, and `npm run check` is what catches it if you forget.
//
// THE PASSWORDS ARE FINAL. They were chosen here rather than supplied
// by the source, and Hadas adopted them as the real ones on 2026-09-16 —
// נוצה, אופק, מדף, ענף, מצפן, חורש. גדר retired with station 6 on
// 2026-09-21 and is not reused. Changing one now means reprinting
// the facilitators' sheet, so do not touch them casually.
//
// `maxAttempts` is per station, deliberately, and is COUPLED to
// `revealWhichWrong`: precise per-part feedback is only safe when there are
// too few submissions to sweep the answer space by watching the marks move.
// Station 3 is the worked example — twenty cards over three boxes with
// per-card marks is brute-forceable in exactly three attempts and airtight
// in two. Never raise a station's attempts without re-checking what its
// feedback gives away.

import { TABLES } from './station-1.js';
import { ENVELOPES, honestPosition } from './station-2.js';
import { PICK, isProperSet, survivors } from './station-4.js';
import { UNLABELLED, UNLABELLED_2 } from './station-5.js';
import { CARDS } from './station-3.js';
import { ANALYSTS, tally, winnerOf, codeOf } from './station-7.js';

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

  {
    n: 2,
    name: 'הגרפים המשקרים',
    concept: 'ויזואליזציית מידע',
    password: ['אופק'],
    digit: 2,
    kind: 'charts',

    // נראות התחנות: all or nothing, and the group is told nothing about
    // WHICH envelope is wrong.
    //
    // THREE, capped 2026-09-21 at Hadas's call — it ran uncapped until then,
    // which was defensible (nothing to hill-climb on, so the only sweep is
    // blind resubmission) but meant a stuck group could burn the whole slot
    // guessing. Six binary choices is 64 combinations, so three tries is a
    // 4.7% guess and the cap costs a real group nothing.
    //
    // THREE RATHER THAN TWO, and this is the station where that matters
    // most: it is the ONLY one that gives no partial feedback at all.
    // Station 4 is also revealWhichWrong:false but still shows how many each
    // chosen question filtered; 1, 3, 5, 6 and 7 all mark the parts. Here a
    // rejection says "no" and stops. An attempt therefore buys less than an
    // attempt anywhere else, and a submission is SIX independent judgements
    // graded together — at 90% per envelope a clean sweep is 53%, which two
    // tries take to ~78% and three to ~89%. Punishing one slip across twelve
    // charts would punish exactly the care this station teaches.
    maxAttempts: 3,
    revealWhichWrong: false,

    brief: 'שש נקודות תצפית שלחו דוחות גרפיים, וכל דוח הגיע בשני עותקים עם אותם נתונים בדיוק. באחד מכל זוג מישהו סידר את הגרף כך שיטעה את מי שמסתכל.',

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
    password: ['מדף'],
    // 7, awarded outright. The rewritten card set sorts 8 / 8 / 4, so no
    // box holds 7 and the digit is not a count any more. That costs nothing:
    // the union sheet's "הספרה = כרטיסים בקופסה א׳" was never rendered, the
    // boxes carry no labels, and nothing on screen claims the digit comes
    // from a tally — so the counts stay visible for the group's own
    // bookkeeping while the digit keeps the lock code where it is. Station 6
    // does the same for the same reason.
    digit: 7,
    kind: 'boxes',

    // Per-card feedback, at Hadas's request 2026-09-16: "you are wrong
    // somewhere in twenty cards" gives a group nothing to act on, which is
    // the same complaint that reshaped station 6. A rejected submit now
    // marks every card right or wrong. It never says which box a wrong card
    // belongs in — that is the answer.
    //
    // TWO attempts, not three, and the two settings are locked together.
    // With three, per-card feedback is a complete brute-force: submit once
    // to learn which cards are wrong, move every wrong card to a second box
    // and submit again, and the ones still wrong must be the third — twenty
    // cards placed without ever finding the rule. Two attempts kills it,
    // because the second submit has to be a simultaneous two-way guess on
    // every wrong card at once. Hadas's call, 2026-09-16.
    //
    // SO DO NOT RAISE THIS WITHOUT TURNING revealWhichWrong OFF. Three
    // attempts plus per-card marks is exactly the exploit above, and the
    // station teaches nothing to anyone who notices.
    //
    // This is the strictest station in the evening, and deliberately: the
    // feedback is precise, so the budget is short.
    maxAttempts: 2,
    revealWhichWrong: true,

    brief: 'שלוש קופסאות על השולחן ובכל אחת שני כרטיסים שמישהו כבר מיין, אבל אף קופסה לא מסמנת לפי מה.',

    answer: {
      parts: CARDS.map(c => ({ kind: 'choice', value: c.box })),
      rule: 'literal'
    },

    hints: [
      'שני הכרטיסים שבכל קופסה חולקים משהו, וזה לא הנושא שלהם. הסתכלו על סוג התשובה שהשאלה מבקשת.',
      // Sharper under the rewritten rule than it was before: ג׳ genuinely is
      // the box that is not sorted by answer type, and its two examples now
      // share exactly one thing — the answer is inside somebody's head.
      'קופסה אחת לא ממוינת לפי סוג התשובה. שאלו מה משותף דווקא לשני הכרטיסים שבה.'
    ]
  },

  {
    n: 4,
    name: 'השאלה ששווה לשאול',
    concept: 'עצי החלטה',
    password: ['ענף'],
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
    // Not 'למידה מפוקחת ולא מפוקחת' any more. Round two is a second
    // supervised round, so the station no longer touches the unsupervised
    // half — and unsupervised learning is now previewed nowhere in the
    // evening. Hadas's call, 2026-09-16, made deliberately rather than
    // drifting into it. See docs/station-5-difficulty.md.
    concept: 'למידה מפוקחת',
    password: ['מצפן'],
    digit: 2,
    kind: 'cards',

    // Two. Went 4 → 3 → 2 over 2026-09-16, all Hadas's call, the last one
    // because the station reads as an easy one and three tries made it
    // easier still.
    //
    // This is a difficulty lever here, NOT a safety one — the direction
    // that needs justifying is upward. The feedback is per ROUND and never
    // per truck, so a round is six binary answers and a rejection leaves 64
    // possibilities with nothing to sweep; three was already safe and two
    // is safe for the same reason. Contrast station 3, where two is forced:
    // its marks are per CARD, and a third attempt there IS the exploit.
    maxAttempts: 2,
    revealWhichWrong: true,

    brief: 'עשר משאיות כבר נבדקו ואנחנו יודעים על כל אחת אם נשאה אמל"ח. על שש אחרות אין לנו כלום, ואין זמן לעצור כל אחת ולבדוק.',

    answer: {
      // Round one first, then round two — the station module splits `res`
      // at this boundary to say which round was wrong.
      parts: [
        ...UNLABELLED.map(c => ({ kind: 'choice', value: c.carries })),
        ...UNLABELLED_2.map(c => ({ kind: 'choice', value: c.carries }))
      ],
      rule: 'custom',
      // The digit is still round one's count, so it stays 2 and the lock
      // code is untouched. Round two is a second gate, not a second number.
      derive: vals => vals.slice(0, UNLABELLED.length).filter(Boolean).length
    },

    hints: [
      'חמש מהמשאיות שנבדקו בסבב הראשון נושאות אמל"ח וחמש לא. חפשו תכונה שיש לכל החמש הנושאות ואין לאף אחת מהאחרות.',
      // Round two's rule is an interaction, so no feature survives the
      // one-column test at all — and unlike round one, the carriers share
      // nothing either. This points at the only route in without naming
      // which two features or what they do to each other.
      'תכונה שמופיעה משני צדי החלוקה לא יכולה להיות הכלל לבדה. בסבב ב׳ אף תכונה לא שורדת את המבחן הזה, אז חפשו שתיים שתלויות זו בזו.'
    ]
  },

  {
    n: 6,
    name: 'שמונה אנליסטים',
    concept: 'Random Forest — יער אקראי',
    password: ['חורש'],
    // 7 — the site code for סמנאן, which wins 5 votes to 2 to 1. This is
    // the one station whose digit the roster already had right.
    digit: codeOf('סמנאן'),
    kind: 'forest',

    // Eight picks from three is 6561 combinations, so there is nothing to
    // sweep, and after two stations of all-or-nothing silence the last one
    // can afford to say which analyst was misread. It never says which row.
    maxAttempts: 3,
    revealWhichWrong: true,

    brief: 'שמונה עמדות האזנה קלטו את המשאית החשודה הלילה, וכל אחת קלטה שני נתונים אחרים. המשגר מוסתר באחד משלושה אתרים, ואף עמדה לא ראתה מספיק כדי להכריע לבד.',

    answer: {
      // One row per analyst, all eight graded together.
      parts: ANALYSTS.map(a => ({ kind: 'choice', value: a.fires })),
      rule: 'custom',
      // The group's own eight verdicts are counted, and the winning site's
      // code is the digit — the app asserts nothing.
      derive: rows => codeOf(winnerOf(tally(rows)))
    },

    hints: [
      'לכל אנליסט שני נתונים בלבד. קראו את שלוש השורות מלמעלה למטה ועצרו בראשונה שמתאימה לשניהם.',
      'שורה שמתאימה רק לנתון אחד מהשניים לא מתאימה. בדקו את שני התנאים בכל שורה.'
    ]
  }
];
