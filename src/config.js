// Global rules. Anything that varies per station lives on the station config,
// not here — attempt caps and feedback granularity in particular.
export const CFG = {
  stationSeconds: 7 * 60,
  pointsPerStation: 20,
  bonusQuestPoints: 5,      // facilitators count these on paper; the app never sees them
  // ONE DIGIT PER STATION, IN STATION ORDER. There is no physical lock and
  // no box in the room — the vault screen is the whole ending — so this
  // exists only to be typed back in at the end.
  //
  // It was `3274227` until 2026-09-21, when station 6 (KNN) was removed and
  // its digit came out with it. Nothing else moved: every remaining station
  // kept the digit it already had.
  //
  // MUST STAY EXACTLY AS LONG AS `STATIONS`, and the vault input's
  // `maxlength` with it. Which digit a station awards is arbitrary — the
  // derivation is never on screen and station 3 awards its outright — but
  // the COUNT is not arbitrary, and `npm run check` is the only thing that
  // catches a mismatch.
  lockCode: '327427'
};

// ?dev exposes the test strip. It must be removed before the event.
export const DEV = new URLSearchParams(location.search).has('dev');
