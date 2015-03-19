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
 * Spoooky.Agent
 * Associated to a meta agent, every agent thinks about best moves in the current game state
 *
 * @param metaAgent
 * @param agentID
 * @constructor
 */
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
        var agentWorker = new Worker("../../js/spoooky.Worker.js"),
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