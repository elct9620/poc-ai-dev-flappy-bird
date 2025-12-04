import type { Bird } from "@/entity/Bird";
import type { Scene } from "@/entity/Scene";
import type { Score } from "@/entity/Score";
import type { AudioAdapter } from "@/systems/AudioAdapter";
import type { StageAdapter } from "@/systems/StageAdapter";

export class MockStageAdapter implements StageAdapter {
  public updateScoreCalls: Score[] = [];
  public updateSceneCalls: Scene[] = [];
  public updateBirdCalls: Bird[] = [];
  public removeEntityCalls: string[] = [];

  updateScore(entity: Score): void {
    this.updateScoreCalls.push(entity);
  }

  updateScene(entity: Scene): void {
    this.updateSceneCalls.push(entity);
  }

  updateBird(entity: Bird): void {
    this.updateBirdCalls.push(entity);
  }

  removeEntity(id: string): void {
    this.removeEntityCalls.push(id);
  }

  reset(): void {
    this.updateScoreCalls = [];
    this.updateSceneCalls = [];
    this.updateBirdCalls = [];
    this.removeEntityCalls = [];
  }
}

export class MockAudioAdapter implements AudioAdapter {
  public preloadedSounds: string[] = [];
  public playedSounds: string[] = [];
  public stoppedSounds: string[] = [];
  public volumeSettings: Map<string, number> = new Map();

  async preloadSound(name: string, _path: string): Promise<void> {
    this.preloadedSounds.push(name);
  }

  playSound(name: string): void {
    this.playedSounds.push(name);
  }

  stopSound(name: string): void {
    this.stoppedSounds.push(name);
  }

  setVolume(name: string, volume: number): void {
    this.volumeSettings.set(name, volume);
  }

  reset(): void {
    this.preloadedSounds = [];
    this.playedSounds = [];
    this.stoppedSounds = [];
    this.volumeSettings.clear();
  }
}
