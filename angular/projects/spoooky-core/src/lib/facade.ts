import { Spoooky } from './engine';

export type PlayerType = 'HUMAN' | 'ARTIFICIAL';

// Dünne, typisierte Hülle um eine Engine-Game-Instanz.
export class SpooookyGame {
  constructor(public readonly raw: any) {}

  connectView(listener: () => void): void { this.raw.connectView(listener); }
  start(): void { this.raw.pseudoLoop(); }
  clickCell(x: number, y: number): void { this.raw.loop(false, x, y); }

  getGrid(): any { return this.raw.models.GameGrid; }
  getRows(): number { return this.raw.gameWorld.getRows(); }
  getColumns(): number { return this.raw.gameWorld.getColumns(); }
  getState(): string { return this.raw.getGameState(); }
  getCurrentPlayerType(): PlayerType { return this.raw.getCurrentPlayerType(); }
  serialize(): string { return this.raw.stringifyModels(); }

  /** Aktiviert das Lernen auf allen künstlichen Spielern (SP3c). */
  enableLearning(): void {
    for (const p of this.raw.getPlayers()) {
      if (p.type === 'ARTIFICIAL') { p.enableLearning(); }
    }
  }

  getEntityAt(cell: any): { name: string; view: any } | null {
    if (!cell.contains || cell.contains.length === 0) { return null; }
    const ref = cell.contains[cell.contains.length - 1];
    const entity = this.raw.getPlayerWithID(ref.playerID).getEntityWithID(ref.entityID);
    return { name: entity.getName(), view: entity.getView() };
  }
}
