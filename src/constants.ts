/**
 * Centralized constants to avoid magic numbers across the codebase.
 * As documented in docs/ARCHITECTURE.md
 */

// =============================================================================
// Physics Constants
// =============================================================================
// Per design document: docs/design/system/physics_system.md
// Values in frame-based units for PixiJS deltaTime (1.0 = one frame at 60fps)

/** Downward acceleration applied to bird (pixels/frame²) */
export const GRAVITY = 0.08;

/** Upward velocity applied when bird flaps (pixels/frame) */
export const FLAP_VELOCITY = -3;

/** Maximum downward tilt angle - 90 degrees (radians) */
export const MAX_ROTATION_DOWN = Math.PI / 2;

/** Maximum upward tilt angle - -25 degrees (radians) */
export const MAX_ROTATION_UP = -Math.PI / 7.2;

/** Maximum falling speed (pixels/frame) */
export const TERMINAL_VELOCITY = 1;

// =============================================================================
// Pipe Constants
// =============================================================================
// Texture dimensions and movement parameters

/** Width of pipe texture (pixels) */
export const PIPE_WIDTH = 52;

/** Height of pipe texture (pixels) */
export const PIPE_HEIGHT = 320;

/** Horizontal scroll speed for pipes (pixels/frame) */
export const SCROLL_SPEED = 2;

/** Reference height for coordinate system (pixels) */
export const REFERENCE_HEIGHT = 512;

/** Minimum gap size between upper and lower pipes (pixels) */
export const MIN_GAP_SIZE = 140;

/** Maximum gap size between upper and lower pipes (pixels) */
export const MAX_GAP_SIZE = 160;

/** Minimum Y position for gap center (pixels) */
export const MIN_GAP_Y = 120;

/** Maximum Y position for gap center (pixels) */
export const MAX_GAP_Y = 280;

/** Horizontal spacing between pipe pairs (pixels) */
export const PIPE_SPACING = 200;

// =============================================================================
// Audio Constants
// =============================================================================

/** Sound asset key for bird wing flap sound effect */
export const WING_FLAP_SOUND = "wing";

/** Sound asset key for point scoring sound effect */
export const POINT_SOUND = "point";

// =============================================================================
// Game Mechanics Constants
// =============================================================================

/** Amount to increment score by when player passes a pipe */
export const SCORE_INCREMENT_VALUE = 1;

// =============================================================================
// Rendering Layer Constants (zIndex)
// =============================================================================
// Controls the rendering order of game elements on the stage.
// Higher values render on top of lower values.

/** Background layer - renders at the back */
export const ZINDEX_BACKGROUND = 0;

/** Pipe layer - renders above background */
export const ZINDEX_PIPE = 10;

/** Ground layer - renders above pipes to cover pipe bottoms */
export const ZINDEX_GROUND = 50;

/** Bird layer - renders above ground to ensure player visibility */
export const ZINDEX_BIRD = 100;

/** Score layer - renders above all game elements */
export const ZINDEX_SCORE = 200;
