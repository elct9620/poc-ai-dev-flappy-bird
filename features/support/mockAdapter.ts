import type { Bird } from "@/entity/Bird";
import type { Score } from "@/entity/Score";
import type { StageAdapter } from "@/systems/ScoreSystem";

export class MockStageAdapter implements StageAdapter {
  public updateScoreCalls: Score[] = [];
  public updateBirdCalls: Bird[] = [];
  public removeEntityCalls: string[] = [];

  updateScore(entity: Score): void {
    this.updateScoreCalls.push(entity);
  }

  updateBird(entity: Bird): void {
    this.updateBirdCalls.push(entity);
  }

  removeEntity(id: string): void {
    this.removeEntityCalls.push(id);
  }

  reset(): void {
    this.updateScoreCalls = [];
    this.updateBirdCalls = [];
    this.removeEntityCalls = [];
  }
}
