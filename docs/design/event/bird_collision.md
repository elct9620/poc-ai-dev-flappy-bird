# BIRD_COLLISION

**Type:** `GameEvent`

Marks that the bird has collided with an obstacle ([Pipe](../entity/pipe.md)). This event signals that a collision has occurred, which will be followed by the [KILL_BIRD](../event/kill_bird.md) event to mark the [Bird](../entity/bird.md) as dead.

## Payload

| Field | Type   | Description                       |
|-------|--------|-----------------------------------|
| id    | string | Identifier of the bird that collided |

