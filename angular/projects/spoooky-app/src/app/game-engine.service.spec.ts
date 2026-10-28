import { vi } from 'vitest';
import { setSeed } from 'spoooky-core';
import { createTicTacToe } from './games/tictactoe.game';
import { GameEngineService } from './game-engine.service';

const occupied = (board: any[]): number[] => board.map((c) => (c?.contains?.length ? 1 : 0));

// Nur setTimeout fälschen: die UCT-Suche läuft bis `Date.now() >= endTime`; eine eingefrorene
// Date.now() würde sie endlos laufen lassen.
const useDeferralTimers = () => vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });

describe('GameEngineService', () => {
  let svc: GameEngineService;

  beforeEach(() => {
    setSeed(12345);
    svc = new GameEngineService();
    svc.newGame(createTicTacToe);
  });

  afterEach(() => { vi.useRealTimers(); });

  it('startet ein Spiel: nicht beendet, Mensch am Zug, 9 Zellen', () => {
    expect(svc.gameState()).not.toBe('END');
    expect(svc.currentPlayerType()).toBe('HUMAN');
    expect(svc.board().length).toBe(9);
    expect(svc.aiThinking()).toBe(false);
  });

  it('ein Menschenzug verändert das Brett und löscht aiThinking wieder', () => {
    useDeferralTimers();
    const before = occupied(svc.board());
    expect(before.reduce((a, b) => a + b, 0)).toBe(0);

    svc.cellClicked(1, 1);
    expect(svc.aiThinking()).toBe(true);
    vi.runAllTimers();

    const after = occupied(svc.board());
    expect(svc.board().length).toBe(9);
    expect(after).not.toEqual(before);
    // Mindestens die Figur des Menschen (die KI zieht ggf. direkt danach).
    expect(after.reduce((a, b) => a + b, 0)).toBeGreaterThanOrEqual(1);
    expect(svc.aiThinking()).toBe(false);
    // Das Spielprotokoll enthält mindestens den Menschenzug als Text.
    expect(svc.log().length).toBeGreaterThanOrEqual(1);
    expect(svc.log().every((m) => typeof m === 'string' && m.length > 0)).toBe(true);
  });

  it('ein Klick auf eine belegte Zelle ändert das Brett nicht', () => {
    useDeferralTimers();
    svc.cellClicked(0, 0);
    vi.runAllTimers();
    const snapshot = occupied(svc.board());
    expect(snapshot[0]).toBe(1);

    if (svc.currentPlayerType() === 'HUMAN' && svc.gameState() !== 'END') {
      svc.cellClicked(0, 0);
      vi.runAllTimers();
    }
    expect(occupied(svc.board())).toEqual(snapshot);
    expect(svc.aiThinking()).toBe(false);
  });
});
