import { installEngineRuntime, setWorkerMode, setAiConfig } from './engine-runtime';
import { DEFAULT_AI_CONFIG } from './ai-config';

describe('EngineWorker (sync mode)', () => {
  beforeEach(() => { installEngineRuntime(); setWorkerMode('sync'); setAiConfig(DEFAULT_AI_CONFIG); });
  it('ignoriert Nicht-UCT-Nachrichten und terminate() wirft nicht', () => {
    // Die inhaltliche UCT->decision-Pruefung laeuft ueber die Service-/Board-Tests (echtes Spiel, sync-Modus).
    const w: any = new (globalThis as any).Worker('ignored');
    let got = 0; w.addEventListener('message', () => got++);
    w.postMessage({ command: 'something else' });
    expect(got).toBe(0);
    expect(() => w.terminate()).not.toThrow();
  });
});
