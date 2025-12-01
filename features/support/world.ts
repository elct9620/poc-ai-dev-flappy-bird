import { Engine } from "@/engine/engine";
import { EventBus } from "@/engine/eventbus";
import { createGameState, type GameState } from "@/entity/GameState";
import { InputSystem } from "@/systems/InputSystem";
import { PhysicsSystem } from "@/systems/PhysicsSystem";
import { ScoreSystem } from "@/systems/ScoreSystem";
import { QuickPickleWorld } from "quickpickle";
import type { TestContext } from "vitest";
import { MockStageAdapter } from "./mockAdapter";

/**
 * GameWorld for testing game systems with QuickPickle
 *
 * Each scenario automatically gets a fresh instance, ensuring test isolation.
 */
export class GameWorld extends QuickPickleWorld {
  public engine: Engine;
  public adapter: MockStageAdapter;
  public eventBus: EventBus;

  constructor(context: TestContext, info: any) {
    super(context, info);

    // Initialize fresh test infrastructure for each scenario
    this.adapter = new MockStageAdapter();
    const state = createGameState();
    this.eventBus = new EventBus();
    this.engine = new Engine(state, this.eventBus, [
      ScoreSystem(this.adapter),
      PhysicsSystem(this.adapter),
      InputSystem(this.eventBus, "bird"),
    ]);
  }

  /**
   * Get a clone of the current game state
   *
   * @returns Cloned GameState to prevent external mutations
   */
  getState(): GameState {
    return this.engine.getState();
  }
}
