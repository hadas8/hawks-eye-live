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
import { UNLABELLED } from './station-5.js';

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
      'שורה עם — לא נספרת, גם אם הסטטוס שלה חצה. זה תופס גם כשזו השורה היחידה של אותה שיירה.',
      'עמודות המשקל והיחידה הן רעש בתחנה הזאת. השאלה היא כמה שיירות, לא כמה טון.'
    ]
  },

  // ── not built. Passwords and several digits are still placeholders. ──
  { n: 2, name: 'הגרפים המשקרים',        concept: 'ויזואליזציית מידע',        password: ['אופק'], digit: 2, kind: null },
  { n: 3, name: 'הכלל הנסתר',            concept: 'סיווג מול חיזוי',          password: ['מדף'],  digit: 7, kind: null },
  { n: 4, name: 'השאלה ששווה לשאול',     concept: 'עצי החלטה',                password: ['ענף'],  digit: 4, kind: null },

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
      'צבע, גלגלים וארגז מופיעים גם אצל נושאות וגם אצל לא נושאות, אז אף אחד מהם לא יכול להיות הכלל.',
      'הכלל הוא האנטנה.'
    ]
  },

  { n: 6, name: 'ארבעה כוכבים',          concept: 'KNN — שכנים קרובים',       password: ['גדר'],  digit: 2, kind: null },
  { n: 7, name: 'שמונה אנליסטים',        concept: 'Random Forest — יער אקראי', password: ['חורש'], digit: 7, kind: null }
];
