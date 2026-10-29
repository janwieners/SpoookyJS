import { TestBed } from '@angular/core/testing';
import { AiConfigService } from './ai-config.service';
import { DIFFICULTY_PRESETS } from './ai-config';

describe('AiConfigService', () => {
  let svc: AiConfigService;
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({}); svc = TestBed.inject(AiConfigService); });
  it('setDifficulty setzt das Preset-Zeitbudget und merkt es', () => {
    svc.setDifficulty('hard');
    TestBed.tick();
    expect(svc.config().difficulty).toBe('hard');
    expect(svc.config().thinkingTimeMs).toBe(DIFFICULTY_PRESETS.hard.thinkingTimeMs);
    expect(JSON.parse(localStorage.getItem('spoooky.aiConfig')!).difficulty).toBe('hard');
  });
  it('setExpert überschreibt Zeitbudget/UCT ohne Preset-Zwang', () => {
    svc.setExpert({ thinkingTimeMs: 777, uctConstant: 1.4 });
    expect(svc.config().thinkingTimeMs).toBe(777);
    expect(svc.config().uctConstant).toBeCloseTo(1.4);
  });
});
