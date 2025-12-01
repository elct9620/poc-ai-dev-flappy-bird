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

| Name      | Type   | Description                                                                  |
|-----------|--------|------------------------------------------------------------------------------|
| deltaTime | number | Frame time multiplier (1.0 = 60fps target frame). From PixiJS Ticker.deltaTime |

### REMOVE_BIRD

Removes a bird entity from the game state.

| Name | Type   | Description                        |
|------|--------|------------------------------------|
| id   | string | Identifier of the bird to remove   |

## Commands

### Create Bird Entity Command

Adds a new Bird to the game state's entities record with initial physics values (zero velocity, upright rotation, first animation frame). Returns a new state with the entity added immutably.

### Apply Flap Force Command

When BIRD_FLAP is received, applies an upward velocity to the bird by setting its y-velocity to a negative value (e.g., -5 pixels/frame). This gives the bird an instant upward boost. The command also triggers an animation frame advance to show wing flapping.

### Apply Gravity Command

During each TICK event, increases the bird's y-velocity by the gravity constant multiplied by deltaTime (e.g., +0.8 pixels/frame²). This simulates continuous downward acceleration. This command is only applied if the bird is alive.

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

- **Gravity**: 0.08 pixels/frame² (downward acceleration, equivalent to ~4.8 pixels/second² at 60fps)
- **Flap Velocity**: -3 pixels/frame (upward velocity applied on flap, equivalent to ~-180 pixels/second at 60fps)
- **Max Rotation Down**: 90 degrees (maximum downward tilt when falling)
- **Max Rotation Up**: -25 degrees (maximum upward tilt when rising)
- **Terminal Velocity**: 1 pixels/frame (maximum falling speed, equivalent to ~60 pixels/second at 60fps)

### Implementation Note: DeltaTime Units

The physics calculations must account for the rendering framework's deltaTime units:

- **PixiJS Ticker**: `deltaTime` is a frame multiplier where 1.0 represents the target 60fps frame duration
- **Conversion**: To use real-world units (pixels/second), convert deltaTime to seconds: `const dt = deltaTime / 60`
- **Alternative**: Use frame-based units directly (as specified above) and apply deltaTime as a multiplier without conversion

The values above are specified in **frame-based units** to match PixiJS conventions and provide human-perceptible physics. This approach keeps the constants simple and avoids large numbers that need deltaTime conversion.

### Rationale for Current Values

The original design specified larger values (Gravity: 800, Flap: -300, Terminal: 400) that assumed deltaTime was in seconds. However, empirical testing revealed these values caused the bird to fall too quickly to be playable. After multiple iterations of testing, the corrected values above provide:

1. **Gravity (0.08)**: Very slow downward acceleration allowing players ample reaction time
2. **Flap Velocity (-3)**: Gentle upward boost that provides precise control without overshooting
3. **Terminal Velocity (1)**: Slow maximum falling speed that keeps the bird visible and controllable

These values were validated through manual gameplay testing and provide appropriate difficulty for human reaction times. The slower physics make the game more accessible while maintaining challenge through obstacle navigation.

## Adapter Interface

The PhysicsSystem depends on a `StageAdapter` interface for rendering coordination:

- `updateBird(entity: Bird): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
