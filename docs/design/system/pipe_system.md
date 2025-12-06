# PipeSystem

The PipeSystem is responsible for managing pipe obstacles in the game, including creation, movement, and removal. It processes pipe-related events and generates commands that update [Pipe](../entity/pipe.md) entity states. Pipes are generated in pairs (top and bottom) with a gap for the player to navigate through.

## Side Effects

### Create Pipe Pair Command

| Event Triggered | Description |
|-----------------|-------------|
| [CREATE_PIPE](../event/create_pipe.md) | Creates a new pair of pipes (top and bottom) with a gap |

Adds two new [Pipe](../entity/pipe.md) entities to the game state - one top pipe and one bottom pipe. The pipes are positioned at the right edge of the screen with a randomized gap position that creates a navigable space for the bird. Both pipes share the same `gapY` value to ensure proper alignment. Returns a new state with both entities added immutably.

### Update Pipe Position Command

| Event Triggered | Description |
|-----------------|-------------|
| TICK | Each frame moves all pipes from right to left |

During each TICK event, updates all pipe positions by subtracting the scroll speed multiplied by deltaTime. This creates the horizontal scrolling effect. Position updates are applied to all active pipe entities every frame for smooth movement.

### Mark Pipe as Passed Command

| Event Triggered | Description |
|-----------------|-------------|
| TICK | Marks pipes as passed when bird crosses them |

During each TICK event, checks if the bird's x-position has passed each pipe's x-position. When a pipe pair is passed for the first time (and `passed` is false), sets the `passed` property to true. This enables score tracking by ensuring each pipe pair only increments the score once.

### Remove Pipe Command

| Event Triggered | Description |
|-----------------|-------------|
| [REMOVE_PIPE](../event/remove_pipe.md) | Removes a pipe entity that has moved off-screen |

Removes a [Pipe](../entity/pipe.md) from the game state's entities record when it moves beyond the left edge of the screen. This command is triggered automatically when a pipe's x-position becomes less than the negative pipe width, recycling memory for new pipes. Returns a new state with the entity removed immutably.

## Pipe Generation Constants

The PipeSystem uses the following constants for pipe generation and movement:

- **Pipe Width**: 52 pixels (from sprite dimensions)
- **Pipe Height**: 320 pixels (from sprite dimensions)
- **Gap Size**: 140-160 pixels (vertical space between top and bottom pipes)
- **Horizontal Spacing**: 200 pixels (distance between pipe pairs)
- **Scroll Speed**: 2 pixels/frame (horizontal movement speed, equivalent to ~120 pixels/second at 60fps)
- **Min Gap Y**: 120 pixels (minimum y-coordinate for gap center)
- **Max Gap Y**: 280 pixels (maximum y-coordinate for gap center)

These values provide appropriate difficulty while ensuring the game remains playable.

## Adapter Interface

The PipeSystem depends on a `StageAdapter` interface for rendering coordination:

- `updatePipe(entity: Pipe): void` - Create or update visual representation
- `removeEntity(id: string): void` - Destroy visual representation

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
