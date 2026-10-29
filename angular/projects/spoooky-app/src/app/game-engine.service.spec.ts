import { TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { createTicTacToe } from './games/tictactoe.game';
import { setWorkerMode, setAiErrorHandler, setGenerateTree, setAiConfig, setAiDecisionSink } from './engine-runtime';
import { DEFAULT_AI_CONFIG } from './ai-config';
import { setMemoryEnabled, isMemoryEnabled, hasStoredMemory, resetMemory } from './agent-memory';
import { GameEngineService } from './game-engine.service';

const occupied = (board: any[]): number[] => board.map((c) => (c?.image ? 1 : 0));

describe('GameEngineService', () => {
  let svc: GameEngineService;

  beforeEach(() => {
    setWorkerMode('sync');
    setSeed(12345);
    svc = new GameEngineService();
    svc.newGame(createTicTacToe);
  });

  it('startet ein Spiel: nicht beendet, Mensch am Zug, 9 Zellen', () => {
    expect(svc.gameState()).not.toBe('END');
    expect(svc.currentPlayerType()).toBe('HUMAN');
    expect(svc.board().length).toBe(9);
    expect(svc.aiThinking()).toBe(false);
  });

  it('newGame startet mit leerem Protokoll und ohne Fehler', () => {
    expect(svc.log().length).toBe(0);
    expect(svc.error()).toBeNull();
  });

  it('restart setzt Brett und Protokoll zurück', () => {
    svc.cellClicked(1, 1);
    expect(svc.log().length).toBeGreaterThanOrEqual(1);
    svc.restart();
    expect(svc.log().length).toBe(0);
    expect(occupied(svc.board()).reduce((a, b) => a + b, 0)).toBe(0);
    expect(svc.error()).toBeNull();
  });

  it('ein Menschenzug verändert das Brett und lässt aiThinking nicht hängen', () => {
    const before = occupied(svc.board());
    expect(before.reduce((a, b) => a + b, 0)).toBe(0);

    svc.cellClicked(1, 1);

    const after = occupied(svc.board());
    expect(svc.board().length).toBe(9);
    expect(after).not.toEqual(before);
    // Mindestens die Figur des Menschen (die KI zieht ggf. direkt danach).
    expect(after.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(1);
    expect(svc.aiThinking()).toBe(false);
    // Das Spielprotokoll enthält mindestens den Menschenzug als Text.
    expect(svc.log().length).toBeGreaterThanOrEqual(1);
    expect(svc.log().every((m) => typeof m === 'string' && m.length > 0)).toBe(true);
  });

  it('ein Klick auf eine belegte Zelle ändert das Brett nicht', () => {
    svc.cellClicked(0, 0);
    const snapshot = occupied(svc.board());
    expect(snapshot[0]).toBe(1);

    if (svc.currentPlayerType() === 'HUMAN' && svc.gameState() !== 'END') {
      svc.cellClicked(0, 0);
      }
    expect(occupied(svc.board())).toEqual(snapshot);
    expect(svc.aiThinking()).toBe(false);
  });

  it('Mensch (weiß) und KI (schwarz) werden auf unterschiedliche Bilder aufgelöst', () => {
    svc.cellClicked(1, 1);
    const images = svc.board().map((c) => c.image).filter((i): i is string => !!i);
    expect(images.some((i) => i.endsWith('white.png'))).toBe(true);
    expect(images.some((i) => i.endsWith('black.png'))).toBe(true);
  });
});

describe('GameEngineService – evaluation', () => {
  let svc: GameEngineService;
  beforeEach(() => {
    setWorkerMode('sync');
    TestBed.configureTestingModule({});
    svc = TestBed.inject(GameEngineService);
    setSeed(42);
    localStorage.clear();
  });

  it('startet ohne Bewertung und mit sichtbarem Overlay (Default)', () => {
    svc.newGame(createTicTacToe);
    expect(svc.evaluation()).toBeNull();
    expect(svc.showEvaluation()).toBe(true);
  });

  it('setzt nach einem KI-Zug eine Bewertung mit einem gewählten Feld', () => {
    svc.newGame(createTicTacToe);
    svc.cellClicked(0, 0);
    const ev = svc.evaluation();
    expect(ev).not.toBeNull();
    expect(ev!.cells.some(c => c.chosen)).toBe(true);
  });

  it('toggleEvaluation schreibt nach localStorage und newGame setzt die Bewertung zurück', () => {
    svc.newGame(createTicTacToe);
    svc.toggleEvaluation(false);
    expect(svc.showEvaluation()).toBe(false);
    expect(localStorage.getItem('spoooky.showEvaluation')).toBe('false');
    svc.newGame(createTicTacToe);
    expect(svc.evaluation()).toBeNull();
  });
});

describe('GameEngineService Analyse', () => {
  const flush = async () => { for (let i = 0; i < 5; i++) { await Promise.resolve(); } };

  beforeEach(() => {
    setWorkerMode('sync');
    setSeed(42);
    localStorage.clear();
    TestBed.configureTestingModule({});
  });
  afterEach(() => localStorage.clear());

  it('ist standardmäßig aus und analysiert dann nicht', async () => {
    const svc = TestBed.inject(GameEngineService);
    expect(svc.showAnalysis()).toBe(false);
    svc.newGame(createTicTacToe);
    await flush();
    expect(svc.evaluation()).toBeNull();
  });

  it('analysiert die Eröffnungsstellung, wenn die Analyse an ist, ohne zu ziehen', async () => {
    localStorage.setItem('spoooky.showAnalysis', 'true');
    const svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    await flush();
    expect(svc.currentPlayerType()).toBe('HUMAN');
    expect(svc.gameState()).not.toBe('END');
    expect(svc.evaluation()).not.toBeNull();
    expect(svc.board().every((c) => !c.image)).toBe(true);
  });

  it('toggleAnalysis persistiert und löst eine Analyse aus', async () => {
    const svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    svc.toggleAnalysis(true);
    expect(localStorage.getItem('spoooky.showAnalysis')).toBe('true');
    await flush();
    expect(svc.evaluation()).not.toBeNull();
  });

  it('analysiert nach dem Zug des Menschen erneut die neue Stellung', async () => {
    localStorage.setItem('spoooky.showAnalysis', 'true');
    const svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    await flush();
    svc.cellClicked(0, 0);
    await flush();
    expect(svc.currentPlayerType()).toBe('HUMAN');
    const ev = svc.evaluation();
    expect(ev).not.toBeNull();
    // Besetzte Felder dürfen nicht als Kandidaten bewertet werden (Analyse der aktuellen Stellung).
    const occupiedIdx = svc.board().map((c, i) => (c.image ? i : -1)).filter((i) => i >= 0);
    expect(occupiedIdx.length).toBe(2);
    const cols = 3;
    for (const c of ev!.cells) {
      expect(occupiedIdx).not.toContain(c.y * cols + c.x);
    }
  });
});

describe('GameEngineService MCTS-Baum (SP3b)', () => {
  let svc: GameEngineService;
  beforeEach(() => { setWorkerMode('sync'); setSeed(12345); localStorage.removeItem('spoooky.showTree'); svc = new GameEngineService(); svc.newGame(createTicTacToe); });
  afterEach(() => { localStorage.removeItem('spoooky.showTree'); setGenerateTree(false); });

  it('setzt mctsTree aus dem mctsGraph einer KI-Entscheidung, wenn der Baum an ist', () => {
    localStorage.setItem('spoooky.showTree', 'true');
    const s = new GameEngineService();
    expect(s.showTree()).toBe(true);
    s.newGame(createTicTacToe);
    s.cellClicked(0, 0);
    // Sync-Worker: der KI-Zug ist abgeschlossen, generateMctsGraph war an -> Baum vorhanden.
    expect(s.mctsTree()).not.toBeNull();
    expect(s.mctsTree()!.children.length).toBeGreaterThan(0);
  });

  it('erzeugt ohne Baum-Toggle keinen mctsTree', () => {
    const s = new GameEngineService();
    expect(s.showTree()).toBe(false);
    s.newGame(createTicTacToe);
    s.cellClicked(0, 0);
    expect(s.mctsTree()).toBeNull();
  });

  it('toggleTree schaltet das Signal um und persistiert es', () => {
    svc.toggleTree(true);
    expect(svc.showTree()).toBe(true);
    expect(localStorage.getItem('spoooky.showTree')).toBe('true');
    svc.cellClicked(0, 0);
    expect(svc.mctsTree()).not.toBeNull();
  });

  it('setzt mctsTree bei newGame zurück', () => {
    svc.toggleTree(true);
    svc.cellClicked(0, 0);
    expect(svc.mctsTree()).not.toBeNull();
    svc.newGame(createTicTacToe);
    expect(svc.mctsTree()).toBeNull();
  });
});

describe('GameEngineService worker error handling', () => {
  afterEach(() => {
    setWorkerMode('sync');
    delete (globalThis as any).__RealWorker;
  });

  it('ein Fehler im echten Worker setzt error und entsperrt die UI (aiThinking=false)', () => {
    setWorkerMode('sync');
    const svc = new GameEngineService(); // installiert die Shims und registriert den Fehler-Handler
    svc.newGame(createTicTacToe);

    // Gefälschter Browser-Worker, der die registrierten Listener festhält.
    const fakes: Array<{ listeners: Record<string, Array<(e: any) => void>> }> = [];
    class FakeWorker {
      listeners: Record<string, Array<(e: any) => void>> = {};
      constructor() { fakes.push(this); }
      addEventListener(t: string, fn: (e: any) => void) { (this.listeners[t] ??= []).push(fn); }
      postMessage() {}
      terminate() {}
    }
    (globalThis as any).__RealWorker = FakeWorker;
    setWorkerMode('real');
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    try {
      new (globalThis as any).Worker(); // EngineWorker im Modus 'real'
      expect(fakes.length).toBe(1);

      svc.aiThinking.set(true); // simuliert: Anfrage an den Worker ist unterwegs
      expect(svc.error()).toBeNull();

      fakes[0].listeners['error'].forEach((fn) => fn(new Event('error')));

      expect(svc.error()).not.toBeNull();
      expect(svc.aiThinking()).toBe(false);
    } finally {
      consoleSpy.mockRestore();
      setAiErrorHandler(null);
    }
  });
});

describe('GameEngineService: Erinnerung + Lernen', () => {
  const flush = async () => { for (let i = 0; i < 5; i++) { await Promise.resolve(); } };
  const ensembleAsset = () => ({
    game: 'Tic Tac Toe', metaAgentID: 1,
    bestAgentEnsemble: [
      { ID: 1, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 1.0, thinkingTime: 5000, maximumSteps: 5000 },
      { ID: 2, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 0.5, thinkingTime: 5000, maximumSteps: 5000 },
      { ID: 3, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 0, thinkingTime: 5000, maximumSteps: 5000 },
    ],
    learnModule: { rewards: {}, gameStates: {} },
  });

  beforeEach(() => {
    setWorkerMode('sync');
    try { localStorage.clear(); } catch { /* ignore */ }
    setSeed(12345);
    // Asset für den Preload bereitstellen (3-Agenten-Ensemble, 0 gelernte Zustände)
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true, json: async () => ensembleAsset() }));
  });
  afterEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory('1');
    setMemoryEnabled(false);
    setAiConfig(DEFAULT_AI_CONFIG);
    setAiDecisionSink(null);
  });

  it('toggleUseMemory persistiert und aktiviert den Speicher', async () => {
    const svc = new GameEngineService();
    svc.toggleUseMemory(true);
    await flush();
    expect(svc.useMemory()).toBe(true);
    expect(localStorage.getItem('spoooky.useMemory')).toBe('true');
    expect(isMemoryEnabled()).toBe(true);
  });

  it('toggleLearnMode persistiert; neues Spiel aktiviert Lernen auf dem KI-Spieler', () => {
    const svc = new GameEngineService();
    svc.toggleLearnMode(true);
    expect(svc.learnMode()).toBe(true);
    expect(localStorage.getItem('spoooky.learnMode')).toBe('true');
    svc.newGame(createTicTacToe);
    const ai = (svc as any).game.raw.getPlayers().find((p: any) => p.type === 'ARTIFICIAL');
    expect(ai.learningEnabled).toBe(true);
  });

  it('mit aktiver Erinnerung lädt ein neues Spiel das gelernte Ensemble (3 Agenten)', async () => {
    const svc = new GameEngineService();
    svc.toggleUseMemory(true);
    await flush();
    svc.newGame(createTicTacToe);
    const ai = (svc as any).game.raw.getPlayers().find((p: any) => p.type === 'ARTIFICIAL');
    expect(ai.agents.length).toBe(3);
  });

  it('ohne Erinnerung nutzt ein neues Spiel das Standard-Ensemble (Fallback)', () => {
    const svc = new GameEngineService();
    svc.newGame(createTicTacToe);
    const ai = (svc as any).game.raw.getPlayers().find((p: any) => p.type === 'ARTIFICIAL');
    expect(ai.agents.length).toBeGreaterThanOrEqual(1);
    expect(isMemoryEnabled()).toBe(false);
  });

  it('nach einem vollständigen Lern-Spiel liegt eine gespeicherte Erinnerung vor', async () => {
    setAiConfig({ difficulty: 'easy', thinkingTimeMs: 30, uctConstant: 0.9 });  // kurze Züge, damit der Test zügig bleibt
    const svc = new GameEngineService();
    svc.toggleLearnMode(true);
    svc.newGame(createTicTacToe);
    // Mensch zieht jeweils auf die erste freie Zelle; der sync-Worker zieht die KI sofort.
    for (let guard = 0; guard < 9 && svc.gameState() !== 'END'; guard++) {
      const idx = svc.board().findIndex((c) => !c.image);
      if (idx < 0 || svc.currentPlayerType() !== 'HUMAN') { break; }
      svc.cellClicked(idx % 3, Math.floor(idx / 3));
    }
    expect(svc.gameState()).toBe('END');
    await flush();  // der saveAs-Shim liest den Blob asynchron
    expect(hasStoredMemory('1')).toBe(true);  // saveAs-Shim hat exportiert
  }, 20000);

  describe('withConfig-Laufzeiteffekt (respektiere Agenten-UCT)', () => {
    const playOneMove = (svc: GameEngineService): number[] => {
      const seen: number[] = [];
      setAiConfig({ difficulty: 'medium', thinkingTimeMs: 50, uctConstant: 0.9 });
      svc.newGame(createTicTacToe);
      // Sink NACH newGame setzen (überschreibt den Service-Sink), um die uctConstant der Entscheidungen zu erfassen.
      setAiDecisionSink((d) => { if (typeof d.uctConstant === 'number') { seen.push(d.uctConstant); } });
      svc.cellClicked(1, 1);
      return seen;
    };

    it('Erinnerung an: die uctConstant des Ensemble-Agenten bleibt erhalten (nicht die Config)', async () => {
      const svc = new GameEngineService();
      svc.toggleUseMemory(true);
      await flush();
      const seen = playOneMove(svc);
      expect(seen.length).toBeGreaterThan(0);
      expect(seen.some((u) => u !== 0.9)).toBe(true);
      expect(seen.every((u) => [1.0, 0.5, 0].includes(u))).toBe(true);
    });

    it('Erinnerung aus: jede Entscheidung nutzt die uctConstant der Config', () => {
      const svc = new GameEngineService();
      const seen = playOneMove(svc);
      expect(seen.length).toBeGreaterThan(0);
      expect(seen.every((u) => u === 0.9)).toBe(true);
    });
  });
});
