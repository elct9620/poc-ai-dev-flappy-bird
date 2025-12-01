import type { Command, Event, System } from "@/engine/engine";
import type { GameState } from "@/entity/GameState";
import type { Score } from "@/entity/Score";

// Adapter interface defined in system (dependency inversion principle)
export interface StageAdapter {
  updateScore(entity: Score): void;
  removeEntity(id: string): void;
}

export const ScoreSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === "CREATE_SCORE") {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity: Score = {
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

    if (event.type === "RESET_SCORE") {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "score") {
        commands.push((state) => {
          const currentState = state as GameState;
          const updatedEntity: Score = {
            ...(entity as Score),
            value: 0,
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

    if (event.type === "INCREMENT_SCORE") {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "score") {
        commands.push((state) => {
          const currentState = state as GameState;
          const scoreEntity = entity as Score;
          const updatedEntity: Score = {
            ...scoreEntity,
            value: scoreEntity.value + 1,
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
