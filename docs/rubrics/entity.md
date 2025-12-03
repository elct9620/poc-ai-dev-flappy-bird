# Entity Rubric

This document outlines the criteria for evaluating the quality of entity. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Pure Data Structures (1 point)

The entity should primarily serve as a data structure as immutable states.

```typescript
// src/entities/Player.ts

export interface Player extends Entity {
  type: 'Player'; # type annotation
  name: string;
  score: number;
  position: Vector2;
}

// src/entities/Vector2.ts

export interface Vector2 {
  x: number;
  y: number;
}
```

### Pure Functions for Manipulation (1 point)

The entity manipulation should be done through pure functions that take the entity as input and return a new modified entity without side effects.

```typescript
// src/entities/Player.ts

export function movePlayer(player: Player, delta: Vector2): Player {
  return {
    ...player,
    position: addVectors(player.position, delta),
  };
}

// src/entities/Vector2.ts
export function addVectors(v1: Vector2, v2: Vector2): Vector2 {
  return {
    x: v1.x + v2.x,
    y: v1.y + v2.y,
  };
}
```

### Factory Functions for Creation (1 point)

Use factory functions to create new instances of entities. This encapsulates the creation logic and ensures consistency.

```typescript
// src/entities/Player.ts

export function createPlayer(name: string, initialPosition: Vector2): Player {
  return {
    type: 'Player',
    name,
    score: 0,
    position: initialPosition,
  };
}

// src/entities/Vector2.ts
export function createVector2(x: number, y: number): Vector2 {
  return { x, y };
}
```
