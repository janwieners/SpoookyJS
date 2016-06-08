"use strict";

/**
 * Spoooky.OffBoard
 * Controller for Spoooky.Models.OffBoardContent
 *
 * @param game
 * @constructor
 */
Spoooky.OffBoard = function(game) {

    var self_OffBoard = this,
        myGame = game;

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