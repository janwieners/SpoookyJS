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
 * Spoooky.GridWelt
 * Controller for Spoooky.Models.GameGrid
 *
 * @param game
 * @constructor
 */
Spoooky.GridWelt = function(game) {

    var self_GridWelt = this,
        myGame = game;

    /**
     * Get the number of rows of the game world
     * @returns {number|SQLResultSetRowList|Number|HTMLCollection|string|*}
     */
    self_GridWelt.getRows = function() {
        return myGame.models.worldDimensions.rows;
    };

    /**
     * * Get the number of columns of the game world
     * @returns {number|*}
     */
    self_GridWelt.getColumns = function() {
        return myGame.models.worldDimensions.columns;
    };

    /**
     * Get the visual representation of a grid cell
     * @param cellX
     * @param cellY
     * @returns {*|AbstractView}
     */
    self_GridWelt.getView = function(cellX, cellY) {

        if (self_GridWelt.isValidCoordinate(cellX, cellY)) {
            return myGame.models.GameGrid[cellY][cellX].view;
        }
        return false;
    };

    /**
     * Setup the game world
     * @returns {boolean}
     */
    self_GridWelt.setup = function() {

        if (myGame.models.worldDimensions.fieldsX > 0 &&
            myGame.models.worldDimensions.fieldsY > 0) {
            self_GridWelt.init2DGrid();
            return true;
        } else {
            console.log("Invalid Size of GridWelt");
        }
        return false;
    };

    /**
     * Sets up a two-dimensional game world
     * @param gridColumns
     * @param gridRows
     * @returns {boolean}
     */
    self_GridWelt.setup2D = function(gridColumns, gridRows) {

        myGame.models.worldDimensions.rows = gridRows;
        myGame.models.worldDimensions.columns = gridColumns;
        self_GridWelt.init2DGrid();
        return true;
    };

    /**
     * Sets up the view of the grid cells
     * @param gameBoardArray
     */
    self_GridWelt.setupGameBoard = function(gameBoardArray) {

        var counter = 0,
            maxX = self_GridWelt.getRows(),
            maxY = self_GridWelt.getColumns(),
            x, curCSS;

        for (var y = 0; y < maxX; y += 1) {
            for (x = 0; x < maxY; x += 1) {

                curCSS = gameBoardArray[counter];

                self_GridWelt.setCellBaseClass(x, y, curCSS);

                // If necessary: disable fields
                if (curCSS.indexOf("disabled") !== -1) {
                    // disable this cell
                    myGame.models.GameGrid[x][y].enabled = false;
                }
                counter += 1;
            }
        }
    };

    /**
     * Sets the view of a grid cell
     * @param cellX
     * @param cellY
     * @param curCellClass
     */
    self_GridWelt.setCellClass = function(cellX, cellY, curCellClass) {
        self_GridWelt.getView(cellX, cellY).cellClass = curCellClass;
    };

    /**
     * Sets the base class of a grid cell
     * @param cellX
     * @param cellY
     * @param curCellClass
     */
    self_GridWelt.setCellBaseClass = function(cellX, cellY, curCellClass) {
        self_GridWelt.getView(cellX, cellY).baseClass = curCellClass;
    };

    /**
     * Initializes the internal representation (model) of the two-dimensional game world
     * @returns {boolean}
     */
    self_GridWelt.init2DGrid = function() {

        var curRow,
            curColumn,
            gridRow,
            rowCount,
            columnCount;

        rowCount = self_GridWelt.getRows();
        columnCount = self_GridWelt.getColumns();

        for (curRow = 0 ; curRow < rowCount; curRow += 1) {
            gridRow = [];

            for (curColumn = 0 ; curColumn < columnCount; curColumn += 1) {

                // Create a new grid cell
                gridRow.push({
                    // ID of the cell, used i.e. in backgammon
                    cellID : null,
                    // Holds the content of the cell (entities)
                    contains : [],
                    view : {
                        baseClass : "",
                        cellClass : ""
                    },
                    position : {
                        x : curColumn,
                        y : curRow
                    },
                    enabled : true
                });
            }
            myGame.models.GameGrid.push(gridRow);
        }
        return true;
    };

    /**
     * Enumerates the IDs of fields with a specific CSS class
     * @param CSSclass
     */
    self_GridWelt.enumerateFieldIDsByClass = function(CSSclass) {

        var curX, curY, cell, cellID = 1,
            maxColumn = self_GridWelt.getColumns(),
            maxRow = self_GridWelt.getRows(),
            grid = myGame.models.GameGrid;

        for (curY = 0; curY < maxRow; curY += 1) {

            for (curX = 0; curX < maxColumn; curX += 1) {

                cell = grid[curY][curX];

                if (cell.view.baseClass === CSSclass) {

                    cell.cellID = cellID;
                    cellID++;
                }
            }
        }

    };

    /**
     * Sets the IDs of fields. Allows grouping of fields
     * @param fieldIDArray
     * @returns {boolean}
     */
    self_GridWelt.setFieldIDs = function(fieldIDArray) {

        var curX, curY, counter = 0,
            maxColumn = self_GridWelt.getColumns(),
            maxRow = self_GridWelt.getRows(),
            grid = myGame.models.GameGrid;

        for (curY = 0; curY < maxRow; curY += 1) {

            for (curX = 0; curX < maxColumn; curX += 1) {

                grid[curY][curX].cellID = fieldIDArray[counter];
                counter += 1;
            }
        }
        return true;
    };

    /**
     * Get a cell identifier
     * @param xPosition
     * @param yPosition
     * @returns {*}
     */
    self_GridWelt.getFieldID = function(xPosition, yPosition) {
        if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {
            return myGame.models.GameGrid[yPosition][xPosition].cellID;
        }
        return false;
    };

    /**
     * Connect a cell with another cell / cells by using their IDs
     * @param connections
     */
    self_GridWelt.connectCells = function(connections) {

        // Suppose that the JSON-representation of cell connections is correct
        myGame.models.CellConnections = connections;

    };

    /**
     * Create a string signature for the current game board state
     * @returns {string}
     */
    self_GridWelt.createBoardSignature = function() {

        var gameGrid = myGame.models.GameGrid,
            maxCols = myGame.gameWorld.getColumns(),
            signature = "",
            oneD = _.flatten(gameGrid),
            count = oneD.length,
            current, i;

        for (i = 0; i < count; i++) {

            current = oneD[i].contains;

            if (current.length === 0) {
                signature += "0";
            } else {
                // Pick the last entity on the stack
                signature += _.last(current).typeID;
            }

            if ((i+1) % maxCols === 0 && (i+1) !== count) {
                signature += "|";
            }

        }

        var offBoard = myGame.models.OffBoardContent;
        if (offBoard.length > 0) {
            signature += "|";
            for (i = offBoard.length; i--;) {
                signature += offBoard[i].typeID;
            }
        }

        return signature;
    };

    /**
     * Creates the board signature by vertical coordinates
     * Used in games like gomoku to check vertical count of game entities
     * @returns {string}
     */
    self_GridWelt.createBoardSignatureByVertical = function() {

        var maxRows = self_GridWelt.getRows(),
            maxColumns = self_GridWelt.getColumns(),
            grid = myGame.models.GameGrid,
            current, x, y, signature = "";

        for (x = 0; x < maxColumns; x++) {

            for (y = 0; y < maxRows; y++) {

                current = grid[y][x].contains;

                if (current.length === 0) {
                    signature += "0";
                } else {
                    // Pick the last entity on the stack
                    signature += _.last(current).typeID;
                }
            }

            if ((x+1) !== maxColumns) {
                signature += "|";
            }
        }

        // No off board area regarded
        return signature;
    };

    /**
     * Push a link to an entity to a grid cell
     * @param entity
     * @param xPosition
     * @param yPosition
     * @returns {boolean}
     */
    self_GridWelt.pushToCell = function(entity, xPosition, yPosition) {

        if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {
            myGame.models.GameGrid[yPosition][xPosition].contains.push(entity);
            return true;
        }
        return false;
    };

    /**
     * Retrieve an entity from a grid cell
     * @param xPosition
     * @param yPosition
     * @returns {*}
     */
    self_GridWelt.popFromCell = function(xPosition, yPosition) {

        if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {

            var entityLink = myGame.models.GameGrid[yPosition][xPosition].contains.pop();

            if (entityLink) {
                return myGame.getPlayerWithID(entityLink.playerID).getEntityWithID(entityLink.entityID);
            }
        }
        return false;
    };

    /**
     * Delete cell content
     * @param xPosition
     * @param yPosition
     * @returns {boolean}
     */
    self_GridWelt.deleteCellContent = function(xPosition, yPosition) {

        if (self_GridWelt.isValidCoordinate(xPosition, yPosition)) {

            var currentEntity = self_GridWelt.popFromCell(xPosition, yPosition);
            // Befindet sich ein Entity auf der Spielzelle, so muss auch der Entity gelÃ¶scht werden
            if (currentEntity && currentEntity !== 0) {
                currentEntity.seppuku();
                return true;
            }
        }
        return false;
    };

    /**
     * Retrieve cell content
     * @param xPosition
     * @param yPosition
     * @returns {*}
     */
    self_GridWelt.peekCell = function(xPosition, yPosition) {

        if (self_GridWelt.isValidCoordinate(xPosition, yPosition )) {

            var cellContent = myGame.models.GameGrid[yPosition][xPosition].contains;

            if (cellContent.length !== 0) {
                // Pick the last entity on stack
                cellContent = _.last(cellContent);
                return myGame.getPlayerWithID(cellContent.playerID).getEntityWithID(cellContent.entityID);
            } else {
                // Field is empty
                return false;
            }
        }
        // Invalid coordinate
        return false;
    };

    /**
     * Is xPosition|yPosition a valid field on the game board?
     * @param xPosition
     * @param yPosition
     * @returns {boolean}
     */
    self_GridWelt.isValidCoordinate = function(xPosition, yPosition) {

        var parsedX = parseInt(xPosition, 10), parsedY;

        if (parsedX < self_GridWelt.getColumns() && parsedX >= 0) {
            parsedY = parseInt(yPosition, 10);
            if (parsedY >= 0 && parsedY < self_GridWelt.getRows()) {
                return true;
            }
        }
        return false;
    };

    /**
     * Checks for an empty cell on the game board
     * @param xPosition
     * @param yPosition
     * @returns {boolean}
     */
    self_GridWelt.isEmpty = function(xPosition, yPosition) {
        return (self_GridWelt.peekCell(xPosition, yPosition) === false);
    };

    /**
     * Move an entity to a grid cell
     * @param srcX
     * @param srcY
     * @param destX
     * @param destY
     * @param entityToMove
     * @returns {boolean}
     */
    self_GridWelt.moveEntity = function(srcX, srcY, destX, destY, entityToMove) {

        if (_.isUndefined(destX) || _.isUndefined(destY)) { return false; }
        if (self_GridWelt.isValidCoordinate(destX, destY) === false) { return false; }

        var destinationCellContent = myGame.models.GameGrid[destY][destX].contains,
            srcEntity = self_GridWelt.popFromCell(srcX, srcY);

        // If entityToMove exists
        if (_.isUndefined(entityToMove) === false) {
            entityToMove.setPosition(destX, destY);
            destinationCellContent.push({
                entityID : entityToMove.ID,
                playerID : entityToMove.getMetaPlayerID(),
                typeID : entityToMove.getTypeID()
            });
        } else if (srcEntity) {
            // Notify source entity about move
            srcEntity.setPosition(destX, destY);
            destinationCellContent.push({
                entityID : srcEntity.ID,
                playerID : srcEntity.getMetaPlayerID(),
                typeID : srcEntity.getTypeID()
            });
        } else {
            return false;
        }
        return true;
    };

    /**
     * Retrieve the coordinates of all free fields of the game board
     * @returns {Array}
     */
    self_GridWelt.getFreeCells = function() {

        var freeFields = [],
            maxCol = self_GridWelt.getColumns(),
            maxRow = self_GridWelt.getRows(),
            grid = myGame.models.GameGrid,
            currentCell, curRow;

        for (var curColumn = maxCol; curColumn--;) {
            for (curRow = maxRow; curRow--;) {

                currentCell = grid[curRow][curColumn];

                // Check if cell is disabled
                if (currentCell.enabled) {

                    // Check if cell contains an entity
                    if (currentCell.contains.length === 0) {

                        // Found free field
                        freeFields.push({x: curColumn, y: curRow});
                    }
                }
            }
        }
        return freeFields;
    };

    /**
     * Get free fields with specific field identifier
     * @param fieldID
     * @returns {Array}
     */
    self_GridWelt.getFreeFieldsWithFieldID = function(fieldID) {

        var listOfFreeFields = [],
            maxCol = self_GridWelt.getColumns(),
            maxRow = self_GridWelt.getRows(),
            grid = myGame.models.GameGrid,
            curRow, currentCell;

        for (var curColumn = maxCol; curColumn--;) {
            for (curRow = maxRow; curRow--;) {

                currentCell = grid[curRow][curColumn];
                if (currentCell.contains.length === 0 && currentCell.cellID === fieldID) {
                    listOfFreeFields.push([curColumn, curRow]);
                }
            }
        }
        listOfFreeFields.reverse();
        return listOfFreeFields;
    };

    /**
     * Get all fields with a specific field identifier
     * @param fieldID
     * @param getOnlyOne
     * @returns {Array}
     */
    self_GridWelt.getFieldsWithFieldID = function(fieldID, getOnlyOne) {

        var listOfFields = [],
            models = myGame.models,
            maxCol = models.worldDimensions.columns,
            maxRow = models.worldDimensions.rows,
            grid = models.GameGrid,
            currentCell, curColumn, curRow;

        for (curColumn = maxCol; curColumn--;) {
            for (curRow = maxRow; curRow--;) {

                currentCell = grid[curRow][curColumn];

                if (currentCell.cellID === fieldID) {

                    if (getOnlyOne) {
                        return currentCell;
                    }

                    listOfFields.push(currentCell);
                }
            }
        }
        listOfFields.reverse();
        return listOfFields;
    };

    /**
     * Get the content of fields with specific field identifier
     * @param fieldID
     * @returns {Array}
     */
    self_GridWelt.getContentOfFieldsWithFieldID = function(fieldID) {

        var listOfFields = [],
            maxCol = self_GridWelt.getColumns(),
            maxRow = self_GridWelt.getRows(),
            grid = myGame.models.GameGrid,
            currentCell, curColumn, curRow, content;

        for (curColumn = maxCol; curColumn--;) {
            for (curRow = maxRow; curRow--;) {

                currentCell = grid[curRow][curColumn];
                if (currentCell.cellID === fieldID) {

                    content = self_GridWelt.peekCell(curColumn, curRow);
                    if (content) {
                        listOfFields.push(content);
                    }
                }
            }
        }
        listOfFields.reverse();
        return listOfFields;
    };

    /**
     * Count adjacent fields to the north of the entity
     * @param currentEntity
     * @returns {number}
     */
    self_GridWelt.countNeighboursNorth = function(currentEntity) {

        var entityX = currentEntity.position.x,
            entityY = currentEntity.position.y,
            entityFieldID = myGame.models.GameGrid[entityY][entityX].cellID,
            currentPlayerID = currentEntity.getAssociatedPlayer(),
            neighbourCount = 0,
            peekNorth = self_GridWelt.peekCell(entityX, parseInt(entityY-1, 10)),
            grid = myGame.models.GameGrid;

        if (peekNorth !== false) {

            if (grid[parseInt(entityY-1, 10)][entityX].cellID === entityFieldID) {
                if (peekNorth.getAssociatedPlayer() === currentPlayerID) {
                    neighbourCount += 1;
                }
            }
        }
        return neighbourCount;
    };

    /**
     * Count adjacent fields to the south of the entity
     * @param currentEntity
     * @returns {*}
     */
    self_GridWelt.countNeighboursSouth = function(currentEntity) {

        var entityX = currentEntity.position.x,
            entityY = currentEntity.position.y,
            grid = myGame.models.GameGrid;

        if (self_GridWelt.isValidCoordinate(entityX, entityY) === false) {
            return false;
        }

        var entityFieldID = null,
            currentPlayerID = currentEntity.getAssociatedPlayer(),
            neighbourCount = 0,
            peekSouth = self_GridWelt.peekCell(entityX, parseInt(entityY+1, 10));

        if (grid[entityY][entityX]) {
            entityFieldID = grid[entityY][entityX].cellID;
        }

        if (peekSouth !== false) {

            if (grid[parseInt(entityY+1, 10)][entityX].cellID === entityFieldID) {
                if (peekSouth.getAssociatedPlayer() === currentPlayerID) {
                    neighbourCount += 1;
                }
            }
        }
        return neighbourCount;
    };

    /**
     * Count neighbour entities on the y-axis
     * @param currentEntity
     * @returns {number}
     */
    self_GridWelt.countNeighboursY = function(currentEntity) {
        return self_GridWelt.countNeighboursNorth(currentEntity) + self_GridWelt.countNeighboursSouth(currentEntity);
    }
};