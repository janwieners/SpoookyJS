import { Component, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

// Log lines are HTML fragments produced by the engine (not user input); [innerHTML] renders them.
@Component({
  selector: 'app-game-log',
  template: `<ul class="log">
    @for (line of engine.log(); track $index) {
      <li [innerHTML]="line"></li>
    }
  </ul>`,
})
export class GameLog {
  readonly engine = inject(GameEngineService);
}
