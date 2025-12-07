# Layer Ordering Guidelines

## Overview

This document defines the rendering layer order (z-index) for all game visual elements. Layer management ensures game objects are rendered in the correct visual stacking order, creating the proper depth perception and gameplay experience.

## Philosophy

### Visual Hierarchy

Game elements are organized in distinct rendering layers from back to front. Each layer has a specific z-index value that determines its rendering order - higher values render on top of lower values.

### Separation of Concerns

- **Entities**: Pure game state (position, velocity, value) - do NOT manage z-index
- **Renderers**: Visual representation - own layer/z-index assignment
- **Constants**: Centralized z-index values defined in `src/constants.ts`

## Layer Order Definition

The correct rendering order from **top (front)** to **bottom (back)**:

1. **Score** - User interface elements that should always be visible
2. **Player (Bird)** - Main character that player controls
3. **Ground** - Floor element at bottom of playable area
4. **Obstacles (Pipes)** - Interactive obstacles
5. **Background** - Static decorative background

## Z-Index Values

Z-index values are defined as constants in `src/constants.ts` with spacing to allow future insertions:

| Layer | Constant | Value | Visual Position | Purpose |
|-------|----------|-------|-----------------|---------|
| **Score** | `ZINDEX_SCORE` | 200 | Topmost | Always visible UI element |
| **Bird** | `ZINDEX_BIRD` | 100 | Above ground | Player character visibility during gameplay |
| **Ground** | `ZINDEX_GROUND` | 50 | Above pipes | Covers bottom portions of pipes naturally |
| **Pipes** | `ZINDEX_PIPE` | 10 | Above background | Interactive obstacles |
| **Background** | `ZINDEX_BACKGROUND` | 0 | Bottom | Decorative backdrop |

### Spacing Strategy

Z-index values use increments of 10+ to provide room for future layers if needed. For example, if a new UI element needs to be added between Ground and Bird, values like 60-90 are available.

## Implementation Pattern

### Renderer Constructor

Renderers assign their z-index during initialization using imported constants:

```typescript
import { ZINDEX_BIRD } from '@/constants';

export class Bird extends Container {
  constructor(textures: Texture[], scaleCalculator: ScaleCalculator) {
    super();

    // ... sprite setup ...

    // Set zIndex for rendering order - Bird above ground and pipes
    this.zIndex = ZINDEX_BIRD;
  }
}
```

### Stage Adapter Configuration

The stage adapter must enable z-index sorting for PixiJS to respect layer ordering:

```typescript
// In PixiStageAdapter constructor or initialization
stage.sortableChildren = true;
```

This enables PixiJS to automatically sort children by their `zIndex` property before rendering each frame.

## Visual Rationale

### Why Bird Above Ground?

The bird must render **above** the ground to ensure the player character is always visible during gameplay. If the ground rendered above the bird, the player would appear to "sink into" or be covered by the ground, which breaks game immersion.

### Why Ground Above Pipes?

The ground naturally covers the bottom portions of pipes that extend below the playable area. This creates a clean visual where pipes appear to go "into" the ground rather than floating or requiring precise height cropping.

### Why Score Topmost?

The score is a UI element that must always be visible regardless of game state. It should never be obscured by game objects like the bird, pipes, or ground.

## Common Issues

### Problem: Ground Covering Bird

**Symptom**: Bird appears to sink into or be hidden by the ground during gameplay.

**Cause**: Ground z-index is higher than Bird z-index.

**Solution**: Ensure `ZINDEX_BIRD > ZINDEX_GROUND` in constants.

**Correct Order**:
```typescript
export const ZINDEX_GROUND = 50;
export const ZINDEX_BIRD = 100;  // Higher value = renders on top
```

### Problem: Background Covering Game Elements

**Symptom**: Game objects disappear behind the background.

**Cause**: Background z-index is too high.

**Solution**: Background should always have the lowest z-index (0).

### Problem: Pipes Appearing Above Ground

**Symptom**: Pipe bottoms visible below ground instead of being covered.

**Cause**: Pipe z-index is higher than Ground z-index.

**Solution**: Ensure `ZINDEX_PIPE < ZINDEX_GROUND`.

## Testing Considerations

- Visual layer ordering is verified through visual inspection and gameplay testing
- BDD tests do NOT test z-index values (renderer implementation detail)
- Tests focus on game behavior (collision, scoring, movement)
- Layer order is a rendering concern, not a game state concern

## Migration Notes

If updating z-index values:

1. Update constants in `src/constants.ts`
2. No changes needed in renderer code (they reference constants)
3. Visual testing required to verify correct rendering order
4. Document the reason for changes in this file

## Related Documents

- Implementation: `src/constants.ts` (z-index constant definitions)
- Adapter: `src/adapters/PixiStageAdapter.ts` (stage sorting configuration)
- Renderer Designs:
  - `docs/design/renderer/background.md`
  - `docs/design/renderer/pipe.md`
  - `docs/design/renderer/ground.md`
  - `docs/design/renderer/bird.md`
  - `docs/design/renderer/score.md`

## Appendix

### PixiJS Z-Index Sorting

PixiJS uses the `zIndex` property on display objects when `sortableChildren` is enabled on the parent container:

- **Lower values** render first (back)
- **Higher values** render last (front)
- Objects with the same z-index render in the order they were added to the container
- Sorting happens automatically before each render when `sortableChildren = true`

### Reference

- PixiJS Documentation: [Display Object - zIndex](https://pixijs.download/dev/docs/PIXI.DisplayObject.html#zIndex)
