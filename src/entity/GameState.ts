export interface Entity {
  id: string;
  type: string;
}

export interface ScoreEntity extends Entity {
  type: "score";
  value: number;
  position: { x: number; y: number };
  scale: number;
  spacing: number;
  alignment: "left" | "center" | "right";
}

export interface GameState {
  entities: Record<string, Entity>;
}

export function createGameState(): GameState {
  return {
    entities: {},
  };
}
