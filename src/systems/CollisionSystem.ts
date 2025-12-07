import {
  BIRD_COLLISION_HEIGHT,
  BIRD_COLLISION_WIDTH,
  GROUND_HEIGHT,
  PIPE_WIDTH,
} from "@/constants";
import type { Command, System } from "@/engine/engine";
import type { EventBus } from "@/engine/eventbus";
import type { Bird } from "@/entity/Bird";
import type { GameState } from "@/entity/GameState";
import type { Pipe } from "@/entity/Pipe";
import { GameEventType, SystemEventType, type Event } from "@/events";
import type { StageAdapter } from "@/systems/StageAdapter";

/**
 * CollisionSystem implements collision detection for the game.
 * It detects collisions between the bird and pipes/ground using AABB collision detection.
 *
 * @see {@link ../../docs/design/system/collision_system.md|CollisionSystem Design Document}
 */
export const CollisionSystem = (
  adapter: StageAdapter,
  eventBus: EventBus,
): System => {
  return (state, event: Event): Command[] => {
    const gameState = state as GameState;
    const commands: Command[] = [];

    if (event.type === SystemEventType.Tick) {
      // Find the bird entity
      const bird = findBird(gameState);

      if (!bird) {
        return commands;
      }

      // Check bird-pipe collision (only if bird is alive)
      if (bird.isAlive) {
        const collidedWithPipe = checkBirdPipeCollision(bird, gameState);

        if (collidedWithPipe) {
          // Dispatch BIRD_COLLISION and KILL_BIRD events in the same tick
          commands.push((state) => {
            eventBus.dispatch({
              type: GameEventType.BirdCollision,
              payload: { id: bird.id },
            });
            eventBus.dispatch({
              type: GameEventType.KillBird,
              payload: { id: bird.id },
            });
            return state;
          });
        }
      }

      // Check bird-ground collision (regardless of bird.isAlive)
      if (checkBirdGroundCollision(bird, adapter)) {
        // Bird has landed
        commands.push((state) => {
          eventBus.dispatch({
            type: GameEventType.BirdLand,
            payload: { id: bird.id },
          });
          return state;
        });
      }
    }

    return commands;
  };
};

/**
 * Find the bird entity in the game state.
 */
function findBird(gameState: GameState): Bird | null {
  for (const entityId in gameState.entities) {
    const entity = gameState.entities[entityId];
    if (entity.type === "bird") {
      return entity as Bird;
    }
  }
  return null;
}

/**
 * Check if the bird collides with any pipe using AABB collision detection.
 */
function checkBirdPipeCollision(bird: Bird, gameState: GameState): boolean {
  const birdBox = getBirdCollisionBox(bird);

  for (const entityId in gameState.entities) {
    const entity = gameState.entities[entityId];
    if (entity.type === "pipe") {
      const pipe = entity as Pipe;
      const pipeBox = getPipeCollisionBox(pipe);

      if (checkAABBCollision(birdBox, pipeBox)) {
        return true;
      }
    }
  }

  return false;
}

/**
 * Check if the bird has landed on the ground.
 */
function checkBirdGroundCollision(bird: Bird, adapter: StageAdapter): boolean {
  // Only check ground collision if bird is already dead
  if (bird.isAlive) {
    return false;
  }

  const screenDimensions = adapter.getScreenDimensions();
  const groundY = screenDimensions.height - GROUND_HEIGHT;

  // Check if bird's bottom edge touches the ground
  // Bird's position is at center, so add half height to get bottom edge
  const birdBottomY = bird.position.y + BIRD_COLLISION_HEIGHT / 2;
  return birdBottomY >= groundY;
}

/**
 * Calculate the bird's collision box using AABB.
 * The collision box is slightly smaller than the sprite for better gameplay feel.
 */
function getBirdCollisionBox(bird: Bird) {
  const halfWidth = BIRD_COLLISION_WIDTH / 2;
  const halfHeight = BIRD_COLLISION_HEIGHT / 2;

  return {
    x: bird.position.x - halfWidth,
    y: bird.position.y - halfHeight,
    width: BIRD_COLLISION_WIDTH,
    height: BIRD_COLLISION_HEIGHT,
  };
}

/**
 * Calculate the pipe's collision box using AABB.
 * The collision box uses the full sprite dimensions.
 * Top pipes extend upward from their position, bottom pipes extend downward.
 */
function getPipeCollisionBox(pipe: Pipe) {
  if (pipe.isTop) {
    // Top pipe: position is at bottom edge, extends upward
    return {
      x: pipe.position.x,
      y: pipe.position.y - pipe.height,
      width: PIPE_WIDTH,
      height: pipe.height,
    };
  } else {
    // Bottom pipe: position is at top edge, extends downward
    return {
      x: pipe.position.x,
      y: pipe.position.y,
      width: PIPE_WIDTH,
      height: pipe.height,
    };
  }
}

/**
 * Check if two AABB boxes collide.
 */
function checkAABBCollision(
  a: { x: number; y: number; width: number; height: number },
  b: { x: number; y: number; width: number; height: number },
): boolean {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}
