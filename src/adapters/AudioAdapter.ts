/**
 * AudioAdapter Interface
 *
 * Platform-agnostic interface for audio playback.
 * Implementations handle browser Web Audio API or other audio systems.
 *
 * @see {@link ../../docs/design/system/audio_system.md|Audio System Design Document}
 */
export interface AudioAdapter {
  /**
   * Preload a sound file for later playback
   * @param name - Identifier for the sound
   * @param path - Path to the sound file
   */
  preloadSound(name: string, path: string): Promise<void>;

  /**
   * Play a preloaded sound effect
   * @param name - Identifier of the sound to play (must match preload name)
   */
  playSound(name: string): void;

  /**
   * Stop a currently playing sound
   * @param name - Identifier of the sound to stop
   */
  stopSound(name: string): void;

  /**
   * Set volume for a specific sound
   * @param name - Identifier of the sound
   * @param volume - Volume level (0.0 to 1.0)
   */
  setVolume(name: string, volume: number): void;
}
