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
//   area        fills under a line, so a shallow climb reads as a mass.
//   arrow       draws a straight annotation from one category to another,
//               asserting a trend the points in between contradict.
//   refLine     an honest device, not a distortion: a labelled rule at a
//               value, so the reader can see the data against its mean.
//
// RTL throughout: category index 0 sits at the RIGHT of the plot and the
// value axis is on the right, which is where a Hebrew reader starts.

import { esc } from './text.js';

const W = 340, H = 210;
const PAD = { top: 16, right: 52, bottom: 32, left: 12 };
const X0 = PAD.left, X1 = W - PAD.right;          // plot, right edge = first category
const Y0 = PAD.top, Y1 = H - PAD.bottom;

const nice = n => (Number.isInteger(n) ? String(n) : n.toFixed(1));

// Four gridlines from floor to ceiling, on round-ish numbers.
function ticks(floor, ceil) {
  const step = (ceil - floor) / 4;
  return [0, 1, 2, 3, 4].map(i => floor + step * i);
}

// `hue` is a class, h1..h3, set by the envelope rather than by the chart:
// both drawings of one data set share it, so a pair reads as a pair. It
// must never track which of the two is honest.
export function renderChart(spec, hue = '') {
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
      // A 1px floor keeps a very small value visible, but it must not
      // invent one: envelope ג׳ asks a group to COUNT incidents across
      // twelve months, nine of which are zero, and a stub on each of those
      // is nine incidents that did not happen. Zero draws nothing.
      const y = yOf(r.value), raw = Y1 - y, h = raw < 0.5 ? 0 : Math.max(1, raw);
      // Only the highlighted bar changes. Dimming the others turns a chart
      // with misleading emphasis into one that looks broken, which is a
      // different and much cruder trick than the source's.
      const cls = i === highlight ? 'cb hot' : 'cb';
      return `<rect x="${(xOf(i) - bw / 2).toFixed(1)}" y="${y.toFixed(1)}" width="${bw.toFixed(1)}"
        height="${h.toFixed(1)}" class="${cls}"/>` +
        (showValues ? `<text x="${xOf(i).toFixed(1)}" y="${(y - 5).toFixed(1)}" class="cv">${esc(nice(r.value))}${esc(unit)}</text>` : '');
    }).join('');
  } else {
    const pts = rows.map((r, i) => `${xOf(i).toFixed(1)},${yOf(r.value).toFixed(1)}`).join(' ');
    const fill = spec.area
      ? `<polygon points="${xOf(0).toFixed(1)},${Y1} ${pts} ${xOf(rows.length - 1).toFixed(1)},${Y1}" class="cf"/>`
      : '';
    marks = fill + `<polyline points="${pts}" class="cl"/>` +
      rows.map((r, i) => `<circle cx="${xOf(i).toFixed(1)}" cy="${yOf(r.value).toFixed(1)}" r="3" class="cd"/>`).join('') +
      (showValues ? rows.map((r, i) =>
        `<text x="${xOf(i).toFixed(1)}" y="${(yOf(r.value) - 8).toFixed(1)}" class="cv">${esc(nice(r.value))}${esc(unit)}</text>`).join('') : '');
  }

  // direction:ltr inside the SVG so text-anchor means what it says. The
  // right-to-left reading order is produced by xOf() putting category 0 on
  // the right, not by the document's direction leaking in here.
  // An asserted trend, drawn over data that does not support it.
  const arrow = spec.arrow ? (() => {
    const { from, to } = spec.arrow;
    const [x1, y1] = [xOf(from), yOf(rows[from].value)];
    const [x2, y2] = [xOf(to), yOf(rows[to].value)];
    const a = Math.atan2(y2 - y1, x2 - x1), h = 7;
    const head = [
      [x2, y2],
      [x2 - h * Math.cos(a - 0.4), y2 - h * Math.sin(a - 0.4)],
      [x2 - h * Math.cos(a + 0.4), y2 - h * Math.sin(a + 0.4)]
    ].map(pt => pt.map(v => v.toFixed(1)).join(',')).join(' ');
    return `<line x1="${x1.toFixed(1)}" y1="${y1.toFixed(1)}" x2="${x2.toFixed(1)}" y2="${y2.toFixed(1)}" class="cr"/>
      <polygon points="${head}" class="crh"/>`;
  })() : '';

  // A labelled rule at a value — the one honest annotation here.
  const ref = spec.refLine ? `
    <line x1="${X0}" x2="${X1}" y1="${yOf(spec.refLine.value).toFixed(1)}"
      y2="${yOf(spec.refLine.value).toFixed(1)}" class="cref"/>
    <text x="${X1 - 4}" y="${(yOf(spec.refLine.value) - 5).toFixed(1)}" class="cv creft"
      text-anchor="end">${esc(spec.refLine.label)}</text>` : '';

  return `<svg class="chart ${hue}" viewBox="0 0 ${W} ${H}" role="img" aria-hidden="true"
    preserveAspectRatio="xMidYMid meet" style="direction:ltr">
    ${grid}
    <line x1="${X0}" x2="${X1}" y1="${Y1}" y2="${Y1}" class="ca"/>
    ${marks}
    ${ref}
    ${arrow}
    ${xLabels}
  </svg>`;
}
