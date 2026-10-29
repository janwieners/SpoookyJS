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
  /** Spaltenzahl kommt von der Engine (3 bei TicTacToe, 9/15 bei Gomoku). */
  readonly columns = this.engine.columns;

  /** Lookup flat index -> evaluation cell; empty unless the overlay is enabled and an evaluation exists. */
  readonly evalByIndex = computed<Map<number, EvalCell>>(() => {
    const map = new Map<number, EvalCell>();
    if (!this.engine.showEvaluation()) { return map; }
    const ev = this.engine.evaluation();
    if (!ev) { return map; }
    const cols = this.columns();
    for (const c of ev.cells) { map.set(c.y * cols + c.x, c); }
    return map;
  });

  evalAt(index: number): EvalCell | undefined { return this.evalByIndex().get(index); }

  /** Signed score [-1, 1] -> background tint (red low, yellow neutral, green high), mixed with the surface for light/dark readability. */
  heatStyle(cell: EvalCell): Record<string, string> {
    const w = Math.max(-1, Math.min(1, cell.winRate));
    const hue = Math.round(((w + 1) / 2) * 120); // -1 -> 0 (red), 0 -> 60 (yellow), 1 -> 120 (green)
    return { 'background-color': `color-mix(in srgb, hsl(${hue} 70% 50%) 45%, var(--surface, #fff))` };
  }

  /** Brettquadrat-Klasse aus baseClass (nur Dame nutzt dunkel/hell; TicTacToe/Gomoku -> neutral). */
  squareClass(i: number): string {
    const b = this.cells()[i]?.baseClass;
    return b === 'gridCellBlack' ? 'sq-dark' : b === 'gridCellWhite' ? 'sq-light' : '';
  }

  /** Highlight-Klasse aus cellClass (Auswahl / normales Ziel / Schlag-Ziel). */
  markClass(i: number): string {
    const c = this.cells()[i]?.cellClass;
    return c === 'clickedEntity' ? 'sel' : c === 'move_standard' ? 'target' : c === 'move_goal' ? 'capture' : '';
  }

  /** Board is a flat row-major array; cells carry no x/y, so derive them from the index. */
  onCellClick(index: number): void {
    const cols = this.columns();
    const x = index % cols;
    const y = Math.floor(index / cols);
    this.engine.cellClicked(x, y);
  }
}
