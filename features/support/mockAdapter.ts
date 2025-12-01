import type { Score } from "@/entity/Score";
import type { StageAdapter } from "@/systems/ScoreSystem";

export class MockStageAdapter implements StageAdapter {
  public updateScoreCalls: Score[] = [];
  public removeEntityCalls: string[] = [];

  updateScore(entity: Score): void {
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
