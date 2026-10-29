/*
 * Public API Surface of spoooky-core
 */

export { Spoooky } from './lib/engine';
export { createRng, defaultRng, setSeed } from './lib/rng';
export type { Rng } from './lib/rng';
export { SpooookyGame } from './lib/facade';
export type { PlayerType } from './lib/facade';
