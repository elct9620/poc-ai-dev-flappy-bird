# Ground System

The Ground System is responsible for managing ground entities in the game. It handles the creation and removal of ground elements that provide the base visual layer at the bottom of the screen. The system works with minimal entity state, delegating all rendering details to the Renderer layer.

## Side Effects

### Create Ground Entity Command

| Event Triggered | Description                     |
|-----------------|---------------------------------|
| [CREATE_GROUND](../event/create_ground.md) | Creates a new ground entity at the bottom of the screen |

Adds a new Ground entity to the game state with minimal properties (only `id` and `type`). The adapter is notified to create the visual representation using PixiJS TilingSprite positioned at the bottom of the screen. Returns a new state with the entity added immutably.

### Remove Ground Entity Command

| Event Triggered | Description                     |
|-----------------|---------------------------------|
| [REMOVE_GROUND](../event/remove_ground.md) | Removes an existing ground entity |

Removes a Ground entity from the game state and notifies the adapter to destroy the visual representation. Returns a new state with the entity removed immutably. This is typically used when transitioning between different game states or changing the visual theme.

## Adapter Interface

The Ground System depends on a `StageAdapter` interface for rendering coordination:

- `updateGround(entity: Ground): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
