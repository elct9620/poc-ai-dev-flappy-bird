import type { Background } from "@/entity/Background";
import type { Bird } from "@/entity/Bird";
import type { Ground } from "@/entity/Ground";
import type { Pipe } from "@/entity/Pipe";
import type { Score } from "@/entity/Score";

/**
 * StageAdapter interface for rendering system integration.
 * Defines the contract between game systems and the rendering adapter.
 *
 * This interface follows the Dependency Inversion Principle, allowing systems
 * to depend on abstractions rather than concrete implementations.
 */
export interface StageAdapter {
  updateScore(entity: Score): void;
  updateBackground(entity: Background): void;
  updateBird(entity: Bird): void;
  updateGround(entity: Ground): void;
  updatePipe(entity: Pipe): void;
  removeEntity(id: string): void;
}
