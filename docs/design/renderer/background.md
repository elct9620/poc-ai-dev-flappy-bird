# Background

The Background renderer is a visual element that displays a tiled background image using PixiJS TilingSprite. It automatically repeats the background texture to fill the screen and adapts to different screen sizes.

## Properties

| Name    | Type    | Description                                    |
|---------|---------|------------------------------------------------|
| texture | Texture | The background image texture loaded from assets|

## Structure

```markdown
Container (Background)
    └── TilingSprite
```

- Uses PixiJS TilingSprite for efficient texture repetition with aspect-ratio-preserving scaling
- Background tiles horizontally (X-axis) to create scrolling effect
- Scale factor is calculated as `screenHeight / textureHeight` to fit screen height
- Both axes use the same scale to maintain aspect ratio and prevent distortion
- The sprite dimensions are set to match the screen size for full coverage

## Behavior

### Sync Method

The `sync(entity: Background)` method reconciles the renderer's visual state with the entity. Since the Background entity contains minimal state (only `id` and `type`), the sync method has minimal work:

1. **Visibility**: Ensures the renderer is visible when the entity exists
2. **Screen Adaptation**: Updates TilingSprite dimensions to match current screen size if changed

### Initialization

When created, the renderer:

1. Receives the background texture as a parameter
2. Creates a TilingSprite with the texture
3. Sets the TilingSprite dimensions to match the screen size
4. Positions the TilingSprite at the origin (0, 0)
5. Adds the TilingSprite to the container

### Adaptive Behavior

- TilingSprite handles texture repetition horizontally (X-axis) to create infinite scrolling background
- The background texture tiles along the X-axis while filling the full height
- Uniform scaling factor (`screenHeight / textureHeight`) ensures the texture maintains its original aspect ratio without distortion
- Same scale applied to both axes prevents stretching or compression
- Works correctly across different screen aspect ratios:
  - **Horizontal screens (16:9, 16:10)**: Background tiles horizontally, fills height
  - **Vertical screens (9:16)**: Background tiles horizontally, fills height
  - **Small screens**: Tiles repeat more frequently, maintains aspect ratio
  - **Large screens**: Tiles repeat less frequently, maintains aspect ratio
- Adapts to screen size changes by updating the TilingSprite width and height
- Scaling approach prevents texture stretching while maintaining visual quality
