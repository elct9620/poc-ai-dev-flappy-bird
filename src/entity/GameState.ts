export interface Entity {
  id: string;
  type: string;
}

export interface GameState {
  entities: Record<string, Entity>;
}

export function createGameState(): GameState {
  return {
    entities: {},
  };
}
