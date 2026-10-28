import { Injectable, signal } from '@angular/core';
import { SpooookyGame, PlayerType, Spoooky } from 'spoooky-core';
import { installEngineRuntime, connectNoopViews, setAiDecisionSink } from './engine-runtime';
import { aggregateDecision, AgentDecision, Evaluation } from './evaluation-adapter';

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
  private decisionBuffer: AgentDecision[] = [];
  private lastFactory: (() => SpooookyGame) | null = null;

  constructor() {
    installEngineRuntime();
    setAiDecisionSink((d) => this.decisionBuffer.push(d));
  }

  newGame(factory: () => SpooookyGame): void {
    this.lastFactory = factory;
    this.decisionBuffer = [];
    this.evaluation.set(null);
    // The engine keeps its logs in global singletons; start every game with clean logs.
    const gp = (Spoooky as any)?.GameProcess?.messages;
    if (Array.isArray(gp)) { gp.length = 0; }
    const al = (Spoooky as any)?.AgentLog?.messages;
    if (Array.isArray(al)) { al.length = 0; }
    this.error.set(null);
    const game = factory();
    this.game = game;
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

  private readShowEvaluation(): boolean {
    try { return localStorage.getItem('spoooky.showEvaluation') !== 'false'; } catch { return true; }
  }

  private applyEvaluation(): void {
    const game = this.game;
    if (!game || this.decisionBuffer.length === 0) { return; }
    const ev = aggregateDecision(this.decisionBuffer, game.getColumns(), game.getRows());
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
    if (!aiTurn) { this.applyEvaluation(); }
  }
}
