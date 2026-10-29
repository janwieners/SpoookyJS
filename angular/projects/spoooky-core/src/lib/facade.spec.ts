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

describe('SpooookyGame.cellView', () => {
  it('cellView liefert image, baseClass und cellClass', () => {
    const raw = {
      getPlayerWithID: () => ({ getEntityWithID: () => ({ getName: () => 'X', getView: () => 'img.png' }) }),
    };
    const g = new SpooookyGame(raw as any);
    const withPiece = g.cellView({ contains: [{ playerID: 0, entityID: 1 }], view: { baseClass: 'gridCellBlack', cellClass: 'move_goal' } });
    expect(withPiece).toEqual({ image: 'img.png', baseClass: 'gridCellBlack', cellClass: 'move_goal' });
    const empty = g.cellView({ contains: [], view: { baseClass: 'gridCellWhite', cellClass: '' } });
    expect(empty).toEqual({ image: null, baseClass: 'gridCellWhite', cellClass: '' });
  });
});
