# Background

The Background entity represents the state of a background scene in the game. It is a pure data structure with minimal state, as the background is a static visual element. All rendering details (texture, tiling, positioning) are handled by the Renderer layer using PixiJS TilingSprite.

## Properties

| Name | Type         | Description                                           |
|------|--------------|-------------------------------------------------------|
| id   | string       | Unique identifier for this background entity          |
| type | "background" | Type annotation indicating this is a background entity |

## Mutations

### Create Background

Creates a new background entity with minimal state. The entity serves as a reference for the rendering system to display the background.

### Remove Background

Removes the background entity from the game state entirely. This is used when transitioning between different game scenes or cleaning up resources.
