import { Injectable, effect, signal } from '@angular/core';
import { AiConfig, DEFAULT_AI_CONFIG, DIFFICULTY_PRESETS, Difficulty } from './ai-config';
import { setAiConfig } from './engine-runtime';

@Injectable({ providedIn: 'root' })
export class AiConfigService {
  readonly config = signal<AiConfig>(this.read());
  constructor() {
    // Push every change to the worker boundary and persist it.
    effect(() => { const c = this.config(); setAiConfig(c); this.persist(c); });
  }
  setDifficulty(d: Difficulty): void {
    this.config.set({ ...this.config(), difficulty: d, thinkingTimeMs: DIFFICULTY_PRESETS[d].thinkingTimeMs });
  }
  setExpert(partial: Partial<Pick<AiConfig, 'thinkingTimeMs' | 'uctConstant'>>): void {
    this.config.set({ ...this.config(), ...partial });
  }
  private read(): AiConfig {
    try { const s = localStorage.getItem('spoooky.aiConfig'); if (s) { return { ...DEFAULT_AI_CONFIG, ...JSON.parse(s) }; } } catch { /* ignore */ }
    return DEFAULT_AI_CONFIG;
  }
  private persist(c: AiConfig): void { try { localStorage.setItem('spoooky.aiConfig', JSON.stringify(c)); } catch { /* ignore */ } }
}
