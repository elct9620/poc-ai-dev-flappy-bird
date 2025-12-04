# Scene

The Scene component is a visual element that displays a tiled background image using PixiJS TilingSprite. It automatically repeats the background texture to fill the screen and adapts to different screen sizes.

## Properties

| Name    | Type    | Description                                    |
|---------|---------|------------------------------------------------|
| texture | Texture | The background image texture loaded from assets|

## Structure

```markdown
Container (Scene)
    └── TilingSprite
```

- Uses PixiJS TilingSprite for efficient texture repetition
- TilingSprite automatically handles seamless tiling in both horizontal and vertical directions
- The sprite dimensions are set to match the screen size for full coverage

## Behavior

### Sync Method

The `sync(entity: Scene)` method reconciles the component's visual state with the entity. Since the Scene entity contains minimal state (only `id` and `type`), the sync method has minimal work:

1. **Visibility**: Ensures the component is visible when the entity exists
2. **Screen Adaptation**: Updates TilingSprite dimensions to match current screen size if changed

### Initialization

When created, the component:

1. Receives the background texture as a parameter
2. Creates a TilingSprite with the texture
3. Sets the TilingSprite dimensions to match the screen size
4. Positions the TilingSprite at the origin (0, 0)
5. Adds the TilingSprite to the container

### Adaptive Behavior

- TilingSprite automatically handles texture repetition without manual tile management
- Adapts to screen size changes by updating the TilingSprite width and height
- Maintains seamless tiling in both directions regardless of screen dimensions
