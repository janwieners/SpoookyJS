import { Spoooky } from 'spoooky-core';

/**
 * Produktions-Laufzeit für die Legacy-Engine im Browser (SP1).
 *
 * Die Engine hat zwei Browser-Abhängigkeiten, die hier in-thread ersetzt werden:
 *  1. MetaAgent.assembleAgents lädt gelernte Erinnerungen per globalem jQuery (`$.ajax`).
 *     -> Shim, der "keine Erinnerungsdatei vorhanden" meldet (Standard-Agenten-Ensemble).
 *        Echtes Laden der Agenten-Erinnerungen folgt in SP3; jQuery wird bewusst nicht eingebunden.
 *  2. Agent.createBrain startet einen Web Worker (`new Worker(...)`) für die Monte-Carlo-Suche.
 *     -> Synchroner In-Thread-Ersatz, der denselben Code wie spoooky.Worker.js ausführt
 *        (echte Uhr, kurzes Zeitbudget). Ein echter Off-Thread-Worker folgt in SP3.
 */

/** Zeitbudget der UCT-Suche pro KI-Entscheidung in Millisekunden (blockiert den Thread so lange). */
export const AI_TIME_BUDGET_MS = 300;

class SyncWorker {
  private listeners: Array<(e: { data: any }) => void> = [];

  addEventListener(type: string, fn: (e: { data: any }) => void): void {
    if (type === 'message') { this.listeners.push(fn); }
  }

  private emit(data: any): void { this.listeners.forEach((fn) => fn({ data })); }

  postMessage(data: any): void {
    const S: any = Spoooky;
    if (data.command === 'monte carlo tree search with uct') {
      const model = new S.Game().clone(data.gameModel);
      const res = S.AI.UCT(model, data.agentFocus, data.maxSteps, AI_TIME_BUDGET_MS,
        data.learn, data.uctConstant, data.generateMctsGraph);
      this.emit({
        type: 'decision', agentID: data.agentID, agentRole: data.agentRole, agentFocus: data.agentFocus,
        results: res.results, simCount: res.simCount, uctConstant: data.uctConstant,
        simSteps: res.simSteps, mctsGraph: res.mctsGraph, QLearner: JSON.stringify(res.QLearner),
      });
    }
  }

  terminate(): void {}
}

const jqueryShim = {
  ajax: (opts: any) => { opts.error?.(); opts.complete?.(); },
  each: (arr: any[], fn: (i: number, v: any) => void) => arr.forEach((v, i) => fn(i, v)),
};

let installed = false;

/** Installiert die globalen Shims (`$`, `Worker`), die die Engine erwartet. Idempotent. */
export function installEngineRuntime(): void {
  if (installed) { return; }
  (globalThis as any).$ = jqueryShim;
  (globalThis as any).Worker = SyncWorker;
  installed = true;
}

/**
 * Die Engine ruft nach jeder KI-Entscheidung noch die alten AngularJS-Scope-Konnektoren
 * (Statistik- und MCTS-Graph-Ansicht) auf; hier mit No-op-Ansichten verbunden (echte Ansichten: SP2).
 */
export function connectNoopViews(raw: any): void {
  raw.connectStatsView({ update: () => {} });
  raw.connectGraphView({ updateGraphs: () => {} });
}
