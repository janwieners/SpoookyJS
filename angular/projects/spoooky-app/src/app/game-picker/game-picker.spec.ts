import { TestBed } from '@angular/core/testing';
import { setWorkerMode } from '../engine-runtime';
import { setMemoryEnabled, setActiveMemory, resetMemory, onMemorySaved } from '../agent-memory';
import { GameEngineService } from '../game-engine.service';
import { GamePicker } from './game-picker';
import { GAMES } from '../games/registry';

describe('GamePicker', () => {
  beforeEach(() => {
    setWorkerMode('sync');
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    onMemorySaved(null);
  });
  // selectGame schreibt activeGame/Memory-Ziel; nichts davon darf in andere Specs lecken.
  afterEach(() => {
    vi.unstubAllGlobals();
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    onMemorySaved(null);
  });

  it('listet alle Spiele und ruft selectGame bei Auswahl', async () => {
    const fixture = TestBed.createComponent(GamePicker);
    const engine = TestBed.inject(GameEngineService);
    const spy = vi.spyOn(engine, 'selectGame');
    await fixture.whenStable();
    const select = fixture.nativeElement.querySelector('select[data-test="game-picker"]') as HTMLSelectElement;
    expect(select).toBeTruthy();
    expect(select.querySelectorAll('option').length).toBe(GAMES.length);
    select.value = 'gomoku9x9';
    select.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith('gomoku9x9');
  });
});
