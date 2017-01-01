(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/agentensemble.htm',
    '<div ng-controller=AgentEnsembleCtrl><h4>Ensemble</h4><div id=ensembleInformation><div id=ensemble ng-repeat="metaAgent in metaAgents"><h5>Meta Agent #{{metaAgent.ID}} ({{metaAgent.name}}) arbeitet mit Ensemble:</h5><div class="agentContainer bg-{{agent.ID % 10}}" id="{{metaAgent.ID}}-{{agent.ID % 10}}" ng-repeat="agent in metaAgent.agents"><div ng-if="metaAgent.countAgents() > 1" class=deleteAgent ng-click="deleteAgent(metaAgent.ID, agent.ID)"><span class="glyphicon glyphicon-remove"></span></div><img class=agentimage ng-src="../../img/spoooky-ghost_{{agent.ID % 10}}.png" alt="Spoooky Logo"> Agent #{{agent.ID}}<ul><li><a class=ensembleTooltip title="Die Fitness des Agenten gibt darüber Aufschluss, wie erfolgreich sich der Agent im Laufe der Partie verhalten hat. Nicht erfolgreiche Agenten werden bei Erreichen einer Fitness von 0 ausgetauscht." data-toggle=tooltip href=# data-original-title="Default tooltip">Fitness: {{agent.fitness}}</a><form><input type=range min=0.0 step=0.1 ng-model=agent.fitness float></form></li><li><a class=ensembleTooltip title="Zeit, die dem Agenten für die Analyse des aktuellen Spielzustandes zur Verfügung steht." data-toggle=tooltip href=# data-original-title="Default tooltip">Nachdenkzeit: {{agent.thinkingTime/1000}} Sekunden</a><form><input type=range min=1000 max=180000 step=1000 ng-model=agent.thinkingTime integer></form></li><li><a class=ensembleTooltip title="Anhand der UCT-Konstante lässt sich das Verhalten der Monte Carlo Spielbaumsuche steuern. Wird die Konstante klein gewählt, betrachtet der Agent einzelne Züge intensiver. Bei einem hohen Konstantenwert versucht der Agent, Zugmöglichkeiten und ihre Folgen gleichmäßig zu betrachten." data-toggle=tooltip href=# data-original-title="Default tooltip">UCT-Konstante: {{agent.uctConstant}}</a><form><input type=range min=0.0 max=1.0 step=0.01 ng-model=agent.uctConstant float></form></li><li><a class=ensembleTooltip title="Maximale Anzahl der ausgeführten Spielrunden in den simulierten Spielen (Rollouts)." data-toggle=tooltip href=# data-original-title="Default tooltip">Max. Simulationsschritte: {{agent.maximumSteps}}</a><form><input type=range min=10 max=20000 step=10 ng-model=agent.maximumSteps integer></form></li><li><a class=ensembleTooltip title="Art und Weise, wie der Agent die Spielwelt und seine Zugmöglichkeiten betrachtet. Ein Agent mit dem Fokus \'MOVES NEAR OPPONENT FIELDS\' untersucht alle Zugmöglichkeiten, die auf Felder der Spielwelt führen, die an gegnerische Spielsteine angrenzen." data-toggle=tooltip href=# data-original-title="Default tooltip">Fokusssierung:</a><div class="input-group input-group-sm"><select class=form-control ng-model=agent.focus ng-options="v for v in focusOptions"></select></div></li></ul></div><div ng-if="metaAgent.countAgents() < 9" class="agentContainer addEnsembleAgent" ng-click=addAgent(metaAgent.ID)><span class="glyphicon glyphicon-plus-sign"></span></div></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/agentlog.htm',
    '<h4>Agent Log</h4><div ng-controller=AgentLogCtrl><div class=output><ul class=unstyled><li ng-repeat="message in messages | orderBy:\'id\':true" ng-bind-html="message.message | unsafe">{{message.message}}</li></ul></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/footer.htm',
    '<div class="container fixed"><p class="text-muted credit">&copy; 2012-2017 Jan G. Wieners <a href=mailto:jan@jan-wieners.de>jan@jan-wieners.de</a> | <a href=http://www.spoookyjs.de/index.html#contact>Impressum</a></p></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/gameheader.htm',
    '<h1>{{gameName}}</h1><div id=symbolNavigation data-spy=affix data-offset-top=400 data-offset-bottom=200><a href=#gameDescription id=descriptionlink><span class="glyphicon glyphicon-list-alt"></span></a> <a href=#gameSetup id=settingslink><span class="glyphicon glyphicon-cog"></span></a> <a href=#statistics id=statslink><span class="glyphicon glyphicon-stats"></span></a> <a href=#mctsgraph id=mctsgraphlink><span class="glyphicon glyphicon-asterisk"></span></a> <a href=#gridWelt id=gridWeltLink><span class="glyphicon glyphicon-th activeToggle"></span></a> <a href=#ensembleInformation id=ensembleLink><img src=../../img/spoooky-ghost-ensemble.png alt="Agent Ensemble"></a></div><div id=descriptiontoggle class="glyphicon glyphicon-list-alt"></div><div id=settingstoggle class="glyphicon glyphicon-cog"></div><div id=statstoggle class="glyphicon glyphicon-stats"></div><div id=mctsgraphtoggle class="glyphicon glyphicon-asterisk"></div><div id=infowrap><div id=gameDescription><h4>Spielbeschreibung "{{gameName}}"</h4><div ng-bind-html="gameDescription | unsafe"></div></div><div id=gameSetup><div ng-controller=GameSettingsCtrl><h4>Einstellungen</h4><div class=row><div class=col-lg-5><div class="input-group input-group-sm"><span class=input-group-addon><span class="glyphicon glyphicon-user"></span><br>I</span> <input class=form-control type=text id=player1name value={{player1.name}} ng-change=changePlayerName(0) ng-model=player1.name><select class=form-control ng-model=playerTypes1.value ng-change=changePlayerType(0) ng-options="v for v in playerTypes1.values"></select></div></div><div class=col-lg-5><div class="input-group input-group-sm"><span class=input-group-addon><span class="glyphicon glyphicon-user"></span><br>II</span> <input class=form-control type=text id=player2name value={{player2.name}} ng-change=changePlayerName(1) ng-model=player2.name><select class=form-control ng-model=playerTypes2.value ng-change=changePlayerType(1) ng-options="v for v in playerTypes2.values"></select></div></div><div class=col-lg-2><button id=reloadButton type=button class="btn btn-primary">Spiel neu starten</button></div></div></div></div><div id=statistics ng-controller=StatisticsCtrl><h4>Statistiken zur Entscheidungsfindung</h4>Die folgenden Linien- und Balkendiagramme veranschaulichen die Performanz der Entscheidungsfindung der Meta Agenten in jeder Runde des Spiels. Das Liniendiagramm repräsentiert die Summe der Spiele, die von allen Agenten des Ensembles simuliert wurden (Rollouts); die Anzahl der Simulationsschritte, die von den Agenten ausgeführt wurden, um die simulierten Spiele zu terminalen Zuständen zu führen, ist als Balkendiagramm dargestellt.<div class=statsContent create-charts-if-finished ng-repeat="agent in metaAgents"><h5>Meta Agent ID {{agent.ID}}</h5><div id=chart-{{agent.ID}}></div></div></div><div id=mctsgraph ng-controller=MCTSGraphCtrl><h4>Monte Carlo Spielbaumsuchläufe</h4>Mit den dynamisch generierten Graphen dieses Dialoges ist die Entscheidungsfindung der individuierten Agenten des Ensembles anhand der Monte Carlo Spielbaumsuche visualisiert. Dargestellt sind die Betrachtungswege vom obersten Knoten - dem Entscheidungsknoten - bis hin zu den <span style="color: #26ab2f">grün</span> eingefärbten terminalen Knoten der Spielbaumsuche. Innerhalb der Darstellungen lässt sich mit gehaltener linker Mousetaste oder per Touchevent navigieren; mit dem Mouserad oder der Vergrößerungsgeste lassen sich die Graphdarstellungen vergrößern und verkleinern. Elternknoten lassen sich mit einem Klick oder Touchevent reduzieren bzw. auffächern.<br>Die Farbintensität der jeweiligen Knoten zeigt die Besuchshäufigkeit an: <span style="color: #68b9f8">Hell eingefärbte Knoten</span> wurden im Rahmen der Monte Carlo Spielbaumsuche selten - und <span style="color: #005faa">dunkle Knoten</span> häufig besucht. Jeder Knoten informiert über den aktuellen Spieler, den gewählten Zug, die Gewinnhäufigkeit sowie die ganzzahlige Anzahl der Besuche.<div id=graphs></div></div></div><script>\n' +
    '\n' +
    '    // *** Initialize Interfaces ***\n' +
    '    $(document).ready(function() {\n' +
    '\n' +
    '        // The game header uses the browsers local storage\n' +
    '        // (HTML5, IE >= 8, Firefox >= 3.5, Safari >=4, Chrome >= 4, ...)\n' +
    '        // to persistently save and determine previously shown interface elements\n' +
    '\n' +
    '        // Initialize: Show previously shown Interfaces / Dialogs ***** //\n' +
    '        var interfaces = [\n' +
    '            "#gameDescription",\n' +
    '            "#gameSetup",\n' +
    '            "#statistics",\n' +
    '            "#mctsgraph"\n' +
    '        ];\n' +
    '        var cur;\n' +
    '\n' +
    '        for (var i = 0; i < interfaces.length; i++) {\n' +
    '\n' +
    '            cur = interfaces[i];\n' +
    '            if (localStorage[cur]) {\n' +
    '                $(cur).show();\n' +
    '            } else {\n' +
    '                $(cur).hide();\n' +
    '            }\n' +
    '        }\n' +
    '\n' +
    '        // Highlight (active) toggle icons\n' +
    '        if ($("#gameDescription").is(":visible")) {\n' +
    '            $("#descriptiontoggle").addClass("activeToggle");\n' +
    '            $("#descriptionlink").addClass("activeToggle");\n' +
    '        }\n' +
    '\n' +
    '        if ($("#gameSetup").is(":visible")) {\n' +
    '            $("#settingstoggle").addClass("activeToggle");\n' +
    '            $("#settingslink").addClass("activeToggle");\n' +
    '        }\n' +
    '\n' +
    '        if ($("#statistics").is(":visible")) {\n' +
    '            $("#statstoggle").addClass("activeToggle");\n' +
    '            $("#statslink").addClass("activeToggle");\n' +
    '        }\n' +
    '\n' +
    '        if ($("#mctsgraph").is(":visible")) {\n' +
    '            $("#mctsgraphtoggle").addClass("activeToggle");\n' +
    '            $("#mctsgraphlink").addClass("activeToggle");\n' +
    '        }\n' +
    '\n' +
    '        // Define Toggles\n' +
    '        $("#descriptiontoggle").click(function(e) {\n' +
    '\n' +
    '            if (!$("#gameDescription").is(":visible")) {\n' +
    '\n' +
    '                localStorage["#gameDescription"] = true;\n' +
    '                $("#descriptiontoggle").addClass("activeToggle");\n' +
    '                $("#descriptionlink").addClass("activeToggle");\n' +
    '            } else {\n' +
    '\n' +
    '                localStorage.removeItem("#gameDescription");\n' +
    '                $("#descriptiontoggle").removeClass("activeToggle");\n' +
    '                $("#descriptionlink").removeClass("activeToggle");\n' +
    '            }\n' +
    '            $("#gameDescription").slideToggle("slow", function() {});\n' +
    '        });\n' +
    '\n' +
    '        $("#descriptionlink").click(function(e) {\n' +
    '\n' +
    '            if (!$("#gameDescription").is(":visible")) {\n' +
    '\n' +
    '                $("#gameDescription").slideDown("slow", function() {});\n' +
    '                localStorage["#gameDescription"] = true;\n' +
    '                $("#descriptiontoggle").addClass("activeToggle");\n' +
    '                $("#descriptionlink").addClass("activeToggle");\n' +
    '            }\n' +
    '        });\n' +
    '\n' +
    '        $("#settingstoggle").click(function() {\n' +
    '\n' +
    '            if (!$("#gameSetup").is(":visible")) {\n' +
    '\n' +
    '                localStorage["#gameSetup"] = true;\n' +
    '                $("#settingstoggle").addClass("activeToggle");\n' +
    '                $("#settingslink").addClass("activeToggle");\n' +
    '            } else {\n' +
    '\n' +
    '                localStorage.removeItem("#gameSetup");\n' +
    '                $("#settingstoggle").removeClass("activeToggle");\n' +
    '                $("#settingslink").removeClass("activeToggle");\n' +
    '            }\n' +
    '            $("#gameSetup").slideToggle("slow", function() {});\n' +
    '        });\n' +
    '\n' +
    '        $("#settingslink").click(function() {\n' +
    '\n' +
    '            if (!$("#gameSetup").is(":visible")) {\n' +
    '\n' +
    '                $("#gameSetup").slideDown("slow", function() {});\n' +
    '                localStorage["#gameSetup"] = true;\n' +
    '                $("#settingstoggle").addClass("activeToggle");\n' +
    '                $("#settingslink").addClass("activeToggle");\n' +
    '            }\n' +
    '        });\n' +
    '\n' +
    '        $("#statstoggle").click(function() {\n' +
    '\n' +
    '            if (!$("#statistics").is(":visible")) {\n' +
    '\n' +
    '                localStorage["#statistics"] = true;\n' +
    '                $("#statstoggle").addClass("activeToggle");\n' +
    '                $("#statslink").addClass("activeToggle");\n' +
    '            } else {\n' +
    '\n' +
    '                localStorage.removeItem("#statistics");\n' +
    '                $("#statstoggle").removeClass("activeToggle");\n' +
    '                $("#statslink").removeClass("activeToggle");\n' +
    '            }\n' +
    '            $("#statistics").slideToggle("slow", function() {});\n' +
    '        });\n' +
    '\n' +
    '        $("#statslink").click(function() {\n' +
    '\n' +
    '            if (!$("#statistics").is(":visible")) {\n' +
    '\n' +
    '                $("#statistics").slideDown("slow", function() {});\n' +
    '                localStorage["#statistics"] = true;\n' +
    '                $("#statstoggle").addClass("activeToggle");\n' +
    '                $("#statslink").addClass("activeToggle");\n' +
    '            }\n' +
    '        });\n' +
    '\n' +
    '        $("#mctsgraphtoggle").click(function() {\n' +
    '\n' +
    '            if (!$("#mctsgraph").is(":visible")) {\n' +
    '                localStorage["#mctsgraph"] = true;\n' +
    '                $("#mctsgraphtoggle").addClass("activeToggle");\n' +
    '                $("#mctsgraphlink").addClass("activeToggle");\n' +
    '            } else {\n' +
    '                localStorage.removeItem("#mctsgraph");\n' +
    '                $("#mctsgraphtoggle").removeClass("activeToggle");\n' +
    '                $("#mctsgraphlink").removeClass("activeToggle");\n' +
    '            }\n' +
    '            $("#mctsgraph").slideToggle("slow", function() {});\n' +
    '        });\n' +
    '\n' +
    '        $("#mctsgraphlink").click(function() {\n' +
    '\n' +
    '            if (!$("#mctsgraph").is(":visible")) {\n' +
    '\n' +
    '                $("#mctsgraph").slideDown("slow", function() {});\n' +
    '                localStorage["#mctsgraph"] = true;\n' +
    '                $("#mctsgraphtoggle").addClass("activeToggle");\n' +
    '                $("#mctsgraphlink").addClass("activeToggle");\n' +
    '            }\n' +
    '        });\n' +
    '\n' +
    '        $("#reloadButton").click(function() {\n' +
    '            location.reload();\n' +
    '        });\n' +
    '\n' +
    '        // *** Left Navigation Bar ***\n' +
    '\n' +
    '        // Initialize\n' +
    '\n' +
    '        /*\n' +
    '        $(\'#symbolNavigation\').affix({\n' +
    '            offset: {\n' +
    '                top: 100\n' +
    '                , bottom: function () {\n' +
    '                    return (this.bottom = $(\'#footer\').outerHeight(true))\n' +
    '                }\n' +
    '            }\n' +
    '        });\n' +
    '        */\n' +
    '\n' +
    '        function scrollNav() {\n' +
    '            $("#symbolNavigation a").click(function(){\n' +
    '\n' +
    '                //Animate\n' +
    '                $("html, body").stop().animate({\n' +
    '                    scrollTop: $( $(this).attr("href") ).offset().top - 160\n' +
    '                }, 700);\n' +
    '                return false;\n' +
    '            });\n' +
    '            $(\'.scrollTop a\').scrollTop();\n' +
    '        }\n' +
    '        scrollNav();\n' +
    '\n' +
    '        // Set the height of game process and agent log interface\n' +
    '        var height = $("#gameGrid").height();\n' +
    '\n' +
    '        // Set the maximum height of the game process container\n' +
    '        $("#gameProcess").css("height", height/2-3);\n' +
    '        $("#gameProcess").css("max-height", height/2-3);\n' +
    '\n' +
    '        $("#gameProcess .output").css("height", height/2-$("#gameProcess h4").height()-40);\n' +
    '        $("#gameProcess .output").css("max-height", height/2-$("#gameProcess h4").height()-40);\n' +
    '\n' +
    '        // Set the maximum width of the game agent log container\n' +
    '        $("#agentLog").css("height", height/2-2);\n' +
    '        $("#agentLog").css("max-height", height/2-2);\n' +
    '\n' +
    '        $("#agentLog .output").css("height", height/2-$("#agentLog h4").height()-40);\n' +
    '        $("#agentLog .output").css("max-height", height/2-$("#agentLog h4").height()-40);\n' +
    '\n' +
    '        // Activate Tooltips\n' +
    '        $(".ensembleTooltip").tooltip();\n' +
    '\n' +
    '    });\n' +
    '\n' +
    '</script>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/gameprocess.htm',
    '<h4>Spielverlauf</h4><div ng-controller=GameProcessCtrl><div class=output><ul class=unstyled><li ng-repeat="message in messages | orderBy:\'id\':true" ng-bind-html="message.message | unsafe">{{message.message}}</li></ul></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/gridwelt.htm',
    '<div><table ng-controller=GridWeltCtrl setcontainerheight id=gridWelt border=0><tr><td class=fieldDescriptionsHorizontalTop>&nbsp;</td><td class=fieldDescriptionsHorizontalTop ng-repeat="row in gameGrid" ng-cloak>{{getCharFromInt($index);}}</td><td>&nbsp;</td></tr><tr ng-repeat="row in gameGrid track by $index" ng-cloak><td class=fieldDescriptionsVerticalLeft>{{row.length-$index}}</td><td ng-repeat="cell in row" id=cell_{{$index}}-{{$parent.$index}} class="gridCell {{cell.view.baseClass}} {{cell.view.cellClass}}" ng-click="cellClicked($index, $parent.$index, cell.enabled)" ng-style=styleCell() ng-cloak><div ng-if=entityAtCell(cell) class=entityAtCell id={{getEntityName(cell)}} style="background-image: url(\'{{getEntityImage(cell)}}\');"></div></td><td class=fieldDescriptionsVerticalRight>{{row.length-$index}}</td></tr><tr><td class=fieldDescriptionsHorizontalBottom>&nbsp;</td><td class=fieldDescriptionsHorizontalBottom ng-repeat="row in gameGrid" ng-cloak>{{getCharFromInt($index);}}</td><td>&nbsp;</td></tr></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/topnavigation.htm',
    '<div class="navbar-default navbar-fixed-top" role=navigation><div class=container><div class=navbar-header><button type=button class="navbar-toggle collapsed" data-toggle=collapse data-target=#spoookynavbar><span class=sr-only>Toggle navigation</span> <span class=icon-bar></span> <span class=icon-bar></span> <span class=icon-bar></span></button> <a class=navbar-brand href=../../index.html><img id=logogfx src=../../img/spoooky-ghost_flat.png alt="Spoooky Logo"> SpoookyJS</a></div><div class="collapse navbar-collapse" id=spoookynavbar role=navigation><ul class="nav navbar-nav navbar-right"><li class=dropdown><a href=# class=dropdown-toggle data-toggle=dropdown>Spiele<b class=caret></b></a><ul class=dropdown-menu role=menu><li><a href=../amazons/index.htm>Amazons</a></li><li><a href=../backgammon/index.htm>Backgammon</a></li><li><a href=../checkers/index.htm>Dame</a></li><li><a href=../gomoku9x9/index.htm>Gomoku 9x9</a></li><li><a href=../gomoku15x15/index.htm>Gomoku 15x15</a></li><li><a href=../ninemensmorris/index.htm>Mühle</a></li><li><a href=../chess/index.htm>Schach</a></li><li><a href=../chessvariant/index.htm>Schachvariante 5x6 (Tutorial)</a></li><li><a href=../tictactoe/index.htm>Tic Tac Toe</a></li></ul></li><li><a href=../../index.html#about>Über SpoookyJS</a></li><li><a href=../../index.html#download>Download</a></li><li><a href=../../tutorials/index.htm>Tutorial</a></li><li><a href=../../docs/index.html>API</a></li><li><a href=https://github.com/janwieners/SpoookyJS><img src=../../img/GitHub-Mark-64px.png alt=GitHub style="width: 20px;"></a></li></ul></div></div></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('spoooky.templates');
} catch (e) {
  module = angular.module('spoooky.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('templates/userdialog.htm',
    '<div class=modal-header><h3 class=modal-title>Herzlich willkommen bei SpoookyJS!</h3></div><div class=modal-body><p>Wenn Sie mir Ihren Namen verraten, passe ich die Spielverlaufsdarstellung gerne für Sie an.</p><div class=input-group><span class=input-group-addon><span class="glyphicon glyphicon-user"></span></span> <input type=text id=userName ng-model=player1.name class=form-control placeholder="Ihr Name"></div><br>Tipp: Sie können die Spieleigenschaften jederzeit im <span class="glyphicon glyphicon-cog"></span>-Bereich ändern.</div><div class=modal-footer><button class="btn btn-default" ng-click=modalCancel()>Abbrechen</button> <button class="btn btn-primary" ng-click=modalSave()>Speichern</button></div>');
}]);
})();
