# SpoookyJS Angular-Neubau SP2 — Implementierungsplan (KI-Visualisierung + Redesign)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Nach jedem KI-Zug die Zug-Bewertungen der Monte-Carlo-KI (Besuche + Gewinnrate je Kandidat, gewählter Zug hervorgehoben) als umschaltbares Board-Overlay und Entscheidungs-Panel zeigen, in einem neu gestalteten, responsiven Layout.

**Architecture:** Die KI-Entscheidungsdaten (`results`) liefert `Spoooky.AI.UCT` und werden bereits vom app-eigenen `SyncWorker` (`engine-runtime.ts`) berechnet. Wir hängen dort einen **Decision-Sink** an (kein Engine-Eingriff), puffern die Pro-Agent-Entscheidungen im `GameEngineService` und aggregieren sie mit einem reinen `evaluation-adapter` zu einem UI-Modell (Zelle→Besuche/Gewinnrate). Board-Overlay, Entscheidungs-Panel und Umschalter konsumieren neue Service-Signals; dazu ein echtes Redesign (Tokens + Layout).

**Tech Stack:** Angular 22 (Standalone, Signals, `@for`/`@if`), TypeScript, Vitest (jsdom). Kein d3 (reines Angular/CSS).

## Global Constraints

- Angular 22 / **Vitest(jsdom)**: Test-Globals ohne Import, Vitest-Matcher (`toBe(true)`, nicht `toBeTrue()`), `await fixture.whenStable()` statt `detectChanges()`, Komponenten ohne `.component`-Suffix. Tests laufen mit `npx ng test <project> --watch=false` (kein `--browsers`). **Immer `npx ng build spoooky-core` vor App-Tests.**
- **Engine bleibt unangetastet** (`angular/projects/spoooky-core/src/lib/engine/*` und `src/js/*`). SP2-Code lebt nur in `projects/spoooky-app/src/app/**` und `styles/`.
- **Datenquelle (präzisiert ggü. Spec §3.1):** Die Zug-Bewertungen kommen NICHT über `connectGraphView` (das trägt nur den Baum), sondern über einen Decision-Sink am `SyncWorker` in `engine-runtime.ts`, der die bereits berechneten `res.results` meldet. `connectNoopViews` bleibt bestehen.
- **target-Label → (x,y):** `x = label.charCodeAt(0) - 97`; `y = rows - parseInt(label.slice(1), 10)`. Beispiel 3×3: `"a3"`→(0,0) oben-links, `"c1"`→(2,2) unten-rechts. Labels mit `-` (Nicht-Platzierungszüge) werden in SP2 übersprungen (nur TicTacToe).
- **winRate = visits > 0 ? wins / visits : 0.**
- Arbeitszweig: `angular-rebuild/sp2-visualization` (bereits angelegt). Jeder Task endet mit Commit.
- Nicht-Ziele: MCTS-Baum, On-demand-Analyse bei eigenen Zügen, Live-Streaming, echter Off-Thread-Worker (alle SP3); weitere Spiele (SP4); per-Runden-Sim-Chart (optionaler Stretch, NICHT umsetzen außer explizit gewünscht).

---

## File Structure

```
projects/spoooky-app/src/app/
  evaluation-adapter.ts            # NEU: reine Aggregation mctsResults -> UI-Modell (+ Typen)
  evaluation-adapter.spec.ts       # NEU
  engine-runtime.ts                # ÄNDERN: Decision-Sink am SyncWorker
  game-engine.service.ts           # ÄNDERN: Puffer + Signals evaluation/decisionStats/showEvaluation
  game-engine.service.spec.ts      # ÄNDERN: neue Tests
  board/board.ts|html|scss         # ÄNDERN: Overlay (Heatmap + Zahlen + gewählt)
  board/board.spec.ts              # ÄNDERN
  decision-panel/decision-panel.ts # NEU: Zusammenfassung + Legende
  decision-panel/decision-panel.spec.ts # NEU
  evaluation-toggle/evaluation-toggle.ts # NEU: Umschalter
  app.ts|html|scss                 # ÄNDERN: Layout-Redesign, Panel/Toggle einbinden
projects/spoooky-app/src/styles/tokens.scss  # ÄNDERN: Heatmap-Skala + Tokens
```

## Interfaces (projektweit)

```ts
// evaluation-adapter.ts
export interface AgentDecision {
  agentID: number | string;
  uctConstant?: number;
  results: Array<{ target: string; visits: number; wins: number; moveIndex?: number; simulationSteps?: number }>;
  simCount: number;
  simSteps: number;
}
export interface EvalCell { x: number; y: number; visits: number; wins: number; winRate: number; chosen: boolean; }
export interface DecisionStats { candidates: number; simulations: number; steps: number; chosen: string | null; chosenWinRate: number | null; }
export interface Evaluation { cells: EvalCell[]; stats: DecisionStats; }
export function aggregateDecision(decisions: AgentDecision[], cols: number, rows: number): Evaluation | null;

// engine-runtime.ts (zusätzlich)
export type AiDecisionSink = (d: AgentDecision) => void;
export function setAiDecisionSink(sink: AiDecisionSink | null): void;

// GameEngineService (zusätzliche Signals)
readonly evaluation: Signal<Evaluation | null>;
readonly showEvaluation: Signal<boolean>;
toggleEvaluation(on: boolean): void;
```

---

## Task 1: evaluation-adapter (reine Aggregation)

**Files:**
- Create: `projects/spoooky-app/src/app/evaluation-adapter.ts`
- Test: `projects/spoooky-app/src/app/evaluation-adapter.spec.ts`

**Interfaces:** Produces `aggregateDecision`, `AgentDecision`, `EvalCell`, `DecisionStats`, `Evaluation` (siehe oben). Konsumiert nichts.

- [ ] **Step 1: Failing test schreiben**

`evaluation-adapter.spec.ts`:
```ts
import { aggregateDecision, AgentDecision } from './evaluation-adapter';

function dec(results: Array<[string, number, number]>, simCount = 100, simSteps = 500, agentID = 1): AgentDecision {
  return { agentID, simCount, simSteps, results: results.map(([target, visits, wins]) => ({ target, visits, wins })) };
}

describe('aggregateDecision', () => {
  it('mappt target-Labels auf (x,y) für ein 3x3-Brett', () => {
    const ev = aggregateDecision([dec([['a3', 10, 5], ['c1', 20, 18]])], 3, 3)!;
    const a3 = ev.cells.find(c => c.x === 0 && c.y === 0)!;
    const c1 = ev.cells.find(c => c.x === 2 && c.y === 2)!;
    expect(a3.visits).toBe(10);
    expect(c1.visits).toBe(20);
  });

  it('berechnet winRate = wins/visits', () => {
    const ev = aggregateDecision([dec([['b2', 40, 10]])], 3, 3)!;
    expect(ev.cells[0].winRate).toBeCloseTo(0.25);
  });

  it('markiert den Zug mit den meisten Besuchen als chosen', () => {
    const ev = aggregateDecision([dec([['a3', 10, 5], ['c1', 20, 18]])], 3, 3)!;
    expect(ev.cells.find(c => c.x === 2 && c.y === 2)!.chosen).toBe(true);
    expect(ev.cells.find(c => c.x === 0 && c.y === 0)!.chosen).toBe(false);
    expect(ev.stats.chosen).toBe('c1');
    expect(ev.stats.chosenWinRate).toBeCloseTo(0.9);
  });

  it('aggregiert dasselbe Feld über mehrere Agenten (Summe visits/wins)', () => {
    const ev = aggregateDecision([dec([['b2', 10, 4]], 50, 200, 1), dec([['b2', 30, 20]], 50, 200, 2)], 3, 3)!;
    const b2 = ev.cells.find(c => c.x === 1 && c.y === 1)!;
    expect(b2.visits).toBe(40);
    expect(b2.wins).toBe(24);
    expect(ev.stats.simulations).toBe(100);
    expect(ev.stats.steps).toBe(400);
  });

  it('überspringt nicht-parsebare Labels und liefert null, wenn nichts übrig bleibt', () => {
    expect(aggregateDecision([dec([['a2-b3', 5, 1]])], 3, 3)).toBeNull();
    const ev = aggregateDecision([dec([['a3', 5, 1], ['zz', 9, 9]])], 3, 3)!;
    expect(ev.cells.length).toBe(1);
  });

  it('winRate ist 0 bei 0 Besuchen; leere Eingabe -> null', () => {
    const ev = aggregateDecision([dec([['a3', 0, 0]])], 3, 3)!;
    expect(ev.cells[0].winRate).toBe(0);
    expect(aggregateDecision([], 3, 3)).toBeNull();
  });
});
```

- [ ] **Step 2: Test ausführen, Fehlschlag bestätigen**

Run: `cd angular && npx ng test spoooky-app --watch=false`
Expected: FAIL ("Cannot find module './evaluation-adapter'").

- [ ] **Step 3: Implementierung schreiben**

`evaluation-adapter.ts`:
```ts
export interface AgentDecision {
  agentID: number | string;
  uctConstant?: number;
  results: Array<{ target: string; visits: number; wins: number; moveIndex?: number; simulationSteps?: number }>;
  simCount: number;
  simSteps: number;
}
export interface EvalCell { x: number; y: number; visits: number; wins: number; winRate: number; chosen: boolean; }
export interface DecisionStats { candidates: number; simulations: number; steps: number; chosen: string | null; chosenWinRate: number | null; }
export interface Evaluation { cells: EvalCell[]; stats: DecisionStats; }

// "a3" -> {x:0,y:0} on a 3x3 board: x = letter-'a', y = rows - number. Placement labels only.
function parseTarget(label: string, cols: number, rows: number): { x: number; y: number } | null {
  if (typeof label !== 'string' || label.includes('-')) { return null; }
  const m = /^([a-z])(\d+)$/.exec(label);
  if (!m) { return null; }
  const x = m[1].charCodeAt(0) - 97;
  const y = rows - parseInt(m[2], 10);
  if (x < 0 || x >= cols || y < 0 || y >= rows) { return null; }
  return { x, y };
}

function labelFor(x: number, y: number, rows: number): string {
  return String.fromCharCode(97 + x) + (rows - y);
}

export function aggregateDecision(decisions: AgentDecision[], cols: number, rows: number): Evaluation | null {
  const byCell = new Map<string, EvalCell>();
  let simulations = 0;
  let steps = 0;

  for (const d of decisions ?? []) {
    simulations += d?.simCount ?? 0;
    steps += d?.simSteps ?? 0;
    for (const r of d?.results ?? []) {
      const pos = parseTarget(r.target, cols, rows);
      if (!pos) { continue; }
      const key = pos.x + ',' + pos.y;
      const visits = r.visits ?? 0;
      const wins = r.wins ?? 0;
      const existing = byCell.get(key);
      if (existing) {
        existing.visits += visits;
        existing.wins += wins;
      } else {
        byCell.set(key, { x: pos.x, y: pos.y, visits, wins, winRate: 0, chosen: false });
      }
    }
  }

  const cells = [...byCell.values()];
  if (cells.length === 0) { return null; }

  let chosen: EvalCell | null = null;
  for (const c of cells) {
    c.winRate = c.visits > 0 ? c.wins / c.visits : 0;
    if (!chosen || c.visits > chosen.visits) { chosen = c; }
  }
  if (chosen) { chosen.chosen = true; }

  const stats: DecisionStats = {
    candidates: cells.length,
    simulations,
    steps,
    chosen: chosen ? labelFor(chosen.x, chosen.y, rows) : null,
    chosenWinRate: chosen ? chosen.winRate : null,
  };
  return { cells, stats };
}
```

- [ ] **Step 4: Test ausführen, grün bestätigen**

Run: `cd angular && npx ng test spoooky-app --watch=false`
Expected: PASS (alle 6).

- [ ] **Step 5: Commit**

```bash
git add angular/projects/spoooky-app/src/app/evaluation-adapter.ts angular/projects/spoooky-app/src/app/evaluation-adapter.spec.ts
git commit -m "feat(sp2): add evaluation adapter aggregating MCTS move results"
```

---

## Task 2: Decision-Sink (engine-runtime) + Service-Integration

**Files:**
- Modify: `projects/spoooky-app/src/app/engine-runtime.ts`
- Modify: `projects/spoooky-app/src/app/game-engine.service.ts`
- Test: `projects/spoooky-app/src/app/game-engine.service.spec.ts`

**Interfaces:**
- Consumes: `aggregateDecision`, `AgentDecision` (Task 1).
- Produces: `setAiDecisionSink` (engine-runtime); Service-Signals `evaluation`, `showEvaluation`, Methode `toggleEvaluation`.

- [ ] **Step 1: engine-runtime um Decision-Sink erweitern**

In `engine-runtime.ts`: oben Typ + Registry ergänzen und im `SyncWorker.postMessage` (nach `const res = ...`, vor/nach `this.emit`) den Sink aufrufen:
```ts
import { AgentDecision } from './evaluation-adapter';

export type AiDecisionSink = (d: AgentDecision) => void;
let aiDecisionSink: AiDecisionSink | null = null;
export function setAiDecisionSink(sink: AiDecisionSink | null): void { aiDecisionSink = sink; }
```
Im `postMessage`, direkt nach der `this.emit({...})`-Zeile:
```ts
      aiDecisionSink?.({
        agentID: data.agentID,
        uctConstant: data.uctConstant,
        results: res.results ?? [],
        simCount: res.simCount ?? 0,
        simSteps: res.simSteps ?? 0,
      });
```

- [ ] **Step 2: Failing test schreiben**

In `game-engine.service.spec.ts` ergänzen (Vitest-Globals, `vi` falls nötig importieren):
```ts
import { setSeed } from 'spoooky-core';
// (bestehende Imports für TestBed, GameEngineService, createTicTacToe beibehalten)

describe('GameEngineService – evaluation', () => {
  let svc: GameEngineService;
  beforeEach(() => {
    TestBed.configureTestingModule({});
    svc = TestBed.inject(GameEngineService);
    setSeed(42);
    localStorage.clear();
  });

  it('startet ohne Bewertung und mit sichtbarem Overlay (Default)', () => {
    svc.newGame(createTicTacToe);
    expect(svc.evaluation()).toBeNull();
    expect(svc.showEvaluation()).toBe(true);
  });

  it('setzt nach einem KI-Zug eine Bewertung mit einem gewählten Feld', () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    svc.newGame(createTicTacToe);
    svc.cellClicked(0, 0);
    vi.runAllTimers();
    vi.useRealTimers();
    const ev = svc.evaluation();
    expect(ev).not.toBeNull();
    expect(ev!.cells.some(c => c.chosen)).toBe(true);
  });

  it('toggleEvaluation schreibt nach localStorage und newGame setzt die Bewertung zurück', () => {
    svc.newGame(createTicTacToe);
    svc.toggleEvaluation(false);
    expect(svc.showEvaluation()).toBe(false);
    expect(localStorage.getItem('spoooky.showEvaluation')).toBe('false');
    svc.newGame(createTicTacToe);
    expect(svc.evaluation()).toBeNull();
  });
});
```

- [ ] **Step 3: Test ausführen, Fehlschlag bestätigen**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false`
Expected: FAIL (`evaluation`/`showEvaluation`/`toggleEvaluation` fehlen).

- [ ] **Step 4: Service implementieren**

In `game-engine.service.ts`:
- Imports ergänzen: `import { aggregateDecision, AgentDecision, Evaluation } from './evaluation-adapter';` und `import { installEngineRuntime, connectNoopViews, setAiDecisionSink } from './engine-runtime';`
- Felder/Signals ergänzen:
```ts
  readonly evaluation = signal<Evaluation | null>(null);
  readonly showEvaluation = signal<boolean>(this.readShowEvaluation());
  private decisionBuffer: AgentDecision[] = [];
```
- Im Konstruktor nach `installEngineRuntime();`:
```ts
    setAiDecisionSink((d) => this.decisionBuffer.push(d));
```
- `newGame`: am Anfang (vor `factory()`) Puffer + Bewertung zurücksetzen:
```ts
    this.decisionBuffer = [];
    this.evaluation.set(null);
```
- `cellClicked`: im `finally` NACH `this.sync()` die gepufferten Entscheidungen auswerten:
```ts
      finally {
        this.sync();
        this.applyEvaluation();
        this.aiThinking.set(false);
      }
```
- Neue Methoden:
```ts
  toggleEvaluation(on: boolean): void {
    this.showEvaluation.set(on);
    try { localStorage.setItem('spoooky.showEvaluation', String(on)); } catch { /* ignore */ }
  }

  private readShowEvaluation(): boolean {
    try { return localStorage.getItem('spoooky.showEvaluation') !== 'false'; } catch { return true; }
  }

  private applyEvaluation(): void {
    const game = this.game;
    if (!game || this.decisionBuffer.length === 0) { return; }
    const ev = aggregateDecision(this.decisionBuffer, game.getColumns(), game.getRows());
    this.decisionBuffer = [];
    if (ev) { this.evaluation.set(ev); }
  }
```

- [ ] **Step 5: Test ausführen, grün bestätigen**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false`
Expected: PASS (neue + bestehende Tests).

- [ ] **Step 6: Commit**

```bash
git add angular/projects/spoooky-app/src/app/engine-runtime.ts angular/projects/spoooky-app/src/app/game-engine.service.ts angular/projects/spoooky-app/src/app/game-engine.service.spec.ts
git commit -m "feat(sp2): capture AI decision results and expose evaluation signals"
```

---

## Task 3: Board-Overlay (Heatmap + Zahlen + gewählter Zug)

**Files:**
- Modify: `projects/spoooky-app/src/app/board/board.ts|html|scss`
- Test: `projects/spoooky-app/src/app/board/board.spec.ts`

**Interfaces:** Consumes `GameEngineService.evaluation` / `showEvaluation`.

- [ ] **Step 1: board.ts erweitern**

```ts
import { Component, computed, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';
import { EvalCell } from '../evaluation-adapter';

@Component({
  selector: 'app-board',
  templateUrl: './board.html',
  styleUrl: './board.scss',
})
export class Board {
  private readonly engine = inject(GameEngineService);
  readonly cells = computed(() => this.engine.board());
  readonly aiThinking = this.engine.aiThinking;
  readonly columns = 3;

  // Lookup from flat index -> evaluation cell, only when the overlay is enabled.
  readonly evalByIndex = computed<Map<number, EvalCell>>(() => {
    const map = new Map<number, EvalCell>();
    if (!this.engine.showEvaluation()) { return map; }
    const ev = this.engine.evaluation();
    if (!ev) { return map; }
    for (const c of ev.cells) { map.set(c.y * this.columns + c.x, c); }
    return map;
  });

  evalAt(index: number): EvalCell | undefined { return this.evalByIndex().get(index); }

  // Win rate 0..1 -> background tint (red low, green high), readable in light & dark.
  heatStyle(cell: EvalCell): Record<string, string> {
    const hue = Math.round(cell.winRate * 120); // 0=red .. 120=green
    return { 'background-color': `color-mix(in srgb, hsl(${hue} 70% 50%) 45%, var(--surface))` };
  }

  onCellClick(index: number): void {
    const x = index % this.columns;
    const y = Math.floor(index / this.columns);
    this.engine.cellClicked(x, y);
  }
}
```

- [ ] **Step 2: board.html erweitern**

```html
<div class="board" [class.thinking]="aiThinking()">
  @for (cell of cells(); track $index) {
    <button class="cell" type="button" (click)="onCellClick($index)"
            [class.candidate]="evalAt($index)"
            [class.chosen]="evalAt($index)?.chosen"
            [style]="evalAt($index) ? heatStyle(evalAt($index)!) : null">
      @if (cell.image) {
        <img [src]="cell.image" alt="" />
      }
      @if (evalAt($index); as e) {
        <span class="eval">
          <span class="rate">{{ (e.winRate * 100) | number:'1.0-0' }}%</span>
          <span class="visits">{{ e.visits }}×</span>
        </span>
      }
    </button>
  }
  @if (aiThinking()) {
    <div class="overlay">Die KI denkt …</div>
  }
</div>
```
Hinweis: `number`-Pipe braucht `CommonModule` ODER `DecimalPipe` im `imports`. Da die App zoneless/standalone ist: `imports: [DecimalPipe]` in `@Component` ergänzen (`import { DecimalPipe } from '@angular/common';`).

- [ ] **Step 3: board.scss erweitern**

An den bestehenden `.cell`-Block anschließen:
```scss
  .cell {
    position: relative;
    .eval {
      position: absolute; inset: auto 2px 2px auto; display: flex; flex-direction: column;
      align-items: flex-end; font-size: 11px; line-height: 1.1; color: var(--text);
      text-shadow: 0 0 2px var(--surface);
    }
    .eval .rate { font-weight: 700; }
    &.chosen { outline: 3px solid var(--accent); outline-offset: -3px; }
  }
```

- [ ] **Step 4: board.spec.ts erweitern (failing → green)**

```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { Board } from './board';
import { GameEngineService } from '../game-engine.service';
import { createTicTacToe } from '../games/tictactoe.game';

describe('Board – evaluation overlay', () => {
  let fixture: ComponentFixture<Board>;
  let svc: GameEngineService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [Board] }).compileComponents();
    setSeed(42); localStorage.clear();
    svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    fixture = TestBed.createComponent(Board);
    await fixture.whenStable();
  });

  it('zeigt kein Overlay, solange keine Bewertung vorliegt', () => {
    expect(fixture.nativeElement.querySelectorAll('.cell .eval').length).toBe(0);
  });

  it('zeigt Bewertungen nach einem KI-Zug und markiert genau eine gewählte Zelle', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    svc.cellClicked(0, 0);
    vi.runAllTimers();
    vi.useRealTimers();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.cell .eval').length).toBeGreaterThan(0);
    expect(fixture.nativeElement.querySelectorAll('.cell.chosen').length).toBe(1);
  });

  it('blendet das Overlay aus, wenn showEvaluation false ist', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    svc.cellClicked(0, 0); vi.runAllTimers(); vi.useRealTimers();
    svc.toggleEvaluation(false);
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll('.cell .eval').length).toBe(0);
  });
});
```
Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false` (RED vor Step 1–3, GREEN danach).

- [ ] **Step 5: Commit**

```bash
git add angular/projects/spoooky-app/src/app/board
git commit -m "feat(sp2): board overlay with per-move heatmap, win rate and chosen highlight"
```

---

## Task 4: DecisionPanel + EvaluationToggle

**Files:**
- Create: `projects/spoooky-app/src/app/decision-panel/decision-panel.ts`
- Create: `projects/spoooky-app/src/app/decision-panel/decision-panel.spec.ts`
- Create: `projects/spoooky-app/src/app/evaluation-toggle/evaluation-toggle.ts`

**Interfaces:** Consumes `GameEngineService` (`evaluation`, `showEvaluation`, `toggleEvaluation`).

- [ ] **Step 1: Failing test (decision-panel)**

`decision-panel.spec.ts`:
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { setSeed } from 'spoooky-core';
import { DecisionPanel } from './decision-panel';
import { GameEngineService } from '../game-engine.service';
import { createTicTacToe } from '../games/tictactoe.game';

describe('DecisionPanel', () => {
  let fixture: ComponentFixture<DecisionPanel>;
  let svc: GameEngineService;
  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [DecisionPanel] }).compileComponents();
    setSeed(42); localStorage.clear();
    svc = TestBed.inject(GameEngineService);
    svc.newGame(createTicTacToe);
    fixture = TestBed.createComponent(DecisionPanel);
    await fixture.whenStable();
  });

  it('zeigt einen Hinweis, solange keine KI-Entscheidung vorliegt', () => {
    expect((fixture.nativeElement.textContent || '')).toContain('Noch keine');
  });

  it('fasst die letzte Entscheidung zusammen (gewähltes Feld erscheint)', async () => {
    vi.useFakeTimers({ toFake: ['setTimeout', 'clearTimeout'] });
    svc.cellClicked(0, 0); vi.runAllTimers(); vi.useRealTimers();
    await fixture.whenStable();
    const ev = svc.evaluation()!;
    expect(fixture.nativeElement.textContent).toContain(ev.stats.chosen!);
  });
});
```

- [ ] **Step 2: RED bestätigen**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false` → FAIL.

- [ ] **Step 3: DecisionPanel implementieren**

`decision-panel/decision-panel.ts`:
```ts
import { Component, inject } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-decision-panel',
  imports: [DecimalPipe],
  template: `
    @if (engine.evaluation(); as ev) {
      <section class="decision">
        <h2>Entscheidung der KI</h2>
        <p>
          <strong>{{ ev.stats.candidates }}</strong> Züge geprüft in
          <strong>{{ ev.stats.simulations | number }}</strong> Simulationen
          (<strong>{{ ev.stats.steps | number }}</strong> Schritte).
          Gewählt: <strong>{{ ev.stats.chosen }}</strong>
          (Gewinnrate {{ (ev.stats.chosenWinRate ?? 0) * 100 | number:'1.0-0' }}%).
        </p>
        <p class="legend">
          <span class="swatch low"></span> niedrige
          <span class="swatch high"></span> hohe Gewinnrate
        </p>
      </section>
    } @else {
      <section class="decision empty"><p>Noch keine KI-Entscheidung.</p></section>
    }
  `,
  styles: [`
    .decision h2 { font-size: 1rem; margin: 0 0 .25rem; }
    .decision p { margin: .25rem 0; }
    .legend { display: flex; align-items: center; gap: .4rem; font-size: .85rem; }
    .swatch { width: 14px; height: 14px; border-radius: 3px; display: inline-block; }
    .swatch.low { background: hsl(0 70% 50%); }
    .swatch.high { background: hsl(120 70% 50%); }
  `],
})
export class DecisionPanel {
  readonly engine = inject(GameEngineService);
}
```

- [ ] **Step 4: EvaluationToggle implementieren**

`evaluation-toggle/evaluation-toggle.ts`:
```ts
import { Component, inject } from '@angular/core';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-evaluation-toggle',
  template: `
    <label class="toggle">
      <input type="checkbox" [checked]="engine.showEvaluation()"
             (change)="engine.toggleEvaluation($any($event.target).checked)" />
      KI-Bewertungen anzeigen
    </label>
  `,
  styles: [`.toggle { display: inline-flex; align-items: center; gap: .5rem; cursor: pointer; }`],
})
export class EvaluationToggle {
  readonly engine = inject(GameEngineService);
}
```

- [ ] **Step 5: GREEN bestätigen**

Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false` → PASS.

- [ ] **Step 6: Commit**

```bash
git add angular/projects/spoooky-app/src/app/decision-panel angular/projects/spoooky-app/src/app/evaluation-toggle
git commit -m "feat(sp2): decision summary panel and evaluation toggle"
```

---

## Task 5: Redesign-Layout + Tokens + Verdrahtung

**Files:**
- Modify: `projects/spoooky-app/src/app/app.ts|html|scss`
- Modify: `projects/spoooky-app/src/styles/tokens.scss`
- Modify: `projects/spoooky-app/src/app/app.spec.ts` (nur falls Selektoren brechen)

**Interfaces:** Consumes `Board`, `GameLog`, `DecisionPanel`, `EvaluationToggle`.

- [ ] **Step 1: Tokens erweitern**

`styles/tokens.scss` — im `:root` zusätzliche Tokens, und Dark-Overrides ergänzen:
```scss
  --radius: 10px;
  --color-danger: #b00020;
  --panel: #ffffff;
  --shadow: 0 1px 3px rgba(0,0,0,.12);
```
Im Dark-Block zusätzlich:
```scss
    --panel: #1f1f24;
    --color-danger: #ff6b81;
    --shadow: 0 1px 3px rgba(0,0,0,.5);
```

- [ ] **Step 2: app.ts verdrahten**

`imports` erweitern: `import { DecisionPanel } from './decision-panel/decision-panel';` und `import { EvaluationToggle } from './evaluation-toggle/evaluation-toggle';`, dann `imports: [Board, GameLog, DecisionPanel, EvaluationToggle]`. Die bestehende `error`/`restart`/`beforeunload`-Logik bleibt.

- [ ] **Step 3: app.html – Redesign-Layout**

```html
<main class="layout">
  <header class="appbar">
    <h1>SpoookyJS — Tic Tac Toe</h1>
    <div class="controls">
      <app-evaluation-toggle />
      <button type="button" class="restart" (click)="restart()">Neues Spiel</button>
    </div>
  </header>

  @if (error()) {
    <p class="error" role="alert">{{ error() }}</p>
  }

  <div class="content">
    <section class="board-area"><app-board /></section>
    <aside class="side">
      <app-decision-panel />
      <app-game-log />
    </aside>
  </div>
</main>
```

- [ ] **Step 4: app.scss – Redesign**

```scss
.layout { max-width: 960px; margin: 0 auto; padding: var(--space-md); display: grid; gap: var(--space-md); }
.appbar { display: flex; flex-wrap: wrap; align-items: center; justify-content: space-between; gap: var(--space-sm); }
.appbar h1 { font-size: 1.25rem; margin: 0; }
.controls { display: flex; align-items: center; gap: var(--space-md); }
.restart {
  border: 1px solid var(--border); background: var(--surface); color: var(--text);
  border-radius: var(--radius); padding: .4rem .8rem; cursor: pointer;
}
.restart:hover { border-color: var(--accent); }
.restart:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; }
.error { color: var(--color-danger); margin: 0; }
.content { display: grid; grid-template-columns: auto 1fr; gap: var(--space-md); align-items: start; }
.side {
  display: grid; gap: var(--space-md);
  background: var(--panel); border: 1px solid var(--border); border-radius: var(--radius);
  box-shadow: var(--shadow); padding: var(--space-md);
}
@media (max-width: 720px) {
  .content { grid-template-columns: 1fr; }
}
```

- [ ] **Step 5: Tests + Prod-Build**

Run:
```bash
cd angular && npx ng build spoooky-core \
  && npx ng test spoooky-app --watch=false \
  && npx ng test spoooky-core --watch=false \
  && npx ng build spoooky-app --configuration production
```
Expected: alle Tests grün, Prod-Build erfolgreich. Falls `app.spec.ts` noch `.cell`/`app-board` prüft: bleibt gültig (Board ist weiterhin gemountet).

- [ ] **Step 6: Commit**

```bash
git add angular/projects/spoooky-app/src angular/projects/spoooky-app/src/styles
git commit -m "feat(sp2): redesigned responsive layout with evaluation panel and toggle"
```

---

## Self-Review / DoD-Abgleich

- [ ] Datenanbindung ohne Engine-Eingriff (Decision-Sink am SyncWorker) → Task 2
- [ ] Adapter mctsResults → UI-Modell, getestet → Task 1
- [ ] Umschaltbares Overlay (Besuche + Gewinnrate, gewählt hervorgehoben), Zustand persistent → Task 2, 3
- [ ] Entscheidungs-Panel + Legende → Task 4
- [ ] Redesign, responsive, hell/dunkel → Task 5
- [ ] Reset bei „Neues Spiel"; Tests grün; Prod-Build ok → Task 2, 5
- [ ] Browser-Verifikation (Controller): nach KI-Zug plausible Bewertungen (gewählt = meiste Besuche), Schalter blendet ein/aus → nach Task 5
