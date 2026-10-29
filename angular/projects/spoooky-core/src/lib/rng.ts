// Seedbarer RNG. int(min,max) repliziert underscores _.random (inklusive-inklusive).
export interface Rng {
  next(): number;        // [0,1)
  int(min: number, max: number): number;
}

// mulberry32: kleiner, schneller, deterministischer PRNG.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeInt(next: () => number) {
  return (min: number, max: number): number =>
    min + Math.floor(next() * (max - min + 1));
}

export function createRng(seed: number): Rng {
  const next = mulberry32(seed);
  return { next, int: makeInt(next) };
}

// Default-RNG: standardmäßig echter Zufall (Verhalten wie bisher),
// per setSeed() für Tests reproduzierbar.
let _next: () => number = Math.random;
export const defaultRng: Rng = {
  next: () => _next(),
  int: (min, max) => min + Math.floor(_next() * (max - min + 1)),
};
export function setSeed(seed: number): void {
  _next = mulberry32(seed);
}
