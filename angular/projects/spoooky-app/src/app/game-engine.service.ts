import { Injectable, signal } from '@angular/core';
import { SpooookyGame, PlayerType, Spoooky } from 'spoooky-core';
import { installEngineRuntime, connectNoopViews } from './engine-runtime';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private game: SpooookyGame | null = null;

  readonly board = signal<Array<{ image: string | null }>>([]);
  readonly currentPlayerType = signal<PlayerType>('HUMAN');
  readonly gameState = signal<string>('INGAME');
  readonly log = signal<string[]>([]);
  readonly aiThinking = signal<boolean>(false);
  readonly error = signal<string | null>(null);
  private lastFactory: (() => SpooookyGame) | null = null;

  constructor() { installEngineRuntime(); }

  newGame(factory: () => SpooookyGame): void {
    this.lastFactory = factory;
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
    // AI runs synchronously inside clickCell (~300ms); defer so the overlay can paint.
    this.error.set(null);
    this.aiThinking.set(true);
    setTimeout(() => {
      try { game.clickCell(x, y); }
      catch (e) {
        this.error.set('Ein Fehler ist aufgetreten. Bitte starte ein neues Spiel.');
        console.error(e);
      }
      finally { this.sync(); this.aiThinking.set(false); }
    }, 0);
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
  }
}
