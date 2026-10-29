/** Nachrichten-Protokoll zwischen Main-Thread (engine-runtime.ts) und KI-Worker (ai.worker.ts). */

/** Anfrage an den Worker: eine Monte-Carlo-Suche (UCT) für einen Agenten. */
export interface AiWorkerRequest {
  command: 'monte carlo tree search with uct';
  agentID: number | string;
  agentRole: string;
  agentFocus: string;
  maxSteps: number;
  maxTime: number;
  learn: boolean;
  uctConstant: number;
  gameModel: string;
  generateMctsGraph: boolean;
}

/** Antwort des Workers: Ergebnis einer Suche. */
export interface AiWorkerDecision {
  type: 'decision';
  agentID: number | string;
  agentRole: string;
  agentFocus: string;
  results: Array<{ target: string; visits: number; wins: number }>;
  simCount: number;
  simSteps: number;
  mctsGraph: unknown;
  uctConstant: number;
  QLearner: string;
}
