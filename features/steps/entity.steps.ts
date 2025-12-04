import { Then } from "quickpickle";
import { expect } from "vitest";

import type { GameWorld } from "../support/world";

/**
 * Shared entity test steps for generic entity verification.
 * These steps work for any entity type (ground, background, score, bird, etc.)
 * to eliminate duplication across entity-specific step files.
 */

// Generic "should have type" step
Then(
  "the {word} {string} should have type {string}",
  (world: GameWorld, _entityType: string, id: string, type: string) => {
    const state = world.getState();
    const entity = state.entities[id];
    expect(entity).toBeDefined();
    expect(entity.type).toBe(type);
  },
);

// Generic existence check
Then(
  "the {word} {string} should exist in the game state",
  (world: GameWorld, entityType: string, id: string) => {
    const state = world.getState();
    expect(state.entities[id]).toBeDefined();
    expect(state.entities[id].type).toBe(entityType);
  },
);

// Generic non-existence check
Then(
  "the {word} {string} should not exist in the game state",
  (world: GameWorld, _entityType: string, id: string) => {
    const state = world.getState();
    expect(state.entities[id]).toBeUndefined();
  },
);
