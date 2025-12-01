import type { Entity } from "./GameState";
import type { Vector } from "./Vector";

/**
 * Bird entity represents the player-controlled character in the game.
 * It is a pure data structure containing the bird's position, velocity,
 * rotation, and animation state.
 */
export interface Bird extends Entity {
  type: "bird";
  position: Vector;
  velocity: Vector;
  rotation: number;
  animationFrame: number;
  isAlive: boolean;
}

/**
 * Creates a new bird entity with the specified properties.
 * The bird is initialized at a starting position with zero velocity
 * and default animation state.
 */
export function createBird(id: string, position: Vector): Bird {
  return {
    id,
    type: "bird",
    position,
    velocity: { x: 0, y: 0 },
    rotation: 0,
    animationFrame: 0,
    isAlive: true,
  };
}
