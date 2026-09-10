// Station kind -> the view that renders its interaction.
// A station with no kind, or a kind with no renderer, falls back to the
// "not built yet" panel. Stations 2 to 7 are deliberately in that state.
import { viewTables } from './tables.js';
import { viewCards } from './cards.js';
import { viewQuestions } from './questions.js';
import { viewCharts } from './charts.js';
import { viewBoxes } from './boxes.js';
import { viewNeighbours } from './neighbours.js';
import { viewForest } from './forest.js';

export const RENDERERS = {
  tables: viewTables,
  cards: viewCards,
  questions: viewQuestions,
  charts: viewCharts,
  boxes: viewBoxes,
  neighbours: viewNeighbours,
  forest: viewForest
};

export const rendererFor = kind => RENDERERS[kind] || null;
