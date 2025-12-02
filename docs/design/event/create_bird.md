# CREATE_BIRD

**Type:** `GameEvent`

Creates a new bird entity in the game state with initial physics properties.

## Payload

| Field    | Type                          | Description                         |
|----------|-------------------------------|-------------------------------------|
| id       | string                        | Unique identifier for the new bird  |
| position | [Vector](../entity/vector.md) | Initial spawn position of the bird  |
