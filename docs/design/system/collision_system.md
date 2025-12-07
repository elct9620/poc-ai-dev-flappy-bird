# CollisionSystem

The CollisionSystem is responsible for detecting collisions in the game and triggering the appropriate game-over logic. It primarily handles collision detection between the player ([Bird](../entity/bird.md)) and obstacles ([Pipe](../entity/pipe.md)) as well as the [Ground](../entity/ground.md).

## Side Effects

### Detect Bird-Pipe Collision Command

| Event Triggered                          | Description                                               |
|------------------------------------------|-----------------------------------------------------------|
| [TICK](../event/tick.md)                 | Each frame checks for collisions between bird and all pipes |

When the bird collides with a pipe, the system will:
1. Dispatch [BIRD_COLLISION](../event/bird_collision.md) event to mark the collision occurrence
2. Dispatch [KILL_BIRD](../event/kill_bird.md) event to set the bird's isAlive property to false
3. Stop all scrolling of background, ground, and pipes (through game state changes)

Collision detection uses bounding box (AABB - Axis-Aligned Bounding Box) collision detection.

### Detect Bird-Ground Collision Command

| Event Triggered                          | Description                                               |
|------------------------------------------|-----------------------------------------------------------|
| [TICK](../event/tick.md)                 | Each frame checks for collision between bird and ground    |

When the bird collides with the ground, the system will:
1. Dispatch [BIRD_LAND](../event/bird_land.md) event to mark that the bird has landed
2. Completely stop the game (if the bird is already dead)

This collision occurs during the falling animation phase after the bird's death and is the final step in the game-over sequence.

## Game Over Flow

The complete game-over sequence handled by the CollisionSystem:

1. **Collision Occurs**: Bird hits a pipe
   - Dispatch BIRD_COLLISION event
   - Dispatch KILL_BIRD event (sets bird's isAlive to false)
   - Stop all scrolling

2. **Falling Phase**: Bird continues to fall under gravity
   - Bird loses control (no longer responds to player input)
   - Only physics system continues to act on the bird

3. **Landing**: Bird hits the ground
   - Dispatch BIRD_LAND event
   - Game completely stops
