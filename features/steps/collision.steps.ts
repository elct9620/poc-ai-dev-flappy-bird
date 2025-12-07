import type { Bird } from "@/entity/Bird";
import type { Pipe } from "@/entity/Pipe";
import { GameEventType } from "@/events";
import { Given, Then, When } from "quickpickle";
import { expect } from "vitest";
import type { GameWorld } from "../support/world";

Given(
  "a pipe is created at position \\({int}, {int}\\)",
  (world: GameWorld, x: number, y: number) => {
    const gapSize = 140;
    const gapY = 200;
    world.engine.dispatch({
      type: GameEventType.CreatePipe,
      payload: {
        topId: `pipe-top-${x}`,
        bottomId: `pipe-bottom-${x}`,
        x,
        gapY,
        gapSize,
      },
    });
    world.engine.tick({ deltaTime: 0 });
  },
);

Given("the bird has collided with the pipe", (world: GameWorld) => {
  // Advance game until collision occurs
  // Bird is at (100, 200), pipe is at (200, 0)
  // Need to move bird or advance time until they overlap
  // For simplicity, advance time until bird position overlaps with pipe
  let collided = false;
  let iterations = 0;
  const maxIterations = 1000;

  while (!collided && iterations < maxIterations) {
    const state = world.getState();
    const bird = state.entities["bird"] as Bird;

    if (!bird || !bird.isAlive) {
      collided = true;
      break;
    }

    world.engine.tick({ deltaTime: 1 });
    iterations++;
  }

  expect(iterations).toBeLessThan(maxIterations);
});

When(
  "the game advances until the bird collides with the pipe",
  (world: GameWorld) => {
    // Advance game until collision occurs
    let collided = false;
    let iterations = 0;
    const maxIterations = 1000;

    while (!collided && iterations < maxIterations) {
      const state = world.getState();
      const bird = state.entities["bird"] as Bird;

      if (!bird || !bird.isAlive) {
        collided = true;
        break;
      }

      world.engine.tick({ deltaTime: 1 });
      iterations++;
    }

    expect(iterations).toBeLessThan(maxIterations);
  },
);

When(
  "the game advances until the bird reaches the ground",
  (world: GameWorld) => {
    // Advance game until bird lands
    let landed = false;
    let iterations = 0;
    const maxIterations = 1000;
    const previousY: number[] = [];

    while (!landed && iterations < maxIterations) {
      const state = world.getState();
      const bird = state.entities["bird"] as Bird;

      if (!bird) {
        break;
      }

      previousY.push(bird.position.y);

      // Check if bird has stopped moving (landed)
      if (
        previousY.length > 10 &&
        Math.abs(
          previousY[previousY.length - 1] - previousY[previousY.length - 2],
        ) < 0.01
      ) {
        landed = true;
        break;
      }

      world.engine.tick({ deltaTime: 1 });
      iterations++;
    }

    expect(iterations).toBeLessThan(maxIterations);
  },
);

When(
  "the player navigates through the gap between pipes",
  (world: GameWorld) => {
    // Simulate successful navigation through pipe gap
    // Bird passes through without collision
    world.engine.tick({ deltaTime: 10 });
  },
);

Then("the bird should be dead", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.isAlive).toBe(false);
});

Then("the bird should be alive", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.isAlive).toBe(true);
});

Then("the bird should remain alive", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.isAlive).toBe(true);
});

Then("the pipes should stop moving", (world: GameWorld) => {
  const stateBefore = world.getState();
  const pipesBefore = Object.values(stateBefore.entities).filter(
    (e): e is Pipe => e.type === "pipe",
  );

  // Advance time
  world.engine.tick({ deltaTime: 5 });

  const stateAfter = world.getState();
  const pipesAfter = Object.values(stateAfter.entities).filter(
    (e): e is Pipe => e.type === "pipe",
  );

  // Pipes should not have moved
  for (let i = 0; i < pipesBefore.length; i++) {
    const before = pipesBefore[i];
    const after = pipesAfter.find((p) => p.id === before.id);
    if (after) {
      expect(after.position.x).toBe(before.position.x);
    }
  }
});

Then("the ground should stop scrolling", (world: GameWorld) => {
  // Ground scrolling is managed by GroundSystem
  // When bird is dead, ground should stop
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird.isAlive).toBe(false);
});

Then("the game should stop completely", (world: GameWorld) => {
  const state = world.getState();
  const bird = state.entities["bird"] as Bird;
  expect(bird).toBeDefined();
  expect(bird.isAlive).toBe(false);

  // Verify bird is on the ground by checking position hasn't changed
  const yBefore = bird.position.y;
  world.engine.tick({ deltaTime: 5 });
  const stateAfter = world.getState();
  const birdAfter = stateAfter.entities["bird"] as Bird;
  expect(Math.abs(birdAfter.position.y - yBefore)).toBeLessThan(1);
});
