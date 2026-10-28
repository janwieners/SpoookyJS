import { Component, OnInit, HostListener, inject } from '@angular/core';
import { Board } from './board/board';
import { GameLog } from './game-log/game-log';
import { GameEngineService } from './game-engine.service';
import { createTicTacToe } from './games/tictactoe.game';

@Component({
  selector: 'app-root',
  imports: [Board, GameLog],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit {
  private readonly engine = inject(GameEngineService);

  readonly error = this.engine.error;

  ngOnInit(): void { this.engine.newGame(createTicTacToe); }

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
