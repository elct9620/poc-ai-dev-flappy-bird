# Ground

The Ground entity represents the state of the ground (base) element in the game. It is a pure data structure with minimal state, as the ground is a static visual element positioned at the bottom of the screen. All rendering details (texture, tiling, positioning, scaling) are handled by the Component layer using PixiJS TilingSprite.

## Properties

| Name | Type     | Description                                       |
|------|----------|---------------------------------------------------|
| id   | string   | Unique identifier for this ground entity          |
| type | "ground" | Type annotation indicating this is a ground entity |

## Mutations

### Create Ground

Creates a new ground entity with minimal state. The entity serves as a reference for the rendering system to display the ground at the bottom of the screen.

### Remove Ground

Removes the ground entity from the game state entirely. This is used when transitioning between different game scenes or cleaning up resources.
