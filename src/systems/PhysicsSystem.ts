import {
  BIRD_COLLISION_HEIGHT,
  FLAP_VELOCITY,
  GRAVITY,
  GROUND_TEXTURE_HEIGHT,
  MAX_ROTATION_DOWN,
  MAX_ROTATION_UP,
  REFERENCE_HEIGHT,
  TERMINAL_VELOCITY,
} from "@/constants";
import type { Command, System } from "@/engine/engine";
import type { Bird } from "@/entity/Bird";
import {
  createBird,
  setBirdAlive,
  updateBirdPosition,
  updateBirdRotation,
  updateBirdVelocity,
} from "@/entity/Bird";
import type { GameState } from "@/entity/GameState";
import { GameEventType, SystemEventType, type Event } from "@/events";
import type { StageAdapter } from "@/systems/StageAdapter";

export const PhysicsSystem = (adapter: StageAdapter): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === GameEventType.CreateBird) {
      commands.push((state) => {
        const currentState = state as GameState;
        const newEntity = createBird(event.payload.id, event.payload.position);

        // Update adapter immediately after state update
        adapter.update(newEntity);

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
            const updatedEntity = updateBirdVelocity(bird, {
              x: bird.velocity.x,
              y: FLAP_VELOCITY,
            });

            // Update adapter immediately
            adapter.update(updatedEntity);

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

      // Get screen dimensions once for all bird calculations
      const screenDimensions = adapter.getScreenDimensions();
      // Calculate scaled ground height using same formula as Ground renderer
      const scale = screenDimensions.height / REFERENCE_HEIGHT;
      const scaledGroundHeight = GROUND_TEXTURE_HEIGHT * scale;
      const groundY = screenDimensions.height - scaledGroundHeight;

      // Apply physics to all birds
      for (const entityId in gameState.entities) {
        const entity = gameState.entities[entityId];
        if (entity.type === "bird") {
          const bird = entity as Bird;

          // Calculate new physics values (business logic in system function)
          // Apply gravity
          let newVelocityY = bird.velocity.y + GRAVITY * deltaTime;
          // Clamp to terminal velocity
          if (newVelocityY > TERMINAL_VELOCITY) {
            newVelocityY = TERMINAL_VELOCITY;
          }

          // Update position
          let newPosition = {
            x: bird.position.x + bird.velocity.x * deltaTime,
            y: bird.position.y + newVelocityY * deltaTime,
          };

          // Clamp bird position to ground level and stop movement when it lands
          // Bird's position is at center, so add half height to get bottom edge
          const birdBottomY = newPosition.y + BIRD_COLLISION_HEIGHT / 2;
          if (birdBottomY >= groundY) {
            // Position bird so its bottom edge is exactly at ground level
            newPosition.y = groundY - BIRD_COLLISION_HEIGHT / 2;
            newVelocityY = 0; // Stop falling when bird hits ground
          }

          // Update rotation based on velocity
          let newRotation: number;
          if (newVelocityY < 0) {
            // Moving upward - tilt up
            newRotation = MAX_ROTATION_UP;
          } else {
            // Falling - tilt down proportionally
            const rotationRatio = Math.min(newVelocityY / TERMINAL_VELOCITY, 1);
            newRotation = rotationRatio * MAX_ROTATION_DOWN;
          }

          // Capture calculated values for command closure
          const finalVelocity = { x: bird.velocity.x, y: newVelocityY };
          const finalPosition = newPosition;
          const finalRotation = newRotation;

          // Always apply physics (gravity and position updates) regardless of isAlive status
          // This allows dead birds to fall to the ground
          commands.push((state) => {
            const currentState = state as GameState;

            let updatedEntity = updateBirdVelocity(bird, finalVelocity);
            updatedEntity = updateBirdPosition(updatedEntity, finalPosition);
            updatedEntity = updateBirdRotation(updatedEntity, finalRotation);

            // Update adapter immediately
            adapter.update(updatedEntity);

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

    if (event.type === GameEventType.KillBird) {
      const entity = gameState.entities[event.payload.id];
      if (entity && entity.type === "bird") {
        commands.push((state) => {
          const currentState = state as GameState;
          const bird = entity as Bird;
          const updatedEntity = setBirdAlive(bird, false);

          // Update adapter immediately
          adapter.update(updatedEntity);

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
