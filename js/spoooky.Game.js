/**
 * Spoooky.js - A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods
 *
 * @author Jan Gerrit Wieners <jan@jan-wieners.de>
 *
 * Copyright (c) Jan G. Wieners; Licensed under the MIT License
 *
 * http://www.spoookyjs.de, https://github.com/janwieners/spoookyjs
 **/

/**
 * Spoooky.Game
 * Core of SpoookyJS: the game class
 *
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
     */
    self_Game.models;

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
     * @param quantity {number}
     */
    self_Game.addBlueprint = function(player, blueprint, quantity) {

        // Add the blueprint to the game model
        self_Game.models.Blueprints[blueprint.entityType] = _.clone(blueprint);

        if (player) {

            // Associate the blueprint / entity with a meta agent / player
            player.associateEntity(self_Game.models.Blueprints[blueprint.entityType], quantity);
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
            ruleAtoms = 0, atomCounter,
            ruleAtomCount = 0;

        for (var goalCounter = 0; goalCounter < count; goalCounter += 1) {

            if (self_Game.models.GameRules[goalCounter].name === gameRuleName) {

                returnValue = true;
                ruleAtoms = self_Game.models.GameRules[goalCounter].atoms;
                ruleAtomCount = ruleAtoms.length;

                for (atomCounter = 0; atomCounter < ruleAtomCount; atomCounter += 1) {

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

        self_Game.models.GameRuleAtoms.push({
            atomName: newRuleAtom.atomName,
            atomFunction: newRuleAtom.atomFunction,
            atomArguments: newRuleAtom.atomArguments,
            atomCondition: newRuleAtom.atomCondition,
            atomConnector: newRuleAtom.atomConnector
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

            // Ignore off board entitys
            if (_.isUndefined(entity.tmp.fieldID) === false) {
                return false;
            }

            var destFieldID = 0,
                currentX = entity.position.x,
                currentY = entity.position.y,
                moveDirection = atom.atomArguments[0],
                curFieldID = entity.getGame().gameWorld.getFieldID(currentX, currentY);

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

        "All players have placed their entities on the game board": function() {

            var players = self_Game.getPlayers(),
                entities, cnt;

            for (var i = players.length; i--;) {

                entities = players[i].getEntities();

                for (cnt = entities.length; cnt--;) {

                    if (!entities[cnt].onBoard) {

                        return false;
                    }
                }
            }
            return true;

        },

        // Game rule atom for the game of nine men's morris
        "Player Has Entities On Nearby Connected Fields After Last Move": function(currentRuleAtom) {

            var cellCluster = currentRuleAtom.atomArguments,
                world = self_Game.gameWorld, cell, content,
                rcntPosition = self_Game.getrecentlyMovedEntity().position, success,
                cells, j, k, playerID = self_Game.models.recentlyMovedEntity.playerID,
                rcntCellID = self_Game.models.GameGrid[rcntPosition.y][rcntPosition.x].cellID;

            // Process all fields in atomArguments
            // e.g. atomArguments : [[1, 2, 3], [4, 5, 6]]
            for (var i = cellCluster.length; i--;) {

                cells = cellCluster[i];

                // cells = [1, 2, 3];
                for (j = cells.length; j--;) {

                    // cellID, e.g. 1, 2, 3
                    cell = cells[j];

                    success = true;

                    // Is the recently placed entity on a field with ID cell?
                    if (rcntCellID === cell) {

                        // Check for players entities on other fields ([1, 2, 3])
                        for (k = cells.length; k--;) {

                            content = world.getFieldsWithFieldID(cells[k], true);

                            if (content.contains.length > 0) {

                                // Check only the first element on the stack
                                if (content.contains[0].playerID !== playerID) {
                                    success = false;
                                    break;
                                }
                            } else {
                                // Empty field
                                success = false;
                                break;
                            }
                        }

                        // All entities are on specific fields
                        if (success) {
                            return true;
                        }
                    }

                }
            }
            return false;
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

        return entityName + "_" + moveName + "_" + xPos + "|" + yPos;
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

            var len = captureMoves.length;

            for (cnt = len; cnt--;) {

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
            metaAgent, x,
            newEntity = null, gbConfig,
            gridRows = self_Game.gameWorld.getRows(),
            gridColumns = self_Game.gameWorld.getColumns();

        for (var y = 0; y < gridRows; y += 1) {
            for (x = 0; x < gridColumns; x += 1) {

                gbConfig = gameBoardConfiguration[counter];
                if (gbConfig !== 0) {

                    metaAgent = self_Game.getPlayerWithID(gbConfig.associatedWithMetaAgent);
                    newEntity = metaAgent.entityFactory(gbConfig);

                    if (!newEntity.unlimitedQuantity) {

                        // Add a flag to signalize that this entity has been placed on the game board
                        newEntity.onBoard = true;
                    }

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

        // Create Entities for players
        var metaAgent = self_Game.getPlayerWithID(bluePrint.associatedWithMetaAgent);

        // Use a finite number of entites...
        if (quantity) {

            bluePrint.unlimitedQuantity = false;
            for (var counter = quantity; counter--;) {
                metaAgent.entityFactory(bluePrint);
            }
        } else {
            // Or give the player an undefined number of entities
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