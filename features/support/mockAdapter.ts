import type { ScoreEntity } from "@/entity/GameState";
import type { StageAdapter } from "@/systems/ScoreSystem";

export class MockStageAdapter implements StageAdapter {
  public updateScoreCalls: ScoreEntity[] = [];
  public removeEntityCalls: string[] = [];

  updateScore(entity: ScoreEntity): void {
    this.updateScoreCalls.push(entity);
  }

  removeEntity(id: string): void {
    this.removeEntityCalls.push(id);
  }

  reset(): void {
    this.updateScoreCalls = [];
    this.removeEntityCalls = [];
  }
}
