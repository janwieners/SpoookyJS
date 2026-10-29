import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TreeNode } from '../mcts-tree-adapter';

@Component({
  selector: 'app-mcts-tree-node',
  imports: [DecimalPipe],
  template: `
    <div class="node" [class.terminal]="node().terminal">
      <button class="label" type="button" (click)="toggle()" [disabled]="node().children.length === 0"
              [style.background-color]="heat()">
        <span class="move">{{ node().label }}</span>
        <span class="stats">{{ node().visits }}×@if (node().winRate !== null) { · {{ node().winRate! * 100 | number:'1.0-0' }}% }</span>
        @if (node().children.length) { <span class="caret">{{ expanded() ? '▾' : '▸' }}</span> }
      </button>
      @if (expanded()) {
        <ul class="children">
          @for (child of visibleChildren(); track $index) {
            <li><app-mcts-tree-node [node]="child" /></li>
          }
          @if (!showAll() && node().children.length > topN) {
            <li><button class="more" type="button" (click)="showAll.set(true)">+{{ node().children.length - topN }} weitere</button></li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .node { margin-left: .25rem; }
    .label { display:inline-flex; gap:.5rem; align-items:center; border:1px solid var(--border); border-radius:6px;
      padding:.1rem .4rem; margin:.1rem 0; cursor:pointer; color:var(--text); }
    .label[disabled] { cursor:default; opacity:.85; }
    .move { font-weight:600; } .stats { font-size:.8rem; opacity:.9; }
    .terminal > .label { border-style:dashed; }
    .children { list-style:none; margin:0 0 0 1rem; padding:0; border-left:1px solid var(--border); }
    .more { font-size:.8rem; background:none; border:none; color:var(--accent); cursor:pointer; }
  `],
})
export class MctsTreeNode {
  readonly node = input.required<TreeNode>();
  readonly topN = 4;
  readonly expanded = signal(false);
  readonly showAll = signal(false);
  readonly visibleChildren = computed(() => this.showAll() ? this.node().children : this.node().children.slice(0, this.topN));
  // Win rate 0..1(..-1) -> diverging tint (same idea as the SP2 board heatmap).
  readonly heat = computed(() => {
    const w = this.node().winRate; if (w === null) { return 'transparent'; }
    const c = Math.max(-1, Math.min(1, w)); const hue = Math.round(((c + 1) / 2) * 120);
    return `color-mix(in srgb, hsl(${hue} 70% 50%) 30%, var(--surface))`;
  });
  toggle(): void { if (this.node().children.length) { this.expanded.update(v => !v); } }
}
