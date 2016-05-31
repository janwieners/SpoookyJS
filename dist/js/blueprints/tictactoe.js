Spoooky.Blueprints = {

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
    }
};