import type { Entity } from "@/entity/GameState";
import type { AudioAdapter } from "@/systems/AudioAdapter";
import type { StageAdapter } from "@/systems/StageAdapter";

export class MockStageAdapter implements StageAdapter {
  public updateCalls: Entity[] = [];
  public removeEntityCalls: string[] = [];

  update(entity: Entity): void {
    this.updateCalls.push(entity);
  }

  removeEntity(id: string): void {
    this.removeEntityCalls.push(id);
  }

  getScreenDimensions(): { width: number; height: number } {
    // Return mock screen dimensions matching reference height for tests
    return { width: 800, height: 512 };
  }

  reset(): void {
    this.updateCalls = [];
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
