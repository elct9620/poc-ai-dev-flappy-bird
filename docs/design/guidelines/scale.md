# Scale Guidelines

## Overview

This document defines the responsive scaling strategy for all game sprites. Scale management is handled by components (not entities) using the centralized `ScaleCalculator` utility to ensure consistent, responsive rendering across different screen sizes.

## Philosophy

### Responsive Design

All sprites scale proportionally with screen dimensions to maintain consistent visual appearance regardless of device resolution. The scaling system uses a reference height of **512 pixels** (matching the original Flappy Bird canvas height) as the baseline for calculations.

### Separation of Concerns

- **Entities**: Pure game state (position, velocity, value) - do NOT manage scale
- **Components**: Visual representation - own scale logic and rendering
- **ScaleCalculator**: Centralized responsive scale calculations

## ScaleCalculator Utility

### Location

`src/utils/ScaleCalculator.ts`

### Usage

The `ScaleCalculator` is instantiated once in `PixiStageAdapter` with current screen dimensions and passed to all component constructors.

```typescript
const scaleCalculator = new ScaleCalculator(app.screen.width, app.screen.height);
```

### Methods

#### `getFullscreenScale(textureHeight: number): number`

Calculates scale for fullscreen elements (backgrounds) that should fill the entire screen height.

**Formula**: `screenHeight / textureHeight`

**Use case**: Background components that tile to fill the screen

#### `getResponsiveScale(designScaleFactor: number): number`

Calculates responsive scale for game objects and UI elements using a design-specified multiplier.

**Formula**: `(screenHeight / 512) × designScaleFactor`

**Use case**: Game objects (Bird, Pipes, Ground) and UI elements (Score) that scale proportionally

## Design Scale Factors

All scale factors are defined relative to the 512px reference height.

| Sprite Category | Design Scale Factor | Method | Purpose |
|----------------|---------------------|---------|---------|
| **Background** | Dynamic (fullscreen) | `getFullscreenScale(textureHeight)` | Fill entire screen height |
| **Ground** | 2.0 | `getResponsiveScale(2.0)` | Maintain ~20% of screen height |
| **Bird** | 2.0 | `getResponsiveScale(2.0)` | Visible but balanced size |
| **Score** | 2.0 | `getResponsiveScale(2.0)` | Readable at all screen sizes |
| **Pipes** | 2.0 | `getResponsiveScale(2.0)` | Match bird and ground scale |

### Rationale

- **2.0 base factor**: Doubles the original sprite size at 512px reference height, ensuring visibility on modern high-resolution displays
- **Uniform factors**: Bird, Ground, Score, and Pipes use the same factor (2.0) for visual consistency
- **Dynamic background**: Background fills screen completely for seamless tiling

## Implementation Pattern

### Component Constructor

Components receive `ScaleCalculator` instance via constructor and apply scale during initialization:

```typescript
export class GameObjectComponent extends Container {
  constructor(texture: Texture, scaleCalculator: ScaleCalculator) {
    super();

    const sprite = new Sprite(texture);
    const scale = scaleCalculator.getResponsiveScale(2.0);
    sprite.scale.set(scale, scale);

    this.addChild(sprite);
  }
}
```

### Aspect Ratio Preservation

Always apply the same scale value to both X and Y axes to maintain aspect ratio:

```typescript
// Correct - preserves aspect ratio
sprite.scale.set(scale, scale);
tilingSprite.tileScale.set(scale, scale);

// Incorrect - causes distortion
sprite.scale.set(scaleX, scaleY); // Only if intentionally stretching
```

## Migration from Entity-Managed Scale

### Before (Score Entity)

```typescript
// Entity managed scale
interface Score {
  scale: number; // ❌ Scale as entity state
  value: number;
}

// Component applied entity scale
sync(entity: Score): void {
  this.scale.set(entity.scale); // ❌ Component reads from entity
}
```

### After (Component-Managed Scale)

```typescript
// Entity does NOT manage scale
interface Score {
  value: number; // ✅ Pure game state only
}

// Component owns scale logic
constructor(textures: Record<string, Texture>, scaleCalculator: ScaleCalculator) {
  super();
  const scale = scaleCalculator.getResponsiveScale(2.0); // ✅ Component calculates
  this.scale.set(scale);
}

sync(entity: Score): void {
  // Scale already set in constructor, not updated per entity
  this.position.set(entity.position.x, entity.position.y);
}
```

## Screen Size Changes

Currently, screen dimensions are fixed at initialization. If dynamic screen resizing is needed in the future:

1. Update `ScaleCalculator` with new dimensions
2. Re-instantiate components with updated calculator
3. Consider adding a `resize()` method to components

## Examples

### Background Component

```typescript
const scale = scaleCalculator.getFullscreenScale(texture.height);
tilingSprite.tileScale.set(scale, scale);
```

### Ground Component

```typescript
const scale = scaleCalculator.getResponsiveScale(2.0);
const groundHeight = texture.height * scale;
tilingSprite.tileScale.set(scale, scale);
```

### Bird Component

```typescript
const scale = scaleCalculator.getResponsiveScale(2.0);
sprite.scale.set(scale, scale);
```

### Score Component

```typescript
const scale = scaleCalculator.getResponsiveScale(2.0);
this.scale.set(scale); // Container scale affects all children
```

## Testing Considerations

- BDD tests should NOT test scale values (component implementation detail)
- Tests focus on game behavior (position, collision, scoring)
- Scale is verified visually or through rendering integration tests

## Related Documents

- Implementation: `src/utils/ScaleCalculator.ts`
- Component Designs:
  - `docs/design/component/background.md`
  - `docs/design/component/ground.md`
  - `docs/design/component/bird.md`
  - `docs/design/component/score.md`
