// Import necessary scripts to build virtual SpoookyJS games
importScripts("libs/underscore-min.js", "spoooky.min.js", "spoooky.AI.min.js");
//importScripts("libs/underscore-min.js", "spoooky.js", "spoooky.AI.js");

self.addEventListener("message", function(e) {

    var data = e.data, bestMove;

    switch (data.command) {

        // Driver for Monte Carlo Methods
        case "monte carlo tree search with uct":
            self.postMessage({
                type: "Starting Monte Carlo Tree Search With UCT"
            });

            var gameTmp = new Spoooky.Game,
                gameModel = gameTmp.clone(data.gameModel),
                uctResults = Spoooky.AI.UCT(gameModel, data.agentFocus, data.maxSteps,
                    data.maxTime, data.learn, data.uctConstant, data.generateMctsGraph);

            // Return the best moves found by monte carlo uct
            self.postMessage({
                "type" : "decision",
                "agentID" : data.agentID,
                "agentRole" : data.agentRole,
                "agentFocus" : data.agentFocus,
                "results" : uctResults.results,
                "simCount" : uctResults.simCount,
                "uctConstant" : data.uctConstant,
                "simSteps" : uctResults.simSteps,
                "mctsGraph" : uctResults.mctsGraph,
                "QLearner" : JSON.stringify(uctResults.QLearner)
            });

            // Terminate the worker
            self.close();
            break;

        // AB Pruning Driver
        // Perform an alpha-beta pruning search for the best move
        case "alpha beta negamax":

            // Notify that the worker has started processing
            self.postMessage({
                type: "Starting Alpha Beta NegaMax Search"
            });

            var gameTmp = new Spoooky.Game;

            // Start alpha-beta pruning
            bestMove = Spoooky.AI.abNegaMax(gameTmp.clone(data.gameModel),
                data.maxDepth, 0, Number.MAX_VALUE * -1, Number.MAX_VALUE, data.agentFocus);

            // Alpha-beta pruning finished
            // Return index of best move found and other stuff
            self.postMessage({
                type : "decision",
                agentID : data.agentID,
                agentRole : data.agentRole,
                agentFocus : data.agentFocus,
                results : [{
                    score: bestMove.score,
                    moveIndex : bestMove.move.moveIndex,
                    target : (bestMove.move.targetX+1) + "-" + (bestMove.move.targetY+1) }]
            });

            // Terminate the worker
            self.close();
            break;

        default:
            self.postMessage('Unknown command: ' + data.command);
    }
}, false);