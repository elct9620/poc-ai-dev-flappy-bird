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

The renderer uses a **full-height approach** where all pipes use the complete 320px texture without cropping:

### Top Pipe
- Sprite uses anchor(0,0) - top-left corner
- Sprite is vertically flipped using negative Y scale (scale.y = -scale)
- Position represents where the pipe's anchor point is placed (gap top edge)
- The sprite extends 320px × scale downward, but appears upward when flipped
- Parts extending above the screen are naturally clipped by viewport bounds

### Bottom Pipe
- Sprite uses anchor(0,0) - top-left corner
- Sprite is in normal orientation (scale.y = scale)
- Position represents where the pipe's anchor point is placed (gap bottom edge)
- The sprite extends 320px × scale downward
- Parts extending below the playable area are covered by the ground layer (zIndex=100)

### No Height Adjustment

Unlike traditional implementations, this renderer **does not crop textures**:

- Both pipes always use the full 320px texture height
- No `frame` property manipulation needed
- No dynamic texture cropping in `sync()` method
- Simpler implementation with the same visual result

The gap between pipes is created purely through positioning, and the visual appearance is achieved through:
1. **Natural clipping** by screen boundaries (top)
2. **Layer ordering** with ground covering bottom parts (zIndex)
3. **Vertical flipping** using negative scale for top pipes

This approach simplifies the renderer while maintaining proper game mechanics. See the [Pipe System](../system/pipe_system.md) for coordinate calculation details.
