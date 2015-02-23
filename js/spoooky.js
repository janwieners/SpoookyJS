/**
 * Spoooky.js - A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods
 *
 * @author Jan Gerrit Wieners <jan@jan-wieners.de>
 * Version 0.3.15 "The Erlenmeyer Flask" (November 2014)
 *
 * Dependencies:
 *  - jQuery 2.1.3
 *  - Bootstrap 3.3.1
 *  - AngularJS 1.3.9
 *  - Angular UI Bootstrap 0.12.1
 *  - Underscore.js 1.8.2
 *  - D3.js 3.5.5
 *  - C3.js 0.4.9
 **/

Spoooky = {};

(function(){

    "use strict";

    /**
     * Game Models
     * Class holds all relevant game data, represents the current game state of a game
     * Other Spoooky.JS classes are implemented as controllers for the game model
     * @constructor
     */
    Spoooky.Models = function() {

        var self_Models = this;

        /**
         * Holds the currently highlighted moves / move options
         * @type {Array}
         */
        self_Models.HighlightTable = [];

        /**
         * Job queue jobs
         * Controller: Spoooky.JobQueue
         * @type {Array}
         */
        self_Models.JobQueue = [];

        /**
         * Movable entities
         * Controller: Spoooky.MovableEntities
         * @type {Array}
         */
        self_Models.MovableEntities = [];

        /**
         * Holds all legal moves
         * Controller: Spoooky.MoveTable
         * @type {Array}
         */
        self_Models.MoveTable = [];

        /**
         * Holds all goal moves
         * @type {Array}
         */
        self_Models.GoalMoves = [];

        /**
         * Meta entities - the players of the game
         * @type {Array}
         */
        self_Models.MetaAgents = [];

        /**
         * Entities associated with players
         * [playerID][entity of player with playerID]
         * @type {Array}
         */
        self_Models.Entities = [];

        /**
         * Game rule atoms
         * Sub rules can be assembled to game rules
         * @type {Array}
         */
        self_Models.GameRuleAtoms = [];

        /**
         * Global game rules
         * @type {Array}
         */
        self_Models.GameRules = [];

        /**
         * Activated consequences if a game rule is fulfilled
         * @type {Array}
         */
        self_Models.GameRuleConsequences = [];

        /**
         * Consequences of fulfilled entity goals
         * @type {Array}
         */
        self_Models.EntityGoalConsequences = [];

        /**
         * Game Grid
         * @type {Array}
         *
         * A game grid cell consists of:
         * { cellID : {number},
         *      contains : {
         *          entityID : entity ID,
         *          playerID : ID of the associated player,
         *          typeID : type ID of the entity
         *      }
         *      position : { x : {number}, y : {number} },
         *      view : { baseClass : {string}, cellClass : {string}
         * }
         */
        self_Models.GameGrid = [];

        /**
         * Restricts to movable and selectable entities
         * @type {{entities: string, moves: string}}
         */
        self_Models.SelectRestrictions = {
            entities : "",
            moves : ""
        };

        /**
         * Off board area
         * Structure for saving temporary objects
         * Used in games like backgammon
         * @type {Array}
         * Content: {eID : entity ID,
         *      eName : Name of the entity,
         *      playerID : ID of the associated player}
         */
        self_Models.OffBoardContent = [];

        /**
         * Holds dices, current dice values and
         * move identifier attached to dice values
         * @type {Array}
         */
        self_Models.DiceBox = {

            // Dice Box has to be activated for board games
            // with chance
            isEnabled : false,

            // Dices of the game
            dices : [],

            // The current dice values
            diceValues : [],

            // Connects dice values with move IDs
            // Important for capture moves (i.e. backgammon)
            // { diceValueID : setDiceValueID,
            //   moveID : setMoveID,
            //   target : setTarget }
            attachedMoveIDs : []
        };

        /**
         * Models for game areas
         * for example off board areas in backgammon
         * @type {{isEnabled: boolean, content: Array}}
         */
        self_Models.Areas = {

            // Areas structure has to be enabled for
            // games with areas (like backgammon)
            isEnabled : false,

            // Areas connected with the game
            // Holds single areas in form:
            // { name : {string}, display : {string},
            //      elementCounter : {number}, moveID : {number} }
            content : []
        };

        /**
         * Blueprints used in the game
         * @type {{}}
         */
        self_Models.Blueprints = {};

        // =========
        // Variables
        // =========

        /**
         * The name of the game
         * @type {string}
         */
        self_Models.gameName = "";

        /**
         * Holds the recently moved entity
         * {entityID : entity ID, playerID : ID of the associated player}
         * @type {Object}
         */
        self_Models.recentlyMovedEntity = false;

        /**
         * State of the game
         * Initialize with start game state "INGAME"
         * @type {String}
         */
        self_Models.gameState = "INGAME";

        /**
         * Total number of moves made in the game
         * @type {number}
         */
        self_Models.moveCounter = 0;

        /**
         * ID of the current player
         * @type {number}
         */
        self_Models.currentPlayerID = -1;

        /**
         * Description of the game
         * @type {string}
         */
        self_Models.description = "";

        /**
         * Unique identifier of a move
         * @type {number}
         */
        self_Models.moveID = 0;

        /**
         * ID of the last executed move
         * @type {number}
         */
        self_Models.lastMoveID = 0;

        /**
         * Size of the game world
         * @type {{fieldsX: number, fieldsY: number}}
         */
        self_Models.worldDimensions = {
            rows : 0,
            columns : 0
        };

        /**
         * ID of the meta agent who won the game
         * @type {boolean|number}
         */
        self_Models.winnerID = false;

        /**
         * If flag is true, the game is played virtually
         * @type {boolean}
         */
        self_Models.playVirtual = false;

        /**
         * Helper flag to enable
         * @type {boolean}
         */
        self_Models.playerChange = true;

        /**
         * Type of the game
         * Allowed string values: { MOVING, PLACING }
         * Games like checkers, chess are games in which entities are moved
         * Games like tic tac toe or nine men's morris are games in which entities are placed
         * @type {string}
         */
        self_Models.gameMode = "MOVING";

        /**
         * Numbers of rounds played
         * @type {number}
         */
        self_Models.gameRounds = 0;
    };

    /**
     * Core of SpoookyJS: the game class
     * @constructor
     */
    Spoooky.Game = function() {

        var self_Game = this;

        /**
         * Creates a new game
         *
         * @param {String} gameName Name of the game
         * @returns {Object} The newly generated game
         */
        self_Game.initialize = function(gameName) {

            // Create the game models
            self_Game.models = new Spoooky.Models;

            // Create Controllers
            // Create the game world and connect it with the game
            self_Game.gameWorld = new Spoooky.GridWelt(self_Game);
            self_Game.setName(gameName);

            // Create the job queue for this game
            self_Game.jobQueue = new Spoooky.JobQueue(self_Game);

            // Creates a dice box and connects it with the game
            self_Game.diceBox = new Spoooky.DiceBox(self_Game);

            // Create areas structure to connect areas with the game
            self_Game.areas = new Spoooky.Areas(self_Game);

            // Create the off board area and connects it with the game
            self_Game.offBoard = new Spoooky.OffBoard(self_Game);

            return self_Game;
        };

        /**
         * Set up the grid world / game board
         * @param gridColumns
         * @param gridRows
         * @param display
         */
        self_Game.setupGridWorld = function(gridColumns, gridRows, display) {

            self_Game.gameWorld.setup2D(gridColumns, gridRows);
            self_Game.gameWorld.setupGameBoard(display);
        };

        /**
         * Extend the angularjs game view with specific functions
         * @param scope
         */
        self_Game.connectGridWeltView = function(scope) {

            // Connect the game with the view to allow a view refresh
            self_Game.viewScope = scope;
        };

        /**
         * Connection to AngularJS
         */
        self_Game.statsScope = null;

        /**
         * Connect the AngularJS scope of the statistics module with the game
         * @param scope
         */
        self_Game.connectStatsView = function(scope) {
            self_Game.statsScope = scope;
        };

        /**
         * Refresh the statistics
         * ...should be done by AngularJS ($watch / $watchCollection)...
         * @param agentID
         */
        self_Game.refreshStatsView = function(agentID) {
            self_Game.statsScope.update(agentID);
        };

        /**
         * Connector to monte carlo tree search graph view
         * @type {null}
         */
        self_Game.graphScope = null;

        /**
         * Connect SpoookyJS with AngularJS graph view
         * @param scope
         */
        self_Game.connectGraphView = function(scope) {
            self_Game.graphScope = scope;
        };

        /**
         * Refresh the monte carlo tree search visualization
         */
        self_Game.refreshGraphView = function(graphData, metaAgentID) {
            self_Game.graphScope.updateGraphs(graphData, metaAgentID);
        };

        /**
         * Evaluates a terminal(!) game state for a player with evalPlayerID
         * @param evalPlayerID
         * @returns {number}
         */
        self_Game.evaluateGameState = function(evalPlayerID) {

            var score = 0.0;

            // Check final game states
            if (self_Game.models.gameState === "END") {

                // scores:
                // - 1.0 : evalPlayerID wins
                // - 0.5 : draw
                // - 0.0 : evalPlayerID loses the game
                if (self_Game.models.winnerID === evalPlayerID) {
                    score = 1.0;
                } else if (self_Game.models.winnerID === false) {
                    score = 0.5;
                } else {
                    score = 0.0;
                }
            }

            return score;
        };

        /**
         * Get the json representation of the game models
         * @returns {*}
         */
        self_Game.stringifyModels = function() {

            return JSON.stringify(self_Game.models);
        };

        /**
         * Creates a deep copy of the current game
         * @param gameModel
         * @returns {Spoooky.Game}
         */
        self_Game.clone = function(gameModel) {

            var gameCopy = new Spoooky.Game;

            // Let the game create necessary controllers
            gameCopy.initialize("COPY");

            if (gameModel) {
                gameCopy.models = JSON.parse(gameModel);
            } else {
                // Copy the game model if no game model was passed
                gameCopy.models = JSON.parse(self_Game.stringifyModels());
            }

            // Create controllers for meta agents of the game
            var counter, meta,
                models = gameCopy.models,
                len = gameCopy.models.MetaAgents.length,
                newEntity, curEntity, entity;

            for (counter = len; counter--;) {

                // Manually create meta agents
                meta = new Spoooky.MetaAgent(gameCopy);

                // Copy meta entities properties
                _.extend(meta, models.MetaAgents[counter]);
                models.MetaAgents[counter] = meta;
            }

            // Create controllers for single entities
            // Copy each entity of each meta agent
            len = models.Entities.length;
            for (counter = len; counter--;) {

                // Process entities of current meta agent
                meta = models.Entities[counter];

                for (entity = meta.length; entity--;) {

                    curEntity = meta[entity];

                    // Manually copy the properties of meta agent
                    newEntity = new Spoooky.Entity(curEntity.name, curEntity.ID,
                        curEntity.typeID, gameCopy);

                    // Copy properties of the entities
                    _.extend(newEntity, curEntity);

                    models.Entities[counter][entity] = newEntity;
                }
            }

            // Play the game virtually
            gameCopy.models.playVirtual = true;

            // Set the name of the game
            gameCopy.setName("GAME_COPY");

            return gameCopy;
        };

        /**
         * Connection to the game model
         * @type {{}}
         */
        self_Game.models = {};

        /**
         * Helper function: Reset an array"s content
         * @param arrayToFlush
         */
        self_Game.flush = function(arrayToFlush) {
            arrayToFlush.length = 0;
        };

        /**
         * Set the id of the game winning meta agent
         * @param winID
         */
        self_Game.setWinnerID = function(winID) {
            self_Game.models.winnerID = winID;
        };

        /**
         * Get the identifier of the meta agent who won the game
         * @returns {boolean|number|*}
         */
        self_Game.getWinnerID = function() {
            return self_Game.models.winnerID;
        };

        /**
         * Job queue for this game
         * @type {null}
         */
        self_Game.jobQueue = null;

        /**
         * Controller
         * Movable entities at a specific state of the game
         * @type {null}
         */
        self_Game.MovableEntities = null;

        /**
         * Areas connected with the game
         */
        self_Game.areas = null;

        /**
         * Add a new area to the game
         * @param areaName
         */
        self_Game.addArea = function(areaName) {

            if (self_Game.areas === null) {
                self_Game.areas = new Spoooky.Areas;
            }

            self_Game.areas.addArea(areaName);
        };

        /**
         * Get an area, connected with this game
         * @param areaName
         * @returns {*}
         */
        self_Game.getArea = function(areaName) {
            return self_Game.areas.getArea(areaName);
        };

        /**
         * Add an entity blueprint to the games list of blueprints
         * @param player
         * @param blueprint
         */
        self_Game.addBlueprint = function(player, blueprint) {

            // Add the blueprint to the game model
            self_Game.models.Blueprints[blueprint.entityType] = _.clone(blueprint);

            if (player) {

                // Associate the blueprint / entity with a meta agent / player
                player.associateEntity(self_Game.models.Blueprints[blueprint.entityType]);
            }

            return self_Game.models.Blueprints[blueprint.entityType];
        };

        /**
         * Extends a blueprint with
         * @param blueprint
         * @param extend
         */
        self_Game.extendBlueprint = function(blueprint, extend) {
            _.extend(blueprint, extend);
        };

        /**
         * Get all blueprints associated with the game
         * @type {*}
         */
        self_Game.getBlueprints = function() {
            return self_Game.models.Blueprints;
        };

        /**
         * Return blueprint with name
         * @param blueprintName
         */
        self_Game.getBlueprint = function(blueprintName) {
            return self_Game.getBlueprints()[blueprintName];
        };

        /**
         * Set the recently moved game entity
         * @param xPos
         * @param yPos
         */
        self_Game.setRecentlyMovedEntity = function(xPos, yPos) {

            var rcnt = self_Game.gameWorld.peekCell(xPos, yPos);

            // Check if last move was capture / goal move
            var moveType = "default";

            if (self_Game.isGoalMove(xPos, yPos)) {
                moveType = "capture";
            }

            if (rcnt) {
                self_Game.models.recentlyMovedEntity = { entityID : rcnt.ID,
                    playerID : rcnt.getMetaPlayerID()
                };
                rcnt.addExecutedMove(xPos, yPos, self_Game.models.moveCounter, moveType);
            } else {
                self_Game.models.recentlyMovedEntity = false;
            }
        };

        /**
         * Get the recently moved game entity
         * @returns {*}
         */
        self_Game.getrecentlyMovedEntity = function() {

            if (self_Game.models.recentlyMovedEntity) {

                var rcnt = self_Game.models.recentlyMovedEntity;
                return self_Game.getPlayerWithID(rcnt.playerID).getEntityWithID(rcnt.entityID);
            }
            return false;
        };

        /**
         * Add a dice to the game
         * @param startValue
         * @param endValue
         */
        self_Game.addDice = function(startValue, endValue) {

            // Enable dice box
            self_Game.getDiceBox().enable();
            // Create the dice
            self_Game.getDiceBox().createDice(startValue, endValue);
        };

        /**
         * Associated dice box
         * @type {null}
         */
        self_Game.diceBox = null;

        /**
         * Get the connected dice box
         * @returns {null}
         */
        self_Game.getDiceBox = function() {
            return self_Game.diceBox;
        };

        /**
         * Off board area of the game
         * @type {null}
         */
        self_Game.offBoard = null;

        /**
         * Set the name of the game
         * @param {String} gameName The name of the game to be set
         */
        self_Game.setName = function(gameName) {
            if (gameName) {
                self_Game.models.gameName = gameName;
            } else {
                self_Game.models.gameName = "";
            }
        };

        /**
         * Get the Name of the game
         * @returns {String} Returns the game name
         */
        self_Game.getName = function () {
            return self_Game.models.gameName;
        };

        /**
         * Set the game description
         * @param {String} gameDescription Game Description
         */
        self_Game.setDescription = function(gameDescription) {
            self_Game.models.description = gameDescription;
        };

        /**
         * Get the game description
         * @returns {string}
         */
        self_Game.getDescription = function() {
            return self_Game.models.description;
        }

        /**
         * Set the move ID
         * @param newMoveID
         */
        self_Game.setMoveID = function(newMoveID) {
            self_Game.models.moveID = newMoveID;
        };

        /**
         * Set the last move ID
         */
        self_Game.setLastMoveID = function() {
            self_Game.models.lastMoveID = self_Game.models.moveID;
        };

        /**
         * Get the last assigned move ID
         * @returns {Number}
         */
        self_Game.getLastMoveID = function() {
            return self_Game.models.lastMoveID;
        };

        /**
         * Connection with game world (model)
         * @private
         */
        self_Game.gameWorld = null;

        /**
         * Returns the game world of the game
         * @returns {Object}
         */
        self_Game.getGameWorld = function() {
            return self_Game.gameWorld;
        };

        /**
         * Default Game Loop
         * Could be overridden for games with more complex interaction
         * @param areaName
         * @param xPos
         * @param yPos
         */
        self_Game.loop = function(areaName, xPos, yPos){

            var isMove = false;

            // Proceed the game until it has reached it terminal game state
            if (self_Game.models.gameState !== "END") {

                switch (self_Game.models.gameMode) {

                    // Games like chess or checkers in which entities are moved
                    case "MOVING":

                        // Check click event
                        // An area has been clicked
                        if (areaName) {
                            isMove = self_Game.areas.isMove(areaName);
                        } else {
                            // A cell has been clicked
                            isMove = self_Game.isMove(xPos, yPos);
                        }

                        if (isMove) {

                            // Area has been clicked
                            if (areaName) {
                                self_Game.executeJobsForMoveID(self_Game.areas.getMoveID(areaName));
                            } else {
                                self_Game.executeJobsForThisMove(xPos, yPos);
                            }

                            // Execute global game rules
                            if (self_Game.executeGameRules()) {

                                // If global game rules are fulfilled
                                // then execute associated jobs
                                self_Game.executeJobsForRecentMove();
                            } else {
                                // Proceed the game: change players, etc.
                                self_Game.proceed();
                            }
                        } else {
                            // Show moves of the entity
                            self_Game.showEntityMoves(xPos, yPos);
                        }

                        break;

                    // Games like tic tac toe or nine men's morris, in which
                    // entities are placed on empty fields of the game board
                    case "PLACING":

                        // Initially show free fields
                        self_Game.showFieldsToPlaceEntity();

                        // Check click event
                        isMove = self_Game.isMove(xPos, yPos);

                        if (isMove) {

                            // Execute jobs associated with this move
                            // i.e. "place entity"
                            self_Game.executeJobsForThisMove(xPos, yPos);

                            // Execute global game rules
                            if (self_Game.executeGameRules()) {
                                // If global game rules are fulfilled
                                // then execute associated jobs
                                self_Game.executeJobsForRecentMove();
                            } else {
                                // Proceed the game: change players, etc.
                                self_Game.proceed();
                                // Show free fields after player change
                                self_Game.showFieldsToPlaceEntity();
                            }
                        }
                        break;
                }
            }

            // Artificial Player
            self_Game.playArtificial();
        };

        /**
         * Helper function for artificial play in game loop
         */
        self_Game.playArtificial = function() {

            if (self_Game.models.playVirtual === false) {

                // Play the game until it has reached it end
                if (self_Game.getCurrentPlayerType() === "ARTIFICIAL" &&
                    self_Game.models.gameState !== "END") {

                    // Execute an artificial turn
                    self_Game.artificialTurn();
                }
            }
        };

        /**
         * Perform a pseudo game loop to activate things
         * or to keep things running
         */
        self_Game.pseudoLoop = function() {
            self_Game.loop(false, null, null);
        };

        /**
         * Proceed the game
         */
        self_Game.proceed = function() {

            if (self_Game.models.playerChange === true) {

                // Change players
                self_Game.setNextPlayer();
                // Reset previously set game states
                self_Game.setGameState("INGAME");
            }

            // Reset displayed moves
            self_Game.resetMoves();
        };

        /**
         * Set the mode of the game ("MOVING", "PLACING")
         * @param gameMode
         */
        self_Game.setGameMode = function(gameMode) {
            self_Game.models.gameMode = gameMode;
        };

        /**
         * Check for goal move
         * @param xPos
         * @param yPos
         */
        self_Game.checkGoalMove = function(xPos, yPos) {

            if (self_Game.isGoalMove(xPos, yPos)) {
                //self_Game.resetMoves();
            }
        };

        /**
         * Sets the game state
         *
         * @param {String} stateName Name of the game state
         */
        self_Game.setGameState = function(stateName) {
            self_Game.models.gameState = stateName;
        };

        /**
         * Returns the current game state
         *
         * @returns {String}
         */
        self_Game.getGameState = function() {
            return self_Game.models.gameState;
        };

        /**
         * Adds a new player to the game
         * @param {Object} player Player which will be added to the game
         */
        self_Game.addPlayer = function(player) {

            // Create associated entities array
            self_Game.models.Entities[player.ID] = [];
            self_Game.models.MetaAgents.push(player);

            // Set the starting player
            if (self_Game.models.MetaAgents.length === 1) {
                self_Game.setPlayer(player);
            }
        };

        /**
         * Creates a new player / meta agent and adds him/her/it to the game
         * @param {Object} createArguments Holds the name and type of the player
         * @returns {Object} Returns newly created player
         */
        self_Game.createPlayer = function(createArguments) {

            var newPlayer = new Spoooky.MetaAgent(self_Game);
            newPlayer.setID(self_Game.models.MetaAgents.length);

            if (createArguments) {
                newPlayer.setName(createArguments.name);
                newPlayer.setType(createArguments.type);
            }

            // Create sub agents for artificial players
            if (newPlayer.type === "ARTIFICIAL") {
                newPlayer.assembleAgents();
            }

            self_Game.addPlayer(newPlayer);

            return newPlayer;
        };

        /**
         * Set the id of the current player
         * @param currentPlayerID
         */
        self_Game.setCurrentPlayerID = function(currentPlayerID) {
            self_Game.models.currentPlayerID = currentPlayerID;
        };

        /**
         * Set the current player
         * @param currentPlayer
         */
        self_Game.setPlayer = function(currentPlayer) {
            self_Game.setCurrentPlayerID(currentPlayer.ID);
        };

        /**
         * Get the unique identifier of the current player
         * @returns {number|*}
         */
        self_Game.getCurrentPlayerID = function() {
            return self_Game.models.currentPlayerID;
        };

        /**
         * Get the id of the next player
         * @returns {*}
         */
        self_Game.getNextPlayerID = function() {

            var playerID = self_Game.getCurrentPlayerID();
            if (playerID < self_Game.models.MetaAgents.length-1) {
                return playerID + 1;
            }
            return 0;
        };

        /**
         * Get the current player name
         * @returns {string|String|*}
         */
        self_Game.getCurrentPlayerName = function() {
            return self_Game.getCurrentPlayer().getName();
        };

        /**
         * Get the type of the current player
         * @returns {string|*}
         */
        self_Game.getCurrentPlayerType = function() {
            return self_Game.getPlayerWithID(self_Game.getCurrentPlayerID()).type;
        };

        /**
         * Player change: Set the next player as active player of the game
         */
        self_Game.setNextPlayer = function() {

            var playerID = self_Game.getCurrentPlayerID();
            if (playerID < self_Game.models.MetaAgents.length-1) {
                self_Game.setCurrentPlayerID(playerID + 1);
            } else {
                self_Game.setCurrentPlayerID(0);
            }
            self_Game.resetMoves();
            self_Game.models.gameRounds++;
        };

        /**
         * Get meta agent by id
         * Expects that the identifier of the meta agent is its array index
         * @param playerID
         * @returns {*}
         */
        self_Game.getPlayerWithID = function(playerID) {
            return self_Game.models.MetaAgents[playerID];
        };

        /**
         * Find and get a player who owns an entity with a specific name
         * @param entityName
         * @returns {*}
         */
        self_Game.getPlayerWhoOwnsEntity = function(entityName) {

            var gamePlayers = self_Game.getPlayers(),
                count = gamePlayers.length;

            for (var counter = 0; counter < count; counter += 1) {

                if (gamePlayers[counter].hasEntity(entityName) === true) {
                    return gamePlayers[counter];
                }
            }
            return false;
        };

        /**
         * Tells every artificial player / meta agent that the game has ended
         */
        self_Game.informArtificialPlayersAboutGameEnd = function() {

            var players = self_Game.getPlayers(),
                len = players.length;

            for (var i = len; i--;) {
                if (players[i].type === "ARTIFICIAL") {
                    players[i].gameHasEnded();
                }
            }
        };

        /**
         * Get all players of the game
         * @returns {Array}
         */
        self_Game.getPlayers = function() {
            return self_Game.models.MetaAgents;
        };

        /**
         * Get all artificial players (meta agents) of the game
         * @returns {Array}
         */
        self_Game.getAIPlayers = function() {

            var players = self_Game.models.MetaAgents,
                metaAgents = [], i;

            // Retrieve all artificial players
            for (i = 0; i < players.length; i++) {

                if (players[i].type === "ARTIFICIAL") {
                    metaAgents.push(players[i]);
                }
            }
            return metaAgents;
        };

        /**
         * Get the current player of the game
         * @returns {*}
         */
        self_Game.getCurrentPlayer = function() {
            return self_Game.getPlayerWithID(self_Game.getCurrentPlayerID());
        };

        /**
         * Add a game rule
         * @param newRule
         */
        self_Game.assembleGameRule = function(newRule) {
            self_Game.models.GameRules.push(newRule);
        };

        /**
         * Get a game rule with an unique identifier
         * @param gameRuleID
         * @returns {*}
         */
        self_Game.getGameRule = function(gameRuleID) {

            if (gameRuleID >= 0 && gameRuleID < self_Game.models.GameRules.length) {
                return self_Game.models.GameRules[gameRuleID];
            }
            return false;
        };

        /**
         * Count the number of game rules in the game
         * @returns {Number}
         */
        self_Game.countGameRules = function() {
            return self_Game.models.GameRules.length;
        };

        /**
         * Execute a game rule with a specific name
         * @param gameRuleName
         * @returns {boolean}
         */
        self_Game.executeGameRuleByName = function(gameRuleName) {

            var count = self_Game.models.GameRules.length,
                returnValue = false,
                ruleAtoms = 0,
                ruleAtomCount = 0;

            for (var goalCounter = 0; goalCounter < count; goalCounter += 1) {

                if (self_Game.models.GameRules[goalCounter].name === gameRuleName) {

                    returnValue = true;
                    ruleAtoms = self_Game.models.GameRules[goalCounter].atoms;
                    ruleAtomCount = ruleAtoms.length;

                    for (var atomCounter = 0; atomCounter < ruleAtomCount; atomCounter += 1) {

                        returnValue = self_Game.executeGameRuleAtomByName(ruleAtoms[atomCounter]);

                        if (returnValue === false || returnValue === -1) {
                            return false;
                        }
                    }
                    return returnValue;
                }
            }
            return false;
        };

        /**
         * Add a game rule atom
         * @param newRuleAtom
         */
        self_Game.addGameRuleAtom = function(newRuleAtom) {

            var ruleAtomName = newRuleAtom.atomName,
                ruleAtomFunctionName = newRuleAtom.atomFunction,
                ruleAtomArguments = newRuleAtom.atomArguments,
                condition = newRuleAtom.atomCondition,
                connector = newRuleAtom.atomConnector;

            self_Game.models.GameRuleAtoms.push({
                atomName: ruleAtomName,
                atomFunction: ruleAtomFunctionName,
                atomArguments: ruleAtomArguments,
                atomCondition: condition,
                atomConnector: connector
            });
        };

        /**
         * List of atom functions which can be executed
         */
        self_Game.entityAtomFunctions = {

            "Is Opponent" : function(entity, atom) {
                var moveDirection = entity.translateDirection(atom.atomArguments),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10);

                return entity.isOpponent(destX, destY);
            },

            "Is Empty Cell" : function(entity, atom) {
                var moveDirection = entity.translateDirection(atom.atomArguments),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10);

                return entity.isEmptyCell(destX, destY);
            },

            "Current Y Position Is" : function(entity, atom) {
                return (entity.position.y === atom.atomArguments);
            },

            "Current X Position Is" : function(entity, atom) {
                return (entity.position.x === atom.atomArguments);
            },

            "Entity Is Able To Reach A Specific Row" : function(entity, atom) {

                var destinationRow = atom.atomArguments[0];

                if (destinationRow === "last") {
                    destinationRow = parseInt(self_Game.gameWorld.getRows()-1, 10);
                } else if (destinationRow === "first") {
                    destinationRow = 0;
                }

                var moveDirection = entity.translateDirection(atom.atomArguments[1]),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10);

                // Check for empty destination field - allow only moves to empty fields
                if (self_Game.gameWorld.isEmpty(destX, destY) === false) {
                    return false;
                }

                return (destinationRow === destY);
            },

            "Entity At Cell Is Of Type" : function(entity, atom) {
                var moveDirection = entity.translateDirection(atom.atomArguments),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10),
                    entityAt = entity.getGame().gameWorld.peekCell(destX, destY);

                if (entityAt !== false) {
                    if (entityAt.type === atom.atomArguments[2]) {
                        return true;
                    }
                }
                return false;
            },

            "Entity At Cell Has Been Moved n Times" : function(entity, atom) {
                var moveDirection = entity.translateDirection(atom.atomArguments),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10),
                    entityAt = entity.getGame().gameWorld.peekCell(destX, destY);

                if (entityAt !== false) {
                    if (entityAt.getMoveCount() === atom.atomArguments[2]) {
                        return true;
                    }
                }
                return false;
            },

            "Entity At Cell Has Been Moved In Last Game Round" : function(entity, atom) {
                var moveDirection = entity.translateDirection(atom.atomArguments),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10),
                    entityAt = entity.getGame().gameWorld.peekCell(destX, destY);

                if (entityAt !== false) {
                    if (entityAt.getLastExecutedMove().round === entity.getGame().models.moveCounter) {
                        return true;
                    }
                }
                return false;
            },

            "Is Not Attackable In Next Round" : function(entity, atom) {
                var moveDirection = entity.translateDirection(atom.atomArguments),
                    destX = parseInt(entity.position.x + moveDirection[0], 10),
                    destY = parseInt(entity.position.y + moveDirection[1], 10);
                return !(entity.getGame().opponentEntityCanCaptureAt(destX, destY, entity));
            },

            // Backgammon-specific
            "Number Of Opponents At Destination Field Is" : function(entity, atom, addArgument) {
                var destFieldID = 0,
                    currentX = entity.position.x,
                    currentY = entity.position.y,
                    moveDirection = atom.atomArguments[0],
                    opponentCount = atom.atomArguments[1],
                    curFieldID = entity.getGame().gameWorld.getFieldID(currentX, currentY);

                // If the entity"s got a temporary field id
                // --> The entity is outside the game board
                if (_.isUndefined(entity.tmp.fieldID) === false) {
                    curFieldID = entity.tmp.fieldID;
                }

                if (moveDirection === "MOVE POSITIVE") {
                    destFieldID = parseInt(curFieldID + addArgument, 10);
                } else if (moveDirection === "MOVE NEGATIVE") {
                    destFieldID = parseInt(curFieldID - addArgument, 10);
                }

                // Number of opponents (opponentCount) at destination field
                return (entity.countOpponentsOnFieldsWithID(destFieldID, entity) === opponentCount);
            },

            "No Own Entitys On Fields With ID Less Than" : function(entity, atom) {
                var checkFieldID = atom.atomArguments;
                return (! (entity.getAssociatedPlayer().hasEntitiesOnFieldWithFieldID(checkFieldID, "<")));
            },

            "No Own Entitys On Fields With ID More Than" : function(entity, atom) {
                var checkFieldID = atom.atomArguments;
                return (!entity.getAssociatedPlayer().hasEntitiesOnFieldWithFieldID(checkFieldID, ">"));
            },

            "Destination Field ID Is Greater Than" : function(entity, atom, addArgument) {
                var destFieldID = 0,
                    currentX = entity.position.x,
                    currentY = entity.position.y,
                    moveDirection = atom.atomArguments[0],
                    curFieldID = entity.getGame().gameWorld.getFieldID(currentX, currentY);

                // Ignore off board entitys
                if (_.isUndefined(entity.tmp.fieldID) === false) {
                    return false;
                }

                if (moveDirection === "MOVE POSITIVE") {
                    destFieldID = parseInt(curFieldID + addArgument, 10);
                } else if (moveDirection === "MOVE NEGATIVE") {
                    destFieldID = parseInt(curFieldID - addArgument, 10);
                }
                return destFieldID > atom.atomArguments[1];
            },

            "Destination Field ID Is Less Than" : function(entity, atom, addArgument) {
                var destFieldID = 0,
                    currentX = entity.position.x,
                    currentY = entity.position.y,
                    moveDirection = atom.atomArguments[0],
                    curFieldID = entity.getGame().gameWorld.getFieldID(currentX, currentY);

                // Ignore off board entitys
                if (_.isUndefined(entity.tmp.fieldID) === false) {
                    return false;
                }

                if (moveDirection === "MOVE POSITIVE") {
                    destFieldID = parseInt(curFieldID + addArgument, 10);
                } else if (moveDirection === "MOVE NEGATIVE") {
                    destFieldID = parseInt(curFieldID - addArgument, 10);
                }
                return destFieldID < atom.atomArguments[1];
            }
        };

        /**
         * Execute an entity's goal atom by its name
         * @param entity
         * @param goalAtomName
         * @param additionalArgument
         * @returns {*}
         */
        self_Game.executeEntityGoalAtomByName = function(entity, goalAtomName, additionalArgument) {

            if (entity.enabled === false) { return false; }

            var count = entity.goalAtoms.length,
                goalAtomCounter,
                currentGoalAtom;

            for (goalAtomCounter = 0; goalAtomCounter < count; goalAtomCounter += 1) {

                if (entity.goalAtoms[goalAtomCounter].atomName === goalAtomName) {
                    currentGoalAtom = entity.goalAtoms[goalAtomCounter];
                    return self_Game.entityAtomFunctions[currentGoalAtom.atomFunction](entity, currentGoalAtom, additionalArgument);
                }
            }
            return false;
        };

        /**
         * Game rule atoms
         */
        self_Game.gameRuleAtoms = {

            "Last Move Was Capture Move" : function() {
                if (self_Game.getrecentlyMovedEntity()) {
                    return (self_Game.getrecentlyMovedEntity().getLastExecutedMove().type
                    === "capture");
                }
            },

            "Recently Moved Entity Can Capture An Opponent Entity": function() {
                if (self_Game.getrecentlyMovedEntity()) {
                    return self_Game.getrecentlyMovedEntity().canCapture();
                }
            },

            "Recently Moved Entity Can Not Capture An Opponent Entity": function() {
                if (self_Game.getrecentlyMovedEntity()) {
                    return !self_Game.getrecentlyMovedEntity().canCapture();
                }
            },

            "Recently Moved Entity Is Owned By Player": function(currentRuleAtom) {
                if (self_Game.getrecentlyMovedEntity()) {
                    return (self_Game.getrecentlyMovedEntity().getMetaPlayerID()
                    === currentRuleAtom.atomArguments);
                }
            },

            "Recently Moved Entity Is At YPosition": function(currentRuleAtom) {
                var yPosition = currentRuleAtom.atomArguments;

                if (yPosition === "last") {
                    yPosition = parseInt(self_Game.gameWorld.getRows()-1, 10);
                } else if (yPosition === "first") {
                    yPosition = 0;
                }

                if (self_Game.getrecentlyMovedEntity() !== false) {
                    return (self_Game.getrecentlyMovedEntity().getPosition().y === yPosition);
                }
            },

            "Recently Moved Entity Is At XPosition": function(currentRuleAtom) {
                var xPosition = currentRuleAtom.atomArguments;

                if (xPosition === "last") {
                    xPosition = self_Game.gameWorld.getColumns()-1;
                }

                if (self_Game.getrecentlyMovedEntity() !== false) {
                    return (self_Game.getrecentlyMovedEntity().getPosition().x === xPosition);
                }
            },

            "Recently Moved Entity Is Type": function(currentRuleAtom) {
                var type = currentRuleAtom.atomArguments,
                    recentlyMoved = self_Game.getrecentlyMovedEntity(),
                    recentlyMovedType = 0,
                    connector = currentRuleAtom.atomConnector,
                    counter = 0, max;

                if (recentlyMoved !== 0) {
                    recentlyMovedType = recentlyMoved.type;

                    switch (connector) {

                        case "OR":

                            max = type.length;
                            for (counter = max; counter--;) {
                                if (recentlyMovedType === type[counter]) {
                                    return true;
                                }
                            }
                            return false;
                            break;

                        case "AND":

                            max = type.length;
                            for (counter = max; counter--;) {
                                if (recentlyMovedType !== type[counter]) {
                                    return false;
                                }
                            }
                            return true;
                            break;

                        default:
                            return recentlyMovedType === type;
                            break;
                    }
                }
            },

            "Player Has Entities": function(currentRuleAtom) {
                return (self_Game.getPlayerWithID(currentRuleAtom.atomArguments).countEntities() !== 0);
            },

            "Player Has No Movable Entities": function(currentRuleAtom) {
                // returns true if no entity, owned by meta agent, can move
                var currentPlayer = self_Game.getPlayerWithID(currentRuleAtom.atomArguments),
                    entityCount = currentPlayer.countEntities(), counter;

                if (entityCount === 0) { return true; }

                // Check standard entity moves
                for (counter = entityCount; counter--;) {
                    if (self_Game.checkSelectCondition(currentPlayer.getEntityFromArray(counter)) === true ) {
                        if (currentPlayer.getEntityFromArray(counter).canMove()) {
                            return false;
                        }
                    }
                }
                // Check capture and goal moves of the entities
                for (counter = entityCount; counter--;) {
                    if (self_Game.checkSelectCondition(currentPlayer.getEntityFromArray(counter)) === true ) {
                        if (currentPlayer.getEntityFromArray(counter).canReachGoal()) {
                            return false;
                        }
                    }
                }
                return true;
            },

            // Backgammon specific
            "Player Has Entities In Off Board Area": function(currentRuleAtom) {
                // returns true if the player has captured entities outside of the game board
                return (self_Game.offBoard.entitiesOfPlayerAreOutside(currentRuleAtom.atomArguments));
            },

            "Player Has No Entities In Off Board Area": function(currentRuleAtom) {
                // returns true if the player has captured entities outside of the game board
                return (!self_Game.offBoard.entitiesOfPlayerAreOutside(currentRuleAtom.atomArguments));
            },

            "Player Has No Entities": function(currentRuleAtom) {
                // returns true if player has no entities
                var metaAgent = self_Game.getPlayerWithID(currentRuleAtom.atomArguments);
                return (metaAgent.countEntities() === 0);
            },

            "Player Has Number Of Entities": function(currentRuleAtom) {
                var metaAgent = self_Game.getPlayerWithID(currentRuleAtom.atomArguments[0]);
                return (metaAgent.countEntities() === currentRuleAtom.atomArguments[1]);
            },

            "Player Has No Entity Which Satisfies Goals": function(currentRuleAtom) {
                // returns true if no entity, owned by player, can move
                var currentPlayer = self_Game.getPlayerWithID(currentRuleAtom.atomArguments),
                    entityCount = currentPlayer.countEntities(), counter;

                if (entityCount === 0) { return true; }

                for (counter = entityCount; counter--;) {
                    if ( !(_.isEmpty(currentPlayer.getEntityFromArray(counter).canReachGoal())) ) {
                        return false;
                    }
                }
                return true;
            },

            "Player Has Number Of Entities In Row": function(currentRuleAtom) {

                var typeID = currentRuleAtom.atomArguments.entityID,
                    count = currentRuleAtom.atomArguments.number;

                // Create a string representation of the game board
                var boardString = self_Game.gameWorld.createBoardSignature(),
                    pattern = new RegExp(typeID + "{" + count + "}");

                return (pattern.test(boardString));
            },

            "Player Has Number Of Entities In Column": function(currentRuleAtom) {
                var typeID = currentRuleAtom.atomArguments.entityID,
                    count = currentRuleAtom.atomArguments.number;

                // Create a string representation of the game board
                var boardString = self_Game.gameWorld.createBoardSignatureByVertical(),
                    pattern = new RegExp(typeID + "{" + count + "}");

                return (pattern.test(boardString));
            },

            "Player Has Number Of Entities Diagonally": function(currentRuleAtom) {

                var diagonalString = "",
                    controller = self_Game.gameWorld,
                    maxRows = controller.getRows(),
                    maxColumns = controller.getColumns(),
                    count = currentRuleAtom.atomArguments.number,
                    typeID = currentRuleAtom.atomArguments.entityID,
                    pattern = new RegExp(typeID + "{" + count + "}"),
                    boardString = self_Game.gameWorld.createBoardSignature(),
                    xWalker, yWalker, i;

                /*
                 x
                 x
                 x
                 x
                 x
                 After the middle of the game board
                 */
                // Create a string representation of the game board
                for (xWalker = 0; xWalker < maxColumns; xWalker++) {

                    diagonalString = "";
                    for(i = xWalker; i < boardString.length; i += (maxColumns + 2)) {

                        if (boardString[i] === "|") {
                            break;
                        }
                        diagonalString += boardString[i];
                    }
                    if (pattern.test(diagonalString) === true) {
                        return true;
                    }
                }

                /*
                 x
                 x
                 x
                 x
                 x
                 Before the middle of the game board
                 */
                for (yWalker = 1; yWalker < maxRows; yWalker++) {

                    diagonalString = "";
                    for(i = (yWalker * maxColumns) + yWalker; i < boardString.length; i += (maxColumns + 2)) {

                        if (boardString[i] === "|") {
                            break;
                        }
                        diagonalString += boardString[i];
                    }
                    if (pattern.test(diagonalString) === true) {
                        return true;
                    }
                }

                /*
                 Check anti-diagonals I
                 From left top to left bottom
                 */
                for (yWalker = 1; yWalker < maxRows; yWalker++) {

                    diagonalString = "";
                    for(i = (yWalker * maxColumns) + yWalker; i > 0; i -= maxColumns ) {

                        if (boardString[i] === "|") {
                            break;
                        }
                        diagonalString += boardString[i];
                    }
                    if (pattern.test(diagonalString) === true) {
                        return true;
                    }
                }

                /*
                 Check anti-diagonals II
                 Walking from bottom right to bottom left
                 */
                for (xWalker = 3; xWalker <= maxColumns; xWalker++) {

                    diagonalString = "";
                    for(i = (maxRows * maxColumns) + maxRows - xWalker; i > 0; i -= maxColumns ) {

                        if (boardString[i] === "|") {
                            break;
                        }
                        diagonalString += boardString[i];
                    }
                    if (pattern.test(diagonalString) === true) {
                        return true;
                    }
                }

                return false;
            },

            "No Empty Field On The Game Board": function() {
                return (self_Game.gameWorld.getFreeCells().length === 0);
            },

            "Current Player Is": function(currentRuleAtom) {
                return (self_Game.getPlayerWithID(currentRuleAtom.atomArguments).ID ===
                self_Game.getCurrentPlayerID());
            },

            "Print Debug Message": function(currentRuleAtom) {
                return true;
            },

            "Game State Is": function(currentRuleAtom) {
                return (currentRuleAtom.atomArguments === self_Game.models.gameState);
            },

            "Dice Box Is Empty": function() {
                return (self_Game.getDiceBox().gotNoDiceValues());
            },

            "Entity Is Under Attack": function(currentRuleAtom) {
                return (self_Game.entityOfSpecificTypeIsUnderAttack(currentRuleAtom.atomArguments));
            },

            "Got No Protecting Entities": function(currentRuleAtom) {
                return !(self_Game.identifyProtectingEntities(currentRuleAtom.atomArguments.entityType));
            },

            "Every Entity Of Player Is In Target Area": function(currentRuleAtom) {
                // returns true if no entity, owned by player, can move
                var currentPlayer = self_Game.getPlayerWithID(currentRuleAtom.atomArguments.player),
                    entityCount = currentPlayer.countEntities(),
                    targetFields = currentRuleAtom.atomArguments.targetArea,
                    targetFieldCnt = targetFields.length,
                    fieldCounter, counter,
                    onField = false;

                if (entityCount === 0) {
                    return false;
                } else {
                    // See if every entity is on one of the target fields
                    for (fieldCounter = 0; fieldCounter < targetFieldCnt; fieldCounter += 1) {
                        onField = false;
                        for (counter = 0; counter < entityCount; counter += 1) {
                            if (currentPlayer.getEntityFromArray(counter).position.x === targetFields[fieldCounter].x) {
                                if (currentPlayer.getEntityFromArray(counter).position.y === targetFields[fieldCounter].y) {
                                    onField = true;
                                }
                            }
                        }
                        if (onField === false) {
                            return false;
                        }
                    }
                    return true;
                }
            }
        };

        /**
         * Execute a game rule atom by its name
         * @param ruleAtomName
         * @returns {*}
         */
        self_Game.executeGameRuleAtomByName = function(ruleAtomName) {

            var count = self_Game.models.GameRuleAtoms.length,
                currentRuleAtom, ruleAtomCounter;

            // ToDo Refactor later
            for (ruleAtomCounter = count; ruleAtomCounter--;) {

                if (self_Game.models.GameRuleAtoms[ruleAtomCounter].atomName === ruleAtomName) {

                    currentRuleAtom = self_Game.models.GameRuleAtoms[ruleAtomCounter];
                    return self_Game.gameRuleAtoms[currentRuleAtom.atomFunction](currentRuleAtom);
                }
            }
            return false;
        };

        /**
         * Connect the game rule consequences
         * @param gameRuleConsequences
         */
        self_Game.connectGameRuleConsequences = function(gameRuleConsequences) {

            var goalName = gameRuleConsequences.ruleName, len,
                entityName = "", entityType = "",
                conseq = gameRuleConsequences.consequences;

            // Each consequence in consequences: execute: "immediately"
            len = conseq.length;
            for (var i = len; i--;) { conseq[i].execute = "immediately"; }

            if (gameRuleConsequences.entityName) {
                entityName = gameRuleConsequences.entityName;
            }

            if (gameRuleConsequences.entityType) {
                entityType = gameRuleConsequences.entityType;
            }

            self_Game.models.GameRuleConsequences.push({
                goalName    : goalName,
                entityName  : entityName,
                entityType	: entityType,
                consequences: conseq });
        };

        /**
         * Get game rule consequences with specific name
         * @param ruleName
         * @returns {Array}
         */
        self_Game.getGameRuleConsequencesWithName = function(ruleName) {

            var consequencesWithGoalName = [], curConseq,
                conseq = self_Game.models.GameRuleConsequences,
                count = conseq.length;

            for (var arIndex = count; arIndex--;) {

                curConseq = conseq[arIndex];

                if (curConseq.goalName === ruleName) {

                    if (curConseq.entityName && self_Game.getrecentlyMovedEntity() !== false) {
                        curConseq.entityName = self_Game.getrecentlyMovedEntity().getName();
                    }
                    if (curConseq.entityType && self_Game.getrecentlyMovedEntity() !== false) {
                        curConseq.entityType = self_Game.getrecentlyMovedEntity().type;
                    }
                    curConseq.consequences.entityLink = self_Game.getrecentlyMovedEntity();
                    consequencesWithGoalName.push(curConseq);
                }
            }
            consequencesWithGoalName.reverse();
            return consequencesWithGoalName;
        };

        /**
         * Execute game rule consequences
         * @param ruleName
         */
        self_Game.executeGameRuleConsequences = function(ruleName) {

            var consequences = self_Game.getGameRuleConsequencesWithName(ruleName),
                count = consequences.length;

            for (var conseqCounter = 0; conseqCounter < count; conseqCounter += 1) {
                self_Game.addJobs(consequences[conseqCounter].consequences);
            }
        };

        /**
         * Execute game rules
         * @returns {boolean}
         */
        self_Game.executeGameRules = function() {

            // Reset restrictions (specific entities, specific moves), previously made
            self_Game.resetRestrictions();

            var curGoalID,
                currentGoal,
                goalCount = self_Game.countGameRules(),
                execute = false;

            for (curGoalID = 0; curGoalID < goalCount; curGoalID++) {

                currentGoal = self_Game.getGameRule(curGoalID);

                if (self_Game.executeGameRuleByName(currentGoal.name) === true) {

                    self_Game.executeGameRuleConsequences(currentGoal.name);
                    execute = true;
                }
            }
            return execute;
        };

        /**
         * Calculate a unique move identifier
         * @returns {string}
         */
        self_Game.getUniqueMoveID = function(entityName, moveName, xPos, yPos) {

            //return self_Game.models.gameRounds + "_" + entityName + "_" + moveName + "_" + xPos + "|" + yPos;
            return entityName + "_" + moveName + "_" + xPos + "|" + yPos;

            // First method: Create unique move identifier by using time plus random numbers
            // Problem in this method: MCTS needs unique identifiers independently from time
            //return (Date.now() + _.random(0, 99999));
        };

        /**
         * Moves an entity from source to destination coordinates
         * @param srcX
         * @param srcY
         * @param destX
         * @param destY
         * @param entityToMove
         */
        self_Game.moveEntity = function(srcX, srcY, destX, destY, entityToMove) {
            self_Game.gameWorld.moveEntity(srcX, srcY, destX, destY, entityToMove);
        };

        /**
         * Delete an entity at given coordinates
         * @param xPosition
         * @param yPosition
         */
        self_Game.deleteEntityAt = function(xPosition, yPosition) {
            self_Game.gameWorld.deleteCellContent(xPosition, yPosition);
        };

        /**
         * Count fields with a specific field id
         * @param fieldID
         * @returns {Number}
         */
        self_Game.countFieldsWithID = function(fieldID) {
            return self_Game.gameWorld.getContentOfFieldsWithFieldID(fieldID).length;
        };

        /**
         * Count own entities on fields with id
         * @param fieldID
         * @param selectedEntity
         * @returns {number}
         */
        self_Game.countOwnOnFieldsWithID = function(fieldID, selectedEntity) {

            var fieldsToCheck = self_Game.gameWorld.getContentOfFieldsWithFieldID(fieldID),
                counter,
                ownCount = 0,
                currentEntity = 0,
                maxFields = fieldsToCheck.length;

            for (counter = 0; counter < maxFields; counter += 1) {
                currentEntity = fieldsToCheck[counter];

                if (currentEntity) {
                    if (currentEntity.getMetaPlayerID() === selectedEntity.getMetaPlayerID()) {
                        ownCount += 1;
                    }
                }
            }
            return ownCount;
        };

        /**
         * Count opponent entities on fields with id
         * @param fieldID
         * @param selectedEntity
         * @returns {number}
         */
        self_Game.countOpponentsOnFieldsWithID = function(fieldID, selectedEntity) {

            var fieldsToCheck = self_Game.gameWorld.getContentOfFieldsWithFieldID(fieldID),
                counter,
                opponentCount = 0,
                currentEntity = 0,
                maxFields = fieldsToCheck.length;

            for (counter = 0; counter < maxFields; counter += 1) {
                currentEntity = fieldsToCheck[counter];
                if (currentEntity) {
                    if (currentEntity.getMetaPlayerID() !== selectedEntity.getMetaPlayerID()) {
                        opponentCount += 1;
                    }
                }
            }
            return opponentCount;
        };

        /**
         * Reset restrictions
         */
        self_Game.resetRestrictions = function() {
            self_Game.models.SelectRestrictions.entities = "";
            self_Game.models.SelectRestrictions.moves = "";
        };

        /**
         * Checks if an entity is clickable
         *
         * @param {Object} selectedEntity Clicked Entity
         * @returns {Boolean}
         */
        self_Game.checkSelectCondition = function(selectedEntity) {

            if (self_Game.models.SelectRestrictions.entities === "Recently Moved Entity") {
                var recently = self_Game.getrecentlyMovedEntity();
                return recently.getName() === selectedEntity.getName();
            }

            if (!_.isUndefined(selectedEntity.selectCondition)) {

                if (self_Game.models.SelectRestrictions.entities === "Only Off Board Entities") {

                    // Off Board entities are entities at position x=null, y=null
                    if (selectedEntity.position.x !== null) {
                        if (selectedEntity.position.y !== null) {
                            return false;
                        }
                    }
                    return true;
                }

                var selCon = selectedEntity.selectCondition,
                    returnValue = false;

                // Select condition: An entity can only be chosen if it is on top of the stack
                if (selCon.neighboursY) {

                    var countNeighboursY = selCon.neighboursY.length,
                        counter, appliesTo = 0, operators = {
                            "<": function(a, b) { return a < b },
                            "<=": function(a, b) { return a <= b },
                            ">": function(a, b) { return a > b },
                            ">=": function(a, b) { return a >= b },
                            "==": function(a, b) { return a == b }
                        }, cur;

                    for (counter = countNeighboursY; counter--;) {

                        cur = selCon.neighboursY[counter];
                        appliesTo = cur.appliesTo;

                        switch (appliesTo.axis) {

                            case "y":
                                if (operators[appliesTo.operator](selectedEntity.position.y, appliesTo.value)) {
                                    var neighbourCount = cur.count,
                                        direction = cur.direction,
                                        condition = cur.condition,
                                        entityNeighbours = 0;

                                    switch(direction) {
                                        case "NORTH":
                                            entityNeighbours = self_Game.gameWorld.countNeighboursNorth(selectedEntity);
                                            break;

                                        case "SOUTH":
                                            entityNeighbours = self_Game.gameWorld.countNeighboursSouth(selectedEntity);
                                            break;

                                        case "BOTH":
                                        default:
                                            entityNeighbours = self_Game.gameWorld.countNeighboursY(selectedEntity);
                                            break;
                                    }

                                    switch(condition) {
                                        case "LESS THAN OR EQUAL TO":
                                        case "<=":
                                            if (entityNeighbours <= neighbourCount) {
                                                returnValue = true;
                                            }
                                            break;

                                        case "LESS THAN":
                                        case "<":
                                            if (entityNeighbours < neighbourCount) {
                                                returnValue = true;
                                            }
                                            break;

                                        case "MORE THAN OR EQUAL TO":
                                        case ">=":
                                            if (entityNeighbours >= neighbourCount) {
                                                returnValue = true;
                                            }
                                            break;

                                        case "MORE THAN":
                                        case ">":
                                            if (entityNeighbours > neighbourCount) {
                                                returnValue = true;
                                            }
                                            break;

                                        case "EQUAL":
                                        case "=":
                                        case "==":
                                        case "===":
                                            if (entityNeighbours === neighbourCount) {
                                                returnValue = true;
                                            }
                                            break;

                                        // No default
                                    }
                                }
                                break;

                            case "x":
                                break;
                        }
                    }
                }
                return returnValue;
            }
            return true;
        };

        /**
         * Shows standard moves of the chosen entity
         * @param xPos
         * @param yPos
         * @returns {boolean}
         */
        self_Game.showEntityMoves = function(xPos, yPos) {

            var clickedEntity = self_Game.gameWorld.peekCell(xPos, yPos);

            // Empty field clicked or pseudo loop performed
            if (clickedEntity === false) { return false; }
            if (_.isUndefined(clickedEntity)) { return false; }

            if (self_Game.isHighlighted(clickedEntity)) {
                self_Game.resetMoves();
                return false;
            }

            // Only entities of the current player can be moved
            if (clickedEntity.getMetaPlayerID() !== self_Game.getCurrentPlayerID()) {
                return false;
            }

            if (self_Game.checkSelectCondition(clickedEntity) === true) {

                // Hide previously shown possible moves
                self_Game.resetMoves();

                // Build up the move and goal move tables
                var entityMoves, goalMoves;

                // See if current entity is restricted move in a specific way
                var rstrct = self_Game.models.SelectRestrictions.moves;

                switch (rstrct) {

                    case "Standard Moves":
                        entityMoves = clickedEntity.getMoves();
                        break;

                    case "Capture Moves":
                        goalMoves = clickedEntity.getGoalMoves(entityMoves);
                        break;

                    default:
                        entityMoves = clickedEntity.getMoves();
                        goalMoves = clickedEntity.getGoalMoves(entityMoves);
                        break;
                }

                self_Game.performPostMoveChecks(clickedEntity, entityMoves);
                self_Game.performPostMoveChecks(clickedEntity, goalMoves);

                if (!_.isEmpty(entityMoves) || !_.isEmpty(goalMoves)) {
                    // Highlight clicked entity
                    self_Game.highlightEntityAtPosition(xPos, yPos);
                }

                // Highlight entity's moves
                self_Game.highlightStandardMoves(entityMoves);
                self_Game.highlightGoalMoves(goalMoves);
            }
            return true;
        };

        /**
         * Show fields on which entities can be placed
         */
        self_Game.showFieldsToPlaceEntity = function() {

            if (self_Game.models.gameMode === "PLACING") {
                self_Game.highlightStandardMoves(self_Game.getCurrentPlayer().getAllEntityMoves());
            }
        };

        /**
         * Highlight standard moves on the game board
         * @param moves
         */
        self_Game.highlightStandardMoves = function(moves) {

            if (!_.isUndefined(moves)) {

                var move;

                for (var i = moves.length; i--;) {

                    move = moves[i];

                    // Highlight Destination Cells
                    self_Game.highlightCell(move.targetX, move.targetY,
                        move.moveClass, move.ID);

                    // Add move
                    self_Game.models.MoveTable.push({
                        entity: move.entity,
                        xPosition : move.targetX,
                        yPosition : move.targetY,
                        moveClass : move.moveClass,
                        moveID : move.ID
                    });

                }
            }
        };

        /**
         * Highlight goal moves on the game world
         * @param moves
         */
        self_Game.highlightGoalMoves = function(moves) {

            if (!_.isUndefined(moves)) {

                var move, moveEntity;

                for (var i = moves.length; i--;) {

                    move = moves[i];

                    switch (move.type) {

                        // Highlight goal moves in dice based games
                        case "DICE":

                            if (move.moveClass === "move_bearoff") {
                                self_Game.executeGoalConsequences(move.name, move.entity, false);
                            } else {

                                moveEntity = move.entity;

                                // In Spoooky.Entity.getGoalMoves, goal moves have been connected with move IDs
                                self_Game.setMoveID(self_Game.getDiceBox().getMoveIDForDiceID(move.diceID));

                                // Temporarily set the entity's target - for consequences which will executed "immediately"
                                moveEntity.setTarget(move.targetX, move.targetY);
                                self_Game.executeGoalConsequences(move.name, moveEntity, false);
                                moveEntity.unsetTarget();
                            }

                            break;

                        // Put entities on the game board
                        case "PUT":
                            break;

                        // Default moves
                        default:

                            moveEntity = move.entity;
                            var preArrangeEntity = [],
                                preX = moveEntity.position.x,
                                preY = moveEntity.position.y;

                            preArrangeEntity.x = preX;
                            preArrangeEntity.y = preY;

                            self_Game.doVirtualMove(preX, preY, move.preArrangeX, move.preArrangeY);

                            self_Game.executeGoalConsequences(move.name, moveEntity,
                                preArrangeEntity);

                            self_Game.undoVirtualMove();

                            break;
                    }
                }
            }
        };

        /**
         * Perform post move checks
         * @param entity
         * @param moves
         */
        self_Game.performPostMoveChecks = function(entity, moves) {

            if (entity.postMoveCheck !== null) {

                var chk, currentEntity, i,
                    postMoveCheck = entity.postMoveCheck;

                // Check standard moves of the entity
                for (var curMove = 0; curMove < moves.length; curMove++) {

                    for (i = 0; i < postMoveCheck.length; i++) {

                        chk = postMoveCheck[i];

                        if (chk.condition === "Entity Is Attackable After Move") {

                            // Check if specific entity is attackable after the move
                            currentEntity = moves[curMove].entity;

                            // Move the current entity to destination field
                            self_Game.doVirtualMove(currentEntity.position.x, currentEntity.position.y,
                                moves[curMove].targetX, moves[curMove].targetY);

                            if (self_Game.entityOfTypeIsUnderAttack(chk.entity, currentEntity.getAssociatedPlayer())) {
                                // Delete this move
                                moves.splice(curMove, 1);
                                curMove -= 1;
                            }
                            self_Game.undoVirtualMove();
                        }
                    }
                }
            }
        };

        /**
         * Reset moves
         */
        self_Game.resetMoves = function() {

            var gameWorld = self_Game.gameWorld, item, i,
                entityMoves = self_Game.models.MoveTable,
                highlightTable = self_Game.models.HighlightTable;

            for (i = entityMoves.length; i--;) {

                item = entityMoves[i];
                gameWorld.setCellClass(item.xPosition, item.yPosition, "");
            }

            self_Game.models.MoveTable.length = 0;
            self_Game.models.GoalMoves.length = 0;
            self_Game.models.MovableEntities.length = 0;

            // Reset highlighted cells
            for (i = highlightTable.length; i--;) {

                item = highlightTable[i];
                gameWorld.setCellClass(item.x, item.y, "");
            }

            self_Game.flush(self_Game.models.HighlightTable);

            if (self_Game.areas !== null) {
                if (self_Game.areas.isEnabled()) { self_Game.areas.resetDisplays(); }
            }

            // For Dice Games: Reset with dice values connected move IDs
            if (self_Game.getDiceBox() !== null) {
                self_Game.getDiceBox().flushAttachedMoveIDs();
            }
        };

        /**
         * Checks if an entity is higlighted
         * @param entity
         * @returns {boolean}
         */
        self_Game.isHighlighted = function(entity) {

            var counter,
                highlighted = self_Game.models.HighlightTable,
                highlightCount = highlighted.length, current,
                entityPositionX = entity.position.x,
                entityPositionY = entity.position.y;

            for (counter = 0; counter < highlightCount; counter += 1) {

                current = highlighted[counter];
                if (current.x === entityPositionX) {
                    if (current.y === entityPositionY) {
                        return true;
                    }
                }
            }
            return false;
        };

        /**
         * Highlight an entity at given coordinates
         * @param xPos
         * @param yPos
         */
        self_Game.highlightEntityAtPosition = function(xPos, yPos) {

            if (self_Game.gameWorld.isValidCoordinate(xPos, yPos)) {
                self_Game.models.HighlightTable.push({ x: xPos, y: yPos});
                self_Game.gameWorld.setCellClass(xPos, yPos, "clickedEntity");
            }
        };

        /**
         * Highlight a cell of the game board
         * @param xPos
         * @param yPos
         * @param cellClass
         * @param curMoveID
         */
        self_Game.highlightCell = function(xPos, yPos, cellClass, curMoveID) {

            self_Game.gameWorld.setCellClass(xPos, yPos, cellClass);
            self_Game.models.HighlightTable.push({ x: xPos, y: yPos});

            if (cellClass === "move_goal") {

                self_Game.models.MoveTable.push({
                    entity: null,
                    xPosition : xPos,
                    yPosition : yPos,
                    moveClass : cellClass,
                    moveID : curMoveID
                });

                self_Game.models.GoalMoves.push({
                    entity: null,
                    xPosition : xPos,
                    yPosition : yPos
                });
            }
        };

        /**
         * Simple virtual moves to a field
         * @type {Array}
         */
        self_Game.virtualMove = [];

        /**
         * Perform a virtual move
         * @param _srcX
         * @param _srcY
         * @param _destX
         * @param _destY
         */
        self_Game.doVirtualMove = function(_srcX, _srcY, _destX, _destY) {

            var world = self_Game.gameWorld,
                vrt = {
                    srcX : _srcX,
                    srcY : _srcY,
                    srcEntity : world.popFromCell(_srcX, _srcY),
                    destX : _destX,
                    destY : _destY,
                    destEntity : world.popFromCell(_destX, _destY)
                };

            self_Game.virtualMove.push(vrt);

            if (vrt.destEntity && vrt.destEntity !== null) {
                vrt.destEntity.setPosition(null, null);
            }

            if (vrt.srcEntity) {

                var vrtSrc = vrt.srcEntity;

                // Save a link to an entity on the grid cell
                world.pushToCell({
                    entityID : vrtSrc.ID,
                    playerID : vrtSrc.getMetaPlayerID(),
                    typeID : vrtSrc.getTypeID()
                }, _destX, _destY);
                vrtSrc.setPosition(_destX, _destY, true);
            }
        };

        /**
         * Undo a virtual move
         * @returns {boolean}
         */
        self_Game.undoVirtualMove = function() {

            var virtual = self_Game.virtualMove.pop();

            if (!virtual) { return false; }

            var srcEntity = virtual.srcEntity;
            if (srcEntity && srcEntity !== null) {

                self_Game.gameWorld.popFromCell(virtual.destX, virtual.destY);

                srcEntity.setPosition(virtual.srcX, virtual.srcY);
                self_Game.gameWorld.pushToCell({
                    entityID : srcEntity.ID,
                    playerID : srcEntity.getMetaPlayerID(),
                    typeID : srcEntity.getTypeID()
                }, virtual.srcX, virtual.srcY);
            }

            var destEntity = virtual.destEntity;
            if (destEntity && destEntity !== null) {

                destEntity.setPosition(virtual.destX, virtual.destY);
                self_Game.gameWorld.pushToCell({
                    entityID : destEntity.ID,
                    playerID : destEntity.getMetaPlayerID(),
                    typeID : destEntity.getTypeID()
                }, virtual.destX, virtual.destY);
            }
            return true;
        };

        /**
         * List of move conditions
         */
        self_Game.moveConditions = {

            "Is Empty" : function(args, curState) {

                if (!(self_Game.gameWorld.isEmpty(args._destX, args._destY) === curState)) {
                    // Occupied field
                    return false;
                }
                return true;
            },

            "Is Empty At" : function(args, curState, cnt) {

                if (!(self_Game.gameWorld.isEmpty(parseInt(args._curX + args._conditions[cnt].relativeCoordinate[0], 10),
                        parseInt(args._curY + args._conditions[cnt].relativeCoordinate[1], 10))) === curState) {
                    // Occupied field
                    return false;
                }
                return true;
            },

            "Is Not The Last Row" : function(args) {

                if (args._destY === parseInt(self_Game.gameWorld.getRows()-1, 10)) {
                    return false;
                }
                return true;
            },

            "Is Not The First Row" : function(args) {

                if (args._destY === 0) {
                    return false;
                }
                return true;
            },

            "Move Count" : function(args, curState, cnt) {

                if (!(args._currentEntity.getMoveCount() === args._conditions[cnt].value)) {
                    return false;
                }
                return true;
            },

            "Move Count Of Entity" : function(args, curState, cnt) {

                // Maybe TODO: Get Entities of every player not only the current player
                var checkEntity = self_Game.getCurrentPlayer().
                    getEntityWithName(args._conditions[cnt].entityName);

                if (checkEntity === false) { return false; }

                if (!(checkEntity.getMoveCount() === args._conditions[cnt].value)) {
                    return false;
                }
                return true;
            },

            "Game State" : function(args, curState, cnt) {

                if (self_Game.models.gameState === args._conditions[cnt].value && curState === true) {
                    return true;
                } else if (self_Game.models.gameState !== args._conditions[cnt].value && curState === false) {
                    return true;
                } else { return false; }
            },

            "Field Is Attackable By Opponent Entity" : function(args, curState, cnt) {

                var destinationX = parseInt(args._curX + args._conditions[cnt].relativeCoordinate[0], 10),
                    destinationY = parseInt(args._curY + args._conditions[cnt].relativeCoordinate[1], 10);

                // Move entity virtually to destination field
                self_Game.doVirtualMove(args._curX, args._curY, destinationX, destinationY);

                // Check if destination field is attackable by opponent capture move
                if (curState === self_Game.opponentEntityCanCaptureAt(destinationX, destinationY, args._currentEntity)) {
                    self_Game.undoVirtualMove();
                    return true;
                } else {
                    self_Game.undoVirtualMove();
                    return false;
                }
            },

            "Target Field Is Reachable By Opponent Entity" : function(args, curState, cnt) {

                var opponentEntities = self_Game.getCurrentPlayer().
                        getNextOpponentPlayer().
                        getEntitiesOfType(args._conditions[cnt].opponentEntity),
                    entityCount = opponentEntities.length;

                if(entityCount === 0) {
                    return true;
                } else {
                    var curOpponentEntity,
                        curGoalID,
                        currentGoal,
                        currentX,
                        currentY,
                        moveDirection = null,
                        xPosition,
                        yPosition;

                    for (var counter = entityCount; counter--;) {

                        curOpponentEntity = opponentEntities[counter];
                        currentX = curOpponentEntity.position.x;
                        currentY = curOpponentEntity.position.y;

                        for (curGoalID = curOpponentEntity.countGoals(); curGoalID--;) {

                            currentGoal = curOpponentEntity.getGoal(curGoalID);
                            moveDirection = curOpponentEntity.translateDirection(currentGoal.move);
                            xPosition = parseInt(currentX+moveDirection[0], 10);
                            yPosition = parseInt(currentY+moveDirection[1], 10);
                            if(xPosition === args._destX && yPosition === args._destY) {
                                return false;
                            }
                        }
                    }
                    return true;
                }
            },

            "yPosition" : function(args, curState, cnt) {

                if (args._curY === args._conditions[cnt].value && curState === true) {
                    // Found legal move
                    return true;
                } else { return false; }
            },

            "xPosition" : function(args, curState, cnt) {

                if (args._curX === args._conditions[cnt].value && curState === true) {
                    // Found legal move
                    return true;
                } else { return false; }
            }
        };

        /**
         * Checks for legal moves of an entity
         * @param currentEntity
         * @param conditions
         * @param curX
         * @param curY
         * @param destX
         * @param destY
         * @returns {boolean}
         */
        self_Game.isLegalMove = function(currentEntity, conditions, curX, curY, destX, destY) {

            if (self_Game.gameWorld.isValidCoordinate(destX, destY) === false) { return false; }

            var conditionCount,
                maxConditions,
                args;

            maxConditions = conditions.length;
            args = {
                _currentEntity : currentEntity,
                _conditions : conditions,
                _curX : curX,
                _curY : curY,
                _destX : destX,
                _destY : destY
            };

            for (conditionCount = 0; conditionCount < maxConditions; conditionCount += 1) {

                if (self_Game.moveConditions[conditions[conditionCount].condition](args,
                        conditions[conditionCount].state, conditionCount) === false) {
                    return false;
                }
            }
            return true;
        };

        /**
         * Connection to the view
         * @type {null}
         */
        self_Game.viewScope = null;

        /**
         * Reflect model changes: refresh the view
         */
        self_Game.refreshView = function() {

            if (!self_Game.models.playVirtual) {
                self_Game.viewScope.$apply();
            }
        };

        /**
         * Execute a random move of the current player
         */
        self_Game.executeRandomMove = function() {

            var allMoves = self_Game.getCurrentPlayer().getAllEntityMoves(),
                move = allMoves[_.random(0, parseInt(allMoves.length-1, 10))];

            self_Game.executeMove(move);
        };

        /**
         * Execute an artificial move
         * Gets called by ai worker
         * @param aiMove
         */
        self_Game.executeArtificialMove = function(aiMove) {

            if (aiMove === "random") {
                self_Game.executeRandomMove();
                return true;
            }

            var allMoves = self_Game.getCurrentPlayer().getAllEntityMoves(),
                move = allMoves[aiMove.moveIndex];

            self_Game.executeMove(move);

            return true;
        };

        /**
         * Execute a specific move
         * @param move
         * @returns {boolean}
         */
        self_Game.executeMove = function(move) {

            if (self_Game.models.gameState === "END") {
                return false;
            }

            var targetArea = false, entity, entityPosition;

            // Goal move
            if (move.moveClass === "move_goal" || move.moveClass === "move_bearoff") {

                entity = move.entity;

                // Highlight Capture Moves in Dice Based Games
                if (move.type === "DICE") {

                    if (move.moveClass === "move_bearoff") {
                        self_Game.executeGoalConsequences(move.name, entity, false);
                        targetArea = move.targetArea;
                    } else {

                        // In Spoooky.Entity.getGoalMoves, goal moves have been connected with move IDs
                        self_Game.setMoveID(self_Game.getDiceBox().getMoveIDForDiceID(move.diceID));

                        // Temporarily set the entity's target - for consequences which will executed "immediately"
                        entity.setTarget(move.targetX, move.targetY);
                        self_Game.executeGoalConsequences(move.name, entity, false);
                        entity.unsetTarget();
                    }
                } else {

                    var preArrangeEntity = [];

                    entityPosition = entity.position;

                    // Goal move for a game without dice(s)
                    preArrangeEntity.x = entityPosition.x;
                    preArrangeEntity.y = entityPosition.y;

                    self_Game.doVirtualMove(entityPosition.x, entityPosition.y,
                        move.preArrangeX, move.preArrangeY);

                    self_Game.executeGoalConsequences(move.name, entity, preArrangeEntity);

                    self_Game.undoVirtualMove();

                    // The target of a goal move is highlighted
                    // Therefore: Use the highlighted coordinates to ensure correct target coordinates
                    // Expect: There"s only one highlighted destination cell
                    move.targetX = self_Game.models.HighlightTable[0].x;
                    move.targetY = self_Game.models.HighlightTable[0].y;
                }
            } else {

                entityPosition = move.entity.position;

                self_Game.models.MoveTable.push({
                    entity: move.entity,
                    xPosition : move.targetX,
                    yPosition : move.targetY,
                    moveClass : move.moveClass,
                    moveID : move.ID
                });

                // Similiar to Entity.getMoves()
                // ToDo: MUST be refactored later!
                if (move.type === "DICE") {

                    //self_Game.showEntityMoves(move.entity.position.x, move.entity.position.y)

                    // Create jobs for this move
                    var tmpFieldExists = false, curFieldID,
                        destX = move.targetX, destY = move.targetY;

                    entity = move.entity;
                    entityPosition = entity.position;

                    // Backgammon specific: If an entity has got a fieldID then the
                    // entity is in the bear off area and must re-enter the game
                    if (_.isUndefined(entity.tmp.fieldID) === false) {

                        curFieldID = entity.tmp.fieldID;
                        tmpFieldExists = true;
                    } else {
                        curFieldID = entity.getWorld().getFieldID(entityPosition.x, entityPosition.y);
                    }

                    if (tmpFieldExists === true) {

                        self_Game.addJobForMoveID({
                            jobID : move.ID,
                            jobName : "Put the entity to the destination field",
                            job : "Place Entity",
                            jobArguments : { entity : entity,
                                xPosition : destX, yPosition : destY }
                        });

                        self_Game.addJobForMoveID({
                            jobID : move.ID,
                            jobName : "Remove the current entity from off board area",
                            job : "Delete Entity from OffBoard",
                            jobArguments : { entity : entity }
                        });

                    } else {

                        self_Game.addJobForMoveID({
                            jobID: move.ID,
                            jobName: "move game entity",
                            job: "Move Entity By Dice Value",
                            jobArguments: {
                                "entity": move.entity,
                                "destX": move.targetX,
                                "destY": move.targetY,
                                "diceValue" : move.diceValue
                            }
                        });
                    }

                    self_Game.addJobForMoveID({
                        jobID : move.ID,
                        jobName : "Delete Dice Value",
                        job : "Delete Dice Value",
                        jobArguments : move.diceID
                    });
                } else {

                    // Standard 2D Move
                    if (self_Game.models.gameMode !== "PLACING") {

                        self_Game.addJobForMoveID({
                            jobID: move.ID,
                            jobName: "move game entity",
                            job: "Move Entity",
                            jobArguments: {
                                "entity": move.entity,
                                "destX": move.targetX,
                                "destY": move.targetY
                            }
                        });
                    }
                }

                if (move.postMove) {

                    _.each(move.postMove, function(postMove) {

                        self_Game.addJobForMoveID({
                            jobID : move.ID,
                            jobName : postMove.jobName,
                            job : postMove.jobFunction,
                            jobArguments : postMove.jobArguments
                        });
                    });
                }
            }

            // Execute artificial move
            self_Game.loop(targetArea, move.targetX, move.targetY);

            // Unfortunately, the view / angularjs has to be notified about the model changes
            self_Game.refreshView();

            return true;
        };

        /**
         * Calls the artificial game players to perform a move
         * @returns {boolean}
         */
        self_Game.artificialTurn = function() {

            // Prepare the game for dice games
            if (self_Game.models.gameState === "WAITINGFORDICEROLL") {

                Spoooky.GameEvents.fireEvent({ job : "Roll Backgammon Dices" }, self_Game);

                // If the game state is the same after the fired event
                // then the meta agent can't move
                if (self_Game.models.gameState === "WAITINGFORDICEROLL") {

                    // Perform a pseudo loop
                    self_Game.pseudoLoop();
                    return false;
                }
            }

            // Execute an artificial move, determined by the AI module of the player
            self_Game.getCurrentPlayer().artificialMove();

            return true;
        };

        /**
         * Add game jobs
         * @param jobsToAdd
         * @returns {boolean}
         */
        self_Game.addJobs = function(jobsToAdd) {

            var currentJob, curJob, moveID;

            for (var i = 0; i < jobsToAdd.length; i++) {

                curJob = jobsToAdd[i];
                currentJob = {
                    jobID : self_Game.models.moveID,
                    jobName : curJob.jobName,
                    job : curJob.jobFunction,
                    jobArguments : curJob.jobArguments,
                    entityLink : jobsToAdd.entityLink
                };

                if (curJob.execute && curJob.execute === "immediately") {
                    Spoooky.GameEvents.fireEvent(currentJob, self_Game);
                } else {
                    self_Game.addJobForMoveID(currentJob);
                }
            }

            self_Game.models.moveID = 0;
            return true;
        };

        /**
         * Add a job for a specific move identifier
         * @param newJob
         * @returns {boolean}
         */
        self_Game.addJobForMoveID = function(newJob) {

            if (newJob.execute && newJob.execute === "immediately") {
                Spoooky.GameEvents.fireEvent(newJob, self_Game);
            } else {
                self_Game.jobQueue.addJob(newJob);
            }
            return true;
        };

        /**
         * Checks if the parameter coordinates are connected to a legal move
         * @param xPos
         * @param yPos
         * @returns {boolean}
         */
        self_Game.isMove = function(xPos, yPos) {

            // ToDo Refactor
            var moveTable = self_Game.models.MoveTable, move,
                moveCnt = moveTable.length;

            for (var counter = moveCnt; counter--;) {

                move = moveTable[counter];
                if (move.xPosition === xPos) {

                    if (move.yPosition === yPos) {

                        if (move.moveID !== 0) {
                            return true;
                        }
                    }
                }
            }

            return self_Game.isGoalMove(xPos, yPos);
        };

        /**
         * Checks if coordinates are connected with a goal move
         * @param xPos
         * @param yPos
         * @returns {boolean}
         */
        self_Game.isGoalMove = function(xPos, yPos) {

            // ToDo Refactor
            var goals = self_Game.models.GoalMoves, maxGoals = goals.length;

            for (var counter = maxGoals; counter--;) {

                if (goals[counter].xPosition === xPos &&
                    goals[counter].yPosition === yPos) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Get the move id of specific coordinates
         * @param xPos
         * @param yPos
         * @returns {*}
         */
        self_Game.getMoveID = function(xPos, yPos) {

            var entityMoves = self_Game.models.MoveTable,
                move;

            for (var counter = entityMoves.length; counter--;) {

                move = entityMoves[counter];
                if (move.xPosition === xPos && move.yPosition === yPos) {

                    if (move.moveID !== 0) {
                        return move.moveID;
                    }
                }
            }
            return false;
        };

        /**
         * Execute jobs for a move connected with coordinates
         * @param xPos
         * @param yPos
         */
        self_Game.executeJobsForThisMove = function(xPos, yPos) {

            self_Game.executeJobsForMoveID(self_Game.getMoveID(xPos, yPos));
            self_Game.setRecentlyMovedEntity(xPos, yPos);
        };

        /**
         * Executes associated jobs for the recent move
         */
        self_Game.executeJobsForRecentMove = function() {

            self_Game.resetMoves();
            self_Game.executeJobsForMoveID(self_Game.getLastMoveID());
        };

        /**
         * Executes associated jobs for a unique move identifier
         * @param moveID
         */
        self_Game.executeJobsForMoveID = function(moveID) {

            var jobs = self_Game.jobQueue.getJobsWithMoveID(moveID);

            for (var jobCounter = 0; jobCounter < jobs.length; jobCounter += 1) {
                Spoooky.GameEvents.fireEvent(jobs[jobCounter], self_Game);
            }

            // Clean up
            self_Game.jobQueue.flush();
            self_Game.models.moveID = 0;
        };

        /**
         *
         * @param xCoordinate
         * @param yCoordinate
         * @return {*}
         */
        self_Game.getEntityAtCell = function(xCoordinate, yCoordinate) {
            return self_Game.gameWorld.peekCell(xCoordinate, yCoordinate);
        };

        /**
         * Searches for an entity with a specific name
         * @param entityName
         * @returns {*}
         */
        self_Game.getEntityWithName = function(entityName) {

            var players = self_Game.getPlayers(),
                returnEntity;

            for (var counter = players.length; counter--;) {

                returnEntity = players[counter].getEntityWithName(entityName);
                if (returnEntity !== false ) {
                    return returnEntity;
                }
            }
            return false;
        };

        /**
         * Put an entity to the destination cell
         * @param newEntity
         * @param x
         * @param y
         */
        self_Game.pushEntityToCell = function (newEntity, x, y) {

            newEntity.setPosition(x, y);
            self_Game.gameWorld.pushToCell({
                entityID : newEntity.ID,
                playerID : newEntity.getMetaPlayerID(),
                typeID : newEntity.getTypeID()
            }, x, y);
        };

        /**
         * Finds an entity of the current player which can help entities with type entityTypeToProtect
         * @param entityTypeToProtect
         * @returns {boolean}
         */
        self_Game.identifyProtectingEntities = function(entityTypeToProtect) {

            var currentPlayer = self_Game.getCurrentPlayer(),
                currentEntity, cnt, currentMove,
                returnValue = false, entityMoves, captureMoves, curX, curY;

            // Check for opponent threats
            // For each entity of the current player: virtually check every normal move and capture move
            // and verify if entities with type entityTypeToProtect is / are in next round in check
            for (var counter = currentPlayer.countEntities(); counter--;) {

                currentEntity = currentPlayer.getEntityFromArray(counter);

                // Check the moves of the current entity
                // If the current entity is able to move or can capture an opponent entity
                entityMoves = currentEntity.getMoves();
                captureMoves = currentEntity.getGoalMoves();
                self_Game.performPostMoveChecks(currentEntity, entityMoves);
                self_Game.performPostMoveChecks(currentEntity, captureMoves);

                curX = currentEntity.position.x;
                curY = currentEntity.position.y;

                for (cnt = entityMoves.length; cnt--;) {

                    currentMove = entityMoves[cnt];

                    // Perform virtual move
                    self_Game.doVirtualMove(curX, curY, currentMove.targetX, currentMove.targetY);

                    if (!self_Game.entityOfTypeIsUnderAttack(entityTypeToProtect,
                            currentEntity.getAssociatedPlayer())) {

                        // Add entity to the list of movable entities
                        self_Game.models.MovableEntities.push(currentEntity);

                        self_Game.highlightEntityAtPosition(curX, curY);
                        returnValue = true;
                    }
                    self_Game.undoVirtualMove();
                }

                for (cnt = captureMoves.length; cnt--;) {

                    currentMove = captureMoves[cnt];

                    // Perform virtual move
                    self_Game.doVirtualMove(curX, curY, currentMove.targetX, currentMove.targetY);

                    if (!self_Game.entityOfTypeIsUnderAttack(entityTypeToProtect,
                            currentEntity.getAssociatedPlayer())) {

                        // Add entity to the list of movable entities
                        self_Game.models.MovableEntities.push(currentEntity);

                        self_Game.highlightEntityAtPosition(curX, curX);
                        returnValue = true;
                    }
                    self_Game.undoVirtualMove();
                }
            }

            return returnValue;
        };

        /**
         * Check if currentEntity can be hit by an opponent entity at coordinate x|y
         * @param destinationX
         * @param destinationY
         * @param currentEntity
         * @returns {boolean}
         */
        self_Game.opponentEntityCanCaptureAt = function(destinationX, destinationY, currentEntity) {

            var opponentPlayer = currentEntity.getAssociatedPlayer().getNextOpponentPlayer(),
                captureMoves,
                cptCounter;

            self_Game.doVirtualMove(currentEntity.position.x, currentEntity.position.y,
                destinationX, destinationY);

            // Execute Entity Goals for Every Opponent Entity - this builds up the capture move table
            for (var counter = opponentPlayer.countEntities(); counter--;) {

                captureMoves = opponentPlayer.getEntityFromArray(counter).getGoalMoves();

                for (cptCounter = captureMoves.length; cptCounter--;) {

                    if (captureMoves[cptCounter].type === "CAPTURE" &&
                        destinationX === captureMoves[cptCounter].targetX &&
                        destinationY === captureMoves[cptCounter].targetY) {

                        self_Game.undoVirtualMove();
                        // Opponent entity can capture at position(destinationX,destinationY)
                        return true;
                    }
                }
            }
            // No opponent entity can capture at destination coordinates
            self_Game.models.GoalMoves.length = 0;
            self_Game.undoVirtualMove();
            return false;
        };

        /**
         * Connect actions of the entities with consequences for the game
         * @param goalConsequences
         */
        self_Game.connectEntityActionsConsequences = function(goalConsequences) {

            var _goalName = goalConsequences.goalName,
                _conseq = goalConsequences.consequences,
                _agName = "",
                _agType = "";

            if (goalConsequences.entityName) {
                _agName = goalConsequences.entityName;
            }

            if (goalConsequences.entityType) {
                _agType = goalConsequences.entityType;
            }

            self_Game.models.EntityGoalConsequences.push({
                goalName    : _goalName,
                entityName   : _agName,
                entityType	: _agType,
                consequences: _conseq
            });
        };

        /**
         * Connect all consequences for templates / blueprints
         * @param playerConsequences
         */
        self_Game.connectConsequences = function(playerConsequences) {

            var keys = _.keys(playerConsequences),
                len = keys.length;

            for (var i = 0; i < len; ++i) {
                self_Game.connectEntityActionsConsequences(playerConsequences[keys[i]]);
            }
        };

        /**
         * Retrieve goal consequences with a specific name
         * @param goalName
         * @param currentEntity
         * @returns {Array}
         */
        self_Game.getGoalConsequencesWithName = function(goalName, currentEntity) {

            var consequencesWithGoalName = [],
                entityGoalConsequences = self_Game.models.EntityGoalConsequences,
                current;

            for (var arIndex = entityGoalConsequences.length; arIndex--;) {

                current = self_Game.models.EntityGoalConsequences[arIndex];

                if (current.goalName === goalName) {

                    if (current.entityName === currentEntity.getName() ) {

                        current.consequences.entityLink = currentEntity;
                        consequencesWithGoalName.push(current);

                    } else if (current.entityType === currentEntity.type ) {

                        current.entityName = currentEntity.getName();
                        current.consequences.entityLink = currentEntity;
                        consequencesWithGoalName.push(current);
                    }
                }
            }
            return consequencesWithGoalName;
        };

        /**
         * Execute consequences associated with a goal
         * @param goalName
         * @param currentEntity
         * @param preArrangeEntity
         */
        self_Game.executeGoalConsequences = function(goalName, currentEntity, preArrangeEntity) {

            var consequences = self_Game.getGoalConsequencesWithName(goalName, currentEntity),
                currentPosition = currentEntity.position, moveID;

            if (self_Game.models.moveID === 0) {

                moveID = self_Game.getUniqueMoveID(currentEntity.name, goalName,
                    currentPosition.x, currentPosition.y);
            } else {
                moveID = self_Game.models.moveID;
            }

            self_Game.setMoveID(moveID);

            // If entity must be moved / prearranged first
            if (preArrangeEntity) {

                self_Game.addJobForMoveID({
                    jobID: self_Game.models.moveID,
                    jobName: "move game entity",
                    job: "Prearrange Entity",
                    jobArguments : {
                        "entity" : currentEntity,
                        "destX" : currentPosition.x,
                        "destY" : currentPosition.y
                    }
                });
            }

            for (var i = 0; i < consequences.length; i++) {
                self_Game.addJobs(consequences[i].consequences);
            }
        };

        /**
         * Translates the game board coordinates (x|y) into descriptive coordinates (a1)
         * @param xCoord
         * @param yCoord
         * @returns {string}
         */
        self_Game.translateCoordinates = function(xCoord, yCoord) {
            return (String.fromCharCode(parseInt((97+xCoord) , 10))) + (self_Game.gameWorld.getRows() - yCoord);
        };

        /**
         * Create the game board from configuration
         * @param {Array} gameBoardConfiguration the game board description
         */
        self_Game.addEntitiesToGameBoard = function(gameBoardConfiguration) {

            //  Create Entities for players and put them on the game board
            var counter = 0,
                metaAgent,
                newEntity = null, gbConfig,
                gridRows = self_Game.gameWorld.getRows(),
                gridColumns = self_Game.gameWorld.getColumns();

            for (var y = 0; y < gridRows; y += 1) {
                for (var x = 0; x < gridColumns; x += 1) {

                    gbConfig = gameBoardConfiguration[counter];
                    if (gbConfig !== 0) {

                        metaAgent = self_Game.getPlayerWithID(gbConfig.associatedWithMetaAgent);
                        newEntity = metaAgent.entityFactory(gbConfig);
                        self_Game.pushEntityToCell(newEntity, x, y);
                    }
                    counter += 1;
                }
            }
        };

        /**
         * Adds a number of (quantity) entities to the game and the associated players
         * @param bluePrint
         * @param quantity - optional paremeter
         */
        self_Game.addEntityToGame = function(bluePrint, quantity) {

            //  Create Entities for players
            var metaAgent = self_Game.getPlayerWithID(bluePrint.associatedWithMetaAgent);

            if (quantity) {
                for (var counter = 0; counter < quantity; counter++) {
                    metaAgent.entityFactory(bluePrint);
                }
            } else {
                bluePrint.unlimitedQuantity = true;
                metaAgent.entityFactory(bluePrint);
            }
        };

        /**
         * Returns true if a specific entity or type of entity of the current player can be captured
         * @param entityTypeName
         * @param player
         * @returns {boolean}
         */
        self_Game.entityOfTypeIsUnderAttack = function(entityTypeName, player) {

            // Get entities to protect
            var entitiesToProtect = player.getEntitiesOfType(entityTypeName),
                max = entitiesToProtect.length;

            for (var counter = max; counter--;) {
                if (entitiesToProtect[counter].canBeCaptured()) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns true if a specific entity or type of entity of the current player can be captured
         * @param entityType
         * @returns {boolean}
         */
        self_Game.entityOfSpecificTypeIsUnderAttack = function(entityType) {

            var metaAgent = self_Game.getPlayerWithID(entityType.associatedWithMetaAgent);

            // Stop processing if there aren't any entities, associated to player
            if (metaAgent.countEntities() === 0) { return false; }

            var entitiesOfType = metaAgent.getEntitiesOfType(entityType.entityType);

            // Stop processing if there aren"t any entities of specific type
            if (entitiesOfType.length === 0) { return false; }

            var max = entitiesOfType.length;

            // Check if an entity of a specific type is under attack
            for (var counter = max; counter--;) {

                // Execute opponent Entity Goals for destination coordinates
                if (entitiesOfType[counter].canBeCaptured() === true) { return true; }
            }
            return false;
        }
    };

    /**
     * Controller for Spoooky.Models.DiceBox
     * @class
     */
    Spoooky.DiceBox = function(game) {

        var self_DiceBox = this;
        var myGame = game;

        /**
         * Enable the dice box
         */
        self_DiceBox.enable = function() {
            myGame.models.DiceBox.isEnabled = true;
        };

        /**
         * Get the activation state of the dice box
         * @returns {boolean|Function}
         */
        self_DiceBox.isEnabled = function() {
            return myGame.models.DiceBox.isEnabled;
        };

        /**
         * Create a new Dice in the dice box
         */
        self_DiceBox.createDice = function(rangeStart, rangeEnd) {
            myGame.models.DiceBox.dices.push({
                start : rangeStart,
                end : rangeEnd });
        };

        /**
         * Count dices in dice box
         * @returns {Number} Number of Dices in Dice Box
         */
        self_DiceBox.countDices = function() {
            return myGame.models.DiceBox.dices.length;
        };

        /**
         * Get a dice from the dice box array
         * @param diceID
         * @returns {*}
         */
        self_DiceBox.getDice = function(diceID) {

            if (diceID >= 0 && diceID < self_DiceBox.countDices()) {
                return myGame.models.DiceBox.dices[diceID];
            }
            return false;
        };

        /**
         * Roll a dice
         *
         * @param diceID {Number} ID of the dice which will be rolled
         * @returns {Number} Random value of rolled dice
         */
        self_DiceBox.rollDice = function(diceID) {

            if (self_DiceBox.getDice(diceID) !== false) {
                return parseInt(_.random(self_DiceBox.getDice(diceID).start,
                    self_DiceBox.getDice(diceID).end), 10);
            }
            return false;
        };

        /**
         * Rolls all dices in dice box
         *
         * @returns {Object} Array of random values
         */
        self_DiceBox.rollAllDices = function() {

            var returnValues = [];

            for (var counter = self_DiceBox.countDices(); counter--;) {
                returnValues.push(self_DiceBox.rollDice(counter));
            }

            myGame.models.DiceBox.diceValues = returnValues;
            return returnValues;
        };

        /**
         * Get associated move id for a dice identifier
         * @param diceID
         * @returns {*}
         */
        self_DiceBox.getMoveIDForDiceID = function(diceID) {

            var db = myGame.models.DiceBox;

            for (var counter = db.attachedMoveIDs.length; counter--;) {
                if (db.attachedMoveIDs[counter].diceValueID === diceID) {
                    return db.attachedMoveIDs[counter].moveID;
                }
            }
            return false;
        };

        /**
         * Connect move identifier with dice value
         * @param setMoveID
         * @param setDiceValueID
         * @param setTarget
         */
        self_DiceBox.connectMoveIDWithDiceValue = function(setMoveID, setDiceValueID, setTarget) {

            myGame.models.DiceBox.attachedMoveIDs.push({
                diceValueID : setDiceValueID,
                moveID : setMoveID,
                target : setTarget });
        };

        /**
         * Get dice value connected with move identifier
         * @param moveID
         * @returns {*}
         */
        self_DiceBox.getConnectedDiceValue = function(moveID) {

            var db = myGame.models.DiceBox;
            for (var counter = db.attachedMoveIDs.length; counter--;) {

                if (db.attachedMoveIDs[counter].moveID === moveID) {
                    return db.attachedMoveIDs[counter];
                }
            }
            return false;
        };

        /**
         * Reset all attached move identifiers
         */
        self_DiceBox.flushAttachedMoveIDs = function() {
            myGame.models.DiceBox.attachedMoveIDs.length = 0;
        };

        /**
         * Returns diced values
         * @returns {Object} Values of dices
         */
        self_DiceBox.getDiceValues = function() {
            return myGame.models.DiceBox.diceValues;
        };

        /**
         * Check for empty dice box
         * @returns {boolean}
         */
        self_DiceBox.gotNoDiceValues = function() {
            return (!myGame.models.DiceBox.diceValues[0]);
        };

        /**
         * Deletes a dice value from array diceValues
         * @param {Number} indexOfValue Index of dice value which will be deleted
         */
        self_DiceBox.deleteDiceValue = function(indexOfValue) {
            myGame.models.DiceBox.diceValues.splice(indexOfValue, 1);
        };

        /**
         * Deletes all dice values
         */
        self_DiceBox.deleteAllDiceValues = function() {
            //myGame.models.DiceBox.diceValues = [];
            myGame.models.DiceBox.diceValues.length = 0;
        };
    };

    /**
     * GridWelt
     * Controller for Spoooky.Models.GameGrid
     * @constructor
     */
    Spoooky.GridWelt = function(game) {

        var self_GridWelt = this;
        var myGame = game;

        /**
         * Get the number of rows of the game world
         * @returns {number|SQLResultSetRowList|Number|HTMLCollection|string|*}
         */
        self_GridWelt.getRows = function() {
            return game.models.worldDimensions.rows;
        };

        /**
         * * Get the number of columns of the game world
         * @returns {number|*}
         */
        self_GridWelt.getColumns = function() {
            return game.models.worldDimensions.columns;
        };

        /**
         * Get the visual representation of a grid cell
         * @param cellX
         * @param cellY
         * @returns {*|AbstractView}
         */
        self_GridWelt.getView = function(cellX, cellY) {
            if (self_GridWelt.isValidCoordinate(cellX, cellY)) {
                return myGame.models.GameGrid[cellY][cellX].view;
            }
            return false;
        };

        /**
         * Setup the game world
         * @returns {boolean}
         */
        self_GridWelt.setup = function() {

            if (game.models.worldDimensions.fieldsX > 0 &&
                game.models.worldDimensions.fieldsY > 0) {
                self_GridWelt.init2DGrid();
                return true;
            } else {
                console.log("Invalid Size of GridWelt");
            }
            return false;
        };

        /**
         * Sets up a two-dimensional game world
         * @param gridColumns
         * @param gridRows
         * @returns {boolean}
         */
        self_GridWelt.setup2D = function(gridColumns, gridRows) {

            game.models.worldDimensions.rows = gridRows;
            game.models.worldDimensions.columns = gridColumns;
            self_GridWelt.init2DGrid();
            return true;
        };

        /**
         * Sets up the view of the grid cells
         * @param gameBoardArray
         */
        self_GridWelt.setupGameBoard = function(gameBoardArray) {

            var counter = 0,
                maxX = self_GridWelt.getRows(),
                maxY = self_GridWelt.getColumns(),
                x;

            for (var y = 0; y < maxX; y += 1) {
                for (x = 0; x < maxY; x += 1) {

                    self_GridWelt.setCellBaseClass(x, y, gameBoardArray[counter]);
                    counter += 1;
                }
            }
        };

        /**
         * Sets the view of a grid cell
         * @param cellX
         * @param cellY
         * @param curCellClass
         */
        self_GridWelt.setCellClass = function(cellX, cellY, curCellClass) {
            self_GridWelt.getView(cellX, cellY).cellClass = curCellClass;
        };

        /**
         * Sets the base class of a grid cell
         * @param cellX
         * @param cellY
         * @param curCellClass
         */
        self_GridWelt.setCellBaseClass = function(cellX, cellY, curCellClass) {
            self_GridWelt.getView(cellX, cellY).baseClass = curCellClass;
        };

        /**
         * Initializes the internal representation (model) of the two-dimensional game world
         * @returns {boolean}
         */
        self_GridWelt.init2DGrid = function() {

            var curRow,
                curColumn,
                gridRow,
                rowCount,
                columnCount;

            rowCount = self_GridWelt.getRows();
            columnCount = self_GridWelt.getColumns();

            for (curRow = 0 ; curRow < rowCount; curRow += 1) {
                gridRow = [];

                for (curColumn = 0 ; curColumn < columnCount; curColumn += 1) {

                    // Create a new grid cell
                    // (previously realized through class Spoooky.GridCell)
                    gridRow.push({
                        // ID of the cell, used i.e. in backgammon
                        cellID : null,
                        // Holds the content of the cell (entities)
                        contains : [],
                        view : {
                            baseClass : "",
                            cellClass : ""
                        },
                        position : {
                            x : curColumn,
                            y : curRow
                        }
                    });
                }
                myGame.models.GameGrid.push(gridRow);
            }
            return true;
        };

        /**
         * Sets the IDs of fields. Allows grouping of fields
         * @param fieldIDArray
         * @returns {boolean}
         */
        self_GridWelt.setFieldIDs = function(fieldIDArray) {

            var curX,
                curY,
                counter = 0,
                maxColumn = self_GridWelt.getColumns(),
                maxRow = self_GridWelt.getRows();

            for (curY = 0; curY < maxRow; curY += 1) {

                for (curX = 0; curX < maxColumn; curX += 1) {
                    myGame.models.GameGrid[curY][curX].cellID = fieldIDArray[counter];
                    counter += 1;
                }
            }
            return true;
        };

        /**
         * Get a cell identifier
         * @param xPosition
         * @param yPosition
         * @returns {*}
         */
        self_GridWelt.getFieldID = function(xPosition, yPosition) {
            if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {
                return myGame.models.GameGrid[yPosition][xPosition].cellID;
            }
            return false;
        };

        /**
         * Create a string signature for the current game board state
         * @returns {string}
         */
        self_GridWelt.createBoardSignature = function() {

            var gameGrid = myGame.models.GameGrid,
                maxCols = myGame.gameWorld.getColumns(),
                signature = "",
                oneD = _.flatten(gameGrid),
                count = oneD.length,
                current, i;

            for (i = 0; i < count; i++) {

                current = oneD[i].contains;

                if (current.length === 0) {
                    signature += "0";
                } else {
                    // Pick the last entity on the stack
                    signature += _.last(current).typeID;
                }

                if ((i+1) % maxCols === 0 && (i+1) !== count) {
                    signature += "|";
                }

            }

            var offBoard = myGame.models.OffBoardContent;
            if (offBoard.length > 0) {
                signature += "|";
                for (i = offBoard.length; i--;) {
                    signature += offBoard[i].typeID;
                }
            }

            return signature;
        };

        /**
         * Creates the board signature by vertical coordinates
         * Used in games like gomoku to check vertical count of game entities
         * @returns {string}
         */
        self_GridWelt.createBoardSignatureByVertical = function() {

            var maxRows = self_GridWelt.getRows(),
                maxColumns = self_GridWelt.getColumns(),
                grid = myGame.models.GameGrid,
                current, x, y, signature = "";

            for (x = 0; x < maxColumns; x++) {

                for (y = 0; y < maxRows; y++) {

                    current = grid[y][x].contains;

                    if (current.length === 0) {
                        signature += "0";
                    } else {
                        // Pick the last entity on the stack
                        signature += _.last(current).typeID;
                    }
                }

                if ((x+1) !== maxColumns) {
                    signature += "|";
                }
            }

            // No off board area regarded
            return signature;
        };

        /**
         * Push a link to an entity to a grid cell
         * @param entity
         * @param xPosition
         * @param yPosition
         * @returns {boolean}
         */
        self_GridWelt.pushToCell = function(entity, xPosition, yPosition) {

            if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {
                myGame.models.GameGrid[yPosition][xPosition].contains.push(entity);
                return true;
            }
            return false;
        };

        /**
         * Retrieve an entity from a grid cell
         * @param xPosition
         * @param yPosition
         * @returns {*}
         */
        self_GridWelt.popFromCell = function(xPosition, yPosition) {

            if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {

                var entityLink = myGame.models.GameGrid[yPosition][xPosition].contains.pop();

                if (entityLink) {
                    return myGame.getPlayerWithID(entityLink.playerID).getEntityWithID(entityLink.entityID);
                }
            }
            return false;
        };

        /**
         * Delete cell content
         * @param xPosition
         * @param yPosition
         * @returns {boolean}
         */
        self_GridWelt.deleteCellContent = function(xPosition, yPosition) {

            if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {

                var currentEntity = self_GridWelt.popFromCell(xPosition, yPosition);
                // Befindet sich ein Entity auf der Spielzelle, so muss auch der Entity gelÃ¶scht werden
                if (currentEntity && currentEntity !== 0) {
                    currentEntity.seppuku();
                    return true;
                }
            }
            return false;
        };

        /**
         * Retrieve cell content
         * @param xPosition
         * @param yPosition
         * @returns {*}
         */
        self_GridWelt.peekCell = function(xPosition, yPosition) {

            if (self_GridWelt.isValidCoordinate(xPosition, yPosition )) {

                var cellContent = myGame.models.GameGrid[yPosition][xPosition].contains;

                if (cellContent.length !== 0) {
                    // Pick the last entity on stack
                    cellContent = _.last(cellContent);
                    return myGame.getPlayerWithID(cellContent.playerID).getEntityWithID(cellContent.entityID);
                } else {
                    // Field is empty
                    return false;
                }
            }
            // Invalid coordinate
            return false;
        };

        /**
         * Is xPosition|yPosition a valid field on the game board?
         * @param xPosition
         * @param yPosition
         * @returns {boolean}
         */
        self_GridWelt.isValidCoordinate = function(xPosition, yPosition) {

            var parsedX = parseInt(xPosition, 10), parsedY;

            if (parsedX < self_GridWelt.getColumns() && parsedX >= 0) {
                parsedY = parseInt(yPosition, 10);
                if (parsedY >= 0 && parsedY < self_GridWelt.getRows()) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Checks for an empty cell on the game board
         * @param xPosition
         * @param yPosition
         * @returns {boolean}
         */
        self_GridWelt.isEmpty = function(xPosition, yPosition) {
            return (self_GridWelt.peekCell(xPosition, yPosition) === false);
        };

        /**
         * Move an entity to a grid cell
         * @param srcX
         * @param srcY
         * @param destX
         * @param destY
         * @param entityToMove
         * @returns {boolean}
         */
        self_GridWelt.moveEntity = function(srcX, srcY, destX, destY, entityToMove) {

            if (_.isUndefined(destX) || _.isUndefined(destY)) { return false; }
            if (self_GridWelt.isValidCoordinate(destX, destY) === false) { return false; }

            var destinationCellContent = myGame.models.GameGrid[destY][destX].contains,
                srcEntity = self_GridWelt.popFromCell(srcX, srcY);

            // If entityToMove exists
            if (_.isUndefined(entityToMove) === false) {
                entityToMove.setPosition(destX, destY);
                destinationCellContent.push({
                    entityID : entityToMove.ID,
                    playerID : entityToMove.getMetaPlayerID(),
                    typeID : entityToMove.getTypeID()
                });
            } else if (srcEntity) {
                // Notify source entity about move
                srcEntity.setPosition(destX, destY);
                destinationCellContent.push({
                    entityID : srcEntity.ID,
                    playerID : srcEntity.getMetaPlayerID(),
                    typeID : srcEntity.getTypeID()
                });
            } else {
                return false;
            }
            return true;
        };

        /**
         * Retrieve the coordinates of all free fields of the game board
         * @returns {Array}
         */
        self_GridWelt.getFreeCells = function() {

            var freeFields = [],
                maxCol = self_GridWelt.getColumns(),
                maxRow = self_GridWelt.getRows(),
                grid = myGame.models.GameGrid,
                currentCell, curRow;

            for (var curColumn = maxCol; curColumn--;) {
                for (curRow = maxRow; curRow--;) {

                    currentCell = grid[curRow][curColumn];
                    if (currentCell.contains.length === 0) {
                        // Found free field
                        freeFields.push({ x : curColumn, y : curRow });
                    }
                }
            }
            return freeFields;
        };

        /**
         * Get free fields with specific field identifier
         * @param fieldID
         * @returns {Array}
         */
        self_GridWelt.getFreeFieldsWithFieldID = function(fieldID) {

            var listOfFreeFields = [],
                maxCol = self_GridWelt.getColumns(),
                maxRow = self_GridWelt.getRows(),
                grid = myGame.models.GameGrid,
                curRow, currentCell;

            for (var curColumn = maxCol; curColumn--;) {
                for (curRow = maxRow; curRow--;) {

                    currentCell = grid[curRow][curColumn];
                    if (currentCell.contains.length === 0 && currentCell.cellID === fieldID) {
                        listOfFreeFields.push([curColumn, curRow]);
                    }
                }
            }
            listOfFreeFields.reverse();
            return listOfFreeFields;
        };

        /**
         * Get all fields with a specific field identifier
         * @param fieldID
         * @returns {Array}
         */
        self_GridWelt.getFieldsWithFieldID = function(fieldID) {

            var listOfFields = [],
                maxCol = self_GridWelt.getColumns(),
                maxRow = self_GridWelt.getRows(),
                grid = myGame.models.GameGrid,
                currentCell, curColumn, curRow;

            for (curColumn = maxCol; curColumn--;) {
                for (curRow = maxRow; curRow--;) {

                    currentCell = grid[curRow][curColumn];
                    if (currentCell.cellID === fieldID) {
                        listOfFields.push(currentCell);
                    }
                }
            }
            listOfFields.reverse();
            return listOfFields;
        };

        /**
         * Get the content of fields with specific field identifier
         * @param fieldID
         * @returns {Array}
         */
        self_GridWelt.getContentOfFieldsWithFieldID = function(fieldID) {

            var listOfFields = [],
                maxCol = self_GridWelt.getColumns(),
                maxRow = self_GridWelt.getRows(),
                grid = myGame.models.GameGrid,
                currentCell, curColumn, curRow, content;

            for (curColumn = maxCol; curColumn--;) {
                for (curRow = maxRow; curRow--;) {

                    currentCell = grid[curRow][curColumn];
                    if (currentCell.cellID === fieldID) {

                        content = self_GridWelt.peekCell(curColumn, curRow);
                        if (content) {
                            listOfFields.push(content);
                        }
                    }
                }
            }
            listOfFields.reverse();
            return listOfFields;
        };

        /**
         * Count adjacent fields to the north of the entity
         * @param currentEntity
         * @returns {number}
         */
        self_GridWelt.countNeighboursNorth = function(currentEntity) {

            var entityX = currentEntity.position.x,
                entityY = currentEntity.position.y,
                entityFieldID = myGame.models.GameGrid[entityY][entityX].cellID,
                currentPlayerID = currentEntity.getAssociatedPlayer(),
                neighbourCount = 0,
                peekNorth = self_GridWelt.peekCell(entityX, parseInt(entityY-1, 10)),
                grid = myGame.models.GameGrid;

            if (peekNorth !== false) {

                if (grid[parseInt(entityY-1, 10)][entityX].cellID === entityFieldID) {
                    if (peekNorth.getAssociatedPlayer() === currentPlayerID) {
                        neighbourCount += 1;
                    }
                }
            }
            return neighbourCount;
        };

        /**
         * Count adjacent fields to the south of the entity
         * @param currentEntity
         * @returns {*}
         */
        self_GridWelt.countNeighboursSouth = function(currentEntity) {

            var entityX = currentEntity.position.x,
                entityY = currentEntity.position.y,
                grid = myGame.models.GameGrid;

            if (self_GridWelt.isValidCoordinate(entityX, entityY) === false) {
                return false;
            }

            var entityFieldID = null,
                currentPlayerID = currentEntity.getAssociatedPlayer(),
                neighbourCount = 0,
                peekSouth = self_GridWelt.peekCell(entityX, parseInt(entityY+1, 10));

            if (grid[entityY][entityX]) {
                entityFieldID = grid[entityY][entityX].cellID;
            }

            if (peekSouth !== false) {

                if (grid[parseInt(entityY+1, 10)][entityX].cellID === entityFieldID) {
                    if (peekSouth.getAssociatedPlayer() === currentPlayerID) {
                        neighbourCount += 1;
                    }
                }
            }
            return neighbourCount;
        };

        /**
         * Count neighbour entities on the y-axis
         * @param currentEntity
         * @returns {number}
         */
        self_GridWelt.countNeighboursY = function(currentEntity) {
            return self_GridWelt.countNeighboursNorth(currentEntity) + self_GridWelt.countNeighboursSouth(currentEntity);
        }
    };

    /**
     * OffBoard
     * Controller for Spoooky.Models.OffBoardContent
     * @constructor
     */
    Spoooky.OffBoard = function(game) {

        var self_OffBoard = this, myGame = game;

        /**
         * Adds an entity to the off board area
         * @param entityToAdd
         */
        self_OffBoard.addEntity = function(entityToAdd) {
            myGame.models.OffBoardContent.push({
                typeID : entityToAdd.typeID,
                entityID : entityToAdd.ID,
                entityName : entityToAdd.getName(),
                playerID : entityToAdd.getMetaPlayerID() });
        };

        /**
         * Deletes an entity from the off board area
         * @param index
         */
        self_OffBoard.deleteEntity = function(index) {
            myGame.models.OffBoardContent.splice(index, 1);
        };

        /**
         * Deletes an entity with a specific name from the off board area
         * @param entityName
         * @returns {boolean}
         */
        self_OffBoard.deleteEntityFromOffBoard = function(entityName) {

            var entityCount = myGame.models.OffBoardContent.length;

            for (var counter = entityCount; counter--;) {

                if (myGame.models.OffBoardContent[counter].entityName === entityName) {

                    self_OffBoard.deleteEntity(counter);
                    return true;
                }
            }
            return false;
        };

        /**
         * checks if a specific player"s got entities in the off board area
         * @param playerID
         * @returns {boolean}
         */
        self_OffBoard.entitiesOfPlayerAreOutside = function(playerID) {

            var entitiesMax = myGame.models.OffBoardContent.length;

            for (var counter = entitiesMax; counter--;) {

                if (myGame.models.OffBoardContent[counter].playerID === playerID) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Returns all entities in the off board area
         * @returns {Array}
         */
        self_OffBoard.getAllEntities = function() {
            return myGame.models.OffBoardContent;
        };

        /**
         * Find and return the first entity with player id in off board area
         * @param playerID
         * @returns {*}
         */
        self_OffBoard.getEntityWithPlayerID = function(playerID) {

            var entityCount = myGame.models.OffBoardContent.length;

            for (var counter = entityCount; counter--;) {

                if (myGame.models.OffBoardContent[counter].playerID === playerID) {

                    var offEntity = myGame.models.OffBoardContent[counter];
                    return myGame.getPlayerWithID(offEntity.playerID).getEntityWithID(offEntity.entityID);
                }
            }
            return false;
        };

        /**
         * Find and return all entities in off board area with associated player id
         * @param playerID
         * @returns {Array}
         */
        self_OffBoard.getEntitiesWithPlayerID = function(playerID) {

            var returnEntities = [], curEntity,
                offBoardContent = myGame.models.OffBoardContent;

            for (var i = 0; i < offBoardContent.length; i++) {

                curEntity = offBoardContent[i];

                if (curEntity.playerID === playerID) {
                    returnEntities.push(myGame.getPlayerWithID(curEntity.playerID).
                        getEntityWithID(curEntity.entityID));
                }
            }
            return returnEntities;
        }
    };

    /**
     * GameEvents: Executes predefined game events / delegates game events to the game
     * @constructor
     */
    Spoooky.GameEvents = {

        /**
         * List of executable game events
         */
        events : {
            "Roll Dices" : function(gameEvent, game) {
                game.getDiceBox().rollAllDices();
            },

            "Roll Backgammon Dices" : function(gameEvent, game) {

                var previousValue = -1, diceValues,
                    sameValues = true, diceBox = game.getDiceBox();

                game.setGameState("INGAME");

                diceBox.rollAllDices();
                diceValues = diceBox.getDiceValues();

                // Check doublets
                _.each(diceValues, function(curValue) {
                    if (previousValue !== -1) {
                        if (previousValue !== curValue) {
                            sameValues = false;
                        }
                    }
                    previousValue = curValue;
                });

                if (sameValues === true) {
                    diceValues.push(diceValues[0]);
                    diceValues.push(diceValues[0]);
                }

                // Testcase for debugging
                /*
                if (game.models.moveCounter === 0) {

                    diceBox.deleteAllDiceValues();
                    //diceValues.push(8);
                    diceValues.push(5);

                    console.log("FIRST ROUND", game.models.moveCounter);
                }
                */
                game.executeGameRules();
            },

            "Delete Dice Value" : function(gameEvent, game) {
                game.getDiceBox().deleteDiceValue(gameEvent.jobArguments);
            },

            // Deletes the dice value of the specific move
            "Delete Assigned Dice Value" : function(gameEvent, game) {

                if (game.getDiceBox().getConnectedDiceValue(gameEvent.jobID) === false) {
                    return false;
                }
                game.getDiceBox().deleteDiceValue(game.getDiceBox().getConnectedDiceValue(gameEvent.jobID).diceValueID);
                return true;
            },

            "Bear Off Entity At Dice Target Cell" : function(gameEvent, game) {

                // Move Destination Entity to Off Board Area
                var connectedMove = game.getDiceBox().getConnectedDiceValue(gameEvent.jobID);

                if (connectedMove === false) {
                    return false;
                }

                var offX = connectedMove.target.x,
                    offY = connectedMove.target.y,
                    offEntity = game.gameWorld.peekCell(offX, offY);

                if (offEntity === false) {
                    return false;
                }

                if (_.isUndefined(offEntity) || offEntity === null) { return false; }

                // Virtually reset entity's position
                offEntity.setPosition(null, null);

                // Set the entity to a temporary field
                if (game.getCurrentPlayerID() === 0) {
                    offEntity.tmp.fieldID = 25;
                } else if (game.getCurrentPlayerID() === 1) {
                    offEntity.tmp.fieldID = 0;
                }

                // Move the captured entity from the board and put it in the off board area
                game.offBoard.addEntity(offEntity);
                game.gameWorld.popFromCell(offX, offY);

                return true;
            },

            "Show Backgammon Re-entering Moves" : function(gameEvent, game) {

                var playerID = gameEvent.jobArguments.playerID;

                if (playerID === game.getCurrentPlayerID()) {

                    var currentEntity = game.offBoard.getEntityWithPlayerID(playerID),
                        movePossible = false;

                    currentEntity.setPosition(-1, -1);

                    // Set the entity to a temporary field
                    if (playerID === 0) {
                        currentEntity.tmp.fieldID = 0;
                    } else if (playerID === 1) {
                        currentEntity.tmp.fieldID = 25;
                    }

                    // Build up the move table
                    var entityMoves = currentEntity.getMoves();
                    // Build up the capture move table
                    var captureMoves = currentEntity.getGoalMoves(entityMoves);

                    // Highlight entities moves
                    game.highlightStandardMoves(entityMoves);
                    game.highlightGoalMoves(captureMoves);

                    return movePossible;
                }
                return false;
            },

            "Delete Entity from OffBoard" : function(gameEvent, game) {

                // Reset temporary field id
                delete gameEvent.jobArguments.entity.tmp.fieldID;
                game.offBoard.deleteEntityFromOffBoard(gameEvent.jobArguments.entity.name);
            },

            "Place Entity" : function(gameEvent, game) {

                var tmp = gameEvent.jobArguments.entity,
                    entity = game.getPlayerWithID(tmp.associatedWithPlayerID).
                        getEntityWithID(tmp.ID), jobArgs = gameEvent.jobArguments;

                // ToDo implement later
                // if (entity.unlimitedQuantity) {}

                game.pushEntityToCell(entity,
                    jobArgs.xPosition, jobArgs.yPosition);

                // Increment move counter
                game.models.moveCounter += 1;

                if (game.models.playVirtual === false) {
                    Spoooky.GameProcess.pushMessage("[" + game.models.moveCounter + "] " +
                    game.getCurrentPlayerName() + " setzt Spielfigur auf Feld " +
                    game.translateCoordinates(jobArgs.xPosition, jobArgs.yPosition) + ".");
                }
            },

            "Move Entity To Dice Destination Cell" : function(gameEvent, game) {

                // Move Destination Entity to Off Board Area
                var connectedMove = game.getDiceBox().getConnectedDiceValue(gameEvent.jobID);

                if (connectedMove === false) { return false; }

                var srcX = gameEvent.entityLink.position.x,
                    srcY = gameEvent.entityLink.position.y,
                    destX = connectedMove.target.x,
                    destY = connectedMove.target.y;

                game.models.moveCounter += 1;

                if (game.models.playVirtual === false) {

                    var moveSrc = game.translateCoordinates(srcX, srcY),
                        moveDest = game.translateCoordinates(destX, destY);
                    Spoooky.GameProcess.pushMessage("[" + game.models.moveCounter + "] " +
                    game.getCurrentPlayerName() + " bewegt Spielfigur von " + moveSrc + " nach " +
                    moveDest + ".");
                }

                // If the entity is in the off board area
                if (_.isUndefined(gameEvent.entityLink.tmp.fieldID) === false) {

                    game.moveEntity(srcX, srcY, destX, destY, gameEvent.entityLink);
                    // Delete the entity from offboard area and reset the temporary field id
                    delete gameEvent.entityLink.tmp.fieldID;
                    game.offBoard.deleteEntityFromOffBoard(gameEvent.entityLink.getName());
                } else {
                    game.moveEntity(srcX, srcY, destX, destY);
                }
                return true;
            },

            "Prearrange Entity" : function(gameEvent, game) {

                var jobArgs = gameEvent.jobArguments,
                    entityPosition = jobArgs.entity.position;

                game.models.moveCounter += 1;

                game.moveEntity(entityPosition.x, entityPosition.y,
                    jobArgs.destX, jobArgs.destY);
            },

            "Move Entity" : function(gameEvent, game) {

                var models = game.models,
                    jobArgs = gameEvent.jobArguments,
                    entityPosition = jobArgs.entity.position;

                models.moveCounter += 1;

                if (models.playVirtual === false) {

                    var moveSrc = game.translateCoordinates(entityPosition.x, entityPosition.y),
                        moveDest = game.translateCoordinates(jobArgs.destX, jobArgs.destY);

                    Spoooky.GameProcess.pushMessage("[" + models.moveCounter + "] " +
                    game.getCurrentPlayerName() + " bewegt Spielfigur von " + moveSrc + " nach " +
                    moveDest + ".");
                }

                game.moveEntity(entityPosition.x, entityPosition.y,
                    jobArgs.destX, jobArgs.destY);
            },

            "Move Entity By Dice Value" : function(gameEvent, game) {

                var models = game.models,
                    jobArgs = gameEvent.jobArguments,
                    entityPosition = jobArgs.entity.position;

                models.moveCounter += 1;

                if (models.playVirtual === false) {

                    var moveSrc = game.translateCoordinates(entityPosition.x, entityPosition.y),
                        moveDest = game.translateCoordinates(jobArgs.destX, jobArgs.destY);

                    Spoooky.GameProcess.pushMessage("[" + models.moveCounter + "] " +
                    game.getCurrentPlayerName() + " bewegt Spielfigur von " + moveSrc + " nach " +
                    moveDest + " mit dem Wuerfelwert " + jobArgs.diceValue + ".");
                }

                game.moveEntity(entityPosition.x, entityPosition.y,
                    jobArgs.destX, jobArgs.destY);
            },

            "Move Entity Relative To" : function(gameEvent, game) {

                // Get the current position of the entity
                var entityLink = gameEvent.entityLink,
                    srcX = entityLink.position.x,
                    srcY = entityLink.position.y;

                game.moveEntity(srcX, srcY,
                    parseInt(srcX + gameEvent.jobArguments[0], 10),
                    parseInt(srcY + gameEvent.jobArguments[1], 10));
            },

            /**
             * Move an entity with a specific name
             * @param gameEvent
             * @param game
             * @returns {boolean}
             */
            "Move Entity With Name" : function(gameEvent, game) {

                // Search for an entity with entityName
                var entityToMove = game.getEntityWithName(gameEvent.jobArguments[0]);

                if (entityToMove === false) { return false; }

                var jobArgs = gameEvent.jobArguments,
                    curX = entityToMove.position.x,
                    curY = entityToMove.position.y,
                    destX, destY;

                if (jobArgs[3] === "RELATIVE") {

                    destX = parseInt(curX + jobArgs[1], 10);
                    destY = parseInt(curY + jobArgs[2], 10);
                } else if (jobArgs[3] === "ABSOLUTE") {

                    destX = jobArgs[1];
                    destY = jobArgs[2];
                }
                game.moveEntity(curX, curY, destX, destY);

                game.models.moveCounter += 1;

                return true;
            },

            "Prevent Player Change" : function(gameEvent, game) {
                game.models.playerChange = false;
                return true;
            },

            "Enable Player Change" : function(gameEvent, game) {
                game.models.playerChange = true;
            },

            "Proceed Game" : function(gameEvent, game) {
                game.proceed();
            },

            "Change Game Mode" : function(gameEvent, game) {

                var mode = gameEvent.jobArguments.mode;

                if (mode === "PLACING" ||
                    mode === "MOVING") {
                    game.setGameMode(mode);
                } else {
                    console.log("Error: Wrong Game Mode", mode);
                }
            },

            "Capture Opponent At" : function(gameEvent, game) {

                var entityX, entityY,
                    jobArgs = gameEvent.jobArguments,
                    entityPosition = gameEvent.entityLink.position;

                if (jobArgs[2] === "RELATIVE") {

                    entityX = parseInt(entityPosition.x + jobArgs[0], 10);
                    entityY = parseInt(entityPosition.y + jobArgs[1], 10);
                } else if (jobArgs[2] === "ABSOLUTE") {

                    entityX = jobArgs[0];
                    entityY = jobArgs[1];
                }

                //game.models.moveCounter += 1;

                if (game.models.playVirtual === false) {

                    var destination = game.translateCoordinates(entityX, entityY);
                    Spoooky.GameProcess.pushMessage("[" + game.models.moveCounter + "] " +
                    game.getCurrentPlayerName() + " schlaegt gegnerische Spielfigur auf Feld " + destination + ".");
                }

                // Delete entity at the target destination
                game.deleteEntityAt(entityX, entityY);
            },

            "Highlight Dice Target Cell" : function(gameEvent, game) {

                game.highlightCell(gameEvent.entityLink.targeting.x, gameEvent.entityLink.targeting.y,
                    gameEvent.jobArguments, gameEvent.jobID);
            },

            "Highlight Area" : function(gameEvent, game) {
                game.getArea(gameEvent.jobArguments.areaName).display = gameEvent.jobArguments.highlightClass;
            },

            "Highlight Cell" : function(gameEvent, game) {

                var jobArgs = gameEvent.jobArguments,
                    markX = jobArgs[0],
                    markY = jobArgs[1],
                    markClass = jobArgs[2];

                if (jobArgs[3] === "RELATIVE") {

                    markX = parseInt(gameEvent.entityLink.position.x + jobArgs[0], 10);
                    markY = parseInt(gameEvent.entityLink.position.y + jobArgs[1], 10);
                } else if (jobArgs[3] === "ABSOLUTE") {

                    markX = jobArgs[0];
                    markY = jobArgs[1];
                }
                game.highlightCell(markX, markY, markClass, gameEvent.jobID);
            },

            "Set Game State" : function(gameEvent, game) {
                game.setGameState(gameEvent.jobArguments);
            },

            // Restrict selectable entities
            "Restrict Selectable Entities" : function(gameEvent, game) {
                game.models.SelectRestrictions.entities = gameEvent.jobArguments;
            },

            // Restrict to specific entity moves
            "Restrict Selectable Entity Moves" : function(gameEvent, game) {
                game.models.SelectRestrictions.moves = gameEvent.jobArguments;
            },

            "Delete This Entity" : function(gameEvent, game) {
                game.deleteEntityAt(gameEvent.entityLink.position.x,
                    gameEvent.entityLink.position.y);
            },

            "Increment Off Board Counter" : function(gameEvent, game) {
                game.areas.incrementElements(gameEvent.jobArguments);
            },

            "Transform Entity" : function(gameEvent, game) {

                var currentEntity = gameEvent.entityLink,
                    associatedPlayer = game.models.
                        MetaAgents[gameEvent.entityLink.associatedWithPlayerID],
                    xPosition = currentEntity.position.x,
                    yPosition = currentEntity.position.y;

                game.deleteEntityAt(xPosition, yPosition);
                game.resetMoves();

                // Create a new entity with new entity properties
                var bluePrint = game.getBlueprint(gameEvent.jobArguments),
                    newEntity = associatedPlayer.entityFactory(bluePrint);

                // Restore name and id of old entity
                newEntity.setName(currentEntity.getName());
                newEntity.setID(currentEntity.ID);

                // Connect the entity with meta agent
                newEntity.associatedWithMetaAgent = associatedPlayer.ID;

                // Copy previously executed moves to transformed / new entity
                newEntity.executedMoves = currentEntity.executedMoves;
                game.pushEntityToCell(newEntity, xPosition, yPosition);
            },

            "Transform Entity If Row Reached" : function(gameEvent, game) {

                var currentEntity = gameEvent.entityLink,
                    destinationRow = gameEvent.jobArguments.row;

                if (destinationRow === "last") {
                    destinationRow = parseInt(game.gameWorld.getRows()-1, 10);
                } else if (destinationRow === "first") {
                    destinationRow = 0;
                }

                if (currentEntity.position.y !== destinationRow) { return false; }

                // Fire previously defined transform event
                Spoooky.GameEvents.fireEvent({
                    job: "Transform Entity",
                    jobArguments: gameEvent.jobArguments.entityType,
                    entityLink : currentEntity
                }, game);
                return true;
            },

            "Next Player" : function(gameEvent, game) {
                game.setNextPlayer();
            },

            "Delete All Dice Values" : function(gameEvent, game) {
                game.getDiceBox().deleteAllDiceValues();
            },

            "alert" : function(gameEvent) {
                alert(gameEvent.jobArguments);
            },

            "Print Game Process" : function(gameEvent, game) {

                if (game.models.playVirtual === false) {
                    Spoooky.GameProcess.pushMessage(gameEvent.jobArguments);
                }
            },

            "Stop Game" : function(gameEvent, game) {

                game.setGameState("END");
                if (game.models.playVirtual === false) {
                    game.informArtificialPlayersAboutGameEnd();
                }
            },

            "Set Winner" : function(gameEvent, game) {
                game.setWinnerID(gameEvent.jobArguments);

                if (game.models.playVirtual === false) {
                    Spoooky.GameProcess.pushMessage('<button id="postGameReloadButton"' +
                    'onclick="location.reload();" type="button" ' +
                    'class="btn btn-success btn-sm">Spiel neu starten</button>');
                }
            }
        },

        /**
         * Fire / execute a game event
         * @param gameEvent
         * @param game
         */
        fireEvent : function(gameEvent, game) {
            this.events[gameEvent.job](gameEvent, game);
        }
    };

    /**
     * JobQueue
     * Controller for Spoooky.Models.JobQueue
     *
     * @constructor
     */
    Spoooky.JobQueue = function(game) {

        var self_JobQueue = this;
        var myGame = game;

        /**
         * Adds a job to the job queue
         */
        self_JobQueue.addJob = function(job) {

            var queue = myGame.models.JobQueue;

            if (_.isUndefined(queue[job.jobID])) {
                queue[job.jobID] = [];
            }

            queue[job.jobID][job.jobName] = job;

            //myGame.models.JobQueue.push(job);
        };

        /**
         * Delets all job queue jobs
         */
        self_JobQueue.flush = function() {
            myGame.models.JobQueue.length = 0;
        };

        /**
         * Get a job for an associated move identifier
         * @param moveID
         * @returns {Array}
         */
        self_JobQueue.getJobsWithMoveID = function(moveID) {

            var jobs = [], queue = myGame.models.JobQueue[moveID];

            for (var job in queue) {
                jobs.push(queue[job]);
            }

            return jobs;
        }
    };

    /**
     * Spoooky Areas
     * Controller for Spoooky.Models.Areas
     * @param game
     * @constructor
     */
    Spoooky.Areas = function(game) {

        var self_Areas = this;
        var myGame = game;

        /**
         * Enable the area structure
         */
        self_Areas.enable = function() {
            myGame.models.Areas.isEnabled = true;
        };

        /**
         * Get the activation state of the areas structure
         * @returns {boolean}
         */
        self_Areas.isEnabled = function() {
            return myGame.models.Areas.isEnabled;
        };

        /**
         * Checks for a move identifier saved in an area
         * @param areaName
         * @returns {boolean}
         */
        self_Areas.isMove = function(areaName) {

            return (self_Areas.getArea(areaName).moveID !== 0);
        };

        /**
         * Increment number of area elements
         * @param areaName
         */
        self_Areas.incrementElements = function(areaName) {
            self_Areas.getArea(areaName).elementCounter++;
        };

        /**
         * Returns the unique identifier of a move
         * saved in a specific game area
         * @param areaName
         * @returns {*|number|String}
         */
        self_Areas.getMoveID = function(areaName) {

            return self_Areas.getArea(areaName).moveID;
        };

        /**
         * Add an area to the game
         * @param areaName
         */
        self_Areas.addArea = function(areaName) {

            self_Areas.enable();
            myGame.models.Areas.content.push({
                name : areaName,
                moveID : 0,
                display : "",
                elementCounter : 0
            });
        };

        /**
         * Get an area by its name
         * @param areaName
         * @returns {*}
         */
        self_Areas.getArea = function(areaName) {

            return _.find(myGame.models.Areas.content, function(curArea) {
                return curArea.name === areaName;
            });
        };

        /**
         * Reset area display
         */
        self_Areas.resetDisplays = function() {

            _.each(myGame.models.Areas.content, function(curArea) {
                curArea.display = "";
            })
        }
    };

    Spoooky.Agent = function(metaAgent, agentID) {

        var self_Agent = this;

        /**
         * Unique agent identifier
         */
        self_Agent.ID = agentID;

        /**
         * Connection to the meta agent
         * @type {*}
         */
        self_Agent.metaAgentID = metaAgent;

        /**
         * Agents are divided in different roles
         * Possible / allowed constants:
         * - ANALYZE POSSIBLE MOVES (standard value)
         *      - agent.focus: { ALL, FIRST HALF, SECOND HALF }
         * @type {string}
         */
        self_Agent.role = "ANALYZE POSSIBLE MOVES";

        /**
         * Agents focus different aspects of the game
         * Constants:
         * - FIRST HALF OF POSSIBLE MOVES
         * - SECOND HALF OF POSSIBLE MOVES
         * - MOVES NEAR OPPONENT FIELDS
         * - MOVES NEAR OPPONENT OR OWN FIELDS
         *
         * Executable / possible moves are coordinated by the meta agent
         * cf. self_MetaAgent.getExecutableMovesByAgentFocus(*)
         *
         * @type {string}
         */
        self_Agent.focus = "ALL";

        /**
         * Fitness of the agent
         * Used by the meta agent to describe the individual relevance of the agent for a specific game
         * @type {number}
         */
        self_Agent.fitness = 1.0;

        /**
         * Computing time of the agent in milliseconds (10000 = 10 seconds)
         * @type {number}
         */
        self_Agent.thinkingTime = 10000;

        /**
         * Maximum monte carlo rollout steps
         * @type {number}
         */
        self_Agent.maximumSteps = 10000;

        /**
         * Constant UCT value
         * @type {number}
         */
        self_Agent.uctConstant = 0.9;

        /**
         * AI driver of the individual agent
         */
        self_Agent.proposeBestMove = function() {

            var graph = false,
                id = self_Agent.ID,
                role = self_Agent.role,
                focus = self_Agent.focus,
                steps = self_Agent.maximumSteps,
                brain = self_Agent.createBrain(),
                uctConstant = self_Agent.uctConstant,
                thinkingTime = self_Agent.thinkingTime,
                performLearning = Spoooky.AI.game.getPlayerWithID(self_Agent.metaAgentID).learningEnabled;

            // Only generate the mcts graph if interface is activated / visible
            if (localStorage["#mctsgraph"]) { graph = true; }

            switch (role) {

                // An agent with this role analyzes executable moves by using monte carlo tree search
                case "ANALYZE POSSIBLE MOVES":
                    // Start the web worker
                    brain.postMessage({
                        "agentID" : id,
                        "agentRole" : role,
                        "agentFocus" : focus,
                        "maxSteps" : steps,
                        "maxTime" : thinkingTime,
                        "learn" : performLearning,
                        "uctConstant" : uctConstant,
                        "command" : "monte carlo tree search with uct",
                        "gameModel" : Spoooky.AI.game.stringifyModels(),
                        "generateMctsGraph" : graph
                    });
                    break;

                // An agent with this role searches for immediate threats by using
                // the alpha beta negamax algorithm with a narrow search window
                // not really usable in games with complex game trees
                case "SEARCH FOR IMMEDIATE THREATS":
                    brain.postMessage({
                        "agentID" : id,
                        "agentRole" : role,
                        "agentFocus" : focus,
                        "command" : "alpha beta negamax",
                        "maxDepth" : 3,
                        "gameModel" : Spoooky.AI.game.stringifyModels()
                    });
                    break;

                default:
                    console.log("Unknown Agent Role.")
            }
        };

        /**
         * Create a web worker for the agent
         * @returns {Worker}
         */
        self_Agent.createBrain = function() {

            // Create a web worker for this agent
            var agentWorker = new Worker("../../js/spoooky.Worker.min.js"),
                player = Spoooky.AI.game.getPlayerWithID(self_Agent.metaAgentID);

            // Create worker's behaviour
            agentWorker.addEventListener("message", function(event) {

                switch(event.data.type){

                    case "starting":
                        break;

                    // Things to do if the worker / agent has found a best move
                    case "decision":
                        // Execute the best found artificial move
                        player.coordinateAgentDecisions(event.data);
                        break;

                    // No best move has been found
                    case "random":
                        player.coordinateAgentDecisions(event.data);
                        break;

                    default:
                    //console.log(e.data);
                }
            });
            return agentWorker;
        }
    };

    /**
     * Every game is played by a number of different meta agents (the players of the game).
     * Those meta agents own (sub)-agents which focus different aspects of the game
     * And are used by the Meta Agent to decide for the best move
     *
     * @constructor
     */
    Spoooky.MetaAgent = function(game) {

        var self_MetaAgent = this;
        var myGame = game;

        /**
         * Name of the Meta Entity
         * @type {string}
         */
        self_MetaAgent.name = "";

        /**
         * Sets the name of the meta agent
         * @param playerName
         */
        self_MetaAgent.setName = function(playerName) {
            self_MetaAgent.name = playerName;
        };

        /**
         * Gets the name of the meta agent
         * @returns {string}
         */
        self_MetaAgent.getName = function() {
            return self_MetaAgent.name;
        };

        /**
         * Gets the game the meta agent is connected to
         * @returns {*}
         */
        self_MetaAgent.getGame = function() {
            return myGame;
        };

        /**
         * Unique identifier of the meta agent
         * Equals the agent's position (index) in Array Spoooky.Models.MetaAgents
         * @type {number}
         */
        self_MetaAgent.ID = 0;

        /**
         * Gets the unique identifier of the mega agent
         * @returns {number}
         */
        self_MetaAgent.getID = function() {
            return self_MetaAgent.ID;
        };

        /**
         * Sets the unique identifier of the meta agent
         * @param setID
         */
        self_MetaAgent.setID = function(setID) {
            self_MetaAgent.ID = setID;
        };

        /**
         * Type of the Meta Entity {ARTIFICIAL || HUMAN}
         * @type {string}
         */
        self_MetaAgent.type = "HUMAN";

        /**
         * Sets the type of the meta agent
         * @param playerType
         * @returns {boolean}
         */
        self_MetaAgent.setType = function(playerType) {

            if (playerType === "HUMAN" || playerType === "ARTIFICIAL") {
                self_MetaAgent.type = playerType;
                return true;
            } else {
                console.log("Invalid Player Type. Allowed Player Types: HUMAN or ARTIFICIAL");
                return false;
            }
        };

        /**
         * Switch enable / disable active learning of the meta agent
         * @type {boolean}
         */
        self_MetaAgent.learningEnabled = false;

        /**
         * Enable learning of the meta agent
         */
        self_MetaAgent.enableLearning = function() {
            self_MetaAgent.learningEnabled = true;
        };

        /**
         * Learning module of the meta agent
         * @type {{}}
         */
        self_MetaAgent.QLearner = {};

        /**
         * Finish learning if game has ended
         */
        self_MetaAgent.gameHasEnded = function() {

            if (self_MetaAgent.learningEnabled) {

                Spoooky.GameProcess.pushMessage("Meta Agent " + self_MetaAgent.ID + " lernt...");
                self_MetaAgent.QLearner.learn(10000);

                var outString = "{\n";

                outString += '\t"game" : \"' + self_MetaAgent.getGame().getName() + '",\n';
                outString += '\t"metaAgentID" : ' + self_MetaAgent.ID + ',\n';
                outString += '\t"bestAgentEnsemble" : ';
                outString += JSON.stringify(self_MetaAgent.agents, null, "\t");
                outString += ',\n';
                outString += '\t"learnModule" : ';
                outString += JSON.stringify(self_MetaAgent.QLearner, null, "\t");
                //outString += JSON.stringify(self_MetaAgent.QLearner);
                outString += "\n}";

                var blob = new Blob([outString], {type: "text/plain;charset=utf-8"});

                saveAs(blob, "agentmemory_" + self_MetaAgent.ID + ".json");
            }
        };

        /**
         * Associate an entity with the meta agent
         * @param entity
         */
        self_MetaAgent.associateEntity = function(entity) {

            // Associate the entity with the meta agent
            entity.associatedWithMetaAgent = self_MetaAgent.ID;

            // Add placeable entity to the game
            if (entity.mode === "PLACE") {
                self_MetaAgent.getGame().addEntityToGame(entity);
            }
        };

        /**
         * Entity factory of the meta agent
         * The meta agent creates its associated entities
         * @param entityBluePrint
         * @returns {Object}
         */
        self_MetaAgent.entityFactory = function(entityBluePrint) {

            var newEntity,
                entityName = "",
                entityID = 0;

            if (entityBluePrint.entityName) {
                entityName = entityBluePrint.entityName;
            } else {
                entityName = self_MetaAgent.ID + "_entity_" + parseInt(self_MetaAgent.countEntities()+1, 10);
            }

            if (entityBluePrint.entityID) {
                entityID = entityBluePrint.entityID;
            } else {
                entityID = parseInt(self_MetaAgent.countEntities()+1, 10);
            }

            newEntity = new Spoooky.Entity(entityName, entityID,
                entityBluePrint.typeID, self_MetaAgent.getGame());

            newEntity.setType(entityBluePrint.entityType);
            newEntity.setRepresentation(entityBluePrint.representation.type, entityBluePrint.representation.texture);

            // Create moves
            var i, item, moves = entityBluePrint.moves;

            if (moves) {
                for (i = 0; i < moves.length; i++) {

                    item = moves[i];
                    newEntity.addMove({
                        name : item.name,
                        type : item.type,
                        direction : item.direction,
                        frequency : item.frequency,
                        conditions : item.conditions,
                        postMove : item.postMove
                    });
                }
            }

            // Create sub goals
            if (entityBluePrint.goalAtoms) {
                for (i = 0; i < entityBluePrint.goalAtoms.length; i++) {

                    item = entityBluePrint.goalAtoms[i];
                    newEntity.addGoalAtom(item.atomName, item.atomFunction, item.atomArguments);
                }
            }

            // Create entity goals
            if (entityBluePrint.goals) {
                for (i = 0; i < entityBluePrint.goals.length; i++) {

                    item = entityBluePrint.goals[i];
                    newEntity.assembleGoal({
                        type : item.type,
                        name : item.name,
                        atoms : item.atoms,
                        // This goal will be executed for all fields which are reachable by the following entity's move
                        move : item.move,
                        area : item.area
                    });
                }
            }

            // Add selection conditions for interface: an entity is clickable if...
            newEntity.selectCondition = entityBluePrint.selectCondition;

            if (entityBluePrint.postMoveCheck) {
                newEntity.postMoveCheck = entityBluePrint.postMoveCheck;
            } else {
                newEntity.postMoveCheck = null;
            }

            newEntity.setGoalTargets(entityBluePrint.goalTargets);

            // Set entity quantity for board games in which entities are placed, if necessary
            if (entityBluePrint.unlimitedQuantity) {
                newEntity.unlimitedQuantity = true;
            }

            // Set the entity mode
            // MOVE for movable entities
            // PLACE for droppable entities
            if (entityBluePrint.mode) {
                newEntity.mode = entityBluePrint.mode;
            }

            // If the entity mode is PLACE then placeTo defines target
            // destination the entity can be placed on the game board
            if (entityBluePrint.placeTo) {
                newEntity.placeTo = entityBluePrint.placeTo;
            }

            self_MetaAgent.addEntity(newEntity);

            return newEntity;
        };

        /**
         * Add an entity to the game model and associate the entity with this meta agent
         * @param currentEntity
         */
        self_MetaAgent.addEntity = function(currentEntity) {

            currentEntity.setAssociatedPlayerID(self_MetaAgent.ID);
            myGame.models.Entities[self_MetaAgent.ID].push(currentEntity);
        };

        /**
         * Find an associated entity
         * @param arrayID
         * @returns {*}
         */
        self_MetaAgent.getEntityFromArray = function(arrayID) {

            if (arrayID >= 0 && arrayID < self_MetaAgent.countEntities()) {
                return myGame.models.Entities[self_MetaAgent.ID][arrayID];
            } else { return false; }
        };

        /**
         * Retrieve an entity with a specific unique identifier
         * @param entityID
         * @returns {*}
         */
        self_MetaAgent.getEntityWithID = function(entityID) {

            var cur;
            for (var index = self_MetaAgent.countEntities(); index--;) {

                cur = myGame.models.Entities[self_MetaAgent.ID][index];
                if (cur.ID === entityID) { return cur; }
            }
            return false;
        };

        /**
         * Find and return all associated entities
         * @returns {*}
         */
        self_MetaAgent.getEntities = function() {
            return myGame.models.Entities[self_MetaAgent.ID];
        };

        /**
         * Find associated entities of a specific type
         * @param entityType
         * @returns {Array}
         */
        self_MetaAgent.getEntitiesOfType = function(entityType) {

            var returnEntities = [];

            for (var index = self_MetaAgent.countEntities(); index--;) {

                if (myGame.models.Entities[self_MetaAgent.ID][index].type === entityType) {
                    returnEntities.push(myGame.models.Entities[self_MetaAgent.ID][index]);
                }
            }
            return returnEntities;
        };

        /**
         * Find entities which can be dropped on the game board
         * @returns {Array}
         */
        self_MetaAgent.getPlaceableEntities = function() {

            var returnEntities = [], cur;

            for (var index = self_MetaAgent.countEntities(); index--;) {

                cur = myGame.models.Entities[self_MetaAgent.ID][index];
                if (cur.mode === "PLACE") { returnEntities.push(cur); }
            }
            return returnEntities;
        };

        /**
         * Finds and returns an entity with a specific name
         * @param entityName
         * @returns {*}
         */
        self_MetaAgent.getEntityWithName = function(entityName) {

            for (var index = self_MetaAgent.countEntities(); index--;) {
                if (myGame.models.Entities[self_MetaAgent.ID][index].name === entityName) {
                    return myGame.models.Entities[self_MetaAgent.ID][index];
                }
            }
            return false;
        };

        /**
         * Gets the next (opponent) meta agent
         * @returns {*}
         */
        self_MetaAgent.getNextOpponentPlayer = function() {
            if (self_MetaAgent.ID < self_MetaAgent.getGame().models.MetaAgents.length-1) {
                return self_MetaAgent.getGame().getPlayerWithID(parseInt(self_MetaAgent.ID +1, 10));
            }
            return self_MetaAgent.getGame().getPlayerWithID(parseInt(0, 10));
        };

        /**
         * Gets occupied fields
         * @param mode
         * @returns {Array}
         */
        self_MetaAgent.getOccupiedFields = function(mode) {

            var occupiedFields = [],
                game = self_MetaAgent.getGame(),
                gameGrid = game.models.GameGrid,
                oneD = _.flatten(gameGrid),
                count = oneD.length,
                i, currentField;

            switch (mode) {

                case "OWN ENTITIES":
                    for (i = count; i--;) {

                        currentField = oneD[i];
                        if (currentField.contains.length !== 0) {
                            // Check for an opponent entity at the cell (pick the last entity on stack)
                            if (_.last(currentField.contains).playerID === self_MetaAgent.ID) {
                                occupiedFields.push(currentField.position);
                            }
                        }
                    }
                    break;

                case "OPPONENT ENTITIES":
                    for (i = count; i--;) {

                        currentField = oneD[i];
                        if (currentField.contains.length !== 0) {
                            // Check for an opponent entity at the cell (pick the last entity on stack)
                            if (_.last(currentField.contains).playerID !== self_MetaAgent.ID) {
                                occupiedFields.push(currentField.position);
                            }
                        }
                    }
                    break;

                default:
                    console.log("Wrong Mode");
            }

            // Return coordinates of occupied field (without off board areas)
            return occupiedFields;
        };

        /**
         * Does the meta entity own an entity with a specific name?
         * @param entityName
         * @returns {boolean}
         */
        self_MetaAgent.hasEntity = function (entityName) {

            for (var index = self_MetaAgent.countEntities(); index--;) {
                if (myGame.models.Entities[self_MetaAgent.ID][index].name === entityName) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Deletes an Entity
         * @param {String} entityName Name of the entity which will be deleted
         */
        self_MetaAgent.deleteEntity = function(entityName) {

            for (var index = self_MetaAgent.countEntities(); index--;) {

                if (myGame.models.Entities[self_MetaAgent.ID][index].name === entityName) {
                    myGame.models.Entities[self_MetaAgent.ID].splice(index, 1);
                    return true;
                }
            }
            return false;
        };

        /**
         * Counts associated entities
         * @returns {Number} Number of associated entities
         */
        self_MetaAgent.countEntities = function() {
            return myGame.models.Entities[self_MetaAgent.ID].length;
        };

        /**
         * Returns every possible standard move of all associated entities
         * @returns {*}
         */
        self_MetaAgent.getAllEntityStdMoves = function() {

            var entities = self_MetaAgent.getEntities(),
                entityCount = entities.length;

            if (entityCount === 0) { return false; }

            var entity, entityMoves,
                allEntityStdMoves = [],
                game = self_MetaAgent.getGame();

            for (var i = entities.length; i--;) {

                entity = entities[i];

                // See if the current entity can move
                if (game.checkSelectCondition(entity) === true) {

                    // Build up the move table
                    entityMoves = entity.getMoves();
                    game.performPostMoveChecks(entity, entityMoves);
                    allEntityStdMoves.push.apply(allEntityStdMoves, entityMoves);
                }
            }

            if (allEntityStdMoves.length === 0) { return false; }
            return allEntityStdMoves;
        };

        /**
         * Returns every possible goal move of all associated entities
         * @returns {*}
         */
        self_MetaAgent.getAllEntityGoalMoves = function() {

            var entities = self_MetaAgent.getEntities(),
                entityCount = entities.length;

            if (entityCount === 0) { return false; }

            var entity, goalMoves,
                allEntityGoalMoves = [],
                game = self_MetaAgent.getGame();

            for (var i = entities.length; i--;) {

                entity = entities[i];
                // See if the current entity can move or can capture an opponent entity
                if (game.checkSelectCondition(entity) === true) {

                    // Build up the capture move table
                    goalMoves = entity.getGoalMoves();
                    game.performPostMoveChecks(entity, goalMoves);
                    allEntityGoalMoves.push.apply(allEntityGoalMoves, goalMoves);
                }
            }

            // Return all goal moves of the entity
            if (allEntityGoalMoves.length === 0) { return false; }
            return allEntityGoalMoves;
        };

        /**
         * Returns every possible standard and goal move of all associated entities
         * @returns {*}
         */
        self_MetaAgent.getAllEntityMoves = function() {

            var game = self_MetaAgent.getGame();

            if (game.models.gameState === "END") {
                return [];
            }

            var entities, entity;

            switch (game.models.gameMode) {

                // Find a move where an associated entity
                // is moved in the game world
                case "MOVING":

                    entities = self_MetaAgent.getEntities();

                    var entityCount = entities.length;

                    if (entityCount === 0) {
                        return [];
                    }

                    var entityMoves = [], goalMoves = [],
                        allEntityMoves = [], rstrct;

                    // Process every entity
                    for (counter = entityCount; counter--;) {

                        entity = entities[counter];

                        // Process only entities which can be moved on the game board
                        if (entity.mode === "PLACE") { continue; }

                        // See if the current entity can move or can capture an opponent entity
                        if (game.checkSelectCondition(entity) === true) {

                            // Reset working arrays
                            entityMoves.length = 0;
                            goalMoves.length = 0;

                            // See if current entity is restricted to move in a specific way
                            rstrct = game.models.SelectRestrictions.moves;

                            switch (rstrct) {

                                case "Standard Moves":
                                    entityMoves = entity.getMoves();
                                    break;

                                case "Capture Moves":
                                    goalMoves = entity.getGoalMoves(entityMoves);
                                    break;

                                default:

                                    // Build up the move table
                                    entityMoves = entity.getMoves();
                                    // Build up the goal move table
                                    goalMoves = entity.getGoalMoves(entityMoves);
                                    break;
                            }

                            // Perform last checks
                            game.performPostMoveChecks(entity, entityMoves);
                            game.performPostMoveChecks(entity, goalMoves);

                            // Save the moves
                            allEntityMoves.push.apply(allEntityMoves, entityMoves);
                            allEntityMoves.push.apply(allEntityMoves, goalMoves);
                        }
                    }

                    // Return moves of the entity
                    if (allEntityMoves.length === 0) {

                        // Return an empty array
                        return [];
                    }

                    return allEntityMoves;
                    break;

                // Find an entity which is placed in the game world
                case "PLACING":

                    // Find entities to place in the game world
                    entities = self_MetaAgent.getPlaceableEntities();

                    // No entities found
                    if (entities.length === 0)  {
                        return [];
                    }

                    var possibleMoves = [], dest, moveID, counter;

                    // Pick and work with the last entity of retrieved entities
                    entity = _.last(entities);

                    switch (entity.placeTo) {

                        // Place an entity on a free field of the game board
                        case "ANY":

                            var destFields = game.gameWorld.getFreeCells();

                            // Create moves
                            for (counter = destFields.length; counter--;) {

                                dest = destFields[counter];

                                moveID = game.getUniqueMoveID(entity.name, "place-entity", dest.x, dest.y);

                                possibleMoves.push({
                                    type : "PLACE",
                                    name : "place entity",
                                    entity: entity,
                                    targetX : dest.x,
                                    targetY : dest.y,
                                    moveClass : "move_place",
                                    ID : moveID });

                                game.addJobForMoveID({
                                    jobID : moveID,
                                    jobName : "Put the Entity to the destination field",
                                    job : "Place Entity",
                                    jobArguments : {
                                        entity : entity,
                                        xPosition : dest.x,
                                        yPosition : dest.y }
                                });
                            }
                            return possibleMoves;
                            break;

                        // Place an entity on a free field which is
                        // reachable by the recently moved entity
                        // Implemented for the game of amazons
                        case "REACHABLE BY RECENTLY MOVED ENTITY":

                            var recentlyMoved = game.getrecentlyMovedEntity();

                            if (recentlyMoved === false) {
                                //break;
                                return [];
                            }
                            var moves;

                            moves = recentlyMoved.getMoves();

                            for (counter = moves.length; counter--;) {

                                dest = moves[counter];

                                moveID = game.getUniqueMoveID(entity.name, "place-entity",
                                    dest.targetX, dest.targetY);

                                possibleMoves.push({
                                    type : "PLACE",
                                    name : "place entity",
                                    entity: entity,
                                    targetX : dest.targetX,
                                    targetY : dest.targetY,
                                    moveClass : "move_place",
                                    ID : moveID });

                                game.addJobForMoveID({
                                    jobID : moveID,
                                    jobName : "Put the Entity to the destination field",
                                    job : "Place Entity",
                                    jobArguments : {
                                        entity : entity,
                                        xPosition : dest.targetX,
                                        yPosition : dest.targetY }
                                });

                                // Process game after one successfully executed move
                                // Implemented for the game of amazons
                                game.addJobForMoveID({
                                    jobID : moveID,
                                    jobName : "Let Players Change",
                                    job: "Enable Player Change"
                                });

                                game.addJobForMoveID({
                                    jobID : moveID,
                                    jobName : "Change Back To Move Mode",
                                    job: "Change Game Mode",
                                    jobArguments : { mode: "MOVING" }
                                });
                            }
                            return possibleMoves;
                            break;

                        default:
                            console.log("Wrong Placing Mode: ", entity.placeTo);
                            break;
                    }

                    break;

                default:
                    console.log("Wrong command in self_MetaAgent.getAllEntityMoves");
                    break;
            }
        };

        /**
         * Reduce the list of all executable moves by agent focus
         * @param agentFocus
         * @returns {Array}
         */
        self_MetaAgent.getExecutableMovesByAgentFocus = function(agentFocus) {

            if (self_MetaAgent.getGame().models.gameState === "END") {
                return [];
            }

            // Retrieve all executable moves
            var allMoves = self_MetaAgent.getAllEntityMoves(),
                uX, uY, untried, oX, oY, occupied, focusMoves = [],
                diffX, diffY, occupiedFields, movesHalf;

            // Index each move
            for (var i = allMoves.length; i--;) {
                allMoves[i].moveIndex = i;
            }

            switch (agentFocus) {

                case "FIRST HALF OF POSSIBLE MOVES":

                    movesHalf = Math.floor(allMoves.length / 2);
                    allMoves.splice(movesHalf, movesHalf);

                    return allMoves;
                    break;

                case "SECOND HALF OF POSSIBLE MOVES":

                    movesHalf = Math.floor(allMoves.length / 2);
                    allMoves.splice(0, movesHalf);

                    return allMoves;
                    break;

                // Only analyze moves near fields occupied by opponent entities
                case "MOVES NEAR OPPONENT FIELDS":

                    occupiedFields = self_MetaAgent.getOccupiedFields("OPPONENT ENTITIES");

                    for (untried = allMoves.length; untried--;) {

                        uX = allMoves[untried].targetX;
                        uY = allMoves[untried].targetY;

                        for (occupied = occupiedFields.length; occupied--;) {

                            oX = occupiedFields[occupied].x;
                            oY = occupiedFields[occupied].y;

                            diffX = Math.abs(oX - uX);
                            diffY = Math.abs(oY - uY);

                            if (diffX <= 1 && diffY <= 1) {

                                // Save this move
                                focusMoves.push(allMoves[untried]);
                                // Break the loop and go to the next move
                                break;
                            }
                        }
                    }

                    return focusMoves;
                    break;

                case "MOVES NEAR OPPONENT OR OWN FIELDS":

                    // Check field occupied by opponent entities
                    occupiedFields = self_MetaAgent.getOccupiedFields("OPPONENT ENTITIES");
                    // Also check fields occupied by own entities
                    occupiedFields = occupiedFields.concat(self_MetaAgent.getOccupiedFields("OWN ENTITIES"));

                    for (untried = allMoves.length; untried--;) {

                        uX = allMoves[untried].targetX;
                        uY = allMoves[untried].targetY;

                        for (occupied = occupiedFields.length; occupied--;) {

                            oX = occupiedFields[occupied].x;
                            oY = occupiedFields[occupied].y;

                            diffX = Math.abs(oX - uX);
                            diffY = Math.abs(oY - uY);

                            if (diffX <= 1 && diffY <= 1) {
                                // Save this move
                                focusMoves.push(allMoves[untried]);

                                // Break the loop and go to the next move
                                break;
                            }
                        }
                    }
                    return focusMoves;
                    break;

                // Default (in agent focus "ALL") rollout policy: execute a random move
                case "ALL MOVES":
                case "ALL":
                default:
                    // Randomly pick a move from all currently possible moves
                    return allMoves;
            }
        };

        /**
         * Associated agents of the meta agent
         * @type {Array}
         */
        self_MetaAgent.agents = [];

        /**
         * Number of active agents
         */
        self_MetaAgent.activeAgents = 0;

        /**
         * Number of agents finished their work
         */
        self_MetaAgent.finishedAgents = 0;

        /**
         * Get the number of agents owned by the meta agent
         * @returns {Number}
         */
        self_MetaAgent.countAgents = function() {
            return self_MetaAgent.agents.length;
        };

        /**
         * Gets all the associated agents
         * @returns {Array}
         */
        self_MetaAgent.getAgents = function() {
            return self_MetaAgent.agents;
        };

        /**
         * Gets an agent with a unique identifier
         * @param id
         * @returns {*}
         */
        self_MetaAgent.getAgentWithID = function(id) {

            var i, agents = self_MetaAgent.agents;

            for (i = agents.length; i--;) {

                if (agents[i].ID === id) {
                    return agents[i];
                }
            }

            return false;
        };

        /**
         * Assembles an agent with a specific role and focus
         * @param agentID
         * @param agentRole
         * @param agentFocus
         * @param maxSteps
         * @param maxTime
         * @param fitness
         * @param uctConstant
         */
        self_MetaAgent.assembleAgent = function(agentID, agentRole, agentFocus,
                                                maxSteps, maxTime, fitness, uctConstant) {

            var subAgent, metaID = self_MetaAgent.ID;
            subAgent = new Spoooky.Agent(metaID, agentID);

            subAgent.role = agentRole;
            subAgent.fitness = fitness;
            subAgent.focus = agentFocus;
            subAgent.thinkingTime = maxTime;
            subAgent.maximumSteps = maxSteps;
            subAgent.uctConstant = uctConstant;
            self_MetaAgent.agents.push(subAgent);
        };

        /**
         * Adds a default / standard agent to the agent ensemble
         */
        self_MetaAgent.addStandardAgent = function() {

            var agentID, agents, lastID = 0;

            // Find free / last agent ID
            agents = self_MetaAgent.getAgents();

            for (var i = agents.length; i--;) {

                agentID = agents[i].ID;

                if (agentID > lastID) {
                    lastID = agentID;
                }
            }

            lastID += 1;

            // Assemble a new agent and put it into the ensemble
            self_MetaAgent.assembleAgent(lastID, "ANALYZE POSSIBLE MOVES",
                "ALL MOVES", 10000, 10000, 1, 0.9);
        };

        /**
         * Delete an agent from the ensemble with a specific ID
         * @param agentID
         */
        self_MetaAgent.deleteAgentWithID = function(agentID) {

            for (var i = self_MetaAgent.agents.length; i--;) {

                if (self_MetaAgent.agents[i].ID === agentID) {
                    self_MetaAgent.agents.splice(i, 1);
                }
            }
        };

        /**
         * External knowledge embedded into the meta agent
         * ToDo implement later
         * @type {boolean}
         */
        self_MetaAgent.expertKnowledge = false;

        /**
         * Assemble associated agents for multi agent based decision-making
         */
        self_MetaAgent.assembleAgents = function() {

            var agentUrl = "agentmemory_" + self_MetaAgent.ID + ".json",
                success = false;

            // Use agent ensemble which was identified through previous learning episodes
            $.ajax({
                url: agentUrl,
                dataType: "json",
                async: false,
                success : function(data) {

                    success = true;

                    Spoooky.AgentLog.pushMessage("Lade Agentenerinnerungen fuer Meta Agent " + self_MetaAgent.ID + ".");
                    Spoooky.AgentLog.pushMessage('<div class="progress progress-striped active">' +
                    '<div class="progress-bar"  role="progressbar" style="width: 100%">'+
                    '<span class="sr-only">Lade</span></div></div>');

                    // Create the learning module of the meta agent
                    self_MetaAgent.QLearner = new Spoooky.QLearner();

                    // ...and fill it with previously made experiences
                    self_MetaAgent.QLearner.reward = data.learnModule.rewards;
                    self_MetaAgent.QLearner.gameStates = data.learnModule.gameStates;

                    $.each(data.bestAgentEnsemble, function(i, agent) {
                        // Assemble all remembered agents
                        self_MetaAgent.assembleAgent(agent.ID, agent.role, agent.focus,
                            agent.maximumSteps, agent.thinkingTime, agent.fitness, agent.uctConstant);
                    });

                },
                complete : function() {

                    if (success) {

                        // Hide the progress bar
                        Spoooky.AgentLog.messages.pop();

                        // Count discovered game states
                        var stateCount = _.keys(self_MetaAgent.QLearner.gameStates).length;
                        Spoooky.AgentLog.pushMessage(stateCount + " gelernte Spielzustaende wurden erfolgreich aus der Datei " + agentUrl + " geladen.");
                    }
                },
                error : function() {

                    // No agent memory available
                    if (self_MetaAgent.agents.length === 0) {

                        Spoooky.AgentLog.pushMessage("Keine Erinnerungen fuer Meta Agent " + self_MetaAgent.ID +
                        " vorhanden: Datei " + agentUrl + " existiert nicht.");

                        // Create the learning module of the meta agent
                        self_MetaAgent.QLearner = new Spoooky.QLearner();

                        // Use standard agent ensemble if there's no agent memory available
                        var thinkingTime = 10000,
                            maximumSteps = 15000;

                        // Create a standard ensemble of three agents
                        //Agent I: The first agent tries to analyze all executable moves
                        self_MetaAgent.assembleAgent(1, "ANALYZE POSSIBLE MOVES",
                            "ALL MOVES", maximumSteps, thinkingTime, 1, 0.5);

                        // Agent II: The first agent analyzes the first half of all possible moves by using monte carlo tree search (MCTS)
                        self_MetaAgent.assembleAgent(2, "ANALYZE POSSIBLE MOVES",
                            "FIRST HALF OF POSSIBLE MOVES", maximumSteps, thinkingTime, 1, 0.5);

                        // Agent III: The second agent analyzes the second half of all possible moves by using MCTS
                        self_MetaAgent.assembleAgent(3, "ANALYZE POSSIBLE MOVES",
                            "SECOND HALF OF POSSIBLE MOVES", maximumSteps, thinkingTime, 1, 0.5);

                        /*

                         //Agent IV: The third agent looks at moves near fields, occupied by opponent or own entities
                         self_MetaAgent.assembleAgent(4, "ANALYZE POSSIBLE MOVES",
                         "MOVES NEAR OPPONENT OR OWN FIELDS", maximumSteps, thinkingTime, 1, 0.9);

                         //Agent V: The fifth agent tries to analyze all executable moves
                         self_MetaAgent.assembleAgent(5, "ANALYZE POSSIBLE MOVES",
                         "ALL MOVES", maximumSteps, thinkingTime, 1, 0.9);

                         // Agent VI: Based on Alpha-Beta Negamax, the sixth agent searches
                         // for immediate threats near own or opponent occupied fields.
                         // Not really useful for games with large game trees...
                         self_MetaAgent.assembleAgent(4, "SEARCH FOR IMMEDIATE THREATS",
                         "MOVES NEAR OPPONENT OR OWN FIELDS", 1, 0.9);

                         */
                    }
                }
            });

            return true;
        };

        /**
         * Used to measure the decision time of the meta agent
         * @type {number}
         */
        self_MetaAgent.runtimeStart = 0;

        /**
         * Driver for ai methods
         */
        self_MetaAgent.findBestMove = function() {

            // Connect the ai routines with the current game state
            Spoooky.AI.game = self_MetaAgent.getGame();

            // Measure the decision time
            self_MetaAgent.runtimeStart = Date.now();

            // Let the associated agents analyze the possible moves
            self_MetaAgent.askAgentsForDecision();
        };

        /**
         * Asks all of the associated agents for the best turn
         */
        self_MetaAgent.askAgentsForDecision = function() {

            //TESTGAME
            //var uctResults = Spoooky.AI.UCT(self_MetaAgent.getGame(), "ALL", 15000, 1000, false, 0.9, true);

            // Set the number of workers to be used.
            // MUST be identical with the numbers of workers actually used!
            self_MetaAgent.activeAgents = self_MetaAgent.countAgents();

            // Reset the list of best moves
            self_MetaAgent.bestMoves.length = 0;

            Spoooky.AgentLog.pushMessage("Meta agent " + self_MetaAgent.ID + " (" +
            self_MetaAgent.getName() + ") fragt " +
            self_MetaAgent.activeAgents + " assoziierte Agenten nach der besten Zugmoeglichkeit.");

            for (var i = 0; i < self_MetaAgent.agents.length; i++) {
                self_MetaAgent.agents[i].proposeBestMove();
            }
        };

        /**
         * List of best moves, identified by agents
         * @type {Array}
         */
        self_MetaAgent.bestMoves = [];

        /**
         * Prepare / accumulate all agent's move suggestions
         * @param moveSuggestions
         * @returns {Array}
         */
        self_MetaAgent.prepareAgentsMoveSuggestions = function(moveSuggestions) {

            var accumulatedResults = [], mv, x, y,
                saved = false, saveMove, updatedSimSteps,
                updatedVisits, updatedWins, updatedLost, updatedAgentID = [];

            for (x = moveSuggestions.length; x--;) {

                mv = moveSuggestions[x];

                // Check if move mv is already in results array
                for (y = accumulatedResults.length; y--;) {

                    // Found already existing entry
                    if (accumulatedResults[y].moveIndex === mv.moveIndex) {

                        // Update move statistics manually
                        // firefox made me do it this complicated... :(
                        updatedWins = parseInt(accumulatedResults[y].wins + mv.wins);
                        updatedVisits = parseInt(accumulatedResults[y].visits + mv.visits);
                        updatedLost = parseInt(accumulatedResults[y].lost + mv.lost);
                        updatedSimSteps = parseInt(accumulatedResults[y].simulationSteps + mv.simulationSteps);

                        updatedAgentID = accumulatedResults[y].agentID;
                        updatedAgentID.push(mv.agentID);

                        // Manually copy all properties
                        saveMove = {
                            simulationSteps : mv.simulationSteps,
                            moveIndex : mv.moveIndex,
                            agentID : updatedAgentID,
                            visits : updatedVisits,
                            target : mv.target,
                            wins : updatedWins,
                            lost : updatedLost
                        };
                        accumulatedResults[y] = saveMove;
                        saved = true;
                    }
                }

                // Save if not in results array
                if (saved === false) {

                    // Manually copy all properties
                    saveMove = {
                        simulationSteps : mv.simulationSteps,
                        moveIndex : mv.moveIndex,
                        agentID : [mv.agentID],
                        target : mv.target,
                        visits : mv.visits,
                        wins : mv.wins,
                        lost : mv.lost
                    };
                    accumulatedResults.push(saveMove);
                }

                saved = false;
            }
            return accumulatedResults;
        };

        /**
         * Update the fitness of all agents in updateAgents
         * @param updateAgents
         */
        self_MetaAgent.updateAgentsFitness = function(updateAgents) {

            var fitnessChange = 0.5,
                agents = self_MetaAgent.getAgents(),
                done = false, i, j;

            for (i = agents.length; i--;) {

                for (j = updateAgents.length; j--;) {

                    if (agents[i].ID === updateAgents[j]) {

                        agents[i].fitness += fitnessChange;
                        done = true;
                        break;
                    }

                }

                if (done === false) {
                    agents[i].fitness -= fitnessChange;
                }
                done = false;
            }
        };

        /**
         * Identifies and returns the fittest agent of the agent ensemble
         * @returns {*}
         */
        self_MetaAgent.getFittestAgent = function() {

            var agents = self_MetaAgent.getAgents(),
                i, fittest = 0, fittestAgent, current;

            for (i = agents.length; i--;) {

                current = agents[i];
                if (current.fitness >= fittest) {
                    fittest = current.fitness;
                    fittestAgent = current;
                }
            }

            return fittestAgent;
        };

        /**
         * Replace unfit agents with most successful / fittest agents
         */
        self_MetaAgent.replaceUnfitAgents = function() {

            var agents = self_MetaAgent.getAgents(),
                i, fittest = self_MetaAgent.getFittestAgent();

            for (i = agents.length; i--;) {

                // Replace unfit agent
                if (agents[i].fitness < 0.1) {

                    Spoooky.AgentLog.pushMessage("Agent #" + agents[i].ID + " hat eine schlechte Fitness von " +
                    agents[i].fitness + " und fokussiert nun den folgenden Spielaspekt: " +
                    fittest.focus);

                    agents[i].role = fittest.role;
                    agents[i].focus = fittest.focus;
                    agents[i].fitness = 1.0;
                }
            }

            self_MetaAgent.getGame().refreshView();
        };

        /**
         * Update the meta agents q-learning module with simulated agent experience episodes
         * @param agentsLearnProcess
         */
        self_MetaAgent.updateQLearner = function(agentsLearnProcess) {

            var reward, tmpReward, i,
                QLearner = self_MetaAgent.QLearner,
                QLearningResult = JSON.parse(agentsLearnProcess),
                resultStates = QLearningResult.gameStates,
                gameState, gameStateName, actions, action,
                qlearnStates = QLearner.gameStates,
                keys = _.keys(resultStates),
                len = keys.length;

            for (i = 0; i < len; ++i) {

                gameState = resultStates[keys[i]];
                gameStateName = gameState.name;

                if (_.has(qlearnStates, gameStateName)) {

                    // Update each learning episode / executable action
                    actions = gameState.actions;

                    keys = _.keys(actions);
                    len = keys.length;

                    for (i = 0; i < len; i++) {

                        action = actions[keys[i]];

                        // Update rewards if action has already been explored
                        if (_.has(qlearnStates[gameStateName].actions, action.name)) {

                            reward = 0;
                            tmpReward = 0;

                            if (_.has(qlearnStates[gameStateName].actions[action.name], "reward")) {
                                tmpReward = qlearnStates[gameStateName].actions[action.name].reward;
                            }

                            if (_.has(action, "reward")) {
                                reward = action.reward;
                            }

                            // Update reward
                            reward = reward + tmpReward;

                            // Update move indices
                            qlearnStates[gameStateName].actions[action.name] = action;

                            if (reward !== 0) {
                                qlearnStates[gameStateName].actions[action.name].reward = reward;
                            }

                        } else {
                            // Add a new action to the game state
                            qlearnStates[gameState.name].actions[action.name] = action;
                        }

                    }
                } else {
                    // Add a new learning episode to the QLearning module of the meta agent
                    qlearnStates[gameState.name] = gameState;
                }
            }
        };

        /**
         * Temporary storage for monte carlo tree search graphs
         * @type {Array}
         */
        self_MetaAgent.mctsData = [];

        /**
         * Process an agents decision
         * @param agentDecision
         */
        self_MetaAgent.processAgentDecision = function(agentDecision) {

            // Save monte carlo tree search graphs
            self_MetaAgent.mctsData.push({
                "agentID" : agentDecision.agentID,
                "mctsGraph" : agentDecision.mctsGraph,
                "uctConstant" : agentDecision.uctConstant
            });

            // Try to manually garbage collect...
            agentDecision.mctsGraph.length = 0;

            // Save best moves, identified by the current individual agent
            self_MetaAgent.bestMoves.push(agentDecision);

            Spoooky.AgentLog.pushMessage("Agent #" +
            agentDecision.agentID + " hat " + agentDecision.results.length +
            " Zugmoeglichkeiten anhand von " + agentDecision.simCount +
            " Monte Carlo Ausspielungen mit insgesamt " + agentDecision.simSteps +
            " Simulationsschritten analysiert.");

            // Refresh the view after an agent has finished his work
            self_MetaAgent.getGame().refreshView();

            // Update the number of agents which have finished their work
            self_MetaAgent.finishedAgents++;
        };

        /**
         * Check for agents finished thinking
         * @returns {boolean}
         */
        self_MetaAgent.allAgentsHaveFinishedThinking = function() {

            if (self_MetaAgent.finishedAgents === self_MetaAgent.activeAgents) {

                // Reset finished agents
                self_MetaAgent.finishedAgents = 0;
                return true;
            }
            return false;
        };

        /**
         * Sum up the work of all agents
         * @returns {{results: Array, simCount: number, simSteps: number}}
         */
        self_MetaAgent.sumUpAgentsWork = function() {

            // Prepare the results
            var cur, move, decision = {}, simCount = 0, simSteps = 0,
                allResults = [], bestMoves = self_MetaAgent.bestMoves, i, j;

            for (i = bestMoves.length; i--;) {

                move = bestMoves[i];

                simCount += move.simCount;
                simSteps += move.simSteps;

                cur = move.results;

                for (j = cur.length; j--;) {

                    decision = cur[j];
                    decision.agentID = move.agentID;
                    decision.agentRole = move.agentRole;
                    decision.agentFocus = move.agentFocus;
                    allResults.push(decision);
                }

                // Process and save learnt episodes - perform multiagent based learning
                if (self_MetaAgent.learningEnabled) {
                    self_MetaAgent.updateQLearner(move.QLearner);
                }
            }

            // *** Clean up ***
            // This is necessary to prevent the
            // "Converting circular structure to JSON" error in next runs
            self_MetaAgent.bestMoves.length = 0;

            return {
                "results" : allResults,
                "simCount" : simCount,
                "simSteps" : simSteps
            };
        };

        /**
         * Get the best move from the list of agent move suggestions
         * @param data
         * @returns {string}
         */
        self_MetaAgent.getBestMove = function(data) {

            var bestScore = Number.MAX_VALUE, cur, curScore, bestMove = "Random";

            bestScore = Number.MAX_VALUE * -1;

            // Find the best move in data
            for (var i = data.length; i--;) {

                cur = data[i];

                // Exclude unvisited from processing
                if (cur.visits > 0) {

                    // There are many ways to determine the best move:
                    // I. Use win rate as an indicator for the best move
                    // curScore = cur.wins / cur.visits;

                    // II. Use the best explored move
                    curScore = cur.visits;

                    // Maximize both:
                    if (curScore > bestScore) {

                        bestScore = curScore;
                        bestMove = cur;
                    }

                    // Print move details
                    Spoooky.AgentLog.pushMessage(cur.target + " [Agent(en) #" + cur.agentID +
                    "]<ul>" +
                    "<li>Besuche: " + cur.visits + "</li>" +
                        //"<li>Niederlagen: " + cur.lost + "</li>" +
                    "<li>Gewinnhaeufigkeit: " +cur.wins + "</li>" +
                    "<li>Simulationsschritte: " + cur.simulationSteps + "</li>" +
                    "<li>Gewinnrate: " + (cur.wins / cur.visits) + "</li>" +
                        //"<li>Wertung (Niederlagen/Besuch): "+ (cur.lost/cur.visits) + "</li>" +
                    "</ul>");
                }
            }
            return bestMove;
        };

        /**
         * Print a message that all agents have finished their work
         */
        self_MetaAgent.printAgentsFinishedMessage = function() {

            // Delete "thinking" message
            for ( var i = Spoooky.GameProcess.messages.length; i--;) {

                if (Spoooky.GameProcess.messages[i].type === "thinking") {
                    Spoooky.GameProcess.messages.splice(i, 1);
                }
            }
            Spoooky.AgentLog.pushMessage("Alle assoziierten Agenten haben ihre Arbeit beendet.");
        };

        /**
         * Coordinate the individual decisions of associated agents
         * @param results
         */
        self_MetaAgent.coordinateAgentDecisions = function(results) {

            self_MetaAgent.processAgentDecision(results);

            // Clean up
            results.length = 0;

            // Finish processing if all workers have done their work
            if (self_MetaAgent.allAgentsHaveFinishedThinking()) {

                // Track the runtime of the decision process
                var runtimeEnd = Date.now(), decisionTime = (runtimeEnd - self_MetaAgent.runtimeStart) / 1000;

                // Output a message in the game process
                self_MetaAgent.printAgentsFinishedMessage();

                // Sum up agents work
                var allResults = self_MetaAgent.sumUpAgentsWork(),
                    simCount = allResults.simCount, simSteps = allResults.simSteps;

                // Process all move suggestions of the agents
                var accumulatedResults = self_MetaAgent.prepareAgentsMoveSuggestions(allResults.results);

                // Clean up
                allResults.length = 0;

                Spoooky.AgentLog.pushMessage("<strong>" + simCount + " simulierte Spiele " +
                " mit insgesamt " + simSteps + " Simulationsschritten (~" +
                (simSteps / simCount).toFixed(2) + " Schritte/Simulation) in " +
                decisionTime + " Sekunden.</strong>");

                // Save statistics
                Spoooky.Statistics.logEntry(self_MetaAgent.ID, "simCount",
                    self_MetaAgent.getGame().models.moveCounter+1, simCount);
                Spoooky.Statistics.logEntry(self_MetaAgent.ID, "simSteps",
                    self_MetaAgent.getGame().models.moveCounter+1, simSteps);

                accumulatedResults = _.sortBy(accumulatedResults,
                    function(num){ return num.visits; });
                accumulatedResults.reverse();

                // Get the best move of all mcts processed moves
                var bestMove = self_MetaAgent.getBestMove(accumulatedResults);

                // Clean up
                accumulatedResults.length = 0;

                // Perform learning
                if (self_MetaAgent.learningEnabled) {
                    self_MetaAgent.QLearner.learn(10000);
                }

                /*
                 var currentState = self_MetaAgent.getGame().gameWorld.createBoardSignature();
                 var bestAction = self_MetaAgent.QLearner.getBestAction(currentState);
                 console.log('best action', bestAction);
                 */

                if (bestMove === "Random") {

                    // Help! I need more computing time!
                    // Execute a random move if no best move has been found
                    Spoooky.AgentLog.pushMessage("Meta Agent fuehrt einen Zufallszug aus.");
                    self_MetaAgent.getGame().executeRandomMove();
                } else {

                    // Increase the fitness of all agents which proposed the move to be executed
                    self_MetaAgent.updateAgentsFitness(bestMove.agentID);

                    // Replace unfit agents with most successful agent type
                    self_MetaAgent.replaceUnfitAgents();

                    // Execute the best move
                    Spoooky.AgentLog.pushMessage("<strong>Meta Agent hat sich fuer die folgende Zugmoeglichkeit entschieden: " +
                    bestMove.target + "</strong>");
                    self_MetaAgent.getGame().executeArtificialMove(bestMove);
                }

                // Update graph view
                if (self_MetaAgent.mctsData) {
                    self_MetaAgent.getGame().refreshGraphView(self_MetaAgent.mctsData, self_MetaAgent.ID);
                }

                // Update statistics view
                self_MetaAgent.getGame().refreshStatsView(self_MetaAgent.ID);

                // Clean up
                self_MetaAgent.mctsData.length = 0;

                // For testing purposes: Save agentmemory_*.json after artificial turn
                // self_MetaAgent.gameHasEnded();
            }
        };

        /**
         * Artificial Turn of the meta agent
         * Driver for Monte Carlo Methods, AB-Pruning, etc.
         * @returns {*}
         */
        self_MetaAgent.artificialMove = function() {

            Spoooky.GameProcess.pushMessage(self_MetaAgent.getName() + " denkt nach...<br>" +
            '<div class="progress progress-striped active">' +
            '<div class="progress-bar"  role="progressbar" style="width: 100%">'+
            '<span class="sr-only">Ich denke nach...</span></div></div>', "thinking");

            self_MetaAgent.findBestMove();
        };

        /**
         * Has the meta agent got an entity / entities on a game board cell?
         * @param fieldID
         * @param compareOp
         * @returns {boolean}
         */
        self_MetaAgent.hasEntitiesOnFieldWithFieldID = function(fieldID, compareOp) {

            var currentEntity,
                operators = {
                    "<": function(a, b) { return a < b },
                    "<=": function(a, b) { return a <= b },
                    ">": function(a, b) { return a > b },
                    ">=": function(a, b) { return a >= b },
                    "==": function(a, b) { return a == b }
                };

            for (var entityCounter = self_MetaAgent.countEntities(); entityCounter--;) {

                currentEntity = self_MetaAgent.getEntityFromArray(entityCounter);
                if (operators[compareOp](currentEntity.getFieldID(), fieldID)) {
                    return true;
                }
            }
            return false;
        }
    };

    /**
     * Game Entity
     * @constructor
     */
    Spoooky.Entity = function(entityName, entityID, typeID, game) {

        var self_Entity = this;
        var myGame = game;

        /**
         * Flag which can be used in board games where entities are
         * placed to enable placing of an unlimited number of entities
         * @type {boolean}
         */
        self_Entity.unlimitedQuantity = false;

        /**
         * Entity mode
         * MOVE for movable entities
         * PLACE for droppable entities
         * @type {string}
         */
        self_Entity.mode = "MOVE";

        /**
         * If entity mode is PLACE then placeTo defines the destination the entity
         * can be placed on the game board
         * @type {number}
         */
        self_Entity.placeTo = 0;

        /**
         * Get the associated game the entity plays in
         * @returns {*}
         */
        self_Entity.getGame = function() {
            return myGame;
        };

        /**
         * Unique identifier of the entity
         * @type {*}
         */
        self_Entity.ID = entityID;

        /**
         * Get the entity ID
         * @returns {*}
         */
        self_Entity.getID = function() {
            return self_Entity.ID;
        };

        /**
         * Set the unique entity identifier
         * @param newID
         */
        self_Entity.setID = function(newID) {
            self_Entity.ID = newID;
        };

        /**
         * Unique type identifier
         * Necessary to create game state signatures
         * @type {*}
         */
        self_Entity.typeID = typeID;

        /**
         * Get the entity type identifier
         * @returns {*}
         */
        self_Entity.getTypeID = function() {
            return self_Entity.typeID;
        };

        /**
         * Set the unique entity type identifier
         * @param newID
         */
        self_Entity.setTypeID = function(newID) {
            self_Entity.typeID = newID;
        };

        /**
         * Name of the entity
         * @type {*}
         */
        self_Entity.name = entityName;

        /**
         * Entity status
         * @type {boolean}
         */
        self_Entity.enabled = true;

        /**
         * Record moves made by the entity
         * @type {number}
         */
        self_Entity.moveCounter = 0;

        /**
         * Increase the move counter
         */
        self_Entity.increaseMoveCounter = function() {
            self_Entity.moveCounter += 1;
        };

        /**
         * Get the number of moves the entity made
         * @returns {number}
         */
        self_Entity.getMoveCount = function() {
            return self_Entity.moveCounter;
        };

        /**
         * Last successfully executed move of the entity
         * @type {number}
         */
        self_Entity.lastExecutedMove = 0;

        /**
         * Adds a successfully executed move of the entity to its move history
         * @param toX
         * @param toY
         * @param round
         * @param moveType
         */
        self_Entity.addExecutedMove = function(toX, toY, round, moveType) {

            self_Entity.increaseMoveCounter();

            self_Entity.lastExecutedMove = {
                destX : toX,
                destY : toY,
                round : round,
                type : moveType
            };
        };

        /**
         * Retrieve the last executed move
         * @returns {number}
         */
        self_Entity.getLastExecutedMove = function() {
            return self_Entity.lastExecutedMove;
        };

        /**
         * Enables the entity
         */
        self_Entity.enable = function() {
            self_Entity.enabled = true;
        };

        /**
         * Disables the entity
         */
        self_Entity.disable = function() {
            self_Entity.enabled = false;
        };

        /**
         * Set the entity name
         * @param newName
         */
        self_Entity.setName = function(newName) {
            self_Entity.name = newName;
        };

        /**
         * Entity type
         * @type {string}
         */
        self_Entity.type = "default";

        /**
         * Get the type of the entity
         * @returns {string}
         */
        self_Entity.getType = function() {
            return self_Entity.type;
        };

        /**
         * Set the entity type
         * @param entityType
         */
        self_Entity.setType = function(entityType) {
            self_Entity.type = entityType;
        };

        /**
         * Getter for the game world
         * @returns {Object}
         */
        self_Entity.getWorld = function() {
            return self_Entity.getGame().gameWorld;
        };

        /**
         * Checks for an opponent entity at the destination coordinates
         * @param xCoordinate
         * @param yCoordinate
         * @returns {boolean}
         */
        self_Entity.isOpponent = function(xCoordinate, yCoordinate) {

            var cellContent;

            if (self_Entity.getWorld().isValidCoordinate(xCoordinate, yCoordinate)) {

                cellContent = self_Entity.getWorld().peekCell(xCoordinate, yCoordinate);

                // There's an opponent entity at the destination field
                if (cellContent !== false && (cellContent.getMetaPlayerID() !== self_Entity.getMetaPlayerID())) {
                    return true;
                }
                return false;
            }
            return false;
        };

        /**
         * Checks for an empty cell at the destination coordinates
         * @param xCoordinate
         * @param yCoordinate
         * @returns {boolean}
         */
        self_Entity.isEmptyCell = function (xCoordinate, yCoordinate) {

            if (self_Entity.getWorld().isValidCoordinate(xCoordinate, yCoordinate)) {
                return (self_Entity.getWorld().peekCell(xCoordinate, yCoordinate) === false);
            }
            return false;
        };

        /**
         * Visual representation of the entity
         * @type {{type: string, colour: string, imageURL: string}}
         */
        self_Entity.visualRepresentation = {
            type : "",
            colour : "",
            imageURL : ""
        };

        /**
         * Get the visual representation of the entity
         * @returns {string}
         */
        self_Entity.getView = function() {
            return self_Entity.visualRepresentation.imageURL;
        };

        /**
         * Current position of the entity in the game worldj
         * @type {{x: number, y: number}}
         */
        self_Entity.position = {
            x : -1,
            y : -1
        };

        /**
         * Get the position of the entity
         * @returns {{x: number, y: number}}
         */
        self_Entity.getPosition = function() {
            return self_Entity.position;
        };

        /**
         * Get the field identifier of entity's position
         * @returns {*}
         */
        self_Entity.getFieldID = function() {
            return self_Entity.getWorld().getFieldID(self_Entity.position.x, self_Entity.position.y);
        };

        /**
         * Set the position of the entity
         * @param xPos
         * @param yPos
         */
        self_Entity.setPosition = function(xPos, yPos) {
            self_Entity.position.x = xPos;
            self_Entity.position.y = yPos;
        };

        /**
         * Holds temporary stuff
         * @type {{}}
         */
        self_Entity.tmp = {};

        /**
         * Holds coordinates of target entity (for capture move)
         * @type {{x: null, y: null}}
         */
        self_Entity.targeting = { x: null, y: null };

        /**
         * Set the entity's target
         * @param xCoord
         * @param yCoord
         */
        self_Entity.setTarget = function(xCoord, yCoord) {
            self_Entity.targeting.x = xCoord;
            self_Entity.targeting.y = yCoord;
        };

        /**
         * Reset entity's target focus
         */
        self_Entity.unsetTarget = function() {
            self_Entity.targeting.x = null;
            self_Entity.targeting.y = null;
        };

        /**
         * Targets (coordinates) of the entity, i.e.
         * goalTargets : [{ x: 23, y: 15 }, {...}]
         * In the game progress, the entity is anxious to
         * reach those target fields
         * @type {Array}
         */
        self_Entity.goalTargets = [];

        /**
         * Add a goal target
         * @param target
         */
        self_Entity.addGoalTarget = function(target){
            self_Entity.goalTargets.push(target);
        };

        /**
         * Set the entity's goal targets
         * @param targets
         */
        self_Entity.setGoalTargets = function(targets) {
            self_Entity.goalTargets = targets;
        };

        /**
         * Get the goal targets of the entity
         * @returns {Array}
         */
        self_Entity.getGoalTargets = function() {
            return self_Entity.goalTargets;
        };

        /**
         * Set the visual representation of the entity
         * @param representationType
         * @param texture
         */
        self_Entity.setRepresentation = function (representationType, texture) {

            if (representationType === "colour" || representationType === "image") {
                self_Entity.visualRepresentation = {
                    type : representationType,
                    colour : texture,
                    imageURL : texture
                };
            }
        };

        /**
         * ID of the associated entity
         * @type {number}
         */
        self_Entity.associatedWithPlayerID = null;

        /**
         * Set the associated meta player id
         * @param playerID
         */
        self_Entity.setAssociatedPlayerID = function (playerID) {
            self_Entity.associatedWithPlayerID = playerID;
        };

        /**
         * Get the id of the associated meta player
         * @returns {number}
         */
        self_Entity.getMetaPlayerID = function() {
            return self_Entity.associatedWithPlayerID;
        };

        /**
         * Get the name of the entity
         * @returns {*}
         */
        self_Entity.getName = function() {
            return self_Entity.name;
        };

        /**
         * Get the associated meta agent
         * @returns {*}
         */
        self_Entity.getAssociatedPlayer = function() {

            return self_Entity.getGame().getPlayerWhoOwnsEntity(self_Entity.getName());
        };

        /**
         * Say goodbye, entity
         */
        self_Entity.seppuku = function() {

            if (self_Entity.getAssociatedPlayer() !== false) {
                self_Entity.getAssociatedPlayer().deleteEntity(self_Entity.getName());
            }
        };

        /**
         * Check if entity is owned by meta agent with id
         * @param playerID
         * @returns {boolean}
         */
        self_Entity.isOwnedByPlayerID = function(playerID) {
            return (self_Entity.associatedWithPlayerID === playerID);
        };

        /**
         * Translate string coordinates / directions into real directions
         * @param direction
         * @returns {*[]}
         */
        self_Entity.translateDirection = function (direction) {
            var xDir = 0,
                yDir = 0;

            if (typeof(direction) === "object" && (direction instanceof Array)) {
                xDir = direction[0];
                yDir = direction[1];
            } else {
                switch(direction)
                {
                    case "n":
                    case "north":
                        xDir = 0;
                        yDir = -1;
                        break;

                    case "ne":
                    case "northeast":
                        xDir = +1;
                        yDir = -1;
                        break;

                    case "e":
                    case "east":
                    case "right":
                        xDir = +1;
                        yDir = 0;
                        break;

                    case "se":
                    case "southeast":
                        xDir = +1;
                        yDir = +1;
                        break;

                    case "s":
                    case "south":
                        xDir = 0;
                        yDir = +1;
                        break;

                    case "sw":
                    case "southwest":
                        xDir = -1;
                        yDir = +1;
                        break;

                    case "w":
                    case "west":
                    case "left":
                        xDir = -1;
                        yDir = 0;
                        break;

                    case "nw":
                    case "northwest":
                        xDir = -1;
                        yDir = -1;
                        break;

                    default:
                        break;
                }
            }
            return [xDir, yDir];
        };

        /**
         * Moves of the entity
         * @type {Array}
         */
        self_Entity.moves = [];

        /**
         * Add a move
         * @param moveArguments
         */
        self_Entity.addMove = function (moveArguments) {

            var moveDirection = self_Entity.translateDirection(moveArguments.direction),
                xDir = moveDirection[0],
                yDir = moveDirection[1];

            self_Entity.moves.push({
                name        : moveArguments.name,
                type		: moveArguments.type,
                direction	: moveArguments.direction,
                xDirection  : xDir,
                yDirection  : yDir,
                frequency   : moveArguments.frequency,
                conditions  : moveArguments.conditions,
                postMove    : moveArguments.postMove
            });
        };

        /**
         * Get the number of executable moves
         * @returns {Number}
         */
        self_Entity.countPossibleMoves = function() {
            return self_Entity.moves.length;
        };

        /**
         * Count fields with id
         * @param fieldID
         * @returns {Number}
         */
        self_Entity.countFieldsWithID = function(fieldID) {
            return self_Entity.getWorld().getContentOfFieldsWithFieldID(fieldID).length;
        };

        /**
         * Count opponent entities on fields with specific id
         * @param fieldID
         * @param selectedentity
         * @returns {number}
         */
        self_Entity.countOpponentsOnFieldsWithID = function(fieldID, selectedentity) {

            var fieldsToCheck = self_Entity.getWorld().getContentOfFieldsWithFieldID(fieldID),
                opponentCount = 0,
                currententity;

            for (var counter = fieldsToCheck.length; counter--;) {

                currententity = fieldsToCheck[counter];
                if (currententity) {
                    if (currententity.getMetaPlayerID() !== selectedentity.getMetaPlayerID()) {
                        opponentCount += 1;
                    }
                }
            }
            return opponentCount;
        };

        /**
         * Count own entities on fields with specific identifier
         * @param fieldID
         * @param selectedentity
         * @returns {number}
         */
        self_Entity.countOwnOnFieldsWithID = function(fieldID, selectedentity) {

            var fieldsToCheck = self_Entity.getWorld().getContentOfFieldsWithFieldID( fieldID ),
                ownCount = 0,
                currentEntity;

            for (var counter = fieldsToCheck.length; counter--;) {

                currentEntity = fieldsToCheck[counter];
                if (currentEntity) {
                    if (currentEntity.getMetaPlayerID() === selectedentity.getMetaPlayerID()) {
                        ownCount += 1;
                    }
                }
            }
            return ownCount;
        };

        /**
         * Get an entity move with a unique identifier
         * @param moveID
         * @returns {*}
         */
        self_Entity.getMove = function(moveID) {
            if (moveID >= 0 && moveID < self_Entity.countPossibleMoves()) {
                return self_Entity.moves[moveID];
            }
            return false;
        };

        /**
         * Is it possible for the entity to execute a move?
         * @returns {boolean}
         */
        self_Entity.canMove = function() {

            var entityMoves = self_Entity.getMoves();
            // Add Post Move Check
            self_Entity.getGame().performPostMoveChecks(this, entityMoves);
            return ( !_.isEmpty(entityMoves) );
        };

        /**
         * Get all executable moves of the entity
         * @returns {*}
         */
        self_Entity.getMoves = function() {

            var moveCount = self_Entity.countPossibleMoves();

            if (moveCount <= 0) { return false; }

            var moveID, currentMove, frequency, currentX, currentY,
                destX, destY, possibleMoves = [], game = self_Entity.getGame();

            for (var moveCounter = moveCount; moveCounter--;) {

                currentMove = self_Entity.getMove(moveCounter);

                // 2D Move
                if (currentMove.frequency > 0 || currentMove.frequency === "ANY") {

                    frequency = currentMove.frequency;
                    currentX = self_Entity.position.x;
                    currentY = self_Entity.position.y;

                    if (frequency === "ANY") {
                        frequency = 23;
                    }

                    // Check every possible move of the entity
                    for (var freqCnt = 1; freqCnt <= frequency; freqCnt += 1) {

                        destX = currentX + currentMove.xDirection * freqCnt;
                        destY = currentY + currentMove.yDirection * freqCnt;

                        if (self_Entity.getWorld().isEmpty(destX, destY) === false) { break; }

                        // Check every move condition
                        if (game.isLegalMove(self_Entity, currentMove.conditions,
                                currentX, currentY,destX, destY)) {

                            moveID = game.getUniqueMoveID(self_Entity.name, currentMove.name,
                                destX, destY);

                            possibleMoves.push({
                                type : "MOVE",
                                name : currentMove.name,
                                entity: self_Entity,
                                targetX : destX,
                                targetY : destY,
                                moveClass : "move_standard",
                                freq : frequency,
                                ID : moveID,
                                postMove : currentMove.postMove
                            });

                            game.addJobForMoveID({
                                jobID : moveID,
                                jobName : "move game entity",
                                job : "Move Entity",
                                jobArguments : {
                                    "entity" : self_Entity,
                                    "destX" : destX,
                                    "destY" : destY
                                }
                            });

                            if (currentMove.postMove) {

                                _.each(currentMove.postMove, function(postMove) {

                                    game.addJobForMoveID({
                                        jobID : moveID,
                                        jobName : postMove.jobName,
                                        job : postMove.jobFunction,
                                        jobArguments : postMove.jobArguments
                                    });
                                });
                            }
                        }
                    }
                } else if (currentMove.frequency === "DICE") {

                    // *** CHECK DICE MOVES - Currently: Check Backgammon Moves ***
                    var diceValues = game.getDiceBox().getDiceValues(),
                        diceValueCount = diceValues.length,
                        destArray = [],
                        destFieldID = 0,
                        curFieldID = -1,
                        tmpFieldExists = false;

                    currentX = self_Entity.position.x;
                    currentY = self_Entity.position.y;

                    // Backgammon specific: If an entity has got a fieldID then the entity is in the bear off area
                    // and must re-enter the game
                    if (_.isUndefined(self_Entity.tmp.fieldID) === false) {
                        curFieldID = self_Entity.tmp.fieldID;
                        tmpFieldExists = true;
                    } else {
                        curFieldID = self_Entity.getWorld().getFieldID(currentX, currentY);
                    }

                    // Show moves for every dice value
                    for (var curCounter = diceValueCount; curCounter--;) {

                        if (currentMove.direction[1] === "POSITIVE") {
                            destFieldID = parseInt(curFieldID + diceValues[curCounter], 10);
                        } else if (currentMove.direction[1] === "NEGATIVE") {
                            destFieldID = parseInt(curFieldID - diceValues[curCounter], 10);
                        } else {
                            // ToDo Implement both directions
                        }

                        if (currentMove.type === "By Field ID") {

                            // Legal move to an empty field - Backgammon specific
                            if (self_Entity.countOpponentsOnFieldsWithID(destFieldID, self_Entity) === 0) {

                                destArray = self_Entity.getWorld().getFreeFieldsWithFieldID(destFieldID);

                                if (destArray[0]) {
                                    destX = destArray[0][0];
                                    // For Backgammon: put game entity on top or on bottom
                                    if (destFieldID <= 12) {
                                        destY = destArray[parseInt(destArray.length-1, 10)][1];
                                    } else {
                                        destY = destArray[0][1];
                                    }

                                    // Legal Move Found
                                    moveID = game.getUniqueMoveID(self_Entity.name,
                                        currentMove.name, destX, destY);

                                    possibleMoves.push({
                                        type : "DICE",
                                        diceID : curCounter,
                                        diceValue : diceValues[curCounter],
                                        name : currentMove.name,
                                        entity: self_Entity,
                                        targetX : destX,
                                        targetY : destY,
                                        moveClass : "move_standard",
                                        freq : "DICE",
                                        ID : moveID,
                                        postmove : currentMove.postMove
                                    });

                                    if (tmpFieldExists === true) {

                                        game.addJobForMoveID({
                                            jobID : moveID,
                                            jobName : "Put the entity to the destination field",
                                            job : "Place Entity",
                                            jobArguments : { entity : self_Entity,
                                                xPosition : destX, yPosition : destY }
                                        });

                                        game.addJobForMoveID({
                                            jobID : moveID,
                                            jobName : "Remove the current entity from off board area",
                                            job : "Delete Entity from OffBoard",
                                            jobArguments : { entity : self_Entity }
                                        });

                                    } else {

                                        game.addJobForMoveID({
                                            jobID : moveID,
                                            jobName : "move game entity",
                                            job : "Move Entity",
                                            jobArguments : {
                                                "entity" : self_Entity,
                                                "destX" : destX,
                                                "destY" : destY
                                            }
                                        });
                                    }

                                    game.addJobForMoveID({
                                        jobID : moveID,
                                        jobName : "Delete Dice Value",
                                        job : "Delete Dice Value",
                                        jobArguments : curCounter
                                    });

                                    if (currentMove.postMove) {
                                        _.each(currentMove.postMove, function(postMove) {
                                            game.addJobForMoveID({
                                                jobID : moveID,
                                                jobName : postMove.jobName,
                                                job : postMove.jobFunction,
                                                jobArguments : postMove.jobArguments
                                            });
                                        });
                                    }
                                } else if (self_Entity.countOwnOnFieldsWithID(destFieldID, self_Entity) ===
                                    self_Entity.countFieldsWithID(destFieldID)) {

                                    // *** Destination Field Full - Put the entity on top of own entitys ***
                                    var fields = self_Entity.getWorld().getFieldsWithFieldID(destFieldID);

                                    if (fields[0]) {
                                        destX = fields[0].position.x;
                                        if (destFieldID <= 12) {
                                            destY = fields[0].position.y;
                                        } else {
                                            destY = fields[parseInt(fields.length-1, 10)].position.y;
                                        }

                                        // Prepare Legal Move
                                        moveID = game.getUniqueMoveID(self_Entity.name,
                                            currentMove.name, destX, destY);

                                        possibleMoves.push({
                                            type : "DICE",
                                            diceValue : diceValues[curCounter],
                                            name : currentMove.name,
                                            entity: self_Entity,
                                            targetX : destX,
                                            targetY : destY,
                                            moveClass : "move_standard",
                                            freq : "DICE",
                                            ID : moveID,
                                            postmove : currentMove.postMove
                                        });

                                        game.addJobForMoveID({
                                            jobID : moveID,
                                            jobName : "move game entity",
                                            job : "Move Entity",
                                            jobArguments : {
                                                "entity" : self_Entity,
                                                "destX" : destX,
                                                "destY" : destY
                                            }
                                        });

                                        game.addJobForMoveID({
                                            jobID : moveID,
                                            jobName : "Delete Dice Value",
                                            job : "Delete Dice Value",
                                            jobArguments : curCounter
                                        });

                                        if (currentMove.postMove) {
                                            _.each(currentMove.postMove, function(postMove) {

                                                game.addJobForMoveID({
                                                    jobID : moveID,
                                                    jobName : postMove.jobName,
                                                    job : postMove.jobFunction,
                                                    jobArguments : postMove.jobArguments
                                                });
                                            });
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
                // *** / CHECK DICE MOVES - Currently: Check Backgammon Moves ***
            }
            return possibleMoves;
        };

        /**
         * Can the entity reach a goal?
         * @returns {boolean}
         */
        self_Entity.canReachGoal = function() {
            return (!_.isEmpty(self_Entity.getGoalMoves()));
        };

        /**
         * Can the entity capture an opponent entity?
         * @returns {boolean}
         */
        self_Entity.canCapture = function() {

            var goalMoves = self_Entity.getGoalMoves();

            for (var counter = goalMoves.length; counter--;) {
                if (goalMoves[counter].type === "CAPTURE") { return true; }
            }
            return false;
        };

        /**
         * Is it possible for the entity to capture an opponent entity at a specific position?
         * @param xPosition
         * @param yPosition
         * @returns {boolean}
         */
        self_Entity.canCaptureAt = function(xPosition, yPosition) {

            var captureMoves = self_Entity.getGoalMoves(),
                counter,
                move;

            for (counter = captureMoves.length; counter--;) {

                move = captureMoves[counter];

                if (move.type === "CAPTURE" &&
                    xPosition === move.targetX &&
                    yPosition === move.targetY) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Get all the goal moves of the entity
         * @param stdMoves
         * @returns {Array}
         */
        self_Entity.getGoalMoves = function(stdMoves) {

            var currentGoal, moveID, targetX, targetY,
                goalCount = self_Entity.countGoals(),
                currentX, currentY,
                moveDirection = null,
                goalMoves = [],
                entityMoves, moveCount, move,
                target, curGoalID, i,
                game = self_Entity.getGame();

            if (stdMoves) {
                entityMoves = stdMoves;
            } else {
                entityMoves = self_Entity.getMoves();
            }

            currentX = self_Entity.position.x;
            currentY = self_Entity.position.y;

            // *****
            // Identify goal moves for board games without dices
            // *****
            if (game.models.DiceBox.isEnabled === false) {

                // Check initial position of the entity
                for (curGoalID = goalCount; curGoalID--;) {

                    currentGoal = self_Entity.getGoal(curGoalID);
                    if (self_Entity.executeGoalByName(currentGoal.name) === true) {

                        // Save capturable opponent in capture table
                        moveDirection = self_Entity.translateDirection(currentGoal.move);

                        targetX = parseInt(currentX + moveDirection[0], 10);
                        targetY = parseInt(currentY + moveDirection[1], 10);

                        moveID = game.getUniqueMoveID(self_Entity.name,
                            currentGoal.name, targetX, targetY);

                        goalMoves.push({
                            ID : moveID,
                            type : currentGoal.type,
                            entity : self_Entity,
                            name : currentGoal.name,
                            preArrangeX : parseInt(currentX, 10),
                            preArrangeY : parseInt(currentY, 10),
                            targetX : targetX,
                            targetY : targetY,
                            moveClass : "move_goal"
                        });
                    }
                }

                moveCount = entityMoves.length;
                for (i = moveCount; i--;) {

                    move = entityMoves[i];

                    if (move.freq > 1) {

                        // Move entity to destination cell
                        game.doVirtualMove(self_Entity.position.x, self_Entity.position.y,
                            move.targetX, move.targetY);

                        currentX = move.targetX;
                        currentY = move.targetY;

                        for (curGoalID = goalCount; curGoalID--;) {

                            currentGoal = self_Entity.getGoal(curGoalID);
                            if (currentGoal.move === move.name) {

                                if (self_Entity.executeGoalByName(currentGoal.name) === true) {

                                    // Save capturable opponent in capture table
                                    moveDirection = self_Entity.translateDirection(currentGoal.move);

                                    targetX = parseInt(currentX + moveDirection[0], 10);
                                    targetY = parseInt(currentY + moveDirection[1], 10);

                                    moveID = game.getUniqueMoveID(self_Entity.name,
                                        currentGoal.name, targetX, targetY);

                                    goalMoves.push({
                                        ID : moveID,
                                        type : currentGoal.type,
                                        entity : self_Entity,
                                        name : currentGoal.name,
                                        preArrangeX : parseInt(currentX, 10),
                                        preArrangeY : parseInt(currentY, 10),
                                        targetX : targetX,
                                        targetY : targetY,
                                        moveClass : "move_goal"
                                    });
                                }
                            }
                        }
                        // Rewind virtual move
                        game.undoVirtualMove();
                    }
                }
            } else {

                // *****
                // Identify capture moves for board games with dices
                // *****

                // *** CHECK DICE CAPTURE MOVES - Currently: Check Backgammon Moves ***
                var diceValues = game.getDiceBox().getDiceValues(),
                    diceValueCount = diceValues.length,
                    destFieldID = 0,
                    curFieldID = self_Entity.getWorld().getFieldID(currentX, currentY),
                    destination, curCounter;

                // Backgammon specific: If an entity has got a fieldID then the entity is in
                // the bear off area and must re-enter the game
                if (_.isUndefined(self_Entity.tmp.fieldID) === false) {
                    curFieldID = self_Entity.tmp.fieldID;
                }

                // ToDo Reversed for-loops. Check.
                // Check goal moves for every dice value
                for (curCounter = diceValueCount; curCounter--;) {

                    for (curGoalID = goalCount; curGoalID--;) {

                        currentGoal = self_Entity.getGoal(curGoalID);
                        destination = null;

                        if (self_Entity.executeGoalByName(currentGoal.name, diceValues[curCounter]) === true) {

                            // Backgammon-specific
                            if (currentGoal.move === "BEAR OFF MOVE") {

                                // Target Area of the current bear off move (i.e. "player1BearOffArea")
                                target = currentGoal.area;

                                moveID = game.getUniqueMoveID(self_Entity.name,
                                    currentGoal.name, target, "bearoff");

                                game.setMoveID(moveID);

                                // Connect this move with the current dice value (ID)
                                game.getDiceBox().
                                    connectMoveIDWithDiceValue(moveID, curCounter, target);

                                // ...so that mechanisms which will executed "immediately" know where to apply

                                goalMoves.push({
                                    ID : moveID,
                                    type : "DICE",
                                    entity: self_Entity,
                                    name : currentGoal.name,
                                    diceID : curCounter,
                                    diceValue : diceValues[curCounter],
                                    targetArea : target,
                                    moveClass : "move_bearoff"
                                });

                                // Connect this moveID with offBoard Area
                                game.getArea(target).moveID = game.models.moveID;

                            } else {

                                // Standard goal move
                                if (currentGoal.move === "MOVE POSITIVE") {
                                    destFieldID = parseInt(curFieldID + diceValues[curCounter], 10);
                                } else if (currentGoal.move === "MOVE NEGATIVE") {
                                    destFieldID = parseInt(curFieldID - diceValues[curCounter], 10);
                                }

                                // Save coordinates of capturable opponent entity:
                                // Get coordinates of the first element of the stack
                                var contents = self_Entity.getWorld().getContentOfFieldsWithFieldID(destFieldID);
                                destination = _.first(contents);

                                if (destination === 0 ) {
                                    destination = _.last(contents);
                                }

                                // Identify target coordinates
                                target = { x: destination.position.x, y: destination.position.y };

                                moveID = game.getUniqueMoveID(self_Entity.name,
                                    currentGoal.name, target.x, target.y);

                                game.setMoveID(moveID);

                                // Connect this move with the current dice value (ID)
                                game.getDiceBox().connectMoveIDWithDiceValue(moveID, curCounter, target);
                                // ...so that mechanisms which will executed "immediately" know where to apply

                                goalMoves.push({
                                    ID : moveID,
                                    name : currentGoal.name,
                                    entity: self_Entity,
                                    type : "DICE",
                                    diceValue : diceValues[curCounter],
                                    diceID : curCounter,
                                    targetX : parseInt(target.x, 10),
                                    targetY : parseInt(target.y, 10),
                                    moveClass : "move_goal"
                                });
                            }
                        }
                    }
                }
            }
            return goalMoves;
        };

        /**
         * Check if current entity can be captured by an opponent entity
         * @returns {boolean}
         */
        self_Entity.canBeCaptured = function() {

            var opponentPlayer = self_Entity.getAssociatedPlayer().getNextOpponentPlayer(),
                opponentEntityCount = opponentPlayer.countEntities(),
                opEntities = opponentPlayer.getEntities(),
                counter;

            for (counter = opponentEntityCount; counter--;) {
                if (opEntities[counter].canCaptureAt(self_Entity.position.x, self_Entity.position.y) === true) {
                    return true;
                }
            }
            return false;
        };

        /**
         * Entity goals
         * @type {Array}
         */
        self_Entity.goals = [];

        /**
         * Assemble an entity goal
         * @param newGoal
         */
        self_Entity.assembleGoal = function(newGoal) {
            self_Entity.goals.push(newGoal);
        };

        /**
         * Get an entity goal with an id
         * @param goalID
         * @returns {*}
         */
        self_Entity.getGoal = function(goalID) {
            if (goalID >= 0 && goalID < self_Entity.goals.length) {
                return self_Entity.goals[goalID];
            }
            return false;
        };

        /**
         * Count the number of entity goals
         * @returns {Number}
         */
        self_Entity.countGoals = function() {
            return self_Entity.goals.length;
        };

        /**
         * Execute an entity goal with a specific goal name
         * @param goalName
         * @param additionalArgument
         * @returns {boolean}
         */
        self_Entity.executeGoalByName = function(goalName, additionalArgument) {

            if (self_Entity.enabled === false) { return false; }

            var count = self_Entity.goals.length,
                goalCounter;

            for (goalCounter = 0; goalCounter < count; goalCounter += 1) {
                if (self_Entity.goals[goalCounter].name === goalName) {

                    var returnValue = true,
                        atomCounter = 0,
                        goalAtoms = self_Entity.goals[goalCounter].atoms,
                        goalAtomCount = goalAtoms.length;

                    for (atomCounter = 0; atomCounter < goalAtomCount; atomCounter += 1) {
                        returnValue = self_Entity.getGame().
                            executeEntityGoalAtomByName(self_Entity, goalAtoms[atomCounter], additionalArgument);
                        if (returnValue === false || returnValue === -1) {
                            return false;
                        }
                    }
                    return true;
                }
            }
            return false;
        };

        /**
         * Array of entity goal atoms
         * @type {Array}
         */
        self_Entity.goalAtoms = [];

        /**
         * Add a goal atom
         * @param goalAtomName
         * @param goalAtomFunctionName
         * @param goalAtomArguments
         */
        self_Entity.addGoalAtom = function(goalAtomName, goalAtomFunctionName, goalAtomArguments) {
            self_Entity.goalAtoms.push({ atomName: goalAtomName, atomFunction: goalAtomFunctionName, atomArguments: goalAtomArguments });
        };
    };
})();