import { SpooookyGame } from 'spoooky-core';
import { createTicTacToe } from './tictactoe.game';
import { createGomoku9x9, createGomoku15x15 } from './gomoku.game';

/** Ziel der Agentenerinnerung eines Spiels. key = Engine-Cache-Key (immer agentmemory_1.json);
 *  storageId = pro Spiel genamespaceter localStorage-Teil; asset = Fetch-URL des mitgelieferten Assets. */
export interface MemoryTarget { id: string; storageId: string; key: string; asset: string }

export interface GameDescriptor {
  id: string; name: string; factory: () => SpooookyGame; columns: number; rows: number; memory?: MemoryTarget;
}

const mem = (gameId: string): MemoryTarget => ({
  id: '1', storageId: `${gameId}.1`, key: 'agentmemory_1.json', asset: `/assets/${gameId}/agentmemory_1.json`,
});

export const GAMES: GameDescriptor[] = [
  { id: 'tictactoe', name: 'Tic Tac Toe', factory: createTicTacToe, columns: 3, rows: 3, memory: mem('tictactoe') },
  { id: 'gomoku9x9', name: 'Gomoku 9×9', factory: createGomoku9x9, columns: 9, rows: 9, memory: mem('gomoku9x9') },
  { id: 'gomoku15x15', name: 'Gomoku 15×15', factory: createGomoku15x15, columns: 15, rows: 15, memory: mem('gomoku15x15') },
];

export const DEFAULT_GAME_ID = 'tictactoe';

export function gameById(id: string): GameDescriptor {
  return GAMES.find((g) => g.id === id) ?? GAMES.find((g) => g.id === DEFAULT_GAME_ID)!;
}
