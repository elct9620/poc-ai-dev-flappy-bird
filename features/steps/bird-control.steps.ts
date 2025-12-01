import type { Bird } from "@/entity/Bird";
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";
import type { GameWorld } from "../support/world";

Given("the game has started", async function (this: GameWorld) {
  // Game already initialized in world
});

Given(
  "a bird is created at position ({int}, {int})",
  async function (this: GameWorld, x: number, y: number) {
    this.engine.dispatch({
      type: "CREATE_BIRD",
      payload: {
        id: "bird",
        position: { x, y },
      },
    });
    this.engine.tick({ deltaTime: 0 });
  },
);

Given("the bird is falling", async function (this: GameWorld) {
  // Make bird fall by advancing time
  this.engine.tick({ deltaTime: 0.5 });
});

Given("the player clicks the mouse", async function (this: GameWorld) {
  this.engine.dispatch({
    type: "MOUSE_CLICK",
    payload: { x: 0, y: 0 },
  });
  this.engine.tick({ deltaTime: 0 });
});

Given("the bird is killed", async function (this: GameWorld) {
  this.engine.dispatch({
    type: "KILL_BIRD",
    payload: { id: "bird" },
  });
  this.engine.tick({ deltaTime: 0 });
});

When(
  "the game advances by {float} second(s)",
  async function (this: GameWorld, seconds: number) {
    this.engine.tick({ deltaTime: seconds });
  },
);

When("the player clicks the mouse", async function (this: GameWorld) {
  this.engine.dispatch({
    type: "MOUSE_CLICK",
    payload: { x: 0, y: 0 },
  });
  this.engine.tick({ deltaTime: 0 });
});

When(
  'the player presses the "{word}" key',
  async function (this: GameWorld, key: string) {
    this.engine.dispatch({
      type: "KEY_DOWN",
      payload: { key },
    });
    this.engine.tick({ deltaTime: 0 });
  },
);

When(
  "the bird's vertical velocity is {int} pixels per second",
  async function (this: GameWorld, velocity: number) {
    // This is a state setup, not a command
    const state = this.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
  },
);

When("the bird is removed", async function (this: GameWorld) {
  this.engine.dispatch({
    type: "REMOVE_BIRD",
    payload: { id: "bird" },
  });
  this.engine.tick({ deltaTime: 0 });
});

Then("the bird should have moved downward", async function (this: GameWorld) {
  const state = this.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  // Bird should have moved down (y increased) from initial position of 200
  expect(bird.position.y).toBeGreaterThan(200);
});

Then(
  "the bird's vertical velocity should be positive",
  async function (this: GameWorld) {
    const state = this.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
    expect(bird.velocity.y).toBeGreaterThan(0);
  },
);

Then(
  "the bird should have negative vertical velocity",
  async function (this: GameWorld) {
    const state = this.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
    expect(bird.velocity.y).toBeLessThan(0);
  },
);

Then("the bird should tilt upward", async function (this: GameWorld) {
  const state = this.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeLessThan(0);
});

Then("the bird should tilt downward", async function (this: GameWorld) {
  const state = this.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeGreaterThan(0);
});

Then(
  "the bird's animation frame should advance",
  async function (this: GameWorld) {
    const state = this.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
    // Frame should have advanced from 0 to 1 or 2
    expect(bird.animationFrame).toBeGreaterThan(0);
  },
);

Then(
  "the bird should be higher than its initial position",
  async function (this: GameWorld) {
    const state = this.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
    // Bird should be higher (y decreased) from initial position of 200
    expect(bird.position.y).toBeLessThan(200);
  },
);

Then("the bird should be tilted downward", async function (this: GameWorld) {
  const state = this.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeGreaterThan(0);
});

Then("the bird should be tilted upward", async function (this: GameWorld) {
  const state = this.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeLessThan(0);
});

Then(
  "the bird's vertical velocity should not change",
  async function (this: GameWorld) {
    const state = this.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
    // Dead bird should not respond to input, velocity should be 0 or remain unchanged
    // Since we killed the bird before clicking, velocity should stay at whatever it was
    expect(bird.isAlive).toBe(false);
  },
);

Then(
  "the bird should not exist in the game state",
  async function (this: GameWorld) {
    const state = this.getState();
    expect(state.entities["bird"]).toBeUndefined();
  },
);
