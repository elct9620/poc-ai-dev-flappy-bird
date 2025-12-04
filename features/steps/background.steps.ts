import { GameEventType } from "@/events";
import { Given, When } from "quickpickle";

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
