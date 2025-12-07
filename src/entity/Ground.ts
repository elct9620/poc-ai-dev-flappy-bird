import type { IEntity } from "@/entity/GameState";

/**
 * Ground entity representing the ground (base) at the bottom of the screen.
 * @see {@link ../../docs/design/entity/ground.md|Ground Entity Design Document}
 */
export interface Ground extends IEntity {
  type: "ground";
}

/**
 * Factory function to create a new Ground entity.
 */
export function createGround(id: string): Ground {
  return {
    type: "ground",
    id,
  };
}
