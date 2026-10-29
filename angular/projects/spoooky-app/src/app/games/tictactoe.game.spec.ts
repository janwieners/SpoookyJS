import { setSeed } from 'spoooky-core';
import { createTicTacToe } from './tictactoe.game';
import { installEngineTestEnv, stubLegacyViewScopes, uninstallEngineTestEnv } from './engine-test-env';

type Move = [number, number];

function newGame(seed: number) {
  setSeed(seed);
  const g = createTicTacToe();
  stubLegacyViewScopes(g.raw);
  g.start();
  return g;
}

// Brett als Text (Zeilen von oben nach unten): '.' leer, sonst Spieler-ID der Figur.
function boardSignature(g: ReturnType<typeof newGame>): string {
  return g.getGrid()
    .map((row: any[]) => row.map((c) => (c.contains?.length ? String(c.contains[c.contains.length - 1].playerID) : '.')).join(''))
    .join('/');
}

function play(seed: number, moves: Move[]) {
  const g = newGame(seed);
  for (const [x, y] of moves) {
    if (g.getState() === 'END') { break; }
    if (g.getCurrentPlayerType() === 'HUMAN') { g.clickCell(x, y); }
  }
  return g;
}

describe('TicTacToe Charakterisierung', () => {
  beforeAll(() => installEngineTestEnv());
  afterAll(() => uninstallEngineTestEnv());

  it('definiert alle Spielregeln (6 Gewinnbedingungen + Unentschieden)', () => {
    const g = createTicTacToe();
    const names = g.raw.models.GameRules.map((r: any) => r.name);
    expect(names).toEqual([
      'Player 1 has three entities in a row',
      'Player 1 has three entities in a column',
      'Player 1 has three entities diagonally',
      'Player 2 has three entities in a row',
      'Player 2 has three entities in a column',
      'Player 2 has three entities diagonally',
      'Draw If Game Board Is Full',
    ]);
  });

  it('startet im INGAME-Zustand mit Mensch am Zug', () => {
    const g = newGame(12345);
    expect(g.getState()).not.toBe('END');
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
    expect(g.getRows()).toBe(3);
    expect(g.getColumns()).toBe(3);
  });

  it('terminiert mit gültigem Endzustand, wenn der Mensch stur a1,b1,c1 … spielt (Invariante)', () => {
    const g = play(12345, [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]]);
    // Invarianten: kein Absturz, Spiel terminiert, Endzustand ist END.
    expect(g.getState()).toBe('END');
    // Golden Master (stabil dank Seed + virtueller UCT-Uhr): die KI (Spieler 2, ID 1) gewinnt
    // mit einer vollen Spalte; der Mensch (ID 0) hat nur drei Figuren.
    expect(g.raw.models.winnerID).toBe(1);
    expect(boardSignature(g)).toBe('001/0.1/..1');
  });

  it('ist bei festem Seed reproduzierbar (gleiche Zugfolge → gleicher Endzustand)', () => {
    const moves: Move[] = [[0,0],[1,1],[2,2],[0,1],[0,2]];
    const a = play(777, moves);
    const b = play(777, moves);
    expect(a.getState()).toBe(b.getState());
    expect(boardSignature(a)).toBe(boardSignature(b));
    expect(a.raw.models.winnerID).toBe(b.raw.models.winnerID);
    expect(a.getState()).toBe('END');
  });
});
