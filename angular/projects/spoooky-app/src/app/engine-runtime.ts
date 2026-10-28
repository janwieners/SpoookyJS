import { Spoooky } from 'spoooky-core';
import { AgentDecision } from './evaluation-adapter';
import { AiConfig, DEFAULT_AI_CONFIG } from './ai-config';

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

/**
 * Aktuelle KI-Konfiguration (Zeitbudget je Entscheidung, UCT-Konstante). Sie überschreibt an der
 * Worker-Grenze die Engine-Standardwerte (thinkingTime=10000ms, uctConstant=0.9) der Agenten.
 */
let currentAiConfig: AiConfig = DEFAULT_AI_CONFIG;
export function setAiConfig(config: AiConfig): void { currentAiConfig = config; }

export type AiDecisionSink = (d: AgentDecision) => void;
let aiDecisionSink: AiDecisionSink | null = null;
/** Registriert den Empfänger der Einzelentscheidungen je Ensemble-Agent (SP2-Bewertung). */
export function setAiDecisionSink(sink: AiDecisionSink | null): void { aiDecisionSink = sink; }

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
      const maxTime = currentAiConfig.thinkingTimeMs;
      const uctConstant = currentAiConfig.uctConstant;
      const res = S.AI.UCT(model, data.agentFocus, data.maxSteps, maxTime,
        data.learn, uctConstant, data.generateMctsGraph);
      this.emit({
        type: 'decision', agentID: data.agentID, agentRole: data.agentRole, agentFocus: data.agentFocus,
        results: res.results, simCount: res.simCount, uctConstant,
        simSteps: res.simSteps, mctsGraph: res.mctsGraph, QLearner: JSON.stringify(res.QLearner),
      });
      aiDecisionSink?.({
        agentID: data.agentID,
        uctConstant,
        results: res.results ?? [],
        simCount: res.simCount ?? 0,
        simSteps: res.simSteps ?? 0,
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
