import { Spoooky, SpooookyGame } from 'spoooky-core';
import { CHECKERS_BLUEPRINT } from './blueprints/checkers.blueprint';

/** Dame (Checkers). Mensch (unten) beginnt gegen die KI (oben). Regeln aus dem gelifteten Blueprint. */
export function createCheckers(): SpooookyGame {
  const game: any = new Spoooky.Game();
  game.initialize('Dame (Checkers / Draughts)');
  game.setDescription(
    'Gespielt wird nur auf den dunklen Feldern. Die Steine ziehen ein Feld in diagonaler Richtung, ' +
    'aber nur vorwärts. Gegnerische Steine müssen übersprungen und dadurch geschlagen werden, sofern das direkt ' +
    'angrenzende dahinter liegende Feld frei ist, indem auf dieses freie Feld gezogen wird. Wenn das Zielfeld ' +
    'eines Sprungs auf ein Feld führt, von dem aus ein weiterer Stein übersprungen werden kann, so wird der ' +
    'Sprung fortgesetzt. Alle übersprungenen Steine werden vom Brett genommen.');
  game.setGameMode('MOVING');

  const player1 = game.createPlayer({ name: 'Jan', type: 'HUMAN' });
  const player2 = game.createPlayer({ name: 'Scully', type: 'ARTIFICIAL' });

  // Karierte Zellen
  const black = 'gridCellBlack', white = 'gridCellWhite';
  game.setupGridWorld(8, 8, [
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
  ]);

  // Standard-Steine als Blueprints hinzufügen
  const p1std = game.addBlueprint(player1, CHECKERS_BLUEPRINT.entities.bottomStandardEntity);
  const p2std = game.addBlueprint(player2, CHECKERS_BLUEPRINT.entities.topStandardEntity);

  // Dame-Blueprints (Könige) für später (Umwandlung) registrieren
  game.addBlueprint(player1, CHECKERS_BLUEPRINT.entities.bottomKingEntity);
  game.addBlueprint(player2, CHECKERS_BLUEPRINT.entities.topKingEntity);

  // Entity-Aktionen mit Spielkonsequenzen verbinden (oberer Spieler = Spieler 2, unterer = Spieler 1)
  game.connectConsequences(CHECKERS_BLUEPRINT.consequences.topPlayer);
  game.connectConsequences(CHECKERS_BLUEPRINT.consequences.bottomPlayer);

  // Standardaufstellung
  game.addEntitiesToGameBoard([
    0, p2std, 0, p2std, 0, p2std, 0, p2std,
    p2std, 0, p2std, 0, p2std, 0, p2std, 0,
    0, p2std, 0, p2std, 0, p2std, 0, p2std,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    p1std, 0, p1std, 0, p1std, 0, p1std, 0,
    0, p1std, 0, p1std, 0, p1std, 0, p1std,
    p1std, 0, p1std, 0, p1std, 0, p1std, 0,
  ]);

  // Spieler, der beginnt
  game.setPlayer(player1);

  // Spielziele für Dame
  // Spielziel: Spieler 1 gewinnt, wenn keine Spielfigur von Spieler 2 ziehen kann
  game.addGameRuleAtom({
    atomName: 'No entity of player 2 can move',
    atomFunction: 'Player Has No Movable Entities',
    atomArguments: player2.getID(),
  });

  game.assembleGameRule({
    name: 'Player 1 wins the game',
    atoms: ['No entity of player 2 can move'],
  });

  game.connectGameRuleConsequences({
    ruleName: 'Player 1 wins the game',
    consequences: [{
      jobName: 'Stop the Game',
      jobFunction: 'Stop Game',
    }, {
      jobName: 'Output winning message',
      jobFunction: 'Print Game Process',
      jobArguments: 'Player 1 wins the Game!',
    }, {
      jobName: 'Set the Winner of the Game',
      jobFunction: 'Set Winner',
      jobArguments: player1.getID(),
    }],
  });

  // Spielziel: Spieler 2 gewinnt, wenn keine Spielfigur von Spieler 1 ziehen kann
  game.addGameRuleAtom({
    atomName: 'No entity of player 1 can move',
    atomFunction: 'Player Has No Movable Entities',
    atomArguments: player1.getID(),
  });

  game.assembleGameRule({
    name: 'Player 2 wins the game',
    atoms: ['No entity of player 1 can move'],
  });

  game.connectGameRuleConsequences({
    ruleName: 'Player 2 wins the game',
    consequences: [{
      jobName: 'Stop the Game',
      jobFunction: 'Stop Game',
    }, {
      jobName: 'Output winning message',
      jobFunction: 'Print Game Process',
      jobArguments: 'Player 2 wins the Game!',
    }, {
      jobName: 'Set the Winner of the Game',
      jobFunction: 'Set Winner',
      jobArguments: player2.getID(),
    }],
  });

  // Zugzwang-Regel (Reihenfolge der Spielziele wesentlich!)
  // Spielziel: Zuletzt bewegte Figur kann einen weiteren gegnerischen Stein schlagen
  game.addGameRuleAtom({
    atomName: 'Recently moved entity captured an opponent entity',
    atomFunction: 'Last Move Was Capture Move',
  });

  game.addGameRuleAtom({
    atomName: 'Recently moved entity can capture an opponent entity',
    atomFunction: 'Recently Moved Entity Can Capture An Opponent Entity',
  });

  game.assembleGameRule({
    name: 'Zugzwang',
    atoms: ['Recently moved entity captured an opponent entity',
      'Recently moved entity can capture an opponent entity'],
  });

  game.connectGameRuleConsequences({
    ruleName: 'Zugzwang',
    consequences: [{
      jobName: 'Output Zugzwang message',
      jobFunction: 'Print Game Process',
      jobArguments: 'Zugzwang: Die zuletzt bewegte Spielfigur ' +
        'muss eine weitere gegnerische Spielfigur schlagen.',
    }, {
      jobName: 'Set Game State',
      jobFunction: 'Set Game State',
      jobArguments: 'ZUGZWANG',
    }, {
      jobName: 'Prevent Player Change',
      jobFunction: 'Prevent Player Change',
    }],
  });

  // Zugzwang-Zustand: nur die zuletzt bewegte Figur darf ziehen, nur Schlagzüge
  game.addGameRuleAtom({
    atomName: 'Game State Is Zugzwang',
    atomFunction: 'Game State Is',
    atomArguments: 'ZUGZWANG',
  });

  game.assembleGameRule({
    name: 'Zug unter Zugzwang',
    atoms: ['Game State Is Zugzwang',
      'Recently moved entity can capture an opponent entity'],
  });

  game.connectGameRuleConsequences({
    ruleName: 'Zug unter Zugzwang',
    consequences: [{
      jobName: 'Restrict selectable entities to current entity',
      jobFunction: 'Restrict Selectable Entities',
      jobArguments: 'Recently Moved Entity',
    }, {
      jobName: 'Restrict selectable entity moves to capture moves',
      jobFunction: 'Restrict Selectable Entity Moves',
      jobArguments: 'Capture Moves',
    }],
  });

  // Zugzwang aufheben
  game.addGameRuleAtom({
    atomName: 'Recently moved entity can not capture an opponent entity',
    atomFunction: 'Recently Moved Entity Can Not Capture An Opponent Entity',
  });

  game.assembleGameRule({
    name: 'Release Zugzwang',
    atoms: ['Game State Is Zugzwang',
      'Recently moved entity can not capture an opponent entity'],
  });

  game.connectGameRuleConsequences({
    ruleName: 'Release Zugzwang',
    consequences: [{
      jobName: 'Output Zugzwang message',
      jobFunction: 'Print Game Process',
      jobArguments: 'Zugzwang aufgehoben.',
    }, {
      jobName: 'Enable Player Change',
      jobFunction: 'Enable Player Change',
    }, {
      jobName: 'Proceed The Game',
      jobFunction: 'Proceed Game',
    }],
  });

  return new SpooookyGame(game);
}
