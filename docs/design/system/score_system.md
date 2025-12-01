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

### UPDATE_SCORE

Updates the value of an existing score entity.

| Name  | Type   | Description                                |
|-------|--------|--------------------------------------------|
| id    | string | Identifier of the score entity to update   |
| value | number | New numeric score value                    |

### INCREMENT_SCORE

Increments an existing score entity's value by 1.

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

Adds a new ScoreEntity to the game state's entities record and notifies the adapter to create the visual representation. Returns a new state with the entity added immutably.

### Update Score Entity Command

Updates the value property of an existing ScoreEntity and notifies the adapter to sync the visual representation. Returns a new state with the updated entity.

### Increment Score Entity Command

Increases the value property of an existing ScoreEntity by 1 and notifies the adapter. This is implemented as a specialized update that reads the current value and increments it.

### Remove Score Entity Command

Removes a ScoreEntity from the game state's entities record and notifies the adapter to destroy the visual representation. Returns a new state with the entity removed immutably.

## Adapter Interface

The ScoreSystem depends on a `StageAdapter` interface for rendering coordination:

- `updateScore(entity: ScoreEntity): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
