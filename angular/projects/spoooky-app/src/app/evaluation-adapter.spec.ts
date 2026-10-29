import { aggregateDecision, AgentDecision } from './evaluation-adapter';

function dec(results: Array<[string, number, number]>, simCount = 100, simSteps = 500, agentID = 1): AgentDecision {
  return { agentID, simCount, simSteps, results: results.map(([target, visits, wins]) => ({ target, visits, wins })) };
}

describe('aggregateDecision', () => {
  it('mappt target-Labels auf (x,y) für ein 3x3-Brett', () => {
    const ev = aggregateDecision([dec([['a3', 10, 5], ['c1', 20, 18]])], 3, 3)!;
    const a3 = ev.cells.find(c => c.x === 0 && c.y === 0)!;
    const c1 = ev.cells.find(c => c.x === 2 && c.y === 2)!;
    expect(a3.visits).toBe(10);
    expect(c1.visits).toBe(20);
  });

  it('berechnet winRate = wins/visits', () => {
    const ev = aggregateDecision([dec([['b2', 40, 10]])], 3, 3)!;
    expect(ev.cells[0].winRate).toBeCloseTo(0.25);
  });

  it('markiert den Zug mit den meisten Besuchen als chosen', () => {
    const ev = aggregateDecision([dec([['a3', 10, 5], ['c1', 20, 18]])], 3, 3)!;
    expect(ev.cells.find(c => c.x === 2 && c.y === 2)!.chosen).toBe(true);
    expect(ev.cells.find(c => c.x === 0 && c.y === 0)!.chosen).toBe(false);
    expect(ev.stats.chosen).toBe('c1');
    expect(ev.stats.chosenWinRate).toBeCloseTo(0.9);
  });

  it('aggregiert dasselbe Feld über mehrere Agenten (Summe visits/wins)', () => {
    const ev = aggregateDecision([dec([['b2', 10, 4]], 50, 200, 1), dec([['b2', 30, 20]], 50, 200, 2)], 3, 3)!;
    const b2 = ev.cells.find(c => c.x === 1 && c.y === 1)!;
    expect(b2.visits).toBe(40);
    expect(b2.wins).toBe(24);
    expect(ev.stats.simulations).toBe(100);
    expect(ev.stats.steps).toBe(400);
  });

  it('überspringt nicht-parsebare Labels und liefert null, wenn nichts übrig bleibt', () => {
    expect(aggregateDecision([dec([['a2-b3', 5, 1]])], 3, 3)).toBeNull();
    const ev = aggregateDecision([dec([['a3', 5, 1], ['zz', 9, 9]])], 3, 3)!;
    expect(ev.cells.length).toBe(1);
  });

  it('winRate ist 0 bei 0 Besuchen; leere Eingabe -> null', () => {
    const ev = aggregateDecision([dec([['a3', 0, 0]])], 3, 3)!;
    expect(ev.cells[0].winRate).toBe(0);
    expect(aggregateDecision([], 3, 3)).toBeNull();
  });
});
