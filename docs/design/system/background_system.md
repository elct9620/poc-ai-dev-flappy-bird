# Background System

The Background System is responsible for managing background entities in the game. It handles the creation and removal of background visuals that provide visual context for gameplay. The system works with minimal entity state, delegating all rendering details to the Component layer.

## Side Effects

### Create Background Entity Command

| Event Triggered | Description                     |
|-----------------|---------------------------------|
| [CREATE_BACKGROUND](../event/create_background.md) | Creates a new background entity for the game scene |

Adds a new Background entity to the game state with minimal properties (only `id` and `type`). The adapter is notified to create the visual representation using PixiJS TilingSprite. Returns a new state with the entity added immutably.

### Remove Background Entity Command

| Event Triggered | Description                     |
|-----------------|---------------------------------|
| [REMOVE_BACKGROUND](../event/remove_background.md) | Removes an existing background entity |

Removes a Background entity from the game state and notifies the adapter to destroy the visual representation. Returns a new state with the entity removed immutably. This is typically used when transitioning between different game states or changing the visual theme.

## Adapter Interface

The Background System depends on a `StageAdapter` interface for rendering coordination:

- `updateBackground(entity: Background): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
