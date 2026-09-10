// Station 6 — ארבעה כוכבים. Source: תחנה_6_מעברים.xlsx, transcribed 2026-09-10.
//
// Twelve crossings already assessed, four new ones. For each new crossing the
// group finds its three nearest neighbours among the twelve and takes their
// average risk score. The four scores are summed and reduced to one digit.
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
// THE DIGIT DOES NOT COME OUT AT 2. Working the source's own rule over its
// own data gives 2 + 3 + 2 + 3 = 10, and 1 + 0 = 1. The roster wanted 2. No
// rounding convention rescues it: rounding down gives 9, up gives 4. See
// docs/station-6-neighbours.md.

export const FEATURES = [
  { key: 'time',  label: 'שעת פעילות' },
  { key: 'road',  label: 'סוג כביש' },
  { key: 'cover', label: 'כיסוי עצים' },
  { key: 'alt',   label: 'גובה', unit: ' מ׳' },
  { key: 'veh',   label: 'רכבים/יום' }
];

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
  { id: 'N-03', time: 'יום',  veh: 7, road: 'הררי',  alt: 710, cover: 'נמוך' },
  { id: 'N-04', time: 'לילה', veh: 6, road: 'מיוער', alt: 560, cover: 'בינוני' }
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
