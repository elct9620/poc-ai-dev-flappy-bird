# CREATE_SCORE

**Type:** `GameEvent`

Creates a new score entity in the game state with full configuration.

## Payload

| Field     | Type                          | Description                        |
|-----------|-------------------------------|------------------------------------|
| id        | string                        | Unique identifier for the new score entity |
| value     | number                        | Initial numeric score value        |
| position  | [Vector](../entity/vector.md) | Screen position for rendering      |
| scale     | number                        | Scale multiplier for the display   |
| spacing   | number                        | Horizontal spacing between digit sprites |
| alignment | "left" \| "center" \| "right" | Horizontal alignment of digits     |
