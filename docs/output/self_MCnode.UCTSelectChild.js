Ext.data.JsonP.self_MCnode_UCTSelectChild({"tagname":"class","name":"self_MCnode.UCTSelectChild","autodetected":{},"files":[{"filename":"spoooky.AI.js","href":"spoooky.AI.html#self_MCnode-UCTSelectChild"}],"return":{"type":"*","name":"return","doc":"\n","properties":null,"html_type":"*"},"members":[{"name":"constructor","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-constructor","meta":{}},{"name":"UCT","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-UCT","meta":{}},{"name":"abNegaMax","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-abNegaMax","meta":{}},{"name":"addChild","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-addChild","meta":{}},{"name":"createMCTSGraph","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-createMCTSGraph","meta":{}},{"name":"createTree","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-createTree","meta":{}},{"name":"max","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-max","meta":{}},{"name":"preProcessChildNodes","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-preProcessChildNodes","meta":{}},{"name":"update","tagname":"method","owner":"self_MCnode.UCTSelectChild","id":"method-update","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-self_MCnode.UCTSelectChild","short_doc":"Select a child node by the upper confidence bounds applied to trees algorithm\ncf. ...","classIcon":"icon-class","superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild' target='_blank'>spoooky.AI.js</a></div></pre><div class='doc-contents'><p>Select a child node by the upper confidence bounds applied to trees algorithm\ncf.\n- http://www.ru.is/faculty/yngvi/pdf/WinandsB09.pdf\n- http://www.math-info.univ-paris5.fr/~Bouzy/publications/CWHUB-pMCTS-2007.pdf</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/self_MCnode.UCTSelectChild-method-constructor' class='name expandable'>self_MCnode.UCTSelectChild</a>( <span class='pre'>game, maxSteps, agentFocus, playerID, QLearner, learn, endTime</span> ) : {winnerID: (boolean|number|*), steps: number}<span class=\"signature\"></span></div><div class='description'><div class='short'>Virtually plays a game from a gamestate to the end of the game ...</div><div class='long'><p>Virtually plays a game from a gamestate to the end of the game</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>game</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>maxSteps</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>agentFocus</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>playerID</span> : Object<div class='sub-desc'><ul>\n<li>ID of the currently deciding meta agent</li>\n</ul>\n\n</div></li><li><span class='pre'>QLearner</span> : Object<div class='sub-desc'><ul>\n<li>Q-Learning module of the meta agent</li>\n</ul>\n\n</div></li><li><span class='pre'>learn</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>endTime</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>{winnerID: (boolean|number|*), steps: number}</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-UCT' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-UCT' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-UCT' class='name expandable'>UCT</a>( <span class='pre'>game, agentFocus, maxSteps, maxTime, learn, uctConstant</span> ) : {results: Array}<span class=\"signature\"></span></div><div class='description'><div class='short'>Execute a Monte Carlo UCT search for itermax iterations starting with the current initial state of the game. ...</div><div class='long'><p>Execute a Monte Carlo UCT search for itermax iterations starting with the current initial state of the game.\nCf. the python code under http://mcts.ai/code/python.html</p>\n\n<p>Steps of Monte Carlo Tree Search (with UCT)\nSee also the wikipedia article: http://en.wikipedia.org/wiki/Monte_Carlo_tree_search</p>\n\n<p>Step I: Selection\nStart from root node R and select successive child nodes down to a leaf node L.</p>\n\n<p>Step II: Expansion\nUnless the chosen leaf node L ends the game: create none or more child nodes of the leaf node\nand choose the node C from the created nodes.</p>\n\n<p>Step III: Simulation\nPlay a random playout from node C or from node L if no child C was created.</p>\n\n<p>Step IV: Backpropagation\nUpdate information in the nodes on the path from C to R, using the result of the playout</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>game</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>agentFocus</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>maxSteps</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>maxTime</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>learn</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>uctConstant</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>{results: Array}</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-abNegaMax' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-abNegaMax' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-abNegaMax' class='name expandable'>abNegaMax</a>( <span class='pre'>game, maxDepth, currentDepth, alpha, beta, pID</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Implementation of the alpha beta pruning algorithm\n(cf. ...</div><div class='long'><p>Implementation of the alpha beta pruning algorithm\n(cf. Millington, Funge: Artificial Intelligence for Games. 2009. 681-684)</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>game</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>maxDepth</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>currentDepth</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>alpha</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>beta</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>pID</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-addChild' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-addChild' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-addChild' class='name expandable'>addChild</a>( <span class='pre'>moveIndex, state</span> ) : Spoooky.AI.MCnode<span class=\"signature\"></span></div><div class='description'><div class='short'>Add a child node to the current node ...</div><div class='long'><p>Add a child node to the current node</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>moveIndex</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>state</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Spoooky.AI.MCnode</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createMCTSGraph' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-createMCTSGraph' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-createMCTSGraph' class='name expandable'>createMCTSGraph</a>( <span class='pre'>data, worldRows</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates a graph which represents the monte carlo tree search\nTo be used with d3.js\nGraph / tree Data in form:\n     va...</div><div class='long'><p>Creates a graph which represents the monte carlo tree search\nTo be used with d3.js\nGraph / tree Data in form:\n     var treeData = [\n     {\n         \"name\": \"Top Level\",\n         \"parent\": \"null\",\n         \"children\": [\n             {\n                 \"name\": \"Level 2: A\",\n                 \"parent\": \"Top Level\",\n                 \"children\": [\n                     {\n                         \"name\": \"Son of A\",\n                         \"parent\": \"Level 2: A\"\n                     },\n                     {\n                         \"name\": \"Daughter of A\",\n                         \"parent\": \"Level 2: A\"\n                     }\n                 ]\n             },\n             {\n                 \"name\": \"Level 2: B\",\n                 \"parent\": \"Top Level\"\n             }\n         ]\n     }\n     ];</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>worldRows</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createTree' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-createTree' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-createTree' class='name expandable'>createTree</a>( <span class='pre'>arr, parent</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Create tree structure\ncf. ...</div><div class='long'><p>Create tree structure\ncf. http://oskarhane.com/create-a-nested-array-recursively-in-javascript/</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>arr</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>parent</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-max' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-max' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-max' class='name expandable'>max</a>( <span class='pre'>paramA, paramB</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Determine the maximum of two parameter values ...</div><div class='long'><p>Determine the maximum of two parameter values</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>paramA</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>paramB</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-preProcessChildNodes' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-preProcessChildNodes' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-preProcessChildNodes' class='name expandable'>preProcessChildNodes</a>( <span class='pre'>data, worldRows, outputChildren</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Recursively reduces the monte carlo uct game tree to a one-dimensional array ...</div><div class='long'><p>Recursively reduces the monte carlo uct game tree to a one-dimensional array</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>data</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>worldRows</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>outputChildren</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-update' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='self_MCnode.UCTSelectChild'>self_MCnode.UCTSelectChild</span><br/><a href='source/spoooky.AI.html#self_MCnode-UCTSelectChild-method-update' target='_blank' class='view-source'>view source</a></div><a href='#!/api/self_MCnode.UCTSelectChild-method-update' class='name expandable'>update</a>( <span class='pre'>result</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Update node's win and visit values ...</div><div class='long'><p>Update node's win and visit values</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>result</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});