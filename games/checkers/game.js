// ******************* *** //
// *** Game Definition *** //
// *********************** //

// Create a new SpoookyJS game
var game = new Spoooky.Game;

game.initialize("Dame (Checkers / Draughts)");

game.setDescription("Gespielt wird nur auf den dunklen Feldern. Die Steine ziehen ein Feld in diagonaler Richtung, " +
    "aber nur vorwärts. Gegnerische Steine müssen übersprungen und dadurch geschlagen werden, sofern das direkt " +
    "angrenzende dahinter liegende Feld frei ist, indem auf dieses freie Feld gezogen wird. Wenn das Zielfeld " +
    "eines Sprungs auf ein Feld führt, von dem aus ein weiterer Stein übersprungen werden kann, so wird der " +
    "Sprung fortgesetzt. Alle übersprungenen Steine werden vom Brett genommen.");

var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

// Create a computer player
var player2 = game.createPlayer({
    name: "Scully",
    type: "ARTIFICIAL"
});

// Create cell visualization
var black = "gridCellBlack",
    white = "gridCellWhite";

game.setupGridWorld(8, 8, [
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white,
    white, black, white, black, white, black, white, black,
    black, white, black, white, black, white, black, white
]);

// Use entity blueprints (checker, king)
var p1std,
    p2std;

// Add standard entities Blueprints to the game
p1std = game.addBlueprint(player1, Spoooky.Blueprints.CHECKERS.entities.bottomStandardEntity);
p2std = game.addBlueprint(player2, Spoooky.Blueprints.CHECKERS.entities.topStandardEntity);

// Add Blueprints of king entities to the game to use them later
game.addBlueprint(player1, Spoooky.Blueprints.CHECKERS.entities.bottomKingEntity);
game.addBlueprint(player2, Spoooky.Blueprints.CHECKERS.entities.topKingEntity);

// Connect actions of the entities with consequences for the game
// Create game consequences for the fulfilled goals of the entities of player 2 (top player)
game.connectConsequences(Spoooky.Blueprints.CHECKERS.consequences.topPlayer);

// Create game consequences for the fulfilled goals of the entities of player 1 (bottom player)
game.connectConsequences(Spoooky.Blueprints.CHECKERS.consequences.bottomPlayer);

// Default setup

/*
game.addEntitiesToGameBoard([
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, p1std, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, p2std, 0, 0, 0, 0, 0,
    0, p1std, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
]);
*/
/*
game.addEntitiesToGameBoard([
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, p1std, 0,
    0, p1std, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, p1std, 0, p1std, 0, p2std, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0
]);
*/
game.addEntitiesToGameBoard([
    0, p2std, 0, p2std, 0, p2std, 0, p2std,
    p2std, 0, p2std, 0, p2std, 0, p2std, 0,
    0, p2std, 0, p2std, 0, p2std, 0, p2std,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    p1std, 0, p1std, 0, p1std, 0, p1std, 0,
    0, p1std, 0, p1std, 0, p1std, 0, p1std,
    p1std, 0, p1std, 0, p1std, 0, p1std, 0
]);

// Set the player who will start the game
game.setPlayer(player1);

// Game Goals for checkers
// Game Goal: Player 1 wins if no entity of player 2 can move
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

// Fourth Game Goal: Player 2 wins if no entity of player 1 can move
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

// Implement "Zugzwang" rule
// Order of game goals essential!
// Game Goal: Lastly moved entity can hit another opponent entity
game.addGameRuleAtom({
    atomName : "Recently moved entity captured an opponent entity",
    atomFunction : "Last Move Was Capture Move"
});

game.addGameRuleAtom({
    atomName : "Recently moved entity can capture an opponent entity",
    atomFunction : "Recently Moved Entity Can Capture An Opponent Entity"
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Zugzwang",
    atoms    : ["Recently moved entity captured an opponent entity",
        "Recently moved entity can capture an opponent entity"]
});

game.connectGameRuleConsequences({
    ruleName     : "Zugzwang",
    consequences : [{
        jobName: "Output Zugzwang message",
        jobFunction: "Print Game Process",
        jobArguments: "Zugzwang: Die zuletzt bewegte Spielfigur " +
            "muss eine weitere gegnerische Spielfigur schlagen."
    },{
        jobName: "Set Game State",
        jobFunction: "Set Game State",
        jobArguments: "ZUGZWANG"
    },{
        jobName: "Prevent Player Change",
        jobFunction: "Prevent Player Change"
    }]
});

// Release Zugzwang game state
game.addGameRuleAtom({
    atomName : "Game State Is Zugzwang",
    atomFunction : "Game State Is",
    atomArguments : "ZUGZWANG"
});

game.assembleGameRule({
    name     : "Zug unter Zugzwang",
    atoms    : ["Game State Is Zugzwang",
        "Recently moved entity can capture an opponent entity"]
});

game.connectGameRuleConsequences({
    ruleName     : "Zug unter Zugzwang",
    consequences : [{
        jobName: "Restrict selectable entities to current entity",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: "Recently Moved Entity"
    },{
        jobName: "Restrict selectable entity moves to capture moves",
        jobFunction: "Restrict Selectable Entity Moves",
        jobArguments: "Capture Moves"
    }]
});

game.addGameRuleAtom({
    atomName : "Recently moved entity can not capture an opponent entity",
    atomFunction : "Recently Moved Entity Can Not Capture An Opponent Entity"
});

game.assembleGameRule({
    name     : "Release Zugzwang",
    atoms    : ["Game State Is Zugzwang",
        "Recently moved entity can not capture an opponent entity"]
});

game.connectGameRuleConsequences({
    ruleName     : "Release Zugzwang",
    consequences : [{
        jobName: "Output Zugzwang message",
        jobFunction: "Print Game Process",
        jobArguments: "Zugzwang aufgehoben."
    },{
        jobName: "Enable Player Change",
        jobFunction: "Enable Player Change"
    },{
        jobName: "Proceed The Game",
        jobFunction: "Proceed Game"
    }]
});

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 62,
    cellHeight : 62 });