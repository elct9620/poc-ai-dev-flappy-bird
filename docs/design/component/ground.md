# Ground

The Ground component is a visual element that displays a tiled ground (base) image at the bottom of the screen using PixiJS TilingSprite. It automatically repeats the ground texture horizontally to fill the screen width and is positioned at the bottom of the game area.

## Properties

| Name    | Type    | Description                                    |
|---------|---------|------------------------------------------------|
| texture | Texture | The ground image texture loaded from assets    |

## Structure

```markdown
Container (Ground)
    └── TilingSprite
```

- Uses PixiJS TilingSprite for efficient texture repetition with aspect-ratio-preserving scaling
- Ground tiles horizontally (X-axis) to create continuous ground effect
- Scale factor is calculated as `screenHeight / textureHeight` to maintain proper proportions
- Both axes use the same scale to maintain aspect ratio and prevent distortion
- The sprite is positioned at the bottom of the screen

## Behavior

### Sync Method

The `sync(entity: Ground)` method reconciles the component's visual state with the entity. Since the Ground entity contains minimal state (only `id` and `type`), the sync method has minimal work:

1. **Visibility**: Ensures the component is visible when the entity exists
2. **Screen Adaptation**: Updates TilingSprite dimensions to match current screen width if changed
3. **Bottom Positioning**: Ensures the ground stays aligned to the bottom of the screen

### Initialization

When created, the component:

1. Receives the ground texture as a parameter
2. Creates a TilingSprite with the texture
3. Sets the TilingSprite width to match the screen width
4. Calculates the appropriate scale to maintain aspect ratio
5. Positions the TilingSprite at the bottom of the screen (y = screenHeight - groundHeight)
6. Adds the TilingSprite to the container

### Adaptive Behavior

- TilingSprite handles texture repetition horizontally (X-axis) to create continuous ground effect
- The ground texture tiles along the X-axis while maintaining its original height proportions
- Uniform scaling factor (`screenHeight / textureHeight`) ensures the texture maintains its original aspect ratio without distortion
- Same scale applied to both axes prevents stretching or compression
- Works correctly across different screen aspect ratios:
  - **Horizontal screens (16:9, 16:10)**: Ground tiles horizontally, maintains height
  - **Vertical screens (9:16)**: Ground tiles horizontally, maintains height
  - **Small screens**: Tiles repeat more frequently, maintains aspect ratio
  - **Large screens**: Tiles repeat less frequently, maintains aspect ratio
- Adapts to screen size changes by updating the TilingSprite width and repositioning to bottom
- Always anchored to the bottom of the screen regardless of screen height changes
- Scaling approach prevents texture stretching while maintaining visual quality
