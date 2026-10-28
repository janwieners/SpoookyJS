# SpoookyJS Angular-Neubau SP1 — Implementierungsplan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Einen Angular-CLI-Workspace aufsetzen, die SpoookyJS-Engine verhaltenserhaltend als `spoooky-core`-Library übernehmen (ohne AngularJS), und TicTacToe gegen die KI spielbar machen — abgesichert durch Charakterisierungs-Tests.

**Architecture:** Zwei Projekte in einem Workspace: `spoooky-core` (die bestehende Engine, als ES-Module gebündelt über einen gemeinsamen `Spoooky`-Namespace-Shim, mit seedbarem RNG und einem framework-neutralen Change-Listener statt `$apply`) und `spoooky-app` (Standalone-Angular-UI). Ein `GameEngineService` spiegelt den Engine-Zustand in Signals; eine `BoardComponent` rendert das Grid und routet Klicks.

**Tech Stack:** Angular (neueste stabile Version, Standalone-Components, Signals), TypeScript, Karma/Jasmine (Angular-CLI-Default), `underscore`.

## Global Constraints

- Die Engine wird **verhaltenserhaltend** übernommen: keine Umschreibung der Interna in SP1. Erlaubt sind nur (a) Namespace-/Import-Mechanik, (b) Ersetzen der 10 `_.random`-Aufrufe durch den seedbaren RNG, (c) die eine View-Seam-Änderung.
- **Kein AngularJS**, kein `$apply`, kein Bootstrap 3 im neuen Code.
- Der alte Stand unter `src/` und die `gulpfile.js` bleiben **unverändert** und weiterhin baubar.
- Neuer App-Code: TypeScript `strict`. Die übernommene Engine darf `allowJs`/`any` nutzen.
- Nicht-Ziele SP1: KI-Graph/Statistiken (SP2), einstellbare KI/Web-Worker (SP3), weitere Spiele (SP4). Nichts davon hier bauen.
- RNG-Parität: `rng.int(min, max)` liefert ganze Zahlen **inklusive** beider Grenzen — exakt wie `_.random(min, max)` aus underscore.
- Arbeitszweig: `angular-rebuild/sp1-foundation` (bereits angelegt). Jeder Task endet mit Commit.

### Angular-22-Konventionen (gelten für JEDEN Task — korrigiert nach Task 1)

Der Workspace ist Angular **22.2** mit TypeScript ~6.0. Das weicht von den ursprünglich angenommenen Karma/Jasmine-Konventionen ab. Für alle Tasks 2–8 gilt daher verbindlich:

- **Test-Runner ist Vitest (jsdom), nicht Karma.** Tests laufen mit `npx ng test spoooky-core --watch=false` bzw. `npx ng test spoooky-app --watch=false` — **ohne** `--browsers=ChromeHeadless`, ohne `CHROME_BIN`. Wo Plan-Schritte `--browsers=ChromeHeadless` nennen, diesen Flag weglassen.
- **Test-Globals** (`describe`, `it`, `expect`, `beforeEach`) sind ohne Import verfügbar. Für Spies/Mocks `vi` verwenden (`vi.spyOn`, `vi.fn`); `import { vi } from 'vitest'`, falls nicht global.
- **Vitest-Matcher statt Jasmine:** `toBe(true)`/`toBe(false)` statt `toBeTrue()`/`toBeFalse()`. Alle Plan-Snippets, die `toBeTrue()`/`toBeFalse()` zeigen, entsprechend übersetzen. `toBeTruthy`/`toContain`/`toEqual`/`toBe` sind unverändert gültig.
- **Zoneless Change Detection:** Nach `TestBed.createComponent(...)` und nach UI-Interaktionen `await fixture.whenStable()` verwenden, **nicht** `fixture.detectChanges()`.
- **Component-Naming ohne Suffix** (Angular-22-Default): `ng generate component board` erzeugt `board/board.ts` (Klasse `Board`), `board.html`, `board.scss`, `board.spec.ts`. Die im Plan genannten Namen bilden sich so ab: `BoardComponent`→`Board` (`board.ts`), `GameLogComponent`→`GameLog` (`game-log.ts`), `AppComponent`→`App` (`app.ts`). Selektoren bleiben `app-board`, `app-game-log`, `app-root`. Den vorhandenen generierten App-Root (`projects/spoooky-app/src/app/app.ts`, Klasse `App`, mit `app.html`) **bearbeiten**, nicht neue `app.component.*` anlegen. Templates/Styles als separate `templateUrl`/`styleUrl`-Dateien wie generiert.
- `underscore` ist als `^1.13.6` eingetragen (löst auf 1.13.6 auf) — akzeptiert.

---

## File Structure

Neuer Workspace-Ordner `angular/` an der Repo-Wurzel (hält `src/` + `gulpfile.js` unberührt):

```
angular/
  angular.json, package.json, tsconfig*.json
  projects/
    spoooky-core/
      src/
        public-api.ts              # öffentlicher Export der Library
        lib/
          namespace.ts             # export const Spoooky: any = {}
          rng.ts                   # seedbarer RNG (createRng, defaultRng, setSeed)
          engine/                  # die übernommenen Engine-Dateien (lift)
            spoooky.base.ts        # ersetzt spoooky.js (Namespace-Init)
            spoooky.Models.ts
            spoooky.Game.ts
            spoooky.DiceBox.ts
            spoooky.GridWelt.ts
            spoooky.OffBoard.ts
            spoooky.GameEvents.ts
            spoooky.JobQueue.ts
            spoooky.Areas.ts
            spoooky.Agent.ts
            spoooky.MetaAgent.ts
            spoooky.Entity.ts
            spoooky.AI.ts
            index.ts               # importiert Engine-Dateien in Reihenfolge, exportiert Spoooky
          facade.ts                # SpooookyGame-Fassade (typisierte Hülle)
          rng.spec.ts
          view-seam.spec.ts
          facade.spec.ts
    spoooky-app/
      src/
        app/
          games/
            tictactoe.blueprint.ts # aus src/js/blueprints/tictactoe.js
            tictactoe.game.ts      # aus src/games/tictactoe/game.js (ohne AngularWrapper)
            tictactoe.game.spec.ts # Charakterisierungs-Tests
          game-engine.service.ts
          game-engine.service.spec.ts
          board/
            board.component.ts
            board.component.html
            board.component.scss
            board.component.spec.ts
          game-log/
            game-log.component.ts
          app.component.ts/.html/.scss
          app.config.ts
        styles/
          tokens.scss               # Design-Tokens (CSS-Variablen)
        assets/tictactoe/           # black.png, white.png (aus src/games/tictactoe/assets)
```

**Reihenfolge der Engine-Importe** (Abhängigkeitsreihenfolge, aus `gulpfile.js:99-111` übernommen):
base → Models → Game → DiceBox → GridWelt → OffBoard → GameEvents → JobQueue → Areas → Agent → MetaAgent → Entity → AI.

---

## Interfaces (projektweit, von mehreren Tasks genutzt)

- **RNG** (`rng.ts`): `createRng(seed: number): { int(min: number, max: number): number; next(): number }`; `defaultRng: Rng`; `setSeed(seed: number): void` (setzt den Default-RNG neu, für Tests).
- **Engine-Namespace** (`engine/index.ts`): `export const Spoooky: any` — trägt `Spoooky.Game` (Konstruktor), `Spoooky.Blueprints`, `Spoooky.AI`, …
- **Engine-Game-Laufzeit-API** (bestehend, via `new Spoooky.Game()`): `initialize(name)`, `setGameMode(mode)`, `createPlayer({name,type})`, `setupGridWorld(cols,rows,display)`, `addBlueprint(player, bp)`, `setPlayer(p)`, Regel-DSL (`addGameRuleAtom`, `assembleGameRule`, `connectGameRuleConsequences`), `loop(areaName, x, y)`, `pseudoLoop()`, `getGameState(): string`, `getCurrentPlayerType(): "HUMAN"|"ARTIFICIAL"`, `getCurrentPlayer()`, `getPlayerWithID(id)`, `models.GameGrid`, `gameWorld.getRows()`, `gameWorld.getColumns()`.
- **View-Seam (neu, Task 4):** `game.connectView(listener: () => void): void`; `game.refreshView()` ruft den Listener (statt `$apply`), bleibt No-op bei `models.playVirtual`.
- **Fassade** (`facade.ts`, Task 5-Konsument): `class SpooookyGame { constructor(game); start(): void; clickCell(x, y): void; readonly raw; getGrid(); getRows(); getColumns(); getState(); getCurrentPlayerType(); onChange(cb): void }`.
- **Service** (`game-engine.service.ts`): Signals `board`, `currentPlayerType`, `gameState`, `log`, `aiThinking`; Methoden `newGame(factory: () => SpooookyGame)`, `cellClicked(x, y)`.

---

## Task 1: Workspace & zwei Projekte scaffolden

**Files:**
- Create: `angular/` (ganzer CLI-Workspace)
- Create: `angular/projects/spoooky-core/*`, `angular/projects/spoooky-app/*`

**Interfaces:**
- Produces: lauffähiger Workspace mit Library `spoooky-core` und App `spoooky-app`; `ng build`/`ng test` funktionieren.

- [ ] **Step 1: Workspace ohne Default-App anlegen**

Run (aus Repo-Wurzel):
```bash
npx -y @angular/cli@latest new spoooky --directory angular --create-application=false --skip-git --package-manager=npm --style=scss
cd angular
```
Erwartet: Ordner `angular/` mit `angular.json`, `package.json`, `tsconfig.json`; kein `projects/`-Eintrag.

- [ ] **Step 2: Library und App generieren**

Run (in `angular/`):
```bash
npx ng generate library spoooky-core
npx ng generate application spoooky-app --style=scss --routing=false
```
Erwartet: `projects/spoooky-core` und `projects/spoooky-app` existieren; `angular.json` listet beide.

- [ ] **Step 3: underscore als Laufzeitabhängigkeit**

Run (in `angular/`):
```bash
npm install underscore@1.13.6
npm install --save-dev @types/underscore
```
Erwartet: `underscore` in `package.json` dependencies.

- [ ] **Step 4: Smoke-Build & Test-Runner prüfen**

Run (in `angular/`):
```bash
npx ng build spoooky-core
npx ng build spoooky-app
npx ng test spoooky-app --watch=false --browsers=ChromeHeadless
```
Erwartet: Beide Builds grün; Default-Spec der App läuft grün (bestätigt, dass Karma/ChromeHeadless hier funktioniert).

- [ ] **Step 5: Commit**

```bash
git add angular
git commit -m "feat(sp1): scaffold Angular workspace with spoooky-core lib and spoooky-app"
```

---

## Task 2: Seedbarer RNG in `spoooky-core`

**Files:**
- Create: `angular/projects/spoooky-core/src/lib/rng.ts`
- Test: `angular/projects/spoooky-core/src/lib/rng.spec.ts`

**Interfaces:**
- Produces: `createRng`, `defaultRng`, `setSeed`, `int(min,max)` (siehe Interfaces oben). Konsumiert von Task 3 (Engine) und Task 5 (Tests).

- [ ] **Step 1: Failing test schreiben**

`rng.spec.ts`:
```ts
import { createRng, defaultRng, setSeed } from './rng';

describe('rng', () => {
  it('ist bei gleichem Seed deterministisch', () => {
    const a = createRng(42);
    const b = createRng(42);
    const seqA = Array.from({ length: 5 }, () => a.int(0, 100));
    const seqB = Array.from({ length: 5 }, () => b.int(0, 100));
    expect(seqA).toEqual(seqB);
  });

  it('int(min,max) liegt inklusive in den Grenzen', () => {
    const r = createRng(7);
    for (let i = 0; i < 1000; i++) {
      const v = r.int(2, 5);
      expect(v).toBeGreaterThanOrEqual(2);
      expect(v).toBeLessThanOrEqual(5);
      expect(Number.isInteger(v)).toBeTrue();
    }
  });

  it('int(n,n) liefert n', () => {
    expect(createRng(1).int(3, 3)).toBe(3);
  });

  it('trifft über viele Ziehungen beide Grenzen 0 und 1', () => {
    const r = createRng(123);
    const seen = new Set<number>();
    for (let i = 0; i < 100; i++) { seen.add(r.int(0, 1)); }
    expect(seen.has(0)).toBeTrue();
    expect(seen.has(1)).toBeTrue();
  });

  it('setSeed macht defaultRng reproduzierbar', () => {
    setSeed(9); const x = defaultRng.int(0, 1_000_000);
    setSeed(9); const y = defaultRng.int(0, 1_000_000);
    expect(x).toBe(y);
  });
});
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run: `npx ng test spoooky-core --watch=false --browsers=ChromeHeadless`
Erwartet: FAIL ("Cannot find module './rng'").

- [ ] **Step 3: Implementierung schreiben**

`rng.ts`:
```ts
// Seedbarer RNG. int(min,max) repliziert underscores _.random (inklusive-inklusive).
export interface Rng {
  next(): number;        // [0,1)
  int(min: number, max: number): number;
}

// mulberry32: kleiner, schneller, deterministischer PRNG.
function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function makeInt(next: () => number) {
  return (min: number, max: number): number =>
    min + Math.floor(next() * (max - min + 1));
}

export function createRng(seed: number): Rng {
  const next = mulberry32(seed);
  return { next, int: makeInt(next) };
}

// Default-RNG: standardmäßig echter Zufall (Verhalten wie bisher),
// per setSeed() für Tests reproduzierbar.
let _next: () => number = Math.random;
export const defaultRng: Rng = {
  next: () => _next(),
  int: (min, max) => min + Math.floor(_next() * (max - min + 1)),
};
export function setSeed(seed: number): void {
  _next = mulberry32(seed);
}
```

- [ ] **Step 4: Test ausführen, grün bestätigen**

Run: `npx ng test spoooky-core --watch=false --browsers=ChromeHeadless`
Erwartet: PASS (alle 5).

- [ ] **Step 5: Commit**

```bash
git add angular/projects/spoooky-core/src/lib/rng.ts angular/projects/spoooky-core/src/lib/rng.spec.ts
git commit -m "feat(sp1): add seedable RNG with underscore-compatible int()"
```

---

## Task 3: Engine verhaltenserhaltend als Module übernehmen

**Files:**
- Create: `angular/projects/spoooky-core/src/lib/engine/*.ts` (kopiert aus `src/js/`)
- Create: `angular/projects/spoooky-core/src/lib/engine/index.ts`
- Modify: `angular/projects/spoooky-core/src/public-api.ts`

**Interfaces:**
- Consumes: `Spoooky` (namespace), `defaultRng` (aus Task 2).
- Produces: `engine/index.ts` exportiert `Spoooky` mit `Spoooky.Game` etc.

- [ ] **Step 1: Namespace-Shim anlegen**

`engine/../namespace.ts`:
```ts
// Gemeinsamer Namespace, den alle Engine-Dateien erweitern (ersetzt die globale var Spoooky).
export const Spoooky: any = {};
```

- [ ] **Step 2: Engine-Dateien kopieren und zu .ts umbenennen**

Run (aus Repo-Wurzel):
```bash
mkdir -p angular/projects/spoooky-core/src/lib/engine
for f in Models Game DiceBox GridWelt OffBoard GameEvents JobQueue Areas Agent MetaAgent Entity AI; do
  cp "src/js/spoooky.$f.js" "angular/projects/spoooky-core/src/lib/engine/spoooky.$f.ts"
done
```
Erwartet: 12 `.ts`-Dateien im `engine/`-Ordner. (`spoooky.js` wird nicht kopiert; es wird durch den Shim ersetzt.)

- [ ] **Step 3: Jede Engine-Datei mit Imports versehen**

Füge am **Anfang** jeder der 12 Dateien exakt diese zwei Zeilen ein (in `spoooky.AI.ts` zusätzlich der RNG-Import — siehe Step 4):
```ts
import { Spoooky } from '../namespace';
import * as _ from 'underscore';
```
Entferne in jeder Datei eine ggf. vorhandene erste Zeile `"use strict";` (Module sind implizit strict).
Erwartet: Keine Datei referenziert mehr ein globales `Spoooky` oder globales `_`.

- [ ] **Step 4: Die 10 `_.random`-Aufrufe durch den seedbaren RNG ersetzen**

Füge in `spoooky.AI.ts`, `spoooky.DiceBox.ts`, `spoooky.Game.ts` zusätzlich ein:
```ts
import { defaultRng } from '../rng';
```
Ersetze dann wortgetreu (gleiche Semantik, inklusive Grenzen) an diesen Stellen `_.random(` durch `defaultRng.int(`:

- `spoooky.AI.ts`: `Date.now() + _.random(0, 99999)` → `Date.now() + defaultRng.int(0, 99999)`
- `spoooky.AI.ts`: `_.random(0, parseInt(self_MCnode.untriedMoves.length-1, 10))` → `defaultRng.int(0, parseInt(self_MCnode.untriedMoves.length-1, 10))`
- `spoooky.AI.ts`: `childNodes[_.random(0, childNodes.length-1)]` → `childNodes[defaultRng.int(0, childNodes.length-1)]`
- `spoooky.AI.ts`: `allMoves[_.random(0, allMoves.length-1)]` → `allMoves[defaultRng.int(0, allMoves.length-1)]`
- `spoooky.AI.ts`: `gameStates[_.random(0, gameStates.length-1)]` → `gameStates[defaultRng.int(0, gameStates.length-1)]`
- `spoooky.AI.ts`: `_.random(0, 1) < self_QLearner.rho` → `defaultRng.int(0, 1) < self_QLearner.rho`
- `spoooky.AI.ts` (2×): `actions[_.random(0, actions.length-1)]` → `actions[defaultRng.int(0, actions.length-1)]`
- `spoooky.DiceBox.ts`: `_.random(self_DiceBox.getDice(diceID).start, ...)` → `defaultRng.int(self_DiceBox.getDice(diceID).start, ...)`
- `spoooky.Game.ts`: `allMoves[_.random(0, parseInt(allMoves.length-1, 10))]` → `allMoves[defaultRng.int(0, parseInt(allMoves.length-1, 10))]`

Verifiziere danach:
```bash
grep -rn "_.random" angular/projects/spoooky-core/src/lib/engine
```
Erwartet: Keine aktiven Treffer (nur die auskommentierte `Math.random`-Zeile in AI bleibt unberührt).

- [ ] **Step 5: Barrel `index.ts` in Abhängigkeitsreihenfolge**

`engine/index.ts`:
```ts
import { Spoooky } from '../namespace';
import './spoooky.Models';
import './spoooky.Game';
import './spoooky.DiceBox';
import './spoooky.GridWelt';
import './spoooky.OffBoard';
import './spoooky.GameEvents';
import './spoooky.JobQueue';
import './spoooky.Areas';
import './spoooky.Agent';
import './spoooky.MetaAgent';
import './spoooky.Entity';
import './spoooky.AI';
export { Spoooky };
```

- [ ] **Step 6: public-api erweitern & TS-Nachsicht für Engine**

`public-api.ts` ergänzen:
```ts
export { Spoooky } from './lib/engine';
export { createRng, defaultRng, setSeed } from './lib/rng';
export type { Rng } from './lib/rng';
```
In `projects/spoooky-core/tsconfig.lib.json` unter `compilerOptions` setzen (Engine ist Alt-JS-Stil):
```json
"allowJs": true,
"strict": false,
"noImplicitAny": false,
"strictNullChecks": false
```

- [ ] **Step 7: Smoke-Test für das Laden**

`engine/index.spec.ts`:
```ts
import { Spoooky } from './index';

describe('engine namespace', () => {
  it('stellt den Game-Konstruktor bereit', () => {
    expect(typeof Spoooky.Game).toBe('function');
    const g: any = new Spoooky.Game();
    g.initialize('Smoke');
    expect(typeof g.loop).toBe('function');
  });
});
```

- [ ] **Step 8: Build & Test**

Run:
```bash
cd angular && npx ng build spoooky-core && npx ng test spoooky-core --watch=false --browsers=ChromeHeadless
```
Erwartet: Build grün; Smoke-Test PASS. (Falls der Compiler über fehlende Typen in einzelnen Engine-Dateien stolpert, pro Datei oben `// @ts-nocheck` ergänzen — verhaltenserhaltend, keine Logikänderung.)

- [ ] **Step 9: Commit**

```bash
git add angular/projects/spoooky-core
git commit -m "feat(sp1): lift engine into spoooky-core as modules, route RNG through seedable source"
```

---

## Task 4: View-Seam von AngularJS entkoppeln

**Files:**
- Modify: `angular/projects/spoooky-core/src/lib/engine/spoooky.Game.ts` (bei `connectGridWeltView` ~Z.60 und `refreshView` ~Z.2641)
- Test: `angular/projects/spoooky-core/src/lib/view-seam.spec.ts`

**Interfaces:**
- Produces: `game.connectView(listener)`, `game.refreshView()` ruft Listener statt `$apply`.

- [ ] **Step 1: Failing test schreiben**

`view-seam.spec.ts`:
```ts
import { Spoooky } from './engine';

describe('view seam', () => {
  it('refreshView ruft den registrierten Listener statt $apply', () => {
    const g: any = new Spoooky.Game();
    g.initialize('Seam');
    let calls = 0;
    g.connectView(() => calls++);
    g.models.playVirtual = false;
    g.refreshView();
    expect(calls).toBe(1);
  });

  it('refreshView ist No-op während playVirtual', () => {
    const g: any = new Spoooky.Game();
    g.initialize('Seam');
    let calls = 0;
    g.connectView(() => calls++);
    g.models.playVirtual = true;
    g.refreshView();
    expect(calls).toBe(0);
  });
});
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run: `npx ng test spoooky-core --watch=false --browsers=ChromeHeadless`
Erwartet: FAIL (`g.connectView is not a function`).

- [ ] **Step 3: `connectGridWeltView` um neutralen Listener ergänzen**

In `spoooky.Game.ts` die bestehende `connectGridWeltView`-Funktion ersetzen durch:
```js
self_Game.viewListener = null;

// Neutraler Change-Listener (ersetzt die AngularJS-Anbindung)
self_Game.connectView = function(listener) {
    self_Game.viewListener = listener;
};

// Rückwärtskompatibel beibehalten; nutzt jetzt den neutralen Mechanismus
self_Game.connectGridWeltView = function(scope) {
    self_Game.viewScope = scope;
};
```

- [ ] **Step 4: `refreshView` umstellen**

In `spoooky.Game.ts` die `refreshView`-Funktion ersetzen durch:
```js
self_Game.refreshView = function() {
    if (!self_Game.models.playVirtual && self_Game.viewListener) {
        self_Game.viewListener();
    }
};
```

- [ ] **Step 5: Test ausführen, grün bestätigen**

Run: `npx ng test spoooky-core --watch=false --browsers=ChromeHeadless`
Erwartet: PASS (beide).

- [ ] **Step 6: Commit**

```bash
git add angular/projects/spoooky-core/src/lib/engine/spoooky.Game.ts angular/projects/spoooky-core/src/lib/view-seam.spec.ts
git commit -m "feat(sp1): replace \$apply view refresh with framework-neutral listener"
```

---

## Task 5: Typisierte Fassade + TicTacToe-Definition + Charakterisierungs-Tests

**Files:**
- Create: `angular/projects/spoooky-core/src/lib/facade.ts`
- Create: `angular/projects/spoooky-app/src/app/games/tictactoe.blueprint.ts`
- Create: `angular/projects/spoooky-app/src/app/games/tictactoe.game.ts`
- Test: `angular/projects/spoooky-app/src/app/games/tictactoe.game.spec.ts`
- Assets: `angular/projects/spoooky-app/src/assets/tictactoe/black.png`, `white.png` (aus `src/games/tictactoe/assets/`)

**Interfaces:**
- Consumes: `Spoooky`, `setSeed` (core).
- Produces: `class SpooookyGame`; `createTicTacToe(): SpooookyGame`.

- [ ] **Step 1: Fassade schreiben**

`facade.ts`:
```ts
import { Spoooky } from './engine';

export type PlayerType = 'HUMAN' | 'ARTIFICIAL';

// Dünne, typisierte Hülle um eine Engine-Game-Instanz.
export class SpooookyGame {
  constructor(public readonly raw: any) {}

  connectView(listener: () => void): void { this.raw.connectView(listener); }
  start(): void { this.raw.pseudoLoop(); }
  clickCell(x: number, y: number): void { this.raw.loop(false, x, y); }

  getGrid(): any { return this.raw.models.GameGrid; }
  getRows(): number { return this.raw.gameWorld.getRows(); }
  getColumns(): number { return this.raw.gameWorld.getColumns(); }
  getState(): string { return this.raw.getGameState(); }
  getCurrentPlayerType(): PlayerType { return this.raw.getCurrentPlayerType(); }
  getEntityAt(cell: any): { name: string; view: any } | null {
    if (!cell.contains || cell.contains.length === 0) { return null; }
    const ref = cell.contains[cell.contains.length - 1];
    const entity = this.raw.getPlayerWithID(ref.playerID).getEntityWithID(ref.entityID);
    return { name: entity.getName(), view: entity.getView() };
  }
}
```
`public-api.ts` ergänzen:
```ts
export { SpooookyGame } from './lib/facade';
export type { PlayerType } from './lib/facade';
```

- [ ] **Step 2: TicTacToe-Blueprint portieren**

`tictactoe.blueprint.ts` — Inhalt aus `src/js/blueprints/tictactoe.js`, aber als Export statt globalem Zuweisen und mit App-Asset-Pfaden:
```ts
export const TICTACTOE_BLUEPRINT = {
  entities: {
    black: {
      entityType: 'Black', typeID: 'B', associatedWithMetaAgent: null,
      representation: { type: 'image', texture: 'assets/tictactoe/black.png' },
      mode: 'PLACE', placeTo: 'ANY',
    },
    white: {
      entityType: 'White', typeID: 'W', associatedWithMetaAgent: null,
      representation: { type: 'image', texture: 'assets/tictactoe/white.png' },
      mode: 'PLACE', placeTo: 'ANY',
    },
  },
};
```

- [ ] **Step 3: TicTacToe-Spiel portieren (ohne AngularWrapper)**

`tictactoe.game.ts` — der gesamte deklarative Aufbau aus `src/games/tictactoe/game.js` Zeilen 6–261 (alles **außer** dem abschließenden `Spoooky.AngularWrapper(...)`-Aufruf), gekapselt in eine Factory. Beispiel-Gerüst (die Regel-Atome/Consequences 1:1 aus dem Original übernehmen):
```ts
import { Spoooky, SpooookyGame } from 'spoooky-core';
import { TICTACTOE_BLUEPRINT } from './tictactoe.blueprint';

export function createTicTacToe(): SpooookyGame {
  const game: any = new Spoooky.Game();
  game.initialize('Tic Tac Toe');
  game.setDescription('Auf einem 3×3-Spielfeld setzen beide Spieler abwechselnd ihr Zeichen …');
  game.setGameMode('PLACING');

  const player1 = game.createPlayer({ name: 'Jan', type: 'HUMAN' });
  const player2 = game.createPlayer({ name: 'Scully', type: 'ARTIFICIAL' });

  const w = 'gridCellWhiteWithBorder';
  game.setupGridWorld(3, 3, [w, w, w, w, w, w, w, w, w]);

  const black = game.addBlueprint(player2, TICTACTOE_BLUEPRINT.entities.black);
  const white = game.addBlueprint(player1, TICTACTOE_BLUEPRINT.entities.white);
  game.setPlayer(player1);

  // --- Regel-Atome, assembleGameRule und connectGameRuleConsequences
  //     wörtlich aus src/games/tictactoe/game.js:48-261 übernehmen.
  //     (Reihe/Spalte/Diagonale je Spieler + Unentschieden) ---
  // ... (vollständig übertragen) ...

  return new SpooookyGame(game);
}
```
> Beim Übertragen die Original-Argumente exakt beibehalten (`white.typeID`, `player1.getID()` usw.).

- [ ] **Step 4: Assets kopieren**

Run (aus Repo-Wurzel):
```bash
mkdir -p angular/projects/spoooky-app/src/assets/tictactoe
cp src/games/tictactoe/assets/*.png angular/projects/spoooky-app/src/assets/tictactoe/
```

- [ ] **Step 5: Charakterisierungs-Test schreiben (failing)**

`tictactoe.game.spec.ts`:
```ts
import { setSeed } from 'spoooky-core';
import { createTicTacToe } from './tictactoe.game';

describe('TicTacToe Charakterisierung', () => {
  it('startet im INGAME-Zustand mit Mensch am Zug', () => {
    setSeed(12345);
    const g = createTicTacToe();
    g.start();
    expect(g.getState()).not.toBe('END');
    expect(g.getCurrentPlayerType()).toBe('HUMAN');
    expect(g.getRows()).toBe(3);
    expect(g.getColumns()).toBe(3);
  });

  it('terminiert mit gültigem Endzustand, wenn der Mensch stur a1,b1,c1 … spielt (Invariante)', () => {
    setSeed(12345);
    const g = createTicTacToe();
    g.start();
    const humanMoves: Array<[number, number]> = [[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]];
    for (const [x, y] of humanMoves) {
      if (g.getState() === 'END') { break; }
      if (g.getCurrentPlayerType() === 'HUMAN') { g.clickCell(x, y); }
    }
    // Invarianten: kein Absturz, Spiel terminiert, Endzustand ist END.
    expect(g.getState()).toBe('END');
  });

  it('ist bei festem Seed reproduzierbar (gleiche Zugfolge → gleicher Endzustand)', () => {
    const play = () => {
      setSeed(777);
      const g = createTicTacToe();
      g.start();
      for (const [x, y] of [[0,0],[1,1],[2,2],[0,1],[0,2]] as Array<[number,number]>) {
        if (g.getState() === 'END') { break; }
        if (g.getCurrentPlayerType() === 'HUMAN') { g.clickCell(x, y); }
      }
      return g.getState();
    };
    expect(play()).toBe(play());
  });
});
```
> Anmerkung Determinismus: Primär über `setSeed` + Invarianten/Reproduzierbarkeit abgesichert (vgl. Spec Abschnitt 7). Nach dem ersten grünen Lauf dürfen die beobachteten konkreten Endzustände als festere Assertions ergänzt werden (Golden-Master), solange sie über Läufe stabil sind.

- [ ] **Step 6: Build & Test**

Run:
```bash
cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false --browsers=ChromeHeadless
```
Erwartet: Nach vollständigem Übertragen der Regeln in Step 3 laufen alle drei Tests grün (Reihenfolge: zuerst `ng build spoooky-core`, damit die App die aktuelle Library sieht).

- [ ] **Step 7: Commit**

```bash
git add angular/projects/spoooky-core/src/lib/facade.ts angular/projects/spoooky-app/src/app/games angular/projects/spoooky-app/src/assets/tictactoe angular/projects/spoooky-core/src/public-api.ts
git commit -m "feat(sp1): add typed facade, TicTacToe definition and characterization tests"
```

---

## Task 6: `GameEngineService`

**Files:**
- Create: `angular/projects/spoooky-app/src/app/game-engine.service.ts`
- Test: `angular/projects/spoooky-app/src/app/game-engine.service.spec.ts`

**Interfaces:**
- Consumes: `SpooookyGame`, `createTicTacToe`.
- Produces: Signals `board`, `currentPlayerType`, `gameState`, `log`, `aiThinking`; Methoden `newGame(factory)`, `cellClicked(x, y)`.

- [ ] **Step 1: Failing test schreiben**

`game-engine.service.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { GameEngineService } from './game-engine.service';
import { createTicTacToe } from './games/tictactoe.game';

describe('GameEngineService', () => {
  let svc: GameEngineService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(GameEngineService);
    setSeed(42);
  });

  it('newGame initialisiert Board, Spieler und Zustand', () => {
    svc.newGame(createTicTacToe);
    expect(svc.gameState()).not.toBe('END');
    expect(svc.currentPlayerType()).toBe('HUMAN');
    expect(svc.board().length).toBe(9);
  });

  it('cellClicked wird ignoriert, wenn nicht der Mensch am Zug ist', () => {
    svc.newGame(createTicTacToe);
    (svc as any).game.raw.models.gameState = 'INGAME';
    spyOn((svc as any).game, 'clickCell');
    (svc.currentPlayerType as any) = () => 'ARTIFICIAL';
    svc.cellClicked(0, 0);
    expect((svc as any).game.clickCell).not.toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run: `cd angular && npx ng test spoooky-app --watch=false --browsers=ChromeHeadless`
Erwartet: FAIL (Service existiert nicht).

- [ ] **Step 3: Service implementieren**

`game-engine.service.ts`:
```ts
import { Injectable, signal } from '@angular/core';
import { SpooookyGame, PlayerType } from 'spoooky-core';

@Injectable({ providedIn: 'root' })
export class GameEngineService {
  private game: SpooookyGame | null = null;

  readonly board = signal<any[]>([]);
  readonly currentPlayerType = signal<PlayerType>('HUMAN');
  readonly gameState = signal<string>('INGAME');
  readonly log = signal<string[]>([]);
  readonly aiThinking = signal<boolean>(false);

  newGame(factory: () => SpooookyGame): void {
    const game = factory();
    this.game = game;
    game.connectView(() => this.sync());
    game.start();
    this.sync();
  }

  cellClicked(x: number, y: number): void {
    const game = this.game;
    if (!game) { return; }
    if (this.gameState() === 'END') { return; }
    if (game.getCurrentPlayerType() !== 'HUMAN') { return; }

    // Menschenzug sofort spiegeln, dann KI deferred (damit das Overlay rendern kann).
    game.clickCell(x, y);
    this.sync();

    if (this.gameState() !== 'END' && game.getCurrentPlayerType() === 'ARTIFICIAL') {
      this.aiThinking.set(true);
      setTimeout(() => {
        try {
          // clickCell(x,y) hat die KI-Antwort bereits synchron mitgezogen (Engine-loop),
          // daher hier nur Zustand finalisieren. Falls die Engine noch wartet: erneut syncen.
          this.sync();
        } finally {
          this.aiThinking.set(false);
        }
      }, 0);
    }
  }

  private sync(): void {
    const game = this.game;
    if (!game) { return; }
    const grid = game.getGrid();
    this.board.set(Array.isArray(grid) ? [...grid] : grid);
    this.currentPlayerType.set(game.getCurrentPlayerType());
    this.gameState.set(game.getState());
  }
}
```
> Hinweis: Die Engine zieht den KI-Zug innerhalb von `loop()` synchron mit (Game.js:575-579). Das Overlay überbrückt die Blockade optisch. Eine echte Nebenläufigkeit ist SP3 (Web-Worker). Beim Verdrahten (Task 7) prüfen, ob `board` als Grid-Array oder Objekt vorliegt, und `sync()` entsprechend anpassen.

- [ ] **Step 4: Test ausführen, grün bestätigen**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false --browsers=ChromeHeadless`
Erwartet: PASS (beide).

- [ ] **Step 5: Commit**

```bash
git add angular/projects/spoooky-app/src/app/game-engine.service.ts angular/projects/spoooky-app/src/app/game-engine.service.spec.ts
git commit -m "feat(sp1): add GameEngineService mapping engine state to signals"
```

---

## Task 7: `BoardComponent` + Log + „KI denkt"-Overlay

**Files:**
- Create: `angular/projects/spoooky-app/src/app/board/board.component.{ts,html,scss}`
- Create: `angular/projects/spoooky-app/src/app/game-log/game-log.component.ts`
- Test: `angular/projects/spoooky-app/src/app/board/board.component.spec.ts`

**Interfaces:**
- Consumes: `GameEngineService`.
- Produces: Standalone-Components `BoardComponent`, `GameLogComponent`.

- [ ] **Step 1: Failing test schreiben**

`board.component.spec.ts`:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { BoardComponent } from './board.component';
import { GameEngineService } from '../game-engine.service';
import { createTicTacToe } from '../games/tictactoe.game';

describe('BoardComponent', () => {
  let fixture: ComponentFixture<BoardComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [BoardComponent] }).compileComponents();
    setSeed(42);
    TestBed.inject(GameEngineService).newGame(createTicTacToe);
    fixture = TestBed.createComponent(BoardComponent);
    fixture.detectChanges();
  });

  it('rendert 9 Zellen für ein 3x3-Brett', () => {
    const cells = fixture.nativeElement.querySelectorAll('.cell');
    expect(cells.length).toBe(9);
  });

  it('Klick auf eine freie Zelle setzt ein Zeichen (Brett nicht mehr leer)', () => {
    const svc = TestBed.inject(GameEngineService);
    const before = JSON.stringify(svc.board());
    (fixture.nativeElement.querySelector('.cell') as HTMLElement).click();
    fixture.detectChanges();
    expect(JSON.stringify(svc.board())).not.toBe(before);
  });
});
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run: `cd angular && npx ng test spoooky-app --watch=false --browsers=ChromeHeadless`
Erwartet: FAIL (Component existiert nicht).

- [ ] **Step 3: BoardComponent implementieren**

`board.component.ts`:
```ts
import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  private readonly engine = inject(GameEngineService);
  readonly cells = computed(() => this.engine.board());
  readonly aiThinking = this.engine.aiThinking;
  readonly columns = 3;

  onCellClick(index: number): void {
    const x = index % this.columns;
    const y = Math.floor(index / this.columns);
    this.engine.cellClicked(x, y);
  }

  imageFor(cell: any): string | null {
    const ref = cell?.contains?.[cell.contains.length - 1];
    if (!ref) { return null; }
    return ref.entityID === 'W' ? 'assets/tictactoe/white.png' : 'assets/tictactoe/black.png';
  }
}
```
`board.component.html`:
```html
<div class="board" [class.thinking]="aiThinking()">
  <button
    class="cell"
    *ngFor="let cell of cells(); let i = index"
    (click)="onCellClick(i)">
    <img *ngIf="imageFor(cell) as src" [src]="src" alt="" />
  </button>
  <div class="overlay" *ngIf="aiThinking()">Die KI denkt …</div>
</div>
```
`board.component.scss`:
```scss
.board {
  position: relative;
  display: grid;
  grid-template-columns: repeat(3, var(--cell-size, 96px));
  gap: var(--space-xs, 4px);
  .cell {
    width: var(--cell-size, 96px);
    height: var(--cell-size, 96px);
    background: var(--surface, #fff);
    border: 1px solid var(--border, #ccc);
    display: flex; align-items: center; justify-content: center;
    cursor: pointer;
    img { width: 80%; height: 80%; }
  }
  .overlay {
    position: absolute; inset: 0;
    display: flex; align-items: center; justify-content: center;
    background: color-mix(in srgb, var(--surface, #fff) 70%, transparent);
    font-weight: 600;
  }
  &.thinking .cell { pointer-events: none; }
}
```

- [ ] **Step 4: GameLogComponent implementieren**

`game-log/game-log.component.ts`:
```ts
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-game-log',
  standalone: true,
  imports: [CommonModule],
  template: `
    <ul class="log">
      <li *ngFor="let line of engine.log()">{{ line }}</li>
    </ul>
  `,
})
export class GameLogComponent {
  readonly engine = inject(GameEngineService);
}
```

- [ ] **Step 5: Test ausführen, grün bestätigen**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false --browsers=ChromeHeadless`
Erwartet: PASS (beide). Falls `board()` ein Objekt statt Array liefert, `GameEngineService.sync()` und `cells` in Task 6/7 an die reale `GameGrid`-Form anpassen (Form zuerst via `console.log(game.getGrid())` verifizieren).

- [ ] **Step 6: Commit**

```bash
git add angular/projects/spoooky-app/src/app/board angular/projects/spoooky-app/src/app/game-log
git commit -m "feat(sp1): add BoardComponent, game log and AI-thinking overlay"
```

---

## Task 8: App verdrahten, Design-Tokens, Navigationsschutz, Deploy-Build

**Files:**
- Modify: `angular/projects/spoooky-app/src/app/app.component.{ts,html,scss}`
- Create: `angular/projects/spoooky-app/src/styles/tokens.scss`
- Modify: `angular/projects/spoooky-app/src/styles.scss`
- Modify: `angular/angular.json` (assets der App enthalten `assets/`-Ordner — per CLI-Default bereits gesetzt)

**Interfaces:**
- Consumes: `BoardComponent`, `GameLogComponent`, `GameEngineService`, `createTicTacToe`.

- [ ] **Step 1: Design-Tokens anlegen**

`styles/tokens.scss`:
```scss
:root {
  --bg: #f7f7f8; --surface: #ffffff; --border: #d8d8de;
  --text: #1c1c1f; --accent: #5b4b8a;
  --space-xs: 4px; --space-sm: 8px; --space-md: 16px;
  --cell-size: 96px;
  font-family: system-ui, sans-serif;
}
@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    --bg: #17171a; --surface: #1f1f24; --border: #34343c;
    --text: #ececf0; --accent: #a99bd6;
  }
}
body { margin: 0; background: var(--bg); color: var(--text); }
```
`styles.scss` ergänzen: `@use './styles/tokens';`

- [ ] **Step 2: AppComponent verdrahten**

`app.component.ts`:
```ts
import { Component, OnInit, HostListener, inject } from '@angular/core';
import { BoardComponent } from './board/board.component';
import { GameLogComponent } from './game-log/game-log.component';
import { GameEngineService } from './game-engine.service';
import { createTicTacToe } from './games/tictactoe.game';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [BoardComponent, GameLogComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent implements OnInit {
  private readonly engine = inject(GameEngineService);
  ngOnInit(): void { this.engine.newGame(createTicTacToe); }

  // Navigationsschutz während eines KI-Zugs (aus dem Altsystem übernommen).
  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(e: BeforeUnloadEvent): string | void {
    if (this.engine.gameState() !== 'END' && this.engine.currentPlayerType() === 'ARTIFICIAL') {
      e.preventDefault();
      e.returnValue = 'Bitte warten, bis der KI-Spieler fertig ist.';
      return e.returnValue;
    }
  }
}
```
`app.component.html`:
```html
<main class="layout">
  <h1>SpoookyJS — Tic Tac Toe</h1>
  <app-board></app-board>
  <app-game-log></app-game-log>
</main>
```
`app.component.scss`:
```scss
.layout { max-width: 480px; margin: 0 auto; padding: var(--space-md); display: grid; gap: var(--space-md); }
h1 { font-size: 1.25rem; }
```

- [ ] **Step 3: Manuelle Abnahme im Browser**

Run: `cd angular && npx ng build spoooky-core && npx ng serve spoooky-app`
Prüfen unter `http://localhost:4200/`:
- Brett erscheint als 3×3.
- Klick setzt ein weißes Zeichen; die KI antwortet mit einem schwarzen Zeichen; „KI denkt …" blitzt auf.
- Drei in einer Reihe (Mensch) → Spiel endet korrekt; volle Brettfüllung ohne Sieger → Unentschieden.

- [ ] **Step 4: Produktions-/Deploy-Build**

Run: `cd angular && npx ng build spoooky-app --configuration production`
Erwartet: statisches Bundle unter `angular/dist/spoooky-app/`. (Deploy-Mechanismus nach spoookyjs.de: statisches Hosting dieses Ordners — konkreter Schritt mit Jan abstimmen.)

- [ ] **Step 5: Gesamter Testlauf grün**

Run:
```bash
cd angular && npx ng build spoooky-core \
  && npx ng test spoooky-core --watch=false --browsers=ChromeHeadless \
  && npx ng test spoooky-app --watch=false --browsers=ChromeHeadless
```
Erwartet: Alle Specs grün.

- [ ] **Step 6: Commit**

```bash
git add angular/projects/spoooky-app/src angular/projects/spoooky-app/src/styles angular/angular.json
git commit -m "feat(sp1): wire TicTacToe app, design tokens and navigation guard"
```

---

## Verifikation gegen die Definition of Done (SP1)

- [ ] Workspace mit `spoooky-core` + `spoooky-app` baut (`ng build`). → Task 1, 8
- [ ] Engine ohne AngularJS; `$apply` durch Listener ersetzt. → Task 3, 4
- [ ] TicTacToe vollständig gegen die KI spielbar (Sieg/Niederlage/Unentschieden). → Task 5, 7, 8 (Step 3)
- [ ] Charakterisierungs-Tests grün. → Task 5
- [ ] Unit-Tests `GameEngineService` + `BoardComponent` grün. → Task 6, 7
- [ ] Deploybares statisches Build + `ng serve`. → Task 8
- [ ] Alter `src/`/gulp-Stand unverändert. → Global Constraints (nie angefasst)

---

## Revision nach Task 5 (2026-10-28): KI-Laufzeit

Task 5 hat gezeigt, dass die ursprüngliche Annahme „KI läuft synchron im Main-Thread ohne Worker/jQuery" falsch war. Reale Laufzeit-Abhängigkeiten der TicTacToe-KI:

- `MetaAgent.assembleAgents` lädt `agentmemory_<ID>.json` per globalem `$.ajax` (synchron); bei Fehler → Fallback auf Standard-Agenten.
- `Agent.createBrain` rechnet die MCTS in `new Worker("spoooky.Worker.min.js")`; die UCT-Suche ist zeitbudgetiert (`Date.now() < endTime`, Original ~1,5 s).
- Die Engine ruft nach jeder KI-Entscheidung `connectStatsView(...).update()` und `connectGraphView(...).updateGraphs()` (zusätzliche View-Nähte).

**Entscheidung (vom Autor gewählt): Option A — synchron, kurzes Budget.** Tasks 6–8 werden danach umgesetzt:

- Eine **App-Laufzeit** (`engine-runtime.ts`) installiert vor Spielstart zwei Shims auf `globalThis`:
  - `Worker` = synchroner In-Thread-Ersatz, **identische Logik wie der bewährte `SyncWorkerFake` in `projects/spoooky-app/src/app/games/engine-test-env.ts`**, aber mit **echter Uhr** (kein virtueller Takt) und **kurzem Budget** `AI_TIME_BUDGET_MS = 300`. Führt real `Spoooky.AI.UCT(...)` aus.
  - `$` = Minimal-Shim: `ajax(opts)` ruft sofort `opts.error?.()`/`opts.complete?.()` (→ keine Erinnerungsdatei → Standard-Agenten); `each(arr, fn)`. **Kein jQuery-Paket.** (Echtes Laden der Agentenerinnerung = SP3.)
- `connectStatsView`/`connectGraphView` werden mit **No-op-Stubs** verbunden (echte Visualisierung = SP2).
- Weil die KI synchron im `game.loop` mitläuft (~300 ms), führt der `GameEngineService.cellClicked` den Zug **deferred** aus (`aiThinking=true` setzen → `setTimeout(0)` → `clickCell` → `sync()` → `aiThinking=false`), damit das Overlay rendern kann.
- Tests der App-Schicht nutzen **Invarianten** statt exakter KI-Ergebnisse (echte Uhr ⇒ nicht bit-deterministisch): Brett ändert sich nach Zug, Spieler wechselt zurück, Spiel terminiert in gültigem Zustand, 9 Zellen gerendert, Klick platziert ein Zeichen.

Die verbindlichen Task-Briefs für 6–8 liegen in `.superpowers/sdd/task-{6,7,8}-brief.md` und setzen diese Revision um (sie ersetzen die ursprünglichen Task-6–8-Texte oben).
