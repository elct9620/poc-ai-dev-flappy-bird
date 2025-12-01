import type { Vector } from "./Vector";

export interface Entity {
  id: string;
  type: string;
}

export interface ScoreEntity extends Entity {
  type: "score";
  value: number;
  position: Vector;
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
