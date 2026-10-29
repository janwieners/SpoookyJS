import { Spoooky } from 'spoooky-core';
import { AgentDecision } from './evaluation-adapter';
import { AiConfig, DEFAULT_AI_CONFIG } from './ai-config';
import { AiWorkerDecision, AiWorkerRequest } from './ai-worker-protocol';

/**
 * Produktions-Laufzeit für die Legacy-Engine im Browser (SP1).
 *
 * Die Engine hat zwei Browser-Abhängigkeiten, die hier in-thread ersetzt werden:
 *  1. MetaAgent.assembleAgents lädt gelernte Erinnerungen per globalem jQuery (`$.ajax`).
 *     -> Shim, der "keine Erinnerungsdatei vorhanden" meldet (Standard-Agenten-Ensemble).
 *        Echtes Laden der Agenten-Erinnerungen folgt in SP3; jQuery wird bewusst nicht eingebunden.
 *  2. Agent.createBrain startet einen Web Worker (`new Worker(...)`) für die Monte-Carlo-Suche.
 *     -> EngineWorker: im Modus 'real' ein gebündelter Off-Thread-Module-Worker (ai.worker.ts),
 *        im Modus 'sync' ein In-Thread-Fallback (Tests). Die KI-Konfiguration wird auf dem Main-Thread angewendet.
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

let aiErrorHandler: (() => void) | null = null;
/** Registriert den Empfänger für Worker-Fehler (sonst bliebe die UI unter "KI denkt" gesperrt, Spec §5). */
export function setAiErrorHandler(cb: (() => void) | null): void { aiErrorHandler = cb; }

let generateTree = false;
/** Schaltet die MCTS-Graph-Erzeugung NUR für den KI-Zug ein/aus (SP3b-Baumansicht); die Analyse bleibt ohne Graph. */
export function setGenerateTree(on: boolean): void { generateTree = on; }

let workerMode: 'real' | 'sync' = 'real';
/** 'real' = echter Off-Thread-Module-Worker (Produktion), 'sync' = In-Thread-Fallback (jsdom-Tests). */
export function setWorkerMode(mode: 'real' | 'sync'): void { workerMode = mode; }

/** Wendet die aktuelle KI-Konfiguration auf der Main-Thread-Seite an, bevor die Anfrage den Worker erreicht. */
function withConfig(data: Omit<AiWorkerRequest, 'maxTime' | 'uctConstant'>): AiWorkerRequest {
  return { ...data, maxTime: currentAiConfig.thinkingTimeMs, uctConstant: currentAiConfig.uctConstant };
}
function decisionSinkFrom(msg: AiWorkerDecision): void {
  aiDecisionSink?.({
    agentID: msg.agentID,
    uctConstant: msg.uctConstant,
    results: msg.results ?? [],
    simCount: msg.simCount ?? 0,
    simSteps: msg.simSteps ?? 0,
    mctsGraph: msg.mctsGraph,
  });
}

class EngineWorker {
  private listeners: Array<(e: { data: AiWorkerDecision }) => void> = [];
  private real: Worker | null = null;

  constructor() {
    if (workerMode === 'real') {
      // Der Angular-esbuild-Transformer erkennt Worker nur syntaktisch als `new Worker(new URL('<lit>', import.meta.url))`.
      // Daher der lokale Bezeichner `Worker`, der auf den gesicherten ECHTEN Browser-Worker zeigt
      // (der globale `Worker` ist durch EngineWorker ersetzt).
      const Worker = (globalThis as any).__RealWorker;
      this.real = new Worker(new URL('./ai.worker', import.meta.url), { type: 'module' });
      this.real!.addEventListener('message', (e: MessageEvent<AiWorkerDecision>) => { decisionSinkFrom(e.data); this.emit(e.data); });
      this.real!.addEventListener('error', (e) => { console.error('AI worker error', e); aiErrorHandler?.(); });
    }
  }

  addEventListener(type: string, fn: (e: { data: AiWorkerDecision }) => void): void {
    if (type === 'message') { this.listeners.push(fn); }
  }

  private emit(data: AiWorkerDecision): void { this.listeners.forEach((fn) => fn({ data })); }

  postMessage(data: AiWorkerRequest): void {
    if (data?.command !== 'monte carlo tree search with uct') { return; }
    const req = withConfig(data);
    req.generateMctsGraph = generateTree;
    if (this.real) { this.real.postMessage(req); return; }
    // Synchroner Fallback (Tests): UCT inline ausfuehren.
    const S: any = Spoooky;
    const model = new S.Game().clone(req.gameModel);
    const res = S.AI.UCT(model, req.agentFocus, req.maxSteps, req.maxTime, req.learn, req.uctConstant, req.generateMctsGraph);
    const msg: AiWorkerDecision = {
      type: 'decision', agentID: req.agentID, agentRole: req.agentRole, agentFocus: req.agentFocus,
      results: res.results, simCount: res.simCount, uctConstant: req.uctConstant,
      simSteps: res.simSteps, mctsGraph: res.mctsGraph, QLearner: JSON.stringify(res.QLearner),
    };
    decisionSinkFrom(msg);
    this.emit(msg);
  }

  terminate(): void { this.real?.terminate(); }
}

/**
 * Einmalige Analyse einer Stellung (ohne Zug): Monte-Carlo-Suche über ALLE Züge des Spielers am Zug.
 * Im Modus 'real' in einem eigenen Off-Thread-Worker, im Modus 'sync' inline (Tests).
 */
export function runAnalysis(modelString: string, agentFocus: string): Promise<AgentDecision | null> {
  const S: any = Spoooky;
  const req = withConfig({
    command: 'monte carlo tree search with uct', agentID: -1, agentRole: 'ANALYZE POSSIBLE MOVES',
    agentFocus, maxSteps: 10000, learn: false, generateMctsGraph: false, gameModel: modelString,
  });
  if (workerMode === 'real') {
    return new Promise((resolve) => {
      // Lokaler Bezeichner `Worker`, damit der esbuild-Transformer den Worker syntaktisch erkennt (siehe EngineWorker).
      const Worker = (globalThis as any).__RealWorker;
      const w: Worker = new Worker(new URL('./ai.worker', import.meta.url), { type: 'module' });
      w.addEventListener('message', (e: MessageEvent<AiWorkerDecision>) => {
        const d = e.data;
        w.terminate();
        resolve({ agentID: d.agentID, uctConstant: d.uctConstant, results: d.results ?? [], simCount: d.simCount ?? 0, simSteps: d.simSteps ?? 0 });
      });
      w.addEventListener('error', () => { w.terminate(); resolve(null); });
      w.postMessage(req);
    });
  }
  const model = new S.Game().clone(req.gameModel);
  const res = S.AI.UCT(model, req.agentFocus, req.maxSteps, req.maxTime, req.learn, req.uctConstant, req.generateMctsGraph);
  return Promise.resolve({ agentID: -1, uctConstant: req.uctConstant, results: res.results ?? [], simCount: res.simCount ?? 0, simSteps: res.simSteps ?? 0 });
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
  // Den ECHTEN Browser-Worker sichern, bevor er durch den EngineWorker ersetzt wird.
  (globalThis as any).__RealWorker = (globalThis as any).Worker;
  (globalThis as any).Worker = EngineWorker;
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
