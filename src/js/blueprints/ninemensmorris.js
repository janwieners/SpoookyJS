Spoooky.Blueprints = {

    /**
     * Blueprints for the game of nine mens morris
     */
    NINEMENSMORRIS : {

        entities : {

            white: {
                entityType : "White",
                typeID : "W",
                representation : { type : "image", texture : "assets/white.png" },
                mode : "PLACE",
                placeTo : "ANY",

                // Move to connected fields if player has got more than 3 entities
                moves : [{
                    name : "Move to connected field",
                    type : "By Connected Field IDs",
                    conditions : [
                        { condition : "Is Empty", state : true },
                        { condition : "Player Owns > n Entities",
                            playerID : 0, // Player ID has been set in game.js
                            value : 3,
                            state : true }]
                }, {
                    name : "Jump",
                    type : "Jump To Free Field",
                    conditions : [{
                        condition : "Player Owns n Entities",
                        playerID : 0,
                        value : 3,
                        state : true }]
                }]
            },

            black: {
                entityType : "Black",
                typeID : "B",
                representation : { type : "image", texture : "assets/black.png" },
                mode : "PLACE",
                placeTo : "ANY",

                // Moves are getting automatically enabled when player is in mode "MOVING"
                // Move to connected fields if player has got more than 3 entities
                moves : [{
                    name : "Move to connected field",
                    type : "By Connected Field IDs",
                    conditions : [
                        { condition : "Is Empty", state : true },
                        { condition : "Player Owns > n Entities",
                            playerID : 1,
                            value : 3,
                            state : true }]
                }, {
                    name : "Jump",
                    type : "Jump To Free Field",
                    conditions : [{
                        condition : "Player Owns n Entities",
                        playerID : 1,
                        value : 3,
                        state : true }]
                }]
            }
        }
    }
};