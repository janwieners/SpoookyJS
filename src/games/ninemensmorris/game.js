// Ein neues SpoookyJS Spiel erstellen
var game = new Spoooky.Game;

// Bootstrapping-Funktion: Instanzen aller benötigten Controller generieren
game.initialize("Mühle / Nine Men's Morris");

// Beschreibung der Schachvariante
game.setDescription("Mühle, in der Schweiz auch Nünistei („neun Steine“) genannt, " +
"ist ein Brettspiel für zwei Spieler. Das Spielbrett besteht aus drei ineinander " +
"liegenden Quadraten mit Verbindungslinien in den Seitenmitten. Als Spielfiguren " +
"werden gewöhnlich neun schwarze und neun weiße runde, flache Spielsteine verwendet, " +
"die meist aus Holz oder Kunststoff sind. Andere Farben sind auch möglich." +
"<br>Ziel des Spiels ist es, entweder durch das Bilden sogenannter Mühlen " +
"(jeweils drei eigene Steine in einer Reihe) so viele gegnerische Steine zu " +
"schlagen, dass der Gegner nur noch zwei Steine übrig behält, oder die auf dem " +
"Spielbrett verbliebenen gegnerischen Steine so zu blockieren, dass der Gegner " +
"nicht mehr ziehen kann.<br>" +
"<h5>Spielregeln</h5>" +
"Das Spiel läuft in drei Phasen ab:" +
"<ul>" +
"<li>Setzphase: Die Spieler setzen abwechselnd je einen Stein, insgesamt je neun, auf Kreuzungs- oder Eckpunkte des Brettes</li>" +
"<li>Zugphase: Die Spielsteine werden gezogen, das heißt, pro Runde darf jeder Spieler einen Stein auf einen angrenzenden, freien Punkt bewegen. Kann ein Spieler keinen Stein bewegen, so hat er verloren.</li>" +
"<li>Endphase: Sobald ein Spieler nur noch drei Steine hat, darf er mit seinen Steinen springen, das heißt, er darf nun pro Runde mit einem Stein an einen beliebigen freien Punkt springen. Sobald ihm ein weiterer Stein abgenommen wird, hat er das Spiel verloren.</li>" +
"<li>Drei Steine einer Farbe, die in einer Geraden auf Feldern nebeneinander liegen, nennt man eine \"Mühle\". Wenn ein Spieler eine Mühle schließt, darf er einen beliebigen Stein des Gegners aus dem Spiel nehmen, sofern dieser Stein nicht ebenfalls Bestandteil einer Mühle ist.</li>" +
"</ul>(<a href=\"http://de.wikipedia.org/wiki/M%C3%BChle_%28Spiel%29\">http://de.wikipedia.org/wiki/M%C3%BChle_%28Spiel%29</a>)");

// Menschlichen Spieler erstellen
var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

// Artifiziellen Gegner erstellen
var player2 = game.createPlayer({
    name: "Scully",
    type: "ARTIFICIAL"
});

// Set the start player
game.setPlayer(player1);

// The game of nine men's morris starts with the placing of entities
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

// Add nine entities for each player to the game
var quantity = 9;

// Manually set player IDs
player1.setID(0);
player2.setID(1);

// Blueprints use player IDs from above (player1 => 0, player 2 => 1)
var white = game.addBlueprint(player1, Spoooky.Blueprints.NINEMENSMORRIS.entities.white, quantity),
    black = game.addBlueprint(player2, Spoooky.Blueprints.NINEMENSMORRIS.entities.black, quantity);

/*
// Test setup
game.addEntitiesToGameBoard([
    white,0,0,0,0,0,black,0,0,0,0,0,black,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,black,0,0,0,black,0,0,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,white,0,black,0,black,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    white,0,0,0,black,0,0,0,black,0,white,0,black,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,white,0,black,0,black,0,0,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    0,0,0,0,0,0,black,0,0,0,black,0,0,
    0,0,0,0,0,0,0,0,0,0,0,0,0,
    black,0,0,0,0,0,black,0,0,0,0,0,0]);

//game.setGameMode("MOVING");
*/

// *** Game Rules ***
var cellConnections = [
    // Horizontal
    [1, 2, 3],
    [4, 5, 6],
    [7, 8, 9],
    [10, 11, 12],
    [13, 14, 15],
    [16, 17, 18],
    [19, 20, 21],
    [22, 23, 24],
    // Vertical
    [1, 10, 22],
    [4, 11, 19],
    [7, 12, 16],
    [2, 5, 8],
    [17, 20, 23],
    [9, 13, 18],
    [6, 14, 21],
    [3, 15, 24]
];

// Set the cell connections to let the players recognize patterns of enemy entities
player1.setCellConnections(cellConnections);
player2.setCellConnections(cellConnections);

// Take an opponent entity from the game board if the last move
// of the current player led to a mill
game.addGameRuleAtom({
    atomName : "Three entities on a line with last move",
    atomFunction : "Player Has Entities On Nearby Connected Fields After Last Move",
    // Field IDs, clusters are OR-connected
    atomArguments : cellConnections
});

// Check for free entities of the opponent player
game.addGameRuleAtom({
    atomName : "Opponent has free entities on the game board",
    atomFunction : "Non-associated Opponent Entities",
    // Define associations
    atomArguments : cellConnections
});

// If one player has three entities on a line...
game.assembleGameRule({
    name     : "Enable Capture Move",
    atoms    : ["Three entities on a line with last move",
        "Opponent has free entities on the game board"]
});

// ...then prevent a player change and restrict moves to capture move
game.connectGameRuleConsequences({
        ruleName: "Enable Capture Move",
        consequences: [{
            jobName: "Output Capture message",
            jobFunction: "Print Game Process",
            jobArguments: "Mühle."
        }, {
            jobName: "Restrict Moves To Capture Moves",
            jobFunction: "Change Game Mode",
            jobArguments: {  mode : "FREE CAPTURE" }
        }]
    });

// Change game mode to "MOVING" if every entity of the players has been placed
// on the game board
game.addGameRuleAtom({
    atomName : "Every entity has been placed on the game board",
    atomFunction : "All players have placed their entities on the game board"
});

game.addGameRuleAtom({
    atomName : "Game is not in FREE CAPTURE mode",
    atomFunction : "Game Mode Is Not",
    atomArguments : "FREE CAPTURE"
});

// Change game mode only if the last move didn't led to a mill
game.assembleGameRule({
    name     : "Change game mode to moving",
    atoms    : ["Game is not in FREE CAPTURE mode", "Every entity has been placed on the game board"]
});

game.connectGameRuleConsequences({
    ruleName     : "Change game mode to moving",
    consequences : [{
        jobName: "Output message",
        jobFunction: "Print Game Process",
        jobArguments: "Alle Spielfiguren befinden sich nun auf dem Spielbrett."
    }, {
        jobName: "Let the players move their entities",
        jobFunction: "Change Game Mode",
        jobArguments: { mode: "MOVING" }
    }, {
        jobName: "Change current player",
        jobFunction: "Next Player"
    }, {
        jobName: "Delete this game rule",
        jobFunction: "Delete Game Rule",
        jobArguments: { ruleName: "Change game mode to moving" }
    }]});

// Game Rule: Player 1 wins if no entity of player 2 can move
game.addGameRuleAtom({
    atomName : "No entity of player 2 can be placed",
    atomFunction : "Player Has No Placeable Entities",
    atomArguments : player2.getID()
});

game.addGameRuleAtom({
    atomName : "No entity of player 2 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player2.getID()
});

game.addGameRuleAtom({
    atomName : "Player 2 owns more than two entities",
    atomFunction : "Player Owns > n Entities",
    atomArguments : { playerID : player2.getID(),
        value : 2,
        state : true }
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Player 1 wins the game",
    atoms    : ["No entity of player 2 can be placed",
        "No entity of player 2 can move",
        "Player 2 owns more than two entities"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 1 wins the game",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning message",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 1 gewinnt das Spiel!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// Game Rule: Player 2 wins if no entity of player 1 can move
game.addGameRuleAtom({
    atomName : "No entity of player 1 can be placed",
    atomFunction : "Player Has No Placeable Entities",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "No entity of player 1 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Player 1 owns more than two entities",
    atomFunction : "Player Owns > n Entities",
    atomArguments : { playerID : player1.getID(),
        value : 2,
        state : true }
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Player 2 wins the game",
    atoms    : ["No entity of player 1 can be placed",
        "No entity of player 1 can move",
        "Player 1 owns more than two entities"]
});

game.connectGameRuleConsequences({
    ruleName     : "Player 2 wins the game",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning message",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 2 gewinnt das Spiel!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player2.getID()
    }]});

// Game Rule: Player wins if opponent has got only two entities on the game board
game.addGameRuleAtom({
    atomName : "Player 1 has got only two entities",
    atomFunction : "Player Has Number Of Entities",
    atomArguments : [player1.getID(), 2]
});

game.addGameRuleAtom({
    atomName : "Player 2 has got only two entities",
    atomFunction : "Player Has Number Of Entities",
    atomArguments : [player2.getID(), 2]
});

// Assemble winning condition for player 1
game.assembleGameRule({
    name     : "Only two entities: Player 1 wins the game",
    atoms    : ["Player 2 has got only two entities"]
});

game.connectGameRuleConsequences({
    ruleName     : "Only two entities: Player 1 wins the game",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning message",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 1 gewinnt das Spiel!"
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// Assemble winning condition for player 2
game.assembleGameRule({
    name     : "Only two entities: Player 2 wins the game",
    atoms    : ["Player 1 has got only two entities"]
});

game.connectGameRuleConsequences({
    ruleName     : "Only two entities: Player 2 wins the game",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output winning message",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 2 gewinnt das Spiel!"
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
    cellWidth : 37,
    cellHeight : 37 });