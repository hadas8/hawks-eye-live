// Station kind -> the view that renders its interaction.
// A station with no kind, or a kind with no renderer, falls back to the
// "not built yet" panel. Nothing is in that state: all six are built.
//
// `neighbours` (station 6, ארבעה כוכבים, KNN) was removed with its
// station on 2026-09-21. See docs/station-6-neighbours.md.
import { viewTables } from './tables.js';
import { viewCards } from './cards.js';
import { viewQuestions } from './questions.js';
import { viewCharts } from './charts.js';
import { viewBoxes } from './boxes.js';
import { viewForest } from './forest.js';

export const RENDERERS = {
  tables: viewTables,
  cards: viewCards,
  questions: viewQuestions,
  charts: viewCharts,
  boxes: viewBoxes,
  forest: viewForest
};

export const rendererFor = kind => RENDERERS[kind] || null;
