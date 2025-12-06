# REMOVE_PIPE

**Type:** `GameEvent`

Event dispatched to remove a pipe obstacle from the game when it moves off the left edge of the screen. This event is part of the pipe recycling mechanism to manage memory efficiently.

## Payload

| Field | Type   | Description                                    |
|-------|--------|------------------------------------------------|
| id    | string | Unique identifier of the pipe entity to remove |
