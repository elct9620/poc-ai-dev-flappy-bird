/**
 * Game Events
 *
 * Events dispatched by game systems to modify game state.
 * These represent domain-specific actions within the game logic.
 */

import type { Vector } from "@/entity/Vector";

/**
 * Game event type enum
 */
export enum GameEventType {
  CreateScore = "CREATE_SCORE",
  ResetScore = "RESET_SCORE",
  IncrementScore = "INCREMENT_SCORE",
  RemoveScore = "REMOVE_SCORE",
  CreateBird = "CREATE_BIRD",
  BirdFlap = "BIRD_FLAP",
  KillBird = "KILL_BIRD",
  RemoveBird = "REMOVE_BIRD",
  CreateBackground = "CREATE_BACKGROUND",
  RemoveBackground = "REMOVE_BACKGROUND",
  CreateGround = "CREATE_GROUND",
  RemoveGround = "REMOVE_GROUND",
  CreatePipe = "CREATE_PIPE",
  RemovePipe = "REMOVE_PIPE",
}

// ============================================================================
// Score Events
// ============================================================================

/**
 * CREATE_SCORE event
 *
 * Creates a new score entity in the game state with full configuration.
 * Scale is managed by the Score renderer, not the entity.
 */
export interface CreateScoreEvent {
  type: GameEventType.CreateScore;
  payload: {
    /** Unique identifier for the new score entity */
    id: string;
    /** Initial numeric score value */
    value: number;
    /** Screen position for rendering */
    position: Vector;
    /** Horizontal spacing between digit sprites */
    spacing: number;
    /** Horizontal alignment of digits */
    alignment: "left" | "center" | "right";
  };
}

/**
 * RESET_SCORE event
 *
 * Resets an existing score entity's value to its initial value (typically 0).
 * This is used when starting a new game or resetting the current game state.
 */
export interface ResetScoreEvent {
  type: GameEventType.ResetScore;
  payload: {
    /** Identifier of the score entity to reset */
    id: string;
  };
}

/**
 * INCREMENT_SCORE event
 *
 * Increments an existing score entity's value by 1.
 * This is the primary way scores increase during gameplay (e.g., when the player passes a pipe).
 */
export interface IncrementScoreEvent {
  type: GameEventType.IncrementScore;
  payload: {
    /** Identifier of the score entity to increment */
    id: string;
  };
}

/**
 * REMOVE_SCORE event
 *
 * Removes a score entity from the game state.
 */
export interface RemoveScoreEvent {
  type: GameEventType.RemoveScore;
  payload: {
    /** Identifier of the score entity to remove */
    id: string;
  };
}

// ============================================================================
// Bird Events
// ============================================================================

/**
 * CREATE_BIRD event
 *
 * Creates a new bird entity in the game state with initial physics properties.
 */
export interface CreateBirdEvent {
  type: GameEventType.CreateBird;
  payload: {
    /** Unique identifier for the new bird */
    id: string;
    /** Initial spawn position of the bird */
    position: Vector;
  };
}

/**
 * BIRD_FLAP event
 *
 * Triggers the bird to flap its wings and fly upward.
 * This event is dispatched by the InputSystem when the player clicks or presses the space key.
 */
export interface BirdFlapEvent {
  type: GameEventType.BirdFlap;
  payload: {
    /** Identifier of the bird to flap */
    id: string;
  };
}

/**
 * KILL_BIRD event
 *
 * Marks a bird as dead (sets isAlive to false).
 * Dead birds stop responding to player input but remain in the game state.
 */
export interface KillBirdEvent {
  type: GameEventType.KillBird;
  payload: {
    /** Identifier of the bird to kill */
    id: string;
  };
}

/**
 * REMOVE_BIRD event
 *
 * Removes a bird entity from the game state.
 */
export interface RemoveBirdEvent {
  type: GameEventType.RemoveBird;
  payload: {
    /** Identifier of the bird to remove */
    id: string;
  };
}

// ============================================================================
// Background Events
// ============================================================================

/**
 * CREATE_BACKGROUND event
 *
 * Creates a new background entity in the game state.
 * The background represents a visual scene that provides context for gameplay.
 */
export interface CreateBackgroundEvent {
  type: GameEventType.CreateBackground;
  payload: {
    /** Unique identifier for the new background entity */
    id: string;
  };
}

/**
 * REMOVE_BACKGROUND event
 *
 * Removes a background entity from the game state.
 */
export interface RemoveBackgroundEvent {
  type: GameEventType.RemoveBackground;
  payload: {
    /** Identifier of the background to remove */
    id: string;
  };
}

// ============================================================================
// Ground Events
// ============================================================================

/**
 * CREATE_GROUND event
 *
 * Creates a new ground entity in the game state.
 * The ground represents the base visual element at the bottom of the screen.
 */
export interface CreateGroundEvent {
  type: GameEventType.CreateGround;
  payload: {
    /** Unique identifier for the new ground entity */
    id: string;
  };
}

/**
 * REMOVE_GROUND event
 *
 * Removes a ground entity from the game state.
 */
export interface RemoveGroundEvent {
  type: GameEventType.RemoveGround;
  payload: {
    /** Identifier of the ground to remove */
    id: string;
  };
}

// ============================================================================
// Pipe Events
// ============================================================================

/**
 * CREATE_PIPE event
 *
 * Creates a new pipe pair (top and bottom) in the game state.
 * Pipes are positioned at the right edge with a gap for navigation.
 */
export interface CreatePipeEvent {
  type: GameEventType.CreatePipe;
  payload: {
    /** Unique identifier for the top pipe */
    topId: string;
    /** Unique identifier for the bottom pipe */
    bottomId: string;
    /** X position for both pipes */
    x: number;
    /** Y-coordinate of the gap center */
    gapY: number;
  };
}

/**
 * REMOVE_PIPE event
 *
 * Removes a pipe entity from the game state when it moves off-screen.
 */
export interface RemovePipeEvent {
  type: GameEventType.RemovePipe;
  payload: {
    /** Identifier of the pipe to remove */
    id: string;
  };
}

/**
 * Union type of all game events
 */
export type GameEvent =
  | CreateScoreEvent
  | ResetScoreEvent
  | IncrementScoreEvent
  | RemoveScoreEvent
  | CreateBirdEvent
  | BirdFlapEvent
  | KillBirdEvent
  | RemoveBirdEvent
  | CreateBackgroundEvent
  | RemoveBackgroundEvent
  | CreateGroundEvent
  | RemoveGroundEvent
  | CreatePipeEvent
  | RemovePipeEvent;
