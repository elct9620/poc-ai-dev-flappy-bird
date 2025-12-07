# AudioSystem

The AudioSystem is responsible for handling game audio playback, including sound effects and background music. It listens for game events that require audio feedback and plays the appropriate sound files.

## Commands

### Play Wing Sound Command

| Event Triggered | Description                                           |
|-----------------|-------------------------------------------------------|
| BIRD_FLAP       | Player clicks or presses space to make the bird flap  |

When the player provides input to make the bird flap (via mouse click or space key), plays the wing flapping sound effect to provide audio feedback. The sound file is located at `src/assets/soundEffects/wing.ogg` (preferred format) or `wing.wav`.

### Play Point Sound Command

| Event Triggered | Description                                           |
|-----------------|-------------------------------------------------------|
| [INCREMENT_SCORE](../event/increment_score.md) | Player successfully passes through a pipe pair |

When the player successfully passes through a pipe pair and the score increments, plays the point scoring sound effect to provide audio feedback. The sound file is located at `src/assets/soundEffects/point.ogg`.

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
