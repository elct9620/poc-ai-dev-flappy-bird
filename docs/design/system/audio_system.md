# AudioSystem

The AudioSystem is responsible for handling game audio playback, including sound effects and background music. It listens for game events that require audio feedback and plays the appropriate sound files.

## Side Effects

### Play Wing Sound Effect

| Event Triggered | Description                                           |
|-----------------|-------------------------------------------------------|
| BIRD_FLAP       | Player clicks or presses space to make the bird flap  |

When the player provides input to make the bird flap (via mouse click or space key), plays the wing flapping sound effect to provide audio feedback. The sound file is located at `src/assets/soundEffects/wing.ogg` (preferred format) or `wing.wav`.

### Play Hit Sound Effect

| Event Triggered | Description                                    |
|-----------------|------------------------------------------------|
| BIRD_COLLISION  | Bird collides with pipes or ground             |

When the bird collides with an obstacle (pipes or ground), plays the collision/hit sound effect to signal the impact. The sound file is located at `src/assets/soundEffects/hit.ogg` or `hit.wav`.

### Play Death Sound Effect

| Event Triggered | Description                              |
|-----------------|------------------------------------------|
| BIRD_DIED       | Bird dies after collision or falling     |

When the bird dies (after collision or falling off screen), plays the death sound effect. The sound file is located at `src/assets/soundEffects/die.ogg` or `die.wav`.

### Play Point Sound Effect

| Event Triggered | Description                                    |
|-----------------|------------------------------------------------|
| SCORE_INCREASED | Player successfully passes through pipes       |

When the player successfully navigates through a pipe gap and scores a point, plays the scoring sound effect to provide positive feedback. The sound file is located at `src/assets/soundEffects/point.ogg` or `point.wav`.

### Play UI Sound Effect

| Event Triggered | Description                              |
|-----------------|------------------------------------------|
| MENU_NAVIGATE   | Player navigates through menu options    |

When the player interacts with UI elements or navigates through menus, plays the swoosh sound effect. The sound file is located at `src/assets/soundEffects/swoosh.ogg` or `swoosh.wav`.

## Adapter Interface

The AudioSystem depends on an `AudioAdapter` interface for platform-specific audio playback:

- `preloadSound(name: string, path: string): Promise<void>` - Preload a sound file for later playback
- `playSound(name: string): void` - Play a preloaded sound effect
- `stopSound(name: string): void` - Stop a currently playing sound
- `setVolume(name: string, volume: number): void` - Set volume for a specific sound (0.0 to 1.0)

This follows the dependency inversion principle, allowing the system to remain platform-agnostic while working with browser Web Audio API or other audio systems through adapters.
