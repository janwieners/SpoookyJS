// ******************* *** //
// *** Game Definition *** //
// *********************** //

// Create a new SpoookyJS game
var game = new Spoooky.Game;

game.initialize("Backgammon");

game.setDescription("Ziel des Spieles ist es, alle seine Spielsteine in das Home-Board zu bringen und sie dann hinauszuwürfeln." +
    " Wer als erster keine Steine mehr auf dem Brett hat, gewinnt das Spiel.");

// Setup Meta entities
var player1 = game.createPlayer({
    name: "Jan",
    type: "HUMAN"
});

var player2 = game.createPlayer({
    name: "Scully",
    type: "ARTIFICIAL"
});

// Create cell visualization
var b = "gridCellBlack",
    w = "gridCellWhite";

game.setupGridWorld(12, 10, [
    w, b, w, b, w, b, w, b, w, b, w, b,
    w, b, w, b, w, b, w, b, w, b, w, b,
    w, b, w, b, w, b, w, b, w, b, w, b,
    w, b, w, b, w, b, w, b, w, b, w, b,
    w, b, w, b, w, b, w, b, w, b, w, b,
    b, w, b, w, b, w, b, w, b, w, b, w,
    b, w, b, w, b, w, b, w, b, w, b, w,
    b, w, b, w, b, w, b, w, b, w, b, w,
    b, w, b, w, b, w, b, w, b, w, b, w,
    b, w, b, w, b, w, b, w, b, w, b, w
]);

// Set field IDs - used for the entity's movement
game.getGameWorld().setFieldIDs([
    13,14,15,16,17,18,19,20,21,22,23,24,
    13,14,15,16,17,18,19,20,21,22,23,24,
    13,14,15,16,17,18,19,20,21,22,23,24,
    13,14,15,16,17,18,19,20,21,22,23,24,
    13,14,15,16,17,18,19,20,21,22,23,24,
    12,11,10,9,8,7,6,5,4,3,2,1,
    12,11,10,9,8,7,6,5,4,3,2,1,
    12,11,10,9,8,7,6,5,4,3,2,1,
    12,11,10,9,8,7,6,5,4,3,2,1,
    12,11,10,9,8,7,6,5,4,3,2,1
]);

// Use entity blueprints
var p1 = game.addBlueprint(player1, Spoooky.Blueprints.BACKGAMMON.entities.player1StandardEntity),
    p2 = game.addBlueprint(player2, Spoooky.Blueprints.BACKGAMMON.entities.player2StandardEntity);

// Connect actions of the entities with consequences for the game
// Create game consequences for the fulfilled goals of the entities of player 1
game.connectConsequences(Spoooky.Blueprints.BACKGAMMON.consequences.player1);

// Create game consequences for the fulfilled goals of the entities of player 2
game.connectConsequences(Spoooky.Blueprints.BACKGAMMON.consequences.player2);

// Create Game Board: Put Entities on the game board
game.addEntitiesToGameBoard([
    p2,0,0,0,p1,0,p1,0,0,0,0,p2,
    p2,0,0,0,p1,0,p1,0,0,0,0,p2,
    p2,0,0,0,p1,0,p1,0,0,0,0,0,
    p2,0,0,0,0,0,p1,0,0,0,0,0,
    p2,0,0,0,0,0,p1,0,0,0,0,0,

    p1,0,0,0,0,0,p2,0,0,0,0,0,
    p1,0,0,0,0,0,p2,0,0,0,0,0,
    p1,0,0,0,p2,0,p2,0,0,0,0,0,
    p1,0,0,0,p2,0,p2,0,0,0,0,p1,
    p1,0,0,0,p2,0,p2,0,0,0,0,p1
]);

// Add Off Board Areas for both players
game.addArea("player1BearOffArea");
game.addArea("player2BearOffArea");

// Add two dices with range 1..6 to the dice box / to the game
game.addDice(1, 6);
game.addDice(1, 6);

// Set the player who will start the game
game.setPlayer(player1);

// Set the initial game state
game.setGameState("WAITINGFORDICEROLL");

// *** Game Rules ***

// If player"s got captured (own) entities in off board area
// then current player MUST move these entities
game.addGameRuleAtom({
    atomName : "Entities of player 1 are outside of the game board",
    atomFunction : "Player Has Entities In Off Board Area",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Current Player is Player 1",
    atomFunction : "Current Player Is",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Entities of player 2 are outside of the game board",
    atomFunction : "Player Has Entities In Off Board Area",
    atomArguments : player2.getID()
});

game.addGameRuleAtom({
    atomName : "Current Player is Player 2",
    atomFunction : "Current Player Is",
    atomArguments : player2.getID()
});

game.assembleGameRule({
    name     : "Restrict movable entities of player 1 to off board entities",
    atoms    : ["Current Player is Player 1",
        "Entities of player 1 are outside of the game board"]
});

game.assembleGameRule({
    name     : "Restrict movable entities of player 2 to off board entities",
    atoms    : ["Current Player is Player 2",
        "Entities of player 2 are outside of the game board"]
});

game.connectGameRuleConsequences({
    ruleName     : "Restrict movable entities of player 1 to off board entities",
    consequences : [{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: "Only Off Board Entities"
    }]});

game.connectGameRuleConsequences({
    ruleName     : "Restrict movable entities of player 2 to off board entities",
    consequences : [{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: "Only Off Board Entities"
    }]});

// ***** Reset Controller.SelectableEntities if the current player hasn't got any entities
// outside of the game board
game.addGameRuleAtom({
    atomName : "No Entity of player 1 is outside of the game board",
    atomFunction : "Player Has No Entities In Off Board Area",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "No Entity of player 2 is outside of the game board",
    atomFunction : "Player Has No Entities In Off Board Area",
    atomArguments : player2.getID()
});

game.assembleGameRule({
    name     : "Reset Selectable Entities For Player 1",
    atoms    : ["Current Player is Player 1",
        "No Entity of player 1 is outside of the game board"]
});

game.assembleGameRule({
    name     : "Reset Selectable Entities For Player 2",
    atoms    : ["Current Player is Player 2",
        "No Entity of player 2 is outside of the game board"]
});

game.connectGameRuleConsequences({
    ruleName     : "Reset Selectable Entities For Player 1",
    consequences : [{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: null
    }]});

game.connectGameRuleConsequences({
    ruleName     : "Reset Selectable Entities For Player 2",
    consequences : [{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: null
    }]});

// ***** Empty DiceBox: Next Round / change players
game.addGameRuleAtom({
    atomName : "Every Dice Value Has Been Played",
    atomFunction : "Dice Box Is Empty"
});

game.assembleGameRule({
    name     : "Next round if every dice value has been played",
    atoms    : ["Game State is INGAME",
        "Every Dice Value Has Been Played"]
});

// Create global game consequences for the fulfilled goals
game.connectGameRuleConsequences({
    ruleName     : "Next round if every dice value has been played",
    consequences : [{
        jobName: "Change current player",
        jobFunction: "Next Player"
    },{
        jobName: "Set Game State",
        jobFunction: "Set Game State",
        jobArguments: "WAITINGFORDICEROLL"
    },{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: null
    }]});

// Next round if no entity of player 1 can move
game.addGameRuleAtom({
    atomName : "Player 1 has got entities",
    atomFunction : "Player Has Entities",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Player 2 has got entities",
    atomFunction : "Player Has Entities",
    atomArguments : player2.getID()
});

// Next round if no entity of player 1 can move
game.addGameRuleAtom({
    atomName : "No entity of player 1 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player1.getID()
});

// Next round if no entity of player 2 can move
game.addGameRuleAtom({
    atomName : "No entity of player 2 can move",
    atomFunction : "Player Has No Movable Entities",
    atomArguments : player2.getID()
});

game.addGameRuleAtom({
    atomName : "Game State is INGAME",
    atomFunction : "Game State Is",
    atomArguments : "INGAME"
});

// Game Event: Player 1 has no movable entities
game.assembleGameRule({
    name     : "Next round if player 1 cannot move",
    atoms    : ["Game State is INGAME",
        "Current Player is Player 1",
        "Player 1 has got entities",
        "No entity of player 1 can move"]
});

// Game Event: Player 1 has no movable entities
game.assembleGameRule({
    name     : "Next round if player 2 cannot move",
    atoms    : ["Game State is INGAME",
        "Current Player is Player 2",
        "Player 2 has got entities",
        "No entity of player 2 can move"]
});

game.connectGameRuleConsequences({
    ruleName     : "Next round if player 1 cannot move",
    consequences : [{
        jobName: "Change current player",
        jobFunction: "Next Player"
    },{
        jobName: "Set Game State",
        jobFunction: "Set Game State",
        jobArguments: "WAITINGFORDICEROLL"
    },{
        jobName: "Output Message",
        jobFunction: "Print Game Process",
        jobArguments: "Player 1 cannot move -- next round"
    },{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: null
    },{
        jobName: "Delete All Dice Values",
        jobFunction: "Delete All Dice Values"
    }]});

game.connectGameRuleConsequences({
    ruleName     : "Next round if player 2 cannot move",
    consequences : [{
        jobName: "Change current player",
        jobFunction: "Next Player"
    },{
        jobName: "Set Game State",
        jobFunction: "Set Game State",
        jobArguments: "WAITINGFORDICEROLL"
    },{
        jobName: "Output Message",
        jobFunction: "Print Game Process",
        jobArguments: "Player 2 cannot move -- next round"
    },{
        jobName: "Restrict selectable entities to off board entities",
        jobFunction: "Restrict Selectable Entities",
        jobArguments: null
    },{
        jobName: "Delete All Dice Values",
        jobFunction: "Delete All Dice Values"
    }]});

// Winning conditions
// Player 1 wins if player 1 has no entities
game.addGameRuleAtom({
    atomName : "Player 1 has no entities",
    atomFunction : "Player Has No Entities",
    atomArguments : player1.getID()
});

game.addGameRuleAtom({
    atomName : "Player 2 has no entities",
    atomFunction : "Player Has No Entities",
    atomArguments : player2.getID()
});

// Assemble goal atoms to game goals
game.assembleGameRule({
    name     : "Player 1 wins the game",
    atoms    : ["Player 1 has no entities"]
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

game.assembleGameRule({
    name     : "Player 2 wins the game",
    atoms    : ["Player 2 has no entities"]
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

var SpoookyGame = new Spoooky.AngularWrapper({ game : game });

// Provide global access to the game object
SpoookyGame.service("globals", function() {

    // Create a new SpoookyJS game
    var gameConnector = { current : game };

    return {
        getGame : function() {
            return gameConnector.current;
        }
    };
});

SpoookyGame.filter("unsafe", function($sce) {
    return function(val) {
        return $sce.trustAsHtml(val);
    }
});

SpoookyGame.controller("GridWeltCtrl", function($scope, globals) {

    var game = globals.getGame();
    $scope.game = game;

    // Provide game grid specifics to the interface
    $scope.gameGrid = game.models.GameGrid;
    $scope.gridRows = game.getGameWorld().getRows();
    $scope.gridColumns = game.getGameWorld().getColumns();

    // Width and height of a grid cell
    $scope.cellWidth = 47;
    $scope.cellHeight = 47;

    /**
     * Set the styling of a game world cell
     */
    $scope.styleCell = function() {

        // style="min-width: {{cellWidth}}px; min-height: {{cellHeight}}px; necessary?
        return {
            "width" : $scope.cellWidth,
            "height" : $scope.cellHeight
        };
    };

    $scope.initializeView = function() {

        // Connect the game with angularJS scope
        $scope.game.connectGridWeltView($scope);

        // Field IDs for Documenting Purposes
        $scope.fieldIDsTop = [];
        $scope.fieldIDsBottom = [];

        var id;
        for (id = 13; id <= 24; id += 1) {
            $scope.fieldIDsTop.push(id);
        }

        for (id = 12; id >= 1; id -= 1) {
            $scope.fieldIDsBottom.push(id);
        }

        $scope.player1BearOffArea = game.getArea("player1BearOffArea");
        $scope.player2BearOffArea = game.getArea("player2BearOffArea");
    };

    /**
     * Checks for an entity at a specific cell
     * @param cell
     * @returns {boolean}
     */
    $scope.entityAtCell = function(cell) {
        return (cell.contains.length > 0);
    };

    /**
     * Get the name of an entity at a specific cell
     * @param cell
     * @returns {string|String|*}
     */
    $scope.getEntityName = function(cell) {
        var entity = _.last(cell.contains);
        entity = $scope.game.getPlayerWithID(entity.playerID).getEntityWithID(entity.entityID);
        return entity.getName();
    };

    /**
     * Get the visual representation of an entity at a specific cell
     * @param cell
     * @returns {*|AbstractView|*}
     */
    $scope.getEntityImage = function(cell) {
        var entity = _.last(cell.contains);
        entity = $scope.game.getPlayerWithID(entity.playerID).getEntityWithID(entity.entityID);
        return entity.getView();
    };

    /**
     * Controles the click event
     * @param xPos
     * @param yPos
     */
    $scope.cellClicked = function(xPos, yPos) {
        if ($scope.game.getCurrentPlayerType() === "HUMAN") {
            $scope.game.loop(false, xPos, yPos);
        }
    };

    /**
     * Events to fire when the game starts
     */
    $scope.startGame = function() {

        // Perform a pseudo loop to show free fields initially
        $scope.game.pseudoLoop();
    };

    // Implement backgammon-specific board areas
    $scope.p1BearOffAreaClicked = function() {
        if ($scope.game.getCurrentPlayerType() === "HUMAN") {
            game.loop("player1BearOffArea");
        }
    };

    $scope.p2BearOffAreaClicked = function() {

        if ($scope.game.getCurrentPlayerType() === "HUMAN") {
            game.loop("player2BearOffArea");
        }
    };

    // Initialize view stuff
    $scope.initializeView();

    // and start the game
    $scope.startGame();
});

SpoookyGame.controller("DiceBoxCtrl", function($scope, globals) {

    $scope.getCurrentPlayerName = function() {
        return globals.getGame().getCurrentPlayerName();
    };

    $scope.getDiceValues = function() {
        return globals.getGame().getDiceBox().getDiceValues();
    };

    $scope.gotDiceValues = function() {
        return _.isEmpty(globals.getGame().getDiceBox().getDiceValues());
    };

    $scope.rollDices = function() {
        if (globals.getGame().getGameState() === "WAITINGFORDICEROLL") {
            Spoooky.GameEvents.fireEvent({job: "Roll Backgammon Dices"}, globals.getGame());
        }
    };
});

SpoookyGame.controller("OffBoardCtrl", function($scope, globals) {

    $scope.firstPlayerName = globals.getGame().getPlayers()[0].getName();
    $scope.secondPlayerName = globals.getGame().getPlayers()[1].getName();

    $scope.getOffBoardEntities = function(playerID) {
        return globals.getGame().offBoard.getEntitiesWithPlayerID(playerID);
    };

    $scope.reEnter = function(clickedEntity) {

        if (globals.getGame().getCurrentPlayerID() === clickedEntity.getMetaPlayerID()) {

            Spoooky.GameEvents.fireEvent( {
                job : "Show Backgammon Re-entering Moves",
                jobArguments : { playerID : globals.getGame().getCurrentPlayerID() }
            }, globals.getGame());
        }
    };
});