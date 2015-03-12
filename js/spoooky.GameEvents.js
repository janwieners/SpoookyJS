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
 * Spoooky.GameEvents
 * Executes predefined game events / delegates game events to the game
 * @constructor
 */
Spoooky.GameEvents = {

    /**
     * List of executable game events
     */
    events : {

        /**
         * Roll all dices
         * @param gameEvent
         * @param game
         */
        "Roll Dices" : function(gameEvent, game) {
            game.getDiceBox().rollAllDices();
        },

        /**
         * Roll Backgammon Dices
         * Check doublets and double dice values
         * @param gameEvent
         * @param game
         */
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

        /**
         * Delete a dice value
         * @param gameEvent
         * @param game
         */
        "Delete Dice Value" : function(gameEvent, game) {
            game.getDiceBox().deleteDiceValue(gameEvent.jobArguments);
        },

        /**
         * Deletes the dice value of the specific move
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
        "Delete Assigned Dice Value" : function(gameEvent, game) {

            if (game.getDiceBox().getConnectedDiceValue(gameEvent.jobID) === false) {
                return false;
            }
            game.getDiceBox().deleteDiceValue(game.getDiceBox().getConnectedDiceValue(gameEvent.jobID).diceValueID);
            return true;
        },

        /**
         * Bear of a game entity at a dice target cell
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
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

        /**
         * Show Backgammon Re-entering moves
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
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

        /**
         * Delete a game entity from the off board area
         * @param gameEvent
         * @param game
         */
        "Delete Entity from OffBoard" : function(gameEvent, game) {

            // Reset temporary field id
            delete gameEvent.jobArguments.entity.tmp.fieldID;
            game.offBoard.deleteEntityFromOffBoard(gameEvent.jobArguments.entity.name);
        },

        /**
         * Place an entity
         * @param gameEvent
         * @param game
         */
        "Place Entity" : function(gameEvent, game) {

            var tmp = gameEvent.jobArguments.entity,
                entity = game.getPlayerWithID(tmp.associatedWithPlayerID).
                    getEntityWithID(tmp.ID), jobArgs = gameEvent.jobArguments;

            // Count down the number of placeable entities of the current player
            if (!entity.unlimitedQuantity) {

                // Add a flag to signalize that this entity has been placed on the game board
                entity.onBoard = true;
            }

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

        /**
         * Move an entity to the dice destination cell
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
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

        /**
         * Prearrange an entity
         * @param gameEvent
         * @param game
         */
        "Prearrange Entity" : function(gameEvent, game) {

            var jobArgs = gameEvent.jobArguments,
                entityPosition = jobArgs.entity.position;

            game.models.moveCounter += 1;

            game.moveEntity(entityPosition.x, entityPosition.y,
                jobArgs.destX, jobArgs.destY);
        },

        /**
         * Move a game entity
         * @param gameEvent
         * @param game
         */
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

        /**
         * Move a game entity by a dice value
         * @param gameEvent
         * @param game
         */
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

        /**
         * Move a game entity relative to another entity
         * @param gameEvent
         * @param game
         */
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

        /**
         * Prevent player change
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
        "Prevent Player Change" : function(gameEvent, game) {
            game.models.playerChange = false;
            return true;
        },

        /**
         * Enable changing of players
         * @param gameEvent
         * @param game
         */
        "Enable Player Change" : function(gameEvent, game) {
            game.models.playerChange = true;
        },

        /**
         * Proceed the game
         * @param gameEvent
         * @param game
         */
        "Proceed Game" : function(gameEvent, game) {
            game.proceed();
        },

        /**
         * Change the game mode
         * @param gameEvent
         * @param game
         */
        "Change Game Mode" : function(gameEvent, game) {

            var mode = gameEvent.jobArguments.mode;

            if (mode === "PLACING" ||
                mode === "MOVING") {
                game.setGameMode(mode);
            } else {
                console.log("Error: Wrong Game Mode", mode);
            }
        },

        /**
         * Delete a game rule
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
        "Delete Game Rule" : function(gameEvent, game) {

            // Delete a game rule but maintain associated game rule atoms
            var rules = game.models.GameRules,
                i = rules.length, ruleName = gameEvent.jobArguments.ruleName;

            for (; i--;) {

                // Assume that a game rule is unique
                if (ruleName === rules[i].name) {

                    game.models.GameRules.splice(i, 1);
                    return true;
                }
            }

            // No game rule with ruleName has been found
            return false;

        },

        /**
         * Capture an opponent game entity at a specific position
         * @param gameEvent
         * @param game
         */
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

        /**
         * Highlight the target cell of a dice move
         * @param gameEvent
         * @param game
         */
        "Highlight Dice Target Cell" : function(gameEvent, game) {

            game.highlightCell(gameEvent.entityLink.targeting.x, gameEvent.entityLink.targeting.y,
                gameEvent.jobArguments, gameEvent.jobID);
        },

        /**
         * Highlight an area
         * @param gameEvent
         * @param game
         */
        "Highlight Area" : function(gameEvent, game) {
            game.getArea(gameEvent.jobArguments.areaName).display = gameEvent.jobArguments.highlightClass;
        },

        /**
         * Highligh a cell
         * @param gameEvent
         * @param game
         */
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

        /**
         * Set the game state
         * @param gameEvent
         * @param game
         */
        "Set Game State" : function(gameEvent, game) {
            game.setGameState(gameEvent.jobArguments);
        },

        /**
         * Restrict the selectable game entities
         * @param gameEvent
         * @param game
         */
        "Restrict Selectable Entities" : function(gameEvent, game) {
            game.models.SelectRestrictions.entities = gameEvent.jobArguments;
        },

        /**
         * Restrict to specific entity moves
         * @param gameEvent
         * @param game
         */
        "Restrict Selectable Entity Moves" : function(gameEvent, game) {
            game.models.SelectRestrictions.moves = gameEvent.jobArguments;
        },

        /**
         * Delete a game entity a specific coordinates
         * @param gameEvent
         * @param game
         */
        "Delete This Entity" : function(gameEvent, game) {
            game.deleteEntityAt(gameEvent.entityLink.position.x,
                gameEvent.entityLink.position.y);
        },

        /**
         * Increment the number of entities in the off board area
         * @param gameEvent
         * @param game
         */
        "Increment Off Board Counter" : function(gameEvent, game) {
            game.areas.incrementElements(gameEvent.jobArguments);
        },

        /**
         * Transform a game entity
         * @param gameEvent
         * @param game
         */
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

        /**
         * Traansform a game entity if a specific row on the game board has been reached
         * @param gameEvent
         * @param game
         * @returns {boolean}
         */
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

        /**
         * Set the next player as active player
         * @param gameEvent
         * @param game
         */
        "Next Player" : function(gameEvent, game) {
            game.setNextPlayer();
        },

        /**
         * Delete all dice values
         * @param gameEvent
         * @param game
         */
        "Delete All Dice Values" : function(gameEvent, game) {
            game.getDiceBox().deleteAllDiceValues();
        },

        /**
         * Display a message in an alert popup
         * @param gameEvent
         */
        "alert" : function(gameEvent) {
            alert(gameEvent.jobArguments);
        },

        /**
         * Print a message in the game process interface
         * @param gameEvent
         * @param game
         */
        "Print Game Process" : function(gameEvent, game) {

            if (game.models.playVirtual === false) {
                Spoooky.GameProcess.pushMessage(gameEvent.jobArguments);
            }
        },

        /**
         * Stop the game
         * @param gameEvent
         * @param game
         */
        "Stop Game" : function(gameEvent, game) {

            game.setGameState("END");
            if (game.models.playVirtual === false) {
                game.informArtificialPlayersAboutGameEnd();
            }
        },

        /**
         * Set the winner of the game
         * @param gameEvent
         * @param game
         */
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