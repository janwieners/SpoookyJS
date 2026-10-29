import { Component, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-evaluation-toggle',
  template: `
    <label class="toggle">
      <input type="checkbox" [checked]="engine.showEvaluation()"
             (change)="engine.toggleEvaluation($any($event.target).checked)" />
      KI-Bewertungen anzeigen
    </label>
  `,
  styles: [`.toggle { display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; }`],
})
export class EvaluationToggle {
  readonly engine = inject(GameEngineService);
}
