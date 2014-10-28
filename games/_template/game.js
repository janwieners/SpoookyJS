// ******************* *** //
// *** Game Definition *** //
// *********************** //

// Create a new SpoookyJS game
var game = new Spoooky.Game;

game.initialize("Game Template");

game.setDescription("Set the game description (game rules, ...)");

// Tell the game that it is a game where entities are placed on the game board
game.setGameMode("PLACING");

var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

var player2 = game.createPlayer({
    name: "Scully",
    type: "ARTIFICIAL"
});

// Add an entity to the game
game.addBlueprint(player1, {
        entityType : "White",
        typeID : "A",
        associatedWithMetaAgent : null,
        representation : { type : "image", texture : "assets/white.png" },
        mode : "PLACE",
        placeTo : "ANY"
});

// Add an entity to the game by using an entity blueprint
game.addBlueprint(player2, Spoooky.Blueprints.TICTACTOE.entities.black);

// Create the game world by setting the css cell class names
game.setupGridWorld(3, 3, [
    "gridCellWhite", "gridCellBlack", "gridCellWhite",
    "gridCellBlack", "gridCellWhite", "gridCellBlack",
    "gridCellWhite", "gridCellBlack", "gridCellWhite"
]);

// Example game rule: Player 1 wins if he / she has got three entities in a row
game.addGameRuleAtom({
    atomName : "Player1: Three entities in a row",
    atomFunction : "Player Has Number Of Entities In Row",
    atomArguments : {
        number : 3,
        playerID : player1.getID(),
        entityID : "A" // Uses the typeID of the entity
    }
});

game.assembleGameRule({
    name     : "Player 1 has three entities in a row",
    atoms    : ["Player1: Three entities in a row"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 1 has three entities in a row",
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

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
var SpoookyGame = new Spoooky.AngularWrapper({
    game : game,
    cellWidth : 105,
    cellHeight : 105 });