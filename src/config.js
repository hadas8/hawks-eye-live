// Global rules. Anything that varies per station lives on the station config,
// not here — attempt caps and feedback granularity in particular.
export const CFG = {
  stationSeconds: 7 * 60,
  pointsPerStation: 10,
  bonusQuestPoints: 5,      // facilitators count these on paper; the app never sees them
  // Two digits no longer match the draft's roster, because working each
  // station's own rule over its own data does not reproduce it. Station 3
  // is 9, not 7 (its union sheet counts box א׳). Station 6 is 1, not 2
  // (its twelve crossings give 2+3+2+3 = 10). Both are written up in docs/,
  // and BOTH MOVE THE PHYSICAL LOCK. Neither is settled with Lotem yet.
  lockCode: '3294217'
};

// ?dev exposes the test strip. It must be removed before the event.
export const DEV = new URLSearchParams(location.search).has('dev');
