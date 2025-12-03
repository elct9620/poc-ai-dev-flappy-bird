import type { Entity } from "@/entity/GameState";
import type { Vector } from "@/entity/Vector";

/**
 * Bird entity represents the player-controlled character in the game.
 * It is a pure data structure containing the bird's position, velocity,
 * rotation, and animation state.
 *
 * @see {@link ../../docs/design/entity/bird.md|Bird Entity Design Document}
 */
export interface Bird extends Entity {
  type: "bird";
  position: Vector;
  velocity: Vector;
  rotation: number;
  animationFrame: number;
  animationFrameCounter: number; // Tracks ticks for continuous animation
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
    animationFrameCounter: 0,
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
 * Update bird animation frame immutably.
 */
export function updateBirdFrame(bird: Bird, animationFrame: number): Bird {
  return { ...bird, animationFrame };
}

/**
 * Update bird animation state (frame and counter) immutably.
 */
export function updateBirdAnimation(
  bird: Bird,
  animationFrame: number,
  animationFrameCounter: number,
): Bird {
  return { ...bird, animationFrame, animationFrameCounter };
}

/**
 * Set bird alive status immutably.
 */
export function setBirdAlive(bird: Bird, isAlive: boolean): Bird {
  return { ...bird, isAlive };
}
