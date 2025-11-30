import { Engine } from "@/engine/engine";
import { createGameState, type GameState } from "@/entity/GameState";
import { ScoreSystem } from "@/systems/ScoreSystem";
import { MockStageAdapter } from "./mockAdapter";

export interface ScoreTestWorld {
  engine: Engine;
  adapter: MockStageAdapter;
  getState: () => GameState;
}

export function createScoreTestWorld(): ScoreTestWorld {
  const adapter = new MockStageAdapter();
  const state = createGameState();
  const engine = new Engine(state, [ScoreSystem(adapter)]);

  return {
    engine,
    adapter,
    getState: () => {
      // Access state by capturing it during a tick
      let capturedState: GameState = state;
      const spy = (currentState: GameState) => {
        capturedState = currentState;
      };

      // Trigger a tick to process any queued events
      // This will execute any pending commands and update state
      const originalTick = engine.tick;
      engine.tick = (ticker) => {
        originalTick.call(engine, ticker);
        // Access private state through type assertion
        capturedState = (engine as any).state;
      };
      engine.tick({ deltaTime: 0 });
      engine.tick = originalTick;

      return capturedState;
    },
  };
}
