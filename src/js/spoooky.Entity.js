/**
 * Spoooky.Entity
 * Entities of the game
 *
 * @param entityName
 * @param entityID
 * @param typeID
 * @param game
 * @constructor
 */
Spoooky.Entity = function(entityName, entityID, typeID, game) {

    var self_Entity = this,
        myGame = game;

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

        var position = self_Entity.position;
        return self_Entity.getWorld().getFieldID(position.x, position.y);
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

            switch(direction) {
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
     * !Performance critical!
     * @returns {*}
     */
    self_Entity.getMoves = function() {

        var moveCount = self_Entity.countPossibleMoves();

        if (moveCount <= 0) { return false; }

        var moveID, currentMove, frequency, currentX, currentY, freqCnt, position,
            destX, destY, possibleMoves = [], game = self_Entity.getGame();

        position = self_Entity.position;
        currentX = position.x;
        currentY = position.y;

        for (var moveCounter = moveCount; moveCounter--;) {

            currentMove = self_Entity.getMove(moveCounter);

            switch (currentMove.type) {

                // Default 2D move
                case "Default":

                    if (currentMove.frequency > 0 || currentMove.frequency === "ANY") {

                        frequency = currentMove.frequency;

                        if (frequency === "ANY") {
                            frequency = 23;
                        }

                        // Check every possible move of the entity
                        for (freqCnt = 1; freqCnt <= frequency; freqCnt += 1) {

                            destX = currentX + currentMove.xDirection * freqCnt;
                            destY = currentY + currentMove.yDirection * freqCnt;

                            if (self_Entity.getWorld().isEmpty(destX, destY) === false) { break; }

                            // Check every move condition
                            if (game.isLegalMove(self_Entity, currentMove.conditions,
                                    currentX, currentY, destX, destY)) {

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
                    }

                    break;
                // End case "Default"

                // Move to connected field(s)
                case "By Connected Field IDs":

                    // All cell connections
                    var connections = game.models.CellConnections;

                    // Identify the ID of the current cell and get the target cells
                    var cellID = game.models.GameGrid[currentY][currentX].cellID,
                        targetCells = connections[cellID], targetCell;

                    for (var i = targetCells.length; i--;) {

                        // Use only the first retrieved cell
                        targetCell = self_Entity.getWorld().getFieldsWithFieldID(targetCells[i], true);

                        destX = targetCell.position.x;
                        destY = targetCell.position.y;

                        if (self_Entity.getWorld().isEmpty(destX, destY) === false) { continue; }

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

                    break;
                // End case "By Connected Field IDs"

                // Check dice moves - Currently: Check Backgammon Moves
                case "By Field ID":

                    if (currentMove.frequency === "DICE") {

                        // *** CHECK DICE MOVES - Currently: Check Backgammon Moves ***
                        var diceValues = game.getDiceBox().getDiceValues(),
                            diceValueCount = diceValues.length,
                            destArray = [],
                            destFieldID = 0,
                            curFieldID = -1,
                            tmpFieldExists = false;

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
                    break;
                // End of case "By Field ID"

                case "Jump To Free Field":

                    var freeCells = self_Entity.getWorld().getFreeCells(),
                        i = freeCells.length;

                    // Add a move for each free cell
                    for (; i--;) {

                        destX = freeCells[i].x;
                        destY = freeCells[i].y;

                        // Check every move condition
                        if (game.isLegalMove(self_Entity, currentMove.conditions,
                                currentX, currentY, destX, destY)) {

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
                    break;
                    // End of case "Jump To Free Field"
            }
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
        if (!game.models.DiceBox.isEnabled) {

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
            counter, position;

        for (counter = opponentEntityCount; counter--;) {

            position = self_Entity.position;
            if (opEntities[counter].canCaptureAt(position.x, position.y) === true) {
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
            goalCounter, goals = self_Entity.goals;

        for (goalCounter = 0; goalCounter < count; goalCounter += 1) {
            if (goals[goalCounter].name === goalName) {

                var returnValue = true,
                    atomCounter = 0,
                    goalAtoms = goals[goalCounter].atoms,
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

        self_Entity.goalAtoms.push({
            atomName: goalAtomName,
            atomFunction: goalAtomFunctionName,
            atomArguments: goalAtomArguments
        });
    };
};