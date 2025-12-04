import { GameEventType } from "@/events";
import { Given, When } from "quickpickle";

import type { GameWorld } from "../support/world";

// Given steps
Given("a ground exists with id {string}", (world: GameWorld, id: string) => {
  world.engine.dispatch({
    type: GameEventType.CreateGround,
    payload: { id },
  });
  world.engine.tick({ deltaTime: 0 });
});

// When steps
When("a ground is created with id {string}", (world: GameWorld, id: string) => {
  world.engine.dispatch({
    type: GameEventType.CreateGround,
    payload: { id },
  });
  world.engine.tick({ deltaTime: 0 });
});

When("the ground {string} is removed", (world: GameWorld, id: string) => {
  world.engine.dispatch({
    type: GameEventType.RemoveGround,
    payload: { id },
  });
  world.engine.tick({ deltaTime: 0 });
});
