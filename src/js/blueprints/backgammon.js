Spoooky.Blueprints = {

    /**
     * Blueprints for the game of backgammon
     */
    BACKGAMMON : {

        entities : {

            // Blueprint of standard entity for player 1
            player1StandardEntity : {

                typeID : "A",
                entityType : "Spielfigur von Spielerin 1",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/white_01.png" },
                selectCondition : {
                    neighboursY : [{
                        count: 0, condition: "EQUAL", direction: "NORTH", appliesTo: {
                            axis: "y",
                            operator: ">",
                            value: 4 }
                    },{ count: 0, condition: "EQUAL", direction: "SOUTH", appliesTo: {
                        axis: "y",
                        operator: "<",
                        value: 5 }
                    }]
                },
                moves : [{
                    name : "Zug nach Wuerfelaugen",
                    type : "By Field ID",
                    direction : ["X-AXIS", "POSITIVE"],
                    frequency : "DICE",
                    conditions : [{ condition : "Is Empty", state : true }]
                }],
                goalAtoms : [{
                    atomName : "Eine gegnerische Spielfigur befindet sich auf dem Zielfeld",
                    atomFunction : "Number Of Opponents At Destination Field Is",
                    atomArguments : ["MOVE POSITIVE", 1]
                },{
                    atomName : "Jede Spielfigur befindet sich im letzten Drittel des Spielbrettes",
                    atomFunction : "No Own Entitys On Fields With ID Less Than",
                    atomArguments : 19
                },{
                    atomName : "Spielfigur kann den Auswuerfelbereich erreichen",
                    atomFunction : "Destination Field ID Is Greater Than",
                    atomArguments : ["MOVE POSITIVE", 24]
                }],
                goals : [{
                    type     : "CAPTURE",
                    name     : "Schlage gegnerische Spielfigur auf dem Zielfeld",
                    atoms    : ["Eine gegnerische Spielfigur befindet sich auf dem Zielfeld"],
                    move     : "MOVE POSITIVE"
                },{
                    type     : "BEAROFF",
                    name     : "Auswuerfeln",
                    weight   : 200,
                    atoms    : ["Jede Spielfigur befindet sich im letzten Drittel des Spielbrettes",
                        "Spielfigur kann den Auswuerfelbereich erreichen"],
                    move     : "BEAR OFF MOVE",
                    area : "player1BearOffArea"
                }]
            },

            // Blueprint of standard entity for player 2
            player2StandardEntity : {

                entityType : "player2StandardEntity",

                typeID : "B",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_01.png" },

                // Sets the conditions under which the entity can be chosen / clicked
                selectCondition : {
                    neighboursY : [{
                        count: 0, condition: "EQUAL", direction: "NORTH", appliesTo: {
                            axis: "y",
                            operator: ">",
                            value: 4 }
                    },{ count: 0, condition: "EQUAL", direction: "SOUTH", appliesTo: {
                        axis: "y",
                        operator: "<",
                        value: 5 }
                    }]
                },

                // Moves of the entity
                moves : [{
                    name : "Dice Move",
                    type : "By Field ID",
                    direction : ["X-AXIS", "NEGATIVE"],
                    frequency : "DICE",
                    conditions : [{ condition : "Is Empty", state : true }]
                }],

                goalAtoms : [{
                    atomName : "one opponent entity at destination field",
                    atomFunction : "Number Of Opponents At Destination Field Is",
                    atomArguments : ["MOVE NEGATIVE", 1]
                },{
                    atomName : "Every entity of the associated player is in the first area of the game board",
                    atomFunction : "No Own Entitys On Fields With ID More Than",
                    atomArguments : 6
                },{
                    atomName : "Entity can reach the off board area",
                    atomFunction : "Destination Field ID Is Less Than",
                    atomArguments : ["MOVE NEGATIVE", 1]
                }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent entity at destination field",
                    atoms    : ["one opponent entity at destination field"],
                    move     : "MOVE NEGATIVE"
                },{
                    type     : "BEAROFF",
                    name     : "Bear off",
                    weight   : 200,
                    atoms    : ["Every entity of the associated player is in the first area of the game board",
                        "Entity can reach the off board area"],
                    move     : "BEAR OFF MOVE",
                    area : "player2BearOffArea"
                }]
            }
        },

        consequences : {

            player1 : {
                capture_opponent : {
                    goalName     : "Schlage gegnerische Spielfigur auf dem Zielfeld",
                    entityType : "Spielfigur von Spielerin 1",
                    consequences : [{
                        jobName: "Highlight Dice Target Cell",
                        jobFunction: "Highlight Dice Target Cell",
                        jobArguments: "move_goal",
                        execute: "immediately"
                    },{
                        jobName: "Move the opponent entity to the Bear Off Area",
                        jobFunction: "Bear Off Entity At Dice Target Cell"
                    },{
                        jobName: "Move Entity To Destination Field",
                        jobFunction: "Move Entity To Dice Destination Cell"
                    },{
                        jobName: "Delete Dice Value",
                        jobFunction: "Delete Assigned Dice Value"
                    }]
                },
                bear_off : {
                    goalName : "Auswuerfeln",
                    entityType : "Spielfigur von Spielerin 1",
                    consequences : [{
                        jobName: "Highlight Off Board Area",
                        jobFunction: "Highlight Area",
                        jobArguments: { areaName : "player1BearOffArea", highlightClass : "move_bearoff" },
                        execute: "immediately"
                    },{
                        jobName: "Move the opponent from the game board",
                        jobFunction: "Delete This Entity"
                    },{
                        jobName: "Increment Off Board Entity Counter",
                        jobFunction: "Increment Off Board Counter",
                        jobArguments: "player1BearOffArea"
                    },{
                        jobName: "Delete Dice Value",
                        jobFunction: "Delete Assigned Dice Value"
                    }]
                }
            },

            player2 : {
                capture_opponent : {
                    goalName     : "capture opponent entity at destination field",
                    entityType : "player2StandardEntity",
                    consequences : [{
                        jobName: "Highlight Dice Target Cell",
                        jobFunction: "Highlight Dice Target Cell",
                        jobArguments: "move_goal",
                        execute: "immediately"
                    },{
                        jobName: "Move the opponent entity to the Bear Off Area",
                        jobFunction: "Bear Off Entity At Dice Target Cell"
                    },{
                        jobName: "Move Entity To Destination Field",
                        jobFunction: "Move Entity To Dice Destination Cell"
                    },{
                        jobName: "Delete Dice Value",
                        jobFunction: "Delete Assigned Dice Value"
                    }]
                },
                bear_off : {
                    goalName : "Bear off",
                    entityType : "player2StandardEntity",
                    consequences : [{
                        jobName: "Highlight Off Board Area",
                        jobFunction: "Highlight Area",
                        jobArguments: { areaName : "player2BearOffArea", highlightClass : "move_bearoff" },
                        execute: "immediately"
                    },{
                        jobName: "Move the opponent from the game board",
                        jobFunction: "Delete This Entity"
                    },{
                        jobName: "Increment Off Board Entity Counter",
                        jobFunction: "Increment Off Board Counter",
                        jobArguments: "player2BearOffArea"
                    },{
                        jobName: "Delete Dice Value",
                        jobFunction: "Delete Assigned Dice Value"
                    }]
                }
            }
        }
    }
};