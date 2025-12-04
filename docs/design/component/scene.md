# Scene

The Scene component is a visual element that displays a tiled background image. It automatically repeats the background texture horizontally to fill the screen width and adapts to different screen sizes.

## Properties

| Name          | Type    | Description                                              |
|---------------|---------|----------------------------------------------------------|
| texture       | Texture | The background image texture loaded from assets          |
| tiles         | Sprite[]| Array of sprite instances for horizontal repetition      |
| screenWidth   | number  | Current screen width to determine number of tiles needed |
| screenHeight  | number  | Current screen height for vertical positioning           |

## Structure

```markdown
Container (Scene)
    ├── Sprite (tile 0)
    ├── Sprite (tile 1)
    ├── Sprite (tile 2)
    └── ... (variable number based on screen width)
```

- Each background tile is represented by a separate Sprite instance
- Tiles are positioned horizontally edge-to-edge to create seamless tiling
- The number of tiles is calculated based on screen width divided by tile width
- All tiles use the same background texture

## Synchronization

The `sync(entity: Scene)` method reconciles the component's visual state with the entity:

1. **Position**: Updates the container's position based on entity position
2. **Tile Count Calculation**: Determines how many tiles are needed to fill the screen width
3. **Tile Creation/Update**: Creates or removes tile sprites as needed when screen size changes
4. **Seamless Tiling**: Positions each tile sprite horizontally to create continuous background

## Adaptive Behavior

- Monitors screen size changes to adjust the number of background tiles
- Adds additional tiles when screen width increases
- Removes excess tiles when screen width decreases
- Maintains seamless horizontal repetition regardless of screen dimensions
