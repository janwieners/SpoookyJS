# SP4b2 — Schach (Chess) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add Chess as a playable move game (human=White vs AI=Black) by lifting its data blueprint verbatim and translating its factory, reusing the SP4b move-UI (highlights, status, per-game memory) — engine untouched, no new UI.

**Architecture:** Chess runs in the engine's `MOVING` mode via the same `clickCell` select→move flow as Checkers. Its rules (piece moves, castling, auto-queen promotion, check/checkmate/stalemate) live in `src/js/blueprints/chess.js` + `src/games/chess/game.js`, interpreted by the lifted engine. We lift the blueprint verbatim and translate the factory; the board/facade/service built in SP4b already render highlights and the checkered board.

**Tech Stack:** Angular 22 (standalone, signals, zoneless), Vitest (jsdom), TypeScript, the lifted SpoookyJS engine in `spoooky-core`.

## Global Constraints

- Angular 22, standalone, signals, zoneless. Vitest (jsdom), NOT Karma — Vitest matchers (`toBe(true)`), global test fns. `await fixture.whenStable()`.
- Run core tests: `npx ng test spoooky-core --watch=false`. App tests: `npx ng test spoooky-app --watch=false`. Filter one spec with `--include='**/<name>.spec.ts'` (the positional `-- name` filter is rejected by the CLI). No core file changes expected this slice (so no `ng build spoooky-core` needed unless something forces it).
- Prod build must succeed + keep the worker chunk: `npx ng build spoooky-app`.
- **Engine untouched** (`spoooky-core/src/lib/engine/*`). The lifted `chess.blueprint.ts` is a verbatim copy — do NOT edit its logic. `src/js/*` and `src/games/*` are read-only reference. Only new app-side files + the registry entry change.
- Tests in **sync worker mode**: `setWorkerMode('sync')` in `beforeEach`; keep before+after resets for any spec touching `setActiveMemory`/`fetch`/`localStorage` (deterministic suite — see SP4a isolation pattern).
- German UI copy. No new runtime deps. Working dir: `/Users/sportello/Develop/SpoookyJS/angular`. `src/assets/` → served at `/assets/`.

### Verified facts (reference — do not change the engine)

- `src/js/blueprints/chess.js` (3418 lines) = `Spoooky.Blueprints = { CHESS: { entities:{…}, consequences:{whitePlayer, blackPlayer} } };`. Entities: `{black,white}_{pawn,rook,knight,bishop,queen,king}`. Textures read `assets/<piece>.png` (re-prefix to `assets/chess/`). Auto-promotion is a blueprint consequence ("Transform Entity If Row Reached" → Queen).
- `src/games/chess/game.js` (335 lines) builds the game. **Config deviation for our app:** game.js has BOTH players `HUMAN` and `setPlayer(player2)`. We make player1=White=HUMAN (starts) and player2=Black=ARTIFICIAL, with `setPlayer(player1)`. Everything else (board, blueprints, castling, setup, rules) is translated verbatim.
- Castling: four `extendBlueprint(<rook>, { entityName: "… Rook Left/Right" })` calls (game.js:61-64). Must be replicated exactly.
- Rules (game.js:93-327), translate VERBATIM incl. order and atom/job strings: "Draw: King vs. King", "Check (Player 1)" / "Check (Player 2)" (each consequence does Print + **"Next Player"** + Set State "CHECK"), "Checkmate (Player 1)" / "Checkmate (Player 2)" (Stop + messages + Set Winner), "Stalemate (Player 1)" / "Stalemate (Player 2)". **The "Next Player" consequence in the Check rules is load-bearing for checkmate detection — copy it exactly; do NOT omit or reorder.**
- Assets: `src/games/chess/assets/{black,white}_{pawn,rook,knight,bishop,queen,king}.png` (12 PNGs). Memory: `src/games/chess/agentmemory_1.json` (3-agent ensemble, ~1766 gameStates).
- **Risk to verify in the browser:** game.js originally starts with player2 (black). We start with player1 (white/human). The Check rules' "Next Player" flow must still yield correct check/checkmate turn handling — the browser verification MUST play into a check and a checkmate and confirm correct behavior. If white-starts misbehaves with the check flow, the fallback is `setPlayer(player2)` (AI/black starts) — a one-line change — but try white-starts first per the approved spec.
- SP4b already provides: the board renders `baseClass` (checkered) + `cellClass` highlights; `facade.cellView`; service `board` cell model + `statusText`; per-game memory (`setActiveMemory`, namespacing). **No changes to these are needed.**

## File Structure

- **Create** `games/blueprints/chess.blueprint.ts` — verbatim `@ts-nocheck` lift of `src/js/blueprints/chess.js` (export `CHESS_BLUEPRINT`).
- **Create** `src/assets/chess/{black,white}_{pawn,rook,knight,bishop,queen,king}.png` (12) + `agentmemory_1.json`.
- **Create** `games/chess.game.ts` — `createChess()`.
- **Modify** `games/registry.ts` — add the `chess` descriptor.
- Specs alongside the blueprint + factory.

---

## Task 1: Chess blueprint lift + assets

**Files:**
- Create: `projects/spoooky-app/src/app/games/blueprints/chess.blueprint.ts`
- Create: `projects/spoooky-app/src/assets/chess/*.png` (12), `projects/spoooky-app/src/assets/chess/agentmemory_1.json`
- Test: `projects/spoooky-app/src/app/games/blueprints/chess.blueprint.spec.ts`

**Interfaces:**
- Produces: `export const CHESS_BLUEPRINT` — object with `entities` (the 12 piece blueprints) and `consequences` (`whitePlayer`, `blackPlayer`).

- [ ] **Step 1: Copy assets**

```bash
mkdir -p projects/spoooky-app/src/assets/chess
cp ../src/games/chess/assets/*.png projects/spoooky-app/src/assets/chess/
cp ../src/games/chess/agentmemory_1.json projects/spoooky-app/src/assets/chess/agentmemory_1.json
```
(Confirm 12 PNGs copied: black/white × pawn,rook,knight,bishop,queen,king.)

- [ ] **Step 2: Lift the blueprint verbatim**

Copy the ENTIRE `src/js/blueprints/chess.js` into `projects/spoooky-app/src/app/games/blueprints/chess.blueprint.ts`, then make ONLY these minimal edits (exactly like the SP4b checkers lift — NO logic/move-data changes):
1. Add `// @ts-nocheck` as the first line + a one-line German comment "Verbatim-Lift von src/js/blueprints/chess.js (nur Export-Wrapper und Textur-Pfade angepasst).".
2. Replace the opening `Spoooky.Blueprints = {` … `CHESS : {` wrapper (the `Spoooky.Blueprints = {` line AND the `CHESS :` key) with `export const CHESS_BLUEPRINT = {` so the inner CHESS object becomes the exported value.
3. At the end, remove the extra outer brace so the export closes once (`… };`). Match braces — the import test fails loudly if unbalanced.
4. Re-prefix all 12 texture strings `assets/<piece>.png` → `assets/chess/<piece>.png` (ONLY the texture strings). Verify names against `src/games/chess/assets/`.

- [ ] **Step 3: Write the failing test**

```ts
// projects/spoooky-app/src/app/games/blueprints/chess.blueprint.spec.ts
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
```

- [ ] **Step 4: Run it**

Run: `npx ng test spoooky-app --watch=false --include='**/chess.blueprint.spec.ts'`
Expected: FAIL first (module not found / brace error), then PASS after the lift is correct.

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/games/blueprints/chess.blueprint.ts projects/spoooky-app/src/app/games/blueprints/chess.blueprint.spec.ts projects/spoooky-app/src/assets/chess/
git commit -m "feat(sp4b2): lift chess blueprint verbatim + assets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Chess factory + registry entry

**Files:**
- Create: `projects/spoooky-app/src/app/games/chess.game.ts`
- Test: `projects/spoooky-app/src/app/games/chess.game.spec.ts`
- Modify: `projects/spoooky-app/src/app/games/registry.ts`

**Interfaces:**
- Consumes: `CHESS_BLUEPRINT` (Task 1).
- Produces: `createChess(): SpooookyGame`; registry entry `{ id:'chess', name:'Schach', factory: createChess, columns:8, rows:8, memory: mem('chess') }`.

- [ ] **Step 1: Write the failing test**

```ts
// projects/spoooky-app/src/app/games/chess.game.spec.ts
import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { setActiveMemory, setMemoryEnabled, resetMemory } from '../agent-memory';
import { createChess } from './chess.game';

describe('createChess', () => {
  beforeEach(() => {
    setWorkerMode('sync'); installEngineRuntime();
    resetMemory(); setActiveMemory(null); setMemoryEnabled(false);
    try { localStorage.clear(); } catch { /* ignore */ }
  });
  afterEach(() => { resetMemory(); setActiveMemory(null); setMemoryEnabled(false); try { localStorage.clear(); } catch { /* ignore */ } });

  it('baut ein 8×8-Schachbrett, Mensch (Weiß) beginnt', () => {
    const g = createChess();
    expect(g.getColumns()).toBe(8);
    expect(g.getRows()).toBe(8);
    g.start();
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
  });

  it('stellt 32 Figuren auf (16 je Spieler)', () => {
    const g: any = createChess();
    let n = 0;
    for (const row of g.getGrid()) { for (const c of row) { if (c.contains && c.contains.length) { n++; } } }
    expect(n).toBe(32);
  });

  it('nutzt das karierte Brettmuster', () => {
    const g: any = createChess();
    const grid = g.getGrid();
    expect(grid[0][0].view.baseClass).toBe('gridCellWhite');
    expect(grid[0][1].view.baseClass).toBe('gridCellBlack');
  });
});
```

- [ ] **Step 2: Run it, confirm fail**

Run: `npx ng test spoooky-app --watch=false --include='**/chess.game.spec.ts'`
Expected: FAIL (module not found).

- [ ] **Step 3: Write the factory**

Translate `src/games/chess/game.js` (lines 6–327, i.e. everything EXCEPT the final `Spoooky.AngularWrapper(...)`) into a TS factory, mirroring `games/checkers.game.ts`'s shape and using `CHESS_BLUEPRINT` in place of `Spoooky.Blueprints.CHESS`. Skeleton — fill the full body verbatim from game.js:

```ts
// projects/spoooky-app/src/app/games/chess.game.ts
import { Spoooky, SpooookyGame } from 'spoooky-core';
import { CHESS_BLUEPRINT } from './blueprints/chess.blueprint';

/** Schach. Mensch (Weiß, unten) beginnt gegen die KI (Schwarz, oben). Regeln aus dem gelifteten Blueprint. */
export function createChess(): SpooookyGame {
  const game: any = new Spoooky.Game();
  game.initialize('Schach');

  // APP-ANPASSUNG ggü. game.js: Mensch=Weiß=player1 (beginnt), KI=Schwarz=player2.
  const player1 = game.createPlayer({ name: 'Jan', type: 'HUMAN' });
  const player2 = game.createPlayer({ name: 'Scully', type: 'ARTIFICIAL' });

  const black = 'gridCellBlack', white = 'gridCellWhite';
  game.setupGridWorld(8, 8, [ /* 8× die alternierende white/black-Zeile aus game.js:33-40 */ ]);

  // 7 schwarze + 7 weiße addBlueprint (game.js:44-58) — black_rook/white_rook je zweimal für left/right.
  const black_bishop = game.addBlueprint(player2, CHESS_BLUEPRINT.entities.black_bishop);
  // … king, knight, pawn, queen, rook_left (black_rook), rook_right (black_rook) …
  const white_bishop = game.addBlueprint(player1, CHESS_BLUEPRINT.entities.white_bishop);
  // … king, knight, pawn, queen, rook_left (white_rook), rook_right (white_rook) …

  // Rochade (game.js:61-64) — VERBATIM:
  game.extendBlueprint(black_rook_left, { entityName: 'Black Rook Left' });
  game.extendBlueprint(black_rook_right, { entityName: 'Black Rook Right' });
  game.extendBlueprint(white_rook_left, { entityName: 'White Rook Left' });
  game.extendBlueprint(white_rook_right, { entityName: 'White Rook Right' });

  game.connectConsequences(CHESS_BLUEPRINT.consequences.blackPlayer);
  game.connectConsequences(CHESS_BLUEPRINT.consequences.whitePlayer);

  game.addEntitiesToGameBoard([ /* Standardaufstellung game.js:76-83 verbatim */ ]);

  game.setPlayer(player1);   // APP-ANPASSUNG: Weiß/Mensch beginnt (game.js hatte player2).

  // --- Regeln game.js:93-327 VERBATIM übersetzen (Reihenfolge + Atom-/Job-Strings exakt): ---
  // "Draw: King vs. King"; "Check (Player 1)"/"Check (Player 2)" (inkl. "Next Player" + Set State "CHECK");
  // "Checkmate (Player 1)"/"Checkmate (Player 2)"; "Stalemate (Player 1)"/"Stalemate (Player 2)".
  // Verwende white_king/black_king/player1.getID()/player2.getID() exakt wie in game.js.

  return new SpooookyGame(game);
}
```

Fill EVERY rule block (Draw, Check×2, Checkmate×2, Stalemate×2) exactly as in `game.js` — keep atom names, atomFunctions, atomArguments, consequence jobNames/jobFunctions/jobArguments, and ORDER. The `"Next Player"` consequence inside the two Check rules MUST be kept verbatim. Do NOT invent or reorder rules. (Messages stay as in game.js, e.g. "Player 1 is checkmate." / "Player 2 wins!" — do not translate; they go to the engine log.)

- [ ] **Step 4: Run it, confirm pass**

Run: `npx ng test spoooky-app --watch=false --include='**/chess.game.spec.ts'`
Expected: PASS (3 tests).

- [ ] **Step 5: Add the registry entry**

In `games/registry.ts`: `import { createChess } from './chess.game';` and add to `GAMES`:
```ts
{ id: 'chess', name: 'Schach', factory: createChess, columns: 8, rows: 8, memory: mem('chess') },
```
The existing registry tests (ids unique, factory builds at board size, memory namespacing) then also cover chess.

- [ ] **Step 6: Run registry spec**

Run: `npx ng test spoooky-app --watch=false --include='**/registry.spec.ts'`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add projects/spoooky-app/src/app/games/chess.game.ts projects/spoooky-app/src/app/games/chess.game.spec.ts projects/spoooky-app/src/app/games/registry.ts
git commit -m "feat(sp4b2): chess factory (human=White vs AI=Black) + registry entry

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: Full verification

**Files:** none (verification + any fallout fixes).

- [ ] **Step 1: Run both suites + prod build**

```bash
npx ng build spoooky-core
npx ng test spoooky-core --watch=false
npx ng test spoooky-app --watch=false
npx ng build spoooky-app
```

Expected: all green; run the full app suite TWICE to confirm determinism (the SP4a before+after isolation pattern must hold — the new chess specs reset `setActiveMemory`/`localStorage` as the other game specs do). Prod build keeps the `ai-worker` chunk. No leftover reference errors.

- [ ] **Step 2: Commit any fallout fixes** (only if the full run surfaced issues the focused specs missed).

```bash
git commit -am "fix(sp4b2): <describe>

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Definition of Done (SP4b2)

- [ ] `chess.blueprint.ts` verbatim lift + 12 assets + memory asset (Task 1).
- [ ] `createChess` factory (human=White starts vs AI=Black; castling/auto-queen/check/checkmate/stalemate rules verbatim) + registry "Schach" entry (Task 2).
- [ ] No facade/service/board changes (SP4b UI reused).
- [ ] core + app tests green, deterministic; prod build keeps the worker chunk; other games unchanged (Task 3).
- [ ] Browser verification (controller): Chess playable with highlighting — select a piece shows legal moves; moving/capturing works; **castling** works (click king near a rook → castling target appears & executes); a **pawn auto-promotes to a queen** on the last rank; **check and checkmate** behave correctly (play into a check: turn handling correct; play into a checkmate: game ends with the matt message). Confirm White/human starts (or document if `setPlayer(player2)` fallback was needed). Dame/Gomoku/TicTacToe unchanged; per-game memory isolated. Document the (expected) weak MCTS play.

## Branch/Integration

Branch `angular-rebuild/sp4b2-chess`, off `master`. PR against `master`. Next move-game slice after Dame.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
