// ******************* *** //
// *** Game Definition *** //
// *********************** //

// Create a new SpoookyJS game
var game = new Spoooky.Game;

game.initialize("Schach");

// Setup Meta agents
var player1 = game.createPlayer({
    name: "Jan",
    //type: "ARTIFICIAL"
    type: "HUMAN"
});

//player1.enableLearning();

// Create a computer player
var player2 = game.createPlayer({
    name: "Chuck",
    //type: "ARTIFICIAL"
    type: "HUMAN"
});

//player2.enableLearning();

// Create the game board manually
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

// Add entity blueprints to the game to use them in the game
var black_bishop = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_bishop),
    black_king = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_king),
    black_knight = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_knight),
    black_pawn = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_pawn),
    black_queen = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_queen),
    black_rook_left = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_rook),
    black_rook_right = game.addBlueprint(player2, Spoooky.Blueprints.CHESS.entities.black_rook),

    white_bishop = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_bishop),
    white_king = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_king),
    white_knight = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_knight),
    white_pawn = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_pawn),
    white_queen = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_queen),
    white_rook_left = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_rook),
    white_rook_right = game.addBlueprint(player1, Spoooky.Blueprints.CHESS.entities.white_rook);

// Extend the blueprint with the name of the entity to enable castling
game.extendBlueprint(black_rook_left, { entityName :"Black Rook Left" });
game.extendBlueprint(black_rook_right, { entityName :"Black Rook Right" });
game.extendBlueprint(white_rook_left, { entityName :"White Rook Left" });
game.extendBlueprint(white_rook_right, { entityName :"White Rook Right" });

// Connect actions of the entities with consequences for the game
// Create game consequences for the fulfilled goals of the entities of player 2 (top player)
game.connectConsequences(Spoooky.Blueprints.CHESS.consequences.blackPlayer);

// Create game consequences for the fulfilled goals of the entities of player 1 (bottom player)
game.connectConsequences(Spoooky.Blueprints.CHESS.consequences.whitePlayer);

// Create Game Board: Put entities on the game board
// Standard Setup
game.addEntitiesToGameBoard([
    black_rook_left, black_knight, black_bishop, black_queen, black_king, black_bishop, black_knight, black_rook_right,
    black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn, black_pawn,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    0, 0, 0, 0, 0, 0, 0, 0,
    white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn, white_pawn,
    white_rook_left, white_knight, white_bishop, white_queen, white_king, white_bishop, white_knight, white_rook_right
]);

// Set the player who will start the game
game.setPlayer(player2);

// *******************
// Game Goals for Chess
// *******************
// Draw: King vs. King
game.addGameRuleAtom({
    atomName : "Player 1 (white) has got only one entity",
    atomFunction : "Player Has Number Of Entities",
    atomArguments : [ player1.getID(), 1 ]
});

game.addGameRuleAtom({
    atomName : "Player 2 (white) has got only one entity",
    atomFunction : "Player Has Number Of Entities",
    atomArguments : [ player2.getID(), 1 ]
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Draw: King vs. King",
    atoms    : ["Player 1 (white) has got only one entity",
        "Player 2 (white) has got only one entity"]
});

game.connectGameRuleConsequences({
    ruleName     : "Draw: King vs. King",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Check Message",
        jobFunction: "Print Game Process",
        jobArguments: "DRAW!"
    }]});

// King of player 1 (white) is in check
game.addGameRuleAtom({
    atomName : "King of player 1 (white) is in check",
    atomFunction : "Entity Is Under Attack",
    atomArguments : white_king
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Check (Player 1)",
    atoms    : ["King of player 1 (white) is in check"]
});

game.connectGameRuleConsequences({
    ruleName     : "Check (Player 1)",
    consequences : [{
        jobName: "Output Check Message",
        jobFunction: "Print Game Process",
        jobArguments: "King of Player 1 is in check!"
    },{
        jobName: "Change current player",
        jobFunction: "Next Player"
    },{
        jobName: "Set Game State",
        jobFunction: "Set Game State",
        jobArguments: "CHECK"
    }]});

// ************************************
// King of player 2 (black) is in check
game.addGameRuleAtom({
    atomName : "King of player 2 (black) is in check",
    atomFunction : "Entity Is Under Attack",
    atomArguments : black_king
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Check (Player 2)",
    atoms    : ["King of player 2 (black) is in check"]
});

game.connectGameRuleConsequences({
    ruleName     : "Check (Player 2)",
    consequences : [{
        jobName: "Output Check Message",
        jobFunction: "Print Game Process",
        jobArguments: "King of Player 2 is in check!"
    },{
        jobName: "Change current player",
        jobFunction: "Next Player"
    },{
        jobName: "Set Game State",
        jobFunction: "Set Game State",
        jobArguments: "CHECK"
    }]});

// *****************************
// *** Player 1 is checkmate ***
game.addGameRuleAtom({
    atomName : "No entity of player 1 can help the king entity",
    atomFunction : "Got No Protecting Entities",
    // Specify the entity to protect
    atomArguments : white_king
});

game.addGameRuleAtom({
    atomName : "Game State is CHECK",
    atomFunction : "Game State Is",
    atomArguments : "CHECK"
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Checkmate (Player 1)",
    atoms    : ["King of player 1 (white) is in check",
        "No entity of player 1 can help the king entity",
        "Game State is CHECK"]
});

game.connectGameRuleConsequences({
    ruleName     : "Checkmate (Player 1)",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Checkmate Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 is checkmate."
    },{
        jobName: "Output winning Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 wins!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// *****************************
// *** Player 2 is checkmate ***
game.addGameRuleAtom({
    atomName : "No entity of player 2 can help the king entity",
    atomFunction : "Got No Protecting Entities",
    // Specify the entity to protect
    atomArguments : black_king
});

game.assembleGameRule({
    name     : "Checkmate (Player 2)",
    atoms    : ["King of player 2 (black) is in check",
        "No entity of player 2 can help the king entity",
        "Game State is CHECK"]
});

game.connectGameRuleConsequences({
    ruleName     : "Checkmate (Player 2)",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Checkmate Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 is checkmate."
    },{
        jobName: "Output winning Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 wins!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// *****************************
// *** Player 1 is stalemate ***
game.addGameRuleAtom({
    atomName : "No entity of player 1 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Game State is INGAME",
    atomFunction : "Game State Is",
    atomArguments : "INGAME"
});

game.assembleGameRule({
    name     : "Stalemate (Player 1)",
    atoms    : ["No entity of player 1 can move",
        "Game State is INGAME"]
});

game.connectGameRuleConsequences({
    ruleName     : "Stalemate (Player 1)",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Stalemate Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 is stalemate."
    },{
        jobName: "Output winning Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 wins!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// *****************************
// *** Player 2 is stalemate ***
game.addGameRuleAtom({
    atomName : "No entity of player 2 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player2.getID()
});

game.assembleGameRule({
    name     : "Stalemate (Player 2)",
    atoms    : ["No entity of player 2 can move",
        "Game State is INGAME"]
});

game.connectGameRuleConsequences({
    ruleName     : "Stalemate (Player 2)",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Stalemate Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 is stalemate."
    },{
        jobName: "Output winning Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 wins!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 63,
    cellHeight : 63 });