import type { Command, System } from "@/engine/engine";
import type { GameState } from "@/entity/GameState";
import type { Pipe } from "@/entity/Pipe";
import {
  createPipe,
  markPipeAsPassed,
  updatePipePosition,
} from "@/entity/Pipe";
import { GameEventType, type Event } from "@/events";
import type { SystemEventType } from "@/events/SystemEvents";
import type { StageAdapter } from "@/systems/StageAdapter";

// Pipe generation constants
const PIPE_WIDTH = 52;
const PIPE_HEIGHT = 320;
const SCROLL_SPEED = 2;

/**
 * Utility function to build a Pipe entity from parameters.
 * @param gapSize The gap size to use for this pipe pair (should be between 140 and 160 pixels)
 */
function buildPipeEntity(
  id: string,
  x: number,
  gapY: number,
  gapSize: number,
  isTop: boolean,
): Pipe {
  // Calculate height based on position and gap
  // Both top and bottom pipes are cropped based on gap position
  const height = isTop
    ? gapY - gapSize / 2
    : PIPE_HEIGHT - (gapY + gapSize / 2);
  // Top pipe: position at gap top edge (will flip upward with negative scale)
  // Bottom pipe: position at gap bottom edge
  const position = isTop
    ? { x, y: gapY - gapSize / 2 }
    : { x, y: gapY + gapSize / 2 };

  return createPipe(id, position, height, isTop, gapY);
}

/**
 * PipeSystem manages pipe obstacle lifecycle including creation, movement, and removal.
 * Handles CREATE_PIPE, TICK, and REMOVE_PIPE events.
 *
 * @see {@link ../../docs/design/system/pipe_system.md|Pipe System Design Document}
 */
export const PipeSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    // Handle CREATE_PIPE event - create a pipe pair
    if (event.type === GameEventType.CreatePipe) {
      commands.push((state) => {
        const currentState = state as GameState;
        const { topId, bottomId, x, gapY, gapSize } = event.payload;

        const topPipe = buildPipeEntity(topId, x, gapY, gapSize, true);
        const bottomPipe = buildPipeEntity(bottomId, x, gapY, gapSize, false);

        // Update adapter for both pipes
        adapter.updatePipe(topPipe);
        adapter.updatePipe(bottomPipe);

        return {
          ...currentState,
          entities: {
            ...currentState.entities,
            [topId]: topPipe,
            [bottomId]: bottomPipe,
          },
        };
      });
    }

    // Handle TICK event - update pipe positions and mark as passed
    if (event.type === ("TICK" as SystemEventType)) {
      const tickEvent = event as {
        type: string;
        payload: { deltaTime: number };
      };
      const deltaTime = tickEvent.payload.deltaTime;

      // Get all pipe entities
      const pipeEntities = Object.values(gameState.entities).filter(
        (entity): entity is Pipe => entity.type === "pipe",
      );

      // Get bird position for passed check
      const bird = Object.values(gameState.entities).find(
        (entity) => entity.type === "bird",
      );
      const birdX = bird && "position" in bird ? (bird as any).position.x : 0;

      pipeEntities.forEach((pipe) => {
        // Update position command
        commands.push((state) => {
          const currentState = state as GameState;
          const currentPipe = currentState.entities[pipe.id] as Pipe;

          if (!currentPipe) return currentState;

          const newX = currentPipe.position.x - SCROLL_SPEED * deltaTime;
          const updatedPipe = updatePipePosition(currentPipe, {
            x: newX,
            y: currentPipe.position.y,
          });

          adapter.updatePipe(updatedPipe);

          return {
            ...currentState,
            entities: {
              ...currentState.entities,
              [pipe.id]: updatedPipe,
            },
          };
        });

        // Mark as passed command
        if (!pipe.passed && birdX > pipe.position.x + PIPE_WIDTH) {
          commands.push((state) => {
            const currentState = state as GameState;
            const currentPipe = currentState.entities[pipe.id] as Pipe;

            if (!currentPipe || currentPipe.passed) return currentState;

            const updatedPipe = markPipeAsPassed(currentPipe);
            adapter.updatePipe(updatedPipe);

            return {
              ...currentState,
              entities: {
                ...currentState.entities,
                [pipe.id]: updatedPipe,
              },
            };
          });
        }

        // Auto-remove pipes that are completely off-screen (left edge)
        // Pipe must be fully past the left edge (position + width < 0)
        if (pipe.position.x + PIPE_WIDTH < 0) {
          commands.push((state) => {
            const currentState = state as GameState;
            const { [pipe.id]: removed, ...remaining } = currentState.entities;

            adapter.removeEntity(pipe.id);

            return {
              ...currentState,
              entities: remaining,
            };
          });
        }
      });
    }

    // Handle REMOVE_PIPE event
    if (event.type === GameEventType.RemovePipe) {
      commands.push((state) => {
        const currentState = state as GameState;
        const { [event.payload.id]: removed, ...remaining } =
          currentState.entities;

        adapter.removeEntity(event.payload.id);

        return {
          ...currentState,
          entities: remaining,
        };
      });
    }

    return commands;
  };
};
