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
 * Spoooky.MetaAgent
 * Every game is played by a number of different meta agents (the players of the game).
 * Those meta agents own (sub)-agents which focus different aspects of the game
 * And are used by the Meta Agent to decide for the best move
 *
 * @param game
 * @constructor
 */
Spoooky.MetaAgent = function(game) {

    var self_MetaAgent = this,
        myGame = game;

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
    self_MetaAgent.associateEntity = function(entity, quantity) {

        // Associate the entity with the meta agent
        entity.associatedWithMetaAgent = self_MetaAgent.ID;

        // Add placeable entity to the game
        if (entity.mode === "PLACE") {
            self_MetaAgent.getGame().addEntityToGame(entity, quantity);
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

        var returnEntities = [], cur,
            index = self_MetaAgent.countEntities(),
            metaID = self_MetaAgent.ID;

        for (; index--;) {

            cur = myGame.models.Entities[metaID][index];

            if (cur.mode === "PLACE") {

                // If there's an unlimited number of agent's entities...
                if (cur.unlimitedQuantity) {
                    // ...then add this entity to the game board
                    returnEntities.push(cur);
                } else {

                    // Otherwise check if current entity is already on the game board
                    if (!cur.onBoard) {
                        returnEntities.push(cur);
                    }
                }

            }
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