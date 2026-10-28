import { Component, computed, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-board',
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly engine = inject(GameEngineService);
  readonly cells = computed(() => this.engine.board());
  readonly aiThinking = this.engine.aiThinking;
  readonly columns = 3;

  /** Board is a flat row-major array; cells carry no x/y, so derive them from the index. */
  onCellClick(index: number): void {
    const x = index % this.columns;
    const y = Math.floor(index / this.columns);
    this.engine.cellClicked(x, y);
  }

  /** Image of the topmost piece in the cell ('W' = white, otherwise black); null if empty. */
  imageFor(cell: any): string | null {
    const ref = cell?.contains?.[cell.contains.length - 1];
    if (!ref) { return null; }
    return ref.entityID === 'W' ? 'assets/tictactoe/white.png' : 'assets/tictactoe/black.png';
  }
}
