import type { IEntity } from "@/entity/GameState";
import type { Vector } from "@/entity/Vector";

/**
 * Bird entity represents the player-controlled character in the game.
 * It is a pure data structure containing the bird's position, velocity,
 * rotation, and alive status.
 *
 * @see {@link ../../docs/design/entity/bird.md|Bird Entity Design Document}
 */
export interface Bird extends IEntity {
  type: "bird";
  position: Vector;
  velocity: Vector;
  rotation: number;
  isAlive: boolean;
}

/**
 * Creates a new bird entity with the specified properties.
 * The bird is initialized at a starting position with zero velocity.
 */
export function createBird(id: string, position: Vector): Bird {
  return {
    id,
    type: "bird",
    position,
    velocity: { x: 0, y: 0 },
    rotation: 0,
    isAlive: true,
  };
}

/**
 * Update bird position immutably.
 */
export function updateBirdPosition(bird: Bird, position: Vector): Bird {
  return { ...bird, position };
}

/**
 * Update bird velocity immutably.
 */
export function updateBirdVelocity(bird: Bird, velocity: Vector): Bird {
  return { ...bird, velocity };
}

/**
 * Update bird rotation immutably.
 */
export function updateBirdRotation(bird: Bird, rotation: number): Bird {
  return { ...bird, rotation };
}

/**
 * Set bird alive status immutably.
 */
export function setBirdAlive(bird: Bird, isAlive: boolean): Bird {
  return { ...bird, isAlive };
}
