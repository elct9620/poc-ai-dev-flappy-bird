# Score

The Score renderer is a PixiJS Container that displays a numeric score value using sprite-based digit rendering. It handles layout, alignment, and synchronization with the Score state.

Scale is managed by the renderer using ScaleCalculator for responsive rendering, not by the entity.

## Properties

| Name          | Type                           | Description                                    |
|---------------|--------------------------------|------------------------------------------------|
| textures      | Record<string, Texture>        | Texture atlas mapping digit characters to sprites |
| currentValue  | number                         | Cached value to detect changes and avoid unnecessary rebuilds |
| digitSprites  | Sprite[]                       | Array of sprite instances representing each digit |

## Structure

```markdown
Container (Score)
    ├── Sprite (digit 0)
    ├── Sprite (digit 1)
    ├── Sprite (digit 2)
    └── ... (variable number based on value)
```

- Each digit in the score value is represented by a separate Sprite instance
- Sprites are positioned horizontally with configurable spacing
- The entire container is scaled using ScaleCalculator

## Scale Management

Scale is applied in the constructor using ScaleCalculator:

```typescript
const scale = scaleCalculator.getBaseScale();
this.scale.set(scale);
```

This ensures consistent responsive rendering across all screen sizes. The base scale maintains proportional scaling with all game elements. See the [Scale Guidelines](../foundation/scale.md) for details.

## Synchronization

The `sync(entity: Score)` method reconciles the renderer's visual state with the entity:

1. **Position**: Updates the container's position from entity
2. **Value Change Detection**: Compares `entity.value` with cached `currentValue`
3. **Conditional Rebuild**: Only rebuilds digit sprites if the value has changed
4. **Layout Algorithm**:
   - Converts value to string and splits into digit characters
   - Creates sprite for each digit using texture atlas
   - Calculates total width based on digit count and spacing
   - Applies alignment offset (left: 0, center: -width/2, right: -width)
   - Positions each sprite with configured spacing

## Performance Considerations

- Digit sprites are only rebuilt when the value changes, not on every sync
- Old sprites are properly destroyed to prevent memory leaks
- Alignment calculations are performed only during rebuilds
- Texture lookups use a pre-loaded atlas for fast rendering
- Scale is set once in constructor, not on every sync
