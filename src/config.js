// Global rules. Anything that varies per station lives on the station config,
// not here — attempt caps and feedback granularity in particular.
export const CFG = {
  stationSeconds: 7 * 60,
  pointsPerStation: 10,
  bonusQuestPoints: 5,      // facilitators count these on paper; the app never sees them
  // 3274227 — the code on the printed decode card, and the code the
  // physical lock in the room is set to. It has not moved and it should not:
  // which digit a station awards is arbitrary, the group never sees how it
  // was derived, and nothing is gained by making a real lock follow our
  // arithmetic. Two stations award a digit their own data does not produce
  // (3 counts box ב rather than א; 6 is awarded outright) and neither is
  // visible to anyone playing.
  lockCode: '3274227'
};

// ?dev exposes the test strip. It must be removed before the event.
export const DEV = new URLSearchParams(location.search).has('dev');
