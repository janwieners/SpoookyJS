# SpoookyJS Angular-Neubau SP3a — Implementierungsplan (echter Web-Worker + konfigurierbare KI)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Die KI off-thread und konfigurierbar machen (Schwierigkeit + Experten-Parameter), plus On-demand-Analyse der aktuellen Stellung für eigene Züge — ohne Eingriff in die Engine.

**Architecture:** Die Konfiguration wird an der **Worker-Grenze** injiziert: ein app-seitiger `AiConfig` (Zeitbudget, UCT-Konstante) überschreibt pro Worker-Anfrage `maxTime`/`uctConstant` (die Engine-Agenten haben `thinkingTime=10000` als Default). Der SP1-Shim wird zu einem `EngineWorker` mit zwei Modi: synchron (für Tests) und ein echter gebündelter Angular-Module-Worker (`ai.worker.ts`, importiert `spoooky-core`, führt dasselbe UCT-Protokoll off-thread aus). Die On-demand-Analyse schickt eine direkte UCT-Anfrage (aktuelles Modell als String) durch den Worker und speist die SP2-Bewertungssignale.

**Tech Stack:** Angular 22 (Standalone, Signals, esbuild-Worker), TypeScript, Vitest(jsdom).

## Global Constraints

- Angular 22 / **Vitest(jsdom)**: Test-Globals ohne Import, Vitest-Matcher, `await fixture.whenStable()`, keine `--browsers`; **immer `npx ng build spoooky-core` vor App-Tests**. Fake-Timer um `cellClicked` mit `{toFake:['setTimeout','clearTimeout']}` (nie `Date.now`).
- **Engine bleibt unangetastet** (`spoooky-core/src/lib/engine/*`, `src/js/*`). SP3a-Code lebt in `projects/spoooky-app/src/app/**`.
- **Config-Injektion nur an der Worker-Grenze**: der Worker überschreibt `maxTime = AiConfig.thinkingTimeMs` und `uctConstant = AiConfig.uctConstant`; die Agenten-Defaults (10000 ms, 0.9) werden NICHT in der Engine geändert.
- Die Engine ruft weiterhin `new Worker(path)` / `postMessage` / `addEventListener('message')` — unverändert. Der Decision-Sink (SP2) muss weiter feuern, wenn eine Decision eintrifft.
- **Tests laufen im synchronen Worker-Modus** (jsdom kann keinen echten Module-Worker nebenläufig ausführen). Echte Nebenläufigkeit wird im Browser verifiziert (Controller).
- `localStorage`-Zugriffe in try/catch. Branch `angular-rebuild/sp3a-worker-config`. Jeder Task endet mit Commit.
- Nicht-Ziele: MCTS-Baum (SP3b), Agentenerinnerung/Lernen (SP3c), weitere Spiele (SP4).

## Engine-Protokoll (Referenz, unverändert)
- Anfrage der Engine an den Worker: `{command:'monte carlo tree search with uct', agentID, agentRole, agentFocus, maxSteps, maxTime, learn, uctConstant, gameModel:<string>, generateMctsGraph}`.
- Antwort: `{type:'decision', agentID, agentRole, agentFocus, results, simCount, simSteps, mctsGraph, QLearner}`.
- Worker-seitig: `new Spoooky.Game().clone(<parsed gameModel>)` → `Spoooky.AI.UCT(model, agentFocus, maxSteps, maxTime, learn, uctConstant, generateMctsGraph)`.

## Interfaces (projektweit)
```ts
// ai-config.ts
export type Difficulty = 'easy' | 'medium' | 'hard';
export interface AiConfig { difficulty: Difficulty; thinkingTimeMs: number; uctConstant: number; }
export const DIFFICULTY_PRESETS: Record<Difficulty, { thinkingTimeMs: number }>;
export const DEFAULT_AI_CONFIG: AiConfig;

// engine-runtime.ts (zusätzlich)
export function setAiConfig(config: AiConfig): void;     // vom AiConfigService aufgerufen
export function setWorkerMode(mode: 'real' | 'sync'): void; // Tests setzen 'sync'
export function runAnalysis(modelString: string, agentFocus: string): Promise<AgentDecision | null>;

// AiConfigService
readonly config: Signal<AiConfig>;
setDifficulty(d: Difficulty): void;
setExpert(partial: Partial<Pick<AiConfig,'thinkingTimeMs'|'uctConstant'>>): void;
```

---

## Task 1: AiConfig-Modell + Service + Config-Injektion (synchroner Pfad)

**Files:**
- Create: `projects/spoooky-app/src/app/ai-config.ts` (+ `.spec.ts`)
- Create: `projects/spoooky-app/src/app/ai-config.service.ts` (+ `.spec.ts`)
- Modify: `projects/spoooky-app/src/app/engine-runtime.ts` (Config an der Worker-Grenze)

**Interfaces:** Produces `AiConfig`, presets, `AiConfigService`, `setAiConfig`. Konsumiert nichts Neues.

- [ ] **Step 1: ai-config.ts + Test (presets, defaults)**

`ai-config.spec.ts`:
```ts
import { DIFFICULTY_PRESETS, DEFAULT_AI_CONFIG } from './ai-config';
describe('ai-config', () => {
  it('hat aufsteigende Zeitbudgets je Schwierigkeit', () => {
    expect(DIFFICULTY_PRESETS.easy.thinkingTimeMs).toBeLessThan(DIFFICULTY_PRESETS.medium.thinkingTimeMs);
    expect(DIFFICULTY_PRESETS.medium.thinkingTimeMs).toBeLessThan(DIFFICULTY_PRESETS.hard.thinkingTimeMs);
  });
  it('Default ist medium und positiv', () => {
    expect(DEFAULT_AI_CONFIG.difficulty).toBe('medium');
    expect(DEFAULT_AI_CONFIG.thinkingTimeMs).toBeGreaterThan(0);
    expect(DEFAULT_AI_CONFIG.uctConstant).toBeGreaterThan(0);
  });
});
```
`ai-config.ts`:
```ts
export type Difficulty = 'easy' | 'medium' | 'hard';
export interface AiConfig { difficulty: Difficulty; thinkingTimeMs: number; uctConstant: number; }
export const DIFFICULTY_PRESETS: Record<Difficulty, { thinkingTimeMs: number }> = {
  easy: { thinkingTimeMs: 150 }, medium: { thinkingTimeMs: 400 }, hard: { thinkingTimeMs: 1200 },
};
export const DEFAULT_AI_CONFIG: AiConfig = {
  difficulty: 'medium', thinkingTimeMs: DIFFICULTY_PRESETS.medium.thinkingTimeMs, uctConstant: 0.9,
};
```

- [ ] **Step 2: Config an der Worker-Grenze (engine-runtime.ts)**

Ersetze die Konstante `AI_TIME_BUDGET_MS` durch eine veränderliche Config und wende sie im `SyncWorker` an:
```ts
import { AiConfig, DEFAULT_AI_CONFIG } from './ai-config';

let currentAiConfig: AiConfig = DEFAULT_AI_CONFIG;
export function setAiConfig(config: AiConfig): void { currentAiConfig = config; }
```
Im `SyncWorker.postMessage` die überschriebenen Werte nutzen (statt `AI_TIME_BUDGET_MS` und `data.uctConstant`):
```ts
      const maxTime = currentAiConfig.thinkingTimeMs;
      const uctConstant = currentAiConfig.uctConstant;
      const res = S.AI.UCT(model, data.agentFocus, data.maxSteps, maxTime,
        data.learn, uctConstant, data.generateMctsGraph);
```
(`emit`/`aiDecisionSink` übernehmen `uctConstant` statt `data.uctConstant`.)

- [ ] **Step 3: AiConfigService + Test (failing)**

`ai-config.service.spec.ts`:
```ts
import { TestBed } from '@angular/core/testing';
import { AiConfigService } from './ai-config.service';
import { DIFFICULTY_PRESETS } from './ai-config';

describe('AiConfigService', () => {
  let svc: AiConfigService;
  beforeEach(() => { localStorage.clear(); TestBed.configureTestingModule({}); svc = TestBed.inject(AiConfigService); });
  it('setDifficulty setzt das Preset-Zeitbudget und merkt es', () => {
    svc.setDifficulty('hard');
    expect(svc.config().difficulty).toBe('hard');
    expect(svc.config().thinkingTimeMs).toBe(DIFFICULTY_PRESETS.hard.thinkingTimeMs);
    expect(JSON.parse(localStorage.getItem('spoooky.aiConfig')!).difficulty).toBe('hard');
  });
  it('setExpert überschreibt Zeitbudget/UCT ohne Preset-Zwang', () => {
    svc.setExpert({ thinkingTimeMs: 777, uctConstant: 1.4 });
    expect(svc.config().thinkingTimeMs).toBe(777);
    expect(svc.config().uctConstant).toBeCloseTo(1.4);
  });
});
```

- [ ] **Step 4: AiConfigService implementieren**

`ai-config.service.ts`:
```ts
import { Injectable, effect, signal } from '@angular/core';
import { AiConfig, DEFAULT_AI_CONFIG, DIFFICULTY_PRESETS, Difficulty } from './ai-config';
import { setAiConfig } from './engine-runtime';

@Injectable({ providedIn: 'root' })
export class AiConfigService {
  readonly config = signal<AiConfig>(this.read());
  constructor() {
    // Push every change to the worker boundary and persist it.
    effect(() => { const c = this.config(); setAiConfig(c); this.persist(c); });
  }
  setDifficulty(d: Difficulty): void {
    this.config.set({ ...this.config(), difficulty: d, thinkingTimeMs: DIFFICULTY_PRESETS[d].thinkingTimeMs });
  }
  setExpert(partial: Partial<Pick<AiConfig, 'thinkingTimeMs' | 'uctConstant'>>): void {
    this.config.set({ ...this.config(), ...partial });
  }
  private read(): AiConfig {
    try { const s = localStorage.getItem('spoooky.aiConfig'); if (s) { return { ...DEFAULT_AI_CONFIG, ...JSON.parse(s) }; } } catch { /* ignore */ }
    return DEFAULT_AI_CONFIG;
  }
  private persist(c: AiConfig): void { try { localStorage.setItem('spoooky.aiConfig', JSON.stringify(c)); } catch { /* ignore */ } }
}
```

- [ ] **Step 5: Build + Tests + Commit**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false` (RED vor Impl, GREEN danach; bestehende Tests bleiben grün).
```bash
git add angular/projects/spoooky-app/src/app/ai-config.ts angular/projects/spoooky-app/src/app/ai-config.spec.ts angular/projects/spoooky-app/src/app/ai-config.service.ts angular/projects/spoooky-app/src/app/ai-config.service.spec.ts angular/projects/spoooky-app/src/app/engine-runtime.ts
git commit -m "feat(sp3a): AiConfig model + service, injected at the worker boundary"
```

---

## Task 2: Echter Off-Thread-Worker (EngineWorker, real/sync)

**Files:**
- Create: `projects/spoooky-app/src/app/ai.worker.ts`
- Modify: `projects/spoooky-app/src/app/engine-runtime.ts` (SyncWorker → EngineWorker mit Modus)
- Test: `projects/spoooky-app/src/app/engine-runtime.spec.ts` (neu, sync-Modus)

**Interfaces:** Produces `setWorkerMode('real'|'sync')`. Der Decision-Sink feuert in beiden Modi beim Eintreffen einer Decision.

- [ ] **Step 1: ai.worker.ts (gebündelter Module-Worker)**

```ts
/// <reference lib="webworker" />
import { Spoooky } from 'spoooky-core';

addEventListener('message', ({ data }) => {
  if (data?.command !== 'monte carlo tree search with uct') { return; }
  const S: any = Spoooky;
  const model = new S.Game().clone(data.gameModel);
  const res = S.AI.UCT(model, data.agentFocus, data.maxSteps, data.maxTime,
    data.learn, data.uctConstant, data.generateMctsGraph);
  (postMessage as any)({
    type: 'decision', agentID: data.agentID, agentRole: data.agentRole, agentFocus: data.agentFocus,
    results: res.results, simCount: res.simCount, uctConstant: data.uctConstant,
    simSteps: res.simSteps, mctsGraph: res.mctsGraph, QLearner: JSON.stringify(res.QLearner),
  });
});
```
Hinweis: Der echte Worker bekommt `maxTime`/`uctConstant` bereits **überschrieben** (das macht der EngineWorker vor dem Weiterleiten, siehe Step 2).

- [ ] **Step 2: EngineWorker in engine-runtime.ts**

Ersetze die Klasse `SyncWorker` durch `EngineWorker`, die den Modus kennt und die Config anwendet. Gemeinsame Hilfsfunktion `applyConfig(data)` setzt `maxTime`/`uctConstant` aus `currentAiConfig`. Der **synchrone** Pfad entspricht dem bisherigen `SyncWorker` (UCT inline, danach `emit` + `aiDecisionSink`). Der **reale** Pfad erzeugt lazy einen Module-Worker und leitet Nachrichten durch; beim Eintreffen einer `decision` feuert `aiDecisionSink` und der registrierte Engine-Listener.
```ts
let workerMode: 'real' | 'sync' = 'real';
export function setWorkerMode(mode: 'real' | 'sync'): void { workerMode = mode; }

function withConfig(data: any) {
  return { ...data, maxTime: currentAiConfig.thinkingTimeMs, uctConstant: currentAiConfig.uctConstant };
}
function decisionSinkFrom(msg: any) {
  aiDecisionSink?.({ agentID: msg.agentID, uctConstant: msg.uctConstant, results: msg.results ?? [], simCount: msg.simCount ?? 0, simSteps: msg.simSteps ?? 0 });
}

class EngineWorker {
  private listeners: Array<(e: { data: any }) => void> = [];
  private real: Worker | null = null;
  constructor() {
    if (workerMode === 'real') {
      this.real = new (globalThis as any).__RealWorker(new URL('./ai.worker', import.meta.url), { type: 'module' });
      this.real!.addEventListener('message', (e: MessageEvent) => { decisionSinkFrom(e.data); this.emit(e.data); });
    }
  }
  addEventListener(type: string, fn: (e: { data: any }) => void): void { if (type === 'message') { this.listeners.push(fn); } }
  private emit(data: any): void { this.listeners.forEach((fn) => fn({ data })); }
  postMessage(data: any): void {
    if (data?.command !== 'monte carlo tree search with uct') { return; }
    const req = withConfig(data);
    if (this.real) { this.real.postMessage(req); return; }
    // sync fallback (tests): run UCT inline
    const S: any = Spoooky;
    const model = new S.Game().clone(req.gameModel);
    const res = S.AI.UCT(model, req.agentFocus, req.maxSteps, req.maxTime, req.learn, req.uctConstant, req.generateMctsGraph);
    const msg = { type: 'decision', agentID: req.agentID, agentRole: req.agentRole, agentFocus: req.agentFocus, results: res.results, simCount: res.simCount, uctConstant: req.uctConstant, simSteps: res.simSteps, mctsGraph: res.mctsGraph, QLearner: JSON.stringify(res.QLearner) };
    decisionSinkFrom(msg); this.emit(msg);
  }
  terminate(): void { this.real?.terminate(); }
}
```
In `installEngineRuntime`: den echten `Worker`-Konstruktor sichern, bevor er überschrieben wird, und `globalThis.Worker = EngineWorker` setzen:
```ts
  (globalThis as any).__RealWorker = (globalThis as any).Worker;
  (globalThis as any).Worker = EngineWorker;
```
> Reihenfolge beachten: `__RealWorker` muss den ECHTEN Browser-`Worker` referenzieren (vor der Überschreibung gesichert).

- [ ] **Step 3: engine-runtime.spec.ts (sync-Modus) — failing → green**

```ts
import { installEngineRuntime, setWorkerMode, setAiConfig } from './engine-runtime';
import { DEFAULT_AI_CONFIG } from './ai-config';
import { Spoooky } from 'spoooky-core';

describe('EngineWorker (sync mode)', () => {
  beforeEach(() => { installEngineRuntime(); setWorkerMode('sync'); setAiConfig(DEFAULT_AI_CONFIG); });
  it('liefert eine decision-Nachricht für eine UCT-Anfrage', () => {
    // Minimal-Spielmodell über die echte Spiel-Factory wäre zu schwer; hier wird der Pfad
    // über ein reales Spiel in den Service-/Board-Tests abgedeckt. Dieser Test prüft nur,
    // dass eine Nicht-UCT-Nachricht ignoriert wird und terminate() nicht wirft.
    const w: any = new (globalThis as any).Worker('ignored');
    let got = 0; w.addEventListener('message', () => got++);
    w.postMessage({ command: 'something else' });
    expect(got).toBe(0);
    expect(() => w.terminate()).not.toThrow();
  });
});
```
> Die inhaltliche UCT→decision-Prüfung läuft weiterhin über die bestehenden Service-/Board-Tests (echtes Spiel, sync-Modus). Diese setzen in ihrem `beforeEach` `setWorkerMode('sync')` — ergänze das in den bestehenden `game-engine.service.spec.ts`/`board.spec.ts`-Setups, damit sie nicht den realen Worker zu starten versuchen.

- [ ] **Step 4: Bestehende Tests auf sync-Modus stellen**

In `game-engine.service.spec.ts`, `board.spec.ts`, `decision-panel.spec.ts` (alle, die eine KI-Entscheidung auslösen): im `beforeEach` nach `TestBed`/`newGame`-Setup `setWorkerMode('sync')` aufrufen (Import aus `engine-runtime`). Danach `npx ng build spoooky-core && npx ng test spoooky-app --watch=false` → alle grün.

- [ ] **Step 5: Produktionsbuild (Worker gebündelt) + Commit**

Run: `cd angular && npx ng build spoooky-app --configuration production` — muss den Worker bündeln (ein zusätzliches Worker-Chunk erscheint). Falls der Build den Worker nicht auflöst, im Report BLOCKED mit der genauen Fehlermeldung melden (Angular esbuild unterstützt `new Worker(new URL('./x', import.meta.url), {type:'module'})`; prüfe Import-Pfad/Dateiendung).
```bash
git add angular/projects/spoooky-app/src/app/ai.worker.ts angular/projects/spoooky-app/src/app/engine-runtime.ts angular/projects/spoooky-app/src/app/engine-runtime.spec.ts angular/projects/spoooky-app/src/app/game-engine.service.spec.ts angular/projects/spoooky-app/src/app/board/board.spec.ts angular/projects/spoooky-app/src/app/decision-panel/decision-panel.spec.ts
git commit -m "feat(sp3a): real off-thread Angular worker with sync fallback for tests"
```

> **Controller-Browser-Verifikation nach diesem Task:** KI-Zug läuft, UI bleibt während des Denkens bedienbar (keine Blockade); Schwierigkeit „hard" denkt spürbar länger als „easy".

---

## Task 3: On-demand-Analyse der aktuellen Stellung

**Files:**
- Modify: `projects/spoooky-core/src/lib/facade.ts` (`serialize()`)
- Modify: `projects/spoooky-app/src/app/engine-runtime.ts` (`runAnalysis`)
- Modify: `projects/spoooky-app/src/app/game-engine.service.ts` (Analyse-Pfad + Toggle)
- Test: `game-engine.service.spec.ts`

**Interfaces:** Consumes `aggregateDecision` (SP2). Produces `facade.serialize()`, `runAnalysis`, `GameEngineService.showAnalysis`/`analyzeIfEnabled()`.

- [ ] **Step 1: facade.serialize()**

In `facade.ts` ergänzen:
```ts
  serialize(): string { return this.raw.stringifyModels(); }
```
Export über public-api bleibt (SpooookyGame ist bereits exportiert).

- [ ] **Step 2: runAnalysis in engine-runtime.ts**

```ts
export function runAnalysis(modelString: string, agentFocus: string): Promise<AgentDecision | null> {
  const S: any = Spoooky;
  const req = withConfig({ command: 'monte carlo tree search with uct', agentID: -1, agentRole: 'ANALYZE POSSIBLE MOVES',
    agentFocus, maxSteps: 10000, learn: false, generateMctsGraph: false, gameModel: modelString });
  if (workerMode === 'real') {
    return new Promise((resolve) => {
      const w: Worker = new (globalThis as any).__RealWorker(new URL('./ai.worker', import.meta.url), { type: 'module' });
      w.addEventListener('message', (e: MessageEvent) => {
        const d = e.data; w.terminate();
        resolve({ agentID: d.agentID, uctConstant: d.uctConstant, results: d.results ?? [], simCount: d.simCount ?? 0, simSteps: d.simSteps ?? 0 });
      });
      w.postMessage(req);
    });
  }
  // sync
  const model = new S.Game().clone(req.gameModel);
  const res = S.AI.UCT(model, req.agentFocus, req.maxSteps, req.maxTime, req.learn, req.uctConstant, req.generateMctsGraph);
  return Promise.resolve({ agentID: -1, uctConstant: req.uctConstant, results: res.results ?? [], simCount: res.simCount ?? 0, simSteps: res.simSteps ?? 0 });
}
```

- [ ] **Step 3: Service-Analyse-Pfad + Test (failing)**

Service: `readonly showAnalysis = signal<boolean>(this.readShowAnalysis());` (localStorage `spoooky.showAnalysis`, Default false) + `toggleAnalysis(on)`. Nach jedem `sync()` (bzw. nach einem menschlichen Nicht-End-Zug) `analyzeIfEnabled()`:
```ts
  private async analyzeIfEnabled(): Promise<void> {
    const game = this.game;
    if (!game || !this.showAnalysis()) { return; }
    if (this.gameState() === 'END' || game.getCurrentPlayerType() !== 'HUMAN') { return; }
    const dec = await runAnalysis(game.serialize(), 'ALL MOVES');
    if (!dec) { return; }
    const ev = aggregateDecision([dec], game.getColumns(), game.getRows());
    if (ev) { this.evaluation.set(ev); }
  }
```
Aufruf am Ende von `newGame` (für den Eröffnungszug des Menschen) und in `cellClicked` nach `applyEvaluation()` (wenn das Spiel nicht endete und wieder der Mensch dran ist). Veraltete Ergebnisse vermeiden: vor `analyzeIfEnabled` einen Zähler/Token erhöhen und nach `await` prüfen, ob noch aktuell (einfacher `analysisToken`-Vergleich).

Test (sync-Modus, Invariante):
```ts
it('analysiert die Eröffnungsstellung, wenn die Analyse an ist, ohne zu ziehen', async () => {
  setWorkerMode('sync');
  localStorage.setItem('spoooky.showAnalysis', 'true');
  const svc = TestBed.inject(GameEngineService);
  svc.newGame(createTicTacToe);
  await Promise.resolve(); await Promise.resolve();
  expect(svc.currentPlayerType()).toBe('HUMAN');
  expect(svc.gameState()).not.toBe('END');
  expect(svc.evaluation()).not.toBeNull();
});
```

- [ ] **Step 4: GREEN + Commit**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false`.
```bash
git add angular/projects/spoooky-core/src/lib/facade.ts angular/projects/spoooky-app/src/app/engine-runtime.ts angular/projects/spoooky-app/src/app/game-engine.service.ts angular/projects/spoooky-app/src/app/game-engine.service.spec.ts
git commit -m "feat(sp3a): on-demand analysis of the current position for human moves"
```

---

## Task 4: Config-UI (AiConfigPanel) + Analyse-Toggle + Layout

**Files:**
- Create: `projects/spoooky-app/src/app/ai-config-panel/ai-config-panel.ts` (+ `.spec.ts`)
- Modify: `projects/spoooky-app/src/app/app.ts|html|scss`

**Interfaces:** Consumes `AiConfigService`, `GameEngineService`.

- [ ] **Step 1: AiConfigPanel + Test (failing)**

Komponente mit Schwierigkeits-Buttons (easy/medium/hard, gebunden an `config().difficulty`) und einem aufklappbaren `<details>`-Experten-Bereich (Number-Inputs für Zeitbudget und UCT-Konstante, gebunden an `setExpert`). Plus eine Checkbox „KI-Analyse meiner Züge" gebunden an `GameEngineService.showAnalysis`/`toggleAnalysis`.
`ai-config-panel.spec.ts`:
```ts
it('wechselt die Schwierigkeit über die Buttons', async () => {
  // TestBed import AiConfigPanel; klick auf den "hard"-Button; erwarte config().difficulty === 'hard'
});
it('setzt das Experten-Zeitbudget über das Eingabefeld', async () => { /* set input value -> setExpert */ });
```
(Vollständige Component-/Template-Zeilen beim Umsetzen schreiben; Standalone, `@for`/`@if`, `FormsModule` oder Signal-gebundene Inputs.)

- [ ] **Step 2: Implementieren + in app.html einbinden**

`AiConfigPanel` in `app.ts` `imports` + in `app.html` in den Header/Seitenbereich. Bestehende `EvaluationToggle`/Layout bleiben.

- [ ] **Step 3: GREEN + Commit**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false`.
```bash
git add angular/projects/spoooky-app/src/app/ai-config-panel angular/projects/spoooky-app/src/app/app.ts angular/projects/spoooky-app/src/app/app.html angular/projects/spoooky-app/src/app/app.scss
git commit -m "feat(sp3a): AI config panel (difficulty + expert params) and analysis toggle"
```

---

## Task 5: TS-Typen für Worker-Protokoll + Analyse; Aufräumen

**Files:**
- Create: `projects/spoooky-app/src/app/ai-worker-protocol.ts` (Typen)
- Modify: `engine-runtime.ts`, `ai.worker.ts` (Typen verwenden)

- [ ] **Step 1: Protokoll-Typen**

```ts
export interface AiWorkerRequest {
  command: 'monte carlo tree search with uct';
  agentID: number | string; agentRole: string; agentFocus: string;
  maxSteps: number; maxTime: number; learn: boolean; uctConstant: number;
  gameModel: string; generateMctsGraph: boolean;
}
export interface AiWorkerDecision {
  type: 'decision'; agentID: number | string; agentRole: string; agentFocus: string;
  results: Array<{ target: string; visits: number; wins: number }>;
  simCount: number; simSteps: number; mctsGraph: unknown; uctConstant: number; QLearner: string;
}
```

- [ ] **Step 2: Typen in engine-runtime.ts / ai.worker.ts anwenden** (die `any`-Ränder an den selbst geschriebenen Stellen durch die Typen ersetzen; Engine-Aufrufe dürfen `any` bleiben). Danach `npx ng build spoooky-core && npx ng test spoooky-app --watch=false && npx ng test spoooky-core --watch=false && npx ng build spoooky-app --configuration production` → alles grün.

- [ ] **Step 3: Commit**

```bash
git add angular/projects/spoooky-app/src/app/ai-worker-protocol.ts angular/projects/spoooky-app/src/app/engine-runtime.ts angular/projects/spoooky-app/src/app/ai.worker.ts
git commit -m "refactor(sp3a): type the AI worker protocol and analysis edges"
```

---

## Self-Review / DoD-Abgleich
- [ ] KI off-thread (echter Worker), UI nicht blockiert → Task 2 (+ Controller-Browser-Check)
- [ ] AiConfig wirkt (Zeitbudget/UCT), UI, persistent → Task 1, 4
- [ ] On-demand-Analyse bei eigenen Zügen, ohne Zug → Task 3
- [ ] TS-Typen für Worker-Protokoll/AiConfig/Analyse → Task 1, 5
- [ ] Tests grün (sync-Modus), Prod-Build inkl. Worker ok → Task 2, 5
- [ ] Browser-Verifikation: nicht-blockierend, Schwierigkeit spürbar, Analyse plausibel → nach Task 4
