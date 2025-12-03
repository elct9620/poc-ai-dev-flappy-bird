# Bird

The Bird component is responsible for visually representing the player character using animated sprites. It displays the bird with appropriate position, rotation, and wing flapping animation based on the bird entity's state.

The component manages its own animation state internally, cycling through wing flapping frames continuously without relying on entity state. This simplifies the architecture by keeping purely visual concerns within the rendering layer.

## Properties

| Name          | Type                          | Description                                           |
|---------------|-------------------------------|-------------------------------------------------------|
| position      | [Vector](../entity/vector.md) | Screen position where the bird is rendered            |
| rotation      | number                        | Rotation angle in radians for tilting the bird        |

## Structure

The Bird component is built using PixiJS sprites with three animation frames for wing flapping.

```markdown
Container (Bird)
    └── Sprite (animated)
         ├── yellowbird-downflap.png (frame 0)
         ├── yellowbird-midflap.png (frame 1)
         └── yellowbird-upflap.png (frame 2)
```

- **Sprite**: The main visual element that displays the bird. The sprite's texture changes based on the `animationFrame` property to create a flapping animation effect.

## Animation Frames

The bird uses three sprite assets for animation:

1. **Frame 0** (`yellowbird-downflap.png`): Wings in downward position
2. **Frame 1** (`yellowbird-midflap.png`): Wings in middle position
3. **Frame 2** (`yellowbird-upflap.png`): Wings in upward position

The animation cycles through these frames (0 → 1 → 2 → 0) continuously during gameplay to create a smooth flapping effect. The component manages this animation internally with:

- **Internal frame counter**: Tracks ticks since last frame change
- **Current frame index**: Stores which of the 3 frames is currently displayed
- **Frame duration**: 8 ticks (~133ms at 60fps) per frame
- **Continuous cycling**: Animation runs while bird is alive, independent of game events

## Behavior

### Sync Method

The `sync(entity: Bird)` method reconciles the component's visual state with the bird entity:

1. **Position Update**: Sets the sprite's position to match `entity.position`
2. **Rotation Update**: Sets the sprite's rotation to match `entity.rotation`
3. **Animation Update**: Increments internal frame counter and advances animation frame when counter reaches 8 ticks
4. **Visibility**: Hides the sprite if `entity.isAlive` is false (also pauses animation)

### Initialization

When created, the component:

1. Loads all three bird sprite textures
2. Creates a sprite with the first texture (frame 0)
3. Sets the sprite's anchor point to center (0.5, 0.5) for proper rotation
4. Positions the sprite at the entity's initial position
5. Initializes internal animation state (frame counter = 0, current frame = 0)

## Visual Details

- **Pivot Point**: Center of the bird sprite for natural rotation
- **Z-Index**: Rendered above background elements but below UI elements
- **Scale**: Can be adjusted based on game design (typically 1:1 with asset size)
