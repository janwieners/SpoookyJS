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
