// projects/spoooky-app/src/app/agent-memory.spec.ts
import {
  setMemoryEnabled, isMemoryEnabled, preloadMemory, getMemory, gameStatesCount,
  saveMemory, hasStoredMemory, resetMemory, onMemorySaved, idFromFilename, setActiveMemory,
} from './agent-memory';

const MEM = {
  game: 'Tic Tac Toe', metaAgentID: 1,
  bestAgentEnsemble: [{ ID: 1, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 1.0, thinkingTime: 5000, maximumSteps: 5000 }],
  learnModule: { rewards: {}, gameStates: { s1: {}, s2: {} } },
};

describe('agent-memory', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    setActiveMemory('tictactoe.1');
    resetMemory(); // leert auch den modulweiten Cache (Testisolation)
    setMemoryEnabled(false);
    onMemorySaved(null);
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true, json: async () => MEM }));
  });

  it('idFromFilename extrahiert die ID', () => {
    expect(idFromFilename('agentmemory_1.json')).toBe('1');
    expect(idFromFilename('agentmemory_0.json')).toBe('0');
  });

  it('getMemory liefert null, solange Speicher deaktiviert ist', async () => {
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    expect(getMemory('agentmemory_1.json')).toBeNull();
  });

  it('getMemory liefert die gecachten Daten, wenn aktiviert', async () => {
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    expect(isMemoryEnabled()).toBe(true);
    expect(getMemory('agentmemory_1.json')).toEqual(MEM);
    expect(gameStatesCount('agentmemory_1.json')).toBe(2);
  });

  it('localStorage hat Vorrang vor dem Asset', async () => {
    const custom = { ...MEM, learnModule: { rewards: {}, gameStates: { a: {}, b: {}, c: {} } } };
    localStorage.setItem('spoooky.agentmemory.tictactoe.1', JSON.stringify(custom));
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(3);
    expect((globalThis as any).fetch).not.toHaveBeenCalled();
  });

  it('fehlendes Asset -> stiller Fallback, getMemory bleibt null', async () => {
    (globalThis as any).fetch = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    expect(getMemory('agentmemory_1.json')).toBeNull();
  });

  it('saveMemory schreibt nach localStorage, meldet Callback, aktualisiert Cache', async () => {
    let savedId: string | null = null;
    onMemorySaved((id) => { savedId = id; });
    setMemoryEnabled(true);
    const custom = { ...MEM, learnModule: { rewards: {}, gameStates: { x: {}, y: {}, z: {}, w: {} } } };
    saveMemory('agentmemory_1.json', JSON.stringify(custom));
    expect(savedId).toBe('tictactoe.1');
    expect(hasStoredMemory()).toBe(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(4);
  });

  it('resetMemory entfernt die gespeicherte Version', () => {
    localStorage.setItem('spoooky.agentmemory.tictactoe.1', JSON.stringify(MEM));
    expect(hasStoredMemory()).toBe(true);
    resetMemory();
    expect(hasStoredMemory()).toBe(false);
  });
});

describe('agent-memory: per-game namespacing', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    setActiveMemory('tictactoe.1');
    resetMemory();
    setMemoryEnabled(true);
    onMemorySaved(null);
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true, json: async () => ({ learnModule: { gameStates: { a: {} } } }) }));
  });

  it('speichert und liest unter dem aktiven, genamespaceten Schlüssel', async () => {
    setActiveMemory('gomoku9x9.1');
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: { x: {}, y: {} } } }));
    expect(localStorage.getItem('spoooky.agentmemory.gomoku9x9.1')).not.toBeNull();
    expect(localStorage.getItem('spoooky.agentmemory.tictactoe.1')).toBeNull();
    expect(hasStoredMemory()).toBe(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(2);
  });

  it('ein Spiel überschreibt das andere nicht', () => {
    setActiveMemory('tictactoe.1');
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: { t: {} } } }));
    setActiveMemory('gomoku9x9.1');
    expect(hasStoredMemory()).toBe(false);
    setActiveMemory('tictactoe.1');
    expect(hasStoredMemory()).toBe(true);
  });

  it('resetMemory entfernt nur das aktive Ziel', () => {
    setActiveMemory('tictactoe.1');
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: {} } }));
    resetMemory();
    expect(hasStoredMemory()).toBe(false);
  });

  it('ohne aktives Ziel: hasStoredMemory false, Speichern fällt auf die Dateinamen-ID zurück', () => {
    setActiveMemory(null);
    expect(hasStoredMemory()).toBe(false);
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: {} } }));
    expect(localStorage.getItem('spoooky.agentmemory.1')).not.toBeNull();
    expect(hasStoredMemory()).toBe(false);
  });
});
