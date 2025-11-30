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

This project follows an **event-driven architecture with adapters** pattern for building a game engine. The architecture documentation in `docs/ARCHITECTURE.md` describes the complete vision, but implementation is currently minimal.

### Current Implementation

The codebase currently contains:
- `src/main.ts`: Entry point that initializes PixiJS and starts the Runner
- `src/engine/runner.ts`: Minimal Runner class with empty tick function
- PixiJS application setup with basic configuration

### Planned Architecture (see `docs/ARCHITECTURE.md`)

The target architecture separates concerns into:

1. **Engine** (`src/engine/`): Framework-agnostic game loop
   - Event-driven system processing
   - State management through pure functions
   - Command pattern for state updates

2. **Entity** (`src/entity/`): Immutable game state definitions
   - Pure functions for state transformations
   - No direct mutations

3. **Systems** (`src/systems/`): Pure event processors
   - Signature: `(state: State, event: Event) => Command[]`
   - Generate commands to update state
   - Can accept adapters for side effects

4. **Adapters** (`src/adapters/`): External system interfaces
   - Bridge to PixiJS, sound, input, etc.
   - Handle side effects outside the pure engine

5. **Components** (`src/components/`): PixiJS visual components
   - Factory pattern for creating display objects

### Testing Strategy

- **BDD tests**: Gherkin features (when created) will go in `features/`
  - QuickPickle configured in `vite.config.ts`
  - Step definitions in `features/*.steps.ts`
- **No unit tests folder**: E2E testing by humans; integration via Gherkin
- Currently no feature files exist

## Important Notes

- This project uses `rolldown-vite@7.2.5` as a Vite replacement (specified in pnpm overrides)
- TypeScript uses strict mode with bundler module resolution
- Experimental decorators enabled for tsyringe dependency injection
- Entry point: `index.html` → `src/main.ts`
- Prettier configured with `organize-imports` plugin
- Full architecture documented in `docs/ARCHITECTURE.md`

## GitHub Actions Integration

The project uses Claude Code as a GitHub App that responds to:
- Issue comments with `@claude`
- PR review comments with `@claude`
- New issues with `@claude` in title/body
- PR reviews with `@claude`

Workflow includes pnpm setup and dependency installation before running Claude Code.
