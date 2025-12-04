import type { Entity } from "@/entity/GameState";

/**
 * Background entity representing a background scene in the game.
 * @see {@link ../../docs/design/entity/background.md|Background Entity Design Document}
 */
export interface Background extends Entity {
  type: "background";
}

/**
 * Factory function to create a new Background entity.
 */
export function createBackground(id: string): Background {
  return {
    type: "background",
    id,
  };
}
