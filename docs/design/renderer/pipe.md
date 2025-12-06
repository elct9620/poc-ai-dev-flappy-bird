# Pipe

The Pipe renderer provides the visual representation of pipe obstacles in the game. It displays a pipe sprite that can be oriented as either a top pipe (flipped vertically) or a bottom pipe (normal orientation).

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

- **Sprite**: Displays the pipe texture from `src/assets/gameObjects/pipe-green.png`. The sprite's scale and position are adjusted based on whether it's a top or bottom pipe. For top pipes, the sprite is flipped vertically (scale.y = -1) to create the inverted appearance.

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
The renderer uses masking or cropping to adjust the visible height of the pipe, allowing the ground to cover portions of the pipe and create gaps of varying sizes. This is achieved by adjusting the sprite's texture region or using a mask.
