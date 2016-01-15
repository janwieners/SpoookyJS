Spoooky.Blueprints = {

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
    }
};