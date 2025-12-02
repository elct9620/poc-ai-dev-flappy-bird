# InputSystem

The InputSystem is responsible for handling user input events (mouse clicks and keyboard presses) and translating them into game events. It listens for player actions and dispatches appropriate events to trigger bird control.

## Existing Implementation

**Note**: The codebase already has a `PixiInputAdapter` (`src/adapters/PixiInputAdapter.ts`) that handles:
- Mouse clicks via PixiJS stage pointer events (`pointerdown`)
- Space key presses via document keyboard events
- Currently dispatches `INCREMENT_SCORE` events

When implementing the InputSystem, the existing `PixiInputAdapter` should be refactored to support bird control events (e.g., `BIRD_FLAP`) instead of creating duplicate input handling infrastructure.

## Commands

### Trigger Bird Flap Command

When a MOUSE_CLICK or KEY_DOWN (Space) event is received during active gameplay, dispatches a BIRD_FLAP event to the PhysicsSystem. This command validates that the game is in a playable state before triggering the flap action.

### Initialize Input Listeners Command

When GAME_STARTED is received, sets up event listeners on the game canvas for mouse clicks and keyboard events. This ensures input is only captured when the game is active.

### Remove Input Listeners Command

When GAME_OVER is received, removes all input event listeners to prevent the player from interacting with a finished game.

## Adapter Interface

The InputSystem depends on an `InputAdapter` interface for capturing browser/platform input:

- `onMouseClick(callback: (x: number, y: number) => void): void` - Register mouse click handler
- `onKeyDown(callback: (key: string) => void): void` - Register keyboard handler
- `removeListeners(): void` - Clean up all event listeners

This follows the dependency inversion principle, allowing the system to remain platform-agnostic while working with browser DOM events through adapters.
