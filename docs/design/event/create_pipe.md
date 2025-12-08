# CREATE_PIPE

**Type:** `GameEvent`

Event dispatched to create a new pair of pipe obstacles in the game. This event triggers the creation of both a top and bottom pipe with a gap between them for the player to navigate through.

## Payload

| Field    | Type   | Description                                                       |
|----------|--------|-------------------------------------------------------------------|
| topId    | string | Unique identifier for the top pipe entity                         |
| bottomId | string | Unique identifier for the bottom pipe entity                      |
| x        | number | Horizontal position where the pipe pair should be created (pixels)|
| gapY     | number | Vertical position of the gap center between the pipes (pixels)    |
| gapSize  | number | Size of the gap between top and bottom pipes (pixels)             |

## Usage

This event is dispatched by the [PipeSystem](../system/pipe_system.md) during TICK events to generate new pipe pairs at regular intervals. The system maintains a horizontal spacing of 200 pixels between pipe pairs by tracking the last pipe's position and dispatching CREATE_PIPE when sufficient distance has been covered.

**Dispatch timing:**
- When the game starts and no pipes exist
- Every 200 pixels of horizontal distance (spacing constant)
- Pipes are created at the right edge of the screen (x = screen width)
- Gap position (gapY) is randomized between 120-280 pixels for varied difficulty
