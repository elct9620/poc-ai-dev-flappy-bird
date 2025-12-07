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
- Bird entity and control system - Complete with BDD tests (`features/bird-control.feature`)
- Physics system - Gravity and flap mechanics for bird movement
- Input system - Handles keyboard and click events
- Audio system with BrowserAudioAdapter - Sound effect playback (wing flap)
- PixiJS integration via PixiStageAdapter - Manages rendering and renderer lifecycle
- PixiInputAdapter - Callback pattern for input handling
- Score renderer - Renders digit sprites with alignment and spacing
- Asset loading system - Async preload of game sprites and sounds
- Pipe system - Generation and movement (`features/pipe.feature`)
- Collision detection - AABB algorithm (`features/collision.feature`)
- Background renderer (`features/background.feature`)
- Ground renderer (`features/ground.feature`)
- Score calculation (`features/score-calculation.feature`)

**Not Yet Implemented:**
- Game state management (menu, playing, game over states)

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
   - **Two implementation patterns**:
     - Plain system: `export const System: System = (state, event) => Command[]`
     - Factory with adapter: `export const System = (adapter: Adapter): System => (state, event) => Command[]`

4. **Adapters** (`src/adapters/`): External system interfaces
   - Bridge between pure engine and PixiJS rendering
   - `PixiStageAdapter` manages renderers, provides lifecycle hooks
   - Implements interfaces defined by systems (loose coupling)

5. **Renderers** (`src/renderers/`): PixiJS visual renderers
   - Factory pattern for creating display objects
   - `sync(entity)` method reconciles state changes
   - Example: `Score` renderer renders number sprites

### Data Flow

```
User/Timer → Events → Engine → Systems → Commands → State Updates → Adapters → PixiJS Rendering
```

**Key Pattern**: Systems are pure functions; side effects isolated in adapters.

**Concrete Example - Bird Flap:**
1. User clicks → `PixiInputAdapter` registers callback
2. Callback dispatches `MouseClick` event to `EventBus`
3. `InputSystem` processes `MouseClick` → generates `BirdFlap` event
4. `PhysicsSystem` processes `BirdFlap` → returns command to update bird velocity
5. Command updates bird entity immutably in state
6. Command calls `adapter.update(updatedBird)` to sync renderer
7. `PixiStageAdapter` calls `renderer.sync(entity)` to update visuals
8. `AudioSystem` processes `BirdFlap` → plays wing sound via `BrowserAudioAdapter`

This demonstrates how events flow through the system, from user input to visual/audio output.

### Testing Strategy

**BDD with Gherkin:**
- Feature files: `features/*.feature` (human-readable specifications)
- Step definitions: `features/steps/*.steps.ts` (test implementations)
- World context: `features/support/world.ts` (test environment setup)
- Mock adapters: `features/support/mockAdapter.ts` (isolate engine from rendering)

**Current Coverage:**
- `features/score.feature`: 9 scenarios testing Score system
- `features/bird-control.feature`: Tests bird control, physics, and audio
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

### Renderer Sync Pattern

Renderers reconcile state changes via `sync()`:

```typescript
class Score extends Container {
  sync(entity: Score) {
    // Update visual representation based on entity state
    this.updateDigits(entity.value);
    this.position.set(entity.position.x, entity.position.y);
  }
}
```

### Event Definitions

Events are defined with enum types in `src/events/`:

```typescript
export enum ScoreEventType {
  CREATE_SCORE = "CREATE_SCORE",
  UPDATE_SCORE = "UPDATE_SCORE",
  REMOVE_SCORE = "REMOVE_SCORE",
}

export interface CreateScoreEvent {
  type: ScoreEventType.CREATE_SCORE;
  payload: {
    id: string;
    value: number;
    // ... other properties
  };
}
```

### Design Document References

All game-related implementations must include TSDoc comments referencing design documents:

```typescript
/**
 * Implements the scoring system as defined in the design document.
 * @see {@link ../../docs/design/system/score_system.md|Score System Design Document}
 */
export const ScoreSystem = (adapter: StageAdapter): System => {
  // implementation
};
```

## Code Quality Standards

This project enforces quality standards through rubrics in `docs/rubrics/`:

**General Coding Standards** (`docs/rubrics/general.md`):
- Use `@/` path alias for all absolute imports (not relative imports)
- Reference design documents with TSDoc comments in implementation files
- Maintain consistency between implementation and design documents
- Follow YAGNI principle - avoid implementing unused features
- Follow Single Responsibility Principle - one clear purpose per module

**Testing Standards** (`docs/rubrics/testing.md`):
- Reuse existing Gherkin steps when possible
- Write tests from user's perspective (user interactions, not technical actions)
- Each scenario verifies one specific outcome
- All tests must align with design documents
- No skipped tests (except design-only changes with `@skip` annotation)
- Use scenario outlines with Examples for multiple data sets
- Reference design documents in feature file comments

**Entity Standards** (`docs/rubrics/entity.md`):
- Pure data structures as immutable states with type annotations
- Pure functions for manipulation (no side effects, return new instances)
- Factory functions for creation to ensure consistency

**System Standards** (`docs/rubrics/system.md`):
- Implement as pure functions producing commands
- No direct dependencies on external modules (use adapter interfaces)
- Use utility functions for readability
- Filter relevant events, generate commands for state updates
- Split adapter interfaces into standalone files for reusability

**Adapter Standards** (`docs/rubrics/adapter.md`):
- Clear naming conventions (e.g., PixiStageAdapter, BrowserAudioAdapter, PixiInputAdapter)
- Must implement defined interfaces from systems
- No business logic (translation/bridge layer only)
- Robust error handling for external interactions

## Important Notes

- This project uses `rolldown-vite@7.2.5` as a Vite replacement (specified in pnpm overrides)
- TypeScript uses strict mode with bundler module resolution
- Experimental decorators enabled for tsyringe dependency injection
- Entry point: `index.html` → `src/main.ts`
- Prettier configured with `organize-imports` plugin
- Path alias `@/*` maps to `src/*` for clean imports
- Full architecture documented in `docs/ARCHITECTURE.md`

## Game Constants

All game parameters are centralized in `src/constants.ts` following the "No Magic Numbers" rubric. Key constant categories:

**Physics Constants:**
- `GRAVITY` (0.08) - Downward acceleration in pixels/frame²
- `FLAP_VELOCITY` (-3) - Upward velocity when bird flaps
- `TERMINAL_VELOCITY` (1) - Maximum falling speed
- `MAX_ROTATION_DOWN` / `MAX_ROTATION_UP` - Bird tilt angle limits

**Collision Detection:**
- `BIRD_COLLISION_WIDTH` (28) / `BIRD_COLLISION_HEIGHT` (20) - Reduced from sprite size for better gameplay feel
- `GROUND_TEXTURE_HEIGHT` (112) - Used for ground collision calculations

**Pipe Generation:**
- `SCROLL_SPEED` (2) - Horizontal scroll speed
- `MIN_GAP_SIZE` (140) / `MAX_GAP_SIZE` (160) - Gap between pipe pairs
- `PIPE_SPACING` (200) - Horizontal spacing between pipes

**Audio Assets:**
- `WING_FLAP_SOUND` ("wing") - Bird flap sound effect key
- `POINT_SOUND` ("point") - Score sound effect key

**Rendering Layers (zIndex):**
- Score: 200, Bird: 100, Ground: 50, Pipes: 10, Background: 0
- See `docs/design/foundation/layer.md` for visual stacking details

## Design-First Workflow

This project follows a design-first approach using custom slash commands:

### `/design [feature description] [clarify instructions]`
Creates or edits design documents for game mechanics:
- Creates documents in `docs/design/entity/`, `docs/design/system/`, or `docs/design/renderer/`
- Uses templates from `docs/templates/` (entity.md, system.md, renderer.md)
- Updates index files in `docs/entities.md`, `docs/systems.md`, `docs/renderers.md`
- May create pending Gherkin tests in `features/` (tests fail until implementation)
- Design documents are technology-agnostic, focusing on behavior not implementation

### `/implement [mechanic or feature]`
Implements or refactors features based on design documents:
- Reads design documents from `docs/design/` to understand requirements
- Creates tasks and assigns them (uses Task tool for parallel work)
- Implements entities in `src/entity/`, systems in `src/systems/`, renderers in `src/renderers/`
- Ensures all Gherkin tests in `features/` pass after implementation
- Includes self-review for quality assurance

**Workflow Pattern:**
1. Use `/design` to create design documents first
2. Review and clarify design with stakeholders
3. Use `/implement` to build the feature according to design specs
4. Verify all BDD tests pass

## GitHub Actions Integration

The project uses Claude Code as a GitHub App that responds to:
- Issue comments with `@claude`
- PR review comments with `@claude`
- New issues with `@claude` in title/body
- PR reviews with `@claude`

Workflow includes pnpm setup and dependency installation before running Claude Code.
