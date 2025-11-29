Architecture
===

This document outlines the architecture of the project, detailing its structure, components, and design principles.

## Technology Stack

This is a Game built using the following technologies:

- PixiJS
- TypeScript
- Tsyringe (Dependency Injection)
- Vite (Build Tool)
- Vitest (Testing Framework)
- QuickPickle (Gherkin plugin for Vitest)

## Project Structure

```plaintext
root/
├── src/
│   ├── assets/             # Static assets (images, sounds, etc.)
│   ├── engine/             # Self-contained game engine framework
│   │   ├── reducer.ts      # Combines systems into a single reducer function
│   │   ├── service.ts      # Adapter interfaces to bridge engine and input, view, etc.
│   │   ├── runner.ts       # Game loop and main runner logic
│   ├── systems/            # Pure functions that operate on the game state
│   ├── states/             # Game state definitions and management
│   │   ├── commands/       # Command definitions the side effects
│   ├── services/           # Services that interact with external systems (input, view, etc.)
│   ├── views/              # PixiJS view components and rendering logic
│   ├── di/                 # Dependency Injection setup and configurations
│   ├── utils/              # Utility functions and helpers
│   ├── view.ts             # The ViewSync implementation for the game
│   ├── main.ts             # Entry point of the application
├── features/               # Gherkin feature files for behavior-driven development
│   ├── steps/              # Step definitions for Gherkin features
├── public/                 # Public assets served directly
├── index.html              # Main HTML file
├── vite.config.ts          # Vite configuration file
├── tsconfig.json           # TypeScript configuration file
└── package.json            # Project metadata and dependencies
```

> NOTE: we do not use `tests/` folder because E2E is tested by human testers playing the game, and integration tests are done via Gherkin feature files in the `features/` folder.

## Engine

Located in `src/engine/`, play as the core game engine framework, orchestrating the game loop, state management, and view synchronization.

### Reducer

Combines all systems into a single reducer function that processes commands and updates the game state.

```typescript
// src/engine/reducer.ts

export interface System {
    (state: GameState, command: Command): [GameState, Command];
}

export function createReducer(systems: System[]): System {
    return (state: GameState, command: Command): [GameState, Command] => (
        systems.reduce(
            ([currentState, cmd], system) => {
                const [newState, newCmd] = system(currentState, event);
                return [newState, Batch(cmd, newCmd)];
            }
            [state, None()] as [GameState, Command]
        )
    )
}
```

### Runner

Run the main game loop, processing commands and applying systems to update the game state.

```typescript
// src/engine/runner.ts

export class Runner<T> {
    private app: PIXI.Application;
    private state: T;
    private services: Service[];
    private reducer: (state: T, command: Command) => [T, Command];
    private commandQueue: Command[];

    private tick = (ticker: { deltaTime: number }) => {
       // Execute pre-tick services
       // e.g. InputService to enqueue input commands, ViewService to render the current state
       // Process commands through the reducer
       // Enqueue resulting commands for the next tick
    };
}
```

## States

Located in `src/states/` contains the core game state definitions and update logic. Must be pure and free of side effects.

```typescript
// src/states/GameState.ts

export interface GameState {
    // implicitly implements Engine's State interface
    entities: Record<string, Entity>;
}

export function createGameState(): GameState {
    return {
        entities: {},
    };
}

// src/states/commands/AddEntityCommand.ts

export interface AddEntityCommand {
    // implicitly implements Engine's Command interface
    type: 'AddEntity';
    payload: {
        id: string;
        name: string;
    };
}
```

## Systems

Located in `src/systems/`, systems are pure functions that take the current game state and a command, returning a new game state and any resulting events.

```typescripttypescript
// src/systems/addEntitySystem.ts

import { GameState } from '@/states/GameState';

export function spawnEnemiesSystem(state: GameState, command: Command): [GameState, Command] {
    switch (event.type) {
        case 'SpawnEnemies': {
            const newState = { ...state };
            event.enemies.forEach((enemy) => {
                newState.entities[enemy.id] = enemy;
            });

            return [newState, None()];
        }
        default:
            return [state, None()];
    }
}
```

## Services

Located in `src/services/`, services interact with external systems such as input handling and view rendering. They bridge the gap between the engine and these external systems.

```typescript
// src/services/ViewService.ts

export class ViewService implements Service {
    private views: Record<string, PIXI.Container>;
    private entitieIds: Set<string>;

    execute(state: GameState): Command {
        // Sync views with the current game state
        // Create new views for new entities
        // Remove views for deleted entities
        return None();
    }
}
```

## Views

Located in `src/views/`, views handle the rendering of the game using PixiJS. It predefines various visual components that represent game entities.

```typescript
// src/views/Monster.ts

export class Monster extends PIXI.Sprite {
    constructor(texture: PIXI.Texture) {
        super(texture);
        this.anchor.set(0.5);
    }

    public apply(state: MonsterState) {
        this.position.set(state.x, state.y);
        this.rotation = state.rotation;
    }
}
```
