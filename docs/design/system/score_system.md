# ScoreSystem

The ScoreSystem is responsible for managing score entities through event-driven CRUD operations. It processes score-related events and generates commands that update the game state immutably while coordinating with a rendering adapter for visual updates.

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
