# InputSystem

The InputSystem is responsible for handling user input events (mouse clicks and keyboard presses) and translating them into game events. It listens for player actions and dispatches appropriate events to trigger bird control.

## Existing Implementation

**Note**: The codebase already has a `PixiInputAdapter` (`src/adapters/PixiInputAdapter.ts`) that handles:
- Mouse clicks via PixiJS stage pointer events (`pointerdown`)
- Space key presses via document keyboard events
- Currently dispatches `INCREMENT_SCORE` events

When implementing the InputSystem, the existing `PixiInputAdapter` should be refactored to support bird control events (e.g., `BIRD_FLAP`) instead of creating duplicate input handling infrastructure.

## Side Effects

### Trigger Bird Flap Command

| Event Triggered | Description |
|-----------------|-------------|
| MOUSE_CLICK | Player clicks the mouse to make the bird flap |
| KEY_DOWN | Player presses space key to make the bird flap |

When a MOUSE_CLICK or KEY_DOWN (Space) event is received during active gameplay, dispatches a BIRD_FLAP event to the PhysicsSystem. This command validates that the game is in a playable state before triggering the flap action.

### Initialize Input Listeners Command

| Event Triggered | Description |
|-----------------|-------------|
| GAME_STARTED | Game starts and input listeners need to be activated |

When GAME_STARTED is received, sets up event listeners on the game canvas for mouse clicks and keyboard events. This ensures input is only captured when the game is active.

### Remove Input Listeners Command

| Event Triggered | Description |
|-----------------|-------------|
| GAME_OVER | Game ends and input listeners need to be deactivated |

When GAME_OVER is received, removes all input event listeners to prevent the player from interacting with a finished game.

## Adapter Interface

The InputSystem depends on an InputAdapter with the following methods:

- `onMouseClick(callback: (x: number, y: number) => void): void` - Register mouse click handler
- `onKeyDown(callback: (key: string) => void): void` - Register keyboard handler
- `removeListeners(): void` - Clean up all event listeners

**Note**: A formal TypeScript `interface` declaration is not required. Adapters implement these methods directly on the class, following the dependency inversion principle while keeping the implementation pragmatic.

**Implementation Pattern**: The adapter registers callbacks and invokes them when browser events occur. The callbacks typically dispatch events to the EventBus, maintaining the event-driven architecture.
