import type { Command, System } from "@/engine/engine";
import { createBackground } from "@/entity/Background";
import type { GameState } from "@/entity/GameState";
import { GameEventType, type Event } from "@/events";
import type { StageAdapter } from "@/systems/StageAdapter";

/**
 * BackgroundSystem manages background entity lifecycle.
 * Handles CREATE_BACKGROUND and REMOVE_BACKGROUND events.
 *
 * @see {@link ../../docs/design/system/background_system.md|Background System Design Document}
 */
export const BackgroundSystem = (adapter: StageAdapter): System => {
  return (_state, event: Event): Command[] => {
    const commands: Command[] = [];

    if (event.type === GameEventType.CreateBackground) {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity = createBackground(event.payload.id);

        // Update adapter immediately after state update
        adapter.updateBackground(newEntity);

        return {
          ...currentState,
          entities: {
            ...currentState.entities,
            [event.payload.id]: newEntity,
          },
        };
      });
    }

    if (event.type === GameEventType.RemoveBackground) {
      commands.push((state) => {
        const currentState = state as GameState;
        const { [event.payload.id]: removed, ...remaining } =
          currentState.entities;

        // Remove from adapter
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
