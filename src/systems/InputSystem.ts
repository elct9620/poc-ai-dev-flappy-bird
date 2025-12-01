import type { Command, Event, System } from "@/engine/engine";
import type { EventBus } from "@/engine/eventbus";
import type { GameState } from "@/entity/GameState";

/**
 * InputSystem handles user input events and translates them into game events.
 * It listens for player actions and dispatches appropriate events to trigger bird control.
 */
export const InputSystem = (eventBus: EventBus, birdId: string): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === "MOUSE_CLICK" || event.type === "KEY_DOWN") {
      // Check if there's a bird to control and if it's alive
      const bird = gameState.entities[birdId];
      if (bird && bird.type === "bird" && (bird as any).isAlive) {
        // Dispatch BIRD_FLAP event
        eventBus.dispatch({
          type: "BIRD_FLAP",
          payload: { id: birdId },
        });
      }
    }

    return commands;
  };
};
