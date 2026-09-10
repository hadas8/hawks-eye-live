// Global rules. Anything that varies per station lives on the station config,
// not here — attempt caps and feedback granularity in particular.
export const CFG = {
  stationSeconds: 7 * 60,
  pointsPerStation: 10,
  bonusQuestPoints: 5,      // facilitators count these on paper; the app never sees them
  // Station 3's digit is the count in box א׳, which its own union sheet
  // instructs, and that count is 9 — not the 7 the draft's roster carried.
  // See docs/station-3-rule.md; this moves the PHYSICAL lock too.
  lockCode: '3294227'
};

// ?dev exposes the test strip. It must be removed before the event.
export const DEV = new URLSearchParams(location.search).has('dev');
