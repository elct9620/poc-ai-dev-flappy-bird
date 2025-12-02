# KILL_BIRD

**Type:** `GameEvent`

Marks a bird as dead (sets isAlive to false). Dead birds stop responding to player input but remain in the game state. This is typically used when the bird collides with obstacles or goes out of bounds.

## Payload

| Field | Type   | Description                     |
|-------|--------|---------------------------------|
| id    | string | Identifier of the bird to kill  |
