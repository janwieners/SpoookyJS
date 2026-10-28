import { TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { createTicTacToe } from './games/tictactoe.game';
import { setWorkerMode } from './engine-runtime';
import { GameEngineService } from './game-engine.service';

const occupied = (board: any[]): number[] => board.map((c) => (c?.image ? 1 : 0));

describe('GameEngineService', () => {
  let svc: GameEngineService;

  beforeEach(() => {
    setWorkerMode('sync');
    setSeed(12345);
    svc = new GameEngineService();
    svc.newGame(createTicTacToe);
  });

  it('startet ein Spiel: nicht beendet, Mensch am Zug, 9 Zellen', () => {
    expect(svc.gameState()).not.toBe('END');
    expect(svc.currentPlayerType()).toBe('HUMAN');
    expect(svc.board().length).toBe(9);
    expect(svc.aiThinking()).toBe(false);
  });

  it('newGame startet mit leerem Protokoll und ohne Fehler', () => {
    expect(svc.log().length).toBe(0);
    expect(svc.error()).toBeNull();
  });

  it('restart setzt Brett und Protokoll zurück', () => {
    svc.cellClicked(1, 1);
    expect(svc.log().length).toBeGreaterThanOrEqual(1);
    svc.restart();
    expect(svc.log().length).toBe(0);
    expect(occupied(svc.board()).reduce((a, b) => a + b, 0)).toBe(0);
    expect(svc.error()).toBeNull();
  });

  it('ein Menschenzug verändert das Brett und lässt aiThinking nicht hängen', () => {
    const before = occupied(svc.board());
    expect(before.reduce((a, b) => a + b, 0)).toBe(0);

    svc.cellClicked(1, 1);

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
    svc.cellClicked(0, 0);
    const snapshot = occupied(svc.board());
    expect(snapshot[0]).toBe(1);

    if (svc.currentPlayerType() === 'HUMAN' && svc.gameState() !== 'END') {
      svc.cellClicked(0, 0);
      }
    expect(occupied(svc.board())).toEqual(snapshot);
    expect(svc.aiThinking()).toBe(false);
  });

  it('Mensch (weiß) und KI (schwarz) werden auf unterschiedliche Bilder aufgelöst', () => {
    svc.cellClicked(1, 1);
    const images = svc.board().map((c) => c.image).filter((i): i is string => !!i);
    expect(images.some((i) => i.endsWith('white.png'))).toBe(true);
    expect(images.some((i) => i.endsWith('black.png'))).toBe(true);
  });
});

describe('GameEngineService – evaluation', () => {
  let svc: GameEngineService;
  beforeEach(() => {
    setWorkerMode('sync');
    TestBed.configureTestingModule({});
    svc = TestBed.inject(GameEngineService);
    setSeed(42);
    localStorage.clear();
  });

  it('startet ohne Bewertung und mit sichtbarem Overlay (Default)', () => {
    svc.newGame(createTicTacToe);
    expect(svc.evaluation()).toBeNull();
    expect(svc.showEvaluation()).toBe(true);
  });

  it('setzt nach einem KI-Zug eine Bewertung mit einem gewählten Feld', () => {
    svc.newGame(createTicTacToe);
    svc.cellClicked(0, 0);
    const ev = svc.evaluation();
    expect(ev).not.toBeNull();
    expect(ev!.cells.some(c => c.chosen)).toBe(true);
  });

  it('toggleEvaluation schreibt nach localStorage und newGame setzt die Bewertung zurück', () => {
    svc.newGame(createTicTacToe);
    svc.toggleEvaluation(false);
    expect(svc.showEvaluation()).toBe(false);
    expect(localStorage.getItem('spoooky.showEvaluation')).toBe('false');
    svc.newGame(createTicTacToe);
    expect(svc.evaluation()).toBeNull();
  });
});
