import { Injectable, signal } from '@angular/core';
import { SpooookyGame, PlayerType, Spoooky } from 'spoooky-core';
import { installEngineRuntime, connectNoopViews, setAiDecisionSink, setAiErrorHandler, setGenerateTree, runAnalysis, setRespectAgentTuning } from './engine-runtime';
import { aggregateDecision, AgentDecision, Evaluation } from './evaluation-adapter';
import { toTreeNode, TreeNode } from './mcts-tree-adapter';
import {
  preloadMemory, setMemoryEnabled, gameStatesCount, hasStoredMemory as hasStored,
  exportMemory as exportMem, resetMemory as resetMem, onMemorySaved,
} from './agent-memory';

/** TicTacToe-KI-Spieler (metaAgentID 1); SP4 verallgemeinert das je Spiel. */
const MEMORY_ID = '1';
const MEMORY_KEY = 'agentmemory_1.json';
const MEMORY_ASSET = '/agentmemory_1.json';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private game: SpooookyGame | null = null;

  readonly board = signal<Array<{ image: string | null }>>([]);
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
  readonly memoryStatus = signal<string>('');
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
    if (this.useMemory()) { void this.ensurePreloaded(); }
    this.refreshMemoryStatus();
  }

  private preloaded = false;
  /** Lädt die mitgelieferte Erinnerung in den Cache; die Engine liest sie synchron beim Spielaufbau. */
  private async ensurePreloaded(): Promise<void> {
    if (this.preloaded) { return; }
    await preloadMemory([{ key: MEMORY_KEY, assetUrl: MEMORY_ASSET }]);
    this.preloaded = true;
    this.refreshMemoryStatus();
  }

  private readFlag(k: string, dflt: boolean): boolean {
    try { const v = localStorage.getItem(k); return v === null ? dflt : v === 'true'; } catch { return dflt; }
  }

  private refreshMemoryStatus(): void {
    if (!this.useMemory()) { this.memoryStatus.set('Gelernte KI aus — Standard-Agenten.'); return; }
    const n = gameStatesCount(MEMORY_KEY);
    const src = hasStored(MEMORY_ID) ? 'localStorage' : 'mitgeliefert';
    this.memoryStatus.set(`Gelernte KI an (${src}): ${n} gelernte Spielzustände.`);
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

  exportMemory(): void { exportMem(MEMORY_ID); }

  /**
   * resetMem() verwirft auch den gecachten Asset-Eintrag; daher wird das mitgelieferte Asset neu geladen:
   * "Auf Standard zurücksetzen" muss die mitgelieferte Erinnerung wiederherstellen, nicht auf Standard-Agenten fallen.
   */
  resetMemory(): void {
    resetMem(MEMORY_ID);
    this.preloaded = false;
    if (this.useMemory()) { void this.ensurePreloaded(); }
    this.refreshMemoryStatus();
  }

  hasStoredMemory(): boolean { return hasStored(MEMORY_ID); }

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
    // Resolve each piece's image via the engine (entity INSTANCE id -> view), not by guessing.
    this.board.set(cells.map((cell: any) => ({ image: game.getEntityAt(cell)?.view ?? null })));
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
  }
}
