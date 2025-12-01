import type { Command, Event, System } from "@/engine/engine";
import type { Bird } from "@/entity/Bird";
import { createBird } from "@/entity/Bird";
import type { GameState } from "@/entity/GameState";

// Physics constants
const GRAVITY = 800; // pixels/second²
const FLAP_VELOCITY = -300; // pixels/second (upward)
const MAX_ROTATION_DOWN = Math.PI / 2; // 90 degrees
const MAX_ROTATION_UP = -Math.PI / 7.2; // -25 degrees
const TERMINAL_VELOCITY = 400; // pixels/second

// Adapter interface defined in system (dependency inversion principle)
export interface StageAdapter {
  updateBird(entity: Bird): void;
  removeEntity(id: string): void;
}

export const PhysicsSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === "CREATE_BIRD") {
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

    if (event.type === "BIRD_FLAP") {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "bird") {
        const bird = entity as Bird;
        // Only allow flapping if the bird is alive
        if (bird.isAlive) {
          commands.push((state) => {
            const currentState = state as GameState;
            const updatedEntity: Bird = {
              ...bird,
              velocity: { x: bird.velocity.x, y: FLAP_VELOCITY },
              animationFrame: (bird.animationFrame + 1) % 3,
            };

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

    if (event.type === "TICK") {
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

              const updatedEntity: Bird = {
                ...bird,
                velocity: { x: bird.velocity.x, y: newVelocityY },
                position: newPosition,
                rotation: newRotation,
              };

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

    if (event.type === "KILL_BIRD") {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "bird") {
        commands.push((state) => {
          const currentState = state as GameState;
          const bird = entity as Bird;
          const updatedEntity: Bird = {
            ...bird,
            isAlive: false,
          };

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

    if (event.type === "REMOVE_BIRD") {
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
