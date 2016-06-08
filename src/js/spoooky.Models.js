"use strict";

/**
 * Spoooky.Models
 * Game Models; Class holds all relevant game data, represents the current game state of a game
 * Other Spoooky.JS classes are implemented as controllers for the game model
 *
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
         *      enabled : {boolean}
         * }
         */
    self_Models.GameGrid = [];

    /**
     * Represents the connections of game grid cells
     */
    self_Models.CellConnections = {};

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
     * @type {{isEnabled: boolean, dices: Array, diceValues: Array, attachedMoveIDs: Array}}
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
     * @type {{rows: number, columns: number}}
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
     * Temporary save the game mode
     * @type {string}
     */
    self_Models.tmpGameMode = "";

    /**
     * Numbers of rounds played
     * @type {number}
     */
    self_Models.gameRounds = 0;
};