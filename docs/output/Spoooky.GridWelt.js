Ext.data.JsonP.Spoooky_GridWelt({"tagname":"class","name":"Spoooky.GridWelt","autodetected":{},"files":[{"filename":"spoooky.js","href":"spoooky.html#Spoooky-GridWelt"}],"members":[{"name":"constructor","tagname":"method","owner":"Spoooky.GridWelt","id":"method-constructor","meta":{}},{"name":"countNeighboursNorth","tagname":"method","owner":"Spoooky.GridWelt","id":"method-countNeighboursNorth","meta":{}},{"name":"countNeighboursSouth","tagname":"method","owner":"Spoooky.GridWelt","id":"method-countNeighboursSouth","meta":{}},{"name":"countNeighboursY","tagname":"method","owner":"Spoooky.GridWelt","id":"method-countNeighboursY","meta":{}},{"name":"createBoardSignature","tagname":"method","owner":"Spoooky.GridWelt","id":"method-createBoardSignature","meta":{}},{"name":"createBoardSignatureByVertical","tagname":"method","owner":"Spoooky.GridWelt","id":"method-createBoardSignatureByVertical","meta":{}},{"name":"deleteCellContent","tagname":"method","owner":"Spoooky.GridWelt","id":"method-deleteCellContent","meta":{}},{"name":"getColumns","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getColumns","meta":{}},{"name":"getContentOfFieldsWithFieldID","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getContentOfFieldsWithFieldID","meta":{}},{"name":"getFieldID","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getFieldID","meta":{}},{"name":"getFieldsWithFieldID","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getFieldsWithFieldID","meta":{}},{"name":"getFreeCells","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getFreeCells","meta":{}},{"name":"getFreeFieldsWithFieldID","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getFreeFieldsWithFieldID","meta":{}},{"name":"getRows","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getRows","meta":{}},{"name":"getView","tagname":"method","owner":"Spoooky.GridWelt","id":"method-getView","meta":{}},{"name":"init2DGrid","tagname":"method","owner":"Spoooky.GridWelt","id":"method-init2DGrid","meta":{}},{"name":"isEmpty","tagname":"method","owner":"Spoooky.GridWelt","id":"method-isEmpty","meta":{}},{"name":"isValidCoordinate","tagname":"method","owner":"Spoooky.GridWelt","id":"method-isValidCoordinate","meta":{}},{"name":"moveEntity","tagname":"method","owner":"Spoooky.GridWelt","id":"method-moveEntity","meta":{}},{"name":"peekCell","tagname":"method","owner":"Spoooky.GridWelt","id":"method-peekCell","meta":{}},{"name":"popFromCell","tagname":"method","owner":"Spoooky.GridWelt","id":"method-popFromCell","meta":{}},{"name":"pushToCell","tagname":"method","owner":"Spoooky.GridWelt","id":"method-pushToCell","meta":{}},{"name":"setCellBaseClass","tagname":"method","owner":"Spoooky.GridWelt","id":"method-setCellBaseClass","meta":{}},{"name":"setCellClass","tagname":"method","owner":"Spoooky.GridWelt","id":"method-setCellClass","meta":{}},{"name":"setFieldIDs","tagname":"method","owner":"Spoooky.GridWelt","id":"method-setFieldIDs","meta":{}},{"name":"setup","tagname":"method","owner":"Spoooky.GridWelt","id":"method-setup","meta":{}},{"name":"setup2D","tagname":"method","owner":"Spoooky.GridWelt","id":"method-setup2D","meta":{}},{"name":"setupGameBoard","tagname":"method","owner":"Spoooky.GridWelt","id":"method-setupGameBoard","meta":{}}],"alternateClassNames":[],"aliases":{},"id":"class-Spoooky.GridWelt","classIcon":"icon-class","superclasses":[],"subclasses":[],"mixedInto":[],"mixins":[],"parentMixins":[],"requires":[],"uses":[],"html":"<div><pre class=\"hierarchy\"><h4>Files</h4><div class='dependency'><a href='source/spoooky.html#Spoooky-GridWelt' target='_blank'>spoooky.js</a></div></pre><div class='doc-contents'><p>GridWelt\nController for <a href=\"#!/api/Spoooky.Models-property-GameGrid\" rel=\"Spoooky.Models-property-GameGrid\" class=\"docClass\">Spoooky.Models.GameGrid</a></p>\n</div><div class='members'><div class='members-section'><div class='definedBy'>Defined By</div><h3 class='members-title icon-method'>Methods</h3><div class='subsection'><div id='method-constructor' class='member first-child not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-constructor' target='_blank' class='view-source'>view source</a></div><strong class='new-keyword'>new</strong><a href='#!/api/Spoooky.GridWelt-method-constructor' class='name expandable'>Spoooky.GridWelt</a>( <span class='pre'></span> ) : <a href=\"#!/api/Spoooky.GridWelt\" rel=\"Spoooky.GridWelt\" class=\"docClass\">Spoooky.GridWelt</a><span class=\"signature\"></span></div><div class='description'><div class='short'> ...</div><div class='long'>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'><a href=\"#!/api/Spoooky.GridWelt\" rel=\"Spoooky.GridWelt\" class=\"docClass\">Spoooky.GridWelt</a></span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-countNeighboursNorth' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-countNeighboursNorth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-countNeighboursNorth' class='name expandable'>countNeighboursNorth</a>( <span class='pre'>currentEntity</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Count adjacent fields to the north of the entity ...</div><div class='long'><p>Count adjacent fields to the north of the entity</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>currentEntity</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-countNeighboursSouth' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-countNeighboursSouth' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-countNeighboursSouth' class='name expandable'>countNeighboursSouth</a>( <span class='pre'>currentEntity</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Count adjacent fields to the south of the entity ...</div><div class='long'><p>Count adjacent fields to the south of the entity</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>currentEntity</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-countNeighboursY' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-countNeighboursY' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-countNeighboursY' class='name expandable'>countNeighboursY</a>( <span class='pre'>currentEntity</span> ) : number<span class=\"signature\"></span></div><div class='description'><div class='short'>Count neighbour entities on the y-axis ...</div><div class='long'><p>Count neighbour entities on the y-axis</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>currentEntity</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>number</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createBoardSignature' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-createBoardSignature' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-createBoardSignature' class='name expandable'>createBoardSignature</a>( <span class='pre'></span> ) : string<span class=\"signature\"></span></div><div class='description'><div class='short'>Create a string signature for the current game board state ...</div><div class='long'><p>Create a string signature for the current game board state</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>string</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-createBoardSignatureByVertical' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-createBoardSignatureByVertical' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-createBoardSignatureByVertical' class='name expandable'>createBoardSignatureByVertical</a>( <span class='pre'></span> ) : string<span class=\"signature\"></span></div><div class='description'><div class='short'>Creates the board signature by vertical coordinates\nUsed in games like gomoku to check vertical count of game entities ...</div><div class='long'><p>Creates the board signature by vertical coordinates\nUsed in games like gomoku to check vertical count of game entities</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>string</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-deleteCellContent' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-deleteCellContent' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-deleteCellContent' class='name expandable'>deleteCellContent</a>( <span class='pre'>xPosition, yPosition</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Delete cell content ...</div><div class='long'><p>Delete cell content</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getColumns' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getColumns' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getColumns' class='name expandable'>getColumns</a>( <span class='pre'></span> ) : number|*<span class=\"signature\"></span></div><div class='description'><div class='short'>Get the number of columns of the game world ...</div><div class='long'><ul>\n<li>Get the number of columns of the game world</li>\n</ul>\n\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>number|*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getContentOfFieldsWithFieldID' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getContentOfFieldsWithFieldID' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getContentOfFieldsWithFieldID' class='name expandable'>getContentOfFieldsWithFieldID</a>( <span class='pre'>fieldID</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get the content of fields with specific field identifier ...</div><div class='long'><p>Get the content of fields with specific field identifier</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fieldID</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFieldID' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getFieldID' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getFieldID' class='name expandable'>getFieldID</a>( <span class='pre'>xPosition, yPosition</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Get a cell identifier ...</div><div class='long'><p>Get a cell identifier</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFieldsWithFieldID' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getFieldsWithFieldID' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getFieldsWithFieldID' class='name expandable'>getFieldsWithFieldID</a>( <span class='pre'>fieldID</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get all fields with a specific field identifier ...</div><div class='long'><p>Get all fields with a specific field identifier</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fieldID</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFreeCells' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getFreeCells' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getFreeCells' class='name expandable'>getFreeCells</a>( <span class='pre'></span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieve the coordinates of all free fields of the game board ...</div><div class='long'><p>Retrieve the coordinates of all free fields of the game board</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getFreeFieldsWithFieldID' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getFreeFieldsWithFieldID' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getFreeFieldsWithFieldID' class='name expandable'>getFreeFieldsWithFieldID</a>( <span class='pre'>fieldID</span> ) : Array<span class=\"signature\"></span></div><div class='description'><div class='short'>Get free fields with specific field identifier ...</div><div class='long'><p>Get free fields with specific field identifier</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fieldID</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>Array</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getRows' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getRows' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getRows' class='name expandable'>getRows</a>( <span class='pre'></span> ) : number|SQLResultSetRowList|Number|HTMLCollection|string|*<span class=\"signature\"></span></div><div class='description'><div class='short'>Get the number of rows of the game world ...</div><div class='long'><p>Get the number of rows of the game world</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>number|SQLResultSetRowList|Number|HTMLCollection|string|*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-getView' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-getView' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-getView' class='name expandable'>getView</a>( <span class='pre'>cellX, cellY</span> ) : *|AbstractView<span class=\"signature\"></span></div><div class='description'><div class='short'>Get the visual representation of a grid cell ...</div><div class='long'><p>Get the visual representation of a grid cell</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cellX</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>cellY</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*|AbstractView</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-init2DGrid' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-init2DGrid' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-init2DGrid' class='name expandable'>init2DGrid</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Initializes the internal representation (model) of the two-dimensional game world ...</div><div class='long'><p>Initializes the internal representation (model) of the two-dimensional game world</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isEmpty' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-isEmpty' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-isEmpty' class='name expandable'>isEmpty</a>( <span class='pre'>xPosition, yPosition</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Checks for an empty cell on the game board ...</div><div class='long'><p>Checks for an empty cell on the game board</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-isValidCoordinate' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-isValidCoordinate' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-isValidCoordinate' class='name expandable'>isValidCoordinate</a>( <span class='pre'>xPosition, yPosition</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Is xPosition|yPosition a valid field on the game board? ...</div><div class='long'><p>Is xPosition|yPosition a valid field on the game board?</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-moveEntity' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-moveEntity' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-moveEntity' class='name expandable'>moveEntity</a>( <span class='pre'>srcX, srcY, destX, destY, entityToMove</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Move an entity to a grid cell ...</div><div class='long'><p>Move an entity to a grid cell</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>srcX</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>srcY</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>destX</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>destY</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>entityToMove</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-peekCell' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-peekCell' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-peekCell' class='name expandable'>peekCell</a>( <span class='pre'>xPosition, yPosition</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieve cell content ...</div><div class='long'><p>Retrieve cell content</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-popFromCell' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-popFromCell' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-popFromCell' class='name expandable'>popFromCell</a>( <span class='pre'>xPosition, yPosition</span> ) : *<span class=\"signature\"></span></div><div class='description'><div class='short'>Retrieve an entity from a grid cell ...</div><div class='long'><p>Retrieve an entity from a grid cell</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>*</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-pushToCell' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-pushToCell' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-pushToCell' class='name expandable'>pushToCell</a>( <span class='pre'>entity, xPosition, yPosition</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Push a link to an entity to a grid cell ...</div><div class='long'><p>Push a link to an entity to a grid cell</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>entity</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>xPosition</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>yPosition</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setCellBaseClass' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-setCellBaseClass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-setCellBaseClass' class='name expandable'>setCellBaseClass</a>( <span class='pre'>cellX, cellY, curCellClass</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the base class of a grid cell ...</div><div class='long'><p>Sets the base class of a grid cell</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cellX</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>cellY</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>curCellClass</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setCellClass' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-setCellClass' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-setCellClass' class='name expandable'>setCellClass</a>( <span class='pre'>cellX, cellY, curCellClass</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the view of a grid cell ...</div><div class='long'><p>Sets the view of a grid cell</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>cellX</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>cellY</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>curCellClass</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setFieldIDs' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-setFieldIDs' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-setFieldIDs' class='name expandable'>setFieldIDs</a>( <span class='pre'>fieldIDArray</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets the IDs of fields. ...</div><div class='long'><p>Sets the IDs of fields. Allows grouping of fields</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>fieldIDArray</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setup' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-setup' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-setup' class='name expandable'>setup</a>( <span class='pre'></span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Setup the game world ...</div><div class='long'><p>Setup the game world</p>\n<h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setup2D' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-setup2D' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-setup2D' class='name expandable'>setup2D</a>( <span class='pre'>gridColumns, gridRows</span> ) : boolean<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets up a two-dimensional game world ...</div><div class='long'><p>Sets up a two-dimensional game world</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>gridColumns</span> : Object<div class='sub-desc'>\n</div></li><li><span class='pre'>gridRows</span> : Object<div class='sub-desc'>\n</div></li></ul><h3 class='pa'>Returns</h3><ul><li><span class='pre'>boolean</span><div class='sub-desc'>\n</div></li></ul></div></div></div><div id='method-setupGameBoard' class='member  not-inherited'><a href='#' class='side expandable'><span>&nbsp;</span></a><div class='title'><div class='meta'><span class='defined-in' rel='Spoooky.GridWelt'>Spoooky.GridWelt</span><br/><a href='source/spoooky.html#Spoooky-GridWelt-method-setupGameBoard' target='_blank' class='view-source'>view source</a></div><a href='#!/api/Spoooky.GridWelt-method-setupGameBoard' class='name expandable'>setupGameBoard</a>( <span class='pre'>gameBoardArray</span> )<span class=\"signature\"></span></div><div class='description'><div class='short'>Sets up the view of the grid cells ...</div><div class='long'><p>Sets up the view of the grid cells</p>\n<h3 class=\"pa\">Parameters</h3><ul><li><span class='pre'>gameBoardArray</span> : Object<div class='sub-desc'>\n</div></li></ul></div></div></div></div></div></div></div>","meta":{}});