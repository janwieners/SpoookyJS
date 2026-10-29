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

      <label class="toggle">
        <input type="checkbox" [checked]="engine.showTree()"
               (change)="engine.toggleTree($any($event.target).checked)" />
        MCTS-Baum anzeigen
      </label>

      <label class="toggle">
        <input type="checkbox" data-test="use-memory" [checked]="engine.useMemory()"
               (change)="engine.toggleUseMemory($any($event.target).checked)" />
        Gelernte KI verwenden
      </label>

      <label class="toggle">
        <input type="checkbox" data-test="learn-mode" [checked]="engine.learnMode()"
               (change)="engine.toggleLearnMode($any($event.target).checked)" />
        Lern-Modus (lernt am Spielende)
      </label>

      <p class="memory-status">{{ engine.memoryStatus() }}</p>

      <div class="memory-actions">
        <button type="button" (click)="engine.exportMemory()" [disabled]="!engine.hasStoredMemory()">
          Erinnerung exportieren
        </button>
        <button type="button" (click)="engine.resetMemory()" [disabled]="!engine.hasStoredMemory()">
          Auf Standard zurücksetzen
        </button>
      </div>
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
    .memory-status { font-size: .85rem; color: var(--text); opacity: .8; margin: .25rem 0 0; }
    .memory-actions { display: inline-flex; gap: .5rem; flex-wrap: wrap; }
    .memory-actions button {
      border: 1px solid var(--border); background: var(--surface); color: var(--text);
      border-radius: var(--radius); padding: .3rem .7rem; cursor: pointer;
    }
    .memory-actions button:hover:not(:disabled) { border-color: var(--accent); }
    .memory-actions button:disabled { opacity: .45; cursor: default; }
    .memory-actions button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
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
