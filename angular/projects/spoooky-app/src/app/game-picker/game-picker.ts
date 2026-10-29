import { Component, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';
import { GAMES } from '../games/registry';

@Component({
  selector: 'app-game-picker',
  template: `
    <label class="game-picker">
      Spiel
      <select data-test="game-picker" [value]="engine.activeGameId()"
              (change)="engine.selectGame($any($event.target).value)">
        @for (g of games; track g.id) { <option [value]="g.id">{{ g.name }}</option> }
      </select>
    </label>
  `,
  styles: [`
    .game-picker { display: inline-flex; align-items: center; gap: .5rem; }
    select { border: 1px solid var(--border); background: var(--surface); color: var(--text);
      border-radius: var(--radius); padding: .3rem .5rem; }
    select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  `],
})
export class GamePicker {
  readonly engine = inject(GameEngineService);
  readonly games = GAMES;
}
