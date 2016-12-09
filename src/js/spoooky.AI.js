"use strict";

/**
 * Spoooky.AI
 * Implementations of artificial intelligence methods
 */
Spoooky.AI = {

    /**
     * Game-connector
     */
    game : 0,

    /**
     * Monte Carlo Node
     * @param move
     * @param parentNode
     * @param gameState
     * @param uctConstant
     * @constructor
     */
    MCnode : function(move, parentNode, gameState, uctConstant) {

        var self_MCnode = this;

        /**
         * Depth in which the node has been discovered
         */
        self_MCnode.depth = 0;

        /**
         * Unique node identifier
         * @type {number}
         */
        self_MCnode.nodeID = 0;

        if (parentNode !== "Root Node") {
            self_MCnode.depth = parentNode.depth + 1;
            self_MCnode.nodeID = (Date.now() + _.random(0, 99999)).toString();
        } else {
            self_MCnode.nodeID = "Root";
        }

        /**
         * Move that led to this node
         * @type {*}
         */
        self_MCnode.move = move;

        /**
         * Associated parent node
         * @type {*}
         */
        self_MCnode.parent = parentNode;

        /**
         * Child nodes of this node
         * @type {Array}
         */
        self_MCnode.childNodes = [];

        /**
         * Win counter of this node
         * @type {number}
         */
        self_MCnode.wins = 0;

        /**
         * Simulation steps executed at this node
         * @type {number}
         */
        self_MCnode.simulationSteps = 0;

        /**
         * Number of visits
         * @type {number}
         */
        self_MCnode.visits = 0;

        /**
         * Index of the move in the allEntitiesMoves array
         * @type {number}
         */
        self_MCnode.moveIndex;

        /**
         * Indicate the type of the node (default or chance node)
         * @type {string}
         */
        self_MCnode.type = "DEFAULT";

        /**
         * Indicate terminal nodes
         * @type {boolean}
         */
        self_MCnode.terminal = false;

        /**
         * ID of the state-winning player
         * @type {boolean}
         */
        self_MCnode.winnerID = false;

        /**
         * Untried moves
         * @type {*}
         */
        self_MCnode.untriedMoves = [];

        /**
         * Calculate the win rate of this node
         * @returns {number}
         */
        self_MCnode.getWinRate = function() {

            if (self_MCnode.visits > 0) {
                return (self_MCnode.wins / self_MCnode.visits);
            }
            return 0;
        };

        /**
         * Check for untried moves in the node
         * @returns {boolean}
         */
        self_MCnode.hasUntriedMoves = function() {

            if (self_MCnode.untriedMoves === false || self_MCnode.untriedMoves.length === 0) {
                return false;
            }
            return true;
        };

        /**
         * Check if the node has child nodes
         * @returns {boolean}
         */
        self_MCnode.hasChildNodes = function() {

            if (self_MCnode.childNodes === false || self_MCnode.childNodes.length === 0) {
                return false;
            }
            return true;
        };

        /**
         * Get a random move index from the array of untried moves
         * @returns {number|*}
         */
        self_MCnode.getRandomMoveIndexFromUntriedMoves = function() {
            return _.random(0, parseInt(self_MCnode.untriedMoves.length-1, 10));
        };

        /**
         * Unique identifier of the player who takes turn in this node
         * @type {number|*}
         */
        self_MCnode.playerToMove = gameState.getCurrentPlayerID();

        /**
         * UCT Multiplier constant. Has to be fine tuned.
         * Larger values give uniform search
         * Smaller values give very selective search
         * Cf. Kocsis and Szepesvári (2006): Bandit based Monte-CarloPlanning
         * @type {number}
         */
        self_MCnode.UCTCONSTANT = uctConstant;

        /**
         * Retrieve unvisited child nodes
         * @returns {Array}
         */
        self_MCnode.getUnvisitedChildNodes = function() {

            var unvisited = [], cur, i,
                childNodes = self_MCnode.childNodes;

            for (i = childNodes.length; i--;) {

                cur = childNodes[i];
                if (cur.visits === 0) {
                    unvisited.push(cur);
                }
            }
            return unvisited;
        };

        /**
         * Select a child node by the upper confidence bounds applied to trees algorithm
         * cf.
         * - http://www.ru.is/faculty/yngvi/pdf/WinandsB09.pdf
         * - http://www.math-info.univ-paris5.fr/~Bouzy/publications/CWHUB-pMCTS-2007.pdf
         * @returns {*}
         */
        self_MCnode.UCTSelectChild = function() {

            var selected = "None", bestValue = 0,
                curChild, childNodes = self_MCnode.childNodes, uctValue;

            for (var i = childNodes.length; i--;) {

                curChild = childNodes[i];

                // Upper Confidence Bounds applied to Trees enhanced with Progressive Bias
                // cf. Browne et al. (2012): A Survey of Monte Carlo Tree Search Methods.
                uctValue = curChild.getWinRate() + 2 * self_MCnode.UCTCONSTANT * Math.sqrt(
                    2 * Math.log(self_MCnode.visits) / curChild.visits);

                if (uctValue > bestValue) {

                    selected = curChild;
                    bestValue = uctValue;
                }
            }

            // Hopeless game situation: Every possible move leads to a lost game
            if (selected === "None") {
                return childNodes[_.random(0, childNodes.length-1)];
            }

            return selected;
        };

        /**
         * Add a child node to the current node
         * @param moveIndex
         * @param state
         * @returns {Spoooky.AI.MCnode}
         */
        self_MCnode.addChild = function(moveIndex, state, maxDepth, agentFocus) {

            // Create a new monte carlo node
            var newNode = new Spoooky.AI.MCnode(self_MCnode.untriedMoves[moveIndex],
                self_MCnode, state, self_MCnode.UCTCONSTANT);

            // Connect the child node with the index of the executed move
            newNode.moveIndex = moveIndex;

            if (state.models.gameState !== "END" && newNode.depth < maxDepth) {
                newNode.untriedMoves = state.getCurrentPlayer().getExecutableMovesByAgentFocus("ALL");
            }

            if (state.models.gameState === "END") {
                newNode.terminal = true;
                newNode.winnerID = state.models.winnerID;
            }

            // Delete the executed move from untried moves of the parent node
            self_MCnode.untriedMoves.splice(moveIndex, 1);

            // Add the newly created node to the child nodes of current node
            self_MCnode.childNodes.push(newNode);

            // Check for chance node
            if (state.models.gameState === "WAITINGFORDICEROLL") {
                newNode.type = "CHANCE NODE";
            }

            return newNode;
        };

        /**
         * Update node's win and visit values
         * @param result
         */
        self_MCnode.update = function(result) {

            self_MCnode.visits++;
            self_MCnode.wins += result;
        };
    },

    /**
     * Virtually plays a game from a gamestate to the end of the game
     * @param game
     * @param maxSteps
     * @param agentFocus
     * @param playerID - ID of the currently deciding meta agent
     * @param QLearner - Q-Learning module of the meta agent
     * @param learn
     * @param endTime
     * @returns {{winnerID: (boolean|number|*), steps: number}}
     * @constructor
     */
    UCTrollout : function(game, maxSteps, agentFocus, playerID, QLearner, learn, endTime) {

        // Check if already in terminal game state
        if (game.models.gameState === "END") {

            return {
                "finalState" : game,
                "steps" : 1
            };
        }

        var allMoves, counter = 0, execMove, winnerID,
            models = game.models, fromState = "", toState = "";

        models.playVirtual = true;

        // Play the game for maxSteps rounds at maximum
        while (counter <= maxSteps) {

            // Update step counter
            counter++;

            // Stop processing if out of runtime
            if (Date.now() > endTime) { break; }

            // For dice games
            if (models.gameState === "WAITINGFORDICEROLL") {

                Spoooky.GameEvents.fireEvent({ job : "Roll Backgammon Dices" }, game);

                // If the game state is the same after the fired event then the meta agent can't move
                if (models.gameState === "WAITINGFORDICEROLL") {
                    // Perform a pseudo loop
                    game.loop(false, null, null);
                    continue;
                }
            }

            allMoves = game.getCurrentPlayer().getAllEntityMoves();
            //console.log(allMoves)

            // Execute move in virtual game
            if (allMoves.length > 0) {

                if (learn) {
                    fromState = game.gameWorld.createBoardSignature();
                }
                execMove = allMoves[_.random(0, allMoves.length-1)];

                game.executeMove(execMove);

                if (learn) {
                    toState = game.gameWorld.createBoardSignature();
                }
            }

            // Prepare empty moves
            if (_.isUndefined(execMove)) {
                execMove = { targetX : "x", targetY : "y", moveIndex : "none" };
            }

            if (models.gameState === "END") {

                winnerID = models.winnerID;

                if (learn) {
                    if (winnerID === playerID) {
                        QLearner.add(fromState, toState, 1.0,
                            game.translateCoordinates(execMove.targetX, execMove.targetY), execMove.moveIndex);
                    } else if (winnerID === false) {
                        // draw
                    } else {
                        QLearner.add(fromState, toState, -1.0,
                            game.translateCoordinates(execMove.targetX, execMove.targetY), execMove.moveIndex);
                    }
                }

                // Stop processing if the game is in its terminal state
                return {
                    "finalState" : game,
                    "steps" : counter
                };
            }

            if (learn) {
                QLearner.add(fromState, toState, undefined,
                    game.translateCoordinates(execMove.targetX, execMove.targetY), execMove.moveIndex);
            }
        }

        return {
            "finalState" : game,
            "steps" : counter
        };
    },

    /**
     * Execute a Monte Carlo UCT search for itermax iterations starting with the current initial state of the game.
     * Cf. the python code under http://mcts.ai/code/python.html
     *
     * Steps of Monte Carlo Tree Search (with UCT)
     * See also the wikipedia article: http://en.wikipedia.org/wiki/Monte_Carlo_tree_search
     *
     * Step I: Selection
     * Start from root node R and select successive child nodes down to a leaf node L.
     *
     * Step II: Expansion
     * Unless the chosen leaf node L ends the game: create none or more child nodes of the leaf node
     * and choose the node C from the created nodes.
     *
     * Step III: Simulation
     * Play a random playout from node C or from node L if no child C was created.
     *
     * Step IV: Backpropagation
     * Update information in the nodes on the path from C to R, using the result of the playout

     * @param game
     * @param agentFocus
     * @param maxSteps
     * @param maxTime
     * @param learn
     * @param uctConstant
     * @returns {{results: Array}}
     */
    UCT : function(game, agentFocus, maxSteps, maxTime, learn, uctConstant, generateMctsGraph) {

        var gameState, node, execMove, rootNode, i,
            rolloutResult, addResult = 0, iterations = 0, gameWorld,
            curPlayerID = game.getCurrentPlayerID(), move,
            QLearner, fromState = "", toState = "", stepCount = 0,
            endTime = Date.now() + maxTime, maxDepth = 9999999;

        if (learn) {
            QLearner = new Spoooky.QLearner(0.8);
        }

        // Create the root node for the root game state
        rootNode = new Spoooky.AI.MCnode({ "ID" : "Root", "name" : "Root" },
            "Root Node", game, uctConstant);

        // Expand the root node: Get all executable moves by agent focus
        rootNode.untriedMoves = game.getCurrentPlayer().getExecutableMovesByAgentFocus(agentFocus);

        // While within computational / time budget: let's go
        while (Date.now() < endTime) {

            // Set the current node as root node
            node = rootNode;

            // Create an instance of the root state to be worked with
            gameState = game.clone();

            gameWorld = gameState.gameWorld;

            // *** Step I: Selection ***
            // Select a path through the game tree to a leaf node
            while (node.hasUntriedMoves() === false && node.hasChildNodes()) {

                node = node.UCTSelectChild();

                if (learn) {
                    fromState = gameWorld.createBoardSignature();
                }

                move = node.move;
                gameState.executeMove(move);

                if (learn) {
                    toState = gameWorld.createBoardSignature();
                    QLearner.add(fromState, toState, undefined,
                        gameState.translateCoordinates(move.targetX, move.targetY), move.moveIndex);
                }
            }

            // *** Step II: Expansion ***
            // If at the final state: expand the game tree with a new node and execute the move
            if (node.hasUntriedMoves()) {

                execMove = node.getRandomMoveIndexFromUntriedMoves();

                if (learn) {
                    fromState = gameWorld.createBoardSignature();
                }

                move = node.untriedMoves[execMove];

                gameState.executeMove(move);

                // Add a child node and descend the tree
                node.addChild(execMove, gameState, maxDepth, agentFocus);

                if (learn) {
                    toState = gameWorld.createBoardSignature();
                    QLearner.add(fromState, toState, undefined,
                        gameState.translateCoordinates(move.targetX, move.targetY), move.moveIndex);
                }
            }

            // *** Step III: Rollout ***
            // Simulate one game until the end of the game is reached or a number of max rounds
            // Game has to be cloned here...
            rolloutResult = Spoooky.AI.UCTrollout(gameState.clone(), maxSteps, agentFocus, curPlayerID, QLearner, learn, endTime);

            node.simulationSteps += rolloutResult.steps;
            stepCount += rolloutResult.steps;

            // *** Step IV: Backpropagate ***
            // Backpropagate from the expanded node to the root node
            var terminalScore = rolloutResult.finalState.evaluateGameState(node.playerToMove);

            // Update each node with visits and playout result
            // Using negamax variant of minimax search
            // Cf. Browne et al. (2012): A Survey of Monte Carlo Tree Search Methods [http://www.cameronius.com/cv/mcts-survey-master.pdf]
            while (node.parent) {

                node.update(terminalScore);
                terminalScore = terminalScore * -1;
                node = node.parent;
            }

            iterations++;

            // Clean up
            gameState.models.length = 0;
            gameState.length = 0;
        }

        // Save monte carlo uct results
        var allResults = [], cur, curMove,
            moveTarget, moveSource, moveName,
            worldRows = game.gameWorld.getRows();

        i = rootNode.childNodes.length;

        // Prepare results
        for (; i--;) {

            cur = rootNode.childNodes[i];
            curMove = cur.move;

            moveTarget = (String.fromCharCode(parseInt((97+curMove.targetX) , 10))) +
            (worldRows - curMove.targetY);

            // Create the name of the move
            if (curMove.name === "place entity") {

                moveName = moveTarget;
            } else if (curMove.name === "Bear off") {

                moveName = moveSource = (String.fromCharCode(parseInt((97+curMove.entity.position.x) , 10))) +
                (worldRows - curMove.entity.position.y) + "-out";
            } else {

                moveTarget = (String.fromCharCode(parseInt((97+curMove.targetX) , 10))) + (worldRows - curMove.targetY);

                // Free capture move
                if (curMove.type === "FREE CAPTURE") {
                    moveName = moveTarget;
                } else {
                    // Entity move
                    moveSource = (String.fromCharCode(parseInt((97+curMove.entity.position.x) , 10))) +
                    (worldRows - curMove.entity.position.y);

                    moveName = moveSource + "-" + moveTarget;
                }
            }

            if (curMove.type === "DICE") {
                moveName += "-" + curMove.diceValue;
            }

            // Prepare results
            allResults.push({
                "wins" : cur.wins,
                "target" : moveName,
                "visits" : cur.visits,
                "moveIndex" : curMove.moveIndex,
                "simulationSteps" : cur.simulationSteps
            });
        }

        var graph = false;

        if (generateMctsGraph) {
            graph = Spoooky.AI.createMCTSGraph(rootNode, worldRows);
        }

        rootNode = null;
        game = null;

        return {
            "mctsGraph" : graph,
            "simCount" : iterations,
            "simSteps" : stepCount,
            "results" : allResults,
            "QLearner" : QLearner
        };
    },

    /**
     * Creates a graph which represents the monte carlo tree search
     * To be used with d3.js
     * Graph / tree Data in form:
     var treeData = [
     {
         "name": "Top Level",
         "parent": "null",
         "children": [
             {
                 "name": "Level 2: A",
                 "parent": "Top Level",
                 "children": [
                     {
                         "name": "Son of A",
                         "parent": "Level 2: A"
                     },
                     {
                         "name": "Daughter of A",
                         "parent": "Level 2: A"
                     }
                 ]
             },
             {
                 "name": "Level 2: B",
                 "parent": "Top Level"
             }
         ]
     }
     ];
     * @param data
     * @param worldRows
     */
    createMCTSGraph : function(data, worldRows) {

        var mctsGraph = {
            "ID" : "Root",
            "children": [],
            "parent": "null",
            "value" : data.visits,
            "name" : "Entscheidungsknoten (Spieler ID " + data.playerToMove + ", " +
            data.getWinRate().toFixed(3) + " / " + data.visits + ")"
        };

        var childNodes = [];

        // Processing can be very intensive so prevent errors
        try {
            Spoooky.AI.preProcessChildNodes(data.childNodes, worldRows, childNodes);
        } catch(err) {
            childNodes.length = 0;
        }

        try {
            mctsGraph.children = Spoooky.AI.createTree(childNodes, "Root", 0, 10);
        } catch(err) {
            mctsGraph.children.length = 0;
        }

        return mctsGraph;
    },

    /**
     * Recursively reduces the monte carlo uct game tree to a one-dimensional array
     * @param data
     * @param worldRows
     * @param outputChildren
     */
    preProcessChildNodes : function(data, worldRows, outputChildren) {

        var cur, moveID, moveTarget, moveSource, moveName, curMove;

        for (var i = data.length; i--;) {

            cur = data[i];
            curMove = cur.move;

            moveID = cur.move.ID.toString();
            moveTarget = (String.fromCharCode(parseInt((97+curMove.targetX) , 10))) + (worldRows - curMove.targetY);

            if (curMove.name === "place entity") {
                moveName = moveTarget;
            } else if (curMove.name === "Bear off") {

                moveName = (String.fromCharCode(parseInt((97+curMove.entity.position.x) , 10))) +
                (worldRows - curMove.entity.position.y) + "-out";
            } else {

                // Free capture move
                if (curMove.type === "FREE CAPTURE") {
                    moveName = moveTarget;
                } else {

                    moveTarget = (String.fromCharCode(parseInt((97 + curMove.targetX), 10))) + (worldRows - curMove.targetY);
                    moveSource = (String.fromCharCode(parseInt((97 + curMove.entity.position.x), 10))) +
                    (worldRows - curMove.entity.position.y);
                    moveName = moveSource + "-" + moveTarget;
                }
            }

            if (curMove.type === "DICE") {

                moveID += "-" + curMove.diceValue;
                moveName += "-" + curMove.diceValue;
            }

            // Terminal node
            if (cur.terminal) {

                var winner;
                if (cur.winnerID !== false) {
                    winner = "Spieler ID " + cur.winnerID + " gewinnt. ";
                } else {
                    winner = "unentschieden"
                }
                moveName = moveName + " (Terminalknoten - " + winner +
                cur.getWinRate().toFixed(3) + " / " + cur.visits + ")";
            } else {
                moveName = moveName + " (Spieler ID " + cur.playerToMove + ", " +
                cur.getWinRate().toFixed(3) + " / " + cur.visits + ")";
            }

            outputChildren.push({
                "ID" : cur.nodeID,
                "value" : cur.visits,
                "parent" : cur.parent.nodeID,
                "name" : moveName,
                "terminal" : cur.terminal
            });

            if (cur.childNodes.length > 0) {
                Spoooky.AI.preProcessChildNodes(cur.childNodes, worldRows, outputChildren);
            }
        }
    },

    /**
     * Create tree structure
     * cf. http://oskarhane.com/create-a-nested-array-recursively-in-javascript/
     * @param arr
     * @param parent
     * @returns {Array}
     */
    createTree : function(arr, parent) {

        var out = [], children;

        for(var i = arr.length; i--;) {

            if(arr[i].parent === parent) {

                children = Spoooky.AI.createTree(arr, arr[i].ID);

                if(children.length) {
                    arr[i].children = children
                }
                out.push(arr[i])
            }
        }
        return out;
    },

    /**
     * Determine the maximum of two parameter values
     * @param paramA
     * @param paramB
     * @returns {*}
     */
    max : function(paramA, paramB) {

        if (paramA > paramB) { return paramA; }
        return paramB;
    },

    /**
     * Implementation of the alpha beta pruning algorithm
     * (cf. Millington, Funge: Artificial Intelligence for Games. 2009. 681-684)
     * @param game
     * @param maxDepth
     * @param currentDepth
     * @param alpha
     * @param beta
     * @param pID
     * @returns {*}
     */
    abNegaMax : function(game, maxDepth, currentDepth, alpha, beta, pID) {

        if (game.models.gameState === "END" || currentDepth === maxDepth) {

            var score = -1000;

            // Best score: Player with pID wins the game
            if (game.models.winnerID === false) {
                score = 0;
            } else if (game.models.winnerID === pID) {
                score = 1000;
            }

            return {
                "score" : score + currentDepth,
                "move" : null, "moveIndex" : false };
        }

        var bestMove = "none",
            bestScore = -99999, allMoves, gameCopy,
            result, currentScore, recursedScore, move;

        allMoves = game.getCurrentPlayer().getAllEntityMoves();

        for (var counter = allMoves.length; counter--;) {

            move = allMoves[counter];

            // Execute a virtual move
            gameCopy = game.clone();

            gameCopy.executeMove(move);

            result = Spoooky.AI.abNegaMax(gameCopy, maxDepth, currentDepth+1,
                beta * -1, Spoooky.AI.max(alpha, bestScore) * -1, pID);

            recursedScore = result.score;
            currentScore = recursedScore * -1;

            gameCopy = null;

            // Update the best score
            if (currentScore > bestScore) {

                bestMove = move;
                bestScore = currentScore;

                // Prune if outside the bounds
                if (bestScore >= beta) {
                    return { score: bestScore, move : bestMove, "moveIndex" : bestMove.moveIndex };
                }
            }
        }

        if (bestMove === "none") {
            return { score: -1 };
        } else {
            return { score: bestScore, move : bestMove, "moveIndex" : bestMove.moveIndex };
        }
    }
};

/**
 * Q-Learning Module
 *
 * This algorithm is loosely based on the javascript q-learning implementation
 * https://github.com/nrox/q-learning.js
 *
 * Based on
 * - Millington, Funge: Artificial Intelligence for Games. 2009.
 * - cf. https://github.com/nrox/q-learning.js
 * - cf. https://github.com/karpathy/convnetjs
 *
 * @param gamma
 * @constructor
 */
Spoooky.QLearner = function(gamma) {

    var self_QLearner = this;

    self_QLearner.alpha = 0;
    self_QLearner.gamma = gamma || 0.8;
    self_QLearner.rho = 0.2;
    self_QLearner.nu = 0;

    self_QLearner.rewards = {};
    self_QLearner.gameStates = {};
    self_QLearner.currentState = null;

    self_QLearner.add = function(from, to, reward, actionName, moveIndex) {

        // Limit the savable state space to a number of n states
        // if (_.size(self_QLearner.gameStates) < 1000) {

        if (!self_QLearner.gameStates[from]) {
            self_QLearner.addState(from);
        }
        if (!self_QLearner.gameStates[to]) {
            self_QLearner.addState(to);
        }
        self_QLearner.gameStates[from].addAction(to, reward, actionName, moveIndex);
        // }
    };

    self_QLearner.addState = function (name) {

        var state = new Spoooky.GameState(name);
        self_QLearner.gameStates[name] = state;
        return state;
    };

    self_QLearner.setState = function (name) {

        self_QLearner.currentState = self_QLearner.gameStates[name];
        return self_QLearner.currentState;
    };

    self_QLearner.getState = function () {

        return self_QLearner.currentState && self_QLearner.currentState.name;
    };

    self_QLearner.randomState = function() {

        var gameStates = _.toArray(self_QLearner.gameStates);
        return gameStates[_.random(0, gameStates.length-1)];
    };

    self_QLearner.optimalFutureValue = function(state) {

        var max = 0, stateRewards = self_QLearner.rewards[state];

        _.each(stateRewards, function(action) {
            if (stateRewards.hasOwnProperty(action)){
                max = Math.max(max, stateRewards[action] || 0);
            }
        });
        return max;
    };

    self_QLearner.step = function() {

        self_QLearner.currentState || (self_QLearner.currentState = self_QLearner.randomState());
        var actions = _.toArray(self_QLearner.currentState.actions), action;

        if (_.random(0, 1) < self_QLearner.rho) {
            // Randomly pick an action
            // Previous standard
            action = actions[_.random(0, actions.length-1)];
        } else {
            // Pick the best action
            //action = self_QLearner.getBestAction(self_QLearner.currentState.name);
            action = actions[_.random(0, actions.length-1)];
        }

        if (!action) return null;
        self_QLearner.rewards[self_QLearner.currentState.name] || (self_QLearner.rewards[self_QLearner.currentState.name] = {});
        self_QLearner.rewards[self_QLearner.currentState.name][action.name] = (action.reward || 0) + self_QLearner.gamma * self_QLearner.optimalFutureValue(action.nextState);
        return self_QLearner.currentState = self_QLearner.gameStates[action.nextState];
    };

    self_QLearner.learn = function(steps) {

        steps = Math.max(1, steps || 0);

        while (steps--) {
            self_QLearner.currentState = self_QLearner.randomState();
            self_QLearner.step();
        }
    };

    self_QLearner.getBestAction = function(state) {

        var stateRewards = self_QLearner.rewards[state] || {},
            bestAction = null, action,
            keys = _.keys(stateRewards),
            len = keys.length;

        for (var i = 0; i < len; ++i) {

            action = keys[i];
            if (stateRewards.hasOwnProperty(action)){

                if (!bestAction) {
                    bestAction = action;
                    //} else if ((stateRewards[action] === stateRewards[bestAction]) && (Math.random() > 0.5)){
                } else if ((stateRewards[action] === stateRewards[bestAction])) {
                    bestAction = action;
                } else if (stateRewards[action] > stateRewards[bestAction]) {
                    bestAction = action;
                }
            } else {
                //console.log("No reward for action", action);
                return false;
            }
        }
        return bestAction;
    };
};

/**
 * Representation of a game state
 * Includes game state signatures and possible moves / actions
 * @param name
 * @constructor
 */
Spoooky.GameState = function(name) {

    var self_GameState = this;

    self_GameState.name = name;
    self_GameState.actions = {};

    self_GameState.addAction = function(nextState, reward, actionName, moveIndex) {

        var action =  {
            name: actionName === undefined ? nextState : actionName,
            nextState: nextState,
            reward: reward,
            moveIndex : moveIndex
        };
        self_GameState.actions[action.name] = action;
    };
};