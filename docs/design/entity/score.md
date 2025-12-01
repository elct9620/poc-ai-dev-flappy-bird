# Score

The Score entity represents the state of a numeric score display in the game. It is a pure data structure containing the score value and its visual presentation properties.

## Properties

| Name      | Type                           | Description                                           |
|-----------|--------------------------------|-------------------------------------------------------|
| id        | string                         | Unique identifier for this score entity              |
| type      | "score"                        | Type annotation indicating this is a score entity    |
| value     | number                         | The numeric score value to display                   |
| position  | [Vector](./vector.md)          | Screen position for rendering the score              |
| scale     | number                         | Scale multiplier for the score display               |
| spacing   | number                         | Horizontal spacing (in pixels) between digit sprites |
| alignment | "left" \| "center" \| "right"  | Horizontal alignment of the digit string             |

## Mutations

### Create Score

Creates a new score entity with the specified properties. All properties are required at creation time with defaults handled at the system level.

### Update Score Value

Updates the `value` property while preserving all other properties. This is the primary mutation used during gameplay to reflect score changes.

### Increment Score

Increases the `value` property by 1. This is a convenience mutation for common score increment operations.

### Remove Score

Removes the score entity from the game state entirely. This is used when transitioning between game states or cleaning up UI elements.
