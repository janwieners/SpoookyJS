"use strict";

/**
 * Spoooky.DiceBox
 * Controller for Spoooky.Models.DiceBox
 *
 * @param game
 * @constructor
 */
Spoooky.DiceBox = function(game) {

    var self_DiceBox = this,
        myGame = game;

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