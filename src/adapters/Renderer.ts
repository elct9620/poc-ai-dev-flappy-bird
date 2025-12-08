/**
 * Base renderer interface for all game entity renderers.
 * @see {@link ../../docs/ARCHITECTURE.md|Architecture - Renderer Pattern}
 */

import type { Container } from "pixi.js";

import type { Entity } from "@/entity/GameState";

/**
 * Base interface for all entity renderers.
 * All renderers must implement the sync method to update their visual state.
 *
 * This interface ensures type safety and consistency across all renderer implementations
 * used by the PixiStageAdapter and RendererFactory.
 *
 * Extends Container to ensure all renderers can be added to the PixiJS stage.
 */
export interface Renderer extends Container {
  /**
   * Synchronize the renderer's visual state with the entity's data.
   * @param entity The entity containing the state to render
   */
  sync(entity: Entity): void;
}
