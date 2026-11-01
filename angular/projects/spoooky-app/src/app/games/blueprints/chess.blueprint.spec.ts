import { CHESS_BLUEPRINT } from './chess.blueprint';

describe('CHESS_BLUEPRINT (verbatim lift)', () => {
  it('exportiert alle Figuren-Entities und Consequences', () => {
    const e = (CHESS_BLUEPRINT as any).entities;
    for (const k of ['white_king','black_king','white_queen','black_queen','white_rook','black_rook',
                     'white_bishop','black_bishop','white_knight','black_knight','white_pawn','black_pawn']) {
      expect(e[k]).toBeTruthy();
    }
    const c = (CHESS_BLUEPRINT as any).consequences;
    expect(c.whitePlayer).toBeTruthy();
    expect(c.blackPlayer).toBeTruthy();
  });
});
