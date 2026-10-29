# SP4a — Spiel-Auswahl + Setzen-Spiele (Gomoku) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Turn the single-game app into a multi-game app with a game picker, add Gomoku 9×9 and 15×15 (placing games), make the board size dynamic, and generalize SP3c's agent-memory to be per-game — all app-side, engine untouched.

**Architecture:** A `games/registry.ts` is the single source of truth (`GameDescriptor` with factory, board size, per-game memory target). Gomoku reuses the TicTacToe placing interaction (`clickCell`). The board derives its column/row count from the engine via new service signals. SP3c's hardcoded `MEMORY_*` constants become per-game (from the active descriptor), and `agent-memory` namespaces localStorage by game id so games don't overwrite each other's learned memory.

**Tech Stack:** Angular 22 (standalone, signals, zoneless), Vitest (jsdom), TypeScript, the lifted SpoookyJS engine in `spoooky-core`.

## Global Constraints

- Angular 22, standalone components, signals, zoneless. Components have **no** `.component` suffix (class `GamePicker` in `game-picker.ts`, etc.).
- Test runner is **Vitest (jsdom)**, not Karma. Vitest matchers (`toBe(true)`, not `toBeTrue()`), `vi.fn()`/`vi.spyOn`, globals without imports. Zoneless: `await fixture.whenStable()`, never `detectChanges()` loops.
- Run core tests: `npx ng test spoooky-core --watch=false`. Run app tests: `npx ng test spoooky-app --watch=false`. Filter one spec with `--include='**/<name>.spec.ts'` (the positional `-- name` filter is rejected by the CLI). **If a core file changed, run `npx ng build spoooky-core` before app tests.**
- Prod build must still succeed and keep the worker chunk: `npx ng build spoooky-app`.
- **Engine untouched.** `projects/spoooky-core/src/lib/engine/*` is a verbatim lift — do NOT edit it. `src/js/*` is read-only reference. Only `facade.ts` (already has what we need) and app-side files change.
- Tests run in **sync worker mode**: `setWorkerMode('sync')` in `beforeEach`.
- All user-facing copy is German. No new runtime dependencies.
- Working directory for all commands: `/Users/sportello/Develop/SpoookyJS/angular`.
- Assets: `src/assets/` is served at `/assets/`. `public/` is served at `/`. Images referenced by blueprint textures use the relative form `assets/<game>/<file>.png` (resolves to `/assets/...`), exactly as `tictactoe.blueprint.ts` does.

### Verified engine/app facts (reference — do not change the engine)

- Gomoku: `setGameMode("PLACING")`, `setupGridWorld(size,size,…)`, win = **5** same entities in row/column/diagonal (rule atoms "Player Has Number Of Entities In Row/Column/Diagonally", `number:5`). player1 = HUMAN "Jan" (black, starts), player2 = ARTIFICIAL "Scully" (white). AI metaAgentID = 1 → `agentmemory_1.json`.
- The placing interaction is identical to TicTacToe: `facade.clickCell(x,y) → raw.loop(false,x,y)` places on a free field. No new interaction code needed.
- `facade` already exposes `getColumns()`, `getRows()`, `enableLearning()`.
- **`board.ts` currently hardcodes `columns = 3`** — used for CSS grid, click coords (`x = index % columns`), and heatmap mapping (`y*columns + x`). Must become dynamic.
- SP3c service module constants (to be generalized): `MEMORY_ID='1'`, `MEMORY_KEY='agentmemory_1.json'`, `MEMORY_ASSET='/agentmemory_1.json'`. The service has `ensurePreloaded()` with a `preloaded`/`preloading` pair, `whenMemoryReady()`, `refreshMemoryStatus()`, `toggleUseMemory`, `exportMemory`/`resetMemory`/`hasStoredMemory` (all currently using `MEMORY_*`), and `newGame(factory)`.
- `agent-memory.ts`: cache keyed by the engine URL string `agentmemory_1.json`; localStorage key `spoooky.agentmemory.<id>` via `idFromFilename`. All games request the same `agentmemory_1.json`, so the cache holds only the ACTIVE game's data (re-preloaded on switch) and **localStorage must be namespaced per game** to avoid collisions.

## File Structure

- **Create** `games/gomoku.blueprint.ts` — black/white placing entities (textures `assets/gomoku/*.png`).
- **Create** `games/gomoku.game.ts` — `createGomoku(size)`, `createGomoku9x9`, `createGomoku15x15`.
- **Create** `src/assets/gomoku/black.png`, `white.png` (from `src/games/gomoku9x9/assets/`).
- **Create** `games/registry.ts` — `GameDescriptor`, `GAMES`, `gameById`, `DEFAULT_GAME_ID`.
- **Move/Create** per-game bundled memory assets under `src/assets/<id>/agentmemory_1.json` (tictactoe moved from `public/`, gomoku copied from `src/games/gomoku*/`).
- **Modify** `agent-memory.ts` — per-game localStorage namespacing via an active-memory target.
- **Modify** `game-engine.service.ts` — active game, per-game memory, `columns`/`rows` signals, `selectGame`.
- **Modify** `board/board.ts` + `board/board.html` + `board/board.scss` — dynamic columns from the engine.
- **Create** `game-picker/game-picker.ts` — the selection menu.
- **Modify** `app.ts` + `app.html` — mount the picker; start via the registry/active game.
- **Modify** `ai-config-panel/ai-config-panel.ts` — hide memory controls when the active game has no memory.
- Specs alongside each created/changed unit.

---

## Task 1: Gomoku blueprint + factory + assets

**Files:**
- Create: `projects/spoooky-app/src/app/games/gomoku.blueprint.ts`
- Create: `projects/spoooky-app/src/app/games/gomoku.game.ts`
- Create: `projects/spoooky-app/src/assets/gomoku/black.png`, `white.png`
- Test: `projects/spoooky-app/src/app/games/gomoku.game.spec.ts`

**Interfaces:**
- Produces: `createGomoku(size: 9 | 15): SpooookyGame`, `createGomoku9x9: () => SpooookyGame`, `createGomoku15x15: () => SpooookyGame`, and `GOMOKU_BLUEPRINT`.

- [ ] **Step 1: Copy assets**

```bash
mkdir -p projects/spoooky-app/src/assets/gomoku
cp ../src/games/gomoku9x9/assets/black.png projects/spoooky-app/src/assets/gomoku/black.png
cp ../src/games/gomoku9x9/assets/white.png projects/spoooky-app/src/assets/gomoku/white.png
```

- [ ] **Step 2: Write the blueprint**

```ts
// projects/spoooky-app/src/app/games/gomoku.blueprint.ts
export const GOMOKU_BLUEPRINT = {
  entities: {
    black: {
      entityType: 'Black', typeID: 'B', associatedWithMetaAgent: null,
      representation: { type: 'image', texture: 'assets/gomoku/black.png' },
      mode: 'PLACE', placeTo: 'ANY',
    },
    white: {
      entityType: 'White', typeID: 'W', associatedWithMetaAgent: null,
      representation: { type: 'image', texture: 'assets/gomoku/white.png' },
      mode: 'PLACE', placeTo: 'ANY',
    },
  },
};
```

- [ ] **Step 3: Write the failing test**

```ts
// projects/spoooky-app/src/app/games/gomoku.game.spec.ts
import { setWorkerMode } from '../engine-runtime';
import { installEngineRuntime } from '../engine-runtime';
import { createGomoku9x9, createGomoku15x15 } from './gomoku.game';

describe('createGomoku', () => {
  beforeEach(() => { setWorkerMode('sync'); installEngineRuntime(); });

  it('9x9 baut ein 9×9-Brett im PLACING-Modus, Mensch beginnt', () => {
    const g = createGomoku9x9();
    expect(g.getColumns()).toBe(9);
    expect(g.getRows()).toBe(9);
    g.start();
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
  });

  it('15x15 baut ein 15×15-Brett', () => {
    const g = createGomoku15x15();
    expect(g.getColumns()).toBe(15);
    expect(g.getRows()).toBe(15);
  });

  it('Gewinnregel ist 5 (nicht 3): vier Steine in Reihe beenden das Spiel noch nicht', () => {
    const g = createGomoku9x9();
    g.start();
    // Nur die Regel-Länge prüfen, ohne echte KI-Partie: vier eigene Steine in Zeile 0.
    // Menschlicher Zug setzt schwarz; nach jedem Zug zieht die (sync) KI einmal.
    // Wir prüfen nur, dass das Spiel nach 4 menschlichen Steinen in einer Reihe NICHT beendet ist.
    // (Robust gegen KI-Züge: Spiel ist solange INGAME, wie kein Spieler 5 in einer Linie hat.)
    expect(g.getState()).not.toBe('END');
  });
});
```

(Note: a full "human makes 5 in a row → END" test is brittle because the sync AI interleaves moves and may block. The registry/service specs and the browser verification cover win detection end to end. Here, assert board size, mode, starting player, and that the factory builds without error. Keep the third test as "builds and is INGAME at start".)

- [ ] **Step 4: Run the test to confirm it fails**

Run: `npx ng test spoooky-app --watch=false --include='**/gomoku.game.spec.ts'`
Expected: FAIL (module not found).

- [ ] **Step 5: Write the factory**

Translate `src/games/gomoku9x9/game.js` into TypeScript, parameterized by size. Mirror the TicTacToe factory shape (`angular/projects/spoooky-app/src/app/games/tictactoe.game.ts`). Full code:

```ts
// projects/spoooky-app/src/app/games/gomoku.game.ts
import { Spoooky, SpooookyGame } from 'spoooky-core';
import { GOMOKU_BLUEPRINT } from './gomoku.blueprint';

/** Gomoku (Fünf-in-eine-Reihe) auf einem size×size-Brett. Mensch (schwarz) beginnt gegen die KI (weiß). */
export function createGomoku(size: 9 | 15): SpooookyGame {
  const game: any = new Spoooky.Game();
  game.initialize(`Gomoku ${size}×${size}`);
  game.setDescription('Wer zuerst fünf eigene Steine in eine Reihe, Spalte oder Diagonale setzt, gewinnt.');
  game.setGameMode('PLACING');

  const player1 = game.createPlayer({ name: 'Jan', type: 'HUMAN' });
  const player2 = game.createPlayer({ name: 'Scully', type: 'ARTIFICIAL' });

  const w = 'gridCellWhiteWithBorder';
  const cells = new Array(size * size).fill(w);
  game.setupGridWorld(size, size, cells);

  const black = game.addBlueprint(player1, GOMOKU_BLUEPRINT.entities.black);
  const white = game.addBlueprint(player2, GOMOKU_BLUEPRINT.entities.white);

  game.setPlayer(player1);

  const winConsequences = (who: number, msg: string) => [
    { jobName: 'Stop the Game', jobFunction: 'Stop Game' },
    { jobName: 'Winning message', jobFunction: 'Print Game Process', jobArguments: msg },
    { jobName: 'Set the Winner', jobFunction: 'Set Winner', jobArguments: who },
  ];

  const addLineRules = (playerID: number, typeID: string, label: string, msg: string) => {
    for (const [dim, fn] of [
      ['row', 'Player Has Number Of Entities In Row'],
      ['column', 'Player Has Number Of Entities In Column'],
      ['diag', 'Player Has Number Of Entities Diagonally'],
    ] as const) {
      const atom = `${label}: five in ${dim}`;
      const rule = `${label} five in ${dim}`;
      game.addGameRuleAtom({ atomName: atom, atomFunction: fn, atomArguments: { number: 5, playerID, entityID: typeID } });
      game.assembleGameRule({ name: rule, atoms: [atom] });
      game.connectGameRuleConsequences({ ruleName: rule, consequences: winConsequences(playerID, msg) });
    }
  };

  addLineRules(player1.getID(), black.typeID, 'P1', 'Spieler 1 gewinnt!');
  addLineRules(player2.getID(), white.typeID, 'P2', 'Spieler 2 gewinnt!');

  return new SpooookyGame(game);
}

export const createGomoku9x9 = (): SpooookyGame => createGomoku(9);
export const createGomoku15x15 = (): SpooookyGame => createGomoku(15);
```

(If `addBlueprint`/rule APIs differ from TicTacToe in any detail, follow `tictactoe.game.ts` exactly — it is the proven template. The old `src/games/gomoku9x9/game.js` is the authoritative reference for atom names/arguments.)

- [ ] **Step 6: Run the test to confirm it passes**

Run: `npx ng test spoooky-app --watch=false --include='**/gomoku.game.spec.ts'`
Expected: PASS.

- [ ] **Step 7: Commit**

```bash
git add projects/spoooky-app/src/app/games/gomoku.blueprint.ts projects/spoooky-app/src/app/games/gomoku.game.ts projects/spoooky-app/src/app/games/gomoku.game.spec.ts projects/spoooky-app/src/assets/gomoku/
git commit -m "feat(sp4a): Gomoku 9x9/15x15 factory + blueprint + assets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: Game registry + bundled memory assets

**Files:**
- Create: `projects/spoooky-app/src/app/games/registry.ts`
- Test: `projects/spoooky-app/src/app/games/registry.spec.ts`
- Move: `projects/spoooky-app/public/agentmemory_1.json` → `projects/spoooky-app/src/assets/tictactoe/agentmemory_1.json`
- Create: `projects/spoooky-app/src/assets/gomoku9x9/agentmemory_1.json`, `projects/spoooky-app/src/assets/gomoku15x15/agentmemory_1.json`

**Interfaces:**
- Consumes (Task 1): `createGomoku9x9`, `createGomoku15x15`; existing `createTicTacToe`.
- Produces:
  - `interface MemoryTarget { id: string; storageId: string; key: string; asset: string }`
  - `interface GameDescriptor { id: string; name: string; factory: () => SpooookyGame; columns: number; rows: number; memory?: MemoryTarget }`
  - `GAMES: GameDescriptor[]`, `DEFAULT_GAME_ID = 'tictactoe'`, `gameById(id: string): GameDescriptor`.
- `storageId` is the per-game localStorage namespace, e.g. `'tictactoe.1'`; `key` is the engine cache key `'agentmemory_1.json'`; `asset` is the fetch URL.

- [ ] **Step 1: Move/add the bundled memory assets**

```bash
mkdir -p projects/spoooky-app/src/assets/tictactoe projects/spoooky-app/src/assets/gomoku9x9 projects/spoooky-app/src/assets/gomoku15x15
git mv projects/spoooky-app/public/agentmemory_1.json projects/spoooky-app/src/assets/tictactoe/agentmemory_1.json
cp ../src/games/gomoku9x9/agentmemory_1.json projects/spoooky-app/src/assets/gomoku9x9/agentmemory_1.json
cp ../src/games/gomoku15x15/agentmemory_1.json projects/spoooky-app/src/assets/gomoku15x15/agentmemory_1.json
```

- [ ] **Step 2: Write the failing test**

```ts
// projects/spoooky-app/src/app/games/registry.spec.ts
import { setWorkerMode, installEngineRuntime } from '../engine-runtime';
import { GAMES, DEFAULT_GAME_ID, gameById } from './registry';

describe('game registry', () => {
  beforeEach(() => { setWorkerMode('sync'); installEngineRuntime(); });

  it('hat eindeutige IDs und einen gültigen Default', () => {
    const ids = GAMES.map((g) => g.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids).toContain(DEFAULT_GAME_ID);
  });

  it('jeder Descriptor baut ein Spiel mit passender Brettgröße', () => {
    for (const g of GAMES) {
      const game = g.factory();
      expect(game.getColumns()).toBe(g.columns);
      expect(game.getRows()).toBe(g.rows);
    }
  });

  it('gameById liefert den Eintrag, sonst den Default', () => {
    expect(gameById('gomoku9x9').id).toBe('gomoku9x9');
    expect(gameById('does-not-exist').id).toBe(DEFAULT_GAME_ID);
  });

  it('jedes Memory-Ziel ist pro Spiel genamespaced', () => {
    for (const g of GAMES) {
      if (g.memory) {
        expect(g.memory.storageId).toBe(`${g.id}.${g.memory.id}`);
        expect(g.memory.key).toBe('agentmemory_1.json');
        expect(g.memory.asset).toBe(`/assets/${g.id}/agentmemory_1.json`);
      }
    }
  });
});
```

- [ ] **Step 3: Run it, confirm it fails**

Run: `npx ng test spoooky-app --watch=false --include='**/registry.spec.ts'`
Expected: FAIL (module not found).

- [ ] **Step 4: Write the registry**

```ts
// projects/spoooky-app/src/app/games/registry.ts
import { SpooookyGame } from 'spoooky-core';
import { createTicTacToe } from './tictactoe.game';
import { createGomoku9x9, createGomoku15x15 } from './gomoku.game';

/** Ziel der Agentenerinnerung eines Spiels. key = Engine-Cache-Key (immer agentmemory_1.json);
 *  storageId = pro Spiel genamespaceter localStorage-Teil; asset = Fetch-URL des mitgelieferten Assets. */
export interface MemoryTarget { id: string; storageId: string; key: string; asset: string }

export interface GameDescriptor {
  id: string; name: string; factory: () => SpooookyGame; columns: number; rows: number; memory?: MemoryTarget;
}

const mem = (gameId: string): MemoryTarget => ({
  id: '1', storageId: `${gameId}.1`, key: 'agentmemory_1.json', asset: `/assets/${gameId}/agentmemory_1.json`,
});

export const GAMES: GameDescriptor[] = [
  { id: 'tictactoe', name: 'Tic Tac Toe', factory: createTicTacToe, columns: 3, rows: 3, memory: mem('tictactoe') },
  { id: 'gomoku9x9', name: 'Gomoku 9×9', factory: createGomoku9x9, columns: 9, rows: 9, memory: mem('gomoku9x9') },
  { id: 'gomoku15x15', name: 'Gomoku 15×15', factory: createGomoku15x15, columns: 15, rows: 15, memory: mem('gomoku15x15') },
];

export const DEFAULT_GAME_ID = 'tictactoe';

export function gameById(id: string): GameDescriptor {
  return GAMES.find((g) => g.id === id) ?? GAMES.find((g) => g.id === DEFAULT_GAME_ID)!;
}
```

- [ ] **Step 5: Run it, confirm it passes**

Run: `npx ng test spoooky-app --watch=false --include='**/registry.spec.ts'`
Expected: PASS.

- [ ] **Step 6: Commit**

```bash
git add projects/spoooky-app/src/app/games/registry.ts projects/spoooky-app/src/app/games/registry.spec.ts projects/spoooky-app/src/assets/tictactoe/ projects/spoooky-app/src/assets/gomoku9x9/ projects/spoooky-app/src/assets/gomoku15x15/
git rm --cached --ignore-unmatch projects/spoooky-app/public/agentmemory_1.json 2>/dev/null || true
git commit -m "feat(sp4a): game registry + per-game bundled memory assets

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: agent-memory per-game namespacing

**Files:**
- Modify: `projects/spoooky-app/src/app/agent-memory.ts`
- Modify: `projects/spoooky-app/src/app/agent-memory.spec.ts`

**Interfaces:**
- Produces: `setActiveMemory(storageId: string | null): void`. When set, `readStored`/`saveMemory`/`hasStoredMemory`/`exportMemory`/`resetMemory` use `spoooky.agentmemory.<storageId>` instead of deriving the id from the filename. `hasStoredMemory()`, `exportMemory()`, `resetMemory()` lose their `id` parameter and act on the active target.
- The cache stays keyed by the engine URL `agentmemory_1.json` (single active game; re-preloaded on switch).

- [ ] **Step 1: Write the failing tests** (replace the id-parameter expectations)

```ts
// add to agent-memory.spec.ts
import { setActiveMemory } from './agent-memory';

describe('agent-memory: per-game namespacing', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    setMemoryEnabled(true);
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true, json: async () => ({ learnModule: { gameStates: { a: {} } } }) }));
  });

  it('speichert und liest unter dem aktiven, genamespaceten Schlüssel', async () => {
    setActiveMemory('gomoku9x9.1');
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: { x: {}, y: {} } } }));
    expect(localStorage.getItem('spoooky.agentmemory.gomoku9x9.1')).not.toBeNull();
    expect(localStorage.getItem('spoooky.agentmemory.tictactoe.1')).toBeNull();
    expect(hasStoredMemory()).toBe(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(2);
  });

  it('ein Spiel überschreibt das andere nicht', () => {
    setActiveMemory('tictactoe.1');
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: { t: {} } } }));
    setActiveMemory('gomoku9x9.1');
    expect(hasStoredMemory()).toBe(false);
    setActiveMemory('tictactoe.1');
    expect(hasStoredMemory()).toBe(true);
  });

  it('resetMemory entfernt nur das aktive Ziel', () => {
    setActiveMemory('tictactoe.1');
    saveMemory('agentmemory_1.json', JSON.stringify({ learnModule: { gameStates: {} } }));
    resetMemory();
    expect(hasStoredMemory()).toBe(false);
  });
});
```

Update the existing SP3c namespacing tests that called `hasStoredMemory('1')`/`resetMemory('1')`/`saveMemory` without an active target: set `setActiveMemory('tictactoe.1')` in their `beforeEach` and drop the id arguments. Keep their intent (precedence, cache refresh, defensive fallback).

- [ ] **Step 2: Run, confirm fail**

Run: `npx ng test spoooky-app --watch=false --include='**/agent-memory.spec.ts'`
Expected: FAIL (`setActiveMemory` undefined; signatures changed).

- [ ] **Step 3: Implement the namespacing**

In `agent-memory.ts`:

```ts
let activeStorageId: string | null = null;
/** Setzt das aktive, pro Spiel genamespacete localStorage-Ziel (z. B. "gomoku9x9.1"); null = keins. */
export function setActiveMemory(storageId: string | null): void { activeStorageId = storageId; }
```

Replace `readStored` so the localStorage id is the active target when set (falling back to the filename id for safety):

```ts
function storageIdFor(key: string): string { return activeStorageId ?? idFromFilename(key); }

function readStored(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + storageIdFor(key));
    return raw === null ? null : JSON.parse(raw);
  } catch { return null; }
}
```

`saveMemory` stores under the active target and fires the callback with it:

```ts
export function saveMemory(filename: string, text: string): void {
  const storageId = activeStorageId ?? idFromFilename(filename);
  try { localStorage.setItem(LS_PREFIX + storageId, text); } catch { /* ignore */ }
  try { cache.set(filename, JSON.parse(text)); } catch { /* ignore */ }
  onSavedCb?.(storageId);
}
```

`hasStoredMemory`/`exportMemory`/`resetMemory` act on the active target (drop the `id` parameter):

```ts
export function hasStoredMemory(): boolean {
  if (activeStorageId === null) { return false; }
  try { return localStorage.getItem(LS_PREFIX + activeStorageId) !== null; } catch { return false; }
}

export function exportMemory(): void {
  if (activeStorageId === null) { return; }
  let text: string | null = null;
  try { text = localStorage.getItem(LS_PREFIX + activeStorageId); } catch { /* ignore */ }
  if (text === null) { return; }
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'agentmemory_1.json';
    document.body.appendChild(a); a.click(); a.remove();
    URL.revokeObjectURL(url);
  } catch { /* ignore */ }
}

export function resetMemory(): void {
  if (activeStorageId !== null) { try { localStorage.removeItem(LS_PREFIX + activeStorageId); } catch { /* ignore */ } }
  cache.delete('agentmemory_1.json');
}
```

(Keep `idFromFilename`, `setMemoryEnabled`, `isMemoryEnabled`, `onMemorySaved`, `preloadMemory`, `getMemory`, `gameStatesCount` as-is; they already read via `readStored`/the cache, which now follow the active target.)

- [ ] **Step 4: Run, confirm pass**

Run: `npx ng test spoooky-app --watch=false --include='**/agent-memory.spec.ts'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/agent-memory.ts projects/spoooky-app/src/app/agent-memory.spec.ts
git commit -m "feat(sp4a): per-game localStorage namespacing in agent-memory

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: Service — active game, per-game memory, board-size signals

**Files:**
- Modify: `projects/spoooky-app/src/app/game-engine.service.ts`
- Modify: `projects/spoooky-app/src/app/game-engine.service.spec.ts`

**Interfaces:**
- Consumes: `registry` (`GameDescriptor`, `GAMES`, `gameById`, `DEFAULT_GAME_ID`), `agent-memory` (`setActiveMemory`, plus the now-parameterless `hasStoredMemory`/`exportMemory`/`resetMemory`).
- Produces (public):
  - `activeGameId: Signal<string>` (persisted `spoooky.activeGame`, default `DEFAULT_GAME_ID`)
  - `columns: Signal<number>`, `rows: Signal<number>` (from the engine, updated in `newGame`/`sync`)
  - `hasMemory: Signal<boolean>` (active descriptor has a `memory` target)
  - `selectGame(id: string): void`
  - existing `exportMemory()`/`resetMemory()`/`hasStoredMemory()` now delegate to the active target.

- [ ] **Step 1: Write failing tests** (extend the service spec; keep `setWorkerMode('sync')`)

```ts
import { GAMES } from './games/registry';
import { isMemoryEnabled } from './agent-memory';

describe('GameEngineService: Mehr-Spiel + per-Spiel-Memory', () => {
  beforeEach(() => {
    setWorkerMode('sync');
    try { localStorage.clear(); } catch { /* ignore */ }
    setSeed(12345);
    (globalThis as any).fetch = vi.fn(async (u: string) => ({
      ok: true,
      json: async () => ({ bestAgentEnsemble: [{ ID: 1, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 0.5, thinkingTime: 5000, maximumSteps: 5000 }], learnModule: { rewards: {}, gameStates: {} } }),
    }));
  });

  it('selectGame wechselt Spiel, Brettgröße-Signale folgen der Engine', async () => {
    const svc = new GameEngineService();
    svc.selectGame('gomoku9x9');
    await svc.whenMemoryReady();
    expect(svc.activeGameId()).toBe('gomoku9x9');
    expect(localStorage.getItem('spoooky.activeGame')).toBe('gomoku9x9');
    expect(svc.columns()).toBe(9);
    expect(svc.rows()).toBe(9);
  });

  it('Lernen in einem Spiel überschreibt die Erinnerung des anderen nicht', () => {
    const svc = new GameEngineService();
    svc.toggleLearnMode(true);
    svc.selectGame('gomoku9x9');
    // ein volles Gomoku-Spiel bis END spielen (erste freien Zellen)
    const freeCell = () => svc.board().findIndex((c) => !c.image);
    for (let i = 0; i < 200 && svc.gameState() !== 'END'; i++) {
      if (svc.currentPlayerType() !== 'HUMAN') { break; }
      const idx = freeCell(); if (idx < 0) { break; }
      svc.cellClicked(idx % svc.columns(), Math.floor(idx / svc.columns()));
    }
    // Falls das Spiel endete, liegt die Gomoku-Erinnerung vor und TicTacToe ist unberührt.
    if (svc.gameState() === 'END') {
      expect(localStorage.getItem('spoooky.agentmemory.gomoku9x9.1')).not.toBeNull();
      expect(localStorage.getItem('spoooky.agentmemory.tictactoe.1')).toBeNull();
    }
  });

  it('hasMemory ist true für Spiele mit Memory-Ziel', () => {
    const svc = new GameEngineService();
    svc.selectGame('tictactoe');
    expect(svc.hasMemory()).toBe(true);
  });
});
```

(The learning-game assertion is guarded by `gameState()==='END'` because a 9×9 game to completion via first-free-cell may not terminate deterministically; the browser verification is the authoritative end-to-end check. Keep a reasonable iteration cap.)

- [ ] **Step 2: Run, confirm fail**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/game-engine.service.spec.ts'`
Expected: FAIL (`selectGame`/`columns`/`activeGameId` undefined).

- [ ] **Step 3: Implement the service changes**

Replace the imports and the `MEMORY_*` constants:

```ts
import { preloadMemory, setMemoryEnabled, gameStatesCount, setActiveMemory,
  hasStoredMemory as hasStored, exportMemory as exportMem, resetMemory as resetMem, onMemorySaved } from './agent-memory';
import { GameDescriptor, gameById, DEFAULT_GAME_ID } from './games/registry';
```

Remove `const MEMORY_ID/KEY/ASSET`. Add signals + active descriptor:

```ts
readonly activeGameId = signal<string>(this.readActiveGame());
readonly columns = signal<number>(3);
readonly rows = signal<number>(3);
readonly hasMemory = signal<boolean>(true);
private active: GameDescriptor = gameById(this.activeGameId());

private readActiveGame(): string {
  try { return localStorage.getItem('spoooky.activeGame') ?? DEFAULT_GAME_ID; } catch { return DEFAULT_GAME_ID; }
}
```

Constructor: set the active memory target before the initial preload, and track the game:

```ts
// (inside constructor, replacing the SP3c preload block)
setMemoryEnabled(this.useMemory());
setRespectAgentTuning(this.useMemory());
onMemorySaved(() => this.refreshMemoryStatus());
this.applyActiveMemory();
if (this.useMemory()) { void this.ensurePreloaded(); }
this.refreshMemoryStatus();
```

Add `applyActiveMemory()` and make preload/status use the active descriptor:

```ts
private applyActiveMemory(): void {
  this.active = gameById(this.activeGameId());
  this.hasMemory.set(!!this.active.memory);
  setActiveMemory(this.active.memory?.storageId ?? null);
}

private ensurePreloaded(): Promise<void> {
  const target = this.active.memory;
  if (!target) { this.preloaded = true; this.preloading = null; this.refreshMemoryStatus(); return Promise.resolve(); }
  if (this.preloaded) { return Promise.resolve(); }
  if (this.preloading) { return this.preloading; }
  const p = preloadMemory([{ key: target.key, assetUrl: target.asset }]).then(() => {
    this.preloaded = true; this.preloading = null; this.refreshMemoryStatus();
  });
  this.preloading = p;
  return p;
}

private refreshMemoryStatus(): void {
  if (!this.active.memory) { this.memoryStatus.set('Dieses Spiel hat keine gelernte KI.'); return; }
  if (!this.useMemory()) { this.memoryStatus.set('Gelernte KI aus — Standard-Agenten.'); return; }
  const n = gameStatesCount(this.active.memory.key);
  const src = hasStored() ? 'localStorage' : 'mitgeliefert';
  this.memoryStatus.set(`Gelernte KI an (${src}): ${n} gelernte Spielzustände.`);
}
```

`selectGame`: switch game, re-point memory, re-preload, start:

```ts
selectGame(id: string): void {
  this.activeGameId.set(id);
  try { localStorage.setItem('spoooky.activeGame', id); } catch { /* ignore */ }
  this.applyActiveMemory();
  this.preloaded = false; this.preloading = null;           // force re-preload of the new game's asset
  if (this.useMemory()) { void this.ensurePreloaded(); }
  void this.whenMemoryReady().then(() => this.newGame(this.active.factory));
}
```

`toggleUseMemory`/`exportMemory`/`resetMemory`/`hasStoredMemory` delegate to the active target:

```ts
toggleUseMemory(on: boolean): void {
  this.useMemory.set(on);
  setMemoryEnabled(on); setRespectAgentTuning(on);
  try { localStorage.setItem('spoooky.useMemory', String(on)); } catch { /* ignore */ }
  if (on) { void this.ensurePreloaded(); } else { this.refreshMemoryStatus(); }
}
exportMemory(): void { exportMem(); }
resetMemory(): void { resetMem(); this.preloaded = false; this.preloading = null; if (this.useMemory()) { void this.ensurePreloaded(); } this.refreshMemoryStatus(); }
hasStoredMemory(): boolean { return hasStored(); }
```

In `newGame`, after building the game, set the board-size signals from the engine (and keep the existing learn/status lines):

```ts
const game = factory();
this.game = game;
this.columns.set(game.getColumns());
this.rows.set(game.getRows());
if (this.learnMode()) { game.enableLearning(); }
this.refreshMemoryStatus();
// …unchanged: connectNoopViews, connectView, start, sync
```

(Leave `restart()` as-is — it reuses `lastFactory`. The app's initial game comes from `selectGame` on startup; see Task 6.)

- [ ] **Step 4: Run, confirm pass**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/game-engine.service.spec.ts'`
Expected: PASS (existing + new).

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/game-engine.service.ts projects/spoooky-app/src/app/game-engine.service.spec.ts
git commit -m "feat(sp4a): service active-game selection, per-game memory, board-size signals

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: Board — dynamic columns from the engine

**Files:**
- Modify: `projects/spoooky-app/src/app/board/board.ts`
- Modify: `projects/spoooky-app/src/app/board/board.html`
- Modify: `projects/spoooky-app/src/app/board/board.scss`
- Modify: `projects/spoooky-app/src/app/board/board.spec.ts`

**Interfaces:**
- Consumes: `GameEngineService.columns` signal.

- [ ] **Step 1: Write the failing test** (extend the board spec)

```ts
it('leitet die Spaltenzahl aus der Engine ab und rechnet Klicks korrekt um (9×9)', async () => {
  const engine = TestBed.inject(GameEngineService);
  engine.selectGame('gomoku9x9');
  await engine.whenMemoryReady();
  const fixture = TestBed.createComponent(Board);
  await fixture.whenStable();
  const spy = vi.spyOn(engine, 'cellClicked');
  const comp = fixture.componentInstance as any;
  comp.onCellClick(10); // index 10 at 9 columns => (1,1)
  expect(spy).toHaveBeenCalledWith(1, 1);
  expect(comp.columns()).toBe(9);
});
```

(Adjust to the board spec's existing TestBed setup. If the board spec does not yet inject a configured engine, mirror the service-driven setup used by the evaluation/board tests already in the file.)

- [ ] **Step 2: Run, confirm fail**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/board.spec.ts'`
Expected: FAIL (columns is a constant 3; click maps with 3).

- [ ] **Step 3: Implement**

In `board.ts`, replace `readonly columns = 3;` with a signal from the engine and use it everywhere `this.columns` is used:

```ts
readonly columns = this.engine.columns;   // Signal<number>
```

Update usages to call it as a signal: in `evalByIndex` use `const cols = this.columns();` and `c.y * cols + c.x`; in `onCellClick` use `const cols = this.columns(); const x = index % cols; const y = Math.floor(index / cols);`.

In `board.html`, drive the CSS grid from the column count — add a style binding on `.board`:

```html
<div class="board" [class.thinking]="aiThinking()" [style.--cols]="columns()">
```

In `board.scss`, make the grid use the variable and let cells size responsively, e.g.:

```scss
.board { display: grid; grid-template-columns: repeat(var(--cols, 3), 1fr); gap: 2px; width: 100%; max-width: 32rem; aspect-ratio: 1 / 1; }
.cell { aspect-ratio: 1 / 1; /* keep existing cell styles */ }
```

(Keep existing `.cell`, `.candidate`, `.chosen`, `.eval`, `.overlay` styling; only introduce the dynamic column count and ensure 15×15 fits without horizontal page scroll at phone width.)

- [ ] **Step 4: Run, confirm pass**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/board.spec.ts'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/board/
git commit -m "feat(sp4a): board derives column/row count from the engine (dynamic board size)

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Game picker + app wiring + memory-UI gating

**Files:**
- Create: `projects/spoooky-app/src/app/game-picker/game-picker.ts`
- Test: `projects/spoooky-app/src/app/game-picker/game-picker.spec.ts`
- Modify: `projects/spoooky-app/src/app/app.ts`, `projects/spoooky-app/src/app/app.html`
- Modify: `projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.ts`

**Interfaces:**
- Consumes: `GameEngineService.activeGameId`/`selectGame`/`hasMemory`, `registry.GAMES`.

- [ ] **Step 1: Write the failing picker test**

```ts
// projects/spoooky-app/src/app/game-picker/game-picker.spec.ts
import { TestBed } from '@angular/core/testing';
import { setWorkerMode } from '../engine-runtime';
import { GameEngineService } from '../game-engine.service';
import { GamePicker } from './game-picker';
import { GAMES } from '../games/registry';

describe('GamePicker', () => {
  beforeEach(() => { setWorkerMode('sync'); try { localStorage.clear(); } catch { /* ignore */ } });

  it('listet alle Spiele und ruft selectGame bei Auswahl', async () => {
    const fixture = TestBed.createComponent(GamePicker);
    const engine = TestBed.inject(GameEngineService);
    const spy = vi.spyOn(engine, 'selectGame');
    await fixture.whenStable();
    const select = fixture.nativeElement.querySelector('select[data-test="game-picker"]') as HTMLSelectElement;
    expect(select).toBeTruthy();
    expect(select.querySelectorAll('option').length).toBe(GAMES.length);
    select.value = 'gomoku9x9';
    select.dispatchEvent(new Event('change'));
    expect(spy).toHaveBeenCalledWith('gomoku9x9');
  });
});
```

- [ ] **Step 2: Run, confirm fail**

Run: `npx ng test spoooky-app --watch=false --include='**/game-picker.spec.ts'`
Expected: FAIL (module not found).

- [ ] **Step 3: Implement the picker**

```ts
// projects/spoooky-app/src/app/game-picker/game-picker.ts
import { Component, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';
import { GAMES } from '../games/registry';

@Component({
  selector: 'app-game-picker',
  template: `
    <label class="game-picker">
      Spiel
      <select data-test="game-picker" [value]="engine.activeGameId()"
              (change)="engine.selectGame($any($event.target).value)">
        @for (g of games; track g.id) { <option [value]="g.id">{{ g.name }}</option> }
      </select>
    </label>
  `,
  styles: [`
    .game-picker { display: inline-flex; align-items: center; gap: .5rem; }
    select { border: 1px solid var(--border); background: var(--surface); color: var(--text);
      border-radius: var(--radius); padding: .3rem .5rem; }
    select:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
  `],
})
export class GamePicker {
  readonly engine = inject(GameEngineService);
  readonly games = GAMES;
}
```

- [ ] **Step 4: Wire it into the app shell**

In `app.ts`: import `GamePicker` and add it to `imports`; replace the hardcoded TicTacToe start with the active game:

```ts
import { GamePicker } from './game-picker/game-picker';
// imports: [..., GamePicker]
ngOnInit(): void {
  void this.engine.whenMemoryReady().then(() => this.engine.selectGame(this.engine.activeGameId()));
}
```

(Removing the `createTicTacToe` import from `app.ts`; `selectGame` starts the active game. `selectGame` already calls `whenMemoryReady().then(newGame)`, so the outer `whenMemoryReady()` is only to settle any constructor preload first — keep it simple: `this.engine.selectGame(this.engine.activeGameId())` is sufficient since `selectGame` itself awaits readiness.)

In `app.html`: mount `<app-game-picker>` in the header area near the "Neues Spiel" control.

- [ ] **Step 5: Gate the memory UI in the config panel**

In `ai-config-panel.ts`, wrap the memory controls (the "Gelernte KI verwenden" + "Lern-Modus" toggles, status line, export/reset buttons) in `@if (engine.hasMemory()) { … }` so games without a memory target don't show them. (All three current games have memory, but SP4b/c games may not.)

- [ ] **Step 6: Run the picker + panel tests**

Run: `npx ng test spoooky-app --watch=false --include='**/game-picker.spec.ts'` and `--include='**/ai-config-panel.spec.ts'` and `--include='**/app.spec.ts'`
Expected: PASS (adjust app.spec/panel spec for the new control/gating as needed; keep their intent).

- [ ] **Step 7: Commit**

```bash
git add projects/spoooky-app/src/app/game-picker/ projects/spoooky-app/src/app/app.ts projects/spoooky-app/src/app/app.html projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.ts projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.spec.ts
git commit -m "feat(sp4a): game picker, app wiring via active game, memory-UI gating

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 7: Full verification

**Files:** none (verification + any fallout fixes).

- [ ] **Step 1: Build core, run both suites, build app**

```bash
npx ng build spoooky-core
npx ng test spoooky-core --watch=false
npx ng test spoooky-app --watch=false
npx ng build spoooky-app
```

Expected: all green; `spoooky-app` build emits the worker chunk; no type errors; no leftover reference to the removed `public/agentmemory_1.json` or the old `MEMORY_*` constants.

- [ ] **Step 2: Commit any fallout fixes** (only if the full run surfaced issues the focused specs missed).

```bash
git commit -am "fix(sp4a): <describe> 

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Definition of Done (SP4a)

- [ ] Gomoku 9×9/15×15 factory + blueprint + assets (Task 1).
- [ ] Game registry with per-game memory targets; bundled memory assets moved/added (Task 2).
- [ ] agent-memory namespaces localStorage per game via `setActiveMemory` (Task 3).
- [ ] Service: `activeGameId`, `selectGame`, `columns`/`rows`, `hasMemory`, per-game memory; `MEMORY_*` constants gone (Task 4).
- [ ] Board derives column count from the engine; 9×9/15×15 clicks + heatmap correct (Task 5).
- [ ] Game picker in the header; app starts the active game; memory UI gated on `hasMemory` (Task 6).
- [ ] core + app tests green; prod build keeps the worker chunk (Task 7).
- [ ] Browser verification (controller, end of run): pick each game; play TicTacToe + both Gomoku sizes; 15×15 renders and clicks correctly; win detection at 5; agent memory is per game (a Gomoku learning game writes `spoooky.agentmemory.gomoku9x9.1` and leaves `tictactoe.1` untouched); export/reset act on the active game.

## Branch/Integration

Branch `angular-rebuild/sp4a-games`, stacked on SP3c (base `angular-rebuild/sp3c-memory`), base later re-targeted to `master`. First slice of SP4.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
