import type { Command, System } from "@/engine/engine";
import type { EventBus } from "@/engine/eventbus";
import type { GameState } from "@/entity/GameState";
import { GameEventType, SystemEventType, type Event } from "@/events";

/**
 * InputSystem translates user input events into bird control commands.
 * Handles MouseClick and KeyDown events to trigger bird flapping.
 *
 * Uses event-driven architecture where commands dispatch events for inter-system communication.
 * Side effects (event dispatch) occur within commands, not in the system function itself.
 *
 * @see {@link ../../docs/design/system/input_system.md|Input System Design Document}
 */
export const InputSystem = (eventBus: EventBus, birdId: string): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;

    if (
      event.type === SystemEventType.MouseClick ||
      event.type === SystemEventType.KeyDown
    ) {
      // Check if there's a bird to control and if it's alive
      const bird = gameState.entities[birdId];
      if (bird && bird.type === "bird" && (bird as any).isAlive) {
        // Return command that dispatches event (side effect in command, not system)
        return [
          (state) => {
            // Side effect happens here, inside command
            eventBus.dispatch({
              type: GameEventType.BirdFlap,
              payload: { id: birdId },
            });
            return state; // No state change needed
          },
        ];
      }
    }

    return [];
  };
};
