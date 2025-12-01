# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

A proof-of-concept to verify Claude Code as GitHub App can run inside GitHub Actions and use issue-based instructions to build a Flappy Bird game.

**Tech Stack:**
- TypeScript with strict mode and experimental decorators (for dependency injection)
- PixiJS for rendering
- Tsyringe for dependency injection
- Vite (using rolldown-vite fork) for build tooling
- Vitest for testing
- QuickPickle (Gherkin plugin for Vitest) for BDD-style tests
- pnpm@10.15.1 as package manager

## Development Commands

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Run tests
pnpm test

# Run tests with UI
pnpm test:ui
```

## Architecture

This project follows an **event-driven architecture with adapters** pattern for building a game engine. The architecture documentation in `docs/ARCHITECTURE.md` describes the complete vision.

### Current Implementation Status

**Implemented:**
- Core event-driven Engine (`src/engine/engine.ts`) - Singleton managing game loop, event routing, and state updates
- Score system with full CRUD operations - Complete with BDD tests (9 scenarios in `features/score.feature`)
- PixiJS integration via PixiStageAdapter - Manages rendering and component lifecycle
- Score component - Renders digit sprites with alignment and spacing
- Asset loading system - Async preload of game sprites and sounds

**Not Yet Implemented:**
- Bird/Player entity and physics
- Pipe generation and movement
- Collision detection
- Input handling
- Sound playback
- Game state (menu, playing, game over)

### Architecture Layers

The architecture separates concerns into distinct layers:

1. **Engine** (`src/engine/engine.ts`): Framework-agnostic game loop
   - **Event Queue**: Dispatches events to systems
   - **System Processing**: Systems generate commands based on events
   - **Command Execution**: Pure functions update state immutably
   - **API**: `dispatch(event)`, `tick(ticker)`, `getState()`

2. **Entity** (`src/entity/`): Immutable game state definitions
   - GameState contains `entities` record keyed by ID
   - Entities updated via pure functions (never mutated)
   - Example: `Score` (`src/entity/Score.ts`) with position, scale, alignment, value

3. **Systems** (`src/systems/`): Pure event processors
   - **Signature**: `(state: State, event: Event) => Command[]`
   - Example: `ScoreSystem` handles CREATE_SCORE, UPDATE_SCORE, REMOVE_SCORE
   - Can accept adapters as dependencies for side effects

4. **Adapters** (`src/adapters/`): External system interfaces
   - Bridge between pure engine and PixiJS rendering
   - `PixiStageAdapter` manages components, provides lifecycle hooks
   - Implements interfaces defined by systems (loose coupling)

5. **Components** (`src/components/`): PixiJS visual components
   - Factory pattern for creating display objects
   - `sync(entity)` method reconciles state changes
   - Example: `Score` component renders number sprites

### Data Flow

```
User/Timer → Events → Engine → Systems → Commands → State Updates → Adapters → PixiJS Rendering
```

**Key Pattern**: Systems are pure functions; side effects isolated in adapters.

### Testing Strategy

**BDD with Gherkin:**
- Feature files: `features/*.feature` (human-readable specifications)
- Step definitions: `features/steps/*.steps.ts` (test implementations)
- World context: `features/support/world.ts` (test environment setup)
- Mock adapters: `features/support/mockAdapter.ts` (isolate engine from rendering)

**Current Coverage:**
- `features/score.feature`: 9 scenarios testing Score system
- Tests state immutability, CRUD operations, alignments, boundary values

**No unit tests folder**: E2E testing by humans; integration via Gherkin

**QuickPickle Configuration** (`vite.config.ts`):
- Auto-discovers `.feature` files
- Setup files load in order: `setup.ts` → `world.ts` → `mockAdapter.ts` → `*.steps.ts`
- Use `setWorldConstructor` pattern for world initialization

## Implementation Patterns

### State Immutability

All state updates create new objects (never mutate):

```typescript
// Pattern used throughout
return {
  ...state,
  entities: {
    ...state.entities,
    [id]: updatedEntity
  }
};
```

### Event Processing

Events queued via `dispatch()`, processed in `tick()`:

```typescript
engine.dispatch({
  type: "CREATE_SCORE",
  payload: { id, value, position, scale, spacing, alignment }
});
engine.tick({ deltaTime: 0 }); // Process all queued events
```

### System Implementation

Systems return commands (pure state transformers):

```typescript
export const ScoreSystem = (adapter: StageAdapter): System => {
  return (state, event) => {
    if (event.type === "CREATE_SCORE") {
      return [(state) => ({
        ...state,
        entities: {
          ...state.entities,
          [event.payload.id]: createScore(event.payload)
        }
      })];
    }
    return [];
  };
};
```

### Component Sync Pattern

Components reconcile state changes via `sync()`:

```typescript
class Score extends Container {
  sync(entity: Score) {
    // Update visual representation based on entity state
    this.updateDigits(entity.value);
    this.position.set(entity.position.x, entity.position.y);
  }
}
```

## Important Notes

- This project uses `rolldown-vite@7.2.5` as a Vite replacement (specified in pnpm overrides)
- TypeScript uses strict mode with bundler module resolution
- Experimental decorators enabled for tsyringe dependency injection
- Entry point: `index.html` → `src/main.ts`
- Prettier configured with `organize-imports` plugin
- Path alias `@/*` maps to `src/*` for clean imports
- Full architecture documented in `docs/ARCHITECTURE.md`

## GitHub Actions Integration

The project uses Claude Code as a GitHub App that responds to:
- Issue comments with `@claude`
- PR review comments with `@claude`
- New issues with `@claude` in title/body
- PR reviews with `@claude`

Workflow includes pnpm setup and dependency installation before running Claude Code.
