import { SCORE_INCREMENT_VALUE } from "@/constants";
import type { Command, System } from "@/engine/engine";
import type { GameState } from "@/entity/GameState";
import type { Score } from "@/entity/Score";
import { createScore, updateScoreValue } from "@/entity/Score";
import { GameEventType, type Event } from "@/events";
import type { StageAdapter } from "@/systems/StageAdapter";

/**
 * Utility function to build a Score entity from event payload.
 */
function buildScoreEntity(payload: {
  id: string;
  value: number;
  position: { x: number; y: number };
  spacing: number;
  alignment: "left" | "center" | "right";
}): Score {
  return createScore(
    payload.id,
    payload.value,
    payload.position,
    payload.spacing,
    payload.alignment,
  );
}

/**
 * ScoreSystem manages score entity lifecycle and value updates.
 * Handles CREATE_SCORE, RESET_SCORE, INCREMENT_SCORE, REMOVE_SCORE events.
 *
 * @see {@link ../../docs/design/system/score_system.md|Score System Design Document}
 */
export const ScoreSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === GameEventType.CreateScore) {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity = buildScoreEntity(event.payload);

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

    if (event.type === GameEventType.ResetScore) {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "score") {
        commands.push((state) => {
          const currentState = state as GameState;
          const updatedEntity = updateScoreValue(entity as Score, 0);

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

    if (event.type === GameEventType.IncrementScore) {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "score") {
        commands.push((state) => {
          const currentState = state as GameState;
          const scoreEntity = entity as Score;
          const updatedEntity = updateScoreValue(
            scoreEntity,
            scoreEntity.value + SCORE_INCREMENT_VALUE,
          );

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

    if (event.type === GameEventType.RemoveScore) {
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
