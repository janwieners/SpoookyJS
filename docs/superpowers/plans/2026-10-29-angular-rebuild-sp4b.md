# SP4b — Zug-UI-Fundament + Dame (Checkers) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the reusable move-game UI (render the engine's board-square pattern + move highlights) and ship Checkers (Dame) as the first move game, all app-side with the engine and lifted blueprint untouched.

**Architecture:** The engine already drives select→move via `clickCell` and marks cells with `view.cellClass` ("clickedEntity"/"move_standard"/"move_goal") + `view.baseClass` (board-square colour). SP4b surfaces those through the facade (`cellView`), carries them in the service's `board` signal, and renders them in the board component. Checkers' rules live in a big data blueprint that is lifted verbatim (like the engine) rather than rewritten.

**Tech Stack:** Angular 22 (standalone, signals, zoneless), Vitest (jsdom), TypeScript, the lifted SpoookyJS engine in `spoooky-core`.

## Global Constraints

- Angular 22, standalone components, signals, zoneless. Components have **no** `.component` suffix.
- Test runner is **Vitest (jsdom)**, not Karma. Vitest matchers (`toBe(true)`), `vi.fn()`/`vi.spyOn`, global test fns. Zoneless: `await fixture.whenStable()`, never `detectChanges()` loops.
- Run core tests: `npx ng test spoooky-core --watch=false`. App tests: `npx ng test spoooky-app --watch=false`. Filter one spec with `--include='**/<name>.spec.ts'` (the positional `-- name` filter is rejected by the CLI). **If a core file changed (facade), run `npx ng build spoooky-core` before app tests.**
- Prod build must succeed and keep the worker chunk: `npx ng build spoooky-app`.
- **Engine untouched** (`spoooky-core/src/lib/engine/*`). The lifted `checkers.blueprint.ts` is a verbatim copy — do NOT edit its logic. `src/js/*` is read-only reference. Only app-side files + `facade.ts` change.
- Tests run in **sync worker mode**: `setWorkerMode('sync')` in `beforeEach`.
- All user-facing copy is German. No new runtime dependencies.
- Working directory for all commands: `/Users/sportello/Develop/SpoookyJS/angular`.
- Assets: `src/assets/` → served at `/assets/`.

### Verified engine/app facts (reference — do not change the engine)

- Checkers runs in the engine DEFAULT mode `MOVING` (`Models.js:267`); `game.js` sets no mode. The factory sets it explicitly for clarity.
- Board: 8×8 with `gridCellWhite`/`gridCellBlack` checkered pattern (via `setupGridWorld`); pieces placed via `addEntitiesToGameBoard` (3 rows each side, dark squares only). player1 = HUMAN "Jan" (bottom, starts), player2 = ARTIFICIAL "Scully" (top). AI metaAgentID = 1.
- Click flow is the same `clickCell(x,y)`: click own piece → `showEntityMoves` sets `cell.view.cellClass` ("clickedEntity" selected, "move_standard" normal target, "move_goal" capture/goal target) + fills `models.MoveTable`; click a marked cell → executes; `resetMoves` clears the classes. Cell = `{ contains, position:{x,y}, view:{ baseClass, cellClass } }`.
- Checkers' moves/captures/kinging ("Transform Entity Into King Entity") and the Zugzwang (forced-capture) rules are all engine rule-atoms/consequences driven by the blueprint + `game.js` setup.
- Current `facade.getEntityAt(cell)` returns `{name, view}` where `view` is the piece image. The service's `board` signal currently holds `{image}`; SP4b widens it to `{image, baseClass, cellClass}`.
- Checkers assets: `src/games/checkers/assets/{black_01,black_02,white_01,white_02}.png` (standard + king per colour). Memory: `src/games/checkers/agentmemory_1.json` (4-agent ensemble, 0 states).

## File Structure

- **Create** `games/blueprints/checkers.blueprint.ts` — verbatim `@ts-nocheck` lift of `src/js/blueprints/checkers.js`, exporting `CHECKERS_BLUEPRINT`.
- **Create** `src/assets/checkers/{black_01,black_02,white_01,white_02}.png` + `agentmemory_1.json`.
- **Create** `games/checkers.game.ts` — `createCheckers()` factory.
- **Modify** `games/registry.ts` — add the `checkers` descriptor.
- **Modify** `facade.ts` — add `cellView(cell): { image, baseClass, cellClass }`.
- **Modify** `game-engine.service.ts` — `board` signal cells become `{ image, baseClass, cellClass }`; add a `statusText` signal.
- **Modify** `board/board.ts` + `board.html` + `board.scss` — render square pattern + highlights.
- **Modify** `app.html` (or board) — show the status line.
- Specs alongside each unit.

---

## Task 1: Checkers blueprint lift + assets

**Files:**
- Create: `projects/spoooky-app/src/app/games/blueprints/checkers.blueprint.ts`
- Create: `projects/spoooky-app/src/assets/checkers/{black_01,black_02,white_01,white_02}.png`, `projects/spoooky-app/src/assets/checkers/agentmemory_1.json`
- Test: `projects/spoooky-app/src/app/games/blueprints/checkers.blueprint.spec.ts`

**Interfaces:**
- Produces: `export const CHECKERS_BLUEPRINT` — the object with `entities` (topStandardEntity, bottomStandardEntity, topKingEntity, bottomKingEntity, each with moves/goalAtoms) and `consequences` (topPlayer, bottomPlayer).

- [ ] **Step 1: Copy assets**

```bash
mkdir -p projects/spoooky-app/src/assets/checkers
cp ../src/games/checkers/assets/black_01.png ../src/games/checkers/assets/black_02.png projects/spoooky-app/src/assets/checkers/
cp ../src/games/checkers/assets/white_01.png ../src/games/checkers/assets/white_02.png projects/spoooky-app/src/assets/checkers/
cp ../src/games/checkers/agentmemory_1.json projects/spoooky-app/src/assets/checkers/agentmemory_1.json
```

- [ ] **Step 2: Lift the blueprint verbatim**

Copy the ENTIRE contents of `src/js/blueprints/checkers.js` into `projects/spoooky-app/src/app/games/blueprints/checkers.blueprint.ts`, then make ONLY these minimal, behavior-preserving edits (exactly like the SP1 engine lift — no logic changes):

1. Add `// @ts-nocheck` as the very first line, then a one-line German comment noting it's a verbatim lift of `src/js/blueprints/checkers.js`.
2. The file begins:
   ```js
   Spoooky.Blueprints = {

       /**
        * Blueprints for the game of checkers
        */
       CHECKERS : {
   ```
   Replace that opening (the `Spoooky.Blueprints = {` wrapper AND the `CHECKERS :` key) with:
   ```ts
   export const CHECKERS_BLUEPRINT = {
   ```
   so the inner CHECKERS object becomes the exported value.
3. The file ends with the CHECKERS object closing, then the `Spoooky.Blueprints` closing: `… } };`. Remove the extra outer brace so the export object closes once: `… };`. (Match braces carefully — the import test in Step 3 fails loudly if unbalanced.)
4. The textures inside already read `assets/black_01.png` etc. — leave them if they resolve; if the old textures are bare filenames or wrong paths, adjust the texture strings to `assets/checkers/<file>.png` (and ONLY the texture strings). Verify against `src/games/checkers/assets/` filenames.

Do not change any move/condition/consequence data.

- [ ] **Step 3: Write the failing test**

```ts
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
```

- [ ] **Step 4: Run it**

Run: `npx ng test spoooky-app --watch=false --include='**/checkers.blueprint.spec.ts'`
Expected: FAIL first (module not found / brace error), then PASS after the lift is correct.

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/games/blueprints/checkers.blueprint.ts projects/spoooky-app/src/app/games/blueprints/checkers.blueprint.spec.ts projects/spoooky-app/src/assets/checkers/
git commit -m "feat(sp4b): lift checkers blueprint verbatim + assets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Checkers factory + registry entry

**Files:**
- Create: `projects/spoooky-app/src/app/games/checkers.game.ts`
- Test: `projects/spoooky-app/src/app/games/checkers.game.spec.ts`
- Modify: `projects/spoooky-app/src/app/games/registry.ts`
- Modify: `projects/spoooky-app/src/app/games/registry.spec.ts` (if it hardcodes the game count)

**Interfaces:**
- Consumes: `CHECKERS_BLUEPRINT` (Task 1).
- Produces: `createCheckers(): SpooookyGame`; registry entry `{ id:'checkers', name:'Dame', factory: createCheckers, columns:8, rows:8, memory: mem('checkers') }`.

- [ ] **Step 1: Write the failing test**

```ts
// projects/spoooky-app/src/app/games/checkers.game.spec.ts
import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { setActiveMemory, setMemoryEnabled, resetMemory } from '../agent-memory';
import { createCheckers } from './checkers.game';

describe('createCheckers', () => {
  beforeEach(() => {
    setWorkerMode('sync'); installEngineRuntime();
    resetMemory(); setActiveMemory(null); setMemoryEnabled(false);
    try { localStorage.clear(); } catch { /* ignore */ }
  });
  afterEach(() => { resetMemory(); setActiveMemory(null); setMemoryEnabled(false); try { localStorage.clear(); } catch { /* ignore */ } });

  it('baut ein 8×8-Dame-Brett, Mensch beginnt', () => {
    const g = createCheckers();
    expect(g.getColumns()).toBe(8);
    expect(g.getRows()).toBe(8);
    g.start();
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
  });

  it('stellt 24 Steine auf (12 je Spieler)', () => {
    const g: any = createCheckers();
    const grid = g.getGrid();
    let pieces = 0;
    for (const row of grid) { for (const cell of row) { if (cell.contains && cell.contains.length > 0) { pieces++; } } }
    expect(pieces).toBe(24);
  });

  it('nutzt das karierte Brettmuster (gridCellBlack/White)', () => {
    const g: any = createCheckers();
    const grid = g.getGrid();
    expect(grid[0][0].view.baseClass).toBe('gridCellWhite');
    expect(grid[0][1].view.baseClass).toBe('gridCellBlack');
  });
});
```

- [ ] **Step 2: Run it, confirm fail**

Run: `npx ng test spoooky-app --watch=false --include='**/checkers.game.spec.ts'`
Expected: FAIL (module not found).

- [ ] **Step 3: Write the factory**

Translate `src/games/checkers/game.js` (lines 6–220, i.e. everything EXCEPT the final `Spoooky.AngularWrapper(...)` call) into a TypeScript factory, mirroring `games/gomoku.game.ts`'s shape and using `CHECKERS_BLUEPRINT` in place of `Spoooky.Blueprints.CHECKERS`. Full skeleton (fill the rule bodies verbatim from `game.js`):

```ts
// projects/spoooky-app/src/app/games/checkers.game.ts
import { Spoooky, SpooookyGame } from 'spoooky-core';
import { CHECKERS_BLUEPRINT } from './blueprints/checkers.blueprint';

/** Dame (Checkers). Mensch (unten) beginnt gegen die KI (oben). Regeln aus dem gelifteten Blueprint. */
export function createCheckers(): SpooookyGame {
  const game: any = new Spoooky.Game();
  game.initialize('Dame (Checkers / Draughts)');
  game.setDescription('Gespielt wird nur auf den dunklen Feldern. …');  // text aus game.js übernehmen
  game.setGameMode('MOVING');

  const player1 = game.createPlayer({ name: 'Jan', type: 'HUMAN' });
  const player2 = game.createPlayer({ name: 'Scully', type: 'ARTIFICIAL' });

  const black = 'gridCellBlack', white = 'gridCellWhite';
  game.setupGridWorld(8, 8, [
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
  ]);

  const p1std = game.addBlueprint(player1, CHECKERS_BLUEPRINT.entities.bottomStandardEntity);
  const p2std = game.addBlueprint(player2, CHECKERS_BLUEPRINT.entities.topStandardEntity);
  game.addBlueprint(player1, CHECKERS_BLUEPRINT.entities.bottomKingEntity);
  game.addBlueprint(player2, CHECKERS_BLUEPRINT.entities.topKingEntity);

  game.connectConsequences(CHECKERS_BLUEPRINT.consequences.topPlayer);
  game.connectConsequences(CHECKERS_BLUEPRINT.consequences.bottomPlayer);

  game.addEntitiesToGameBoard([
    0, p2std, 0, p2std, 0, p2std, 0, p2std,
    p2std, 0, p2std, 0, p2std, 0, p2std, 0,
    0, p2std, 0, p2std, 0, p2std, 0, p2std,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    p1std, 0, p1std, 0, p1std, 0, p1std, 0,
    0, p1std, 0, p1std, 0, p1std, 0, p1std,
    p1std, 0, p1std, 0, p1std, 0, p1std, 0,
  ]);

  game.setPlayer(player1);

  // --- Win rules + Zugzwang rules: translate game.js lines 77–220 VERBATIM (atom names, functions,
  //     arguments, consequences, and the ORDER of rules — the comment there warns order is essential). ---
  // "Player 1 wins the game" / "Player 2 wins the game" (Player Has No Movable Entities) ...
  // "Zugzwang" / "Zug unter Zugzwang" / "Release Zugzwang" ...
  // (Use player1.getID()/player2.getID() exactly as game.js does.)

  return new SpooookyGame(game);
}
```

Translate the five `addGameRuleAtom`/`assembleGameRule`/`connectGameRuleConsequences` blocks (win ×2, Zugzwang ×3) exactly as in `game.js` — keep their order. Do NOT invent rules.

- [ ] **Step 4: Run it, confirm pass**

Run: `npx ng test spoooky-app --watch=false --include='**/checkers.game.spec.ts'`
Expected: PASS (3 tests).

- [ ] **Step 5: Add the registry entry**

In `games/registry.ts`, add to `GAMES`:
```ts
{ id: 'checkers', name: 'Dame', factory: createCheckers, columns: 8, rows: 8, memory: mem('checkers') },
```
and `import { createCheckers } from './checkers.game';`. If `registry.spec.ts` asserts an exact game count, update it (now 4 games). The existing registry tests (ids unique, factory builds at board size, memory namespacing) then also cover checkers.

- [ ] **Step 6: Run registry spec**

Run: `npx ng test spoooky-app --watch=false --include='**/registry.spec.ts'`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add projects/spoooky-app/src/app/games/checkers.game.ts projects/spoooky-app/src/app/games/checkers.game.spec.ts projects/spoooky-app/src/app/games/registry.ts projects/spoooky-app/src/app/games/registry.spec.ts
git commit -m "feat(sp4b): checkers factory + registry entry

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Facade cellView + service board cell model + highlight exposure

**Files:**
- Modify: `projects/spoooky-core/src/lib/facade.ts`
- Modify: `projects/spoooky-core/src/lib/facade.spec.ts`
- Modify: `projects/spoooky-app/src/app/game-engine.service.ts`
- Modify: `projects/spoooky-app/src/app/game-engine.service.spec.ts`

**Interfaces:**
- Produces (facade): `cellView(cell: any): { image: string | null; baseClass: string; cellClass: string }`.
- Produces (service): `board` signal cell type becomes `{ image: string | null; baseClass: string; cellClass: string }`.

- [ ] **Step 1: Write failing facade test**

```ts
// add to facade.spec.ts
import { SpooookyGame } from './facade';
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
```

- [ ] **Step 2: Run core facade test, confirm fail**

Run: `npx ng test spoooky-core --watch=false --include='**/facade.spec.ts'`
Expected: FAIL (`cellView` not a function).

- [ ] **Step 3: Implement facade.cellView**

```ts
// in SpooookyGame
/** Bild + Brettquadrat-Klasse (baseClass) + Highlight-Klasse (cellClass) einer Zelle (SP4b). */
cellView(cell: any): { image: string | null; baseClass: string; cellClass: string } {
  return {
    image: this.getEntityAt(cell)?.view ?? null,
    baseClass: cell?.view?.baseClass ?? '',
    cellClass: cell?.view?.cellClass ?? '',
  };
}
```

- [ ] **Step 4: Run core facade test, build core**

Run: `npx ng test spoooky-core --watch=false --include='**/facade.spec.ts'` → PASS, then `npx ng build spoooky-core`.

- [ ] **Step 5: Write failing service highlight-exposure test**

```ts
// add to game-engine.service.spec.ts
import { createCheckers } from './games/checkers.game';
it('legt baseClass + cellClass je Zelle ab und zeigt Highlights nach Figur-Auswahl', () => {
  const svc = new GameEngineService();
  svc.newGame(createCheckers);
  // Brettmuster ist in jeder Zelle vorhanden:
  expect(svc.board()[0].baseClass).toBe('gridCellWhite');
  expect(svc.board()[1].baseClass).toBe('gridCellBlack');
  expect(svc.board().every((c) => 'cellClass' in c)).toBe(true);
  // Eine spielbare menschliche Figur auswählen (vordere Reihe unten, z. B. (0,5)): Highlights erscheinen.
  svc.cellClicked(0, 5);
  const classes = svc.board().map((c) => c.cellClass);
  expect(classes).toContain('clickedEntity');
  expect(classes.some((c) => c === 'move_standard' || c === 'move_goal')).toBe(true);
});
```

(If (0,5) has no legal move in the start position, pick a front-row human piece that does — derive it from the board; the point is: after selecting a movable human piece, some cell is `clickedEntity` and at least one is a move target.)

- [ ] **Step 6: Run it, confirm fail**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/game-engine.service.spec.ts'`
Expected: FAIL (`baseClass`/`cellClass` undefined on board cells).

- [ ] **Step 7: Implement the service board cell model**

In `game-engine.service.ts`:
- Widen the signal type: `readonly board = signal<Array<{ image: string | null; baseClass: string; cellClass: string }>>([]);`
- In `sync()`, replace the board mapping:
```ts
this.board.set(cells.map((cell: any) => game.cellView(cell)));
```

- [ ] **Step 8: Run it, confirm pass**

Run: `npx ng test spoooky-app --watch=false --include='**/game-engine.service.spec.ts'`
Expected: PASS (existing + new). (Board/other specs that read `board()[i].image` still work — `image` is unchanged.)

- [ ] **Step 9: Commit**

```bash
git add projects/spoooky-core/src/lib/facade.ts projects/spoooky-core/src/lib/facade.spec.ts projects/spoooky-app/src/app/game-engine.service.ts projects/spoooky-app/src/app/game-engine.service.spec.ts
git commit -m "feat(sp4b): facade cellView + service exposes baseClass/cellClass per cell

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Board rendering — square pattern + move highlights + status line

**Files:**
- Modify: `projects/spoooky-app/src/app/board/board.ts` + `board.html` + `board.scss`
- Modify: `projects/spoooky-app/src/app/board/board.spec.ts`
- Modify: `projects/spoooky-app/src/app/game-engine.service.ts` (add `statusText`) + `app.html` (show it)

**Interfaces:**
- Consumes: `board()` cells `{ image, baseClass, cellClass }`.
- Produces (service): `statusText: Signal<string>`.

- [ ] **Step 1: Write failing board test**

```ts
// add to board.spec.ts — a checkers select shows highlight + square classes
it('rendert Brettquadrat-Klassen und Highlight-Klassen (Dame)', async () => {
  const engine = TestBed.inject(GameEngineService);
  engine.newGame(createCheckers);   // import createCheckers at top
  const fixture = TestBed.createComponent(Board);
  await fixture.whenStable();
  // Brettmuster: mindestens eine dunkle und eine helle Zelle.
  expect(fixture.nativeElement.querySelectorAll('.cell.sq-dark').length).toBeGreaterThan(0);
  expect(fixture.nativeElement.querySelectorAll('.cell.sq-light').length).toBeGreaterThan(0);
  // Figur wählen -> Auswahl- + Ziel-Marker erscheinen.
  engine.cellClicked(0, 5);
  await fixture.whenStable();
  expect(fixture.nativeElement.querySelectorAll('.cell.sel').length).toBe(1);
  expect(fixture.nativeElement.querySelectorAll('.cell.target, .cell.capture').length).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Run it, confirm fail**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/board.spec.ts'`
Expected: FAIL (classes not rendered).

- [ ] **Step 3: Implement board.ts mappers**

Add to `Board`:
```ts
/** Brettquadrat-Klasse aus baseClass (nur Dame nutzt dunkel/hell; TicTacToe/Gomoku -> neutral). */
squareClass(i: number): string {
  const b = this.cells()[i]?.baseClass;
  return b === 'gridCellBlack' ? 'sq-dark' : b === 'gridCellWhite' ? 'sq-light' : '';
}
/** Highlight-Klasse aus cellClass (Auswahl / normales Ziel / Schlag-Ziel). */
markClass(i: number): string {
  const c = this.cells()[i]?.cellClass;
  return c === 'clickedEntity' ? 'sel' : c === 'move_standard' ? 'target' : c === 'move_goal' ? 'capture' : '';
}
```

- [ ] **Step 4: Implement board.html**

Add the classes to the cell button and a marker element for targets:
```html
<button class="cell" type="button" (click)="onCellClick($index)"
        [class]="squareClass($index) + ' ' + markClass($index)"
        [class.candidate]="evalAt($index)"
        [class.chosen]="evalAt($index)?.chosen"
        [style]="evalAt($index) ? heatStyle(evalAt($index)!) : null">
  @if (cell.image) { <img [src]="cell.image" alt="" /> }
  @if (markClass($index) === 'target' || markClass($index) === 'capture') {
    <span class="move-marker" [class.capture]="markClass($index) === 'capture'"></span>
  }
  @if (evalAt($index); as e) { <span class="eval">…unchanged…</span> }
</button>
```
(Keep the existing `.board` wrapper with `[style.--cols]` and the thinking overlay. `[class]="..."` adds the dynamic classes alongside the static `cell` class via the separate `class="cell"` attribute — Angular merges `[class]` string binding with the static `class`; verify both are present. If merge is a problem, use `[class.sq-dark]`, `[class.sq-light]`, `[class.sel]`, `[class.target]`, `[class.capture]` individual bindings instead.)

- [ ] **Step 5: Implement board.scss**

Add (keep existing styles):
```scss
.cell.sq-dark { background: var(--board-dark, #6b4f3a); }
.cell.sq-light { background: var(--board-light, #e8d6b3); }
.cell.sel { outline: 3px solid var(--accent); outline-offset: -3px; }
.move-marker {
  position: absolute; width: 34%; height: 34%; border-radius: 50%;
  background: color-mix(in srgb, var(--accent) 70%, transparent); pointer-events: none;
}
.move-marker.capture {
  background: transparent; width: 70%; height: 70%;
  border: 3px solid var(--color-danger, #c0392b);
}
```
(The SP2 heat `[style]` still wins where an evaluation tint applies; that's fine — evaluation overlay and move highlights are rarely both on for the human's own move. Do not remove the default `.cell` background; `sq-dark/sq-light` override it only for checkers.)

- [ ] **Step 6: Add the status line (service + app)**

In `game-engine.service.ts` add:
```ts
readonly statusText = signal<string>('');
private refreshStatus(): void {
  if (this.gameState() === 'END') { this.statusText.set('Spiel beendet.'); return; }
  this.statusText.set(this.currentPlayerType() === 'ARTIFICIAL' ? 'KI denkt …' : 'Du bist am Zug.');
}
```
Call `this.refreshStatus();` at the end of `sync()`. In `app.html`, show it near the board, e.g. `<p class="status">{{ engine-or-component.statusText() }}</p>` (wire via the component's existing engine access; if `app.ts` has no engine field for the template, add `readonly statusText = this.engine.statusText;` there and render `{{ statusText() }}`).

- [ ] **Step 7: Run board + app + service specs**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/board.spec.ts'` (and `--include='**/app.spec.ts'`, `--include='**/game-engine.service.spec.ts'`)
Expected: PASS (adjust app.spec if it asserts header structure).

- [ ] **Step 8: Commit**

```bash
git add projects/spoooky-app/src/app/board/ projects/spoooky-app/src/app/game-engine.service.ts projects/spoooky-app/src/app/game-engine.service.spec.ts projects/spoooky-app/src/app/app.html projects/spoooky-app/src/app/app.ts
git commit -m "feat(sp4b): board renders square pattern + move highlights; status line

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Full verification

**Files:** none (verification + any fallout fixes).

- [ ] **Step 1: Build core, run both suites, build app**

```bash
npx ng build spoooky-core
npx ng test spoooky-core --watch=false
npx ng test spoooky-app --watch=false
npx ng build spoooky-app
```

Expected: all green (core incl. facade; app incl. checkers/blueprint/board/service); run the full app suite TWICE to confirm determinism (SP4a's test-isolation pattern must hold — any new spec that sets `setActiveMemory`/`fetch`/`localStorage` resets them in before+after). Prod build keeps the `ai-worker` chunk.

- [ ] **Step 2: Commit any fallout fixes** (only if the full run surfaced issues the focused specs missed).

```bash
git commit -am "fix(sp4b): <describe>

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Definition of Done (SP4b)

- [ ] `checkers.blueprint.ts` verbatim lift + assets (Task 1).
- [ ] `createCheckers` factory (lifted blueprint, win + Zugzwang rules) + registry "Dame" entry (Task 2).
- [ ] `facade.cellView` + service `board` cells carry `{image, baseClass, cellClass}`; highlight-exposure test (Task 3).
- [ ] Board renders the checkered square pattern + selection/target/capture highlights; status line (Task 4).
- [ ] core + app tests green, deterministic; prod build keeps the worker chunk; TicTacToe/Gomoku unchanged (Task 5).
- [ ] Browser verification (controller): Dame is playable with visible highlighting — select shows the selected piece + legal targets (captures distinct), moving/capturing/kinging works, win detected; highlights legible (dark/light board); per-game memory isolated; 3×3/9×9/15×15 games still render correctly.

## Branch/Integration

Branch `angular-rebuild/sp4b-checkers`, off `master`. PR against `master` (the stacking phase is over — SP1–SP4a are merged). First move-game slice of SP4.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
