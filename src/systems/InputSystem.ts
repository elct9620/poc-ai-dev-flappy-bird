import type { Command, System } from "@/engine/engine";
import type { EventBus } from "@/engine/eventbus";
import type { GameState } from "@/entity/GameState";
import { GameEventType, SystemEventType, type Event } from "@/events";

/**
 * InputSystem handles user input events and translates them into game events.
 * It listens for player actions and dispatches appropriate events to trigger bird control.
 */
export const InputSystem = (eventBus: EventBus, birdId: string): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (
      event.type === SystemEventType.MouseClick ||
      event.type === SystemEventType.KeyDown
    ) {
      // Check if there's a bird to control and if it's alive
      const bird = gameState.entities[birdId];
      if (bird && bird.type === "bird" && (bird as any).isAlive) {
        // Dispatch BIRD_FLAP event
        eventBus.dispatch({
          type: GameEventType.BirdFlap,
          payload: { id: birdId },
        });
      }
    }

    return commands;
  };
};
