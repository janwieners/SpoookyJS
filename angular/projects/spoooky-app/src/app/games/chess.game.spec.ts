import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { setActiveMemory, setMemoryEnabled, resetMemory } from '../agent-memory';
import { createChess } from './chess.game';

describe('createChess', () => {
  beforeEach(() => {
    setWorkerMode('sync');
    installEngineRuntime();
    // Kein geleaktes Memory aus anderen Specs.
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    try { localStorage.clear(); } catch { /* ignore */ }
  });
  afterEach(() => {
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    try { localStorage.clear(); } catch { /* ignore */ }
  });

  it('baut ein 8×8-Schachbrett, Mensch (Weiß) beginnt', () => {
    const g = createChess();
    expect(g.getColumns()).toBe(8);
    expect(g.getRows()).toBe(8);
    g.start();
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
  });

  it('stellt 32 Figuren auf (16 je Spieler)', () => {
    const g: any = createChess();
    let n = 0;
    for (const row of g.getGrid()) { for (const c of row) { if (c.contains && c.contains.length) { n++; } } }
    expect(n).toBe(32);
  });

  it('nutzt das karierte Brettmuster', () => {
    const g: any = createChess();
    const grid = g.getGrid();
    expect(grid[0][0].view.baseClass).toBe('gridCellWhite');
    expect(grid[0][1].view.baseClass).toBe('gridCellBlack');
  });
});
