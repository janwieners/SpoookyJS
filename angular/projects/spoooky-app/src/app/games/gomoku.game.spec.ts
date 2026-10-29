import { setWorkerMode } from '../engine-runtime';
import { installEngineRuntime } from '../engine-runtime';
import { createGomoku9x9, createGomoku15x15 } from './gomoku.game';

describe('createGomoku', () => {
  beforeEach(() => { setWorkerMode('sync'); installEngineRuntime(); });

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
});
