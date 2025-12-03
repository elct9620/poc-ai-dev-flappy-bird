import type { Command, System } from "@/engine/engine";
import type { Bird } from "@/entity/Bird";
import {
  createBird,
  setBirdAlive,
  updateBirdFrame,
  updateBirdPosition,
  updateBirdRotation,
  updateBirdVelocity,
} from "@/entity/Bird";
import type { GameState } from "@/entity/GameState";
import { GameEventType, SystemEventType, type Event } from "@/events";

// Physics constants (per design document: docs/design/system/physics_system.md)
// Values in frame-based units for PixiJS deltaTime (1.0 = one frame at 60fps)
const GRAVITY = 0.08; // pixels/frame² (downward acceleration)
const FLAP_VELOCITY = -3; // pixels/frame (upward velocity applied on flap)
const MAX_ROTATION_DOWN = Math.PI / 2; // 90 degrees (maximum downward tilt)
const MAX_ROTATION_UP = -Math.PI / 7.2; // -25 degrees (maximum upward tilt)
const TERMINAL_VELOCITY = 1; // pixels/frame (maximum falling speed)

// Adapter interface defined in system (dependency inversion principle)
export interface StageAdapter {
  updateBird(entity: Bird): void;
  removeEntity(id: string): void;
}

export const PhysicsSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === GameEventType.CreateBird) {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity = createBird(event.payload.id, event.payload.position);

        // Update adapter immediately after state update
        adapter.updateBird(newEntity);

        return {
          ...currentState,
          entities: {
            ...currentState.entities,
            [event.payload.id]: newEntity,
          },
        };
      });
    }

    if (event.type === GameEventType.BirdFlap) {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "bird") {
        const bird = entity as Bird;
        // Only allow flapping if the bird is alive
        if (bird.isAlive) {
          commands.push((state) => {
            const currentState = state as GameState;
            let updatedEntity = updateBirdVelocity(bird, {
              x: bird.velocity.x,
              y: FLAP_VELOCITY,
            });
            updatedEntity = updateBirdFrame(
              updatedEntity,
              (bird.animationFrame + 1) % 3,
            );

            // Update adapter immediately
            adapter.updateBird(updatedEntity);

            return {
              ...currentState,
              entities: {
                ...currentState.entities,
                [event.payload.id]: updatedEntity,
              },
            };
          });
        }
      }
    }

    if (event.type === SystemEventType.Tick) {
      const deltaTime = event.payload.deltaTime;

      // Apply physics to all birds
      for (const entityId in gameState.entities) {
        const entity = gameState.entities[entityId];
        if (entity.type === "bird") {
          const bird = entity as Bird;
          if (bird.isAlive) {
            commands.push((state) => {
              const currentState = state as GameState;

              // Apply gravity
              let newVelocityY = bird.velocity.y + GRAVITY * deltaTime;
              // Clamp to terminal velocity
              if (newVelocityY > TERMINAL_VELOCITY) {
                newVelocityY = TERMINAL_VELOCITY;
              }

              // Update position
              const newPosition = {
                x: bird.position.x + bird.velocity.x * deltaTime,
                y: bird.position.y + newVelocityY * deltaTime,
              };

              // Update rotation based on velocity
              let newRotation: number;
              if (newVelocityY < 0) {
                // Moving upward - tilt up
                newRotation = MAX_ROTATION_UP;
              } else {
                // Falling - tilt down proportionally
                const rotationRatio = Math.min(
                  newVelocityY / TERMINAL_VELOCITY,
                  1,
                );
                newRotation = rotationRatio * MAX_ROTATION_DOWN;
              }

              let updatedEntity = updateBirdVelocity(bird, {
                x: bird.velocity.x,
                y: newVelocityY,
              });
              updatedEntity = updateBirdPosition(updatedEntity, newPosition);
              updatedEntity = updateBirdRotation(updatedEntity, newRotation);

              // Update adapter immediately
              adapter.updateBird(updatedEntity);

              return {
                ...currentState,
                entities: {
                  ...currentState.entities,
                  [entityId]: updatedEntity,
                },
              };
            });
          }
        }
      }
    }

    if (event.type === GameEventType.KillBird) {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "bird") {
        commands.push((state) => {
          const currentState = state as GameState;
          const bird = entity as Bird;
          const updatedEntity = setBirdAlive(bird, false);

          // Update adapter immediately
          adapter.updateBird(updatedEntity);

          return {
            ...currentState,
            entities: {
              ...currentState.entities,
              [event.payload.id]: updatedEntity,
            },
          };
        });
      }
    }

    if (event.type === GameEventType.RemoveBird) {
      commands.push((state) => {
        const currentState = state as GameState;
        const { [event.payload.id]: removed, ...remaining } =
          currentState.entities;

        // Remove from adapter
        adapter.removeEntity(event.payload.id);

        return {
          ...currentState,
          entities: remaining,
        };
      });
    }

    return commands;
  };
};
