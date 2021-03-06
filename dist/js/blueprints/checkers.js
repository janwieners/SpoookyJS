Spoooky.Blueprints = {

    /**
     * Blueprints for the game of checkers
     */
    CHECKERS : {

        entities : {

            // Blueprint of standard entity for player 2
            topStandardEntity : {

                entityType : "topStandardEntity",

                // Unique type identifier
                // necessary to create game state signatures
                typeID : "AA",

                // Holds the unique identifier of the associated meta entity
                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_01.png" },

                // Moves of the entity
                moves : [{
                    name : "southeast",
                    type : "Default",
                    direction : "southeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Is Not The Last Row" }]
                }, {
                    name : "southwest",
                    type : "Default",
                    direction : "southwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Is Not The Last Row" }]
                }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent southwest",
                    atomFunction : "Is Opponent",
                    atomArguments : "southwest"
                }, {
                    atomName : "opponent southeast",
                    atomFunction : "Is Opponent",
                    atomArguments : "southeast"
                }, {
                    atomName : "empty field southeast",
                    atomFunction : "Is Empty Cell",
                    atomArguments : "southeast"
                }, {
                    atomName : "empty field southwest",
                    atomFunction : "Is Empty Cell",
                    atomArguments : "southwest"
                }, {
                    atomName : "empty field two fields southwest",
                    atomFunction : "Is Empty Cell",
                    atomArguments : [ -2, +2 ]
                }, {
                    atomName : "empty field two fields southeast",
                    atomFunction : "Is Empty Cell",
                    atomArguments : [ +2, +2 ]
                }, {
                    atomName : "entity can reach the last row with southwest move",
                    atomFunction : "Entity Is Able To Reach A Specific Row",
                    atomArguments : [ "last", "southwest" ]
                }, {
                    atomName : "entity can reach the last row with southeast move",
                    atomFunction : "Entity Is Able To Reach A Specific Row",
                    atomArguments : [ "last", "southeast" ]
                }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest", "empty field two fields southwest"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast", "empty field two fields southeast"],
                    move     : "southeast"
                }, {
                    type     : "GOALMOVE",
                    name     : "reach the last row with southwest move",
                    atoms    : ["empty field southwest",
                        "entity can reach the last row with southwest move"],
                    move     : "southwest"
                }, {
                    type     : "GOALMOVE",
                    name     : "reach the last row with southeast move",
                    atoms    : ["empty field southeast",
                        "entity can reach the last row with southeast move"],
                    move     : "southeast"
                }]
            },

            // Blueprint of advanced entity for player 2
            topKingEntity : {

                entityType : "topKingEntity",

                typeID : "AB",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_02.png" },

                // Moves of the entity
                moves : [{
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }, {
                    name : "southeast",
                    type : "Default",
                    direction : "southeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }, {
                    name : "southwest",
                    type : "Default",
                    direction : "southwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }, {
                    name : "northwest",
                    type : "Default",
                    direction : "northwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }],

                // Sub Goals
                goalAtoms : [
                    {
                        atomName : "opponent northeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    }, {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    }, {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    }, {
                        atomName : "empty field two fields northwest",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ -2, -2 ]
                    }, {
                        atomName : "empty field two fields northeast",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ +2, -2 ]
                    }, {
                        atomName : "empty field two fields southwest",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ -2, +2 ]
                    }, {
                        atomName : "empty field two fields southeast",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ +2, +2 ]
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [
                    {
                        type     : "CAPTURE",
                        name     : "capture opponent northwest",
                        atoms    : ["opponent northwest", "empty field two fields northwest"],
                        move     : "northwest"
                    }, {
                        type     : "CAPTURE",
                        name     : "capture opponent northeast",
                        atoms    : ["opponent northeast", "empty field two fields northeast"],
                        move     : "northeast"
                    }, {
                        type     : "CAPTURE",
                        name     : "capture opponent southwest",
                        atoms    : ["opponent southwest", "empty field two fields southwest"],
                        move     : "southwest"
                    }, {
                        type     : "CAPTURE",
                        name     : "capture opponent southeast",
                        atoms    : ["opponent southeast", "empty field two fields southeast"],
                        move     : "southeast"
                    }]
            },

            // Blueprint of standard entity for player 1
            bottomStandardEntity : {

                entityType : "bottomStandardEntity",

                typeID : "BA",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_01.png" },

                // Moves of the entity
                moves : [{
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Is Not The First Row" }]
                }, {
                    name : "northwest",
                    type : "Default",
                    direction : "northwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Is Not The First Row" }]
                }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent northwest",
                    atomFunction : "Is Opponent",
                    atomArguments : "northwest"
                }, {
                    atomName : "opponent northeast",
                    atomFunction : "Is Opponent",
                    atomArguments : "northeast"
                }, {
                    atomName : "empty field northeast",
                    atomFunction : "Is Empty Cell",
                    atomArguments : "northeast"
                }, {
                    atomName : "empty field northwest",
                    atomFunction : "Is Empty Cell",
                    atomArguments : "northwest"
                }, {
                    atomName : "empty field two fields northwest",
                    atomFunction : "Is Empty Cell",
                    atomArguments : [ -2, -2 ]
                }, {
                    atomName : "empty field two fields northeast",
                    atomFunction : "Is Empty Cell",
                    atomArguments : [ +2, -2 ]
                }, {
                    atomName : "entity can reach the first row with northwest move",
                    atomFunction : "Entity Is Able To Reach A Specific Row",
                    atomArguments : [ "first", "northwest" ]
                }, {
                    atomName : "entity can reach the first row with northeast move",
                    atomFunction : "Entity Is Able To Reach A Specific Row",
                    atomArguments : [ "first", "northeast" ]
                }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest", "empty field two fields northwest"],
                    move     : "northwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast", "empty field two fields northeast"],
                    move     : "northeast"
                }, {
                    type     : "GOALMOVE",
                    name     : "reach the first row with northwest move",
                    atoms    : ["empty field northwest",
                        "entity can reach the first row with northwest move"],
                    move     : "northwest"
                }, {
                    type     : "GOALMOVE",
                    name     : "reach the first row with northeast move",
                    atoms    : ["empty field northeast",
                        "entity can reach the first row with northeast move"],
                    move     : "northeast"
                }]
            },

            // Blueprint of advanced entity for player 1
            bottomKingEntity : {

                entityType : "bottomKingEntity",

                typeID : "BB",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_02.png" },

                // Moves of the entity
                moves : [{
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }, {
                    name : "southeast",
                    type : "Default",
                    direction : "southeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }, {
                    name : "southwest",
                    type : "Default",
                    direction : "southwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }, {
                    name : "northwest",
                    type : "Default",
                    direction : "northwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                }],

                // Sub Goals
                goalAtoms : [
                    {
                        atomName : "opponent northeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "northeast"
                    }, {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    }, {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    }, {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    }, {
                        atomName : "empty field two fields northwest",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ -2, -2 ]
                    }, {
                        atomName : "empty field two fields northeast",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ +2, -2 ]
                    }, {
                        atomName : "empty field two fields southwest",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ -2, +2 ]
                    }, {
                        atomName : "empty field two fields southeast",
                        atomFunction : "Is Empty Cell",
                        atomArguments : [ +2, +2 ]
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [
                    {
                        type     : "CAPTURE",
                        name     : "capture opponent northwest",
                        atoms    : ["opponent northwest", "empty field two fields northwest"],
                        move     : "northwest"
                    }, {
                        type     : "CAPTURE",
                        name     : "capture opponent northeast",
                        atoms    : ["opponent northeast", "empty field two fields northeast"],
                        move     : "northeast"
                    }, {
                        type     : "CAPTURE",
                        name     : "capture opponent southwest",
                        atoms    : ["opponent southwest", "empty field two fields southwest"],
                        move     : "southwest"
                    }, {
                        type     : "CAPTURE",
                        name     : "capture opponent southeast",
                        atoms    : ["opponent southeast", "empty field two fields southeast"],
                        move     : "southeast"
                    }]
            }
        },

        consequences : {

            topPlayer : {
                man_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "topStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, +2, "move_goal", "RELATIVE", "topStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "topStandardEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, +2, "topStandardEntity", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The Last Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "last", entityType : "topKingEntity" }
                        }]
                },
                man_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "topStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, +2, "move_goal", "RELATIVE", "topStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "topStandardEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, +2, "topStandardEntity", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The Last Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "last", entityType : "topKingEntity" }
                        }]
                },

                man_reach_last_row_southwest : {
                    goalName     : "reach the last row with southwest move",
                    entityType : "topStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "topStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "topStandardEntity", "" ]
                        }, {
                            jobName: "Transform Entity Into King Entity",
                            jobFunction: "Transform Entity",
                            jobArguments: "topKingEntity"
                        }]
                },

                man_reach_last_row_southeast : {
                    goalName     : "reach the last row with southeast move",
                    entityType : "topStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "topStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "topStandardEntity", "" ]
                        }, {
                            jobName: "Transform Entity Into King Entity",
                            jobFunction: "Transform Entity",
                            jobArguments: "topKingEntity"
                        }]
                },
                //*** Consequences for king entity
                king_capture_opponent_northwest : {
                    goalName : "capture opponent northwest",
                    entityType : "topKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, -2, "move_goal", "RELATIVE", "topKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "topKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, -2, "topKingEntity", "captureMove" ]
                        }]
                },
                king_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "topKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, -2, "move_goal", "RELATIVE", "topKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "topKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, -2, "topKingEntity", "captureMove" ]
                        }]
                },
                king_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "topKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, +2, "move_goal", "RELATIVE", "topKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "topKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, +2, "topKingEntity", "captureMove" ]
                        }]
                },
                king_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "topKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, +2, "move_goal", "RELATIVE", "topKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "topKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, +2, "topKingEntity", "captureMove" ]
                        }]
                }
            },

            bottomPlayer: {
                man_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "bottomStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, -2, "move_goal", "RELATIVE", "bottomStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "bottomStandardEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, -2, "bottomStandardEntity", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The First Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "first", entityType : "bottomKingEntity" }
                        }]
                },
                man_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "bottomStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, -2, "move_goal", "RELATIVE", "bottomStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "bottomStandardEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, -2, "bottomStandardEntity", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The First Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "first", entityType : "bottomKingEntity" }
                        }]
                },

                man_reach_last_row_northwest : {
                    goalName     : "reach the first row with northwest move",
                    entityType : "bottomStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "bottomStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "bottomStandardEntity", "" ]
                        }, {
                            jobName: "Transform Entity Into King Entity",
                            jobFunction: "Transform Entity",
                            jobArguments: "bottomKingEntity"
                        }]
                },

                man_reach_first_row_northeast : {
                    goalName     : "reach the first row with northeast move",
                    entityType : "bottomStandardEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "bottomStandardEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "topStandardEntity", "" ]
                        }, {
                            jobName: "Transform Entity Into King Entity",
                            jobFunction: "Transform Entity",
                            jobArguments: "bottomKingEntity"
                        }]
                },

                king_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "bottomKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, -2, "move_goal", "RELATIVE", "bottomKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "bottomKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, -2, "bottomKingEntity", "captureMove" ]
                        }]
                },
                king_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "bottomKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, -2, "move_goal", "RELATIVE", "bottomKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "bottomKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, -2, "bottomKingEntity", "captureMove" ]
                        }]
                },
                king_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "bottomKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, +2, "move_goal", "RELATIVE", "bottomKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "bottomKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, +2, "bottomKingEntity", "captureMove" ]
                        }]
                },
                king_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "bottomKingEntity",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, +2, "move_goal", "RELATIVE", "bottomKingEntity" ],
                            execute: "immediately"
                        }, {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "bottomKingEntity" ]
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, +2, "bottomKingEntity", "captureMove" ]
                        }]
                }
            }
        }
    }
};