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
