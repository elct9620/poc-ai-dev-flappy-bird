# Scene System

The Scene System is responsible for managing background scene entities in the game. It handles the creation and removal of scene backgrounds that provide visual context for gameplay. The system works with minimal entity state, delegating all rendering details to the Component layer.

## Commands

### Create Scene Entity Command

Adds a new Scene entity to the game state with minimal properties (only `id` and `type`). The adapter is notified to create the visual representation using PixiJS TilingSprite. Returns a new state with the entity added immutably.

### Remove Scene Entity Command

Removes a Scene entity from the game state and notifies the adapter to destroy the visual representation. Returns a new state with the entity removed immutably. This is typically used when transitioning between different game states or changing the visual theme.

## Adapter Interface

The Scene System depends on a `StageAdapter` interface for rendering coordination:

- `updateScene(entity: Scene): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
