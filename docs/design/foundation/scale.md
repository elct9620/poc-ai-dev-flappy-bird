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

#### `getBaseScale(): number`

Returns the unified base scale that all game elements should use. This is the same scale the background uses to fill the screen height, ensuring all sprites scale proportionally together.

**Formula**: `screenHeight / 512`

**Use case**: All game sprites (Bird, Ground, Score, Pipes) to maintain consistent proportions

#### `getResponsiveScale(designScaleFactor: number): number` ⚠️ **DEPRECATED**

**⚠️ This method is deprecated.** Use `getBaseScale()` instead.

The design factor multiplier causes sprites to scale disproportionately with the background, making elements too large relative to the game canvas.

## Unified Base Scale

All game sprites use the same base scale to ensure proportional scaling across all screen sizes.

**Base Scale Formula**: `screenHeight / 512`

| Element | Method | Multiplier | Result | Purpose |
|---------|--------|------------|--------|---------|
| **Background** | `getFullscreenScale(512)` | N/A | `screenHeight / 512` | Fill entire screen height |
| **Bird** | `getBaseScale()` | 1.0 | `screenHeight / 512` | Scale proportionally with background |
| **Ground** | `getBaseScale()` | 1.0 | `screenHeight / 512` | Maintain ~22% of screen height |
| **Score** | `getBaseScale()` | 1.0 | `screenHeight / 512` | Scale proportionally with background |
| **Pipes** | `getBaseScale()` | 1.0 | `screenHeight / 512` | Scale proportionally with background |

All elements scale together proportionally - no individual multipliers.

### Why Unified Scaling?

The background texture is 288×512px, where 512px is the reference height for the entire game. When the background scales to fill the screen (`screenHeight / 512`), all other sprites should use the **same scale factor** to maintain proper proportions.

**Previous Problem:**
Sprites used `(screenHeight / 512) × 2.0`, making them twice as large relative to the background. This caused the ground to consume 44% of the screen instead of the intended 22%.

**Solution:**
Remove the 2.0 multiplier. All sprites now use base scale = `screenHeight / 512`.

### Expected Results

At different screen heights, all elements maintain consistent proportions:

| Screen Height | Base Scale | Bird Size | Ground Height | Ground % |
|---------------|------------|-----------|---------------|----------|
| 360px | 0.70 | 24×17px | 78px | 22% |
| 512px (ref) | 1.0 | 34×24px | 112px | 22% |
| 768px | 1.5 | 51×36px | 168px | 22% |
| 1080px | 2.11 | 72×51px | 236px | 22% |

## Implementation Pattern

### Component Constructor

Components receive `ScaleCalculator` instance via constructor and apply scale during initialization:

```typescript
export class GameObjectComponent extends Container {
  constructor(texture: Texture, scaleCalculator: ScaleCalculator) {
    super();

    const sprite = new Sprite(texture);
    const scale = scaleCalculator.getBaseScale();
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
  const scale = scaleCalculator.getBaseScale(); // ✅ Component calculates
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
const scale = scaleCalculator.getBaseScale();
const groundHeight = texture.height * scale;
tilingSprite.tileScale.set(scale, scale);
```

### Bird Component

```typescript
const scale = scaleCalculator.getBaseScale();
sprite.scale.set(scale, scale);
```

### Score Component

```typescript
const scale = scaleCalculator.getBaseScale();
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
