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

This project follows a **functional reactive architecture** with clear separation of concerns:

### Core Concepts

- **Engine** (`src/engine/`): Framework-agnostic game loop and state management
  - `reducer.ts`: Combines systems into a single reducer function
  - `runner.ts`: Main game loop that processes commands and updates state
  - `service.ts`: Adapter interfaces for external systems (input, view, etc.)

- **States** (`src/states/`): Pure state definitions and command types
  - Must be immutable and free of side effects
  - `commands/`: Command definitions that trigger state changes

- **Systems** (`src/systems/`): Pure functions that process commands
  - Signature: `(state: GameState, command: Command) => [GameState, Command]`
  - Must be side-effect free
  - Combined by reducer into a single processing pipeline

- **Services** (`src/services/`): Handle external systems and side effects
  - Bridge between engine and external systems (input, rendering, etc.)
  - Execute during pre-tick/post-tick phases

- **Views** (`src/views/`): PixiJS rendering components
  - Apply state to visual representations
  - Method: `apply(state: EntityState)`

### Testing Strategy

- **BDD tests**: Gherkin features in `features/` (using QuickPickle)
  - Configure in `vite.config.ts`
  - Step definitions in `features/*.steps.ts`
- **No unit test folder**: E2E tested by humans; integration via Gherkin

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
