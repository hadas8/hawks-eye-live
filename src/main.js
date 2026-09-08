// Entry point. Wires the delegated listeners, starts the clock, renders.
import { initActions } from './ui/actions.js';
import { render } from './ui/render.js';
import { startClock } from './ui/clock.js';
import './stations/registry.js';   // registers the station-kind action handlers

initActions(document.getElementById('app'));
startClock();
render();
