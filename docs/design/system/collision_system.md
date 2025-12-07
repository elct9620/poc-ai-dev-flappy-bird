# CollisionSystem

The CollisionSystem is responsible for detecting collisions in the game and triggering the appropriate game-over logic. It primarily handles collision detection between the player ([Bird](../entity/bird.md)) and obstacles ([Pipe](../entity/pipe.md)) as well as the [Ground](../entity/ground.md).

The system uses AABB (Axis-Aligned Bounding Box) collision detection to determine when game-ending events should occur.

## Side Effects

### Detect Bird-Pipe Collision Command

| Event Triggered                          | Description                                               |
|------------------------------------------|-----------------------------------------------------------|
| [TICK](../event/tick.md)                 | Each frame checks for collisions between bird and all pipes (only when bird.isAlive is true) |

When the bird collides with a pipe, the system will dispatch events in the following order **within the same tick**:

1. **First**: Dispatch [BIRD_COLLISION](../event/bird_collision.md) event to mark the collision occurrence
2. **Second**: Dispatch [KILL_BIRD](../event/kill_bird.md) event to set the bird's isAlive property to false

**Collision Detection Logic:**

The system performs AABB collision detection with the following boundaries:

- **Bird Collision Box**: Slightly reduced from sprite size for better gameplay feel
  - Width: 28 pixels (3 pixels padding on each side of 34px sprite)
  - Height: 20 pixels (2 pixels padding on top/bottom of 24px sprite)
  - Center: Bird's position represents the center point
  - Calculation: Box extends from `(position.x - 14, position.y - 10)` to `(position.x + 14, position.y + 10)`

- **Pipe Collision Box**: Full sprite dimensions
  - Width: 52 pixels
  - Height: Variable based on pipe.height property
  - Position: Pipe's position represents the top-left corner
  - Calculation: `(position.x, position.y)` to `(position.x + 52, position.y + height)`

**Detection Conditions:**
- Only checked when `bird.isAlive === true`
- Checked every frame during TICK event
- Early exit after first collision detected

**Scrolling Stop Mechanism**:

Scrolling is not stopped by the CollisionSystem directly. Instead:
- The KILL_BIRD event sets `bird.isAlive = false`
- Other systems (PipeSystem, GroundSystem, BackgroundSystem) check the bird's `isAlive` status each frame
- When `isAlive === false`, these systems skip position updates, effectively stopping all scrolling

### Detect Bird-Ground Collision Command

| Event Triggered                          | Description                                               |
|------------------------------------------|-----------------------------------------------------------|
| [TICK](../event/tick.md)                 | Each frame checks for collision between bird and ground (checked regardless of bird.isAlive status) |

When the bird collides with the ground:

1. Dispatch [BIRD_LAND](../event/bird_land.md) event to mark that the bird has landed
2. This marks the final step in the game-over sequence

**Collision Detection Logic:**

- **Ground Collision Box**: Full screen width at bottom
  - Width: Screen width
  - Height: 112 pixels (scaled)
  - Position: Bottom of screen
  - Calculation: Y-threshold at `screenHeight - (112 × scale)`

**Detection Conditions:**
- Checked every frame during TICK event
- Always checked, regardless of `bird.isAlive` status
- This allows the landing animation to complete after death

**Note**: The bird can only land if it has already been killed (either by pipe collision or falling off-screen). The landing collision is checked continuously, but only becomes relevant after the bird's death during the falling phase.

### Game Over Flow

The complete game-over sequence handled by the CollisionSystem:

1. **Collision Occurs**: Bird hits a pipe (or falls off top of screen)
   - CollisionSystem dispatches BIRD_COLLISION event
   - CollisionSystem dispatches KILL_BIRD event (sets bird.isAlive to false)
   - All scrolling stops (PipeSystem, GroundSystem, BackgroundSystem check bird.isAlive)

2. **Falling Phase**: Bird continues to fall under gravity
   - Bird loses control (InputSystem checks bird.isAlive, ignores input when false)
   - PhysicsSystem continues to apply gravity
   - Bird position updates each frame as it falls

3. **Landing**: Bird hits the ground
   - CollisionSystem detects ground collision
   - CollisionSystem dispatches BIRD_LAND event
   - Game completely stops (future: show game over UI)

## Adapter Interface

The CollisionSystem requires no external adapters. It operates as a pure system that:

1. Reads game state (bird position, pipe positions, ground position)
2. Performs collision calculations
3. Dispatches events based on collision results

All collision detection is performed using entity state data without requiring external dependencies.
