# BIRD_COLLISION

**Type:** `GameEvent`

Marks that the bird has collided with an obstacle (pipe). This event triggers the start of the game-over sequence, including stopping all scrolling and marking the bird as dead.

## Payload

| Field | Type   | Description                       |
|-------|--------|-----------------------------------|
| id    | string | Identifier of the bird that collided |
