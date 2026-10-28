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
}
