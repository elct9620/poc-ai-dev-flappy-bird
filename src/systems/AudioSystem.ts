import type { AudioAdapter } from "@/adapters/AudioAdapter";
import type { Command, System } from "@/engine/engine";
import type { GameState } from "@/entity/GameState";
import { GameEventType, type Event } from "@/events";

/**
 * AudioSystem
 *
 * Handles game audio playback for sound effects and background music.
 * Listens for game events that require audio feedback and plays appropriate sounds.
 *
 * @see {@link ../../docs/design/system/audio_system.md|Audio System Design Document}
 */
export const AudioSystem = (adapter: AudioAdapter): System => {
  return (state: GameState, event: Event): Command[] => {
    // Play wing sound when bird flaps
    if (event.type === GameEventType.BirdFlap) {
      adapter.playSound("wing");
    }

    return [];
  };
};
