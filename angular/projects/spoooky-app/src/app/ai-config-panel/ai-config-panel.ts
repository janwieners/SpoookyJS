import { Component, inject } from '@angular/core';
import { AiConfigService } from '../ai-config.service';
import { GameEngineService } from '../game-engine.service';
import { Difficulty } from '../ai-config';

@Component({
  selector: 'app-ai-config-panel',
  template: `
    <section class="panel" aria-label="KI-Einstellungen">
      <div class="difficulty" role="group" aria-label="Schwierigkeit">
        @for (l of levels; track l.value) {
          <button type="button" [class.active]="cfg.config().difficulty === l.value"
                  [attr.aria-pressed]="cfg.config().difficulty === l.value"
                  (click)="cfg.setDifficulty(l.value)">{{ l.label }}</button>
        }
      </div>

      <details>
        <summary>Experten-Parameter</summary>
        <label class="field">Zeitbudget (ms)
          <input type="number" min="50" step="50" [value]="cfg.config().thinkingTimeMs"
                 (change)="setTime($any($event.target).valueAsNumber)" />
        </label>
        <label class="field">UCT-Konstante
          <input type="number" min="0" step="0.1" [value]="cfg.config().uctConstant"
                 (change)="setUct($any($event.target).valueAsNumber)" />
        </label>
      </details>

      <label class="toggle">
        <input type="checkbox" [checked]="engine.showAnalysis()"
               (change)="engine.toggleAnalysis($any($event.target).checked)" />
        KI-Analyse meiner Züge
      </label>
    </section>
  `,
  styles: [`
    .panel { display: grid; gap: .75rem; }
    .difficulty { display: inline-flex; gap: .25rem; }
    .difficulty button {
      border: 1px solid var(--border); background: var(--surface); color: var(--text);
      border-radius: var(--radius); padding: .3rem .7rem; cursor: pointer;
    }
    .difficulty button:hover { border-color: var(--accent); }
    .difficulty button.active { border-color: var(--accent); background: var(--accent); color: #fff; }
    .difficulty button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
    summary { cursor: pointer; }
    .field { display: flex; justify-content: space-between; align-items: center; gap: .5rem; margin-top: .5rem; }
    .field input { width: 6rem; }
    .toggle { display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; }
  `],
})
export class AiConfigPanel {
  readonly cfg = inject(AiConfigService);
  readonly engine = inject(GameEngineService);
  readonly levels: { value: Difficulty; label: string }[] = [
    { value: 'easy', label: 'leicht' },
    { value: 'medium', label: 'mittel' },
    { value: 'hard', label: 'schwer' },
  ];

  setTime(v: number): void { if (Number.isFinite(v) && v > 0) { this.cfg.setExpert({ thinkingTimeMs: v }); } }
  setUct(v: number): void { if (Number.isFinite(v) && v >= 0) { this.cfg.setExpert({ uctConstant: v }); } }
}
