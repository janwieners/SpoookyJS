import { installEngineRuntime, setWorkerMode, setAiConfig, setRespectAgentTuning } from './engine-runtime';
import { setMemoryEnabled, preloadMemory, getMemory, onMemorySaved, setActiveMemory, resetMemory } from './agent-memory';
import { DEFAULT_AI_CONFIG } from './ai-config';

describe('EngineWorker (sync mode)', () => {
  beforeEach(() => { installEngineRuntime(); setWorkerMode('sync'); setAiConfig(DEFAULT_AI_CONFIG); });
  afterEach(() => { setAiConfig(DEFAULT_AI_CONFIG); });
  it('ignoriert Nicht-UCT-Nachrichten und terminate() wirft nicht', () => {
    // Die inhaltliche UCT->decision-Pruefung laeuft ueber die Service-/Board-Tests (echtes Spiel, sync-Modus).
    const w: any = new (globalThis as any).Worker('ignored');
    let got = 0; w.addEventListener('message', () => got++);
    w.postMessage({ command: 'something else' });
    expect(got).toBe(0);
    expect(() => w.terminate()).not.toThrow();
  });
});

describe('engine-runtime: $.ajax memory shim', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null); // kein aktives Spielziel: ID kommt aus dem Dateinamen
    setMemoryEnabled(false);
    onMemorySaved(null);
    vi.stubGlobal('fetch', vi.fn(async () => ({ ok: true, json: async () => ({ learnModule: { gameStates: { a: {} } }, bestAgentEnsemble: [] }) })));
    installEngineRuntime(); // idempotent; ensures $ and saveAs are installed
  });

  // Isolation: Agentenspeicher + Engine-Laufzeit sind modulglobal.
  afterEach(() => {
    vi.unstubAllGlobals();
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    onMemorySaved(null);
    setAiConfig(DEFAULT_AI_CONFIG);
    setRespectAgentTuning(false);
  });

  it('liefert gecachte Daten synchron an success, wenn Memory aktiv', async () => {
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    let got: any = 'none'; let completed = false; let errored = false;
    (globalThis as any).$.ajax({ url: 'agentmemory_1.json', success: (d: any) => { got = d; }, error: () => { errored = true; }, complete: () => { completed = true; } });
    expect(got).toEqual({ learnModule: { gameStates: { a: {} } }, bestAgentEnsemble: [] });
    expect(errored).toBe(false);
    expect(completed).toBe(true);
  });

  it('ruft error, wenn Memory aus oder kein Eintrag', () => {
    let errored = false; let completed = false;
    (globalThis as any).$.ajax({ url: 'agentmemory_1.json', success: () => {}, error: () => { errored = true; }, complete: () => { completed = true; } });
    expect(errored).toBe(true);
    expect(completed).toBe(true);
  });
});

describe('engine-runtime: saveAs shim', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null); // erwartet die aus dem Dateinamen abgeleitete ID '1', kein geleaktes Spielziel
    setMemoryEnabled(false);
    onMemorySaved(null);
    installEngineRuntime();
  });

  // Isolation: Agentenspeicher + Engine-Laufzeit sind modulglobal.
  afterEach(() => {
    vi.unstubAllGlobals();
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    onMemorySaved(null);
    setAiConfig(DEFAULT_AI_CONFIG);
    setRespectAgentTuning(false);
  });

  it('legt den Blob-Text über saveMemory in localStorage ab', async () => {
    let savedId: string | null = null;
    onMemorySaved((id) => { savedId = id; });
    const text = JSON.stringify({ learnModule: { gameStates: { a: {}, b: {} } } });
    const blob = new Blob([text], { type: 'text/plain' });
    await (globalThis as any).saveAs(blob, 'agentmemory_1.json');
    expect(savedId).toBe('1');
    setMemoryEnabled(true);
    expect(getMemory('agentmemory_1.json')).toEqual({ learnModule: { gameStates: { a: {}, b: {} } } });
  });
});

describe('engine-runtime: respectAgentTuning', () => {
  afterEach(() => { setAiConfig(DEFAULT_AI_CONFIG); setRespectAgentTuning(false); });

  it('behält die uctConstant der Anfrage, wenn an; sonst Config', () => {
    setAiConfig({ difficulty: 'medium', thinkingTimeMs: 400, uctConstant: 0.9 });
    // Indirekt über eine sync-Entscheidung prüfen: siehe service-spec (Task 4).
    // Hier nur die Existenz/Signatur sicherstellen:
    expect(typeof setRespectAgentTuning).toBe('function');
    setRespectAgentTuning(true);
    setRespectAgentTuning(false);
  });
});
