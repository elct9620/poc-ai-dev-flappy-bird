# REMOVE_PIPE

**Type:** `GameEvent`

Event dispatched to remove a pipe obstacle from the game when it moves off the left edge of the screen. This event is part of the pipe recycling mechanism to manage memory efficiently.

## Payload

| Field | Type   | Description                                    |
|-------|--------|------------------------------------------------|
| id    | string | Unique identifier of the pipe entity to remove |

## Usage

This event is dispatched by the [PipeSystem](../system/pipe_system.md) during TICK events when a pipe has scrolled completely off the left edge of the screen. The system checks each pipe's x-position and triggers removal when the pipe is no longer visible.

**Dispatch timing:**
- Automatically triggered during each TICK event
- When a pipe's x-position becomes less than `-52` pixels (negative pipe width)
- Both top and bottom pipes in a pair are removed independently
- Ensures memory efficiency by cleaning up off-screen obstacles
