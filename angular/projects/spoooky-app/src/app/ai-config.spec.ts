import { DIFFICULTY_PRESETS, DEFAULT_AI_CONFIG } from './ai-config';
describe('ai-config', () => {
  it('hat aufsteigende Zeitbudgets je Schwierigkeit', () => {
    expect(DIFFICULTY_PRESETS.easy.thinkingTimeMs).toBeLessThan(DIFFICULTY_PRESETS.medium.thinkingTimeMs);
    expect(DIFFICULTY_PRESETS.medium.thinkingTimeMs).toBeLessThan(DIFFICULTY_PRESETS.hard.thinkingTimeMs);
  });
  it('Default ist medium und positiv', () => {
    expect(DEFAULT_AI_CONFIG.difficulty).toBe('medium');
    expect(DEFAULT_AI_CONFIG.thinkingTimeMs).toBeGreaterThan(0);
    expect(DEFAULT_AI_CONFIG.uctConstant).toBeGreaterThan(0);
  });
});
