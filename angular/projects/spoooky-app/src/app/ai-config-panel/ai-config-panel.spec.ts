import { TestBed } from '@angular/core/testing';
import { AiConfigPanel } from './ai-config-panel';
import { AiConfigService } from '../ai-config.service';
import { GameEngineService } from '../game-engine.service';

describe('AiConfigPanel', () => {
  beforeEach(() => localStorage.clear());
  afterEach(() => localStorage.clear());

  async function setup() {
    await TestBed.configureTestingModule({ imports: [AiConfigPanel] }).compileComponents();
    const fixture = TestBed.createComponent(AiConfigPanel);
    await fixture.whenStable();
    return { fixture, el: fixture.nativeElement as HTMLElement };
  }

  it('Klick auf "schwer" setzt die Schwierigkeit', async () => {
    const { fixture, el } = await setup();
    const cfg = TestBed.inject(AiConfigService);
    const btn = Array.from(el.querySelectorAll('button')).find(b => b.textContent?.trim() === 'schwer')!;
    btn.click();
    await fixture.whenStable();
    expect(cfg.config().difficulty).toBe('hard');
    expect(btn.getAttribute('aria-pressed')).toBe('true');
  });

  it('Zeitbudget-Eingabe aktualisiert thinkingTimeMs', async () => {
    const { fixture, el } = await setup();
    const cfg = TestBed.inject(AiConfigService);
    const input = el.querySelector('details input[type=number]') as HTMLInputElement;
    input.value = '500';
    input.dispatchEvent(new Event('input'));
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(cfg.config().thinkingTimeMs).toBe(500);
  });

  it('UCT-Eingabe aktualisiert uctConstant', async () => {
    const { fixture, el } = await setup();
    const cfg = TestBed.inject(AiConfigService);
    const input = el.querySelectorAll('details input[type=number]')[1] as HTMLInputElement;
    input.value = '1.4';
    input.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(cfg.config().uctConstant).toBe(1.4);
  });

  it('Analyse-Checkbox spiegelt und schaltet showAnalysis', async () => {
    const { fixture, el } = await setup();
    const engine = TestBed.inject(GameEngineService);
    const box = el.querySelector('input[type=checkbox]') as HTMLInputElement;
    expect(box.checked).toBe(engine.showAnalysis());
    const before = engine.showAnalysis();
    box.checked = !box.checked;
    box.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(engine.showAnalysis()).toBe(!before);
  });

  it('MCTS-Baum-Checkbox spiegelt und schaltet showTree', async () => {
    const { fixture, el } = await setup();
    const engine = TestBed.inject(GameEngineService);
    const box = el.querySelectorAll('input[type=checkbox]')[1] as HTMLInputElement;
    expect(box.parentElement?.textContent).toContain('MCTS-Baum anzeigen');
    expect(box.checked).toBe(engine.showTree());
    const before = engine.showTree();
    box.checked = !box.checked;
    box.dispatchEvent(new Event('change'));
    await fixture.whenStable();
    expect(engine.showTree()).toBe(!before);
  });
});
