# Pipe

The Pipe entity represents a single obstacle pipe in the game. Pipes appear in pairs (top and bottom) with a gap between them for the player to navigate through. Each pipe moves horizontally from right to left across the screen.

## Properties

| Name     | Type                  | Description                                                                  |
|----------|-----------------------|------------------------------------------------------------------------------|
| id       | string                | Unique identifier for this pipe entity                                       |
| type     | "pipe"                | Type annotation indicating this is a pipe entity                             |
| position | [Vector](./vector.md) | Current position of the pipe on the screen (top-left corner of the sprite)   |
| height   | number                | Height of the visible pipe portion in pixels                                 |
| isTop    | boolean               | Whether this is a top pipe (true) or bottom pipe (false)                     |
| gapY     | number                | Y-coordinate of the gap center (shared between pipe pairs)                   |
| passed   | boolean               | Whether the bird has passed through this pipe pair (for scoring)             |

## Mutations

### Create Pipe

Creates a new pipe entity with the specified properties. The pipe is initialized at the right edge of the screen with a height that creates a gap for the player to navigate through.

### Update Position

Updates the pipe's position based on the scroll speed. This mutation is applied every frame to move the pipe from right to left, creating the illusion of forward movement.

### Mark as Passed

Sets the `passed` property to true when the bird successfully flies past this pipe pair. This is used for score tracking to ensure each pipe pair only increments the score once.

### Remove Pipe

Removes the pipe entity from the game state entirely. This is used when the pipe moves off the left edge of the screen and needs to be recycled.
