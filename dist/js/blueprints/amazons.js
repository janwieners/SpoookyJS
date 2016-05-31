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
    }
};