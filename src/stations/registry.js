// Station kind -> the view that renders its interaction.
// A station with no kind, or a kind with no renderer, falls back to the
// "not built yet" panel. Stations 2 to 7 are deliberately in that state.
import { viewTables } from './tables.js';
import { viewCards } from './cards.js';

export const RENDERERS = {
  tables: viewTables,
  cards: viewCards
};

export const rendererFor = kind => RENDERERS[kind] || null;
