import { GameEventType } from "@/events";
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";

import type { GameWorld } from "../support/world";

// Given steps
Given(
  "a background exists with id {string}",
  (world: GameWorld, id: string) => {
    world.engine.dispatch({
      type: GameEventType.CreateBackground,
      payload: { id },
    });
    world.engine.tick({ deltaTime: 0 });
  },
);

// When steps
When(
  "a background is created with id {string}",
  (world: GameWorld, id: string) => {
    world.engine.dispatch({
      type: GameEventType.CreateBackground,
      payload: { id },
    });
    world.engine.tick({ deltaTime: 0 });
  },
);

When("the background {string} is removed", (world: GameWorld, id: string) => {
  world.engine.dispatch({
    type: GameEventType.RemoveBackground,
    payload: { id },
  });
  world.engine.tick({ deltaTime: 0 });
});

// Then steps
Then(
  "the background {string} should exist in the game state",
  (world: GameWorld, id: string) => {
    const state = world.getState();
    expect(state.entities[id]).toBeDefined();
    expect(state.entities[id].type).toBe("background");
  },
);

Then(
  "the background {string} should have type {string}",
  (world: GameWorld, id: string, type: string) => {
    const state = world.getState();
    const entity = state.entities[id];
    expect(entity).toBeDefined();
    expect(entity.type).toBe(type);
  },
);

Then(
  "the background {string} should not exist in the game state",
  (world: GameWorld, id: string) => {
    const state = world.getState();
    expect(state.entities[id]).toBeUndefined();
  },
);
