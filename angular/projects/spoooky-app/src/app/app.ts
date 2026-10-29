import { Component, OnInit, HostListener, computed, inject } from '@angular/core';
import { Board } from './board/board';
import { GameLog } from './game-log/game-log';
import { DecisionPanel } from './decision-panel/decision-panel';
import { EvaluationToggle } from './evaluation-toggle/evaluation-toggle';
import { MctsTree } from './mcts-tree/mcts-tree';
import { AiConfigPanel } from './ai-config-panel/ai-config-panel';
import { GamePicker } from './game-picker/game-picker';
import { GameEngineService } from './game-engine.service';
import { gameById } from './games/registry';

@Component({
  selector: 'app-root',
  imports: [Board, GameLog, DecisionPanel, EvaluationToggle, AiConfigPanel, MctsTree, GamePicker],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly engine = inject(GameEngineService);

  readonly error = this.engine.error;
  readonly statusText = this.engine.statusText;
  readonly gameName = computed(() => gameById(this.engine.activeGameId()).name);

  ngOnInit(): void {
    void this.engine.selectGame(this.engine.activeGameId());
  }

  restart(): void { this.engine.restart(); }

  // Warn before leaving while the AI is mid-turn (ported intent from the old app).
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: BeforeUnloadEvent): void {
    if (this.engine.gameState() !== 'END' && this.engine.currentPlayerType() === 'ARTIFICIAL') {
      e.preventDefault();
      e.returnValue = 'Bitte warten, bis der KI-Spieler fertig ist.';
    }
  }
}
