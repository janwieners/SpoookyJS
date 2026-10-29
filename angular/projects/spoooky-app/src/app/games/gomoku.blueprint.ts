export const GOMOKU_BLUEPRINT = {
  entities: {
    // Steine im Gomoku sind einfache Entities: Sie bewegen sich nicht,
    // haben keine Ziele und werden nur auf das Spielfeld gesetzt.
    black: {
      entityType: 'Black', typeID: 'B', associatedWithMetaAgent: null,
      representation: { type: 'image', texture: 'assets/gomoku/black.png' },
      mode: 'PLACE', placeTo: 'ANY',
    },
    white: {
      entityType: 'White', typeID: 'W', associatedWithMetaAgent: null,
      representation: { type: 'image', texture: 'assets/gomoku/white.png' },
      mode: 'PLACE', placeTo: 'ANY',
    },
  },
};
