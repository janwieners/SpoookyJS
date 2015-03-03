// Ein neues SpoookyJS Spiel erstellen
var game = new Spoooky.Game;

// Bootstrapping-Funktion: Instanzen aller benötigten Controller generieren
game.initialize("Mühle / Nine Men's Morris");

// Beschreibung der Schachvariante
game.setDescription("");

// Menschlichen Spieler erstellen
var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

// Artifiziellen Gegner erstellen
var player2 = game.createPlayer({
    name: "Scully",
    type: "HUMAN"
});

game.setPlayer(player1);

game.setGameMode("PLACING");

var vline = "verticalLine disabled",
    hline = "horizontalLine disabled",
    w = "gridCellWhite disabled",
    dot = "dot";

game.setupGridWorld(13, 13, [
    dot, hline, hline, hline, hline, hline, dot, hline, hline, hline, hline, hline, dot,
    vline, w, w, w, w, w, vline, w, w, w, w, w, vline,
    vline, w, dot, hline, hline, hline, dot, hline, hline, hline, dot, w, vline,
    vline, w, vline, w, w, w, vline, w, w, w, vline, w, vline,
    vline, w, vline, w, dot, hline, dot, hline, dot, w, vline, w, vline,
    vline, w, vline, w, vline, w, w, w, vline, w, vline, w, vline,
    dot, hline, dot, hline, dot, w, w, w, dot, hline, dot, hline, dot,
    vline, w, vline, w, vline, w, w, w, vline, w, vline, w, vline,
    vline, w, vline, w, dot, hline, dot, hline, dot, w, vline, w, vline,
    vline, w, vline, w, w, w, vline, w, w, w, vline, w, vline,
    vline, w, dot, hline, hline, hline, dot, hline, hline, hline, dot, w, vline,
    vline, w, w, w, w, w, vline, w, w, w, w, w, vline,
    dot, hline, hline, hline, hline, hline, dot, hline, hline, hline, hline, hline, dot
]);

// Automatically create field IDs for fields with CSS class "dot"
// To do this manually use gameWorld.setFieldIDs
game.getGameWorld().enumerateFieldIDsByClass("dot");

// Connect cells by using their IDs
// ...this needs an interface...
game.getGameWorld().connectCells({
    // Connect cell #1 with cell #2 and cell #4
    1: [2, 10],
    // Connect cell #2 with cells #1, #3 and #5
    2: [1, 3, 5],
    3: [2, 15],
    4: [5, 11],
    5: [2, 4, 6, 8],
    6: [5, 14],
    7: [8, 12],
    8: [5, 7, 9],
    9: [8, 13],
    10: [1, 11, 22],
    11: [4, 10, 12, 19],
    12: [7, 11, 16],
    13: [9, 14, 18],
    14: [6, 13, 15, 21],
    15: [3, 14, 24],
    16: [12, 17],
    17: [16, 18, 20],
    18: [13, 17],
    19: [11, 20],
    20: [17, 19, 21, 23],
    21: [14, 20],
    22: [10, 23],
    23: [20, 22, 24],
    24: [15, 23] });


// Blueprints of the starting pieces
var blackStone = {
    entityType : "Black",
    typeID : "B",
    associatedWithMetaAgent : null,
    representation : { type : "image", texture : "assets/black.png" },
    mode : "PLACE",
    placeTo : "ANY"
};

var whiteStone = {
    entityType : "White",
    typeID : "W",
    representation : { type : "image", texture : "assets/white.png" },
    mode : "PLACE",
    placeTo : "ANY"
};

var quantity = 1;
var black = game.addBlueprint(player2, blackStone, 1),
    white = game.addBlueprint(player1, whiteStone, quantity);

/*
var whiteMove = {

    entityType : "White",
    typeID : "W",
    representation : { type : "image", texture : "assets/white.png" },

    moves : [
        {
            name : "north",
            type : "Default",
            direction : "north",
            frequency : 1,
            conditions : [{ condition : "Is Empty", state : true }]
        }, {
            name : "east",
            type : "Default",
            direction : "east",
            frequency : 1,
            conditions : [{ condition : "Is Empty", state : true }]
        },
        {
            name : "south",
            type : "Default",
            direction : "south",
            frequency : 1,
            conditions : [{ condition : "Is Empty", state : true }]
        },
        {
            name : "west",
            type : "Default",
            direction : "west",
            frequency : 1,
            conditions : [{ condition : "Is Empty", state : true }]
        }]
};

game.addBlueprint(player1, whiteMove);

game.addEntitiesToGameBoard([whiteMove,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0]);
*/

// Game Rules

// Change game mode to "MOVING" if every entity of the players has been placed
// on the game board
game.addGameRuleAtom({
    atomName : "Every entity has been placed on the game board",
    atomFunction : "All players have placed their entities on the game board"
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Change game mode to moving",
    atoms    : ["Every entity has been placed on the game board"]
});

game.connectGameRuleConsequences({
    ruleName     : "Change game mode to moving",
    consequences : [{
        jobName: "Let the players move their entities",
        jobFunction: "Change Game Mode",
        jobArguments: { mode: "MOVING" }
    }, {
        jobName: "Delete this game rule",
        jobFunction: "Delete Game Rule",
        jobArguments: { ruleName: "Change game mode to moving" }
    }
    ]});

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 37,
    cellHeight : 37 });