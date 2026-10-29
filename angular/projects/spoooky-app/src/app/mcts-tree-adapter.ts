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
  const children: TreeNode[] = Array.isArray(raw?.children) ? raw.children.map(parseNode) : [];
  children.sort((a, b) => b.visits - a.visits);
  return { label, visits, winRate: Number.isFinite(winRate as number) ? winRate : null, terminal, children };
}

export function toTreeNode(rawRoot: unknown): TreeNode | null {
  if (!rawRoot || typeof rawRoot !== 'object') { return null; }
  return parseNode(rawRoot);
}
