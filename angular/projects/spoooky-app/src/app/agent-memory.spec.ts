// projects/spoooky-app/src/app/agent-memory.spec.ts
import {
  setMemoryEnabled, isMemoryEnabled, preloadMemory, getMemory, gameStatesCount,
  saveMemory, hasStoredMemory, resetMemory, onMemorySaved, idFromFilename,
} from './agent-memory';

const MEM = {
  game: 'Tic Tac Toe', metaAgentID: 1,
  bestAgentEnsemble: [{ ID: 1, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 1.0, thinkingTime: 5000, maximumSteps: 5000 }],
  learnModule: { rewards: {}, gameStates: { s1: {}, s2: {} } },
};

describe('agent-memory', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory('1'); // leert auch den modulweiten Cache (Testisolation)
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
    localStorage.setItem('spoooky.agentmemory.1', JSON.stringify(custom));
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
    expect(savedId).toBe('1');
    expect(hasStoredMemory('1')).toBe(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(4);
  });

  it('resetMemory entfernt die gespeicherte Version', () => {
    localStorage.setItem('spoooky.agentmemory.1', JSON.stringify(MEM));
    expect(hasStoredMemory('1')).toBe(true);
    resetMemory('1');
    expect(hasStoredMemory('1')).toBe(false);
  });
});
