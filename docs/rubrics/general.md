# General Rubric

This document outlines the criteria for evaluating the quality of general coding. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Use `@/` for Absolute Imports (1 point)

In `tsconfig.json`, we already defined the path alias `@/` to point to the `src/` directory. All absolute imports should use this alias for better readability and maintainability.

```typescript
import { MyRenderer } from '@/renderers/MyRenderer';
```

### Reference Design Documents (1 point)

For game-related implementations, always use TSDoc comments to reference the relevant design documents.

```typescript
// src/systems/ScoreSystem.ts

/**
 * Implements the scoring system as defined in the design document.
 * @see {@link ../../docs/design/system/score_system.md|Score System Design Document}
 * @see {@link ../../docs/design/event/increment_score.md|Increment Score Event Design Document}
 */

// Implementation code...
```

- `src/systems/` for Game System implementations
- `src/renderers/` for Game Visual Renderer implementations
- `src/entities/` for Game Entity implementations
- `src/events/` for Event implementations

### Document Consistency (1 point)

The implementation should be consistent with the design document defined.

- Interface and class names should match the design document.
- Method signatures should align with the design document.
- If any constant values are defined in the design document, they should be used in the implementation.

> Exceptions can be made if unable to follow the design document due to technical constraints. In such cases, provide a clear explanation in the code comments. Use `TODO` comments to highlight areas that deviate from the design document.

### YAGNI Principle (1 point)

Follow the YAGNI (You Aren't Gonna Need It) principle by avoiding the implementation of features or code that are not currently required. This helps keep the codebase clean and maintainable.

- Remove unused code and features.
- Avoid speculative implementations.
- Focus on current requirements and functionality.

### Single Responsibility Principle (1 point)

Ensure that each module, class, or function has a single responsibility. This makes the code easier to understand, test, and maintain.

```typescript
// src/systems/ScoreSystem.ts

export function ScoreSystem() {
    /**
     * Focuses solely on managing the game score.
     *
     * Cohesion:
     * - Reset Score
     * - Increment Score
     * - Create Score Entity
     * - Remove Score Entity
     */

     // Implementation code...
}
```

- Each class or function should have one clear purpose.
- Avoid mixing different functionalities in a single module.
- Refactor code to separate concerns when necessary.
- Cohesive related functionalities together, decoupling unrelated ones.

### No Magic Numbers (1 point)

Avoid using magic numbers in the code. Instead, define constants with meaningful names to improve code readability and maintainability.

```typescript
// src/constants.ts
export const MAX_PLAYER_HEALTH = 100;

// src/systems/HealthSystem.ts
import { MAX_PLAYER_HEALTH } from '@/constants';

function initializePlayerHealth() {
    let playerHealth = MAX_PLAYER_HEALTH;
    // Implementation code...
}
```

- Define constants for all significant numeric values.
- Use descriptive names for constants to convey their purpose.
- Replace magic numbers in the code with the defined constants.
