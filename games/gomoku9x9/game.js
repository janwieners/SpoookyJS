// ******************* *** //
// *** Game Definition *** //
// *********************** //

// Create a new SpoookyJS game
var game = new Spoooky.Game;

game.initialize("Gomoku 9x9");

game.setDescription("Beide Spieler markieren abwechselnd ein Spielfeld mit ihrem Spielsymbol. " +
    "Sieger ist, wer als erster fünf seiner Spielsymbole in einer ununterbrochenen " +
    "Reihe anordnen kann. Die Reihen dürfen horizontal, vertikal oder diagonal verlaufen.");

game.setGameMode("PLACING");

// Setup Meta Agents
var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

var player2 = game.createPlayer({
    name: "Scully",
    type: "ARTIFICIAL"
});

//player2.enableLearning();

// Create the game board
var w = "gridCellWhiteWithBorder";

game.setupGridWorld(9, 9, [
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w,
    w, w, w, w, w, w, w, w, w
]);

// Add entity blueprints to the game to use them ingame
var black = game.addBlueprint(player1, Spoooky.Blueprints.GOMOKU.entities.black),
    white = game.addBlueprint(player2, Spoooky.Blueprints.GOMOKU.entities.white);

game.addEntitiesToGameBoard([
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0, 0
]);

// Set the player who will start the game
game.setPlayer(player1);

// Game goals for tic tac toe
// Player 1 has three entities in a row
game.addGameRuleAtom({
    atomName : "Player1: Five entities in a row",
    atomFunction : "Player Has Number Of Entities In Row",
    atomArguments : {
        number : 5,
        playerID : player1.getID(),
        entityID : black.typeID
    }
});

game.assembleGameRule({
    name     : "Player 1 has Five entities in a row",
    atoms    : ["Player1: Five entities in a row"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 1 has Five entities in a row",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 wins!"
    }, {
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// Player 1 has three entities in a column
game.addGameRuleAtom({
    atomName : "Player1: Five entities in a column",
    atomFunction : "Player Has Number Of Entities In Column",
    atomArguments : {
        number : 5,
        playerID : player1.getID(),
        entityID : black.typeID
    }
});

game.assembleGameRule({
    name     : "Player 1 has Five entities in a column",
    atoms    : ["Player1: Five entities in a column"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 1 has Five entities in a column",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 wins!"
    }, {
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// Player 1 has three entities diagonally
game.addGameRuleAtom({
    atomName : "Player1: Five entities diagonally",
    atomFunction : "Player Has Number Of Entities Diagonally",
    atomArguments : {
        number : 5,
        playerID : player1.getID(),
        entityID : black.typeID
    }
});

game.assembleGameRule({
    name     : "Player 1 has Five entities diagonally",
    atoms    : ["Player1: Five entities diagonally"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 1 has Five entities diagonally",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 wins!"
    }, {
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// Game Goals For Player 2
// Player 2 has five entities in a row
game.addGameRuleAtom({
    atomName : "Player2: Five entities in a row",
    atomFunction : "Player Has Number Of Entities In Row",
    atomArguments : {
        number : 5,
        playerID : player2.getID(),
        entityID : white.typeID
    }
});

game.assembleGameRule({
    name     : "Player 2 has Five entities in a row",
    atoms    : ["Player2: Five entities in a row"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 2 has Five entities in a row",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 wins!"
    }, {
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// Player 2 has five entities in a column
game.addGameRuleAtom({
    atomName : "Player2: Five entities in a column",
    atomFunction : "Player Has Number Of Entities In Column",
    atomArguments : {
        number : 5,
        playerID : player2.getID(),
        entityID : white.typeID
    }
});

game.assembleGameRule({
    name     : "Player 2 has Five entities in a column",
    atoms    : ["Player2: Five entities in a column"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 2 has Five entities in a column",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 wins!"
    }, {
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// Player 2 has three entities diagonally
game.addGameRuleAtom({
    atomName : "Player2: Five entities diagonally",
    atomFunction : "Player Has Number Of Entities Diagonally",
    atomArguments : {
        number : 5,
        playerID : player2.getID(),
        entityID : white.typeID
    }
});

game.assembleGameRule({
    name     : "Player 2 has Five entities diagonally",
    atoms    : ["Player2: Five entities diagonally"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 2 has Five entities diagonally",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 wins!"
    }, {
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// Draw rule
game.addGameRuleAtom({
    atomName : "Every Field Has Been Played",
    atomFunction : "No Empty Field On The Game Board"
});

game.addGameRuleAtom({
    atomName : "Game State is INGAME",
    atomFunction : "Game State Is",
    atomArguments : "INGAME"
});

game.assembleGameRule({
    name     : "Draw If Game Board Is Full",
    atoms    : ["Every Field Has Been Played",
        "Game State is INGAME"]
});

game.connectGameRuleConsequences({
    ruleName     : "Draw If Game Board Is Full",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Draw Message",
        jobFunction: "Print Game Process",
        jobArguments: "Draw!"
    }]});

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
var SpoookyGame = new Spoooky.AngularWrapper({
    game : game,
    cellWidth : 55,
    cellHeight : 55 });