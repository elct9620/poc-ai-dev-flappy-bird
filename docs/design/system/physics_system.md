# PhysicsSystem

The PhysicsSystem is responsible for managing the bird's physics, including gravity, flapping mechanics, position updates, and rotation based on velocity. It processes physics-related events and generates commands that update the bird entity's state.

## Events

### CREATE_BIRD

Creates a new bird entity in the game state with initial physics properties.

| Name     | Type                          | Description                              |
|----------|-------------------------------|------------------------------------------|
| id       | string                        | Unique identifier for the new bird       |
| position | [Vector](../entity/vector.md) | Initial spawn position of the bird       |

### BIRD_FLAP

Triggers the bird to flap its wings and fly upward. This event is dispatched by the InputSystem when the player clicks or presses the space key.

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| id   | string | Identifier of the bird to flap     |

### TICK

The main game loop event that triggers physics calculations every frame.

| Name      | Type   | Description                                |
|-----------|--------|--------------------------------------------|
| deltaTime | number | Time elapsed since last frame (in seconds) |

### REMOVE_BIRD

Removes a bird entity from the game state.

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| id   | string | Identifier of the bird to remove   |

## Commands

### Create Bird Entity Command

Adds a new Bird to the game state's entities record with initial physics values (zero velocity, upright rotation, first animation frame). Returns a new state with the entity added immutably.

### Apply Flap Force Command

When BIRD_FLAP is received, applies an upward velocity to the bird by setting its y-velocity to a negative value (e.g., -300 pixels/second). This gives the bird an instant upward boost. The command also triggers an animation frame advance to show wing flapping.

### Apply Gravity Command

During each TICK event, increases the bird's y-velocity by the gravity constant multiplied by deltaTime (e.g., +800 pixels/second²). This simulates continuous downward acceleration. This command is only applied if the bird is alive.

### Update Position Command

During each TICK event, updates the bird's position by adding its velocity multiplied by deltaTime. This moves the bird according to its current speed and direction. Position updates are applied every frame for smooth movement.

### Update Rotation Command

During each TICK event, calculates and updates the bird's rotation angle based on its current y-velocity. When moving upward (negative velocity), the bird tilts up (negative rotation, e.g., -25°). When falling (positive velocity), the bird tilts down (positive rotation, e.g., +90° max). This provides visual feedback of the bird's movement state.

### Advance Animation Frame Command

Periodically increments the bird's animation frame to cycle through wing flapping sprites (0 → 1 → 2 → 0). This is triggered on BIRD_FLAP events and optionally on TICK events to create a continuous flapping animation.

### Remove Bird Entity Command

Removes a Bird from the game state's entities record and notifies the adapter to destroy the visual representation. Returns a new state with the entity removed immutably.

## Physics Constants

The PhysicsSystem uses the following constants for realistic bird movement:

- **Gravity**: 800 pixels/second² (downward acceleration)
- **Flap Velocity**: -300 pixels/second (upward velocity applied on flap)
- **Max Rotation Down**: 90 degrees (maximum downward tilt when falling)
- **Max Rotation Up**: -25 degrees (maximum upward tilt when rising)
- **Terminal Velocity**: 400 pixels/second (maximum falling speed)

## Adapter Interface

The PhysicsSystem depends on a `StageAdapter` interface for rendering coordination:

- `updateBird(entity: Bird): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
