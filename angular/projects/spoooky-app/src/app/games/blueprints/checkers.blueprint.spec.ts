// projects/spoooky-app/src/app/games/blueprints/checkers.blueprint.spec.ts
import { CHECKERS_BLUEPRINT } from './checkers.blueprint';

describe('CHECKERS_BLUEPRINT (verbatim lift)', () => {
  it('exportiert Entities und Consequences', () => {
    expect(CHECKERS_BLUEPRINT).toBeTruthy();
    const e = (CHECKERS_BLUEPRINT as any).entities;
    expect(e.topStandardEntity).toBeTruthy();
    expect(e.bottomStandardEntity).toBeTruthy();
    expect(e.topKingEntity).toBeTruthy();
    expect(e.bottomKingEntity).toBeTruthy();
    const c = (CHECKERS_BLUEPRINT as any).consequences;
    expect(c.topPlayer).toBeTruthy();
    expect(c.bottomPlayer).toBeTruthy();
  });
});
