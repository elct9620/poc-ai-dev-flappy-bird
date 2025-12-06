import type { Command, System } from "@/engine/engine";
import type { Bird } from "@/entity/Bird";
import type { GameState } from "@/entity/GameState";
import type { Pipe } from "@/entity/Pipe";
import {
  createPipe,
  markPipeAsPassed,
  updatePipePosition,
} from "@/entity/Pipe";
import { GameEventType, type Event } from "@/events";
import { SystemEventType, type TickEvent } from "@/events/SystemEvents";
import type { StageAdapter } from "@/systems/StageAdapter";

// Pipe generation constants (texture dimensions)
const PIPE_WIDTH = 52;
const PIPE_HEIGHT = 320;
const SCROLL_SPEED = 2;
const REFERENCE_HEIGHT = 512;

/**
 * Utility function to build a Pipe entity from parameters.
 *
 * Coordinate System Overview:
 * - Reference coords (512px height): gapY (120-280), gapSize (140-160)
 * - Texture coords (320px height): PIPE_HEIGHT, height for cropping
 * - Screen coords: positions are in screen pixels, renderer applies baseScale
 *
 * The renderer will apply baseScale = screenHeight / 512 to the sprite.
 * Therefore:
 * - height must be in TEXTURE PIXELS (0-320) for Rectangle cropping
 * - position must be in SCREEN PIXELS (will be rendered as-is)
 *
 * @param gapSize The gap size in reference pixels (140-160)
 * @param gapY The gap center Y position in reference pixels (120-280)
 * @param screenHeight The actual screen height for coordinate conversion
 */
function buildPipeEntity(
  id: string,
  x: number,
  gapY: number,
  gapSize: number,
  isTop: boolean,
  screenHeight: number,
): Pipe {
  // Calculate scale factor to convert reference coords to screen coords
  const scale = screenHeight / REFERENCE_HEIGHT;

  // Convert reference coordinates to screen coordinates
  const gapYScreen = gapY * scale;
  const gapSizeScreen = gapSize * scale;

  // Calculate how much of the 320px texture should be shown
  // The gap is defined in reference coords, we need to convert to texture coords
  // Texture height (320px) corresponds to some portion of reference height (512px)
  // We need to calculate what portion of the 320px texture corresponds to the visible pipe
  const gapYTexture = (gapY / REFERENCE_HEIGHT) * PIPE_HEIGHT;
  const gapSizeTexture = (gapSize / REFERENCE_HEIGHT) * PIPE_HEIGHT;

  // Height in texture pixels (for Rectangle cropping)
  const height = isTop
    ? gapYTexture - gapSizeTexture / 2
    : PIPE_HEIGHT - (gapYTexture + gapSizeTexture / 2);

  // Position in screen pixels
  // Top pipe: positioned at gap top edge with anchor at bottom (0,1), extends upward
  // Bottom pipe: positioned at gap bottom edge with anchor at top (0,0), extends downward
  const position = isTop
    ? { x, y: gapYScreen - gapSizeScreen / 2 }
    : { x, y: gapYScreen + gapSizeScreen / 2 };

  return createPipe(id, position, height, isTop, gapYScreen);
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

        // Get screen dimensions from adapter
        const { height: screenHeight } = adapter.getScreenDimensions();

        const topPipe = buildPipeEntity(
          topId,
          x,
          gapY,
          gapSize,
          true,
          screenHeight,
        );
        const bottomPipe = buildPipeEntity(
          bottomId,
          x,
          gapY,
          gapSize,
          false,
          screenHeight,
        );

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
    if (event.type === SystemEventType.Tick) {
      const tickEvent = event as TickEvent;
      const deltaTime = tickEvent.payload.deltaTime;

      // Get all pipe entities
      const pipeEntities = Object.values(gameState.entities).filter(
        (entity): entity is Pipe => entity.type === "pipe",
      );

      // Get bird position for passed check
      const bird = Object.values(gameState.entities).find(
        (entity): entity is Bird => entity.type === "bird",
      );
      const birdX = bird ? bird.position.x : 0;

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
