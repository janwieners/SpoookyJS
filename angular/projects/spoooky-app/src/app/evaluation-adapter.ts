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
