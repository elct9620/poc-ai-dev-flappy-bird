import type { Command, System } from "@/engine/engine";
import type { GameState } from "@/entity/GameState";
import { createGround } from "@/entity/Ground";
import { GameEventType, type Event } from "@/events";
import type { StageAdapter } from "@/systems/StageAdapter";

/**
 * GroundSystem manages ground entity lifecycle.
 * Handles CREATE_GROUND and REMOVE_GROUND events.
 *
 * @see {@link ../../docs/design/system/ground_system.md|Ground System Design Document}
 */
export const GroundSystem = (adapter: StageAdapter): System => {
  return (_state, event: Event): Command[] => {
    const commands: Command[] = [];

    if (event.type === GameEventType.CreateGround) {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity = createGround(event.payload.id);

        // Update adapter immediately after state update
        adapter.update(newEntity);

        return {
          ...currentState,
          entities: {
            ...currentState.entities,
            [event.payload.id]: newEntity,
          },
        };
      });
    }

    if (event.type === GameEventType.RemoveGround) {
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
