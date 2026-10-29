import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { GAMES, DEFAULT_GAME_ID, gameById } from './registry';

describe('game registry', () => {
  beforeEach(() => { setWorkerMode('sync'); installEngineRuntime(); });

  it('hat eindeutige IDs und einen gültigen Default', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(DEFAULT_GAME_ID);
  });

  it('jeder Descriptor baut ein Spiel mit passender Brettgröße', () => {
    for (const g of GAMES) {
      const game = g.factory();
      expect(game.getColumns()).toBe(g.columns);
      expect(game.getRows()).toBe(g.rows);
    }
  });

  it('gameById liefert den Eintrag, sonst den Default', () => {
    expect(gameById('gomoku9x9').id).toBe('gomoku9x9');
    expect(gameById('does-not-exist').id).toBe(DEFAULT_GAME_ID);
  });

  it('jedes Memory-Ziel ist pro Spiel genamespaced', () => {
    for (const g of GAMES) {
      if (g.memory) {
        expect(g.memory.storageId).toBe(`${g.id}.${g.memory.id}`);
        expect(g.memory.key).toBe('agentmemory_1.json');
        expect(g.memory.asset).toBe(`/assets/${g.id}/agentmemory_1.json`);
      }
    }
  });
});
