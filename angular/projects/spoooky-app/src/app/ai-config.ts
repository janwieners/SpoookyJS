export type Difficulty = 'easy' | 'medium' | 'hard';
export interface AiConfig { difficulty: Difficulty; thinkingTimeMs: number; uctConstant: number; }
export const DIFFICULTY_PRESETS: Record<Difficulty, { thinkingTimeMs: number }> = {
  easy: { thinkingTimeMs: 150 }, medium: { thinkingTimeMs: 400 }, hard: { thinkingTimeMs: 1200 },
};
export const DEFAULT_AI_CONFIG: AiConfig = {
  difficulty: 'medium', thinkingTimeMs: DIFFICULTY_PRESETS.medium.thinkingTimeMs, uctConstant: 0.9,
};
