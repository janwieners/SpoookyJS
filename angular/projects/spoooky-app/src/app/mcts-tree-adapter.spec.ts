import { toTreeNode } from './mcts-tree-adapter';

const leaf = (name: string, value: number, terminal = false) => ({ ID: name, value, name, terminal, children: [] });

describe('toTreeNode', () => {
  it('parst Label, Besuche (value) und Gewinnrate aus dem name-String', () => {
    const t = toTreeNode({ ID: 'Root', value: 862, name: 'Entscheidungsknoten (Spieler ID 2, 0.240 / 862)', children: [
      leaf('c1 (Spieler ID 1, 0.800 / 500)', 500),
      leaf('a2 (Spieler ID 1, -0.100 / 50)', 50),
    ]})!;
    expect(t.visits).toBe(862);
    expect(t.children.length).toBe(2);
    const c1 = t.children[0];
    expect(c1.label).toBe('c1');
    expect(c1.visits).toBe(500);
    expect(c1.winRate).toBeCloseTo(0.8);
  });

  it('sortiert Kinder absteigend nach Besuchen', () => {
    const t = toTreeNode({ ID: 'Root', value: 10, name: 'Entscheidungsknoten (Spieler ID 2, 0 / 10)', children: [
      leaf('a1 (Spieler ID 1, 0 / 3)', 3), leaf('b1 (Spieler ID 1, 0 / 9)', 9),
    ]})!;
    expect(t.children.map(c => c.visits)).toEqual([9, 3]);
  });

  it('erkennt Terminalknoten und negative Gewinnraten', () => {
    const t = toTreeNode({ ID: 'Root', value: 5, name: 'Entscheidungsknoten (Spieler ID 2, 0 / 5)', children: [
      { ID: 'x', value: 5, terminal: true, name: 'b2 (Terminalknoten - Spieler ID 1 gewinnt. -0.500 / 5)', children: [] },
    ]})!;
    expect(t.children[0].terminal).toBe(true);
    expect(t.children[0].winRate).toBeCloseTo(-0.5);
  });

  it('ist defensiv: null/leer → null; leere Kinder ok', () => {
    expect(toTreeNode(null)).toBeNull();
    const t = toTreeNode({ ID: 'Root', value: 0, name: 'Entscheidungsknoten (Spieler ID 2, 0 / 0)', children: [] })!;
    expect(t.children.length).toBe(0);
  });
});
