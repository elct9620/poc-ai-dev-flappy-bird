# AudioSystem

The AudioSystem is responsible for handling game audio playback, including sound effects and background music. It listens for game events that require audio feedback and plays the appropriate sound files.

> **Note**: This is a design-only document. Some events referenced below (BIRD_COLLISION, BIRD_DIED, SCORE_INCREASED, MENU_NAVIGATE) are not yet defined in the codebase and will be added during implementation.

## Commands

### Play Wing Sound Command

| Event Triggered | Description                                           |
|-----------------|-------------------------------------------------------|
| BIRD_FLAP       | Player clicks or presses space to make the bird flap  |

When the player provides input to make the bird flap (via mouse click or space key), plays the wing flapping sound effect to provide audio feedback. The sound file is located at `src/assets/soundEffects/wing.ogg` (preferred format) or `wing.wav`.

### Play Hit Sound Command

| Event Triggered | Description                                    |
|-----------------|------------------------------------------------|
| BIRD_COLLISION  | Bird collides with pipes or ground             |

When the bird collides with an obstacle (pipes or ground), plays the collision/hit sound effect to signal the impact. The sound file is located at `src/assets/soundEffects/hit.ogg` or `hit.wav`.

> **Note**: BIRD_COLLISION event is not yet defined and will be added during implementation.

### Play Death Sound Command

| Event Triggered | Description                              |
|-----------------|------------------------------------------|
| BIRD_DIED       | Bird dies after collision or falling     |

When the bird dies (after collision or falling off screen), plays the death sound effect. The sound file is located at `src/assets/soundEffects/die.ogg` or `die.wav`.

> **Note**: BIRD_DIED event is not yet defined and will be added during implementation.

### Play Point Sound Command

| Event Triggered | Description                                    |
|-----------------|------------------------------------------------|
| SCORE_INCREASED | Player successfully passes through pipes       |

When the player successfully navigates through a pipe gap and scores a point, plays the scoring sound effect to provide positive feedback. The sound file is located at `src/assets/soundEffects/point.ogg` or `point.wav`.

> **Note**: SCORE_INCREASED event is not yet defined and will be added during implementation. The existing INCREMENT_SCORE event may be used instead.

### Play UI Sound Command

| Event Triggered | Description                              |
|-----------------|------------------------------------------|
| MENU_NAVIGATE   | Player navigates through menu options    |

When the player interacts with UI elements or navigates through menus, plays the swoosh sound effect. The sound file is located at `src/assets/soundEffects/swoosh.ogg` or `swoosh.wav`.

> **Note**: MENU_NAVIGATE event is not yet defined and will be added during implementation.

## Adapter Interface

The AudioSystem depends on an `AudioAdapter` interface for platform-specific audio playback:

- `preloadSound(name: string, path: string): Promise<void>` - Preload a sound file for later playback
- `playSound(name: string): void` - Play a preloaded sound effect
- `stopSound(name: string): void` - Stop a currently playing sound
- `setVolume(name: string, volume: number): void` - Set volume for a specific sound (0.0 to 1.0)

### Usage Example

```typescript
// Example usage showing the relationship between preload and play calls:
await adapter.preloadSound('wing', 'src/assets/soundEffects/wing.ogg');
adapter.playSound('wing'); // Must match the preload name
```

### Volume Management

- **Default Volume**: All sounds default to 1.0 (full volume) when preloaded
- **Volume Range**: Volume values range from 0.0 (muted) to 1.0 (full volume)
- **Per-Sound Volume**: Each sound can have its own volume level, allowing different sound types to be balanced independently
- **Volume Persistence**: Volume settings apply to all future playback of that sound until changed

This follows the dependency inversion principle, allowing the system to remain platform-agnostic while working with browser Web Audio API or other audio systems through adapters.
