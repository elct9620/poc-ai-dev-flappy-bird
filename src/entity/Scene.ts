import type { Entity } from "@/entity/GameState";

/**
 * Scene entity representing a background in the game.
 * @see {@link ../../docs/design/entity/scene.md|Scene Entity Design Document}
 */
export interface Scene extends Entity {
  type: "scene";
}

/**
 * Factory function to create a new Scene entity.
 */
export function createScene(id: string): Scene {
  return {
    type: "scene",
    id,
  };
}
