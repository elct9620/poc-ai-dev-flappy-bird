import type { Entity } from "@/entity/GameState";
import type { Vector } from "@/entity/Vector";

/**
 * Score entity for displaying game score.
 * Scale is managed by the Score component, not the entity.
 * @see {@link ../../docs/design/entity/score.md|Score Entity Design Document}
 */
export interface Score extends Entity {
  type: "score";
  value: number;
  position: Vector;
  spacing: number;
  alignment: "left" | "center" | "right";
}

/**
 * Factory function to create a new Score entity.
 */
export function createScore(
  id: string,
  value: number,
  position: Vector,
  spacing: number,
  alignment: "left" | "center" | "right",
): Score {
  return {
    type: "score",
    id,
    value,
    position,
    spacing,
    alignment,
  };
}

/**
 * Update score value immutably.
 */
export function updateScoreValue(score: Score, newValue: number): Score {
  return { ...score, value: newValue };
}

/**
 * Update score position immutably.
 */
export function updateScorePosition(score: Score, position: Vector): Score {
  return { ...score, position };
}
