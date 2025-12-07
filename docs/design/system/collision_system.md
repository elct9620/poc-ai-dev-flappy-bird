# CollisionSystem

The CollisionSystem is responsible for detecting collisions in the game and triggering the appropriate game-over logic. It primarily handles collision detection between the player ([Bird](../entity/bird.md)) and obstacles ([Pipe](../entity/pipe.md)) as well as the [Ground](../entity/ground.md).

## Collision Detection Details

### AABB Collision Boundaries

The system uses AABB (Axis-Aligned Bounding Box) collision detection. The collision boundaries for each entity are defined as follows:

#### Bird Collision Box
- **Base Dimensions**: 34×24 pixels (sprite size)
- **Collision Box**: Slightly reduced for better gameplay feel (typical in Flappy Bird games)
  - Width: 28 pixels (3 pixels padding on each side)
  - Height: 20 pixels (2 pixels padding on top and bottom)
- **Center**: Bird's position represents the center point
- **Calculation**: Box extends from `(position.x - 14, position.y - 10)` to `(position.x + 14, position.y + 10)`

#### Pipe Collision Box
- **Base Dimensions**: 52×320 pixels (sprite size)
- **Collision Box**: Full sprite dimensions (no padding)
  - Width: 52 pixels
  - Height: Variable based on pipe.height property
- **Position**: Pipe's position represents the top-left corner
- **Calculation**:
  - Top pipe: `(position.x, position.y)` to `(position.x + 52, position.y + height)`
  - Bottom pipe: `(position.x, position.y)` to `(position.x + 52, position.y + height)`

#### Ground Collision Box
- **Base Dimensions**: 336×112 pixels (sprite size, tiled horizontally)
- **Collision Box**: Full screen width, positioned at bottom
  - Width: Screen width
  - Height: 112 pixels (scaled)
- **Position**: Bottom of screen
- **Calculation**: Y-threshold at `screenHeight - (112 × scale)`

### Detection Conditions

The collision detection follows these rules:

#### Bird-Pipe Collision
- **When to Check**: Every frame during TICK event
- **Condition**: Only when `bird.isAlive === true`
- **Logic**: Check bird's AABB against all active pipes in the game
- **Early Exit**: Stop checking after first collision detected

#### Bird-Ground Collision
- **When to Check**: Every frame during TICK event
- **Condition**: Always checked, regardless of `bird.isAlive` status
- **Logic**: Check if bird's bottom edge exceeds ground's top edge
- **Purpose**: Stops falling animation after death

## Side Effects

### Detect Bird-Pipe Collision Command

| Event Triggered                          | Description                                               |
|------------------------------------------|-----------------------------------------------------------|
| [TICK](../event/tick.md)                 | Each frame checks for collisions between bird and all pipes (only when bird.isAlive is true) |

When the bird collides with a pipe, the system will dispatch events in the following order **within the same tick**:

1. **First**: Dispatch [BIRD_COLLISION](../event/bird_collision.md) event to mark the collision occurrence
2. **Second**: Dispatch [KILL_BIRD](../event/kill_bird.md) event to set the bird's isAlive property to false

**Scrolling Stop Mechanism**: Scrolling is not stopped by the CollisionSystem directly. Instead:
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

**Note**: The bird can only land if it has already been killed (either by pipe collision or falling off-screen). The landing collision is checked continuously, but only becomes relevant after the bird's death during the falling phase.

## Game Over Flow

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
