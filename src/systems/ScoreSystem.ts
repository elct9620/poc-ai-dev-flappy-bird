import type { Command, Event, System } from "@/engine/engine";
import type { GameState, ScoreEntity } from "@/entity/GameState";

// Adapter interface defined in system (dependency inversion principle)
export interface StageAdapter {
  updateScore(entity: ScoreEntity): void;
  removeEntity(id: string): void;
}

export const ScoreSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === "CREATE_SCORE") {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity: ScoreEntity = {
          type: "score",
          id: event.payload.id,
          value: event.payload.value,
          position: event.payload.position,
          scale: event.payload.scale,
          spacing: event.payload.spacing,
          alignment: event.payload.alignment,
        };

        // Update adapter immediately after state update
        adapter.updateScore(newEntity);

        return {
          ...currentState,
          entities: {
            ...currentState.entities,
            [event.payload.id]: newEntity,
          },
        };
      });
    }

    if (event.type === "UPDATE_SCORE") {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "score") {
        commands.push((state) => {
          const currentState = state as GameState;
          const updatedEntity: ScoreEntity = {
            ...(entity as ScoreEntity),
            value: event.payload.value,
          };

          // Update adapter immediately
          adapter.updateScore(updatedEntity);

          return {
            ...currentState,
            entities: {
              ...currentState.entities,
              [event.payload.id]: updatedEntity,
            },
          };
        });
      }
    }

    if (event.type === "REMOVE_SCORE") {
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
