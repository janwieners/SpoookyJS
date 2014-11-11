// Ein neues SpoookyJS Spiel erstellen
var game = new Spoooky.Game;

// Bootstrapping-Funktion: Instanzen aller benötigten Controller generieren
game.initialize("Schachvariante 5x6 (Tutorial)");

// Beschreibung der Schachvariante
game.setDescription("Die Schachvariante wird gespielt auf einem Spielbrett " +
    "mit 5x8 Spielfeldern und einer reduzierten Anzahl von Spielfiguren. " +
    "Gespielt wird nach den klassischen Zug- und Spielregeln des Schachspieles - " +
    "ausgenommen ist die Fähigkeit der Spielfiguren, zu rochieren und das Schlagen " +
    "gegnerischer Spielfiguren en passant.");

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

// Spieler 1 (weiß) startet das Spiel
game.setPlayer(player1);

// CSS-Klassennamen (vordefiniert in css/spoookystyle.css)
// zur vereinfachten Verwendung in Variablen speichern
var b = "gridCellBlack",
    w = "gridCellWhite";

// Spielbrett mit 5x6 Spielfeldzellen erstellen
game.setupGridWorld(5, 6, [
    w, b, w, b, w,
    b, w, b, w, b,
    w, b, w, b, w,
    b, w, b, w, b,
    w, b, w, b, w,
    b, w, b, w, b
]);

// ***************************** //
// *** Interface / AngularJS *** //
// ***************************** //
Spoooky.AngularWrapper({
    game : game,
    cellWidth : 100,
    cellHeight : 100 });

// Spielfigurenblaupause für den weißen Bauern
var white_pawn = {

    entityType : "White Pawn",

        typeID : "BA",

        associatedWithMetaAgent : null,

        // Visualization of the entity
        representation : { type : "image", texture : "assets/white_pawn.png" },

    // After a virtual move to the move destination: test for capturable own king
    postMoveCheck : [{ condition : "Entity Is Attackable After Move",
        state : false, entity : "White King" }],

        // Moves of the entity
        moves : [{
        name : "north",
        type : "Default",
        direction : "north",
        frequency : 1,
        conditions : [{ condition : "Is Empty", state : true },
            { condition : "Is Not The First Row", state : true }]
    },
        {
            name : "entry move: two fields north",
            type : "Default",
            direction : [ 0, -2 ],
            frequency : 1,
            conditions : [
                { condition : "Is Empty", state : true },
                // Do not overjump entities
                { condition : "Is Empty At", relativeCoordinate : [ 0, -1 ], state : true },
                { condition : "yPosition", value : 4, state : true }
            ]
        }],

        // Sub Goals
        goalAtoms : [{
        atomName : "opponent northeast",
        atomFunction : "Is Opponent",
        atomArguments : "northeast"
    },{
        atomName : "opponent northwest",
        atomFunction : "Is Opponent",
        atomArguments : "northwest"
    }, {
        atomName : "empty field north",
        atomFunction : "Is Empty Cell",
        atomArguments : "north"
    }, {
        atomName : "current entity is at y position 3",
        atomFunction : "Current Y Position Is",
        atomArguments : 3
    },{
        atomName : "black pawn entity at cell west",
        atomFunction : "Entity At Cell Is Of Type",
        atomArguments : [ -1, 0, "Black Pawn" ]
    },{
        atomName : "black pawn entity at cell east",
        atomFunction : "Entity At Cell Is Of Type",
        atomArguments : [ +1, 0, "Black Pawn" ]
    },{
        atomName : "black pawn entity west has been moved only one time",
        atomFunction : "Entity At Cell Has Been Moved n Times",
        atomArguments : [ -1, 0, 1 ]
    },{
        atomName : "black pawn entity east has been moved only one time",
        atomFunction : "Entity At Cell Has Been Moved n Times",
        atomArguments : [ +1, 0, 1 ]
    },{
        atomName : "black pawn entity west was the last moved entity",
        atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
        atomArguments : [ -1, 0 ]
    },{
        atomName : "black pawn entity east was the last moved entity",
        atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
        atomArguments : [ +1, 0 ]
    }, {
        atomName : "white pawn can reach the first row with north move",
        atomFunction : "Entity Is Able To Reach A Specific Row",
        atomArguments : [ "first", "north" ]
    }],

        // Assemble sub goals / goal atoms to game goals of the entity
        goals : [{
        type     : "CAPTURE",
        name     : "capture opponent northeast",
        atoms    : ["opponent northeast"],
        move     : "northeast"
    },{
        type     : "CAPTURE",
        name     : "capture opponent northwest",
        atoms    : ["opponent northwest"],
        move     : "northwest"
    },{
        type     : "CAPTURE",
        name     : "capture opponent northwest en passant",
        atoms    : ["current entity is at y position 3",
            "black pawn entity at cell west",
            "black pawn entity west has been moved only one time",
            "black pawn entity west was the last moved entity"],
        move     : "northwest"
    },{
        type     : "CAPTURE",
        name     : "capture opponent northeast en passant",
        atoms    : ["current entity is at y position 3",
            "black pawn entity at cell east",
            "black pawn entity east has been moved only one time",
            "black pawn entity east was the last moved entity"],
        move     : "northeast"
    }, {
        type     : "GOALMOVE",
        name     : "reach the first row with north move",
        atoms    : ["empty field north",
            "white pawn can reach the first row with north move"],
        move     : "north"
    }]
};

// Spielfigurenblaupause für den schwarzen Bauern
var black_pawn = {

    typeID : "AA",
        entityType : "Black Pawn",
        associatedWithMetaAgent : null,
        representation : { type : "image",
        texture : "assets/black_pawn.png" },
    // Zugbedingung: Prüfen, ob der eigene König nach
    // ausgeführter Zugmöglichkeit des Bauern angreifbar ist
    postMoveCheck : [{
        condition : "Entity Is Attackable After Move",
        state : false, entity : "Black King" }],
        // Zugmöglichkeiten der Spielfigur
        moves : [{
        name : "Zug in Richtung des unteren Spielfeldrandes",
        type : "Default",
        direction : "south",
        frequency : 1,
        conditions : [
            { condition : "Is Empty",
                state : true },
            { condition : "Is Not The Last Row",
                state : true }]
    }, {
        name : "Startzug: Zwei Felder nach unten",
        type : "Default",
        direction : [ 0, +2 ],
        frequency : 1,
        conditions : [
            { condition : "Is Empty",
                state : true },
            // Andere Spielfiguren dürfen nicht
            // übersprungen werden
            { condition : "Is Empty At",
                relativeCoordinate : [ 0, +1 ],
                state : true },
            { condition : "yPosition",
                value : 1, state : true }
        ]
    }],
        // Definition von Unterzielen, die anschließend
        // zu Zielen der Spielfigur zusammengesetzt werden
        goalAtoms : [{
        atomName : "Gegner auf suedoestlich angrenzendem Feld",
        atomFunction : "Is Opponent",
        atomArguments : "southeast"
    },{
        atomName : "Gegner auf suedwestlich angrenzendem Feld",
        atomFunction : "Is Opponent",
        atomArguments : "southwest"
    }, {
        atomName : "Leeres Feld Suedlich",
        atomFunction : "Is Empty Cell",
        atomArguments : "south"
    }, {
        atomName : "Figur steht auf einem Spielfeld in Zeile vier",
        atomFunction : "Current Y Position Is",
        atomArguments : 4
    },{
        atomName : "Weißer Bauer westlich",
        atomFunction : "Entity At Cell Is Of Type",
        atomArguments : [ -1, 0, "White Pawn" ]
    },{
        atomName : "Weißer Bauer oestlich",
        atomFunction : "Entity At Cell Is Of Type",
        atomArguments : [ +1, 0, "White Pawn" ]
    },{
        atomName : "Weißer Bauer westlich wurde nur einmal bewegt",
        atomFunction : "Entity At Cell Has Been Moved n Times",
        atomArguments : [ -1, 0, 1 ]
    },{
        atomName : "Weißer Bauer oestlich wurde nur einmal bewegt",
        atomFunction : "Entity At Cell Has Been Moved n Times",
        atomArguments : [ +1, 0, 1 ]
    },{
        atomName : "Weißer Bauer westlich wurde zuletzt bewegt",
        atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
        atomArguments : [ -1, 0 ]
    },{
        atomName : "Weißer Bauer oestlich wurde zuletzt bewegt",
        atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
        atomArguments : [ +1, 0 ]
    }, {
        atomName : "Spielfigur kann die unterste Reihe erreichen",
        atomFunction : "Entity Is Able To Reach A Specific Row",
        atomArguments : [ "last", "south" ]
    }],
        // Zielatome zu Spielsteinzielen zusammensetzen
        goals : [{
        type     : "CAPTURE",
        name     : "Schlage Spielfigur auf Feld suedost",
        atoms    : ["Gegner auf suedoestlich angrenzendem Feld"],
        move     : "southeast"
    },{
        type     : "CAPTURE",
        name     : "Schlage Spielfigur auf Feld suedwest",
        atoms    : ["Gegner auf suedwestlich angrenzendem Feld"],
        move     : [ -1, +1 ]
    },{
        type     : "CAPTURE",
        name     : "Schlage Gegner en passant suedwestlich",
        atoms    : ["Figur steht auf einem Spielfeld in Zeile vier",
            "Weißer Bauer westlich",
            "Weißer Bauer westlich wurde nur einmal bewegt",
            "Weißer Bauer westlich wurde zuletzt bewegt"],
        move     : "southwest"
    },{
        type     : "CAPTURE",
        name     : "Schlage Gegner en passant suedoestlich",
        atoms    : ["Figur steht auf einem Spielfeld in Zeile vier",
            "Weißer Bauer oestlich",
            "Weißer Bauer oestlich wurde nur einmal bewegt",
            "Weißer Bauer oestlich wurde zuletzt bewegt"],
        move     : "southeast"
    }, {
        type     : "GOALMOVE",
        name     : "Erreiche die letzte Reihe des Spielbrettes",
        atoms    : ["Leeres Feld Suedlich",
            "Spielfigur kann die unterste Reihe erreichen"],
        move     : "south"
    }]
};


// Entitätenblaupausen dem Spiel hinzufügen
var black_bishop = game.addBlueprint(player2,
        Spoooky.Blueprints.CHESS.entities.black_bishop),
    black_king = game.addBlueprint(player2,
        Spoooky.Blueprints.CHESS.entities.black_king),
    black_knight = game.addBlueprint(player2,
        Spoooky.Blueprints.CHESS.entities.black_knight),
    black_pawn = game.addBlueprint(player2, black_pawn),
    black_queen = game.addBlueprint(player2,
        Spoooky.Blueprints.CHESS.entities.black_queen),
    black_rook = game.addBlueprint(player2,
        Spoooky.Blueprints.CHESS.entities.black_rook),

    white_bishop = game.addBlueprint(player1,
        Spoooky.Blueprints.CHESS.entities.white_bishop),
    white_king = game.addBlueprint(player1,
        Spoooky.Blueprints.CHESS.entities.white_king),
    white_knight = game.addBlueprint(player1,
        Spoooky.Blueprints.CHESS.entities.white_knight),
    white_pawn = game.addBlueprint(player1, white_pawn),
    white_queen = game.addBlueprint(player1,
        Spoooky.Blueprints.CHESS.entities.white_queen),
    white_rook = game.addBlueprint(player1,
        Spoooky.Blueprints.CHESS.entities.white_rook);

// Entitätenziele mit Folgen für das Spiel und die Spielwelt verknüpfen
game.connectConsequences(Spoooky.Blueprints.CHESS.consequences.blackPlayer);
game.connectConsequences(Spoooky.Blueprints.CHESS.consequences.whitePlayer);

// Spielfiguren auf dem Spielbrett ablegen
game.addEntitiesToGameBoard([
    black_rook, black_queen, black_king, black_knight, black_bishop,
    black_pawn, black_pawn, black_pawn, black_pawn, black_pawn,
    0, 0, 0, 0, 0,
    0, 0, 0, 0, 0,
    white_pawn, white_pawn, white_pawn, white_pawn, white_pawn,
    white_rook, white_queen, white_king, white_knight, white_bishop
]);

// ***** Spielregeln des Schachspieles *****
// *** Unentschieden: König gegen König ***
game.addGameRuleAtom({
    atomName : "Spieler 1 hat nur noch eine Spielfigur",
    atomFunction : "Player Has Number Of Entities",
    atomArguments : [ player1.getID(), 1 ]
});

game.addGameRuleAtom({
    atomName : "Spielerin 2 hat nur noch eine Spielfigur",
    atomFunction : "Player Has Number Of Entities",
    atomArguments : [ player2.getID(), 1 ]
});

game.assembleGameRule({
    name     : "Unentschieden: König gegen König",
    atoms    : ["Spieler 1 hat nur noch eine Spielfigur",
        "Spielerin 2 hat nur noch eine Spielfigur"]
});

game.connectGameRuleConsequences({
    ruleName     : "Unentschieden: König gegen König",
    consequences : [{
        jobName: "Spiel anhalten",
        jobFunction: "Stop Game"
    }, {
        jobName: "Unentschieden-Nachricht ausgeben",
        jobFunction: "Print Game Process",
        jobArguments: "Unentschieden."
    }]});

// *** Der König von Spieler 1 steht im Schach ***
game.addGameRuleAtom({
    atomName : "König von Spieler 1 steht im Schach",
    atomFunction : "Entity Is Under Attack",
    atomArguments : white_king
});

game.assembleGameRule({
    name     : "Schach (Spieler 1)",
    atoms    : ["König von Spieler 1 steht im Schach"]
});

game.connectGameRuleConsequences({
    ruleName     : "Schach (Spieler 1)",
    consequences : [{
        jobName: "Ausgabe, dass der König von Spieler 1 im Schach steht",
        jobFunction: "Print Game Process",
        jobArguments: "Der König von Spieler 1 steht im Schach."
    },{
        jobName: "Spielerwechsel",
        jobFunction: "Next Player"
    },{
        jobName: "Spielzustand auf CHECK setzen",
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
        jobArguments: "König von Spieler 2 steht im Schach"
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
    atomName : "Keine Spielfigur von Spieler 1 kann dem eigenen König helfen.",
    atomFunction : "Got No Protecting Entities",
    atomArguments : white_king
});

game.addGameRuleAtom({
    atomName : "Das Spiel ist im Zustand CHECK",
    atomFunction : "Game State Is",
    atomArguments : "CHECK"
});
game.assembleGameRule({
    name     : "Schachmatt (Spieler 1)",
    atoms    : ["König von Spieler 1 steht im Schach",
        "Keine Spielfigur von Spieler 1 kann dem eigenen König helfen.",
        "Das Spiel ist im Zustand CHECK"]
});
game.connectGameRuleConsequences({
    ruleName     : "Schachmatt (Spieler 1)",
    consequences : [{
        jobName: "Spiel beenden",
        jobFunction: "Stop Game"
    }, {
        jobName: "Ausgabe im Spielverlaufsdialog, dass Spieler 1 " +
            "das Spiel verloren hat.",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 1 ist schachmatt."
    },{
        jobName: "Ausgabe im Spielverlaufsdialog, dass Spielerin 2 das Spiel gewonnen hat.",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 2 gewinnt das Spiel."
    },{
        jobName: "ID der Spielerin speichern, die das Spiel gewonnen hat.",
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
        "Das Spiel ist im Zustand CHECK"]
});

game.connectGameRuleConsequences({
    ruleName     : "Checkmate (Player 2)",
    consequences : [{
        jobName: "Stop the Game",
        jobFunction: "Stop Game"
    }, {
        jobName: "Output Checkmate Message for player 2",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 2 ist schachmatt."
    },{
        jobName: "Output winning Message for player 1",
        jobFunction: "Print Game Process",
        jobArguments: "Spieler 1 gewinnt das Spiel."
    },{
        jobName: "Set the Winner of the Game",
        jobFunction: "Set Winner",
        jobArguments: player1.getID()
    }]});

// *****************************
// *** Player 1 is stalemate ***
game.addGameRuleAtom({
    atomName : "Keine Spielfigur von Spieler 1 kann sich bewegen.",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Das Spiel ist im Zustand INGAME",
    atomFunction : "Game State Is",
    atomArguments : "INGAME"
});

game.assembleGameRule({
    name     : "Patt (Spieler 1)",
    atoms    : ["Keine Spielfigur von Spieler 1 kann sich bewegen.",
        "Das Spiel ist im Zustand INGAME"]
});

game.connectGameRuleConsequences({
    ruleName     : "Patt (Spieler 1)",
    consequences : [{
        jobName: "Spiel beenden",
        jobFunction: "Stop Game"
    }, {
        jobName: "Ausgabe im Spielverlaufsdialog, dass Spieler 1 ueber keine gueltige Zugmoeglichkeit verfuegt.",
        jobFunction: "Print Game Process",
        jobArguments: "Patt: Spieler 1 verfuegt ueber keine gueltige Zugmoeglichkeit."
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
        "Das Spiel ist im Zustand INGAME"]
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