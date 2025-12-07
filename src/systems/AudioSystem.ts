import { POINT_SOUND, WING_FLAP_SOUND } from "@/constants";
import type { Command, System } from "@/engine/engine";
import { GameEventType, type Event } from "@/events";
import type { AudioAdapter } from "@/systems/AudioAdapter";

/**
 * AudioSystem
 *
 * Handles game audio playback for sound effects and background music.
 * Listens for game events that require audio feedback and plays appropriate sounds.
 *
 * @see {@link ../../docs/design/system/audio_system.md|Audio System Design Document}
 */
export const AudioSystem = (adapter: AudioAdapter): System => {
  return (_state, event: Event): Command[] => {
    // Play wing sound when bird flaps
    if (event.type === GameEventType.BirdFlap) {
      adapter.playSound(WING_FLAP_SOUND);
    }

    // Play point sound when score increments
    if (event.type === GameEventType.IncrementScore) {
      adapter.playSound(POINT_SOUND);
    }

    return [];
  };
};
