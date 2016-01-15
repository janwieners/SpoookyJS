// ******************* *** //
// *** Game Definition *** //
// *********************** //

// Create a new SpoookyJS game
var game = new Spoooky.Game;

game.initialize("Spiel der Amazonen (Amazons)");

game.setDescription("Die Spieler ziehen abwechselnd, Weiß beginnt. Jeder Zug besteht aus zwei Teilen: " +
    "Zuerst wird eine eigene Amazone auf ein leeres benachbartes Feld oder über mehrere leere Felder in orthogonaler " +
    "oder diagonaler Richtung gezogen, genau wie eine Dame beim Schach. Sie darf dabei kein Feld überqueren oder " +
    "betreten, das bereits von einer eigenen oder gegnerischen Amazone oder einem Pfeil (Blockadestein) besetzt ist. " +
    "Anschließend verschießt die gezogene Amazone vom Endpunkt ihres Zuges aus einen „giftigen“ Pfeil (Blockadestein) " +
    "auf ein anderes Feld. Dieser Pfeil kann in jede orthogonale oder diagonale Richtung beliebig weit fliegen, " +
    "also wiederum wie eine Dame beim Schach. Er darf auch rückwärts in Richtung des Feldes geschossen werden, " +
    "von dem aus die Amazone gerade gezogen hat. Ein Pfeil darf jedoch kein Feld überqueren oder auf einem Feld landen, " +
    "wo sich bereits ein anderer Pfeil oder eine Amazone befindet. Es besteht Zugpflicht: der Spieler am Zug muss stets " +
    "eine Amazone ziehen und einen Pfeil verschießen. Verloren hat der Spieler, der als Erster nicht mehr ziehen kann.");

game.setGameMode("MOVING");

// Setup Meta Entities
var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

var player2 = game.createPlayer({
    name: "Scully",
    type: "ARTIFICIAL"
});

// Create the game board manually
var black = "gridCellBlack",
    white = "gridCellWhite";

// Create the game board
game.setupGridWorld(10, 10, [
    white, black, white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white, black, white
]);

// Add entity blueprints to the game to use them ingame
var // Movable entities
    black_queen = game.addBlueprint(player2, Spoooky.Blueprints.AMAZONS.entities.black_queen),
    white_queen = game.addBlueprint(player1, Spoooky.Blueprints.AMAZONS.entities.white_queen),
    // Placeable entities
    white_arrow = game.addBlueprint(player1, Spoooky.Blueprints.AMAZONS.entities.white_arrow),
    black_arrow = game.addBlueprint(player2, Spoooky.Blueprints.AMAZONS.entities.black_arrow);

// Put Entities on the game board
game.addEntitiesToGameBoard([
    0, 0, 0, black_queen, 0, 0, black_queen, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    black_queen, 0, 0, 0, 0, 0, 0, 0, 0, black_queen,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    white_queen, 0, 0, 0, 0, 0, 0, 0, 0, white_queen,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, white_queen, 0, 0, white_queen, 0, 0, 0
]);

// Set the player who will start the game
game.setPlayer(player1);

// Game rules and goals for the game of amazons
// Game Goal: Player 1 wins if no game piece of player 2 can move
game.addGameRuleAtom({
    atomName : "No entity of player 2 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player2.getID()
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Player 1 wins the game",
    atoms    : ["No entity of player 2 can move"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 1 wins the game",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning message",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 wins the Game!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// Fourth Game Goal: Player 2 wins if no game piece of player 1 can move
game.addGameRuleAtom({
    atomName : "No entity of player 1 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player1.getID()
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Player 2 wins the game",
    atoms    : ["No entity of player 1 can move"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 2 wins the game",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning message",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 wins the Game!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 48,
    cellHeight : 48 });