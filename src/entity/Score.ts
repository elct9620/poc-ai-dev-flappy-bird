import type { Entity } from "./GameState";
import type { Vector } from "./Vector";

export interface Score extends Entity {
  type: "score";
  value: number;
  position: Vector;
  scale: number;
  spacing: number;
  alignment: "left" | "center" | "right";
}
