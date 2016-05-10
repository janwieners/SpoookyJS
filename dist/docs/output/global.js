Ext.data.JsonP.global({"tagname":"class","name":"global","alternateClassNames":[],"members":[{"name":"","tagname":"property","owner":"global","id":"property-","meta":{}},{"name":"AMAZONS","tagname":"property","owner":"global","id":"property-AMAZONS","meta":{}},{"name":"BACKGAMMON","tagname":"property","owner":"global","id":"property-BACKGAMMON","meta":{}},{"name":"CHECKERS","tagname":"property","owner":"global","id":"property-CHECKERS","meta":{}},{"name":"CHESS","tagname":"property","owner":"global","id":"property-CHESS","meta":{}},{"name":"GOMOKU","tagname":"property","owner":"global","id":"property-GOMOKU","meta":{}},{"name":"NINEMENSMORRIS","tagname":"property","owner":"global","id":"property-NINEMENSMORRIS","meta":{}},{"name":"TICTACTOE","tagname":"property","owner":"global","id":"property-TICTACTOE","meta":{}},{"name":"use strict","tagname":"property","owner":"global","id":"property-use strict","meta":{}}],"aliases":{},"files":[{"filename":"","href":""}],"classIcon":"icon-class","superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><div class='doc-contents'><p>Global variables and functions.</p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-property'>Properties</h3><div class='subsection'><div id='property-' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/spoooky.Entity.html#global-property-' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-' class='name expandable'></a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Spoooky.js - A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods\n\nCopyright (c) Jan G. ...</div><div class='long'><p>Spoooky.js - A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods</p>\n\n<p>Copyright (c) Jan G. Wieners; Licensed under the MIT License</p>\n\n<p>http://www.spoookyjs.de, https://github.com/janwieners/spoookyjs</p>\n</div></div></div><div id='property-AMAZONS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/amazons.html#global-property-AMAZONS' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-AMAZONS' class='name expandable'>AMAZONS</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Blueprints for the game of amazons ...</div><div class='long'><p>Blueprints for the game of amazons</p>\n<p>Defaults to: <code>{entities: {white_queen: {entityType: &quot;White Queen&quot;, typeID: &quot;AA&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/white_queen.png&quot;}, moves: [{name: &quot;north&quot;, type: &quot;Default&quot;, direction: &quot;north&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;northeast&quot;, type: &quot;Default&quot;, direction: &quot;northeast&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;east&quot;, type: &quot;Default&quot;, direction: &quot;east&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;southeast&quot;, type: &quot;Default&quot;, direction: &quot;southeast&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;south&quot;, type: &quot;Default&quot;, direction: &quot;south&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;southwest&quot;, type: &quot;Default&quot;, direction: &quot;southwest&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;west&quot;, type: &quot;Default&quot;, direction: &quot;west&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;northwest&quot;, type: &quot;Default&quot;, direction: &quot;northwest&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}]}, black_queen: {entityType: &quot;Black Queen&quot;, typeID: &quot;BA&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/black_queen.png&quot;}, moves: [{name: &quot;north&quot;, type: &quot;Default&quot;, direction: &quot;north&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;northeast&quot;, type: &quot;Default&quot;, direction: &quot;northeast&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;east&quot;, type: &quot;Default&quot;, direction: &quot;east&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;southeast&quot;, type: &quot;Default&quot;, direction: &quot;southeast&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;south&quot;, type: &quot;Default&quot;, direction: &quot;south&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;southwest&quot;, type: &quot;Default&quot;, direction: &quot;southwest&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;west&quot;, type: &quot;Default&quot;, direction: &quot;west&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}, {name: &quot;northwest&quot;, type: &quot;Default&quot;, direction: &quot;northwest&quot;, frequency: &quot;ANY&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}], postMove: [{jobName: &quot;Enable Second Move&quot;, jobFunction: &quot;Prevent Player Change&quot;}, {jobName: &quot;Enable Firing Of One Arrow&quot;, jobFunction: &quot;Change Game Mode&quot;, jobArguments: {mode: &quot;PLACING&quot;}}]}]}, white_arrow: {entityType: &quot;Arrow&quot;, typeID: &quot;AX&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/white_block.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;REACHABLE BY RECENTLY MOVED ENTITY&quot;}, black_arrow: {entityType: &quot;Arrow&quot;, typeID: &quot;BX&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/black_block.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;REACHABLE BY RECENTLY MOVED ENTITY&quot;}}}</code></p></div></div></div><div id='property-BACKGAMMON' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/backgammon.html#global-property-BACKGAMMON' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-BACKGAMMON' class='name expandable'>BACKGAMMON</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Blueprints for the game of backgammon ...</div><div class='long'><p>Blueprints for the game of backgammon</p>\n<p>Defaults to: <code>{entities: {player1StandardEntity: {typeID: &quot;A&quot;, entityType: &quot;Spielfigur von Spielerin 1&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/white_01.png&quot;}, selectCondition: {neighboursY: [{count: 0, condition: &quot;EQUAL&quot;, direction: &quot;NORTH&quot;, appliesTo: {axis: &quot;y&quot;, operator: &quot;&gt;&quot;, value: 4}}, {count: 0, condition: &quot;EQUAL&quot;, direction: &quot;SOUTH&quot;, appliesTo: {axis: &quot;y&quot;, operator: &quot;&lt;&quot;, value: 5}}]}, moves: [{name: &quot;Zug nach Wuerfelaugen&quot;, type: &quot;By Field ID&quot;, direction: [&quot;X-AXIS&quot;, &quot;POSITIVE&quot;], frequency: &quot;DICE&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}]}], goalAtoms: [{atomName: &quot;Eine gegnerische Spielfigur befindet sich auf dem Zielfeld&quot;, atomFunction: &quot;Number Of Opponents At Destination Field Is&quot;, atomArguments: [&quot;MOVE POSITIVE&quot;, 1]}, {atomName: &quot;Jede Spielfigur befindet sich im letzten Drittel des Spielbrettes&quot;, atomFunction: &quot;No Own Entitys On Fields With ID Less Than&quot;, atomArguments: 19}, {atomName: &quot;Spielfigur kann den Auswuerfelbereich erreichen&quot;, atomFunction: &quot;Destination Field ID Is Greater Than&quot;, atomArguments: [&quot;MOVE POSITIVE&quot;, 24]}], goals: [{type: &quot;CAPTURE&quot;, name: &quot;Schlage gegnerische Spielfigur auf dem Zielfeld&quot;, atoms: [&quot;Eine gegnerische Spielfigur befindet sich auf dem Zielfeld&quot;], move: &quot;MOVE POSITIVE&quot;}, {type: &quot;BEAROFF&quot;, name: &quot;Auswuerfeln&quot;, weight: 200, atoms: [&quot;Jede Spielfigur befindet sich im letzten Drittel des Spielbrettes&quot;, &quot;Spielfigur kann den Auswuerfelbereich erreichen&quot;], move: &quot;BEAR OFF MOVE&quot;, area: &quot;player1BearOffArea&quot;}]}, player2StandardEntity: {entityType: &quot;player2StandardEntity&quot;, typeID: &quot;B&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/black_01.png&quot;}, selectCondition: {neighboursY: [{count: 0, condition: &quot;EQUAL&quot;, direction: &quot;NORTH&quot;, appliesTo: {axis: &quot;y&quot;, operator: &quot;&gt;&quot;, value: 4}}, {count: 0, condition: &quot;EQUAL&quot;, direction: &quot;SOUTH&quot;, appliesTo: {axis: &quot;y&quot;, operator: &quot;&lt;&quot;, value: 5}}]}, moves: [{name: &quot;Dice Move&quot;, type: &quot;By Field ID&quot;, direction: [&quot;X-AXIS&quot;, &quot;NEGATIVE&quot;], frequency: &quot;DICE&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}]}], goalAtoms: [{atomName: &quot;one opponent entity at destination field&quot;, atomFunction: &quot;Number Of Opponents At Destination Field Is&quot;, atomArguments: [&quot;MOVE NEGATIVE&quot;, 1]}, {atomName: &quot;Every entity of the associated player is in the first area of the game board&quot;, atomFunction: &quot;No Own Entitys On Fields With ID More Than&quot;, atomArguments: 6}, {atomName: &quot;Entity can reach the off board area&quot;, atomFunction: &quot;Destination Field ID Is Less Than&quot;, atomArguments: [&quot;MOVE NEGATIVE&quot;, 1]}], goals: [{type: &quot;CAPTURE&quot;, name: &quot;capture opponent entity at destination field&quot;, atoms: [&quot;one opponent entity at destination field&quot;], move: &quot;MOVE NEGATIVE&quot;}, {type: &quot;BEAROFF&quot;, name: &quot;Bear off&quot;, weight: 200, atoms: [&quot;Every entity of the associated player is in the first area of the game board&quot;, &quot;Entity can reach the off board area&quot;], move: &quot;BEAR OFF MOVE&quot;, area: &quot;player2BearOffArea&quot;}]}}, consequences: {player1: {capture_opponent: {goalName: &quot;Schlage gegnerische Spielfigur auf dem Zielfeld&quot;, entityType: &quot;Spielfigur von Spielerin 1&quot;, consequences: [{jobName: &quot;Highlight Dice Target Cell&quot;, jobFunction: &quot;Highlight Dice Target Cell&quot;, jobArguments: &quot;move_goal&quot;, execute: &quot;immediately&quot;}, {jobName: &quot;Move the opponent entity to the Bear Off Area&quot;, jobFunction: &quot;Bear Off Entity At Dice Target Cell&quot;}, {jobName: &quot;Move Entity To Destination Field&quot;, jobFunction: &quot;Move Entity To Dice Destination Cell&quot;}, {jobName: &quot;Delete Dice Value&quot;, jobFunction: &quot;Delete Assigned Dice Value&quot;}]}, bear_off: {goalName: &quot;Auswuerfeln&quot;, entityType: &quot;Spielfigur von Spielerin 1&quot;, consequences: [{jobName: &quot;Highlight Off Board Area&quot;, jobFunction: &quot;Highlight Area&quot;, jobArguments: {areaName: &quot;player1BearOffArea&quot;, highlightClass: &quot;move_bearoff&quot;}, execute: &quot;immediately&quot;}, {jobName: &quot;Move the opponent from the game board&quot;, jobFunction: &quot;Delete This Entity&quot;}, {jobName: &quot;Increment Off Board Entity Counter&quot;, jobFunction: &quot;Increment Off Board Counter&quot;, jobArguments: &quot;player1BearOffArea&quot;}, {jobName: &quot;Delete Dice Value&quot;, jobFunction: &quot;Delete Assigned Dice Value&quot;}]}}, player2: {capture_opponent: {goalName: &quot;capture opponent entity at destination field&quot;, entityType: &quot;player2StandardEntity&quot;, consequences: [{jobName: &quot;Highlight Dice Target Cell&quot;, jobFunction: &quot;Highlight Dice Target Cell&quot;, jobArguments: &quot;move_goal&quot;, execute: &quot;immediately&quot;}, {jobName: &quot;Move the opponent entity to the Bear Off Area&quot;, jobFunction: &quot;Bear Off Entity At Dice Target Cell&quot;}, {jobName: &quot;Move Entity To Destination Field&quot;, jobFunction: &quot;Move Entity To Dice Destination Cell&quot;}, {jobName: &quot;Delete Dice Value&quot;, jobFunction: &quot;Delete Assigned Dice Value&quot;}]}, bear_off: {goalName: &quot;Bear off&quot;, entityType: &quot;player2StandardEntity&quot;, consequences: [{jobName: &quot;Highlight Off Board Area&quot;, jobFunction: &quot;Highlight Area&quot;, jobArguments: {areaName: &quot;player2BearOffArea&quot;, highlightClass: &quot;move_bearoff&quot;}, execute: &quot;immediately&quot;}, {jobName: &quot;Move the opponent from the game board&quot;, jobFunction: &quot;Delete This Entity&quot;}, {jobName: &quot;Increment Off Board Entity Counter&quot;, jobFunction: &quot;Increment Off Board Counter&quot;, jobArguments: &quot;player2BearOffArea&quot;}, {jobName: &quot;Delete Dice Value&quot;, jobFunction: &quot;Delete Assigned Dice Value&quot;}]}}}}</code></p></div></div></div><div id='property-CHECKERS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/checkers.html#global-property-CHECKERS' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-CHECKERS' class='name expandable'>CHECKERS</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Blueprints for the game of checkers</p>\n</div><div class='long'><p>Blueprints for the game of checkers</p>\n</div></div></div><div id='property-CHESS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/chess.html#global-property-CHESS' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-CHESS' class='name expandable'>CHESS</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'><p>Blueprints for the game of chess</p>\n</div><div class='long'><p>Blueprints for the game of chess</p>\n</div></div></div><div id='property-GOMOKU' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/gomoku.html#global-property-GOMOKU' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-GOMOKU' class='name expandable'>GOMOKU</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Blueprints for the game of gomoku ...</div><div class='long'><p>Blueprints for the game of gomoku</p>\n<p>Defaults to: <code>{entities: {white: {entityType: &quot;White&quot;, typeID: &quot;A&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/white.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;ANY&quot;}, black: {entityType: &quot;Black&quot;, typeID: &quot;B&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/black.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;ANY&quot;}}}</code></p></div></div></div><div id='property-NINEMENSMORRIS' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/ninemensmorris.html#global-property-NINEMENSMORRIS' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-NINEMENSMORRIS' class='name expandable'>NINEMENSMORRIS</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Blueprints for the game of nine mens morris ...</div><div class='long'><p>Blueprints for the game of nine mens morris</p>\n<p>Defaults to: <code>{entities: {white: {entityType: &quot;White&quot;, typeID: &quot;W&quot;, representation: {type: &quot;image&quot;, texture: &quot;assets/white.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;ANY&quot;, moves: [{name: &quot;Move to connected field&quot;, type: &quot;By Connected Field IDs&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}, {condition: &quot;Player Owns &gt; n Entities&quot;, playerID: 0, value: 3, state: true}]}, {name: &quot;Jump&quot;, type: &quot;Jump To Free Field&quot;, conditions: [{condition: &quot;Player Owns n Entities&quot;, playerID: 0, value: 3, state: true}]}]}, black: {entityType: &quot;Black&quot;, typeID: &quot;B&quot;, representation: {type: &quot;image&quot;, texture: &quot;assets/black.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;ANY&quot;, moves: [{name: &quot;Move to connected field&quot;, type: &quot;By Connected Field IDs&quot;, conditions: [{condition: &quot;Is Empty&quot;, state: true}, {condition: &quot;Player Owns &gt; n Entities&quot;, playerID: 1, value: 3, state: true}]}, {name: &quot;Jump&quot;, type: &quot;Jump To Free Field&quot;, conditions: [{condition: &quot;Player Owns n Entities&quot;, playerID: 1, value: 3, state: true}]}]}}}</code></p></div></div></div><div id='property-TICTACTOE' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/tictactoe.html#global-property-TICTACTOE' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-TICTACTOE' class='name expandable'>TICTACTOE</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Blueprints for the game of tic tac toe ...</div><div class='long'><p>Blueprints for the game of tic tac toe</p>\n<p>Defaults to: <code>{entities: {black: {entityType: &quot;Black&quot;, typeID: &quot;B&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/black.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;ANY&quot;}, white: {entityType: &quot;White&quot;, typeID: &quot;W&quot;, associatedWithMetaAgent: null, representation: {type: &quot;image&quot;, texture: &quot;assets/white.png&quot;}, mode: &quot;PLACE&quot;, placeTo: &quot;ANY&quot;}}}</code></p></div></div></div><div id='property-use strict' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='global'>global</span><br/><a href='source/spoooky.html#global-property-use strict' target='_blank' class='view-source'>view source</a></div><a href='#!/api/global-property-use strict' class='name expandable'>use strict</a> : Object<span class=\"signature\"></span></div><div class='description'><div class='short'>Spoooky.js - A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods\n\nVersion 0.5.1 \"Little Green M...</div><div class='long'><p>Spoooky.js - A JavaScript Multiagent Board Game Framework Based On Monte Carlo Methods</p>\n\n<p>Version 0.5.1 \"Little Green Men\" (December 2015)</p>\n\n<p>Copyright (c) Jan G. Wieners; Licensed under the MIT License</p>\n\n<p>http://www.spoookyjs.de, https://github.com/janwieners/spoookyjs</p>\n\n<p>Dependencies:\n - jQuery 2.1.4\n - Bootstrap 3.3.6\n - AngularJS 1.4.8\n - Angular UI Bootstrap 0.14.3\n - Underscore.js 1.8.3\n - D3.js 3.5.12\n - C3.js 0.4.10</p>\n</div></div></div></div></div></div></div>","meta":{}});