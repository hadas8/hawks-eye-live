// A small SVG chart renderer, built for station 2 — הגרפים המשקרים.
//
// Every chart in that station comes in pairs showing identical data, where
// one of the pair has been distorted in a specific way. So the distortions
// are not accidents to be avoided here; they are parameters:
//
//   yFloor      where the value axis starts. 0 is honest; anything else
//               inflates small differences into cliffs.
//   highlight   an index drawn in the accent colour while the rest go
//               muted, so the eye lands on it regardless of its size.
//   order       'desc' sorts the bars largest-first, destroying the
//               chronology while looking like a trend.
//   pick        renders only these indices, evenly spaced, so unequal gaps
//               on the category axis disappear.
//   flatten     replaces every value with their mean, turning a series into
//               a straight line at its average.
//
// RTL throughout: category index 0 sits at the RIGHT of the plot and the
// value axis is on the right, which is where a Hebrew reader starts.

import { esc } from './text.js';

const W = 340, H = 210;
const PAD = { top: 16, right: 44, bottom: 30, left: 12 };
const X0 = PAD.left, X1 = W - PAD.right;          // plot, right edge = first category
const Y0 = PAD.top, Y1 = H - PAD.bottom;

const nice = n => (Number.isInteger(n) ? String(n) : n.toFixed(1));

// Four gridlines from floor to ceiling, on round-ish numbers.
function ticks(floor, ceil) {
  const step = (ceil - floor) / 4;
  return [0, 1, 2, 3, 4].map(i => floor + step * i);
}

export function renderChart(spec) {
  const {
    kind = 'bars', labels = [], values = [],
    yFloor = 0, yCeil, highlight = null, order = 'given',
    pick = null, flatten = false, showValues = false, unit = ''
  } = spec;

  // Apply the distortions in a fixed order so a spec reads predictably.
  let rows = labels.map((label, i) => ({ label, value: values[i] }));
  if (pick) rows = pick.map(i => rows[i]);
  if (order === 'desc') rows = rows.slice().sort((a, b) => b.value - a.value);
  if (flatten) {
    const mean = rows.reduce((s, r) => s + r.value, 0) / rows.length;
    rows = rows.map(r => ({ ...r, value: mean }));
  }

  const top = yCeil ?? Math.max(...rows.map(r => r.value)) * 1.15;
  const floor = Math.min(yFloor, ...rows.map(r => r.value));
  const span = (top - floor) || 1;

  const band = (X1 - X0) / rows.length;
  const xOf = i => X1 - (i + 0.5) * band;                 // index 0 on the right
  const yOf = v => Y1 - ((v - floor) / span) * (Y1 - Y0);

  const grid = ticks(floor, top).map(t => `
    <line x1="${X0}" x2="${X1}" y1="${yOf(t).toFixed(1)}" y2="${yOf(t).toFixed(1)}" class="cg"/>
    <text x="${X1 + 6}" y="${(yOf(t) + 3.5).toFixed(1)}" class="cy">${esc(nice(t))}</text>`).join('');

  const xLabels = rows.map((r, i) =>
    `<text x="${xOf(i).toFixed(1)}" y="${Y1 + 15}" class="cx">${esc(r.label)}</text>`).join('');

  let marks = '';
  if (kind === 'bars') {
    const bw = Math.min(band * 0.62, 30);
    marks = rows.map((r, i) => {
      const y = yOf(r.value), h = Math.max(1, Y1 - y);
      const cls = highlight === null ? 'cb' : (i === highlight ? 'cb hot' : 'cb cool');
      return `<rect x="${(xOf(i) - bw / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}"
        height="${h.toFixed(1)}" class="${cls}"/>` +
        (showValues ? `<text x="${xOf(i).toFixed(1)}" y="${(y - 5).toFixed(1)}" class="cv">${esc(nice(r.value))}${esc(unit)}</text>` : '');
    }).join('');
  } else {
    const pts = rows.map((r, i) => `${xOf(i).toFixed(1)},${yOf(r.value).toFixed(1)}`).join(' ');
    marks = `<polyline points="${pts}" class="cl"/>` +
      rows.map((r, i) => `<circle cx="${xOf(i).toFixed(1)}" cy="${yOf(r.value).toFixed(1)}" r="3" class="cd"/>`).join('') +
      (showValues ? rows.map((r, i) =>
        `<text x="${xOf(i).toFixed(1)}" y="${(yOf(r.value) - 8).toFixed(1)}" class="cv">${esc(nice(r.value))}${esc(unit)}</text>`).join('') : '');
  }

  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-hidden="true" preserveAspectRatio="xMidYMid meet">
    ${grid}
    <line x1="${X0}" x2="${X1}" y1="${Y1}" y2="${Y1}" class="ca"/>
    ${marks}
    ${xLabels}
  </svg>`;
}
