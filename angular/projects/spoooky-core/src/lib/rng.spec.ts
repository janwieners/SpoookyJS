import { createRng, defaultRng, setSeed } from './rng';

describe('rng', () => {
  it('ist bei gleichem Seed deterministisch', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, () => a.int(0, 100));
    const seqB = Array.from({ length: 5 }, () => b.int(0, 100));
    expect(seqA).toEqual(seqB);
  });

  it('int(min,max) liegt inklusive in den Grenzen', () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.int(2, 5);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(5);
      expect(Number.isInteger(v)).toBe(true);
    }
  });

  it('int(n,n) liefert n', () => {
    expect(createRng(1).int(3, 3)).toBe(3);
  });

  it('trifft über viele Ziehungen beide Grenzen 0 und 1', () => {
    const r = createRng(123);
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) { seen.add(r.int(0, 1)); }
    expect(seen.has(0)).toBe(true);
    expect(seen.has(1)).toBe(true);
  });

  it('setSeed macht defaultRng reproduzierbar', () => {
    setSeed(9); const x = defaultRng.int(0, 1_000_000);
    setSeed(9); const y = defaultRng.int(0, 1_000_000);
    expect(x).toBe(y);
  });
});
