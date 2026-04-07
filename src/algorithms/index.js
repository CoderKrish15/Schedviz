export { fcfs } from './fcfs.js';
export { sjf } from './sjf.js';
export { rr } from './rr.js';

export const PROCESS_COLORS = [
  '#00ff41', // matrix green
  '#00d4ff', // cyan
  '#ff6b35', // orange
  '#ff3f96', // pink
  '#ffe600', // yellow
  '#b967ff', // purple
];

export const DEFAULT_PROCESSES = [
  { pid: 'P1', arrival: 0, burst: 5, priority: 2 },
  { pid: 'P2', arrival: 1, burst: 3, priority: 1 },
  { pid: 'P3', arrival: 2, burst: 8, priority: 4 },
  { pid: 'P4', arrival: 3, burst: 2, priority: 3 },
];
