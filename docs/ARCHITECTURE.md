# Architecture

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
│   ├── assets/                 # Static assets (images, sounds, etc.)
│   ├── engine/                 # Self-contained game engine framework
│   │   ├── engine.ts           # Core engine interfaces and types
│   │   ├── eventbus.ts         # Event bus for handling game events
│   ├── entity/                 # Game state definitions and management
│   ├── systems/                # Systems that process events and update state
│   ├── components/             # PixiJS components for rendering and interaction
│   ├── events/                 # Event definitions
│   ├── adapters/               # Adapters for external systems (e.g., PixiJS)
│   │   ├── pixiStageAdapter.ts # Adapter for PixiJS stage
│   ├── utils/                  # Utility functions and helpers
│   ├── main.ts                 # Entry point of the application
├── features/                   # Gherkin feature files for behavior-driven development
│   ├── steps/                  # Step definitions for Gherkin features
│   ├── support/                # Support files for testing, e.g., Cucumber World, mocks
├── docs/                       # Documentation files
│   ├── templates/              # Documentation templates
│   ├── design/                 # Game design documents
│   │   ├── entity/             # Entity design documents
│   │   ├── system/             # System design documents
│   │   ├── component/          # Component design documents
│   │   ├── foundation/         # The shared logic and principles, e.g. scale management, adapter interfaces & implementations
│   ├── ARCHITECTURE.md         # This architecture document
│   ├── entities.md             # Entity index and descriptions
│   ├── systems.md              # System index and descriptions
│   ├── components.md           # Component index and descriptions
├── public/                     # Public assets served directly
├── index.html                  # Main HTML file
├── vite.config.ts              # Vite configuration file
├── tsconfig.json               # TypeScript configuration file
└── package.json                # Project metadata and dependencies
```

> NOTE: we do not use `tests/` folder because E2E is tested by human testers playing the game, and integration tests are done via Gherkin feature files in the `features/` folder.

## Engine

Located in `src/engine/`, play as the core game engine framework, orchestrating the events and state updates.

- Command: Represents actions to be executed to update the game state.
- Event: Represents occurrences that systems can respond to,
- System: Pure functions that process events and generate commands to update the game state.

### Engine Core

Singleton class that manages the game loop and routes events to systems.

```typescript
// src/engine/engine.ts

export class Engine {
    constructor(
        private state: State,
        private eventBus: EventBus,
        private systems: System[],
    ) {}


    tick = (ticker: { deltaTime: number }) => {
        this.eventBus.dispatch({ type: 'TICK', payload: { deltaTime: ticker.deltaTime } });
        const events = this.eventBus.flush();

        for (const event of events) {
            const commands = this.processEvent(event);
            for (const command of commands) {
                this.state = command(this.state);
            }
        }
    };

    private processEvent = (event: Event): Command[] => {
        let commands: Command[] = [];
        for (const system of this.systems) {
            commands = commands.concat(system(this.state, event));
        }
        return commands;
    };
}
```

## Entity

Located in `src/entity/`, this module defines the game state which is an entity in the engine, the entity is immutably updated by pure functions.

```typescript
// src/entity/GameState.ts

export interface GameState {
  // implicitly implements Engine's State interface
  entities: Record<string, Entity>;
}

export function createGameState(): GameState {
  return {
    entities: {},
  };
}

// src/entity/Player.ts

export interface Player extends Entity {
  id: string;
  position: { x: number; y: number };
  health: number;
}

export function createPlayer(id: string, x: number, y: number): Player {
  return {
    id,
    position: { x, y },
    health: 100,
  };
}

export function movePlayer(player: Player, dx: number, dy: number): Player {
    return {
        ...player,
        position: {
            x: player.position.x + dx,
            y: player.position.y + dy,
        },
    };
}
```

## Systems

Located in `src/systems/`, systems are pure functions that process events and generate commands to update the game state.

```typescript
// src/systems/MovementSystem.ts

import { System, Event, Command } from '@/engine/engine';
import { GameState } from '@/entity/GameState';
import { movePlayer } from '@/entity/Player';

export const MovementSystem: System = (state: GameState, event: Event): Command[] => {
    const commands: Command[] = [];

    if (event.type === 'MOVE_PLAYER') {
        const { playerId, dx, dy } = event.payload;
        const player = state.entities[playerId] as Player;

        if (player) {
            commands.push((state: GameState) => {
                const updatedPlayer = movePlayer(player, dx, dy);
                return {
                    ...state,
                    entities: {
                        ...state.entities,
                        [playerId]: updatedPlayer,
                    },
                };
            });
        }
    }

    return commands;
};

// src/systems/SoundEffectSystem.ts

import { System, Event, Command } from '@/engine/engine';
import { GameState } from '@/entity/GameState';

export interface SoundAdapter {
    playSound: (soundId: string) => void;
}

export const SoundEffectSystem = (soundAdapter: SoundAdapter): System => {
    return (state: GameState, event: Event): Command[] => {
        const commands: Command[] = [];

        if (event.type === 'PLAYER_HIT') {
            commands.push(() => {
                soundAdapter.playSound('hit-sound');
                return state;
            });
        }

        return commands;
    };
};
```

## Events

Located in `src/events/`, events represent occurrences that systems can respond to.

```typescript
// src/events/InputEvents.ts

export interface KeyPressEvent {
    type: SystemEventType.KeyPress; # Reference to an enum defining event types
    payload: {
        key: string;
    };
}

export interface MouseClickEvent {
    type: SystemEventType.MouseClick;
    payload: {
        x: number;
        y: number;
    };
}
```

## Adapters

Located in `src/adapters/`, adapters interface with external systems like PixiJS for rendering and sound.

```typescript
// src/adapters/PixiStageAdapter.ts

import * as PIXI from 'pixi.js';
import { StageAdapter } from '@/systems/RenderingSystem';
import { ComponentFactory } from '@/components/ComponentFactory';

export class PixiStageAdapter implements StageAdapter {
    private app: PIXI.Application;
    private entities: Record<string, PIXI.DisplayObject> = {};

    constructor(app: PIXI.Application) {
        this.app = app;
    }

    createEntity(id: string, componentId: string): void {
        const displayObject = ComponentFactory.createComponent(componentId);
        this.entities[id] = displayObject;
        this.app.stage.addChild(displayObject);
    }

    attachEntity(id: string, parentId: string): void {
        const entity = this.entities[id];
        const parent = this.entities[parentId];
        if (entity && parent) {
            parent.addChild(entity);
        }
    }

    sweepEntities(existingEntityIds: Set<string>): void {
        for (const id in this.entities) {
            if (!existingEntityIds.has(id)) {
                const entity = this.entities[id];
                this.app.stage.removeChild(entity);
                entity.destroy();
                delete this.entities[id];
            }
        }
    }
}
```
