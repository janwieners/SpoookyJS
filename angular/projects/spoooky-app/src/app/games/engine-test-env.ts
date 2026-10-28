import { Spoooky } from 'spoooky-core';

/**
 * Test-Umgebung für die Legacy-Engine unter jsdom.
 *
 * Die Engine hat zwei Browser-Abhängigkeiten, die in den Tests ersetzt werden müssen:
 *  1. MetaAgent.assembleAgents lädt gelernte Erinnerungen per globalem jQuery (`$.ajax`, synchron).
 *     -> Stub, der "keine Erinnerungsdatei vorhanden" meldet (Standard-Agenten-Ensemble).
 *  2. Agent.createBrain startet einen Web Worker (`new Worker(...)`) für die Monte-Carlo-Suche.
 *     -> Synchroner In-Thread-Ersatz, der denselben Code wie spoooky.Worker.js ausführt.
 *     Die UCT-Suche ist zeitgesteuert (`Date.now() < endTime`); damit sie reproduzierbar wird,
 *     läuft sie auf einer virtuellen Uhr (1 ms pro Date.now()-Aufruf) mit festem Budget.
 */
const UCT_VIRTUAL_TIME_BUDGET = 1500;

class SyncWorkerFake {
  private listeners: Array<(e: { data: any }) => void> = [];

  addEventListener(type: string, fn: (e: { data: any }) => void): void {
    if (type === 'message') { this.listeners.push(fn); }
  }

  private emit(data: any): void { this.listeners.forEach((fn) => fn({ data })); }

  postMessage(data: any): void {
    const S: any = Spoooky;
    if (data.command === 'monte carlo tree search with uct') {
      const model = new S.Game().clone(data.gameModel);
      const realNow = Date.now;
      let clock = realNow.call(Date);
      Date.now = () => ++clock;
      let res: any;
      try {
        res = S.AI.UCT(model, data.agentFocus, data.maxSteps, UCT_VIRTUAL_TIME_BUDGET,
          data.learn, data.uctConstant, data.generateMctsGraph);
      } finally {
        Date.now = realNow;
      }
      this.emit({
        type: 'decision', agentID: data.agentID, agentRole: data.agentRole, agentFocus: data.agentFocus,
        results: res.results, simCount: res.simCount, uctConstant: data.uctConstant,
        simSteps: res.simSteps, mctsGraph: res.mctsGraph, QLearner: JSON.stringify(res.QLearner),
      });
    }
  }

  terminate(): void {}
}

const jqueryStub = {
  ajax: (opts: any) => { opts.error?.(); opts.complete?.(); },
  each: (arr: any[], fn: (i: number, v: any) => void) => arr.forEach((v, i) => fn(i, v)),
};

export function installEngineTestEnv(): void {
  (globalThis as any).$ = jqueryStub;
  (globalThis as any).Worker = SyncWorkerFake;
}

export function uninstallEngineTestEnv(): void {
  delete (globalThis as any).$;
  delete (globalThis as any).Worker;
}

/**
 * Die Engine ruft nach jeder KI-Entscheidung noch die alten AngularJS-Scope-Konnektoren
 * (Statistik- und MCTS-Graph-Ansicht) auf; hier mit No-op-Stubs verbunden.
 */
export function stubLegacyViewScopes(raw: any): void {
  raw.connectStatsView({ update: () => {} });
  raw.connectGraphView({ updateGraphs: () => {} });
}
