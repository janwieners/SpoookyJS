import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { setActiveMemory, setMemoryEnabled, resetMemory } from '../agent-memory';
import { createCheckers } from './checkers.game';

describe('createCheckers', () => {
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

  it('baut ein 8×8-Dame-Brett, Mensch beginnt', () => {
    const g = createCheckers();
    expect(g.getColumns()).toBe(8);
    expect(g.getRows()).toBe(8);
    g.start();
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
  });

  it('stellt 24 Steine auf (12 je Spieler)', () => {
    const g: any = createCheckers();
    const grid = g.getGrid();
    let pieces = 0;
    for (const row of grid) {
      for (const cell of row) {
        if (cell.contains && cell.contains.length > 0) { pieces++; }
      }
    }
    expect(pieces).toBe(24);
  });

  it('nutzt das karierte Brettmuster (gridCellBlack/White)', () => {
    const g: any = createCheckers();
    const grid = g.getGrid();
    expect(grid[0][0].view.baseClass).toBe('gridCellWhite');
    expect(grid[0][1].view.baseClass).toBe('gridCellBlack');
  });
});
