// Global rules. Anything that varies per station lives on the station config,
// not here — attempt caps and feedback granularity in particular.
export const CFG = {
  stationSeconds: 7 * 60,
  pointsPerStation: 10,
  bonusQuestPoints: 5,      // facilitators count these on paper; the app never sees them
  lockCode: '3274227'
};

// ?dev exposes the test strip. It must be removed before the event.
export const DEV = new URLSearchParams(location.search).has('dev');
