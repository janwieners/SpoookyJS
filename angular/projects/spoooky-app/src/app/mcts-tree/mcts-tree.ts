import { Component, inject } from '@angular/core';
import { MctsTreeNode } from './mcts-tree-node';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-mcts-tree',
  imports: [MctsTreeNode],
  template: `
    <section class="tree">
      <h2>MCTS-Suchbaum</h2>
      @if (engine.mctsTree(); as root) {
        @if (root.children.length) { <app-mcts-tree-node [node]="root" /> }
        @else { <p class="hint">Baum zu komplex oder leer.</p> }
      } @else {
        <p class="hint">Noch kein Suchbaum. (Mach einen Zug, wenn „MCTS-Baum anzeigen“ an ist.)</p>
      }
    </section>
  `,
  styles: [`.tree h2{font-size:1rem;margin:0 0 .25rem;} .hint{opacity:.8;font-size:.9rem;}`],
})
export class MctsTree {
  readonly engine = inject(GameEngineService);
}
