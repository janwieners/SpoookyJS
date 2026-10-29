import { TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { App } from './app';

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [App] }).compileComponents();
    setSeed(42);
  });

  it('creates the app', () => {
    const fixture = TestBed.createComponent(App);
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('mounts the board (9 cells) after init', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.querySelector('app-board')).toBeTruthy();
    expect(el.querySelectorAll('.cell').length).toBe(9);
  });
});
