# CollisionSystem

The CollisionSystem is responsible for detecting collisions in the game and triggering the appropriate game-over logic. It primarily handles collision detection between the player ([Bird](../entity/bird.md)) and obstacles ([Pipe](../entity/pipe.md)) as well as the [Ground](../entity/ground.md).

The system uses AABB (Axis-Aligned Bounding Box) collision detection to determine when game-ending events should occur.

## Side Effects

### Detect Bird-Pipe Collision

| Event Triggered | Description |
|-----------------|-------------|
| [TICK](../event/tick.md) | Each frame checks for collisions between bird and all pipes |

During each TICK event, the system checks for collisions between the bird and all active pipes using AABB (Axis-Aligned Bounding Box) collision detection. When a collision is detected, the system dispatches [BIRD_COLLISION](../event/bird_collision.md) followed by [KILL_BIRD](../event/kill_bird.md) **within the same tick** to mark the collision occurrence and set the bird's `isAlive` property to false.

The system uses the following collision boundaries:

- **Bird Collision Box**: 28×20 pixels (slightly reduced from 34×24 sprite for better gameplay feel)
  - Padding: 3 pixels left/right, 2 pixels top/bottom
  - Center point: Bird's position
  - Calculation: `(position.x - 14, position.y - 10)` to `(position.x + 14, position.y + 10)`

- **Pipe Collision Box**: 52 pixels width × variable height (full sprite dimensions)
  - Top-left corner: Pipe's position
  - Calculation: `(position.x, position.y)` to `(position.x + 52, position.y + height)`

This collision detection is only performed when `bird.isAlive === true` and exits early after the first collision is detected.

**Scrolling Stop Mechanism**: The system doesn't directly stop scrolling. Instead, the [KILL_BIRD](../event/kill_bird.md) event sets `bird.isAlive = false`, and other systems (PipeSystem, GroundSystem, BackgroundSystem) check this status each frame to skip position updates.

### Detect Bird-Ground Collision

| Event Triggered | Description |
|-----------------|-------------|
| [TICK](../event/tick.md) | Each frame checks for collision between bird and ground |

During each TICK event, the system checks whether the bird has reached the ground using a Y-threshold calculation. When the bird's position crosses this threshold, the system dispatches [BIRD_LAND](../event/bird_land.md) to mark that the bird has landed, completing the game-over sequence.

The ground collision uses the following boundary:

- **Ground Collision Box**: Full screen width × 112 pixels (scaled)
  - Y-threshold: `screenHeight - (112 × scale)`

Unlike pipe collision, ground collision is checked **regardless of `bird.isAlive` status**. This allows the landing animation to complete after the bird's death during the falling phase. The bird can only land after it has already been killed (either by pipe collision or falling off-screen).

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
