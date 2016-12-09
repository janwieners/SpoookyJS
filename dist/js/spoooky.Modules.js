"use strict";

/**
 * AngularJS Interface
 * Extends the angular scope with frequently used
 * game specific controllers and helper functions
 * @param args
 * @constructor
 */
Spoooky.AngularWrapper = function(args) {

    var self_AngularWrapper = this;

    self_AngularWrapper.game = args.game;
    self_AngularWrapper.players = self_AngularWrapper.game.getPlayers();
    self_AngularWrapper.AIplayers = self_AngularWrapper.game.getAIPlayers();
    self_AngularWrapper.cellWidth = args.cellWidth;
    self_AngularWrapper.cellHeight = args.cellHeight;

    self_AngularWrapper.module = angular.module("SpoookyGame", ['ui.bootstrap', 'spoooky.templates']);

    // Catch errors
    //window.onerror = catchError;



    /**
     * Catch JavaScript error messages
     * @param errorMessage
     * @param errorFile
     * @param errorLine
     * @returns {boolean}
     */
    function catchError(errorMessage, errorFile, errorLine) {

        // Error output in console
        console.log(errorMessage, errorFile, errorLine);

        // Notify user
        alert("Es ist ein Fehler im Programmfluss aufgetreten. Ich versuche, den Fehler zu beheben. " +
        "Bitte haben Sie einen Moment Geduld.");

        // Try to fix the error autonomously
        self_AngularWrapper.game.pseudoLoop();

        return true;
    }

    /**
     * Filter to enable html output in ng-repeats
     */
    self_AngularWrapper.module.filter("unsafe", function($sce) {
        return function(val) {
            return $sce.trustAsHtml(val);
        }
    });

    // *** Controllers *** //
    /**
     * Controller for display the name of the game
     */
    self_AngularWrapper.module.controller("HeadingCtrl", function($scope) {
        $scope.gameName = self_AngularWrapper.game.getName();
        $scope.gameDescription = self_AngularWrapper.game.getDescription();
    });

    /**
     * Controller for the game process
     */
    self_AngularWrapper.module.controller("GameProcessCtrl", function($scope) {
        $scope.messages = Spoooky.GameProcess.messages;
    });

    /**
     * Controller for the agent log
     */
    self_AngularWrapper.module.controller("AgentLogCtrl", function($scope) {
        $scope.messages = Spoooky.AgentLog.messages;
    });

    /**
     * Controller for the game settings element
     * :O Uuuh, I'm ugly, please refactor me!
     */
    self_AngularWrapper.module.controller("GameSettingsCtrl", function($scope, $uibModal, $rootScope) {

        // Prepare player types
        $scope.playerTypes1 = {
            "type": "select",
            "values": [ "Menschlicher Spieler/in", "Artifizielle Spielerin"]
        };
        $scope.playerTypes2 = {
            "type": "select",
            "values": [ "Menschlicher Spieler/in", "Artifizielle Spielerin"]
        };

        // Init
        if (localStorage["firstPlayerName"]) {
            self_AngularWrapper.players[0].name = localStorage["firstPlayerName"];
        }

        if (localStorage["secondPlayerName"]) {
            self_AngularWrapper.players[1].name = localStorage["secondPlayerName"];
        }

        // Prepare player object
        $scope.player1 = {
            name : self_AngularWrapper.players[0].name,
            type : self_AngularWrapper.players[0].type
        };

        $scope.player2 = {
            name : self_AngularWrapper.players[1].name,
            type : self_AngularWrapper.players[1].type
        };

        /**
         * Modal / Dialog
         * @type {number}
         */
        $scope.userDialog = 0;

        // Show a dialog to get the user name at first start of SpoookyJS
        if (!localStorage["initialized"]) {

            $scope.userDialog = $uibModal.open({
                templateUrl: "templates/userdialog.htm",
                scope: $scope
            });
        } else {
            // Set previously stored player name
            $scope.player1.name = localStorage["firstPlayerName"];
            self_AngularWrapper.game.getPlayers()[0].setName(localStorage["firstPlayerName"]);

            Spoooky.GameProcess.pushMessage("<strong>" + self_AngularWrapper.game.getCurrentPlayerName() + "</strong> beginnt das Spiel");
        }

        /**
         * Functionality of the save button in the dialog / modal
         */
        $scope.modalSave = function() {

            // Save the player name
            localStorage["initialized"] = true;
            localStorage["firstPlayerName"] = $scope.player1.name;
            self_AngularWrapper.game.getPlayers()[0].setName($scope.player1.name);

            Spoooky.GameProcess.pushMessage("<strong>" + self_AngularWrapper.game.getCurrentPlayerName() + "</strong> beginnt das Spiel");

            $scope.userDialog.close();
        };

        /**
         * Functionality of the save button in the dialog / modal
         */
        $scope.modalCancel = function() {

            localStorage["initialized"] = true;
            localStorage["firstPlayerName"] = $scope.player1.name;
            Spoooky.GameProcess.pushMessage("<strong>" + self_AngularWrapper.game.getCurrentPlayerName() + "</strong> beginnt das Spiel");
            $scope.userDialog.close();
        };

        //localStorage.removeItem("initialized");

        // Set the player type names
        if ($scope.player1.type === "HUMAN") {
            $scope.playerTypes1.value = "Menschlicher Spieler/in";
        } else {
            $scope.playerTypes1.value = "Artifizielle Spielerin";
        }

        if ($scope.player2.type === "HUMAN") {
            $scope.playerTypes2.value = "Menschlicher Spieler/in";
        } else {
            $scope.playerTypes2.value = "Artifizielle Spielerin";
        }

        /**
         * Change the player names
         * @param playerID
         */
        $scope.changePlayerName = function(playerID) {

            // ToDo - Refactor me!
            switch(playerID) {

                case 0:
                    localStorage["firstPlayerName"] = $scope.player1.name;
                    self_AngularWrapper.players[0].setName($scope.player1.name);
                    self_AngularWrapper.game.getPlayers()[0].setName($scope.player1.name);
                    break;

                case 1:
                    localStorage["secondPlayerName"] = $scope.player2.name;
                    self_AngularWrapper.players[1].setName($scope.player2.name);
                    self_AngularWrapper.game.getPlayers()[1].setName($scope.player2.name);
                    break;

                default:
                    console.log("Invalid player ID");
            }
        };

        /**
         * Change the type of the player (HUMAN / ARTIFICIAL)
         * @param playerID
         */
        $scope.changePlayerType = function(playerID) {

            var metaAgent = self_AngularWrapper.players[playerID];

            // ToDo Refactor me!
            switch (playerID) {
                case 0:
                    if ($scope.playerTypes1.value === "Menschlicher Spieler/in") {
                        metaAgent.setType("HUMAN");
                    } else {
                        metaAgent.setType("ARTIFICIAL");
                    }
                    break;

                case 1:
                    if ($scope.playerTypes2.value === "Menschlicher Spieler/in") {
                        metaAgent.setType("HUMAN");
                    } else {


                        metaAgent.setType("ARTIFICIAL");

                        if (metaAgent.countAgents() === 0) {
                            metaAgent.assembleAgents();
                        }
                    }
            }

            // Do some extra work for artificial players / meta agents
            if (metaAgent.type === "ARTIFICIAL") {

                self_AngularWrapper.AIplayers = self_AngularWrapper.game.getAIPlayers();

                // Create agent ensemble if necessary
                if (metaAgent.countAgents() === 0) {
                    metaAgent.assembleAgents();
                }

                // Execute an artificial move if its current meta agent's turn
                if (self_AngularWrapper.game.models.currentPlayerID === metaAgent.ID) {
                    self_AngularWrapper.game.playArtificial();
                }
            } else {
                self_AngularWrapper.AIplayers = self_AngularWrapper.game.getAIPlayers();
            }

            // Notify other controllers about changed meta agents
            $rootScope.$broadcast("metaAgentChange");
        };
    });

    /**
     * Controller for the agent ensemble overview
     */
    self_AngularWrapper.module.controller("AgentEnsembleCtrl", function($scope) {

        $scope.metaAgents = self_AngularWrapper.game.getAIPlayers();

        $scope.focusOptions = [
            "ALL MOVES",
            "FIRST HALF OF POSSIBLE MOVES",
            "SECOND HALF OF POSSIBLE MOVES",
            "MOVES NEAR OPPONENT FIELDS",
            "MOVES NEAR OPPONENT OR OWN FIELDS"
        ];

        // Listen for changes in settings controller
        $scope.$on("metaAgentChange", function() {
            // Update array of meta agents
            $scope.metaAgents = self_AngularWrapper.game.getAIPlayers();
        });

        /**
         * Deletes an agent with agenteID from the ensemble of meta agent metaID
         * @param metaID
         * @param agentID
         * @returns {boolean}
         */
        $scope.deleteAgent = function(metaID, agentID) {

            var metaAgents = $scope.metaAgents,
                metaAgent;

            for (var i = metaAgents.length; i--;) {

                if (metaAgents[i].ID === metaID) {
                    metaAgent = metaAgents[i];
                }
            }

            var container = "#" + metaID + "-" + agentID;

            metaAgent.deleteAgentWithID(agentID);

            return true;
        };

        /**
         * Adds an agent to the agent ensemble of meta agent with metaID
         * @param metaID
         */
        $scope.addAgent = function(metaID) {
            self_AngularWrapper.game.getPlayerWithID(metaID).addStandardAgent();
        };

    });

    /**
     * Convert input type="range" values from string to integer
     */
    self_AngularWrapper.module.directive("integer", function(){

        return {
            require: "ngModel",
            link: function(scope, ele, attr, ctrl){
                ctrl.$parsers.unshift(function(viewValue){
                    return parseInt(viewValue, 10);
                });
            }
        };
    });

    /**
     * Convert input type="range" values from string to float
     */
    self_AngularWrapper.module.directive("float", function(){

        return {
            require: "ngModel",
            link: function(scope, ele, attr, ctrl){
                ctrl.$parsers.unshift(function(viewValue){
                    return parseFloat(viewValue);
                });
            }
        };
    });

    /**
     * Controller for the monte carlo tree search graph view
     */
    self_AngularWrapper.module.controller("MCTSGraphCtrl", function($scope) {

        self_AngularWrapper.game.connectGraphView($scope);

        /**
         * Update (render) all graphs
         * @param graphData
         * @param metaAgentID
         */
        $scope.updateGraphs = function(graphData, metaAgentID) {

            if ($("#mctsgraph").is(":visible")) {

                // Sort input data
                graphData = _.sortBy(graphData, "agentID");

                var container = "#d3graphs-" + metaAgentID, treeData, divName;

                // Create container if necessary
                if ($("#graphs " + container).length === 0) {
                    $("#graphs").append('<div id="d3graphs-' + metaAgentID + '"/>');
                }

                // Delete previously drawn graphs
                // ToDo
                d3.select(container).selectAll("*").remove();

                for (var i = 0; i < graphData.length; i++) {

                    if (graphData[i].mctsGraph.children.length === 0) {

                        $("#graphs").append("Spielbaumdarstellung konnte leider aufgrund " +
                        "zu hoher Komplexität des Graphen nicht generiert werden.<br>");

                        continue;
                    }

                    divName = "graph_" + metaAgentID + "-" + graphData[i].agentID;

                    // Create new DOM-Element for the graphs of the associated agent ensemble
                    $(container).append("<h5>Ensemble Agent #" + graphData[i].agentID +
                        " (UCT-Konstante <strong>" + graphData[i].uctConstant + "</strong>);" +
                        " assoziierter Meta Agent #" + metaAgentID + "</h5>");

                    // Create a sub container for the agent-individual graphs
                    $(container).append('<div id="' + divName + '"/>');

                    // Get tree / graph data
                    treeData = graphData[i].mctsGraph;

                    // Reset data to prevent errors ("Converting circular structure to JSON")
                    graphData[i].length = 0;

                    // Finally: Draw the graph
                    $scope.drawGraph(treeData, "#" + divName);

                    //treeData.length = 0;
                }

                // Try to call garbage collector
                graphData.length = 0;

                // Keep in mind: $timeout(function () { }, 0);
            }
        };

        /**
         * Update the graph of an agent
         * @param treeData
         * @param graphContainer
         */
        $scope.drawGraph = function(treeData, graphContainer) {

            // *** d3 graph view ***
            // Source: http://bl.ocks.org/d3noob/8375092

            // ************** Generate the tree diagram *****************
            var margin = { top: 20, right: 10, bottom: 20, left: 10 },
                //width = 990 - margin.right - margin.left,
                width = 990 - margin.right - margin.left,
                height = 700 - margin.top - margin.bottom;
            var i = 0,
                duration = 500,
                root;

            var tree = d3.layout.tree()
                //.nodeSize([5, 5]);
                .size([width, height]);

            var diagonal = d3.svg.diagonal()
                .projection(function(d) { return [d.x, d.y]; });

            // Define the zoom function for the zoomable tree
            function zoom() {
                //svg.attr("transform", "translate(" + d3.event.translate + ")scale(" + d3.event.scale + ")");
                svg.attr("transform", "translate(" +  d3.event.translate + ")scale(" + d3.event.scale + ")");
            }

            // define the zoomListener which calls the zoom function on the "zoom" event constrained within the scaleExtents
            var zoomListener = d3.behavior.zoom().scaleExtent([0.2, Infinity]).on("zoom", zoom);

            var svg = d3.select(graphContainer).append("svg")
                .attr("class","svg_container")
                .attr("width", width + margin.right + margin.left)
                .attr("height", height + margin.top + margin.bottom)
                .style("overflow", "scroll")
                .style("background-color","#f1f1f1")
                .call(zoomListener)
                .append("svg:g")
                .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

            d3.select("svg")
                .call(d3.behavior.zoom()
                    .scaleExtent([0.5, Infinity])
                    .on("zoom", zoom));

            root = treeData;
            root.x0 = height / 2;
            root.y0 = 0;

            d3.select(self.frameElement).style("height", "400px");

            // Toggle children on click.
            function click(d) {
                if (d.children) {
                    d._children = d.children;
                    d.children = null;
                } else {
                    d.children = d._children;
                    d._children = null;
                }
                update(d);
            }

            function update(source) {

                // Compute the new tree layout.
                var nodes = tree.nodes(root).reverse(),
                    links = tree.links(nodes);

                // Normalize for fixed-depth.
                nodes.forEach(function(d) { d.y = d.depth * 75; });

                // Update the nodes…
                var node = svg.selectAll("g.node")
                    .data(nodes, function(d) { return d.id || (d.id = ++i); });

                // Enter any new nodes at the parent's previous position.
                var nodeEnter = node.enter().append("g")
                    .attr("class", "node")
                    //.attr("transform", function(d) { return "translate(" + source.y0 + "," + source.x0 + ")"; })
                    .attr("transform", function(d) { return "translate(" + source.x0 + "," + source.y0 + ")"; })
                    .on("click", click);

                nodeEnter.append("circle")
                    .attr("r", 1e-6)
                    .style("fill", function(d) { return d._children ? "#8fcc5b" : "#004b86"; });


                nodeEnter.on("mouseover", function(d) {
                    var g = d3.select(this); // The node
                    // The class is used to remove the additional text later
                    var info = g.append('text')
                        .classed('info', true)
                        .attr("background-color", "pink")
                        .attr('x', 15)
                        .attr('y', 3)
                        .text(function(d) { return d.name; });
                })
                .on("mouseout", function() {
                    // Remove the info text on mouse out.
                    d3.select(this).select('text.info').remove();
                });

                 // Transition nodes to their new position.
                var nodeUpdate = node.transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + d.x + "," + d.y + ")"; });

                nodeUpdate.select("circle")
                    .attr("r", 6)
                    .style("fill", function(d) {
                        if (d._children) {
                            return "#8fcc5b";
                        } else {

                            // Terminal node
                            if (d.terminal) {
                                return "#26ab2f";
                            }

                            else if (d.value < 50) {
                                return "#68b9f8";
                            } else if (d.value < 100) {
                                return "#0086f0";
                            } else if (d.value < 200) {
                                return "#016fc5";
                            } else if (d.value < 400) {
                                return "#005faa";
                            } else {
                                return "#004b86";
                            }
                        }
                    });

                nodeUpdate.select("text")
                    .style("fill-opacity", 1);

                // Transition exiting nodes to the parent's new position.
                var nodeExit = node.exit().transition()
                    .duration(duration)
                    .attr("transform", function(d) { return "translate(" + source.x + "," + source.y + ")"; })
                    .remove();

                nodeExit.select("circle")
                    .attr("r", 1e-6);

                nodeExit.select("text")
                    .style("fill-opacity", 1e-6);

                // Update the links…
                var link = svg.selectAll("path.link")
                    .data(links, function(d) { return d.target.id; });

                // Enter any new links at the parent's previous position.
                link.enter().insert("path", "g")
                    .attr("class", "link")
                    .attr("d", function(d) {
                        var o = {x: source.x0, y: source.y0};
                        return diagonal({source: o, target: o});
                    });

                // Transition links to their new position.
                link.transition()
                    .duration(duration)
                    .attr("d", diagonal);

                // Transition exiting nodes to the parent's new position.
                link.exit().transition()
                    .duration(duration)
                    .attr("d", function(d) {
                        var o = {x: source.x, y: source.y};
                        return diagonal({source: o, target: o});
                    })
                    .remove();

                // Stash the old positions for transition.
                nodes.forEach(function(d) {
                    d.x0 = d.x;
                    d.y0 = d.y;
                });
            }

            update(root);
        }
    });

    /**
     * Directive to react on last ng-repeat in StatisticsCtrl
     */
    self_AngularWrapper.module.directive("createChartsIfFinished", function($timeout) {

        return function(scope, element, attrs) {

            if (scope.$last) {
                $timeout(function () {
                    $timeout(function () {
                        scope.$emit("createCharts", element, attrs);
                    }, 0);
                }, 0);
            }
        }
    });

    /**
     * Controller for the agent ensemble statistics / charts
     */
    self_AngularWrapper.module.controller("StatisticsCtrl", function($scope, $timeout) {

        $scope.charts = [];
        $scope.stats = Spoooky.Statistics;
        $scope.metaAgents = self_AngularWrapper.game.getAIPlayers();

        self_AngularWrapper.game.connectStatsView($scope);

        // Listen for changes in settings controller
        $scope.$on("metaAgentChange", function() {

            // Update array of meta agents
            $scope.metaAgents = self_AngularWrapper.game.getAIPlayers();

            // Create new chart for meta agent if necessary
            for (var i = 0; i < $scope.metaAgents.length; i++) {

                if (_.isUndefined($scope.charts[$scope.metaAgents[i].ID])) {
                    $scope.createChart($scope.metaAgents[i].ID);
                }
            }
        });

        $scope.$on("createCharts", function() {

            for (var i = 0; i < $scope.metaAgents.length; i++) {
                $scope.createChart($scope.metaAgents[i].ID);
            }
        });

        /**
         * Update agents decision statistics
         * @param agentID
         */
        $scope.update = function(agentID) {

            if ($("#statistics").is(":visible")) {

                var curID, simCounts, simSteps, rollouts = [],
                    simulations = [], updateCols = [], rounds = [];

                if ($scope.charts.length > 0) {

                    curID = agentID;

                    simSteps = $scope.stats.getEntriesOfType(curID, "simSteps");
                    simCounts = $scope.stats.getEntriesOfType(curID, "simCount");

                    if (simSteps !== false && simCounts !== false) {

                        rounds.push("x");
                        rollouts.push("Rollouts");
                        simulations.push("Simulationsschritte");

                        for (var j = 0; j < simSteps.length; j++) {

                            rounds.push(simCounts[j].round.toString());
                            rollouts.push(simCounts[j].value);
                            simulations.push(simSteps[j].value);
                        }

                        updateCols.push(rounds);
                        updateCols.push(rollouts);
                        updateCols.push(simulations);

                        $scope.charts[curID].chart.load({
                            columns : updateCols
                        });
                    }
                }
            }
        };

        $scope.createChart = function(agentID) {

            var bind = "#chart-"+agentID;

            var chart = c3.generate({
                bindto: bind,
                data: {
                    x: "x",
                    columns: [
                        ["Rollouts"],
                        ["Simulationsschritte"]
                    ],
                    axes: {
                        Rollouts: "y2"
                    },
                    types: {
                        Rollouts: "line",
                        Simulationsschritte : "bar"
                    },
                    colors : {
                        Rollouts : "#004b86",
                        Simulationsschritte : "#88C356"
                    }
                },
                grid: {
                    x: {
                        show: true
                    },
                    y: {
                        show: true
                    }
                },
                axis: {
                    y: {
                        label: {
                            text: "Simulationsschritte (simulierte Spielrunden)",
                            position: "outer-middle"
                        },
                        tick: {
                            format: d3.format("d")
                        }
                    },
                    y2: {
                        show: true,
                        label: {
                            text: "Simulierte Spiele",
                            position: "outer-middle"
                        },
                        tick: {
                            format: d3.format("d")
                        }
                    },
                    x: {
                        type: "category"
                    }
                },
                tooltip: {
                    format: {
                        title: function (d) { return "Spielrunde " + d; },
                        value: function (value, ratio, id) {
                            var format = id === "data1" ? d3.format("d") : d3.format("d");
                            return format(value);
                        }
                    }
                }
            });

            $scope.charts[agentID] = {
                "ID": agentID,
                "chart" : chart
            };
        };

    });

    /**
     * Controller for the grid world
     * Initializes the view
     */
    self_AngularWrapper.module.controller("GridWeltCtrl", function($scope, $timeout) {

        $scope.game = self_AngularWrapper.game;

        // Provide game grid specifics to the interface
        $scope.gameGrid = game.models.GameGrid;
        $scope.gridRows = game.gameWorld.getRows();
        $scope.gridColumns = game.gameWorld.getColumns();

        $scope.cellWidth = self_AngularWrapper.cellWidth;
        $scope.cellHeight = self_AngularWrapper.cellHeight;

        /**
         * Helper function for cell names
         * @param charCode
         * @returns {string}
         */
        $scope.getCharFromInt = function(charCode) {
            return String.fromCharCode(97+charCode);
        };

        /**
         * Set the styling of a game world cell
         */
        $scope.styleCell = function() {

            return {
                "min-width" : $scope.cellWidth,
                "min-height" : $scope.cellHeight,
                "width" : $scope.cellWidth,
                "height" : $scope.cellHeight
            };
        };

        /**
         * Checks for an entity at a specific cell
         * @param cell
         * @returns {boolean}
         */
        $scope.entityAtCell = function(cell) {
            return (cell.contains.length > 0);
        };

        /**
         * Get the name of an entity at a specific cell
         * @param cell
         * @returns {string|String|*}
         */
        $scope.getEntityName = function(cell) {
            var entity = _.last(cell.contains);
            entity = $scope.game.getPlayerWithID(entity.playerID).getEntityWithID(entity.entityID);
            return entity.getName();
        };

        /**
         * Get the visual representation of an entity at a specific cell
         * @param cell
         * @returns {*|AbstractView|*}
         */
        $scope.getEntityImage = function(cell) {
            var entity = _.last(cell.contains);
            entity = $scope.game.getPlayerWithID(entity.playerID).getEntityWithID(entity.entityID);
            return entity.getView();
        };

        /**
         * Controles the click event
         * @param xPos
         * @param yPos
         * @param cellIsEnabled
         */
        $scope.cellClicked = function(xPos, yPos, cellIsEnabled) {

            if (cellIsEnabled) {

                if ($scope.game.getCurrentPlayerType() === "HUMAN") {

                    $scope.game.loop(false, xPos, yPos);
                }
            }
        };

        /**
         * Events to fire when the game starts
         */
        $scope.startGame = function() {

            // Prevent navigation while ai player is thinking
            window.onbeforeunload = function(e) {

                if ($scope.game.getGameState() !== "END" && $scope.game.getCurrentPlayerType() === "ARTIFICIAL") {

                    return "Bitte haben Sie noch ein wenig Geduld, bis der KI-Spieler seine Arbeit abgeschlossen hat, um Probleme zu vermeiden.";
                }
            };

            // Perform a pseudo loop to show free fields initially
            $scope.game.pseudoLoop();
        };

        // Connect the game with angularJS scope
        $scope.game.connectGridWeltView($scope);

        // Start the game
        $timeout(function () {
            $scope.startGame();
        }, 0);

    });

    return self_AngularWrapper.module;
};

/**
 * Holds monte carlo tree search statistics
 * @type {Object}
 */
Spoooky.Statistics = {

    changed : false,
    AIplayers : [],

    /**
     * Add a log entry
     * @param metaAgentID
     * @param logType
     * @param round
     * @param value
     */
    logEntry : function(metaAgentID, logType, round, value) {

        // Add logging for a new meta agent
        if (_.isUndefined(this.AIplayers[metaAgentID])) {
            this.AIplayers[metaAgentID] = [];
        }

        if (_.isUndefined(this.AIplayers[metaAgentID][logType])) {
            this.AIplayers[metaAgentID][logType] = [];
        }

        this.AIplayers[metaAgentID][logType].push({
            "round" : round,
            "value" : value
        });

        this.changed = Date.now();
    },

    /**
     * Get a log entry of a specific type
     * @param metaAgentID
     * @param type
     */
    getEntriesOfType : function(metaAgentID, type) {

        if (_.isUndefined(this.AIplayers[metaAgentID])) { return false; }
        if (_.isUndefined(this.AIplayers[metaAgentID][type])) { return false; }

        return this.AIplayers[metaAgentID][type];
    }

};

/**
 * Holds the history of the game
 * @type {Object}
 */
Spoooky.GameProcess = {

    messages : [],
    messageID : 0,

    pushMessage : function(newMessage, messageType) {

        var type = messageType ? messageType : "none";

        // Show not only more than 200 messages
        if (this.messageID % 200 === 0) {
            this.messages.length = 0;
        }

        this.messageID += 1;
        this.messages.push({
            "message" : newMessage,
            "id" : this.messageID,
            "type" : type
        });
    }
};

/**
 * Holds the history of the game
 * @type {Object}
 */
Spoooky.AgentLog = {

    messages : [],
    messageID : 0,

    pushMessage : function(newMessage) {

        // Show not only more than 200 agent log messages
        if (this.messageID % 200 === 0) {
            this.messages.length = 0;
        }

        this.messageID += 1;
        this.messages.push({ message: newMessage, id: this.messageID });
    }
};