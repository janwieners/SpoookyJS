import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { DecisionPanel } from './decision-panel';
import { setWorkerMode } from '../engine-runtime';
import { GameEngineService } from '../game-engine.service';
import { createTicTacToe } from '../games/tictactoe.game';

describe('DecisionPanel', () => {
  let fixture: ComponentFixture<DecisionPanel>;
  let svc: GameEngineService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DecisionPanel] }).compileComponents();
    setWorkerMode('sync');
    setSeed(42); localStorage.clear();
    svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    fixture = TestBed.createComponent(DecisionPanel);
    await fixture.whenStable();
  });

  it('zeigt einen Hinweis, solange keine KI-Entscheidung vorliegt', () => {
    expect((fixture.nativeElement.textContent || '')).toContain('Noch keine');
  });

  it('fasst die letzte Entscheidung zusammen (gewähltes Feld erscheint)', async () => {
    svc.cellClicked(0, 0);
    await fixture.whenStable();
    const ev = svc.evaluation()!;
    expect(fixture.nativeElement.textContent).toContain(ev.stats.chosen!);
  });
});
