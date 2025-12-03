# AnimationSystem

The AnimationSystem is responsible for managing sprite-based animations for game entities. It handles frame timing and cycling to create smooth visual animations independent of physics or input systems.

## Commands

### Advance Bird Animation Frame Command

During each TICK event, updates the bird's animation frame to cycle through wing flapping sprites. The animation runs continuously while the bird is alive, creating a flapping effect.

**Timing:**
- Animation frame advances every **8 game ticks** (approximately 133ms at 60fps)
- Cycles through frames: 0 → 1 → 2 → 0 (repeat)
- Frame 0: `yellowbird-downflap.png`
- Frame 1: `yellowbird-midflap.png`
- Frame 2: `yellowbird-upflap.png`

**Behavior:**
- Maintains an internal frame counter that increments on each TICK
- When counter reaches 8, advances to the next animation frame
- Resets counter to 0 after advancing frame
- Wraps animation frame from 2 back to 0 for continuous looping
- Only animates if bird's `isAlive` property is true

**State Updates:**
Returns a command that updates the bird entity's `animationFrame` property (0-2) based on the elapsed time since the last frame change.

## Animation Constants

- **Frame Duration**: 8 ticks (~133ms at 60fps)
- **Total Frames**: 3 frames per cycle
- **Animation Speed**: ~7.5 frames per second
- **Cycle Duration**: 24 ticks (~400ms at 60fps)

## Design Rationale

### Separation of Concerns

Animation logic is separated from PhysicsSystem to follow the Single Responsibility Principle:
- **PhysicsSystem**: Handles position, velocity, gravity, and rotation
- **AnimationSystem**: Handles visual frame timing and cycling

This separation ensures:
1. Animation runs independently of physics calculations
2. Animation timing is consistent regardless of bird movement
3. Future animations (death, start screen, etc.) can be added without modifying physics
4. Each system has a clear, focused responsibility

### Continuous Animation

The bird's wing animation runs **continuously during gameplay**, not just when the player inputs a flap command. This design decision:
1. Matches the original Flappy Bird game behavior
2. Provides constant visual feedback that the game is running
3. Makes the bird feel more alive and dynamic
4. The animation frames (`yellowbird-*.png`) are sequential animation sprites, not state-based images

### Frame Timing

The 8-tick (133ms) frame duration provides:
- Smooth, visible wing movement
- Perceptible animation that's not too fast or too slow
- Consistent animation speed across different game states
- Approximately 2.5 full flap cycles per second

## Adapter Interface

The AnimationSystem depends on a `StageAdapter` interface for rendering coordination:

- `updateBird(entity: Bird): void` - Update visual representation with new animation frame

This follows the dependency inversion principle, allowing the system to remain framework-agnostic while coordinating with PixiJS through adapters.
