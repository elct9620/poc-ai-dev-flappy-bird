export interface Entity {
  id: string;
  type: string;
}

/**
 * PipeGenerationState tracks the state of automatic pipe generation.
 * This is a value object attached to GameState, not an entity.
 *
 * Used by PipeSystem to manage continuous pipe spawning during gameplay.
 * @see {@link ../../docs/design/system/pipe_system.md|Pipe System Design Document}
 */
export interface PipeGenerationState {
  /** Incremental counter for unique pipe IDs */
  counter: number;
  /** X-position of most recently spawned pipe */
  lastPipeX: number;
  /** Cached screen width for calculations */
  screenWidth: number;
}

export interface GameState {
  entities: Record<string, Entity>;
  /** Optional pipe generation state - only exists during gameplay */
  pipeGeneration?: PipeGenerationState;
}

export function createGameState(): GameState {
  return {
    entities: {},
  };
}

/**
 * Factory function to create pipe generation state.
 * @param initialX - Initial X position for pipe spawning
 * @param screenWidth - Screen width for spawn calculations
 */
export function createPipeGenerationState(
  initialX: number,
  screenWidth: number,
): PipeGenerationState {
  return {
    counter: 0,
    lastPipeX: initialX,
    screenWidth,
  };
}

/**
 * Pure function to update pipe generation state after spawning a pipe.
 * @param state - Current pipe generation state
 * @param newLastPipeX - New X position of the most recently spawned pipe
 * @param newCounter - New counter value (typically incremented by 1)
 */
export function updatePipeGenerationState(
  state: PipeGenerationState,
  newLastPipeX: number,
  newCounter: number,
): PipeGenerationState {
  return {
    ...state,
    lastPipeX: newLastPipeX,
    counter: newCounter,
  };
}

/**
 * Pure function to update screen width in pipe generation state.
 * @param state - Current pipe generation state
 * @param screenWidth - New screen width
 */
export function updatePipeGenerationScreenWidth(
  state: PipeGenerationState,
  screenWidth: number,
): PipeGenerationState {
  return {
    ...state,
    screenWidth,
  };
}
