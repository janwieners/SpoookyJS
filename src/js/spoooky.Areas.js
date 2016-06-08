"use strict";

/**
 * Spoooky.Areas
 * Controller for Spoooky.Models.Areas
 *
 * @param game
 * @constructor
 */
Spoooky.Areas = function(game) {

    var self_Areas = this,
        myGame = game;

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