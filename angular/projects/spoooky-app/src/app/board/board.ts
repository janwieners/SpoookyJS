import { Component, computed, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GameEngineService } from '../game-engine.service';
import { EvalCell } from '../evaluation-adapter';

@Component({
  selector: 'app-board',
  imports: [DecimalPipe],
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly engine = inject(GameEngineService);
  readonly cells = computed(() => this.engine.board());
  readonly aiThinking = this.engine.aiThinking;
  readonly columns = 3;

  /** Lookup flat index -> evaluation cell; empty unless the overlay is enabled and an evaluation exists. */
  readonly evalByIndex = computed<Map<number, EvalCell>>(() => {
    const map = new Map<number, EvalCell>();
    if (!this.engine.showEvaluation()) { return map; }
    const ev = this.engine.evaluation();
    if (!ev) { return map; }
    for (const c of ev.cells) { map.set(c.y * this.columns + c.x, c); }
    return map;
  });

  evalAt(index: number): EvalCell | undefined { return this.evalByIndex().get(index); }

  /** Win rate 0..1 -> background tint (red low, green high), mixed with the surface for light/dark readability. */
  heatStyle(cell: EvalCell): Record<string, string> {
    const hue = Math.round(cell.winRate * 120); // 0=red .. 120=green
    return { 'background-color': `color-mix(in srgb, hsl(${hue} 70% 50%) 45%, var(--surface, #fff))` };
  }

  /** Board is a flat row-major array; cells carry no x/y, so derive them from the index. */
  onCellClick(index: number): void {
    const x = index % this.columns;
    const y = Math.floor(index / this.columns);
    this.engine.cellClicked(x, y);
  }
}
