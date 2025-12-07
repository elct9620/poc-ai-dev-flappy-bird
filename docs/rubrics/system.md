# System Rubric

This document outlines the criteria for evaluating the quality of entity. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Pure System Functions (1 point)

The system must be a pure function that calculates decisions and returns commands. All side effects (state changes) must be deferred to command execution.

```typescript
// src/systems/ScoreSystem.ts

export function ScoreSystem(state: GameState, event: Event): Command[] {
  if (event.type === 'INCREMENT_SCORE') {
    // System decides what to do, returns command for execution
    return [(state) => ({
        ...state,
        score: incrementScore(state.score, event.payload.amount),
    })];
  }

  return [];
}
```

- System function only reads state and events, never mutates them.
- All state changes happen through returned commands.
- Do not dispatch events or call adapter methods inside the system function, they should be in commands.
- Business logic and checks should be in the system function, not in commands.
- Use entity's update functions to modify entities.

### No Dependencies (1 point)

The system should not have dependencies on external modules or services. It only depends on high-level modules, e,g. Entity, Event in the game architecture.

If the low-level modules/dependencies are needed, define the adapter interfaces and make the system depend on the interfaces instead.

```typescript
// src/systems/AdapterInterfaces.ts

export interface Renderer {
  createEntityVisual(entity: Entity): void;
  updateEntityVisual(entity: Entity): void;
}

// src/systems/MovementSystem.ts

export function MovementSystem(renderer: Renderer) {
  return function(state: GameState, event: Event): Command[] {
    if (event.type === 'UPDATE_POSITION') {
      return [(state) => {
          const updatedPlayer = updatePlayerPosition(state.player, event.payload.newPosition);
          renderer.updateEntityVisual(updatedPlayer);
          return {
            ...state,
            player: updatedPlayer,
          };
      }];
    }

    return [];
  }
}
```

- Use interfaces to abstract low-level modules/dependencies.
- Inject dependencies through function parameters.
- Method should be generic and reusable, not for specific entity or scenario.
- Split interface into standalone files if necessary for reusability.

### Utility Functions (1 point)

Use utility functions to make the system implementation more readable and maintainable.

```typescript
// src/systems/MovementSystem.ts

import { updatePlayerPosition } from '@/entity/Player';

function calculateGravityEffect(position: Vector2, deltaTime: number): Vector2 {
  return {
    x: position.x,
    y: position.y + GRAVITY_CONSTANT * deltaTime,
  };
}

export function MovementSystem(state: GameState, event: Event): Command[] {
  if (event.type === 'UPDATE_POSITION') {
    const newPosition = calculateGravityEffect(state.player.position, event.payload.deltaTime);

    return [(state) => ({
        ...state,
        player: updatePlayerPosition(state.player, newPosition)
    })];
  }

  return [];
}
```

- Use semantically meaningful names to organize code.
- Encapsulate system-related logic in utility functions.
- Use entity's update functions to modify state.
