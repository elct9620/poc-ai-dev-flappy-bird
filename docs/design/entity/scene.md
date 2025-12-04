# Scene

The Scene entity represents the state of a background scene in the game. It is a pure data structure with minimal state, as the background is a static visual element. All rendering details (texture, tiling, positioning) are handled by the Component layer using PixiJS TilingSprite.

## Properties

| Name | Type     | Description                                       |
|------|----------|---------------------------------------------------|
| id   | string   | Unique identifier for this scene entity           |
| type | "scene"  | Type annotation indicating this is a scene entity |

## Mutations

### Create Scene

Creates a new scene entity with minimal state. The entity serves as a reference for the rendering system to display the background.

### Remove Scene

Removes the scene entity from the game state entirely. This is used when transitioning between different game scenes or cleaning up resources.
