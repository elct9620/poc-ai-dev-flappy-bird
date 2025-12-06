import type { Entity } from "@/entity/GameState";

/**
 * StageAdapter interface for rendering system integration.
 * Defines the contract between game systems and the rendering adapter.
 *
 * This interface follows the Dependency Inversion Principle, allowing systems
 * to depend on abstractions rather than concrete implementations.
 *
 * The generic update() method uses the factory pattern internally to dispatch
 * entity updates to appropriate renderers based on entity type, eliminating
 * the need for type-specific methods.
 */
export interface StageAdapter {
  /**
   * Update or create a renderer for the given entity.
   * @param entity The entity to render
   */
  update(entity: Entity): void;

  /**
   * Remove an entity's renderer from the stage.
   * @param id The entity ID to remove
   */
  removeEntity(id: string): void;

  /**
   * Get the current screen dimensions.
   * @returns Object containing width and height in pixels
   */
  getScreenDimensions(): { width: number; height: number };
}
