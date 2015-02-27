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
    associatedWithMetaAgent : null,
    representation : { type : "image", texture : "assets/white.png" },
    mode : "PLACE",
    placeTo : "ANY"
};

var quantity = 3;
var black = game.addBlueprint(player2, blackStone, quantity),
    white = game.addBlueprint(player1, whiteStone, quantity);

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 37,
    cellHeight : 37 });