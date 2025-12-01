# Bird

The Bird component is responsible for visually representing the player character using animated sprites. It displays the bird with appropriate position, rotation, and wing flapping animation based on the bird entity's state.

## Properties

| Name          | Type                          | Description                                           |
|---------------|-------------------------------|-------------------------------------------------------|
| position      | [Vector](../entity/vector.md) | Screen position where the bird is rendered            |
| rotation      | number                        | Rotation angle in radians for tilting the bird        |
| animationFrame| number                        | Current frame index (0-2) for wing flapping animation |

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

The animation cycles through these frames (0 → 1 → 2 → 0) to create a smooth flapping effect.

## Behavior

### Sync Method

The `sync(entity: Bird)` method reconciles the component's visual state with the bird entity:

1. **Position Update**: Sets the sprite's position to match `entity.position`
2. **Rotation Update**: Sets the sprite's rotation to match `entity.rotation`
3. **Animation Frame Update**: Changes the sprite's texture based on `entity.animationFrame`
4. **Visibility**: Hides the sprite if `entity.isAlive` is false

### Initialization

When created, the component:

1. Loads all three bird sprite textures
2. Creates a sprite with the first texture (frame 0)
3. Sets the sprite's anchor point to center (0.5, 0.5) for proper rotation
4. Positions the sprite at the entity's initial position

## Visual Details

- **Pivot Point**: Center of the bird sprite for natural rotation
- **Z-Index**: Rendered above background elements but below UI elements
- **Scale**: Can be adjusted based on game design (typically 1:1 with asset size)
