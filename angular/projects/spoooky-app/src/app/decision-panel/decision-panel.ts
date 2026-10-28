import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-decision-panel',
  imports: [DecimalPipe],
  template: `
    @if (engine.evaluation(); as ev) {
      <section class="decision">
        <h2>Entscheidung der KI</h2>
        <p>
          <strong>{{ ev.stats.candidates }}</strong> Züge geprüft in
          <strong>{{ ev.stats.simulations | number }}</strong> Simulationen
          (<strong>{{ ev.stats.steps | number }}</strong> Schritte).
          Gewählt: <strong>{{ ev.stats.chosen }}</strong>
          (Gewinnrate {{ (ev.stats.chosenWinRate ?? 0) * 100 | number:'1.0-0' }}%).
        </p>
        <p class="legend">
          <span class="swatch low"></span> niedrige
          <span class="swatch high"></span> hohe Gewinnrate
        </p>
      </section>
    } @else {
      <section class="decision empty"><p>Noch keine KI-Entscheidung.</p></section>
    }
  `,
  styles: [`
    .decision h2 { font-size: 1rem; margin: 0 0 .25rem; }
    .decision p { margin: .25rem 0; }
    .legend { display: flex; align-items: center; gap: .4rem; font-size: .85rem; }
    .swatch { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
    .swatch.low { background: hsl(0 70% 50%); }
    .swatch.high { background: hsl(120 70% 50%); }
  `],
})
export class DecisionPanel {
  readonly engine = inject(GameEngineService);
}
