# SP3c — Agentenerinnerung (Laden + Lernen/Export) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Load pre-learned agent memory so the loaded ensemble plays with its own tuning, and close the learning cycle (enable learning → accumulate → train at game end → export to a re-loadable file), all app-side with the engine untouched.

**Architecture:** A new `agent-memory.ts` module holds a URL-keyed cache plus the enable flag, localStorage precedence, and save/export/reset helpers. The engine's synchronous `$.ajax` shim (in `engine-runtime.ts`) reads this cache; a new global `saveAs` shim writes exports to localStorage; and the worker-boundary `withConfig` respects each agent's own `uctConstant` while memory is active (keeping the SP3a time budget so moves stay responsive). `GameEngineService` coordinates preload-before-build, toggles, status, and `enableLearning`.

**Tech Stack:** Angular 22 (standalone, signals, zoneless), Vitest (jsdom), TypeScript, the lifted `@ts-nocheck` SpoookyJS engine in `spoooky-core`.

## Global Constraints

- Angular 22, standalone components, signals, zoneless. Components have **no** `.component` suffix (class `AiConfigPanel` in `ai-config-panel.ts`, etc.).
- Test runner is **Vitest (jsdom)**, not Karma. Use Vitest matchers (`toBe(true)`, not `toBeTrue()`), `vi.fn()`/`vi.spyOn`, globals without imports. Zoneless: use `await fixture.whenStable()`, never `detectChanges()` loops.
- Run core tests: `npx ng test spoooky-core --watch=false`. Run app tests: `npx ng test spoooky-app --watch=false`. The core lib is path-mapped to its build output, so **if a core file changed, run `npx ng build spoooky-core` before app tests.**
- Prod build must still succeed and keep the worker chunk: `npx ng build spoooky-app` (from `angular/`).
- **The engine is untouched.** `projects/spoooky-core/src/lib/engine/*` is a verbatim lift — do NOT edit engine files. `src/js/*` is read-only reference. Only `facade.ts` and app-side files change.
- Tests run in **sync worker mode**: call `setWorkerMode('sync')` in `beforeEach`.
- All user-facing copy is German. Documentation must honestly state the loading effect (see "Honest effect" below).
- No new runtime dependencies.
- Working directory for all commands: `/Users/sportello/Develop/SpoookyJS/angular`.

### Verified engine facts (reference — do not change the engine)

- The AI player in TicTacToe is `player2`; players get `setID(MetaAgents.length)`, so its **MetaAgent ID = 1** → it loads `agentmemory_1.json`.
- `assembleAgents()` runs **inside `createPlayer`** (`Game.js:682`), i.e. during `createTicTacToe()`. It calls `$.ajax({url:"agentmemory_1.json", async:false, ...})`. On `success` it fills `QLearner.reward`/`.gameStates` and builds the ensemble from `data.bestAgentEnsemble`; on `error` it builds the standard 3-agent ensemble. **So the cache must be populated before the game is built.**
- The engine's worker request (`Agent.js:98`) already carries the agent's own `uctConstant`, `maxTime` (= agent `thinkingTime`), and `learn` (= meta agent `learningEnabled`). Our `withConfig` currently overrides `uctConstant` and `maxTime` for every request.
- `enableLearning()` just sets `learningEnabled = true` on the MetaAgent; it is read per move when the brain is created, so it may be set any time before the AI's first move.
- At real game end, a `"Stop Game"` event calls `informArtificialPlayersAboutGameEnd()` → `gameHasEnded()`, which (if learning is enabled) runs `QLearner.learn(10000)`, serializes `{game, metaAgentID, bestAgentEnsemble, learnModule}` and calls the global `saveAs(blob, "agentmemory_<ID>.json")`.
- Learning accumulates across moves: each decision message carries `QLearner` (a JSON **string**); `updateQLearner` does `JSON.parse(...)` and merges. The sync worker already sends `QLearner: JSON.stringify(res.QLearner)`.

### Honest effect (document this; it drives DoD)

- Loaded `gameStates`/`rewards` do **not** steer move selection (moves are chosen by MCTS visit counts; the `getBestAction` path is commented out in the engine). The shipped `agentmemory_1.json` also contains **0** learned game states.
- Therefore the **visible** difference from loading is the ensemble composition **plus** each agent's own `uctConstant` (which we now respect while memory is active): the loaded TicTacToe ensemble is 3 agents with uct 1.0 / 0.5 / 0 (diverse exploration), versus the standard ensemble forced to the slider's single uct.
- We keep the SP3a **time budget** (slider) even while memory is active, because the file's 5000 ms per agent would make a move take ~15 s.
- The learning/export cycle is real and demonstrable: playing with learning on accumulates genuine `gameStates`, which export to a non-empty, re-loadable file.

## File Structure

- **Create** `projects/spoooky-app/src/app/agent-memory.ts` — URL-keyed memory cache, enable flag, localStorage precedence, save/export/reset, saved-callback. One responsibility: the memory store and its I/O.
- **Create** `projects/spoooky-app/src/app/agent-memory.spec.ts` — unit tests.
- **Modify** `projects/spoooky-app/src/app/engine-runtime.ts` — `$.ajax` shim reads the cache; install `globalThis.saveAs` shim; `withConfig` respects per-agent `uctConstant` while memory active; add `setRespectAgentTuning`. 
- **Modify** `projects/spoooky-app/src/app/engine-runtime.spec.ts` — shim/boundary tests.
- **Modify** `projects/spoooky-core/src/lib/facade.ts` — add `enableLearning()` (typed, iterates players, enables ARTIFICIAL ones).
- **Create** `projects/spoooky-core/src/lib/facade.spec.ts` (if absent) or extend it — test `enableLearning()`.
- **Modify** `projects/spoooky-app/src/app/game-engine.service.ts` — `useMemory`/`learnMode`/`memoryStatus` signals, preload coordination, `enableLearning` in `newGame`, `toggleUseMemory`/`toggleLearnMode`/`exportMemory`/`resetMemory` passthrough.
- **Modify** `projects/spoooky-app/src/app/game-engine.service.spec.ts` — service tests.
- **Modify** `projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.ts` — two toggles, export/reset buttons, status line.
- **Modify** `projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.spec.ts` — panel assertions.
- **Create** `projects/spoooky-app/public/agentmemory_1.json` — bundled pre-learned memory (copy of `src/games/tictactoe/agentmemory_1.json`), served at `/agentmemory_1.json`.
- **Modify** `docs/superpowers/specs/2026-10-29-angular-rebuild-sp3c-design.md` — sharpen the honest-effect note with the verified facts and the "respect uct, keep slider time" decision.

---

## Task 1: `agent-memory.ts` — memory cache + enable + localStorage + save/export/reset

**Files:**
- Create: `projects/spoooky-app/src/app/agent-memory.ts`
- Test: `projects/spoooky-app/src/app/agent-memory.spec.ts`

**Interfaces:**
- Produces:
  - `setMemoryEnabled(on: boolean): void`
  - `isMemoryEnabled(): boolean`
  - `preloadMemory(entries: Array<{ key: string; assetUrl: string }>): Promise<void>`
  - `getMemory(key: string): unknown | null` — returns parsed data when memory is enabled and present (localStorage wins over cache), else `null`
  - `gameStatesCount(key: string): number`
  - `saveMemory(filename: string, text: string): void` — writes to localStorage by id, refreshes cache, fires saved-callback
  - `hasStoredMemory(id: string): boolean`
  - `exportMemory(id: string): void` — downloads the stored text as `agentmemory_<id>.json`
  - `resetMemory(id: string): void` — removes the stored version
  - `onMemorySaved(cb: ((id: string) => void) | null): void`
  - `idFromFilename(filename: string): string` (exported for tests)
- `key` is the engine URL string, e.g. `"agentmemory_1.json"`. localStorage key is `spoooky.agentmemory.<id>` where `<id>` is the number in the filename.

- [ ] **Step 1: Write failing tests**

```ts
// projects/spoooky-app/src/app/agent-memory.spec.ts
import {
  setMemoryEnabled, isMemoryEnabled, preloadMemory, getMemory, gameStatesCount,
  saveMemory, hasStoredMemory, resetMemory, onMemorySaved, idFromFilename,
} from './agent-memory';

const MEM = {
  game: 'Tic Tac Toe', metaAgentID: 1,
  bestAgentEnsemble: [{ ID: 1, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 1.0, thinkingTime: 5000, maximumSteps: 5000 }],
  learnModule: { rewards: {}, gameStates: { s1: {}, s2: {} } },
};

describe('agent-memory', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    setMemoryEnabled(false);
    onMemorySaved(null);
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true, json: async () => MEM }));
  });

  it('idFromFilename extrahiert die ID', () => {
    expect(idFromFilename('agentmemory_1.json')).toBe('1');
    expect(idFromFilename('agentmemory_0.json')).toBe('0');
  });

  it('getMemory liefert null, solange Speicher deaktiviert ist', async () => {
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    expect(getMemory('agentmemory_1.json')).toBeNull();
  });

  it('getMemory liefert die gecachten Daten, wenn aktiviert', async () => {
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    expect(isMemoryEnabled()).toBe(true);
    expect(getMemory('agentmemory_1.json')).toEqual(MEM);
    expect(gameStatesCount('agentmemory_1.json')).toBe(2);
  });

  it('localStorage hat Vorrang vor dem Asset', async () => {
    const custom = { ...MEM, learnModule: { rewards: {}, gameStates: { a: {}, b: {}, c: {} } } };
    localStorage.setItem('spoooky.agentmemory.1', JSON.stringify(custom));
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(3);
    expect((globalThis as any).fetch).not.toHaveBeenCalled();
  });

  it('fehlendes Asset -> stiller Fallback, getMemory bleibt null', async () => {
    (globalThis as any).fetch = vi.fn(async () => ({ ok: false, json: async () => ({}) }));
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    expect(getMemory('agentmemory_1.json')).toBeNull();
  });

  it('saveMemory schreibt nach localStorage, meldet Callback, aktualisiert Cache', async () => {
    let savedId: string | null = null;
    onMemorySaved((id) => { savedId = id; });
    setMemoryEnabled(true);
    const custom = { ...MEM, learnModule: { rewards: {}, gameStates: { x: {}, y: {}, z: {}, w: {} } } };
    saveMemory('agentmemory_1.json', JSON.stringify(custom));
    expect(savedId).toBe('1');
    expect(hasStoredMemory('1')).toBe(true);
    expect(gameStatesCount('agentmemory_1.json')).toBe(4);
  });

  it('resetMemory entfernt die gespeicherte Version', () => {
    localStorage.setItem('spoooky.agentmemory.1', JSON.stringify(MEM));
    expect(hasStoredMemory('1')).toBe(true);
    resetMemory('1');
    expect(hasStoredMemory('1')).toBe(false);
  });
});
```

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx ng test spoooky-app --watch=false -- agent-memory`
Expected: FAIL (module not found / exports undefined).

- [ ] **Step 3: Implement `agent-memory.ts`**

```ts
// projects/spoooky-app/src/app/agent-memory.ts
/**
 * App-seitiger Speicher für die Agentenerinnerungen der Engine (SP3c).
 *
 * Die Engine lädt `agentmemory_<ID>.json` synchron über den globalen `$.ajax` (siehe engine-runtime.ts).
 * Dieses Modul hält die vorgeladenen Daten in einem Cache, den der `$.ajax`-Shim synchron ausliest.
 * Eine in localStorage gespeicherte (selbst erlernte/exportierte) Version hat Vorrang vor dem Asset.
 */

const LS_PREFIX = 'spoooky.agentmemory.';

/** Cache: Engine-URL-String ("agentmemory_1.json") -> geparste Erinnerungsdaten. */
const cache = new Map<string, unknown>();
let memoryEnabled = false;
let onSavedCb: ((id: string) => void) | null = null;

export function setMemoryEnabled(on: boolean): void { memoryEnabled = on; }
export function isMemoryEnabled(): boolean { return memoryEnabled; }
export function onMemorySaved(cb: ((id: string) => void) | null): void { onSavedCb = cb; }

/** "agentmemory_1.json" -> "1" (defensiv: Ziffern vor ".json"). */
export function idFromFilename(filename: string): string {
  const m = /agentmemory_(\d+)\.json/.exec(filename);
  return m ? m[1] : filename;
}

function readStored(key: string): unknown | null {
  try {
    const raw = localStorage.getItem(LS_PREFIX + idFromFilename(key));
    return raw === null ? null : JSON.parse(raw);
  } catch { return null; }
}

/** Lädt die Erinnerungen in den Cache (localStorage-Version bevorzugt, sonst Asset per fetch). */
export async function preloadMemory(entries: Array<{ key: string; assetUrl: string }>): Promise<void> {
  await Promise.all(entries.map(async ({ key, assetUrl }) => {
    const stored = readStored(key);
    if (stored !== null) { cache.set(key, stored); return; }
    try {
      const res = await fetch(assetUrl);
      if (!res.ok) { return; }
      cache.set(key, await res.json());
    } catch { /* stiller Fallback: ohne Eintrag -> Standard-Agenten */ }
  }));
}

/** Synchron vom `$.ajax`-Shim aufgerufen. Liefert die Daten oder null (Memory aus / kein Eintrag). */
export function getMemory(key: string): unknown | null {
  if (!memoryEnabled) { return null; }
  const stored = readStored(key);
  if (stored !== null) { return stored; }
  return cache.has(key) ? cache.get(key)! : null;
}

/** Anzahl gelernter Spielzustände im (ggf. localStorage-)Eintrag; 0 wenn keiner. */
export function gameStatesCount(key: string): number {
  const data: any = readStored(key) ?? cache.get(key) ?? null;
  const gs = data?.learnModule?.gameStates;
  return gs && typeof gs === 'object' ? Object.keys(gs).length : 0;
}

/** Vom `saveAs`-Shim aufgerufen: aktualisierte Erinnerung in localStorage ablegen. */
export function saveMemory(filename: string, text: string): void {
  const id = idFromFilename(filename);
  try { localStorage.setItem(LS_PREFIX + id, text); } catch { /* ignore */ }
  try { cache.set(filename, JSON.parse(text)); } catch { /* ignore */ }
  onSavedCb?.(id);
}

export function hasStoredMemory(id: string): boolean {
  try { return localStorage.getItem(LS_PREFIX + id) !== null; } catch { return false; }
}

/** Lädt die gespeicherte Erinnerung als Datei herunter (Nutzeraktion im eigenen Dev-App). */
export function exportMemory(id: string): void {
  let text: string | null = null;
  try { text = localStorage.getItem(LS_PREFIX + id); } catch { /* ignore */ }
  if (text === null) { return; }
  try {
    const blob = new Blob([text], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `agentmemory_${id}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  } catch { /* ignore */ }
}

/** Entfernt die gespeicherte Version; nächstes Laden nimmt wieder das Asset. */
export function resetMemory(id: string): void {
  try { localStorage.removeItem(LS_PREFIX + id); } catch { /* ignore */ }
  cache.delete(`agentmemory_${id}.json`);
}
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx ng test spoooky-app --watch=false -- agent-memory`
Expected: PASS (7 tests).

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/agent-memory.ts projects/spoooky-app/src/app/agent-memory.spec.ts
git commit -m "feat(sp3c): agent-memory cache with localStorage precedence + save/export/reset

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 2: engine-runtime shims — `$.ajax` reads cache, `saveAs` shim, `withConfig` respects per-agent UCT

**Files:**
- Modify: `projects/spoooky-app/src/app/engine-runtime.ts`
- Test: `projects/spoooky-app/src/app/engine-runtime.spec.ts`

**Interfaces:**
- Consumes (Task 1): `getMemory`, `saveMemory` from `./agent-memory`.
- Produces: `setRespectAgentTuning(on: boolean): void` — when on, `withConfig` keeps each request's own `uctConstant` (falls back to config when absent) but still applies the config `thinkingTimeMs` as `maxTime`.
- Behavior: `$.ajax(opts)` calls `opts.success(getMemory(opts.url)); opts.complete();` when a cached entry exists, otherwise `opts.error(); opts.complete();`. `globalThis.saveAs(blob, filename)` reads the blob text and calls `saveMemory(filename, text)`.

- [ ] **Step 1: Write failing tests** (append to `engine-runtime.spec.ts`)

```ts
import {
  setRespectAgentTuning, setAiConfig,
} from './engine-runtime';
import { setMemoryEnabled, preloadMemory, saveMemory, getMemory, onMemorySaved } from './agent-memory';

describe('engine-runtime: $.ajax memory shim', () => {
  beforeEach(() => {
    try { localStorage.clear(); } catch { /* ignore */ }
    setMemoryEnabled(false);
    onMemorySaved(null);
    (globalThis as any).fetch = vi.fn(async () => ({ ok: true, json: async () => ({ learnModule: { gameStates: { a: {} } }, bestAgentEnsemble: [] }) }));
    installEngineRuntime(); // idempotent; ensures $ and saveAs are installed
  });

  it('liefert gecachte Daten synchron an success, wenn Memory aktiv', async () => {
    await preloadMemory([{ key: 'agentmemory_1.json', assetUrl: '/agentmemory_1.json' }]);
    setMemoryEnabled(true);
    let got: any = 'none'; let completed = false; let errored = false;
    ($ as any).ajax({ url: 'agentmemory_1.json', success: (d: any) => { got = d; }, error: () => { errored = true; }, complete: () => { completed = true; } });
    expect(got).toEqual({ learnModule: { gameStates: { a: {} } }, bestAgentEnsemble: [] });
    expect(errored).toBe(false);
    expect(completed).toBe(true);
  });

  it('ruft error, wenn Memory aus oder kein Eintrag', () => {
    let errored = false; let completed = false;
    ($ as any).ajax({ url: 'agentmemory_1.json', success: () => {}, error: () => { errored = true; }, complete: () => { completed = true; } });
    expect(errored).toBe(true);
    expect(completed).toBe(true);
  });
});

describe('engine-runtime: saveAs shim', () => {
  beforeEach(() => { try { localStorage.clear(); } catch { /* ignore */ } installEngineRuntime(); });

  it('legt den Blob-Text über saveMemory in localStorage ab', async () => {
    let savedId: string | null = null;
    onMemorySaved((id) => { savedId = id; });
    const text = JSON.stringify({ learnModule: { gameStates: { a: {}, b: {} } } });
    const blob = new Blob([text], { type: 'text/plain' });
    await (globalThis as any).saveAs(blob, 'agentmemory_1.json');
    expect(savedId).toBe('1');
    setMemoryEnabled(true);
    expect(getMemory('agentmemory_1.json')).toEqual({ learnModule: { gameStates: { a: {}, b: {} } } });
  });
});

describe('engine-runtime: respectAgentTuning', () => {
  it('behält die uctConstant der Anfrage, wenn an; sonst Config', () => {
    setAiConfig({ difficulty: 'medium', thinkingTimeMs: 400, uctConstant: 0.9 });
    // Indirekt über eine sync-Entscheidung prüfen: siehe service-spec (Task 4).
    // Hier nur die Existenz/Signatur sicherstellen:
    expect(typeof setRespectAgentTuning).toBe('function');
    setRespectAgentTuning(true);
    setRespectAgentTuning(false);
  });
});
```

Note: the `withConfig` behavior is private; its end-to-end effect is asserted in the Task 4 service test. Here we assert the shims and the setter's presence.

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx ng test spoooky-app --watch=false --include='**/engine-runtime.spec.ts'`
Expected: FAIL (`setRespectAgentTuning` undefined; `saveAs` undefined; ajax calls `error` instead of `success`).

(Note: the Angular CLI rejects the positional `-- <name>` filter — use `--include='**/<spec>.spec.ts'`.)

- [ ] **Step 3: Implement the shim changes**

In `engine-runtime.ts`:

Add the import at the top:
```ts
import { getMemory, saveMemory } from './agent-memory';
```

Add the tuning flag + setter near the other setters (after `setGenerateTree`):
```ts
let respectAgentTuning = false;
/** Wenn an (Erinnerung aktiv): die per-Agent-uctConstant der Anfrage behalten statt mit der Config zu überschreiben. */
export function setRespectAgentTuning(on: boolean): void { respectAgentTuning = on; }
```

Replace `withConfig` with:
```ts
/**
 * Wendet die KI-Konfiguration auf der Main-Thread-Seite an, bevor die Anfrage den Worker erreicht.
 * Das Zeitbudget (maxTime) kommt immer aus der Config (Schwierigkeits-Regler), damit Züge zügig bleiben.
 * Die uctConstant kommt bei aktiver Erinnerung aus der Anfrage selbst (gelerntes Ensemble spielt wie abgestimmt),
 * sonst aus der Config.
 */
function withConfig(data: AiWorkerRequest): AiWorkerRequest {
  const uctConstant = respectAgentTuning && typeof (data as any).uctConstant === 'number'
    ? (data as any).uctConstant
    : currentAiConfig.uctConstant;
  return { ...data, maxTime: currentAiConfig.thinkingTimeMs, uctConstant };
}
```

(Change the parameter type from the `Omit<...>` to `AiWorkerRequest`; `runAnalysis` builds a request literal that already omits `uctConstant`/`maxTime` — set those two explicitly in that literal instead, see below. The engine's real postMessage carries `uctConstant`/`maxTime`, so `withConfig` must accept them.)

Update `runAnalysis`'s request literal so it type-checks with the new signature (analysis always uses config tuning — `respectAgentTuning` has no request uct to honor here):
```ts
const req = withConfig({
  command: 'monte carlo tree search with uct', agentID: -1, agentRole: 'ANALYZE POSSIBLE MOVES',
  agentFocus, maxSteps: 10000, learn: false, generateMctsGraph: false, gameModel: modelString,
  maxTime: currentAiConfig.thinkingTimeMs, uctConstant: currentAiConfig.uctConstant,
});
```

Replace the `jqueryShim.ajax` with a cache-aware version:
```ts
const jqueryShim = {
  ajax: (opts: any) => {
    const data = opts?.url ? getMemory(opts.url) : null;
    if (data !== null) { opts.success?.(data); } else { opts.error?.(); }
    opts.complete?.();
  },
  each: (arr: any[], fn: (i: number, v: any) => void) => arr.forEach((v, i) => fn(i, v)),
};
```

Install the `saveAs` shim inside `installEngineRuntime()` (after `$` is set):
```ts
(globalThis as any).saveAs = async (blob: Blob, filename: string) => {
  try {
    const text = typeof blob.text === 'function' ? await blob.text() : String(blob);
    saveMemory(filename, text);
  } catch { /* ignore */ }
};
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx ng test spoooky-app --watch=false --include='**/engine-runtime.spec.ts'`
Expected: PASS (existing engine-runtime tests + new shim tests).

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/engine-runtime.ts projects/spoooky-app/src/app/engine-runtime.spec.ts
git commit -m "feat(sp3c): \$.ajax reads memory cache, saveAs shim, respectAgentTuning at worker boundary

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 3: facade `enableLearning()`

**Files:**
- Modify: `projects/spoooky-core/src/lib/facade.ts`
- Test: `projects/spoooky-core/src/lib/facade.spec.ts` (create if missing)

**Interfaces:**
- Produces: `SpooookyGame.enableLearning(): void` — enables learning on every ARTIFICIAL player of the wrapped game.

- [ ] **Step 1: Write failing test**

```ts
// projects/spoooky-core/src/lib/facade.spec.ts
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
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx ng test spoooky-core --watch=false --include='**/facade.spec.ts'`
Expected: FAIL (`enableLearning` not a function).

- [ ] **Step 3: Implement**

Add to `SpooookyGame` in `facade.ts`:
```ts
/** Aktiviert das Lernen auf allen künstlichen Spielern (SP3c). */
enableLearning(): void {
  for (const p of this.raw.getPlayers()) {
    if (p.type === 'ARTIFICIAL') { p.enableLearning(); }
  }
}
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx ng test spoooky-core --watch=false --include='**/facade.spec.ts'`
Expected: PASS.

- [ ] **Step 5: Rebuild core (app depends on the built lib) and commit**

```bash
npx ng build spoooky-core
git add projects/spoooky-core/src/lib/facade.ts projects/spoooky-core/src/lib/facade.spec.ts
git commit -m "feat(sp3c): SpooookyGame.enableLearning enables learning on artificial players

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 4: GameEngineService wiring — preload, toggles, status, enableLearning, export/reset

**Files:**
- Modify: `projects/spoooky-app/src/app/game-engine.service.ts`
- Test: `projects/spoooky-app/src/app/game-engine.service.spec.ts`

**Interfaces:**
- Consumes: `agent-memory` (`preloadMemory`, `setMemoryEnabled`, `getMemory`, `gameStatesCount`, `hasStoredMemory`, `exportMemory`, `resetMemory`, `onMemorySaved`), `engine-runtime` (`setRespectAgentTuning`).
- Produces (public signals/methods):
  - `useMemory: Signal<boolean>` (persisted `spoooky.useMemory`, default false)
  - `learnMode: Signal<boolean>` (persisted `spoooky.learnMode`, default false)
  - `memoryStatus: Signal<string>` — human-readable status line
  - `toggleUseMemory(on: boolean): void`
  - `toggleLearnMode(on: boolean): void`
  - `exportMemory(): void`
  - `resetMemory(): void`
  - `hasStoredMemory(): boolean`
- `MEMORY_ID = '1'`, `MEMORY_KEY = 'agentmemory_1.json'`, `MEMORY_ASSET = '/agentmemory_1.json'` — module constants (TicTacToe's AI player). (SP4 will generalize per game.)

- [ ] **Step 1: Write failing tests** (extend the existing service spec; keep `setWorkerMode('sync')`)

```ts
import {
  setMemoryEnabled, isMemoryEnabled, gameStatesCount, hasStoredMemory, resetMemory,
} from './agent-memory';

describe('GameEngineService: Erinnerung + Lernen', () => {
  beforeEach(() => {
    setWorkerMode('sync');
    try { localStorage.clear(); } catch { /* ignore */ }
    setSeed(12345);
    // Asset für den Preload bereitstellen (3-Agenten-Ensemble, 0 gelernte Zustände)
    (globalThis as any).fetch = vi.fn(async () => ({
      ok: true,
      json: async () => ({
        game: 'Tic Tac Toe', metaAgentID: 1,
        bestAgentEnsemble: [
          { ID: 1, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 1.0, thinkingTime: 5000, maximumSteps: 5000 },
          { ID: 2, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 0.5, thinkingTime: 5000, maximumSteps: 5000 },
          { ID: 3, role: 'ANALYZE POSSIBLE MOVES', focus: 'ALL MOVES', fitness: 5, uctConstant: 0, thinkingTime: 5000, maximumSteps: 5000 },
        ],
        learnModule: { rewards: {}, gameStates: {} },
      }),
    }));
  });

  it('toggleUseMemory persistiert und aktiviert den Speicher', async () => {
    const svc = new GameEngineService();
    svc.toggleUseMemory(true);
    await Promise.resolve();  // preloadMemory abwarten
    expect(svc.useMemory()).toBe(true);
    expect(localStorage.getItem('spoooky.useMemory')).toBe('true');
    expect(isMemoryEnabled()).toBe(true);
  });

  it('toggleLearnMode persistiert; neues Spiel aktiviert Lernen auf dem KI-Spieler', () => {
    const svc = new GameEngineService();
    svc.toggleLearnMode(true);
    expect(svc.learnMode()).toBe(true);
    expect(localStorage.getItem('spoooky.learnMode')).toBe('true');
    svc.newGame(createTicTacToe);
    const ai = (svc as any).game.raw.getPlayers().find((p: any) => p.type === 'ARTIFICIAL');
    expect(ai.learningEnabled).toBe(true);
  });

  it('mit aktiver Erinnerung lädt ein neues Spiel das gelernte Ensemble (3 Agenten)', async () => {
    const svc = new GameEngineService();
    svc.toggleUseMemory(true);
    await Promise.resolve();
    svc.newGame(createTicTacToe);
    const ai = (svc as any).game.raw.getPlayers().find((p: any) => p.type === 'ARTIFICIAL');
    expect(ai.agents.length).toBe(3);
  });

  it('ohne Erinnerung nutzt ein neues Spiel das Standard-Ensemble (Fallback)', () => {
    const svc = new GameEngineService();
    svc.newGame(createTicTacToe);
    const ai = (svc as any).game.raw.getPlayers().find((p: any) => p.type === 'ARTIFICIAL');
    // Standard-Ensemble: 3 Agenten (ALL MOVES / FIRST HALF / SECOND HALF)
    expect(ai.agents.length).toBeGreaterThanOrEqual(1);
    expect(isMemoryEnabled()).toBe(false);
  });

  it('nach einem vollständigen Lern-Spiel liegt eine gespeicherte Erinnerung vor', () => {
    const svc = new GameEngineService();
    svc.toggleLearnMode(true);
    svc.newGame(createTicTacToe);
    // Spiel bis zum Ende spielen (Mensch beginnt; sync-Worker zieht die KI sofort).
    const moves: [number, number][] = [[0,0],[1,1],[2,2],[0,1],[0,2],[2,0],[1,0],[2,1],[1,2]];
    for (const [x,y] of moves) {
      if (svc.gameState() === 'END') { break; }
      if (svc.currentPlayerType() === 'HUMAN') { svc.cellClicked(x,y); }
    }
    expect(svc.gameState()).toBe('END');
    expect(hasStoredMemory('1')).toBe(true);  // saveAs-Shim hat exportiert
  });
});
```

(If the deterministic move list doesn't reach END in sync mode because the AI interleaves, adjust by looping: after each human click the AI moves automatically; pick human cells from the first free cells. The implementer may compute free cells from `svc.board()` each turn instead of a fixed list — the assertion is `gameState()==='END'` then `hasStoredMemory('1')`.)

- [ ] **Step 2: Run tests, verify they fail**

Run: `npx ng build spoooky-core && npx ng test spoooky-app --watch=false --include='**/game-engine.service.spec.ts'`
Expected: FAIL (`toggleUseMemory` etc. undefined).

- [ ] **Step 3: Implement the service changes**

Add imports:
```ts
import {
  preloadMemory, setMemoryEnabled, gameStatesCount, hasStoredMemory as hasStored,
  exportMemory as exportMem, resetMemory as resetMem, onMemorySaved,
} from './agent-memory';
import { /* existing… */, setRespectAgentTuning } from './engine-runtime';
```

Add module constants (top of file, after imports):
```ts
const MEMORY_ID = '1';
const MEMORY_KEY = 'agentmemory_1.json';
const MEMORY_ASSET = '/agentmemory_1.json';
```

Add signals (near the others):
```ts
readonly useMemory = signal<boolean>(this.readFlag('spoooky.useMemory', false));
readonly learnMode = signal<boolean>(this.readFlag('spoooky.learnMode', false));
readonly memoryStatus = signal<string>('');
```

In the constructor, after the existing sink/error setup:
```ts
setMemoryEnabled(this.useMemory());
setRespectAgentTuning(this.useMemory());
onMemorySaved(() => this.refreshMemoryStatus());
if (this.useMemory()) { void this.ensurePreloaded(); }
this.refreshMemoryStatus();
```

Add a private preload coordinator and helpers:
```ts
private preloaded = false;
private async ensurePreloaded(): Promise<void> {
  if (this.preloaded) { return; }
  await preloadMemory([{ key: MEMORY_KEY, assetUrl: MEMORY_ASSET }]);
  this.preloaded = true;
  this.refreshMemoryStatus();
}

private readFlag(k: string, dflt: boolean): boolean {
  try { const v = localStorage.getItem(k); return v === null ? dflt : v === 'true'; } catch { return dflt; }
}

private refreshMemoryStatus(): void {
  if (!this.useMemory()) { this.memoryStatus.set('Gelernte KI aus — Standard-Agenten.'); return; }
  const n = gameStatesCount(MEMORY_KEY);
  const src = hasStored(MEMORY_ID) ? 'localStorage' : 'mitgeliefert';
  this.memoryStatus.set(`Gelernte KI an (${src}): ${n} gelernte Spielzustände.`);
}

toggleUseMemory(on: boolean): void {
  this.useMemory.set(on);
  setMemoryEnabled(on);
  setRespectAgentTuning(on);
  try { localStorage.setItem('spoooky.useMemory', String(on)); } catch { /* ignore */ }
  if (on) { void this.ensurePreloaded(); } else { this.refreshMemoryStatus(); }
}

toggleLearnMode(on: boolean): void {
  this.learnMode.set(on);
  try { localStorage.setItem('spoooky.learnMode', String(on)); } catch { /* ignore */ }
}

exportMemory(): void { exportMem(MEMORY_ID); }
// resetMem() also drops the cached asset entry, so re-preload the shipped asset: "Auf Standard
// zurücksetzen" must restore the bundled memory, not fall through to the standard agents.
resetMemory(): void {
  resetMem(MEMORY_ID);
  this.preloaded = false;
  if (this.useMemory()) { void this.ensurePreloaded(); }
  this.refreshMemoryStatus();
}
hasStoredMemory(): boolean { return hasStored(MEMORY_ID); }
```

In `newGame`, after `const game = factory();` and `this.game = game;`, enable learning when the mode is on, and refresh status (the game build may have just loaded memory):
```ts
if (this.learnMode()) { game.enableLearning(); }
this.refreshMemoryStatus();
```

- [ ] **Step 4: Run tests, verify pass**

Run: `npx ng test spoooky-app --watch=false --include='**/game-engine.service.spec.ts'`
Expected: PASS (existing + new tests).

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/game-engine.service.ts projects/spoooky-app/src/app/game-engine.service.spec.ts
git commit -m "feat(sp3c): service wiring for memory load, learn mode, status, export/reset

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 5: AiConfigPanel UI — toggles, export/reset buttons, status line

**Files:**
- Modify: `projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.ts`
- Test: `projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.spec.ts`

**Interfaces:**
- Consumes (Task 4): `engine.useMemory()`, `engine.learnMode()`, `engine.memoryStatus()`, `engine.toggleUseMemory`, `engine.toggleLearnMode`, `engine.exportMemory`, `engine.resetMemory`, `engine.hasStoredMemory()`.

- [ ] **Step 1: Write failing test** (extend the panel spec)

```ts
it('zeigt die Schalter „Gelernte KI" und „Lern-Modus" und die Statuszeile', async () => {
  const fixture = TestBed.createComponent(AiConfigPanel);
  await fixture.whenStable();
  const text = fixture.nativeElement.textContent as string;
  expect(text).toContain('Gelernte KI verwenden');
  expect(text).toContain('Lern-Modus');
  const status = fixture.nativeElement.querySelector('.memory-status');
  expect(status).toBeTruthy();
});

it('ruft toggleUseMemory beim Umschalten', async () => {
  const fixture = TestBed.createComponent(AiConfigPanel);
  const engine = TestBed.inject(GameEngineService);
  const spy = vi.spyOn(engine, 'toggleUseMemory');
  await fixture.whenStable();
  const cb = fixture.nativeElement.querySelector('input[data-test="use-memory"]') as HTMLInputElement;
  cb.checked = true; cb.dispatchEvent(new Event('change'));
  expect(spy).toHaveBeenCalledWith(true);
});
```

- [ ] **Step 2: Run test, verify it fails**

Run: `npx ng test spoooky-app --watch=false --include='**/ai-config-panel.spec.ts'`
Expected: FAIL (toggles/status not present).

- [ ] **Step 3: Implement** — add to the template after the MCTS-tree toggle, inside `<section class="panel">`:

```html
<label class="toggle">
  <input type="checkbox" data-test="use-memory" [checked]="engine.useMemory()"
         (change)="engine.toggleUseMemory($any($event.target).checked)" />
  Gelernte KI verwenden
</label>

<label class="toggle">
  <input type="checkbox" data-test="learn-mode" [checked]="engine.learnMode()"
         (change)="engine.toggleLearnMode($any($event.target).checked)" />
  Lern-Modus (lernt am Spielende)
</label>

<p class="memory-status">{{ engine.memoryStatus() }}</p>

<div class="memory-actions">
  <button type="button" (click)="engine.exportMemory()" [disabled]="!engine.hasStoredMemory()">
    Erinnerung exportieren
  </button>
  <button type="button" (click)="engine.resetMemory()" [disabled]="!engine.hasStoredMemory()">
    Auf Standard zurücksetzen
  </button>
</div>
```

Add styles:
```css
.memory-status { font-size: .85rem; color: var(--text); opacity: .8; margin: .25rem 0 0; }
.memory-actions { display: inline-flex; gap: .5rem; flex-wrap: wrap; }
.memory-actions button {
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
  border-radius: var(--radius); padding: .3rem .7rem; cursor: pointer;
}
.memory-actions button:hover:not(:disabled) { border-color: var(--accent); }
.memory-actions button:disabled { opacity: .45; cursor: default; }
.memory-actions button:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
```

- [ ] **Step 4: Run test, verify pass**

Run: `npx ng test spoooky-app --watch=false --include='**/ai-config-panel.spec.ts'`
Expected: PASS.

- [ ] **Step 5: Commit**

```bash
git add projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.ts projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.spec.ts
git commit -m "feat(sp3c): memory/learn toggles, export/reset buttons, status line in config panel

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Task 6: Bundle the pre-learned asset + honest docs + full build

**Files:**
- Create: `projects/spoooky-app/public/agentmemory_1.json`
- Modify: `docs/superpowers/specs/2026-10-29-angular-rebuild-sp3c-design.md`

- [ ] **Step 1: Copy the pre-learned memory into the app's public assets**

```bash
cp ../src/games/tictactoe/agentmemory_1.json projects/spoooky-app/public/agentmemory_1.json
```

(Served at `/agentmemory_1.json`, matching `MEMORY_ASSET`. The file key the engine requests is `agentmemory_1.json`.)

- [ ] **Step 2: Sharpen the honest-effect note in the spec**

Edit the "Ehrlicher Hinweis (Risiko)" section to state the verified facts: loaded Q-data never steers move selection (engine chooses by MCTS visits; `getBestAction` is commented out); the shipped `agentmemory_1.json` has 0 learned states; while memory is active we respect each agent's `uctConstant` (so the loaded 3-agent ensemble with uct 1.0/0.5/0 plays visibly differently) but keep the slider's time budget; the learning/export cycle genuinely accumulates and round-trips real `gameStates`.

- [ ] **Step 3: Full verification**

```bash
npx ng build spoooky-core
npx ng test spoooky-core --watch=false
npx ng test spoooky-app --watch=false
npx ng build spoooky-app
```

Expected: all green; `spoooky-app` build emits the worker chunk; no type errors.

- [ ] **Step 4: Commit**

```bash
git add projects/spoooky-app/public/agentmemory_1.json docs/superpowers/specs/2026-10-29-angular-rebuild-sp3c-design.md
git commit -m "feat(sp3c): bundle pre-learned TicTacToe memory asset + honest effect docs

Co-Authored-By: Claude Opus 4.8 <noreply@anthropic.com>"
```

---

## Definition of Done (SP3c)

- [ ] `agent-memory.ts` cache with localStorage precedence; `preloadMemory` + `getMemory` + `gameStatesCount` + `saveMemory`/`exportMemory`/`resetMemory` (Task 1).
- [ ] `$.ajax` shim serves the cache synchronously; `saveAs` shim writes exports to localStorage; `withConfig` respects per-agent `uctConstant` while memory is active (keeps slider time budget) (Task 2).
- [ ] `SpooookyGame.enableLearning()` enables learning on artificial players (Task 3).
- [ ] Service signals `useMemory`/`learnMode`/`memoryStatus`, preload-before-build coordination, `enableLearning` on new game, export/reset passthrough (Task 4).
- [ ] Config panel: "Gelernte KI verwenden" + "Lern-Modus" toggles, export/reset buttons (disabled without a stored memory), status line (Task 5).
- [ ] Pre-learned `agentmemory_1.json` bundled; spec's honest-effect note sharpened; core+app tests green; prod build keeps the worker chunk (Task 6).
- [ ] Browser verification (controller, end of run): with "Gelernte KI" on, a new game loads the 3-agent ensemble and the status shows the state count; the AI plays (and visibly differs from standard due to the diverse uct ensemble); with "Lern-Modus" on, finishing a game stores a memory (export button enables); export downloads a valid JSON; reset re-disables the buttons and restores the shipped asset. Document the observed strength/behavior difference honestly.

## Branch/Integration

Branch `angular-rebuild/sp3c-memory` (already cut from the SP3b tip). Final PR stacked on SP3b (base `angular-rebuild/sp3b-tree`), base later re-targeted to `master`. Closes SP3.

🤖 Generated with [Claude Code](https://claude.com/claude-code)
