import { Spoooky, SpooookyGame } from 'spoooky-core';
import { GOMOKU_BLUEPRINT } from './gomoku.blueprint';

/** Gomoku (Fünf-in-eine-Reihe) auf einem size×size-Brett. Mensch (schwarz) beginnt gegen die KI (weiß). */
export function createGomoku(size: 9 | 15): SpooookyGame {
  const game: any = new Spoooky.Game();
  game.initialize(`Gomoku ${size}×${size}`);
  game.setDescription('Wer zuerst fünf eigene Steine in eine Reihe, Spalte oder Diagonale setzt, gewinnt.');
  game.setGameMode('PLACING');

  const player1 = game.createPlayer({ name: 'Jan', type: 'HUMAN' });
  const player2 = game.createPlayer({ name: 'Scully', type: 'ARTIFICIAL' });

  const w = 'gridCellWhiteWithBorder';
  const cells = new Array(size * size).fill(w);
  game.setupGridWorld(size, size, cells);

  const black = game.addBlueprint(player1, GOMOKU_BLUEPRINT.entities.black);
  const white = game.addBlueprint(player2, GOMOKU_BLUEPRINT.entities.white);

  game.setPlayer(player1);

  const winConsequences = (who: number, msg: string) => [
    { jobName: 'Stop the Game', jobFunction: 'Stop Game' },
    { jobName: 'Winning message', jobFunction: 'Print Game Process', jobArguments: msg },
    { jobName: 'Set the Winner', jobFunction: 'Set Winner', jobArguments: who },
  ];

  const addLineRules = (playerID: number, typeID: string, label: string, msg: string) => {
    for (const [dim, fn] of [
      ['row', 'Player Has Number Of Entities In Row'],
      ['column', 'Player Has Number Of Entities In Column'],
      ['diag', 'Player Has Number Of Entities Diagonally'],
    ] as const) {
      const atom = `${label}: five in ${dim}`;
      const rule = `${label} five in ${dim}`;
      game.addGameRuleAtom({ atomName: atom, atomFunction: fn, atomArguments: { number: 5, playerID, entityID: typeID } });
      game.assembleGameRule({ name: rule, atoms: [atom] });
      game.connectGameRuleConsequences({ ruleName: rule, consequences: winConsequences(playerID, msg) });
    }
  };

  addLineRules(player1.getID(), black.typeID, 'P1', 'Spieler 1 gewinnt!');
  addLineRules(player2.getID(), white.typeID, 'P2', 'Spieler 2 gewinnt!');

  // Unentschieden, wenn das Brett voll ist (wie im Original und bei TicTacToe)
  game.addGameRuleAtom({
    atomName: 'Every Field Has Been Played',
    atomFunction: 'No Empty Field On The Game Board',
  });
  game.addGameRuleAtom({
    atomName: 'Game State is INGAME',
    atomFunction: 'Game State Is',
    atomArguments: 'INGAME',
  });
  game.assembleGameRule({
    name: 'Draw If Game Board Is Full',
    atoms: ['Every Field Has Been Played', 'Game State is INGAME'],
  });
  game.connectGameRuleConsequences({
    ruleName: 'Draw If Game Board Is Full',
    consequences: [
      { jobName: 'Stop the Game', jobFunction: 'Stop Game' },
      { jobName: 'Output Draw Message', jobFunction: 'Print Game Process', jobArguments: 'Unentschieden!' },
    ],
  });

  return new SpooookyGame(game);
}

export const createGomoku9x9 = (): SpooookyGame => createGomoku(9);
export const createGomoku15x15 = (): SpooookyGame => createGomoku(15);
