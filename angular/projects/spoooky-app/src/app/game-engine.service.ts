import { Injectable, signal } from '@angular/core';
import { SpooookyGame, PlayerType, Spoooky } from 'spoooky-core';
import { installEngineRuntime, connectNoopViews, setAiDecisionSink, setAiErrorHandler, setGenerateTree, runAnalysis, setRespectAgentTuning } from './engine-runtime';
import { aggregateDecision, AgentDecision, Evaluation } from './evaluation-adapter';
import { toTreeNode, TreeNode } from './mcts-tree-adapter';
import {
  preloadMemory, setMemoryEnabled, gameStatesCount, setActiveMemory, hasStoredMemory as hasStored,
  exportMemory as exportMem, resetMemory as resetMem, onMemorySaved,
} from './agent-memory';
import { GameDescriptor, gameById, DEFAULT_GAME_ID } from './games/registry';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private game: SpooookyGame | null = null;

  readonly board = signal<Array<{ image: string | null; baseClass: string; cellClass: string }>>([]);
  readonly currentPlayerType = signal<PlayerType>('HUMAN');
  readonly gameState = signal<string>('INGAME');
  readonly log = signal<string[]>([]);
  readonly aiThinking = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  readonly evaluation = signal<Evaluation | null>(null);
  readonly showEvaluation = signal<boolean>(this.readShowEvaluation());
  readonly showAnalysis = signal<boolean>(this.readShowAnalysis());
  readonly mctsTree = signal<TreeNode | null>(null);
  readonly showTree = signal<boolean>(this.readShowTree());
  readonly useMemory = signal<boolean>(this.readFlag('spoooky.useMemory', false));
  readonly learnMode = signal<boolean>(this.readFlag('spoooky.learnMode', false));
  readonly statusText = signal<string>('');
  readonly memoryStatus = signal<string>('');
  /** Aktives Spiel (persistiert); Brettgröße kommt aus der Engine (newGame); hasMemory = Spiel hat ein Memory-Ziel. */
  readonly activeGameId = signal<string>(this.readActiveGame());
  readonly columns = signal<number>(3);
  readonly rows = signal<number>(3);
  readonly hasMemory = signal<boolean>(true);
  private active: GameDescriptor = gameById(this.activeGameId());
  /** Wird bei jeder echten Stellungsänderung erhöht; verwirft veraltete/doppelte Analysen. */
  private analysisToken = 0;
  private analysisStartedFor = -1;
  private decisionBuffer: AgentDecision[] = [];
  private lastFactory: (() => SpooookyGame) | null = null;

  constructor() {
    installEngineRuntime();
    setGenerateTree(this.showTree());
    setAiDecisionSink((d) => this.decisionBuffer.push(d));
    setAiErrorHandler(() => {
      this.error.set('Die KI-Berechnung ist fehlgeschlagen. Bitte starte ein neues Spiel.');
      this.aiThinking.set(false);
    });
    setMemoryEnabled(this.useMemory());
    setRespectAgentTuning(this.useMemory());
    onMemorySaved(() => this.refreshMemoryStatus());
    this.applyActiveMemory();
    this.columns.set(this.active.columns);
    this.rows.set(this.active.rows);
    if (this.useMemory()) { void this.ensurePreloaded(); }
    this.refreshMemoryStatus();
  }

  private preloaded = false;
  private preloading: Promise<void> | null = null;

  private readActiveGame(): string {
    try { return localStorage.getItem('spoooky.activeGame') ?? DEFAULT_GAME_ID; } catch { return DEFAULT_GAME_ID; }
  }

  /** Übernimmt das aktive Spiel: Descriptor, hasMemory und das aktive localStorage-Ziel des Agentenspeichers. */
  private applyActiveMemory(): void {
    this.active = gameById(this.activeGameId());
    this.hasMemory.set(!!this.active.memory);
    setActiveMemory(this.active.memory?.storageId ?? null);
  }

  /** Lädt die mitgelieferte Erinnerung des aktiven Spiels in den Cache; die Engine liest sie synchron beim Spielaufbau. */
  private ensurePreloaded(): Promise<void> {
    const target = this.active.memory;
    if (!target) { this.preloaded = true; this.preloading = null; this.refreshMemoryStatus(); return Promise.resolve(); }
    if (this.preloaded) { return Promise.resolve(); }
    if (this.preloading) { return this.preloading; }
    const p: Promise<void> = preloadMemory([{ key: target.key, assetUrl: target.asset }]).then(() => {
      if (this.preloading !== p) { return; }  // ein neueres Vorladen hat dieses abgelöst
      this.preloaded = true;
      this.preloading = null;
      this.refreshMemoryStatus();
    });
    this.preloading = p;
    return p;
  }

  /** Löst auf, sobald ein laufendes Vorladen der Erinnerung fertig ist (sofort, wenn keins läuft). */
  whenMemoryReady(): Promise<void> { return this.preloading ?? Promise.resolve(); }

  private readFlag(k: string, dflt: boolean): boolean {
    try { const v = localStorage.getItem(k); return v === null ? dflt : v === 'true'; } catch { return dflt; }
  }

  private refreshMemoryStatus(): void {
    if (!this.active.memory) { this.memoryStatus.set('Dieses Spiel hat keine gelernte KI.'); return; }
    if (!this.useMemory()) { this.memoryStatus.set('Gelernte KI aus — Standard-Agenten.'); return; }
    const n = gameStatesCount(this.active.memory.key);
    const src = hasStored() ? 'localStorage' : 'mitgeliefert';
    this.memoryStatus.set(`Gelernte KI an (${src}): ${n} gelernte Spielzustände.`);
  }

  /**
   * Wechselt das Spiel: Memory-Ziel umstellen, Cache für das neue Spiel neu vorladen
   * (alle Spiele teilen den Cache-Key agentmemory_1.json) und erst danach das Spiel bauen.
   */
  selectGame(id: string): Promise<void> {
    this.activeGameId.set(id);
    try { localStorage.setItem('spoooky.activeGame', id); } catch { /* ignore */ }
    this.applyActiveMemory();
    this.preloaded = false;
    this.preloading = null;
    if (this.useMemory()) { void this.ensurePreloaded(); }
    return this.whenMemoryReady().then(() => this.newGame(this.active.factory));
  }

  toggleUseMemory(on: boolean): void {
    this.useMemory.set(on);
    setMemoryEnabled(on);
    setRespectAgentTuning(on);
    try { localStorage.setItem('spoooky.useMemory', String(on)); } catch { /* ignore */ }
    if (on) { void this.ensurePreloaded(); } else { this.refreshMemoryStatus(); }
  }

  toggleLearnMode(on: boolean): void {
    this.learnMode.set(on);
    try { localStorage.setItem('spoooky.learnMode', String(on)); } catch { /* ignore */ }
  }

  exportMemory(): void { exportMem(); }

  /**
   * resetMem() verwirft auch den gecachten Asset-Eintrag; daher wird das mitgelieferte Asset neu geladen:
   * "Auf Standard zurücksetzen" muss die mitgelieferte Erinnerung wiederherstellen, nicht auf Standard-Agenten fallen.
   */
  resetMemory(): void {
    resetMem();
    this.preloaded = false;
    this.preloading = null;
    if (this.useMemory()) { void this.ensurePreloaded(); }
    this.refreshMemoryStatus();
  }

  hasStoredMemory(): boolean { return hasStored(); }

  newGame(factory: () => SpooookyGame): void {
    this.lastFactory = factory;
    this.decisionBuffer = [];
    this.evaluation.set(null);
    this.mctsTree.set(null);
    this.analysisToken++;
    // The engine keeps its logs in global singletons; start every game with clean logs.
    const gp = (Spoooky as any)?.GameProcess?.messages;
    if (Array.isArray(gp)) { gp.length = 0; }
    const al = (Spoooky as any)?.AgentLog?.messages;
    if (Array.isArray(al)) { al.length = 0; }
    this.error.set(null);
    const game = factory();
    this.game = game;
    this.columns.set(game.getColumns());
    this.rows.set(game.getRows());
    if (this.learnMode()) { game.enableLearning(); }
    this.refreshMemoryStatus();
    connectNoopViews(game.raw);
    game.connectView(() => this.sync());
    game.start();
    this.sync();
  }

  restart(): void {
    if (this.lastFactory) { this.newGame(this.lastFactory); }
  }

  cellClicked(x: number, y: number): void {
    const game = this.game;
    if (!game || this.gameState() === 'END' || game.getCurrentPlayerType() !== 'HUMAN') { return; }
    this.error.set(null);
    this.analysisToken++;
    try { game.clickCell(x, y); }
    catch (e) {
      this.error.set('Ein Fehler ist aufgetreten. Bitte starte ein neues Spiel.');
      console.error(e);
    }
    this.sync();
  }

  toggleEvaluation(on: boolean): void {
    this.showEvaluation.set(on);
    try { localStorage.setItem('spoooky.showEvaluation', String(on)); } catch { /* ignore */ }
  }

  toggleAnalysis(on: boolean): void {
    this.showAnalysis.set(on);
    try { localStorage.setItem('spoooky.showAnalysis', String(on)); } catch { /* ignore */ }
    if (on) { void this.analyzeIfEnabled(); }
  }

  toggleTree(on: boolean): void {
    this.showTree.set(on);
    setGenerateTree(on);
    try { localStorage.setItem('spoooky.showTree', String(on)); } catch { /* ignore */ }
  }

  private readShowTree(): boolean {
    try { return localStorage.getItem('spoooky.showTree') === 'true'; } catch { return false; }
  }

  private readShowAnalysis(): boolean {
    try { return localStorage.getItem('spoooky.showAnalysis') === 'true'; } catch { return false; }
  }

  /** Bewertet die aktuelle Stellung des Menschen ("bester Zug für dich"), ohne zu ziehen. */
  private async analyzeIfEnabled(): Promise<void> {
    const game = this.game;
    if (!game || !this.showAnalysis()) { return; }
    if (this.gameState() === 'END' || game.getCurrentPlayerType() !== 'HUMAN') { return; }
    const token = this.analysisToken;
    if (this.analysisStartedFor === token) { return; }
    this.analysisStartedFor = token;
    let dec: AgentDecision | null = null;
    try { dec = await runAnalysis(game.serialize(), 'ALL MOVES'); }
    catch (e) { console.error(e); return; }
    if (!dec || token !== this.analysisToken || game !== this.game) { return; }
    if (this.gameState() === 'END' || game.getCurrentPlayerType() !== 'HUMAN' || !this.showAnalysis()) { return; }
    const ev = aggregateDecision([dec], game.getColumns(), game.getRows());
    if (ev) { this.evaluation.set(ev); }
  }

  private readShowEvaluation(): boolean {
    try { return localStorage.getItem('spoooky.showEvaluation') !== 'false'; } catch { return true; }
  }

  private applyEvaluation(): void {
    const game = this.game;
    if (!game || this.decisionBuffer.length === 0) { return; }
    const ev = aggregateDecision(this.decisionBuffer, game.getColumns(), game.getRows());
    // Baum des primären Agenten: erste gepufferte Entscheidung mit nicht-leerem mctsGraph (vor dem Leeren des Buffers).
    const withTree = this.decisionBuffer.find((d) => (d.mctsGraph as any)?.children);
    if (withTree) { this.mctsTree.set(toTreeNode(withTree.mctsGraph as any)); }
    this.decisionBuffer = [];
    if (ev) { this.evaluation.set(ev); }
  }

  private sync(): void {
    const game = this.game;
    if (!game) { return; }
    // GameGrid is an array of ROWS (grid[y][x]); expose a flat, row-major cell array
    // (index = y * columns + x) so the board component can render it directly.
    const grid = game.getGrid();
    const cells = Array.isArray(grid) ? grid.flat() : [];
    // Bild (Entity-INSTANZ-id -> view), Brettquadrat-Klasse und Highlight-Klasse je Zelle via Facade.
    this.board.set(cells.map((cell: any) => game.cellView(cell)));
    this.currentPlayerType.set(game.getCurrentPlayerType());
    this.gameState.set(game.getState());
    const msgs = (Spoooky as any)?.GameProcess?.messages;
    // Entries are objects ({ message, id, type }); the log signal exposes just the text.
    if (Array.isArray(msgs)) { this.log.set(msgs.map((m: any) => (typeof m === 'string' ? m : String(m?.message ?? '')))); }
    // Sync worker: the AI move completes inside clickCell, so the turn is already HUMAN here.
    // Async worker: clickCell returns while it is ARTIFICIAL's turn; the worker callback later
    // triggers refreshView -> sync(), which then sees HUMAN/END, clears the flag and applies the decision.
    const aiTurn = this.gameState() !== 'END' && game.getCurrentPlayerType() === 'ARTIFICIAL';
    this.aiThinking.set(aiTurn);
    if (!aiTurn) {
      this.applyEvaluation();
      void this.analyzeIfEnabled();
    }
    this.refreshStatus();
  }

  private refreshStatus(): void {
    if (this.gameState() === 'END') { this.statusText.set('Spiel beendet.'); return; }
    this.statusText.set(this.currentPlayerType() === 'ARTIFICIAL' ? 'KI denkt …' : 'Du bist am Zug.');
  }
}
