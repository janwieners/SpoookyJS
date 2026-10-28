import { vi } from 'vitest';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { createTicTacToe } from '../games/tictactoe.game';
import { GameEngineService } from '../game-engine.service';
import { Board } from './board';

// Nur setTimeout fälschen: die UCT-Suche läuft bis `Date.now() >= endTime`; eine eingefrorene
// Date.now() würde sie endlos laufen lassen.
const occupied = (board: any[]): number[] => board.map((c) => (c?.contains?.length ? 1 : 0));

describe('Board', () => {
  let fixture: ComponentFixture<Board>;
  let engine: GameEngineService;
  let el: HTMLElement;

  beforeEach(async () => {
    setSeed(42);
    await TestBed.configureTestingModule({ imports: [Board] }).compileComponents();
    engine = TestBed.inject(GameEngineService);
    engine.newGame(createTicTacToe);
    fixture = TestBed.createComponent(Board);
    el = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  afterEach(() => { vi.useRealTimers(); });

  it('rendert 9 Zellen', () => {
    expect(el.querySelectorAll('.cell').length).toBe(9);
    expect(el.querySelector('.overlay')).toBeNull();
  });

  it('ein Klick auf die erste freie Zelle verändert das Brett und rendert eine Figur', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    const before = occupied(engine.board());
    expect(before.reduce((a, b) => a + b, 0)).toBe(0);

    const cells = el.querySelectorAll<HTMLButtonElement>('.cell');
    cells[4].click(); // Mitte => x=1, y=1
    await fixture.whenStable();
    // Während die KI "denkt": Overlay sichtbar, Brett sperrt Eingaben.
    expect(engine.aiThinking()).toBe(true);
    expect(el.querySelector('.board')!.classList.contains('thinking')).toBe(true);
    expect(el.querySelector('.overlay')).not.toBeNull();

    vi.runAllTimers();
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
