# Scene

The Scene entity represents the state of a background scene in the game. It is a pure data structure containing the texture path and positioning information for rendering a tiled background that adapts to different screen sizes.

## Properties

| Name        | Type                  | Description                                           |
|-------------|-----------------------|-------------------------------------------------------|
| id          | string                | Unique identifier for this scene entity               |
| type        | "scene"               | Type annotation indicating this is a scene entity     |
| texturePath | string                | Path to the background texture asset                  |
| position    | [Vector](./vector.md) | Screen position for rendering the scene               |
| width       | number                | Width of a single background tile (288px)             |
| height      | number                | Height of a single background tile (512px)            |

## Mutations

### Create Scene

Creates a new scene entity with the specified properties. The texture path points to the background asset, and dimensions define the tile size for horizontal repetition.

### Remove Scene

Removes the scene entity from the game state entirely. This is used when transitioning between different game scenes or cleaning up resources.
