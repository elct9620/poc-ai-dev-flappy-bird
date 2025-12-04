import type { Command, System } from "@/engine/engine";
import type { GameState } from "@/entity/GameState";
import type { Scene } from "@/entity/Scene";
import { createScene } from "@/entity/Scene";
import { GameEventType, type Event } from "@/events";

// Adapter interface defined in system (dependency inversion principle)
export interface StageAdapter {
  updateScene(entity: Scene): void;
  removeEntity(id: string): void;
}

/**
 * SceneSystem manages scene entity lifecycle.
 * Handles CREATE_SCENE and REMOVE_SCENE events.
 *
 * @see {@link ../../docs/design/system/scene_system.md|Scene System Design Document}
 */
export const SceneSystem = (adapter: StageAdapter): System => {
  return (_state, event: Event): Command[] => {
    const commands: Command[] = [];

    if (event.type === GameEventType.CreateScene) {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity = createScene(event.payload.id);

        // Update adapter immediately after state update
        adapter.updateScene(newEntity);

        return {
          ...currentState,
          entities: {
            ...currentState.entities,
            [event.payload.id]: newEntity,
          },
        };
      });
    }

    if (event.type === GameEventType.RemoveScene) {
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
