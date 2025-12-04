# CREATE_SCENE

**Type:** `GameEvent`

Creates a new scene entity in the game state to display a tiled background.

## Payload

| Field       | Type                          | Description                                    |
|-------------|-------------------------------|------------------------------------------------|
| id          | string                        | Unique identifier for the new scene entity     |
| texturePath | string                        | Path to the background texture asset           |
| position    | [Vector](../entity/vector.md) | Screen position for rendering the scene        |
| width       | number                        | Width of a single background tile              |
| height      | number                        | Height of a single background tile             |
