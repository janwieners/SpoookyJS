import { SpooookyGame } from './facade';

describe('SpooookyGame.enableLearning', () => {
  it('ruft enableLearning auf allen ARTIFICIAL-Spielern auf', () => {
    const human = { type: 'HUMAN', enableLearning: vi.fn() };
    const ai = { type: 'ARTIFICIAL', enableLearning: vi.fn() };
    const raw = { getPlayers: () => [human, ai] };
    new SpooookyGame(raw as any).enableLearning();
    expect(ai.enableLearning).toHaveBeenCalledTimes(1);
    expect(human.enableLearning).not.toHaveBeenCalled();
  });
});
