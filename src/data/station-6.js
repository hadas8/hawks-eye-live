// Station 6 — ארבעה כוכבים. Source: תחנה_6_מעברים.xlsx, transcribed 2026-09-10.
//
// Twelve crossings already assessed, three new ones (the source had four;
// see the note on N-04 below). For each new crossing the group finds its
// three nearest neighbours among the twelve and takes their average risk
// score. Those scores are summed and reduced to one digit.
//
// Unlike stations 3 and 5, the rule is NOT hidden — the xlsx hands it over in
// its own header, in priority order:
//
//   (1) שעת פעילות  (2) סוג כביש  (3) כיסוי עצים  (4) גובה  (5) רכבים/יום
//   "שני מעברים דומים = חולקים כמה שיותר תכונות מהתחלת הרשימה"
//
// So the comparison is lexicographic: agree on the first feature, then the
// second, and so on; the numeric features break ties by closeness. That is
// deterministic, and `NEIGHBOURS` below is computed from it rather than
// asserted, so the key cannot drift from the rule.
//
// THE DIGIT DOES NOT COME OUT AT 2. With N-04 dropped the three remaining
// crossings score 2 + 3 + 2 = 7, so the digit is 7. (With N-04 it was
// 2 + 3 + 2 + 3 = 10 and the digit was 1; the roster wanted 2, and no
// rounding convention reached it.) See docs/station-6-neighbours.md.

// `match: true` marks the features two crossings can be said to SHARE. The
// other two are numbers: 360 מ׳ and 350 מ׳ are not shared, they are near.
// That distinction is the source's own blind spot — its rule says crossings
// share features and then lists two that cannot be — so the station makes it
// visible instead of papering over it: you can filter on the first three and
// only compare on the last two.
export const FEATURES = [
  { key: 'time',  label: 'שעת פעילות', match: true },
  { key: 'road',  label: 'סוג כביש',   match: true },
  { key: 'cover', label: 'כיסוי עצים', match: true },
  { key: 'alt',   label: 'גובה', unit: ' מ׳' },
  { key: 'veh',   label: 'רכבים/יום' }
];

export const MATCHABLE = FEATURES.filter(f => f.match);

const known = (id, time, veh, road, alt, cover, score) =>
  ({ id, time, veh, road, alt, cover, score });

export const KNOWN = [
  known('K-01', 'לילה', 12, 'הררי',  950, 'נמוך',   5),
  known('K-02', 'יום',   3, 'שטוח',  200, 'גבוה',   1),
  known('K-03', 'לילה',  8, 'הררי',  800, 'נמוך',   4),
  known('K-04', 'יום',   6, 'שטוח',  150, 'גבוה',   2),
  known('K-05', 'לילה', 10, 'הררי',  900, 'נמוך',   5),
  known('K-06', 'יום',   4, 'מיוער', 400, 'גבוה',   2),
  known('K-07', 'לילה',  7, 'מיוער', 600, 'בינוני', 3),
  known('K-08', 'יום',   2, 'שטוח',  100, 'גבוה',   1),
  known('K-09', 'לילה',  9, 'הררי',  850, 'נמוך',   4),
  known('K-10', 'יום',   5, 'מיוער', 350, 'בינוני', 2),
  known('K-11', 'לילה',  6, 'מיוער', 550, 'בינוני', 3),
  known('K-12', 'יום',   8, 'הררי',  700, 'נמוך',   3)
];

export const NEW = [
  { id: 'N-01', time: 'יום',  veh: 5, road: 'מיוער', alt: 360, cover: 'בינוני' },
  { id: 'N-02', time: 'לילה', veh: 7, road: 'מיוער', alt: 570, cover: 'בינוני' },
  { id: 'N-03', time: 'יום',  veh: 7, road: 'הררי',  alt: 710, cover: 'נמוך' }
  // N-04 (לילה / מיוער / בינוני / 560 מ׳ / 6) is DROPPED, Hadas 2026-09-10.
  // It agreed with N-02 on all three deciding features and differed by ten
  // metres and one vehicle — the two tie-breakers, which cannot move
  // anything when the nearest candidates are fifty metres apart. Its full
  // twelve-place ranking was identical to N-02's, so a group did a quarter
  // of the station's work twice and learned nothing from the second pass.
];

export const K = 3;   // three neighbours, as the source says

// The xlsx's rule, as a sort key: the three categorical features in the
// order it gives, then the two numeric ones by closeness.
const rank = (n, k) => [
  n.time  === k.time  ? 0 : 1,
  n.road  === k.road  ? 0 : 1,
  n.cover === k.cover ? 0 : 1,
  Math.abs(n.alt - k.alt),
  Math.abs(n.veh - k.veh)
];
const cmp = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] - b[i]; return 0; };

// Sorted best-first. Exported so the station can show a group why a pick is
// or is not a neighbour without hardcoding an answer anywhere.
export const rankedFor = n =>
  KNOWN.map(k => ({ k, key: rank(n, k) })).sort((a, b) => cmp(a.key, b.key)).map(r => r.k);

export const NEIGHBOURS = Object.fromEntries(
  NEW.map(n => [n.id, rankedFor(n).slice(0, K).map(k => k.id)]));

// The average of the three neighbours' scores, rounded to the nearest whole
// number — the source's ציון ממוצע column.
export const scoreFrom = ids => {
  const s = ids.map(id => KNOWN.find(k => k.id === id)?.score ?? 0);
  return Math.round(s.reduce((a, b) => a + b, 0) / s.length);
};

export const sameSet = (a, b) =>
  a.length === b.length && [...a].sort().join() === [...b].sort().join();

export const isCorrectFor = (nId, ids) => sameSet(ids, NEIGHBOURS[nId]);
