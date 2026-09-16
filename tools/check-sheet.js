// Does the printed facilitator sheet still match the code?
//
// docs/facilitator-sheet.md is the only copy of the passwords and the lock
// code that reaches the room — the facilitators read it off paper and the
// app has no facilitator panel. A sheet that disagrees with the build is
// worse than no sheet, because nobody discovers it until a room full of
// teenagers is typing a password that does not work.
//
//   node tools/check-sheet.js      (also runs as `npm run check`)

import { readFileSync } from 'node:fs';

// config.js reads location.search at module load to decide whether ?dev is
// on. Node has no location, so stub one rather than reshape shipped code to
// suit a tool. Dynamic import so the stub is in place first.
globalThis.location ??= { search: '' };
const { STATIONS } = await import('../src/data/stations.js');
const { CFG } = await import('../src/config.js');

const sheet = readFileSync(new URL('../docs/facilitator-sheet.md', import.meta.url), 'utf8');
const problems = [];

// The lock code, printed spaced out as "3 2 7 4 2 2 7".
const spaced = CFG.lockCode.split('').join(' ');
if (!sheet.includes(spaced)) {
  problems.push(`the sheet does not print the lock code as "${spaced}"`);
}

// One row per station: | n | name | **password** | digit |
for (const s of STATIONS) {
  const row = sheet
    .split('\n')
    .find(l => l.trim().startsWith(`| ${s.n} |`));
  if (!row) { problems.push(`station ${s.n} has no row in the sheet`); continue; }

  const cells = row.split('|').map(c => c.trim()).filter(Boolean);
  const [, name, pw, digit] = cells;
  const bare = pw.replace(/\*/g, '');

  if (name !== s.name) problems.push(`station ${s.n}: sheet says name "${name}", code says "${s.name}"`);
  if (bare !== s.password[0]) problems.push(`station ${s.n}: sheet says password "${bare}", code says "${s.password[0]}"`);
  if (digit !== String(s.digit)) problems.push(`station ${s.n}: sheet says digit ${digit}, code says ${s.digit}`);
}

// The digits in the sheet, read in order, must BE the lock code.
const fromStations = STATIONS.map(s => s.digit).join('');
if (fromStations !== CFG.lockCode) {
  problems.push(`the seven station digits spell ${fromStations}, but CFG.lockCode is ${CFG.lockCode}`);
}

// Scoring, which the sheet states in words.
if (!sheet.includes(`${CFG.pointsPerStation} נקודות`)) {
  problems.push(`the sheet does not say a station is worth ${CFG.pointsPerStation} points`);
}
if (!sheet.includes(`${CFG.bonusQuestPoints} נקודות`)) {
  problems.push(`the sheet does not say a social quest is worth ${CFG.bonusQuestPoints} points`);
}

if (problems.length) {
  console.error('facilitator sheet is out of date:\n' + problems.map(p => '  - ' + p).join('\n'));
  process.exit(1);
}
console.log(`facilitator sheet matches the build — lock ${CFG.lockCode}, ${STATIONS.length} stations`);
