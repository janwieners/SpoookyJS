import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { setMemoryEnabled, setActiveMemory, resetMemory } from '../agent-memory';
import { createGomoku9x9, createGomoku15x15 } from './gomoku.game';

describe('createGomoku', () => {
  beforeEach(() => {
    setWorkerMode('sync');
    installEngineRuntime();
    // Kein geleaktes Memory aus anderen Specs (sonst liest die Engine fremde Erinnerungsdaten).
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

  it('9x9 baut ein 9×9-Brett im PLACING-Modus, Mensch beginnt', () => {
    const g = createGomoku9x9();
    expect(g.getColumns()).toBe(9);
    expect(g.getRows()).toBe(9);
    g.start();
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
  });

  it('15x15 baut ein 15×15-Brett', () => {
    const g = createGomoku15x15();
    expect(g.getColumns()).toBe(15);
    expect(g.getRows()).toBe(15);
  });

  it('baut ohne Fehler und ist nach dem Start nicht beendet', () => {
    const g = createGomoku9x9();
    g.start();
    expect(g.getState()).not.toBe('END');
  });

  it('Gewinnregel verlangt genau 5 in einer Linie; das Spiel hat 7 Regeln (6 Siege + Unentschieden)', () => {
    const g: any = createGomoku9x9();
    const atoms = g.raw.models.GameRuleAtoms as Array<{ atomFunction: string; atomArguments: any }>;
    // Reihe/Spalte/Diagonale je Spieler = 6 Linien-Atome, alle mit number === 5 (der Gomoku-Unterschied zu TicTacToe).
    const lineAtoms = atoms.filter((a) => typeof a.atomFunction === 'string' && a.atomFunction.includes('Number Of Entities'));
    expect(lineAtoms.length).toBe(6);
    expect(lineAtoms.every((a) => a.atomArguments?.number === 5)).toBe(true);
    // 6 Sieg-Regeln + "Draw If Game Board Is Full".
    expect(g.raw.models.GameRules.length).toBe(7);
  });
});
