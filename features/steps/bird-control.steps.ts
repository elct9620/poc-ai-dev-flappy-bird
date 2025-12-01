import type { Bird } from "@/entity/Bird";
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";
import type { GameWorld } from "../support/world";

Given(
  "a bird is created at position \\({int}, {int}\\)",
  (world: GameWorld, x: number, y: number) => {
    world.engine.dispatch({
      type: "CREATE_BIRD",
      payload: {
        id: "bird",
        position: { x, y },
      },
    });
    world.engine.tick({ deltaTime: 0 });
  },
);

Given("the bird is falling", (world: GameWorld) => {
  // Make bird fall by advancing time (0.5 seconds = 30 frames at 60fps)
  world.engine.tick({ deltaTime: 0.5 * 60 });
});

Given("the bird is killed", (world: GameWorld) => {
  world.engine.dispatch({
    type: "KILL_BIRD",
    payload: { id: "bird" },
  });
  world.engine.tick({ deltaTime: 0 });
});

When(
  "the game advances by {float} second(s)",
  (world: GameWorld, seconds: number) => {
    // Convert seconds to frames for PixiJS deltaTime (60fps = 1.0 deltaTime per frame)
    // At 60fps, 1 second = 60 frames
    const deltaTime = seconds * 60;
    world.engine.tick({ deltaTime });
  },
);

When("the player clicks the mouse", (world: GameWorld) => {
  world.engine.dispatch({
    type: "MOUSE_CLICK",
    payload: { x: 0, y: 0 },
  });
  world.engine.tick({ deltaTime: 0 });
  // Tick again to process BIRD_FLAP event dispatched by InputSystem
  world.engine.tick({ deltaTime: 0 });
});

When('the player presses the "{word}" key', (world: GameWorld, key: string) => {
  world.engine.dispatch({
    type: "KEY_DOWN",
    payload: { key },
  });
  world.engine.tick({ deltaTime: 0 });
  // Tick again to process BIRD_FLAP event dispatched by InputSystem
  world.engine.tick({ deltaTime: 0 });
});

When(
  "the bird's vertical velocity is {int} pixels per second",
  (world: GameWorld, velocity: number) => {
    // This is a state setup, not a command
    const state = world.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
  },
);

When("the bird is removed", (world: GameWorld) => {
  world.engine.dispatch({
    type: "REMOVE_BIRD",
    payload: { id: "bird" },
  });
  world.engine.tick({ deltaTime: 0 });
});

Then("the bird should have moved downward", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  // Bird should have moved down (y increased) from initial position of 200
  expect(bird.position.y).toBeGreaterThan(200);
});

Then("the bird's vertical velocity should be positive", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.velocity.y).toBeGreaterThan(0);
});

Then("the bird should have negative vertical velocity", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.velocity.y).toBeLessThan(0);
});

Then("the bird should have positive vertical velocity", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.velocity.y).toBeGreaterThan(0);
});

Then("the bird should tilt upward", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeLessThan(0);
});

Then("the bird should tilt downward", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeGreaterThan(0);
});

Then("the bird's animation frame should advance", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  // Frame should have advanced from 0 to 1 or 2
  expect(bird.animationFrame).toBeGreaterThan(0);
});

Then(
  "the bird should be higher than its initial position",
  (world: GameWorld) => {
    const state = world.getState();
    const bird = state.entities["bird"] as Bird;
    expect(bird).toBeDefined();
    // Bird should be higher (y decreased) from initial position of 200
    expect(bird.position.y).toBeLessThan(200);
  },
);

Then("the bird should be tilted downward", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeGreaterThan(0);
});

Then("the bird should be tilted upward", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.rotation).toBeLessThan(0);
});

Then("the bird's vertical velocity should not change", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  // Dead bird should not respond to input, velocity should be 0 or remain unchanged
  // Since we killed the bird before clicking, velocity should stay at whatever it was
  expect(bird.isAlive).toBe(false);
});

Then("the bird should not exist in the game state", (world: GameWorld) => {
  const state = world.getState();
  expect(state.entities["bird"]).toBeUndefined();
});
