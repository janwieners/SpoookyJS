# SpoookyJS Angular-Neubau SP3b — Implementierungsplan (MCTS-Baum-Ansicht)

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Eine umschaltbare, interaktiv aufklappbare Top-N-Ansicht des MCTS-Suchbaums der letzten KI-Entscheidung — reines Angular, kein d3, skaliert auf große Bäume.

**Architecture:** Wenn die Baum-Ansicht an ist, setzt der Worker-Boundary `generateMctsGraph=true` NUR für den KI-Zug (nicht für die Analyse). Der `mctsGraph` kommt in der `decision` zurück, wird über den (um `mctsGraph` erweiterten) Decision-Sink im `GameEngineService` erfasst, von einer reinen Funktion (`mcts-tree-adapter`) in einen typisierten `TreeNode` normalisiert (Label/Besuche/Gewinnrate/terminal, Kinder nach Besuchen sortiert) und von einer rekursiven Angular-Komponente gerendert (Wurzel + Top-N je Ebene, aufklappbar). Engine unangetastet.

**Tech Stack:** Angular 22 (Standalone, Signals, rekursive Komponente), TypeScript, Vitest(jsdom).

## Global Constraints
- Angular 22 / Vitest(jsdom): Vitest-Matcher, `whenStable`, keine `--browsers`, Komponenten ohne `.component`-Suffix; **immer `npx ng build spoooky-core` vor App-Tests**; Tests im Sync-Worker-Modus (`setWorkerMode('sync')` wo KI-Züge ausgelöst werden). Fake-Timer (falls nötig) nur `{toFake:['setTimeout','clearTimeout']}`.
- **Engine unangetastet** (`spoooky-core/src/lib/engine/*`, `src/js/*`). SP3b-Code nur in `projects/spoooky-app/src/app/**`.
- `generateMctsGraph` wird nur für den **KI-Zug** gesetzt (EngineWorker-Pfad), NICHT in `runAnalysis`.
- Die load-bearing Worker-Form `const Worker = __RealWorker; new Worker(new URL('./ai.worker', import.meta.url), {type:'module'})` NICHT anfassen.
- mctsGraph-Knoten: `{ ID, value:<visits>, name:<string>, terminal:<bool>, children?:[] }`. `name` z. B. `"c1 (Spieler ID 2, 0.240 / 862)"` (Label vor " (", Gewinnrate = Zahl vor " / "). Wurzel-`name` beginnt mit „Entscheidungsknoten".
- Branch `angular-rebuild/sp3b-tree`. Jeder Task endet mit Commit.
- Nicht-Ziele: volle d3-Zoom/Pan-Ansicht, Mehr-Agenten-Auswahl, Baum für die Analyse, SP3c/SP4.

## File Structure
```
projects/spoooky-app/src/app/
  mcts-tree-adapter.ts            # NEU: TreeNode + toTreeNode (rein)
  mcts-tree-adapter.spec.ts       # NEU
  evaluation-adapter.ts           # ÄNDERN: AgentDecision um mctsGraph?: unknown erweitern
  engine-runtime.ts               # ÄNDERN: setGenerateTree + generateMctsGraph-Override (nur KI-Zug) + mctsGraph im Sink
  game-engine.service.ts          # ÄNDERN: showTree + toggleTree + mctsTree-Signal + capture + reset
  game-engine.service.spec.ts     # ÄNDERN
  mcts-tree/mcts-tree-node.ts     # NEU: rekursiver Knoten (+ .spec)
  mcts-tree/mcts-tree.ts          # NEU: Container
  ai-config-panel/ai-config-panel.ts  # ÄNDERN: "MCTS-Baum anzeigen"-Schalter
  app.ts|html                     # ÄNDERN: <app-mcts-tree /> einbinden
```

## Interfaces
```ts
// mcts-tree-adapter.ts
export interface TreeNode { label: string; visits: number; winRate: number | null; terminal: boolean; children: TreeNode[]; }
export function toTreeNode(rawRoot: unknown): TreeNode | null;

// evaluation-adapter.ts (AgentDecision erweitern)
export interface AgentDecision { /* ...bestehend... */ mctsGraph?: unknown; }

// engine-runtime.ts (zusätzlich)
export function setGenerateTree(on: boolean): void;

// GameEngineService (zusätzlich)
readonly mctsTree: Signal<TreeNode | null>;
readonly showTree: Signal<boolean>;
toggleTree(on: boolean): void;
```

---

## Task 1: mcts-tree-adapter (reine Normalisierung)

**Files:** Create `mcts-tree-adapter.ts` (+ `.spec.ts`).

- [ ] **Step 1: Failing test**

`mcts-tree-adapter.spec.ts`:
```ts
import { toTreeNode } from './mcts-tree-adapter';

const leaf = (name: string, value: number, terminal = false) => ({ ID: name, value, name, terminal, children: [] });

describe('toTreeNode', () => {
  it('parst Label, Besuche (value) und Gewinnrate aus dem name-String', () => {
    const t = toTreeNode({ ID: 'Root', value: 862, name: 'Entscheidungsknoten (Spieler ID 2, 0.240 / 862)', children: [
      leaf('c1 (Spieler ID 1, 0.800 / 500)', 500),
      leaf('a2 (Spieler ID 1, -0.100 / 50)', 50),
    ]})!;
    expect(t.visits).toBe(862);
    expect(t.children.length).toBe(2);
    const c1 = t.children[0];
    expect(c1.label).toBe('c1');
    expect(c1.visits).toBe(500);
    expect(c1.winRate).toBeCloseTo(0.8);
  });

  it('sortiert Kinder absteigend nach Besuchen', () => {
    const t = toTreeNode({ ID: 'Root', value: 10, name: 'Entscheidungsknoten (Spieler ID 2, 0 / 10)', children: [
      leaf('a1 (Spieler ID 1, 0 / 3)', 3), leaf('b1 (Spieler ID 1, 0 / 9)', 9),
    ]})!;
    expect(t.children.map(c => c.visits)).toEqual([9, 3]);
  });

  it('erkennt Terminalknoten und negative Gewinnraten', () => {
    const t = toTreeNode({ ID: 'Root', value: 5, name: 'Entscheidungsknoten (Spieler ID 2, 0 / 5)', children: [
      { ID: 'x', value: 5, terminal: true, name: 'b2 (Terminalknoten - Spieler ID 1 gewinnt. -0.500 / 5)', children: [] },
    ]})!;
    expect(t.children[0].terminal).toBe(true);
    expect(t.children[0].winRate).toBeCloseTo(-0.5);
  });

  it('ist defensiv: null/leer → null; leere Kinder ok', () => {
    expect(toTreeNode(null)).toBeNull();
    const t = toTreeNode({ ID: 'Root', value: 0, name: 'Entscheidungsknoten (Spieler ID 2, 0 / 0)', children: [] })!;
    expect(t.children.length).toBe(0);
  });
});
```

- [ ] **Step 2: RED** — `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false` → FAIL (module missing).

- [ ] **Step 3: Implementierung** — `mcts-tree-adapter.ts`:
```ts
export interface TreeNode { label: string; visits: number; winRate: number | null; terminal: boolean; children: TreeNode[]; }

// " ... 0.240 / 862)" → winRate = 0.240 (kann negativ sein); visits kommt aus `value`, nicht aus dem String.
const RATE_RE = /([-\d.]+)\s*\/\s*\d+\s*\)\s*$/;

function parseNode(raw: any): TreeNode {
  const name: string = typeof raw?.name === 'string' ? raw.name : '';
  let label = name ? name.split(' (')[0] : '?';
  if (label === 'Entscheidungsknoten' || label === '') { label = 'Entscheidung'; }
  const m = RATE_RE.exec(name);
  const winRate = m ? parseFloat(m[1]) : null;
  const visits = typeof raw?.value === 'number' ? raw.value : 0;
  const terminal = !!raw?.terminal;
  const children = Array.isArray(raw?.children) ? raw.children.map(parseNode) : [];
  children.sort((a, b) => b.visits - a.visits);
  return { label, visits, winRate: Number.isFinite(winRate as number) ? winRate : null, terminal, children };
}

export function toTreeNode(rawRoot: unknown): TreeNode | null {
  if (!rawRoot || typeof rawRoot !== 'object') { return null; }
  return parseNode(rawRoot);
}
```

- [ ] **Step 4: GREEN** — Tests laufen. **Commit:** `git commit -m "feat(sp3b): add MCTS tree adapter (mctsGraph -> typed TreeNode)"`

---

## Task 2: Daten-Verdrahtung (mctsGraph → Service-Signal)

**Files:** `evaluation-adapter.ts`, `engine-runtime.ts`, `game-engine.service.ts` (+ spec).

- [ ] **Step 1: AgentDecision um mctsGraph erweitern** (`evaluation-adapter.ts`): im `interface AgentDecision` ergänzen: `mctsGraph?: unknown;`. (Der SP2-Adapter ignoriert das Feld.)

- [ ] **Step 2: engine-runtime.ts**
  - `decisionSinkFrom` um `mctsGraph` ergänzen: `aiDecisionSink?.({ ...bisher, mctsGraph: msg.mctsGraph });`
  - Baum-Flag + Setter:
    ```ts
    let generateTree = false;
    export function setGenerateTree(on: boolean): void { generateTree = on; }
    ```
  - Im `EngineWorker.postMessage` NACH `const req = withConfig(data);` den Flag NUR für den KI-Zug setzen:
    ```ts
    req.generateMctsGraph = generateTree;
    ```
    (NICHT in `runAnalysis` — dort bleibt `generateMctsGraph:false`.)

- [ ] **Step 3: Service — Signals + Capture + Test (failing)**

In `game-engine.service.ts`:
- Imports: `import { toTreeNode, TreeNode } from './mcts-tree-adapter';` und `setGenerateTree` aus `./engine-runtime`.
- Signals:
  ```ts
  readonly mctsTree = signal<TreeNode | null>(null);
  readonly showTree = signal<boolean>(this.readShowTree());
  ```
- Konstruktor: `setGenerateTree(this.showTree());`
- Methoden:
  ```ts
  toggleTree(on: boolean): void {
    this.showTree.set(on);
    setGenerateTree(on);
    try { localStorage.setItem('spoooky.showTree', String(on)); } catch { /* ignore */ }
  }
  private readShowTree(): boolean { try { return localStorage.getItem('spoooky.showTree') === 'true'; } catch { return false; } }
  ```
- In `applyEvaluation()` (wo der `decisionBuffer` ausgewertet wird) zusätzlich den Baum des primären Agenten übernehmen: die erste gepufferte Decision mit einem nicht-leeren `mctsGraph` nehmen:
  ```ts
  const withTree = this.decisionBuffer.find((d: any) => d.mctsGraph && (d.mctsGraph as any).children);
  if (withTree) { this.mctsTree.set(toTreeNode((withTree as any).mctsGraph)); }
  ```
  (VOR dem Leeren des Buffers einfügen.)
- `newGame`: `this.mctsTree.set(null);` ergänzen (beim bestehenden Reset von `evaluation`).

Test (`game-engine.service.spec.ts`, Sync-Modus, gemockte Decision mit mctsGraph):
```ts
it('setzt mctsTree aus dem mctsGraph einer KI-Entscheidung, wenn der Baum an ist', async () => {
  setWorkerMode('sync');
  localStorage.setItem('spoooky.showTree', 'true');
  const svc = TestBed.inject(GameEngineService);
  svc.newGame(createTicTacToe);
  svc.cellClicked(0, 0);
  await Promise.resolve(); await Promise.resolve();
  // Nach einem echten KI-Zug (sync) wurde generateMctsGraph=true gesetzt → mctsTree ist vorhanden.
  expect(svc.mctsTree()).not.toBeNull();
  expect(svc.mctsTree()!.children.length).toBeGreaterThan(0);
});
it('setzt mctsTree bei newGame zurück', () => {
  const svc = TestBed.inject(GameEngineService);
  svc.newGame(createTicTacToe);
  expect(svc.mctsTree()).toBeNull();
});
```

- [ ] **Step 4: GREEN** (`ng build spoooky-core` vor App-Tests). **Commit:** `git commit -m "feat(sp3b): capture AI decision mctsGraph into an mctsTree signal (toggle-gated)"`

---

## Task 3: Rekursive Baum-Komponente

**Files:** `mcts-tree/mcts-tree-node.ts` (+ `.spec.ts`), `mcts-tree/mcts-tree.ts`.

- [ ] **Step 1: MctsTreeNode (rekursiv)**
```ts
import { Component, computed, input, signal } from '@angular/core';
import { DecimalPipe } from '@angular/common';
import { TreeNode } from '../mcts-tree-adapter';

@Component({
  selector: 'app-mcts-tree-node',
  imports: [DecimalPipe],
  template: `
    <div class="node" [class.terminal]="node().terminal">
      <button class="label" type="button" (click)="toggle()" [disabled]="node().children.length === 0"
              [style.background-color]="heat()">
        <span class="move">{{ node().label }}</span>
        <span class="stats">{{ node().visits }}×@if (node().winRate !== null) { · {{ node().winRate! * 100 | number:'1.0-0' }}% }</span>
        @if (node().children.length) { <span class="caret">{{ expanded() ? '▾' : '▸' }}</span> }
      </button>
      @if (expanded()) {
        <ul class="children">
          @for (child of visibleChildren(); track $index) {
            <li><app-mcts-tree-node [node]="child" /></li>
          }
          @if (!showAll() && node().children.length > topN) {
            <li><button class="more" type="button" (click)="showAll.set(true)">+{{ node().children.length - topN }} weitere</button></li>
          }
        </ul>
      }
    </div>
  `,
  styles: [`
    .node { margin-left: .25rem; }
    .label { display:inline-flex; gap:.5rem; align-items:center; border:1px solid var(--border); border-radius:6px;
      padding:.1rem .4rem; margin:.1rem 0; cursor:pointer; color:var(--text); }
    .label[disabled] { cursor:default; opacity:.85; }
    .move { font-weight:600; } .stats { font-size:.8rem; opacity:.9; }
    .terminal > .label { border-style:dashed; }
    .children { list-style:none; margin:0 0 0 1rem; padding:0; border-left:1px solid var(--border); }
    .more { font-size:.8rem; background:none; border:none; color:var(--accent); cursor:pointer; }
  `],
})
export class MctsTreeNode {
  readonly node = input.required<TreeNode>();
  readonly topN = 4;
  readonly expanded = signal(false);
  readonly showAll = signal(false);
  readonly visibleChildren = computed(() => this.showAll() ? this.node().children : this.node().children.slice(0, this.topN));
  // Win rate 0..1(..-1) -> diverging tint (same idea as the SP2 board heatmap).
  readonly heat = computed(() => {
    const w = this.node().winRate; if (w === null) { return 'transparent'; }
    const c = Math.max(-1, Math.min(1, w)); const hue = Math.round(((c + 1) / 2) * 120);
    return `color-mix(in srgb, hsl(${hue} 70% 50%) 30%, var(--surface))`;
  });
  toggle(): void { if (this.node().children.length) { this.expanded.update(v => !v); } }
}
```

- [ ] **Step 2: MctsTree (Container)**
```ts
import { Component, effect, inject, signal } from '@angular/core';
import { MctsTreeNode } from './mcts-tree-node';
import { GameEngineService } from '../game-engine.service';

@Component({
  selector: 'app-mcts-tree',
  imports: [MctsTreeNode],
  template: `
    <section class="tree">
      <h2>MCTS-Suchbaum</h2>
      @if (engine.mctsTree(); as root) {
        @if (root.children.length) { <app-mcts-tree-node [node]="root" /> }
        @else { <p class="hint">Baum zu komplex oder leer.</p> }
      } @else {
        <p class="hint">Noch kein Suchbaum. (Mach einen Zug, wenn „MCTS-Baum anzeigen“ an ist.)</p>
      }
    </section>
  `,
  styles: [`.tree h2{font-size:1rem;margin:0 0 .25rem;} .hint{opacity:.8;font-size:.9rem;}`],
})
export class MctsTree {
  readonly engine = inject(GameEngineService);
}
```

- [ ] **Step 3: Component-Test (`mcts-tree-node.spec.ts`)**
```ts
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MctsTreeNode } from './mcts-tree-node';
import { TreeNode } from '../mcts-tree-adapter';

function n(label: string, visits: number, children: TreeNode[] = []): TreeNode {
  return { label, visits, winRate: 0.5, terminal: false, children };
}

describe('MctsTreeNode', () => {
  let fixture: ComponentFixture<MctsTreeNode>;
  beforeEach(async () => { await TestBed.configureTestingModule({ imports: [MctsTreeNode] }).compileComponents(); });

  it('rendert Label + Besuche, Kinder erst nach dem Aufklappen', async () => {
    fixture = TestBed.createComponent(MctsTreeNode);
    fixture.componentRef.setInput('node', n('Entscheidung', 100, [n('c1', 80), n('a2', 20)]));
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    expect(el.textContent).toContain('Entscheidung');
    expect(el.querySelectorAll('app-mcts-tree-node').length).toBe(0); // nicht aufgeklappt
    (el.querySelector('.label') as HTMLElement).click();
    await fixture.whenStable();
    expect(el.querySelectorAll('app-mcts-tree-node').length).toBe(2); // Top-N Kinder
  });

  it('zeigt nur Top-N und einen "+N weitere"-Button bei mehr Kindern', async () => {
    fixture = TestBed.createComponent(MctsTreeNode);
    const kids = [n('a',9),n('b',8),n('c',7),n('d',6),n('e',5),n('f',4)];
    fixture.componentRef.setInput('node', n('Entscheidung', 100, kids));
    await fixture.whenStable();
    (fixture.nativeElement.querySelector('.label') as HTMLElement).click();
    await fixture.whenStable();
    expect(fixture.nativeElement.querySelectorAll(':scope app-mcts-tree-node').length).toBe(4);
    expect((fixture.nativeElement.textContent || '')).toContain('+2 weitere');
  });
});
```

- [ ] **Step 4: GREEN + Commit** — `git commit -m "feat(sp3b): recursive top-N expandable MCTS tree component"`

---

## Task 4: UI-Schalter + Verdrahtung

**Files:** `ai-config-panel/ai-config-panel.ts`, `app.ts`, `app.html`.

- [ ] **Step 1: Schalter im Config-Panel** — Checkbox „MCTS-Baum anzeigen", gebunden an `engine.showTree()` / `engine.toggleTree($any($event.target).checked)` (analog zum Analyse-Schalter). Test im Panel-Spec ergänzen (reflektiert/flippt `showTree`).

- [ ] **Step 2: MctsTree einbinden** — `app.ts` `imports` um `MctsTree` ergänzen; in `app.html` `<app-mcts-tree />` in das Seitenpanel (`aside.side`) unter das Entscheidungs-Panel setzen.

- [ ] **Step 3: Verifikation + Commit**
Run: `cd angular && npx ng build spoooky-core && npx ng test spoooky-app --watch=false && npx ng test spoooky-core --watch=false && npx ng build spoooky-app --configuration production` → alles grün, Worker-Chunk bleibt.
`git commit -m "feat(sp3b): MCTS tree toggle and panel wiring"`

> **Controller-Browser-Verifikation:** Baum-Schalter an → Zug machen → ein plausibler Baum erscheint (Wurzel = Entscheidung, meistbesuchte Kinder zuerst), Aufklappen/„+N weitere" funktioniert; auch bei „schwer" (großer Baum) bleibt die UI flüssig; Baum-aus → kein Baum und `generateMctsGraph` wieder aus.

---

## Self-Review / DoD-Abgleich
- [ ] Umschaltbarer Baum, generateMctsGraph nur wenn an → Task 2, 4
- [ ] Adapter mctsGraph→TreeNode mit Tests → Task 1
- [ ] Wurzel + Top-N interaktiv aufklappbar, Label/Besuche/Gewinnrate, terminal → Task 3
- [ ] Service-Signal `mctsTree` + Reset; UI-Schalter + Bereich; Leer/Hinweis → Task 2, 3, 4
- [ ] Tests grün (Sync), Prod-Build + Worker-Chunk ok → Task 4
- [ ] Browser-Verifikation → nach Task 4
