# Bird

The Bird entity represents the player-controlled character in the game. It is a pure data structure containing the bird's position, velocity, rotation, and animation state.

## Properties

| Name          | Type                  | Description                                                     |
|---------------|-----------------------|-----------------------------------------------------------------|
| id            | string                | Unique identifier for this bird entity                          |
| type          | "bird"                | Type annotation indicating this is a bird entity                |
| position      | [Vector](./vector.md) | Current position of the bird on the screen                      |
| velocity      | [Vector](./vector.md) | Current velocity vector (speed and direction of movement)       |
| rotation      | number                | Current rotation angle in radians (for tilting during movement) |
| animationFrame| number                | Current animation frame index (0-2 for wing flapping). Cycles continuously during gameplay. |
| isAlive       | boolean               | Whether the bird is currently alive (false when game over)      |

## Mutations

### Create Bird

Creates a new bird entity with the specified properties. The bird is initialized at a starting position with zero velocity and default animation state.

### Apply Flap

Updates the bird's velocity to apply an upward force (negative y-velocity). This mutation is triggered when the player presses the space key or clicks the mouse, causing the bird to fly upward.

### Apply Gravity

Updates the bird's velocity by adding a downward force (positive y-velocity). This mutation is applied every frame to simulate gravity pulling the bird down.

### Update Position

Updates the bird's position based on its current velocity. This is typically applied every frame to move the bird according to physics calculations.

### Update Rotation

Updates the bird's rotation angle based on its current velocity. When moving upward, the bird tilts up; when falling, it tilts down.

### Advance Animation

Increments the animation frame index to cycle through wing flapping sprites (0 → 1 → 2 → 0). This mutation is triggered by the AnimationSystem on a timed interval (every 8 ticks) to create continuous wing flapping during gameplay.

### Kill Bird

Sets the `isAlive` property to false. This is used when the bird collides with obstacles or falls off screen.

### Remove Bird

Removes the bird entity from the game state entirely. This is used when cleaning up after game over or transitioning between game states.
