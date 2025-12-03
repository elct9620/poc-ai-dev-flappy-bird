# Bird

The Bird component is responsible for visually representing the player character using animated sprites. It displays the bird with appropriate position, rotation, and wing flapping animation based on the bird entity's state.

The component manages its own animation state internally, cycling through wing flapping frames continuously without relying on entity state. This simplifies the architecture by keeping purely visual concerns within the rendering layer.

## Properties

| Name          | Type                          | Description                                           |
|---------------|-------------------------------|-------------------------------------------------------|
| position      | [Vector](../entity/vector.md) | Screen position where the bird is rendered            |
| rotation      | number                        | Rotation angle in radians for tilting the bird        |

## Structure

The Bird component is built using PixiJS AnimatedSprite with three animation frames for wing flapping.

```markdown
Container (Bird)
    └── AnimatedSprite
         ├── yellowbird-downflap.png (frame 0)
         ├── yellowbird-midflap.png (frame 1)
         └── yellowbird-upflap.png (frame 2)
```

- **AnimatedSprite**: The main visual element that displays the bird. PixiJS AnimatedSprite automatically manages texture cycling to create a smooth flapping animation effect.

## Animation Frames

The bird uses three sprite assets for animation:

1. **Frame 0** (`yellowbird-downflap.png`): Wings in downward position
2. **Frame 1** (`yellowbird-midflap.png`): Wings in middle position
3. **Frame 2** (`yellowbird-upflap.png`): Wings in upward position

The animation cycles through these frames (0 → 1 → 2 → 0) continuously during gameplay to create a smooth flapping effect. The component uses PixiJS AnimatedSprite to manage this animation with:

- **AnimatedSprite.animationSpeed**: Set to 0.125 (1/8) for 8 ticks per frame (~133ms at 60fps)
- **AnimatedSprite.play()**: Starts the continuous animation loop
- **AnimatedSprite.stop()**: Pauses animation when bird dies
- **Automatic frame cycling**: AnimatedSprite handles frame progression internally based on the game's ticker

## Behavior

### Sync Method

The `sync(entity: Bird, deltaTime: number)` method reconciles the component's visual state with the bird entity:

1. **Position Update**: Sets the container's position to match `entity.position`
2. **Rotation Update**: Sets the container's rotation to match `entity.rotation`
3. **Animation Control**: Starts animation with `play()` if bird is alive and animation stopped, or stops with `stop()` if bird is dead
4. **Visibility**: Hides the component if `entity.isAlive` is false

### Initialization

When created, the component:

1. Receives all three bird sprite textures as a parameter
2. Creates an AnimatedSprite with all textures
3. Sets the sprite's anchor point to center (0.5, 0.5) for proper rotation
4. Configures animation speed to 0.125 (8 ticks per frame at 60fps)
5. Starts the animation loop with `play()`
6. Adds the AnimatedSprite to the container

## Visual Details

- **Pivot Point**: Center of the bird sprite for natural rotation
- **Z-Index**: Rendered above background elements but below UI elements
- **Scale**: Can be adjusted based on game design (typically 1:1 with asset size)
