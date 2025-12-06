import type { Entity } from "@/entity/GameState";
import type { Vector } from "@/entity/Vector";

/**
 * Pipe entity represents a single obstacle pipe in the game.
 * Pipes appear in pairs (top and bottom) with a gap between them.
 * @see {@link ../../docs/design/entity/pipe.md|Pipe Entity Design Document}
 */
export interface Pipe extends Entity {
  type: "pipe";
  position: Vector;
  height: number;
  isTop: boolean;
  gapY: number;
  passed: boolean;
}

/**
 * Factory function to create a new Pipe entity.
 */
export function createPipe(
  id: string,
  position: Vector,
  height: number,
  isTop: boolean,
  gapY: number,
): Pipe {
  return {
    type: "pipe",
    id,
    position,
    height,
    isTop,
    gapY,
    passed: false,
  };
}

/**
 * Update pipe position immutably.
 */
export function updatePipePosition(pipe: Pipe, position: Vector): Pipe {
  return { ...pipe, position };
}

/**
 * Mark pipe as passed immutably.
 */
export function markPipeAsPassed(pipe: Pipe): Pipe {
  return { ...pipe, passed: true };
}
