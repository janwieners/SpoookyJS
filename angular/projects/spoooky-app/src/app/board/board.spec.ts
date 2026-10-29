import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { createTicTacToe } from '../games/tictactoe.game';
import { setWorkerMode } from '../engine-runtime';
import { setMemoryEnabled, setActiveMemory, resetMemory, onMemorySaved } from '../agent-memory';
import { GameEngineService } from '../game-engine.service';
import { Board } from './board';

const occupied = (board: any[]): number[] => board.map((c) => (c?.image ? 1 : 0));

// Isolation: Agentenspeicher, localStorage und fetch sind prozessweit geteilt.
beforeEach(() => {
  try { localStorage.clear(); } catch { /* ignore */ }
  resetMemory();
  setActiveMemory(null);
  setMemoryEnabled(false);
  onMemorySaved(null);
});
afterEach(() => {
  vi.unstubAllGlobals();
  try { localStorage.clear(); } catch { /* ignore */ }
  resetMemory();
  setActiveMemory(null);
  setMemoryEnabled(false);
  onMemorySaved(null);
});

describe('Board', () => {
  let fixture: ComponentFixture<Board>;
  let engine: GameEngineService;
  let el: HTMLElement;

  beforeEach(async () => {
    setWorkerMode('sync');
    setSeed(42);
    await TestBed.configureTestingModule({ imports: [Board] }).compileComponents();
    engine = TestBed.inject(GameEngineService);
    engine.newGame(createTicTacToe);
    fixture = TestBed.createComponent(Board);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  it('rendert 9 Zellen', () => {
    expect(el.querySelectorAll('.cell').length).toBe(9);
    expect(el.querySelector('.overlay')).toBeNull();
  });

  it('ein Klick auf die erste freie Zelle verändert das Brett und rendert eine Figur', async () => {
    const before = occupied(engine.board());
    expect(before.reduce((a, b) => a + b, 0)).toBe(0);

    const cells = el.querySelectorAll<HTMLButtonElement>('.cell');
    cells[4].click(); // Mitte => x=1, y=1
    await fixture.whenStable();

    const after = occupied(engine.board());
    expect(after).not.toEqual(before);
    expect(after[4]).toBe(1); // Klick-Routing: Index 4 => (1,1)
    expect(el.querySelectorAll('.cell').length).toBe(9);
    expect(el.querySelectorAll('.cell img').length).toBeGreaterThanOrEqual(1);
    expect(el.querySelector('.overlay')).toBeNull();
    expect(el.querySelector('.board')!.classList.contains('thinking')).toBe(false);
  });
});

describe('Board – evaluation overlay', () => {
  let fixture: ComponentFixture<Board>;
  let svc: GameEngineService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Board] }).compileComponents();
    setWorkerMode('sync');
    setSeed(42);
    localStorage.clear();
    svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    fixture = TestBed.createComponent(Board);
    await fixture.whenStable();
  });

  it('zeigt kein Overlay, solange keine Bewertung vorliegt', () => {
    expect(fixture.nativeElement.querySelectorAll('.cell .eval').length).toBe(0);
  });

  it('zeigt Bewertungen nach einem KI-Zug und markiert genau eine gewählte Zelle', async () => {
    svc.cellClicked(0, 0);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.cell .eval').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelectorAll('.cell.chosen').length).toBe(1);
  });

  it('blendet das Overlay aus, wenn showEvaluation false ist', async () => {
    svc.cellClicked(0, 0);
    svc.toggleEvaluation(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.cell .eval').length).toBe(0);
  });
});

describe('Board – dynamische Brettgröße', () => {
  beforeEach(() => {
    setWorkerMode('sync');
    setSeed(42);
    try { localStorage.clear(); } catch { /* ignore */ }
    vi.stubGlobal('fetch', vi.fn(async () => ({
      ok: true,
      json: async () => ({ bestAgentEnsemble: [], learnModule: { rewards: {}, gameStates: {} } }),
    })));
  });
  afterEach(() => {
    vi.unstubAllGlobals();
    try { localStorage.clear(); } catch { /* ignore */ }
  });

  it('leitet die Spaltenzahl aus der Engine ab und rechnet Klicks korrekt um (9×9)', async () => {
    await TestBed.configureTestingModule({ imports: [Board] }).compileComponents();
    const engine = TestBed.inject(GameEngineService);
    await engine.selectGame('gomoku9x9');
    const fixture = TestBed.createComponent(Board);
    await fixture.whenStable();
    const spy = vi.spyOn(engine, 'cellClicked');
    const comp = fixture.componentInstance as any;
    comp.onCellClick(10); // Index 10 bei 9 Spalten => (1,1)
    expect(spy).toHaveBeenCalledWith(1, 1);
    expect(comp.columns()).toBe(9);
    expect(fixture.nativeElement.querySelectorAll('.cell').length).toBe(81);
  });
});
