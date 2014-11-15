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

// Spieler 1 (weiß) startet das Spiel
game.setPlayer(player1);

var vline = "verticalLine",
    hline = "horizontalLine",
    dot = "dot",
    w = "gridCellWhite";
    b = "gridCellBlack";

game.setupGridWorld(11, 11, [
    dot, hline, hline, hline, hline, dot, hline, hline, hline, hline, dot,
    vline, w, w, w, w, vline, w, w, w, w, vline,
    vline, w, dot, hline, hline, dot, hline, hline, dot, w, vline,
    vline, w, vline, w, w, vline, w, w, vline, w, vline,
    vline, w, vline, w, dot, dot, dot, w, vline, w, vline,
    dot, hline, dot, hline, dot, w, dot, hline, dot, hline ,dot,
    vline, w, vline, w, dot, dot, dot, w, vline, w, vline,
    vline, w, vline, w, w, vline, w, w, vline, w, vline,
    vline, w, dot, hline, hline, dot, hline, hline, dot, w, vline,
    vline, w, w, w, w, vline, w, w, w, w, vline,
    dot, hline, hline, hline, hline, dot, hline, hline, hline, hline, dot
]);

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 45,
    cellHeight : 45 });
