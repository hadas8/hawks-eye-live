// Station 7 — שמונה אנליסטים. Source: the original draft,
// חדר בריחה 7 תחנות - מבצע עין הנץ.docx. Lotem never wrote a standalone
// doc for this one; see docs/station-7-forest.md for the assessment.
//
// Eight analysts. Each holds TWO readings off the suspect truck and a
// three-row decision table, reads down to the first row that fits, and
// names a site. No analyst sees more than two readings, so each is a
// one-split decision tree, and the eight of them are a forest.
//
// Verified: every analyst reproduces the draft's key, exactly one rule
// fires for each, and no row is unreachable. Votes come out 5 / 2 / 1 for
// סמנאן / תבריז / אצפהאן, and סמנאן's site code is 7 — which is the digit
// the roster already carries. Station 7 needs no lock-code change.
//
// THE SITE CODES ARE RECOVERED, NOT STATED. The draft points at a
// טבלת קודי האתרים twice and never prints it. Its solution says outright
// that סמנאן is 7, and its union sheet carries 7 / 2 / 5 against the three
// sites in the VOTES column — which cannot be votes, because eight analysts
// vote eight times and the truth check on the same page says so. They are
// the codes, printed one column left of where they belong. Worth one line
// of confirmation from Lotem.

export const SITES = [
  { name: 'סמנאן',  code: 7 },
  { name: 'תבריז',  code: 2 },
  { name: 'אצפהאן', code: 5 }
];

export const codeOf = name => SITES.find(s => s.name === name)?.code ?? 0;

// `rules` are read top to bottom, first match wins — which is how a person
// reads "מצא את השורה שמתאימה". `fires` is the index of the row that fits
// this analyst's readings; it is asserted here and checked against the
// conditions in the station-7 test rather than trusted.
const analyst = (n, readings, rules, fires, accuracy) =>
  ({ n, readings, rules, fires, accuracy, says: rules[fires].site });

export const ANALYSTS = [
  analyst(1,
    [{ k: 'שעת התנועה שקלטת', v: '02:40' }, { k: 'מספר השומרים שספרת', v: '6' }],
    [{ when: 'שעה לפני 04:00, ויותר מ-4 שומרים', site: 'סמנאן' },
     { when: 'שעה לפני 04:00, אך 4 שומרים או פחות', site: 'תבריז' },
     { when: 'שעה 04:00 או אחריה', site: 'אצפהאן' }], 0, 61),

  analyst(2,
    [{ k: 'סוג הקרקע שזיהית', v: 'חולית' }, { k: 'המרחק מכביש ראשי', v: '12 ק״מ' }],
    [{ when: 'קרקע חולית, ויותר מ-10 ק״מ', site: 'סמנאן' },
     { when: 'קרקע חולית, אך 10 ק״מ או פחות', site: 'אצפהאן' },
     { when: 'קרקע שאינה חולית', site: 'תבריז' }], 0, 58),

  analyst(3,
    [{ k: 'טמפרטורת המנוע שמדדת', v: '78 מעלות' }, { k: 'עוצמת אות הרדיו', v: 'חלש' }],
    [{ when: 'מעל 70 מעלות, ואות חזק', site: 'סמנאן' },
     { when: 'מעל 70 מעלות, ואות חלש', site: 'תבריז' },
     { when: '70 מעלות או פחות', site: 'אצפהאן' }], 1, 68),

  analyst(4,
    [{ k: 'רוחב הדרך שמדדת', v: '4 מטר' }, { k: 'מספר השומרים שספרת', v: '6' }],
    [{ when: 'רחב מ-3 מטר, ולפחות 5 שומרים', site: 'סמנאן' },
     { when: 'רחב מ-3 מטר, אך פחות מ-5 שומרים', site: 'אצפהאן' },
     { when: '3 מטר או פחות', site: 'תבריז' }], 0, 55),

  analyst(5,
    [{ k: 'טמפרטורת המנוע שמדדת', v: '78 מעלות' }, { k: 'שעת התנועה שקלטת', v: '02:40' }],
    [{ when: 'מעל 80 מעלות', site: 'סמנאן' },
     { when: '80 מעלות או פחות, ושעה לפני 03:00', site: 'אצפהאן' },
     { when: '80 מעלות או פחות, ושעה 03:00 או אחריה', site: 'תבריז' }], 1, 60),

  analyst(6,
    [{ k: 'מספר הגלגלים שספרת', v: '6' }, { k: 'צבע המשאית שראית', v: 'לבן' }],
    [{ when: '6 גלגלים, וצבע לבן', site: 'סמנאן' },
     { when: '6 גלגלים, וצבע שאינו לבן', site: 'תבריז' },
     { when: '8 גלגלים', site: 'אצפהאן' }], 0, 57),

  analyst(7,
    [{ k: 'המרחק מכביש ראשי', v: '12 ק״מ' }, { k: 'עוצמת אות הרדיו', v: 'חלש' }],
    [{ when: 'יותר מ-10 ק״מ, ואות חזק', site: 'סמנאן' },
     { when: 'יותר מ-10 ק״מ, ואות חלש', site: 'תבריז' },
     { when: '10 ק״מ או פחות', site: 'אצפהאן' }], 1, 66),

  analyst(8,
    [{ k: 'מספר השומרים שספרת', v: '6' }, { k: 'סוג הקרקע שזיהית', v: 'חולית' }],
    [{ when: '5 שומרים או יותר, וקרקע חולית', site: 'סמנאן' },
     { when: '5 שומרים או יותר, וקרקע שאינה חולית', site: 'אצפהאן' },
     { when: 'פחות מ-5 שומרים', site: 'תבריז' }], 0, 54)
];

// Tally a set of row choices into votes per site. `rows[i]` is the row the
// group fired for analyst i, or null.
export function tally(rows) {
  const votes = Object.fromEntries(SITES.map(s => [s.name, 0]));
  rows.forEach((r, i) => {
    if (r == null) return;
    votes[ANALYSTS[i].rules[r].site]++;
  });
  return votes;
}

// The site with the most votes. Ties resolve to nothing rather than to an
// arbitrary winner — with eight analysts and three sites a tie is possible,
// though it cannot happen on the correct answer.
export function winnerOf(votes) {
  const ranked = Object.entries(votes).sort((a, b) => b[1] - a[1]);
  if (ranked.length > 1 && ranked[0][1] === ranked[1][1]) return null;
  return ranked[0][0];
}

export const KEY = ANALYSTS.map(a => a.fires);

// `accuracy` is carried here but NEVER RENDERED. The draft's payoff is that
// the two best analysts, #3 at 68% and #7 at 66%, both said תבריז and both
// were wrong — and the draft has a facilitator hand that card over in the
// room, after the reveal. It was briefly built as an epilogue on the solved
// screen and removed: Hadas's call, and the right one. Nobody reads a
// paragraph at the end of a station they have just finished, that slot is
// their social quest, and station 7's ending has to look like the other
// six. The numbers stay in the data because they are the source's content
// and the facilitator still needs them.
