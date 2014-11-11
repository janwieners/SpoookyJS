Spoooky.Blueprints = {

    /**
     * Blueprints for the game of amazons
     */
    AMAZONS : {

        entities : {

            white_queen: {

                entityType : "White Queen",

                typeID : "AA",

                associatedWithMetaAgent : null,

                representation : { type : "image", texture : "assets/white_queen.png" },

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],

                    // Implement ability to fire an arrow after executed move
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "east",
                    type : "Default",
                    direction : "east",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "southeast",
                    type : "Default",
                    direction : "southeast",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "south",
                    type : "Default",
                    direction : "south",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "southwest",
                    type : "Default",
                    direction : "southwest",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "west",
                    type : "Default",
                    direction : "west",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "northwest",
                    type : "Default",
                    direction : "northwest",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }]
            },

            black_queen: {

                entityType : "Black Queen",

                typeID : "BA",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_queen.png" },

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "east",
                    type : "Default",
                    direction : "east",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "southeast",
                    type : "Default",
                    direction : "southeast",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "south",
                    type : "Default",
                    direction : "south",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "southwest",
                    type : "Default",
                    direction : "southwest",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "west",
                    type : "Default",
                    direction : "west",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }, {
                    name : "northwest",
                    type : "Default",
                    direction : "northwest",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }],
                    postMove : [{
                        jobName: "Enable Second Move",
                        jobFunction: "Prevent Player Change"
                    }, {
                        jobName: "Enable Firing Of One Arrow",
                        jobFunction: "Change Game Mode",
                        jobArguments: { mode: "PLACING" }
                    }]
                }]
            },

            // An arrow is a simple, non-movable entity to block fields
            // and can be placed on fields which are reachable by the
            // recently moved entity
            white_arrow: {
                entityType : "Arrow",
                typeID : "AX",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/white_block.png" },
                mode : "PLACE",
                placeTo : "REACHABLE BY RECENTLY MOVED ENTITY"
            },

            black_arrow: {
                entityType : "Arrow",
                typeID : "BX",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/black_block.png" },
                mode : "PLACE",
                placeTo : "REACHABLE BY RECENTLY MOVED ENTITY"
            }
        }
    },

    /**
     * Blueprints for the game of tic tac toe
     */
    TICTACTOE : {

        entities : {

            // Entities in the game of tic tac toe are just entities
            // They cannot move, have no goals and are simply intended
            // to be put on the game board
            black: {
                entityType : "Black",
                typeID : "B",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/black.png" },
                mode : "PLACE",
                placeTo : "ANY"
            },

            white: {
                entityType : "White",
                typeID : "W",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/white.png" },
                mode : "PLACE",
                placeTo : "ANY"
            }
        }
    },

    /**
     * Blueprints for the game of gomoku
     */
    GOMOKU : {

        entities : {

            white: {
                entityType : "White",
                typeID : "A",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/white.png" },
                mode : "PLACE",
                placeTo : "ANY"
            },

            black: {
                entityType : "Black",
                typeID : "B",
                associatedWithMetaAgent : null,
                representation : { type : "image", texture : "assets/black.png" },
                mode : "PLACE",
                placeTo : "ANY"
            }
        }
    },

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
    },

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
    },

    /**
     * Blueprints for the game of chess
     */
    CHESS : {

        entities : {

            // Entity blueprints for black player
            black_pawn : {

                typeID : "AA",
                entityType : "Black Pawn",
                associatedWithMetaAgent : null,
                representation : { type : "image",
                    texture : "assets/black_pawn.png" },
                // Zugbedingung: Prüfen, ob der eigene König nach
                // ausgeführter Zugmöglichkeit des Bauern angreifbar ist
                postMoveCheck : [{
                    condition : "Entity Is Attackable After Move",
                    state : false, entity : "Black King" }],
                // Zugmöglichkeiten der Spielfigur
                moves : [{
                    name : "Zug in Richtung des unteren Spielfeldrandes",
                    type : "Default",
                    direction : "south",
                    frequency : 1,
                    conditions : [
                        { condition : "Is Empty",
                            state : true },
                        { condition : "Is Not The Last Row",
                            state : true }]
                }, {
                    name : "Startzug: Zwei Felder nach unten",
                    type : "Default",
                    direction : [ 0, +2 ],
                    frequency : 1,
                    conditions : [
                        { condition : "Is Empty",
                            state : true },
                        // Andere Spielfiguren dürfen nicht
                        // übersprungen werden
                        { condition : "Is Empty At",
                            relativeCoordinate : [ 0, +1 ],
                            state : true },
                        { condition : "yPosition",
                            value : 1, state : true }
                    ]
                }],
                // Definition von Unterzielen, die anschließend
                // zu Zielen der Spielfigur zusammengesetzt werden
                goalAtoms : [{
                    atomName : "Gegner auf suedoestlich angrenzendem Feld",
                    atomFunction : "Is Opponent",
                    atomArguments : "southeast"
                },{
                    atomName : "Gegner auf suedwestlich angrenzendem Feld",
                    atomFunction : "Is Opponent",
                    atomArguments : "southwest"
                }, {
                    atomName : "Leeres Feld Suedlich",
                    atomFunction : "Is Empty Cell",
                    atomArguments : "south"
                }, {
                    atomName : "Figur steht auf einem Spielfeld in Zeile vier",
                    atomFunction : "Current Y Position Is",
                    atomArguments : 4
                },{
                    atomName : "Weißer Bauer westlich",
                    atomFunction : "Entity At Cell Is Of Type",
                    atomArguments : [ -1, 0, "White Pawn" ]
                },{
                    atomName : "Weißer Bauer oestlich",
                    atomFunction : "Entity At Cell Is Of Type",
                    atomArguments : [ +1, 0, "White Pawn" ]
                },{
                    atomName : "Weißer Bauer westlich wurde nur einmal bewegt",
                    atomFunction : "Entity At Cell Has Been Moved n Times",
                    atomArguments : [ -1, 0, 1 ]
                },{
                    atomName : "Weißer Bauer oestlich wurde nur einmal bewegt",
                    atomFunction : "Entity At Cell Has Been Moved n Times",
                    atomArguments : [ +1, 0, 1 ]
                },{
                    atomName : "Weißer Bauer westlich wurde zuletzt bewegt",
                    atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
                    atomArguments : [ -1, 0 ]
                },{
                    atomName : "Weißer Bauer oestlich wurde zuletzt bewegt",
                    atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
                    atomArguments : [ +1, 0 ]
                }, {
                    atomName : "Spielfigur kann die unterste Reihe erreichen",
                    atomFunction : "Entity Is Able To Reach A Specific Row",
                    atomArguments : [ "last", "south" ]
                }],
                // Zielatome zu Spielsteinzielen zusammensetzen
                goals : [{
                    type     : "CAPTURE",
                    name     : "Schlage Spielfigur auf Feld suedost",
                    atoms    : ["Gegner auf suedoestlich angrenzendem Feld"],
                    move     : "southeast"
                },{
                    type     : "CAPTURE",
                    name     : "Schlage Spielfigur auf Feld suedwest",
                    atoms    : ["Gegner auf suedwestlich angrenzendem Feld"],
                    move     : [ -1, +1 ]
                },{
                    type     : "CAPTURE",
                    name     : "Schlage Gegner en passant suedwestlich",
                    atoms    : ["Figur steht auf einem Spielfeld in Zeile vier",
                        "Weißer Bauer westlich",
                        "Weißer Bauer westlich wurde nur einmal bewegt",
                        "Weißer Bauer westlich wurde zuletzt bewegt"],
                    move     : "southwest"
                },{
                    type     : "CAPTURE",
                    name     : "Schlage Gegner en passant suedoestlich",
                    atoms    : ["Figur steht auf einem Spielfeld in Zeile vier",
                        "Weißer Bauer oestlich",
                        "Weißer Bauer oestlich wurde nur einmal bewegt",
                        "Weißer Bauer oestlich wurde zuletzt bewegt"],
                    move     : "southeast"
                }, {
                    type     : "GOALMOVE",
                    name     : "Erreiche die letzte Reihe des Spielbrettes",
                    atoms    : ["Leeres Feld Suedlich",
                        "Spielfigur kann die unterste Reihe erreichen"],
                    move     : "south"
                }]
            },

            black_bishop: {

                entityType : "Black Bishop",

                typeID : "AB",

                associatedWithMetaAgent : 1,

                representation : { type : "image", texture : "assets/black_bishop.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "Black King" }],

                // Moves of the entity
                moves : [{
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "southeast",
                        type : "Default",
                        direction : "southeast",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "southwest",
                        type : "Default",
                        direction : "southwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "northwest",
                        type : "Default",
                        direction : "northwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent northeast",
                    atomFunction : "Is Opponent",
                    atomArguments : "northeast"
                },
                    {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast"],
                    move     : "northeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast"],
                    move     : "southeast"
                },{
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest"],
                    move     : "northwest"
                }]
            },

            black_king: {

                entityType : "Black King",

                typeID : "AC",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_king.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "Black King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "east",
                    type : "Default",
                    direction : "east",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "southeast",
                    type : "Default",
                    direction : "southeast",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "south",
                    type : "Default",
                    direction : "south",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "southwest",
                    type : "Default",
                    direction : "southwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "west",
                    type : "Default",
                    direction : "west",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "northwest",
                    type : "Default",
                    direction : "northwest",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "White King" }
                    ]
                }, {
                    name : "short castling",
                    type : "Default",
                    direction : [2, 0],
                    frequency : 1,
                    conditions : [
                        { condition : "Game State", value : "CHECK", state : false },
                        // King entity hasn"t been moved
                        { condition : "Move Count", value : 0 },
                        // White Rook hasn"t been moved
                        { condition : "Move Count Of Entity", value : 0, entityName: "Black Rook Right" },
                        // Destination field is empty
                        { condition : "Is Empty", state : true },
                        // Field between king and destination field is empty
                        { condition : "Is Empty At", relativeCoordinate : [ +1, 0 ], state : true },
                        // Field between king and destination field isn"t attackable by opponent entity
                        { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ +1, 0 ], state : false }
                    ],
                    postMove : [{
                        // Move Rook from e8 to g8
                        jobName: "Move Rook from e8 to g8",
                        jobFunction: "Move Entity With Name",
                        jobArguments: [ "Black Rook Right", -2, 0, "RELATIVE" ]
                    }]
                },{
                    name : "long castling",
                    type : "Default",
                    direction : [-2, 0],
                    frequency : 1,
                    conditions : [
                        { condition : "Game State", value : "CHECK", state : false },
                        // King entity hasn"t been moved
                        { condition : "Move Count", value : 0 },
                        // White Rook hasn"t been moved
                        { condition : "Move Count Of Entity", value : 0, entityName: "Black Rook Left" },
                        // Destination field is empty
                        { condition : "Is Empty", state : true },
                        // Field between king and destination field is empty
                        { condition : "Is Empty At", relativeCoordinate : [ -1, 0 ], state : true },
                        { condition : "Is Empty At", relativeCoordinate : [ -2, 0 ], state : true },
                        { condition : "Is Empty At", relativeCoordinate : [ -3, 0 ], state : true },
                        // Field between king and destination field isn"t attackable by opponent entity
                        { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ -1, 0 ], state : false },
                        { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ -2, 0 ], state : false },
                        { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ -3, 0 ], state : false }
                    ],
                    postMove : [{
                        // Move Rook from a1 to d1
                        jobName: "Move Rook from a1 to d1",
                        jobFunction: "Move Entity With Name",
                        jobArguments: [ "Black Rook Left", +3, 0, "RELATIVE" ]
                    }]
                }],

                // Sub Goals
                goalAtoms : [
                    {
                        atomName : "opponent north",
                        atomFunction : "Is Opponent",
                        atomArguments : "north"
                    },
                    {
                        atomName : "field north is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "north"
                    },
                    {
                        atomName : "opponent northeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "field northeast is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "opponent east",
                        atomFunction : "Is Opponent",
                        atomArguments : "east"
                    },
                    {
                        atomName : "field east is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "east"
                    },
                    {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "field southeast is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "opponent south",
                        atomFunction : "Is Opponent",
                        atomArguments : "south"
                    },
                    {
                        atomName : "field south is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "south"
                    },
                    {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "field southwest is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "opponent west",
                        atomFunction : "Is Opponent",
                        atomArguments : "west"
                    },
                    {
                        atomName : "field west is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "west"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    },
                    {
                        atomName : "field northwest is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "northwest"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent north",
                    atoms    : ["opponent north", "field north is not attackable after capturing opponent entity"],
                    move     : "north"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast", "field northeast is not attackable after capturing opponent entity"],
                    move     : "northeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent east",
                    atoms    : ["opponent east", "field east is not attackable after capturing opponent entity"],
                    move     : "east"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast", "field southeast is not attackable after capturing opponent entity"],
                    move     : "southeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent south",
                    atoms    : ["opponent south", "field south is not attackable after capturing opponent entity"],
                    move     : "south"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest", "field southwest is not attackable after capturing opponent entity"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent west",
                    atoms    : ["opponent west", "field west is not attackable after capturing opponent entity"],
                    move     : "west"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest", "field northwest is not attackable after capturing opponent entity"],
                    move     : "northwest"
                }]
            },

            black_knight: {

                entityType : "Black Knight",

                typeID : "AD",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_knight.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "Black King" }],

                // Moves of the entity
                moves : [{
                    name : "jump northeast 1",
                    type : "Default",
                    direction : [+1, -2],
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "jump northeast 2",
                        type : "Default",
                        direction : [+2, -1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southeast 1",
                        type : "Default",
                        direction : [+2, +1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southeast 2",
                        type : "Default",
                        direction : [+1, +2],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southwest 1",
                        type : "Default",
                        direction : [-1, +2],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southwest 2",
                        type : "Default",
                        direction : [-2, +1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump northwest 1",
                        type : "Default",
                        direction : [-2, -1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump northwest 2",
                        type : "Default",
                        direction : [-1, -2],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent northeast 1",
                    atomFunction : "Is Opponent",
                    atomArguments : [ +1, -2 ]
                },
                    {
                        atomName : "opponent northeast 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [+2, -1]
                    },
                    {
                        atomName : "opponent southeast 1",
                        atomFunction : "Is Opponent",
                        atomArguments : [+2, +1]
                    },
                    {
                        atomName : "opponent southeast 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [+1, +2]
                    },
                    {
                        atomName : "opponent southwest 1",
                        atomFunction : "Is Opponent",
                        atomArguments : [-1, +2]
                    },
                    {
                        atomName : "opponent southwest 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [-2, +1]
                    },
                    {
                        atomName : "opponent northwest 1",
                        atomFunction : "Is Opponent",
                        atomArguments : [-2, -1]
                    },
                    {
                        atomName : "opponent northwest 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [-1, -2]
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent northeast 1",
                    atoms    : ["opponent northeast 1"],
                    move     : [ +1, -2 ]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast 2",
                    atoms    : ["opponent northeast 2"],
                    move     : [ +2, -1 ]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast 1",
                    atoms    : ["opponent southeast 1"],
                    move     : [+2, +1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast 2",
                    atoms    : ["opponent southeast 2"],
                    move     : [+1, +2]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest 1",
                    atoms    : ["opponent southwest 1"],
                    move     : [-1, +2]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest 2",
                    atoms    : ["opponent southwest 2"],
                    move     : [-2, +1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest 1",
                    atoms    : ["opponent northwest 1"],
                    move     : [-2, -1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest 2",
                    atoms    : ["opponent northwest 2"],
                    move     : [-1, -2]
                }]
            },

            black_queen: {

                entityType : "Black Queen",

                typeID : "AE",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_queen.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "Black King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "northeast",
                        type : "Default",
                        direction : "northeast",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "east",
                        type : "Default",
                        direction : "east",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "southeast",
                        type : "Default",
                        direction : "southeast",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "south",
                        type : "Default",
                        direction : "south",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "southwest",
                        type : "Default",
                        direction : "southwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "west",
                        type : "Default",
                        direction : "west",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "northwest",
                        type : "Default",
                        direction : "northwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent north",
                    atomFunction : "Is Opponent",
                    atomArguments : "north"
                },
                    {
                        atomName : "opponent northeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "opponent east",
                        atomFunction : "Is Opponent",
                        atomArguments : "east"
                    },
                    {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "opponent south",
                        atomFunction : "Is Opponent",
                        atomArguments : "south"
                    },
                    {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "opponent west",
                        atomFunction : "Is Opponent",
                        atomArguments : "west"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent north",
                    atoms    : ["opponent north"],
                    move     : "north"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast"],
                    move     : "northeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent east",
                    atoms    : ["opponent east"],
                    move     : "east"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast"],
                    move     : "southeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent south",
                    atoms    : ["opponent south"],
                    move     : "south"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent west",
                    atoms    : ["opponent west"],
                    move     : "west"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest"],
                    move     : "northwest"
                }]
            },

            black_rook: {

                entityType : "Black Rook",

                typeID : "AF",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/black_rook.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "Black King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "east",
                        type : "Default",
                        direction : "east",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "south",
                        type : "Default",
                        direction : "south",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "west",
                        type : "Default",
                        direction : "west",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent north",
                    atomFunction : "Is Opponent",
                    atomArguments : "north"
                },
                    {
                        atomName : "opponent east",
                        atomFunction : "Is Opponent",
                        atomArguments : "east"
                    },
                    {
                        atomName : "opponent south",
                        atomFunction : "Is Opponent",
                        atomArguments : "south"
                    },
                    {
                        atomName : "opponent west",
                        atomFunction : "Is Opponent",
                        atomArguments : "west"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent north",
                    atoms    : ["opponent north"],
                    move     : "north"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent east",
                    atoms    : ["opponent east"],
                    move     : "east"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent south",
                    atoms    : ["opponent south"],
                    move     : "south"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent west",
                    atoms    : ["opponent west"],
                    move     : "west"
                }]
            },

            // Entity blueprints for white player
            white_pawn: {

                entityType : "White Pawn",

                typeID : "BA",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_pawn.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "White King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Is Not The First Row", state : true }]
                },
                    {
                        name : "entry move: two fields north",
                        type : "Default",
                        direction : [ 0, -2 ],
                        frequency : 1,
                        conditions : [
                            { condition : "Is Empty", state : true },
                            // Do not overjump entities
                            { condition : "Is Empty At", relativeCoordinate : [ 0, -1 ], state : true },
                            { condition : "yPosition", value : 6, state : true }
                        ]
                    }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent northeast",
                    atomFunction : "Is Opponent",
                    atomArguments : "northeast"
                },{
                    atomName : "opponent northwest",
                    atomFunction : "Is Opponent",
                    atomArguments : "northwest"
                }, {
                    atomName : "empty field north",
                    atomFunction : "Is Empty Cell",
                    atomArguments : "north"
                }, {
                    atomName : "current entity is at y position 3",
                    atomFunction : "Current Y Position Is",
                    atomArguments : 3
                },{
                    atomName : "black pawn entity at cell west",
                    atomFunction : "Entity At Cell Is Of Type",
                    atomArguments : [ -1, 0, "Black Pawn" ]
                },{
                    atomName : "black pawn entity at cell east",
                    atomFunction : "Entity At Cell Is Of Type",
                    atomArguments : [ +1, 0, "Black Pawn" ]
                },{
                    atomName : "black pawn entity west has been moved only one time",
                    atomFunction : "Entity At Cell Has Been Moved n Times",
                    atomArguments : [ -1, 0, 1 ]
                },{
                    atomName : "black pawn entity east has been moved only one time",
                    atomFunction : "Entity At Cell Has Been Moved n Times",
                    atomArguments : [ +1, 0, 1 ]
                },{
                    atomName : "black pawn entity west was the last moved entity",
                    atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
                    atomArguments : [ -1, 0 ]
                },{
                    atomName : "black pawn entity east was the last moved entity",
                    atomFunction : "Entity At Cell Has Been Moved In Last Game Round",
                    atomArguments : [ +1, 0 ]
                }, {
                    atomName : "white pawn can reach the first row with north move",
                    atomFunction : "Entity Is Able To Reach A Specific Row",
                    atomArguments : [ "first", "north" ]
                }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast"],
                    move     : "northeast"
                },{
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest"],
                    move     : "northwest"
                },{
                    type     : "CAPTURE",
                    name     : "capture opponent northwest en passant",
                    atoms    : ["current entity is at y position 3",
                        "black pawn entity at cell west",
                        "black pawn entity west has been moved only one time",
                        "black pawn entity west was the last moved entity"],
                    move     : "northwest"
                },{
                    type     : "CAPTURE",
                    name     : "capture opponent northeast en passant",
                    atoms    : ["current entity is at y position 3",
                        "black pawn entity at cell east",
                        "black pawn entity east has been moved only one time",
                        "black pawn entity east was the last moved entity"],
                    move     : "northeast"
                }, {
                    type     : "GOALMOVE",
                    name     : "reach the first row with north move",
                    atoms    : ["empty field north",
                        "white pawn can reach the first row with north move"],
                    move     : "north"
                }]
            },


            white_bishop: {

                entityType : "White Bishop",

                typeID : "BB",

                associatedWithMetaAgent : 1,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_bishop.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "White King" }],

                // Moves of the entity
                moves : [{
                    name : "northeast",
                    type : "Default",
                    direction : "northeast",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "southeast",
                        type : "Default",
                        direction : "southeast",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "southwest",
                        type : "Default",
                        direction : "southwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "northwest",
                        type : "Default",
                        direction : "northwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent northeast",
                    atomFunction : "Is Opponent",
                    atomArguments : "northeast"
                },
                    {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast"],
                    move     : "northeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast"],
                    move     : "southeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest"],
                    move     : "northwest"
                }]
            },

            white_king: {

                entityType : "White King",

                typeID : "BC",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_king.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "White King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true },
                        { condition : "Target Field Is Reachable By Opponent Entity",
                            state : false,
                            opponentEntity : "Black King" }
                    ]
                },
                    {
                        name : "northeast",
                        type : "Default",
                        direction : "northeast",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },
                    {
                        name : "east",
                        type : "Default",
                        direction : "east",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },
                    {
                        name : "southeast",
                        type : "Default",
                        direction : "southeast",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },
                    {
                        name : "south",
                        type : "Default",
                        direction : "south",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },
                    {
                        name : "southwest",
                        type : "Default",
                        direction : "southwest",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },
                    {
                        name : "west",
                        type : "Default",
                        direction : "west",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },
                    {
                        name : "northwest",
                        type : "Default",
                        direction : "northwest",
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true },
                            { condition : "Target Field Is Reachable By Opponent Entity",
                                state : false,
                                opponentEntity : "Black King" }
                        ]
                    },{
                        name : "Short Castling",
                        direction : [2, 0],
                        frequency : 1,
                        conditions : [
                            { condition : "Game State", value : "CHECK", state : false },
                            // King entity hasn"t been moved
                            { condition : "Move Count", value : 0 },
                            // White Rook hasn"t been moved
                            { condition : "Move Count Of Entity", value : 0, entityName: "White Rook Right" },
                            // Destination field is empty
                            { condition : "Is Empty", state : true },
                            // Field between king and destination field is empty
                            { condition : "Is Empty At", relativeCoordinate : [ +1, 0 ], state : true },
                            // Field between king and destination field isn"t attackable by opponent entity
                            { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ +1, 0 ], state : false }
                        ],
                        postMove : [{
                            // Move Rook from h1 to f1
                            jobName: "Move Rook from h1 to f1",
                            jobFunction: "Move Entity With Name",
                            jobArguments: [ "White Rook Right", -2, 0, "RELATIVE" ]
                        }]
                    },{
                        name : "long castling",
                        type : "Default",
                        direction : [-2, 0],
                        frequency : 1,
                        conditions : [
                            { condition : "Game State", value : "CHECK", state : false },
                            // King entity hasn"t been moved
                            { condition : "Move Count", value : 0 },
                            // White Rook hasn"t been moved
                            { condition : "Move Count Of Entity", value : 0, entityName: "White Rook Left" },
                            // Destination field is empty
                            { condition : "Is Empty", state : true },
                            // Field between king and destination field is empty
                            { condition : "Is Empty At", relativeCoordinate : [ -1, 0 ], state : true },
                            { condition : "Is Empty At", relativeCoordinate : [ -2, 0 ], state : true },
                            { condition : "Is Empty At", relativeCoordinate : [ -3, 0 ], state : true },
                            // Field between king and destination field isn"t attackable by opponent entity
                            { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ -1, 0 ], state : false },
                            { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ -2, 0 ], state : false },
                            { condition : "Field Is Attackable By Opponent Entity", relativeCoordinate : [ -3, 0 ], state : false }
                        ],
                        postMove : [{
                            // Move Rook from a1 to d1
                            jobName: "Move Rook from a1 to d1",
                            jobFunction: "Move Entity With Name",
                            jobArguments: [ "White Rook Left", +3, 0, "RELATIVE" ]
                        }]
                    }],

                // Sub Goals
                goalAtoms : [
                    {
                        atomName : "opponent north",
                        atomFunction : "Is Opponent",
                        atomArguments : "north"
                    },
                    {
                        atomName : "field north is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "north"
                    },
                    {
                        atomName : "opponent northeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "field northeast is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "opponent east",
                        atomFunction : "Is Opponent",
                        atomArguments : "east"
                    },
                    {
                        atomName : "field east is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "east"
                    },
                    {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "field southeast is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "opponent south",
                        atomFunction : "Is Opponent",
                        atomArguments : "south"
                    },
                    {
                        atomName : "field south is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "south"
                    },
                    {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "field southwest is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "opponent west",
                        atomFunction : "Is Opponent",
                        atomArguments : "west"
                    },
                    {
                        atomName : "field west is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "west"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    },
                    {
                        atomName : "field northwest is not attackable after capturing opponent entity",
                        atomFunction : "Is Not Attackable In Next Round",
                        atomArguments : "northwest"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent north",
                    atoms    : ["opponent north", "field north is not attackable after capturing opponent entity"],
                    move     : "north"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast", "field northeast is not attackable after capturing opponent entity"],
                    move     : "northeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent east",
                    atoms    : ["opponent east", "field east is not attackable after capturing opponent entity"],
                    move     : "east"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast", "field southeast is not attackable after capturing opponent entity"],
                    move     : "southeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent south",
                    atoms    : ["opponent south", "field south is not attackable after capturing opponent entity"],
                    move     : "south"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest", "field southwest is not attackable after capturing opponent entity"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent west",
                    atoms    : ["opponent west", "field west is not attackable after capturing opponent entity"],
                    move     : "west"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest", "field northwest is not attackable after capturing opponent entity"],
                    move     : "northwest"
                }]
            },

            white_knight: {

                entityType : "White Knight",

                typeID : "BD",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_knight.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "White King" }],

                // Moves of the entity
                moves : [{
                    name : "jump northeast 1",
                    type : "Default",
                    direction : [+1, -2],
                    frequency : 1,
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "jump northeast 2",
                        type : "Default",
                        direction : [+2, -1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southeast 1",
                        type : "Default",
                        direction : [+2, +1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southeast 2",
                        type : "Default",
                        direction : [+1, +2],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southwest 1",
                        type : "Default",
                        direction : [-1, +2],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump southwest 2",
                        type : "Default",
                        direction : [-2, +1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump northwest 1",
                        type : "Default",
                        direction : [-2, -1],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "jump northwest 2",
                        type : "Default",
                        direction : [-1, -2],
                        frequency : 1,
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent northeast 1",
                    atomFunction : "Is Opponent",
                    atomArguments : [ +1, -2 ]
                },
                    {
                        atomName : "opponent northeast 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [+2, -1]
                    },
                    {
                        atomName : "opponent southeast 1",
                        atomFunction : "Is Opponent",
                        atomArguments : [+2, +1]
                    },
                    {
                        atomName : "opponent southeast 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [+1, +2]
                    },
                    {
                        atomName : "opponent southwest 1",
                        atomFunction : "Is Opponent",
                        atomArguments : [-1, +2]
                    },
                    {
                        atomName : "opponent southwest 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [-2, +1]
                    },
                    {
                        atomName : "opponent northwest 1",
                        atomFunction : "Is Opponent",
                        atomArguments : [-2, -1]
                    },
                    {
                        atomName : "opponent northwest 2",
                        atomFunction : "Is Opponent",
                        atomArguments : [-1, -2]
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent northeast 1",
                    atoms    : ["opponent northeast 1"],
                    move     : [ +1, -2 ]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast 2",
                    atoms    : ["opponent northeast 2"],
                    move     : [+2, -1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast 1",
                    atoms    : ["opponent southeast 1"],
                    move     : [+2, +1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast 2",
                    atoms    : ["opponent southeast 2"],
                    move     : [+1, +2]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest 1",
                    atoms    : ["opponent southwest 1"],
                    move     : [-1, +2]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest 2",
                    atoms    : ["opponent southwest 2"],
                    move     : [-2, +1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest 1",
                    atoms    : ["opponent northwest 1"],
                    move     : [-2, -1]
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest 2",
                    atoms    : ["opponent northwest 2"],
                    move     : [-1, -2]
                }]
            },

            white_queen: {

                entityType : "White Queen",

                typeID : "BE",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_queen.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "White King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "northeast",
                        type : "Default",
                        direction : "northeast",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "east",
                        type : "Default",
                        direction : "east",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "southeast",
                        type : "Default",
                        direction : "southeast",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "south",
                        type : "Default",
                        direction : "south",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "southwest",
                        type : "Default",
                        direction : "southwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "west",
                        type : "Default",
                        direction : "west",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "northwest",
                        type : "Default",
                        direction : "northwest",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent north",
                    atomFunction : "Is Opponent",
                    atomArguments : "north"
                },
                    {
                        atomName : "opponent northeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "northeast"
                    },
                    {
                        atomName : "opponent east",
                        atomFunction : "Is Opponent",
                        atomArguments : "east"
                    },
                    {
                        atomName : "opponent southeast",
                        atomFunction : "Is Opponent",
                        atomArguments : "southeast"
                    },
                    {
                        atomName : "opponent south",
                        atomFunction : "Is Opponent",
                        atomArguments : "south"
                    },
                    {
                        atomName : "opponent southwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "southwest"
                    },
                    {
                        atomName : "opponent west",
                        atomFunction : "Is Opponent",
                        atomArguments : "west"
                    },
                    {
                        atomName : "opponent northwest",
                        atomFunction : "Is Opponent",
                        atomArguments : "northwest"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent north",
                    atoms    : ["opponent north"],
                    move     : "north"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northeast",
                    atoms    : ["opponent northeast"],
                    move     : "northeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent east",
                    atoms    : ["opponent east"],
                    move     : "east"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southeast",
                    atoms    : ["opponent southeast"],
                    move     : "southeast"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent south",
                    atoms    : ["opponent south"],
                    move     : "south"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent southwest",
                    atoms    : ["opponent southwest"],
                    move     : "southwest"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent west",
                    atoms    : ["opponent west"],
                    move     : "west"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent northwest",
                    atoms    : ["opponent northwest"],
                    move     : "northwest"
                }]
            },

            white_rook: {

                entityType : "White Rook",

                typeID : "BF",

                associatedWithMetaAgent : null,

                // Visualization of the entity
                representation : { type : "image", texture : "assets/white_rook.png" },

                // After a virtual move to the move destination: test for capturable own king
                postMoveCheck : [{ condition : "Entity Is Attackable After Move",
                    state : false, entity : "White King" }],

                // Moves of the entity
                moves : [{
                    name : "north",
                    type : "Default",
                    direction : "north",
                    frequency : "ANY",
                    conditions : [{ condition : "Is Empty", state : true }]
                },
                    {
                        name : "east",
                        type : "Default",
                        direction : "east",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "south",
                        type : "Default",
                        direction : "south",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    },
                    {
                        name : "west",
                        type : "Default",
                        direction : "west",
                        frequency : "ANY",
                        conditions : [{ condition : "Is Empty", state : true }]
                    }],

                // Sub Goals
                // Sub Goals
                goalAtoms : [{
                    atomName : "opponent north",
                    atomFunction : "Is Opponent",
                    atomArguments : "north"
                },
                    {
                        atomName : "opponent east",
                        atomFunction : "Is Opponent",
                        atomArguments : "east"
                    },
                    {
                        atomName : "opponent south",
                        atomFunction : "Is Opponent",
                        atomArguments : "south"
                    },
                    {
                        atomName : "opponent west",
                        atomFunction : "Is Opponent",
                        atomArguments : "west"
                    }],

                // Assemble sub goals / goal atoms to game goals of the entity
                goals : [{
                    type     : "CAPTURE",
                    name     : "capture opponent north",
                    atoms    : ["opponent north"],
                    move     : "north"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent east",
                    atoms    : ["opponent east"],
                    move     : "east"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent south",
                    atoms    : ["opponent south"],
                    move     : "south"
                }, {
                    type     : "CAPTURE",
                    name     : "capture opponent west",
                    atoms    : ["opponent west"],
                    move     : "west"
                }]
            }
        },

        consequences : {

            blackPlayer : {

                black_pawn_reach_last_row_south : {
                    goalName     : "Erreiche die letzte Reihe des Spielbrettes",
                    entityType : "Black Pawn",
                    consequences : [
                        {
                            jobName: "Markiere das Zielfeld",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal",
                                "RELATIVE", "Black Pawn" ],
                            execute: "immediately"
                        }, {
                            jobName: "Entferne gegnerischen Spielstein",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "Black Pawn", "captureMove" ]
                        }, {
                            jobName: "Transformiere Bauer in Koenigin",
                            jobFunction: "Transform Entity",
                            jobArguments: "Black Queen"
                        }]
                },
                black_pawn_capture_opponent_southwest : {
                    goalName     : "Schlage Spielfigur auf Feld suedwest",
                    entityType : "Black Pawn",
                    consequences : [
                        {
                            jobName: "Markiere das Zielfeld",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal",
                                "RELATIVE", "Black Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Entferne gegnerischen Spielstein",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE",
                                "Black Pawn" ]
                        },
                        {
                            jobName: "Bewege Spielfigur",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "Black Pawn",
                                "captureMove" ]
                        }, {
                            jobName: "Transformiere Spielfigur, wenn letzte Reihe erreicht",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "last",
                                entityType : "Black Queen" }
                        }]
                },
                black_pawn_capture_opponent_southwest_enpassant : {
                    goalName     : "Schlage Gegner en passant suedwestlich",
                    entityType : "Black Pawn",
                    consequences : [
                        {
                            jobName: "Markiere das Zielfeld",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal",
                                "RELATIVE", "Black Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Entferne gegnerischen Spielstein",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE",
                                "Black Pawn" ]
                        },
                        {
                            jobName: "Bewege Spielfigur",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "Black Pawn",
                                "captureMove" ]
                        }]
                },
                black_pawn_capture_opponent_southeast : {
                    goalName     : "Schlage Spielfigur auf Feld suedost",
                    entityType : "Black Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "Black Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "Black Pawn" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "Black Pawn", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The First Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "last", entityType : "Black Queen" }
                        }]
                },
                black_pawn_capture_opponent_southeast_enpassant : {
                    goalName     : "Schlage Gegner en passant suedoestlich",
                    entityType : "Black Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "White Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "White Pawn" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "White Pawn", "captureMove" ]
                        }]
                },

                // Bishop
                black_bishop_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "Black Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "Black Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "Black Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "Black Bishop", "captureMove" ]
                        }]
                },
                black_bishop_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "Black Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "Black Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "Black Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "Black Bishop", "captureMove" ]
                        }]
                },
                black_bishop_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "Black Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "Black Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "Black Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "Black Bishop", "captureMove" ]
                        }]
                },
                black_bishop_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "Black Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "Black Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "Black Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "Black Bishop", "captureMove" ]
                        }]
                },

                // King
                black_king_capture_opponent_north : {
                    goalName     : "capture opponent north",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, -1, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_east : {
                    goalName     : "capture opponent east",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, 0, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, 0, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_south : {
                    goalName     : "capture opponent south",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, +1, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "Black King", "captureMove" ]
                        }]
                },
                black_king_capture_opponent_west : {
                    goalName     : "capture opponent west",
                    entityType : "Black King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, 0, "move_goal", "RELATIVE", "Black King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "Black King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, 0, "Black King", "captureMove" ]
                        }]
                },
                // Black Knight
                black_knight_capture_opponent_northeast_1 : {
                    goalName     : "capture opponent northeast 1",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -2, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -2, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -2, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_northeast_2 : {
                    goalName     : "capture opponent northeast 2",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, -1, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +2, -1, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, -1, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_southeast_1 : {
                    goalName     : "capture opponent southeast 1",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, +1, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +2, +1, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, +1, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_southeast_2 : {
                    goalName     : "capture opponent southeast 2",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +2, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +2, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +2, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_southwest_1 : {
                    goalName     : "capture opponent southwest 1",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +2, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +2, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +2, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_southwest_2 : {
                    goalName     : "capture opponent southwest 2",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, +1, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -2, +1, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, +1, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_northwest_1 : {
                    goalName     : "capture opponent northwest 1",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, -1, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -2, -1, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, -1, "Black Knight", "captureMove" ]
                        }]
                },
                black_knight_capture_opponent_northwest_2 : {
                    goalName     : "capture opponent northwest 2",
                    entityType : "Black Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -2, "move_goal", "RELATIVE", "Black Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -2, "RELATIVE", "Black Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -2, "Black Knight", "captureMove" ]
                        }]
                },
                // Black Queen
                black_queen_capture_opponent_north : {
                    goalName     : "capture opponent north",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, -1, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_east : {
                    goalName     : "capture opponent east",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, 0, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, 0, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_south : {
                    goalName     : "capture opponent south",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, +1, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "Black Queen", "captureMove" ]
                        }]
                },
                black_queen_capture_opponent_west : {
                    goalName     : "capture opponent west",
                    entityType : "Black Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, 0, "move_goal", "RELATIVE", "Black Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "Black Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, 0, "Black Queen", "captureMove" ]
                        }]
                },
                // Black Rook
                black_rook_capture_opponent_north : {
                    goalName     : "capture opponent north",
                    entityType : "Black Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "Black Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, -1, "RELATIVE", "Black Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "Black Rook", "captureMove" ]
                        }]
                },
                black_rook_capture_opponent_east : {
                    goalName     : "capture opponent east",
                    entityType : "Black Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, 0, "move_goal", "RELATIVE", "Black Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "Black Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, 0, "Black Rook", "captureMove" ]
                        }]
                },
                black_rook_capture_opponent_south : {
                    goalName     : "capture opponent south",
                    entityType : "Black Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal", "RELATIVE", "Black Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, +1, "RELATIVE", "Black Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "Black Rook", "captureMove" ]
                        }]
                },
                black_rook_capture_opponent_west : {
                    goalName     : "capture opponent west",
                    entityType : "Black Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, 0, "move_goal", "RELATIVE", "Black Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "Black Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, 0, "Black Rook", "captureMove" ]
                        }]
                }
            },

            whitePlayer: {

                white_pawn_reach_first_row_north : {
                    goalName     : "reach the first row with north move",
                    entityType : "White Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "White Pawn" ],
                            execute: "immediately"
                        }, {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "White Pawn", "" ]
                        }, {
                            jobName: "Transform Black Pawn Into White Queen",
                            jobFunction: "Transform Entity",
                            jobArguments: "White Queen"
                        }]
                },
                white_pawn_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "White Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "White Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "White Pawn" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "White Pawn", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The First Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "first", entityType : "White Queen" }
                        }]
                },
                white_pawn_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "White Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "White Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "White Pawn" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "White Pawn", "captureMove" ]
                        }, {
                            jobName: "Transform Entity If It Has Reached The First Row",
                            jobFunction: "Transform Entity If Row Reached",
                            jobArguments: { row : "first", entityType : "White Queen" }
                        }]
                },
                // En Passant Moves
                white_pawn_capture_opponent_northwest_enpassant : {
                    goalName     : "capture opponent northwest en passant",
                    entityType : "White Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "White Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "White Pawn" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "White Pawn", "captureMove" ]
                        }]
                },
                white_pawn_capture_opponent_northeast_enpassant : {
                    goalName     : "capture opponent northeast en passant",
                    entityType : "White Pawn",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "White Pawn" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "White Pawn" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "White Pawn", "captureMove" ]
                        }]
                },

                // Bishop
                white_bishop_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "White Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "White Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "White Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "White Bishop", "captureMove" ]
                        }]
                },
                white_bishop_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "White Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "White Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "White Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "White Bishop", "captureMove" ]
                        }]
                },
                white_bishop_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "White Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "White Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "White Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "White Bishop", "captureMove" ]
                        }]
                },
                white_bishop_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "White Bishop",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "White Bishop" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "White Bishop" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "White Bishop", "captureMove" ]
                        }]
                },

                // King
                white_king_capture_opponent_north : {
                    goalName     : "capture opponent north",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, -1, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_east : {
                    goalName     : "capture opponent east",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, 0, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, 0, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_south : {
                    goalName     : "capture opponent south",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, +1, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "White King", "captureMove" ]
                        }]
                },
                white_king_capture_opponent_west : {
                    goalName     : "capture opponent west",
                    entityType : "White King",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, 0, "move_goal", "RELATIVE", "White King" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "White King" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, 0, "White King", "captureMove" ]
                        }]
                },
                // White Knight
                white_knight_capture_opponent_northeast_1 : {
                    goalName     : "capture opponent northeast 1",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -2, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -2, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -2, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_northeast_2 : {
                    goalName     : "capture opponent northeast 2",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, -1, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +2, -1, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, -1, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_southeast_1 : {
                    goalName     : "capture opponent southeast 1",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +2, +1, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +2, +1, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +2, +1, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_southeast_2 : {
                    goalName     : "capture opponent southeast 2",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +2, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +2, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +2, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_southwest_1 : {
                    goalName     : "capture opponent southwest 1",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +2, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +2, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +2, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_southwest_2 : {
                    goalName     : "capture opponent southwest 2",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, +1, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -2, +1, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, +1, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_northwest_1 : {
                    goalName     : "capture opponent northwest 1",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -2, -1, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -2, -1, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -2, -1, "White Knight", "captureMove" ]
                        }]
                },
                white_knight_capture_opponent_northwest_2 : {
                    goalName     : "capture opponent northwest 2",
                    entityType : "White Knight",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -2, "move_goal", "RELATIVE", "White Knight" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -2, "RELATIVE", "White Knight" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -2, "White Knight", "captureMove" ]
                        }]
                },
                // White Queen
                white_queen_capture_opponent_north : {
                    goalName     : "capture opponent north",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, -1, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_northwest : {
                    goalName     : "capture opponent northwest",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, -1, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, -1, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, -1, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_northeast : {
                    goalName     : "capture opponent northeast",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, -1, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, -1, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, -1, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_east : {
                    goalName     : "capture opponent east",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, 0, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, 0, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_southwest : {
                    goalName     : "capture opponent southwest",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, +1, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, +1, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, +1, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_southeast : {
                    goalName     : "capture opponent southeast",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, +1, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, +1, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, +1, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_south : {
                    goalName     : "capture opponent south",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, +1, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "White Queen", "captureMove" ]
                        }]
                },
                white_queen_capture_opponent_west : {
                    goalName     : "capture opponent west",
                    entityType : "White Queen",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, 0, "move_goal", "RELATIVE", "White Queen" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "White Queen" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, 0, "White Queen", "captureMove" ]
                        }]
                },
                // White Rook
                white_rook_capture_opponent_north : {
                    goalName     : "capture opponent north",
                    entityType : "White Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, -1, "move_goal", "RELATIVE", "White Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, -1, "RELATIVE", "White Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, -1, "White Rook", "captureMove" ]
                        }]
                },
                white_rook_capture_opponent_east : {
                    goalName     : "capture opponent east",
                    entityType : "White Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ +1, 0, "move_goal", "RELATIVE", "White Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ +1, 0, "RELATIVE", "White Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ +1, 0, "White Rook", "captureMove" ]
                        }]
                },
                white_rook_capture_opponent_south : {
                    goalName     : "capture opponent south",
                    entityType : "White Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ 0, +1, "move_goal", "RELATIVE", "White Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ 0, +1, "RELATIVE", "White Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ 0, +1, "White Rook", "captureMove" ]
                        }]
                },
                white_rook_capture_opponent_west : {
                    goalName     : "capture opponent west",
                    entityType : "White Rook",
                    consequences : [
                        {
                            jobName: "Highlight Target Cell",
                            jobFunction: "Highlight Cell",
                            jobArguments: [ -1, 0, "move_goal", "RELATIVE", "White Rook" ],
                            execute: "immediately"
                        },
                        {
                            jobName: "Delete Opponent Entity",
                            jobFunction: "Capture Opponent At",
                            jobArguments: [ -1, 0, "RELATIVE", "White Rook" ]
                        },
                        {
                            jobName: "Move Game Entity",
                            jobFunction: "Move Entity Relative To",
                            jobArguments: [ -1, 0, "White Rook", "captureMove" ]
                        }]
                }
            }
        }
    }
};