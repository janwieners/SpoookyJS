import { TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { App } from './app';
import { gameById, DEFAULT_GAME_ID } from './games/registry';
import { setWorkerMode } from './engine-runtime';
import { setMemoryEnabled, setActiveMemory, resetMemory, onMemorySaved } from './agent-memory';

describe('App', () => {
  const resetShared = () => {
    vi.unstubAllGlobals();
    try { localStorage.clear(); } catch { /* ignore */ }
    resetMemory();
    setActiveMemory(null);
    setMemoryEnabled(false);
    onMemorySaved(null);
  };
  beforeEach(async () => {
    setWorkerMode('sync');
    resetShared();
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    setSeed(42);
  });
  afterEach(resetShared);

  it('creates the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('zeigt den Namen des aktiven Spiels im Titel (Default: TicTacToe)', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const h1 = (fixture.nativeElement as HTMLElement).querySelector('h1')!;
    expect(h1.textContent).toContain(gameById(DEFAULT_GAME_ID).name);
    expect(h1.textContent).toContain('Tic Tac Toe');
  });

  it('mounts the board (9 cells) after init', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-board')).toBeTruthy();
    expect(el.querySelectorAll('.cell').length).toBe(9);
  });
});
