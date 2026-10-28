import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameEngineService } from '../game-engine.service';
import { GameLog } from './game-log';

describe('GameLog', () => {
  let fixture: ComponentFixture<GameLog>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [GameLog] }).compileComponents();
    fixture = TestBed.createComponent(GameLog);
    await fixture.whenStable();
  });

  it('rendert Logzeilen als HTML', async () => {
    TestBed.inject(GameEngineService).log.set(['<strong>Zug 1</strong>', 'Zug 2']);
    await fixture.whenStable();
    const items = (fixture.nativeElement as HTMLElement).querySelectorAll('li');
    expect(items.length).toBe(2);
    expect(items[0].querySelector('strong')?.textContent).toBe('Zug 1');
  });
});
