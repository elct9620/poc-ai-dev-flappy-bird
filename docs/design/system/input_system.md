# InputSystem

The InputSystem is responsible for handling user input events (mouse clicks and keyboard presses) and translating them into game events. It listens for player actions and dispatches appropriate events to trigger bird control.

## Events

### MOUSE_CLICK

Triggered when the player clicks the mouse anywhere on the game canvas.

| Name | Type   | Description                               |
|------|--------|-------------------------------------------|
| x    | number | X coordinate of the mouse click position  |
| y    | number | Y coordinate of the mouse click position  |

### KEY_DOWN

Triggered when the player presses a key on the keyboard.

| Name | Type   | Description                                        |
|------|--------|----------------------------------------------------|
| key  | string | The key code or name (e.g., "Space", "Enter")      |

### GAME_STARTED

Triggered when the game begins. This event initializes the input system to start listening for player input.

### GAME_OVER

Triggered when the game ends. This event stops the input system from processing player input.

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
