# ScoreSystem

The ScoreSystem is responsible for managing score entities through event-driven CRUD operations. It processes score-related events and generates commands that update the game state immutably while coordinating with a rendering adapter for visual updates.

## Events

### CREATE_SCORE

Creates a new score entity in the game state with full configuration.

| Name      | Type                           | Description                                           |
|-----------|--------------------------------|-------------------------------------------------------|
| id        | string                         | Unique identifier for the new score entity           |
| value     | number                         | Initial numeric score value                          |
| position  | [Vector](../entity/vector.md)  | Screen position for rendering                        |
| scale     | number                         | Scale multiplier for the display                     |
| spacing   | number                         | Horizontal spacing between digit sprites             |
| alignment | "left" \| "center" \| "right"  | Horizontal alignment of digits                       |

### RESET_SCORE

Resets an existing score entity's value to its initial value (typically 0). This is used when starting a new game or resetting the current game state.

| Name  | Type   | Description                                |
|-------|--------|--------------------------------------------|
| id    | string | Identifier of the score entity to reset    |

### INCREMENT_SCORE

Increments an existing score entity's value by 1. This is the primary way scores increase during gameplay (e.g., when the player passes a pipe).

| Name | Type   | Description                                |
|------|--------|--------------------------------------------|
| id   | string | Identifier of the score entity to increment |

### REMOVE_SCORE

Removes a score entity from the game state.

| Name | Type   | Description                              |
|------|--------|------------------------------------------|
| id   | string | Identifier of the score entity to remove |

## Commands

### Create Score Entity Command

Adds a new Score to the game state's entities record and notifies the adapter to create the visual representation. Returns a new state with the entity added immutably.

### Reset Score Entity Command

Sets the value property of an existing Score to 0 (the initial/default value) and notifies the adapter to sync the visual representation. Returns a new state with the reset entity. This ensures scores can be reset for new games without recreating the entity.

### Increment Score Entity Command

Increases the value property of an existing Score by 1 and notifies the adapter. This is the only way to increase score values during gameplay, ensuring consistent game mechanics.

### Remove Score Entity Command

Removes a Score from the game state's entities record and notifies the adapter to destroy the visual representation. Returns a new state with the entity removed immutably.

## Adapter Interface

The ScoreSystem depends on a `StageAdapter` interface for rendering coordination:

- `updateScore(entity: Score): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
