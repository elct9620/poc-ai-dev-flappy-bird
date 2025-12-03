# Adapter Rubric

This document outlines the criteria for evaluating the quality of adapter. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Naming Conventions (1 point)

The adapter is bridge external modules or services with the internal game architecture. The naming conventions should clearly reflect this purpose.

- PixiRendererAdapter - An adapter for integrating Pixi.js rendering engine.
- BrowserAudioAdapter - An adapter for handling audio playback in web browsers.
- LocalStorageAdapter - An adapter for managing game state persistence using browser's local storage.
- PixiInputAdapter - An adapter for handling user input events using Pixi.js.

### Interface Implementation (1 point)

The adapter should implement the defined interfaces to ensure compatibility with the internal game architecture.

```typescript
// src/adapters/PixiRendererAdapter.ts

import { Renderer } from '@/systems/AdapterInterfaces';
import * as PIXI from 'pixi.js';

export class PixiRendererAdapter implements Renderer {
  private app: PIXI.Application;

  constructor(app: PIXI.Application) {
    this.app = app;
  }

  createEntityVisual(entity: Entity): void {
    // Implementation using PIXI to create visual representation
  }

  updateEntityVisual(entity: Entity): void {
    // Implementation using PIXI to update visual representation
  }
}
```

### No Business Logic (1 point)

The adapter should not contain any business logic. Its sole responsibility is to translate between the external module/service and the internal game architecture.

```typescript
// src/adapters/LocalStorageAdapter.ts

import { Persistence } from '@/systems/AdapterInterfaces';
export class LocalStorageAdapter implements Persistence {
  saveGameState(state: GameState): void {
    localStorage.setItem('gameState', JSON.stringify(state));
  }

  loadGameState(): GameState | null {
    const state = localStorage.getItem('gameState');
    return state ? JSON.parse(state) : null;
  }
}
```

### Error Handling (1 point)

The adapter should include robust error handling to manage potential issues when interacting with external modules or services.

```typescript
// src/adapters/BrowserAudioAdapter.ts
import { AudioPlayer } from '@/systems/AdapterInterfaces';

export class BrowserAudioAdapter implements AudioPlayer {
  playSound(soundId: string): void {
    try {
      const audio = new Audio(`/sounds/${soundId}.mp3`);
      audio.play();
    } catch (error) {
      console.error('Error playing sound:', error);
    }
  }
}
```
