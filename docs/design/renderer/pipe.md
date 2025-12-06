# Pipe

The Pipe renderer provides the visual representation of pipe obstacles in the game. It displays a pipe sprite that can be oriented as either a top pipe (flipped vertically) or a bottom pipe (normal orientation).

Scale is managed by the renderer using ScaleCalculator for responsive rendering, not by the entity.

## Properties

| Name     | Type    | Description                                                      |
|----------|---------|------------------------------------------------------------------|
| sprite   | Sprite  | The visual sprite displaying the pipe texture                    |
| isTop    | boolean | Whether this pipe is rendered as a top pipe (flipped) or bottom  |
| position | Vector  | The current position of the pipe on screen                       |
| height   | number  | The visible height of the pipe portion                           |

## Structure

The Pipe renderer is built using a single sprite that displays the pipe texture. For top pipes, the sprite is vertically flipped to create the downward-facing pipe appearance.

```markdown
Container (Pipe)
    └── Sprite (pipe-green.png, 52x320)
```

- **Sprite**: Displays the pipe texture from `src/assets/gameObjects/pipe-green.png` (52×320px). The sprite is scaled using `ScaleCalculator.getBaseScale()` to maintain consistent proportions with other game elements. For top pipes, the sprite is flipped vertically (scale.y = -scale) to create the inverted appearance, while bottom pipes use positive scale (scale.y = scale).

## Scale Management

Scale is applied in the constructor using ScaleCalculator:

```typescript
const scale = scaleCalculator.getBaseScale();
sprite.scale.set(scale, isTop ? -scale : scale);
```

This ensures consistent responsive rendering across all screen sizes. The base scale (`screenHeight / 512`) maintains proper proportions with the background and other game elements. For top pipes, the negative scale creates the vertical flip while maintaining the correct size.

**Scaled Dimensions:**
- Original texture: 52×320 pixels
- Scaled size: `52 × scale` × `320 × scale` pixels
- At 512px screen height (scale = 1.0): 52×320 pixels
- At 768px screen height (scale = 1.5): 78×480 pixels

See the [Scale Guidelines](../foundation/scale.md) for details.

## Rendering Details

### Top Pipe
- Sprite is vertically flipped (scale.y = -1)
- Position represents the bottom edge of the visible pipe
- The pipe extends upward from this position

### Bottom Pipe
- Sprite is in normal orientation (scale.y = 1)
- Position represents the top edge of the visible pipe
- The pipe extends downward from this position

### Height Adjustment

The renderer adjusts the visible height of pipes to create gaps of varying sizes. This is achieved using PixiJS texture cropping:

**Implementation approach:**
- Use sprite texture's `frame` property to crop the visible region
- For bottom pipes: crop from the top by adjusting frame's y-offset and height
- For top pipes: crop from the bottom by adjusting frame's height only
- The scaled height (`320 × scale`) determines the maximum visible pipe length

**Example (bottom pipe cropping to 200px visible height at scale 1.0):**
```typescript
sprite.texture.frame = new Rectangle(0, 120, 52, 200);
```

This approach avoids the overhead of masking while providing precise control over visible pipe portions. The height adjustment is applied in the `sync()` method when the entity's height property changes.
