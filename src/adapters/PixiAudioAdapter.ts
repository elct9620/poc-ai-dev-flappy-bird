import type { AudioAdapter } from "@/adapters/AudioAdapter";

/**
 * PixiAudioAdapter
 *
 * Web Audio API implementation of AudioAdapter for browser-based audio playback.
 *
 * @see {@link ../../docs/design/system/audio_system.md|Audio System Design Document}
 */
export class PixiAudioAdapter implements AudioAdapter {
  private sounds: Map<string, HTMLAudioElement> = new Map();
  private volumes: Map<string, number> = new Map();

  async preloadSound(name: string, path: string): Promise<void> {
    const audio = new Audio(path);
    audio.preload = "auto";

    // Default volume
    this.volumes.set(name, 1.0);
    audio.volume = 1.0;

    // Wait for audio to be loaded
    await new Promise<void>((resolve, reject) => {
      audio.addEventListener("canplaythrough", () => resolve(), { once: true });
      audio.addEventListener(
        "error",
        () => reject(new Error(`Failed to load sound: ${path}`)),
        { once: true },
      );
    });

    this.sounds.set(name, audio);
  }

  playSound(name: string): void {
    const audio = this.sounds.get(name);
    if (!audio) {
      console.warn(`Sound "${name}" not preloaded`);
      return;
    }

    // Clone the audio to allow overlapping playback
    const clone = audio.cloneNode() as HTMLAudioElement;
    const volume = this.volumes.get(name) ?? 1.0;
    clone.volume = volume;
    clone.play().catch((error) => {
      console.error(`Failed to play sound "${name}":`, error);
    });
  }

  stopSound(name: string): void {
    const audio = this.sounds.get(name);
    if (audio) {
      audio.pause();
      audio.currentTime = 0;
    }
  }

  setVolume(name: string, volume: number): void {
    const clampedVolume = Math.max(0, Math.min(1, volume));
    this.volumes.set(name, clampedVolume);

    const audio = this.sounds.get(name);
    if (audio) {
      audio.volume = clampedVolume;
    }
  }
}
