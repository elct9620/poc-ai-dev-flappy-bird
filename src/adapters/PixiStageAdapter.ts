import type { Application } from "pixi.js";

import type { Renderer } from "@/adapters/Renderer";
import type { Entity } from "@/entity/GameState";
import type { RendererFactory } from "@/renderers/RendererFactory";
import type { StageAdapter } from "@/systems/StageAdapter";

/**
 * PixiStageAdapter bridges game entities with PixiJS rendering.
 * Manages visual renderer lifecycle and synchronization between
 * game state and PixiJS display objects.
 *
 * This adapter implements the StageAdapter interface, providing
 * a concrete implementation for rendering entities using PixiJS.
 * Uses the factory pattern to dynamically create renderers based
 * on entity type.
 *
 * @see {@link ../../docs/ARCHITECTURE.md|Architecture Document} (lines 240-278)
 */
export class PixiStageAdapter implements StageAdapter {
  private app: Application;
  private renderers: Record<string, Renderer> = {};
  private rendererFactory: RendererFactory;

  constructor(app: Application, rendererFactory: RendererFactory) {
    this.app = app;
    this.rendererFactory = rendererFactory;
    // Enable sorting by zIndex
    this.app.stage.sortableChildren = true;
  }

  update(entity: Entity): void {
    try {
      // Get or create renderer using factory
      let renderer = this.renderers[entity.id];
      if (!renderer) {
        renderer = this.rendererFactory.createRenderer(entity);
        this.renderers[entity.id] = renderer;
        this.app.stage.addChild(renderer);
      }

      // Sync renderer with entity
      renderer.sync(entity);
    } catch (error) {
      console.error(`Error updating entity ${entity.id}:`, error);
    }
  }

  removeEntity(id: string): void {
    try {
      const renderer = this.renderers[id];
      if (!renderer) {
        console.warn(`Renderer ${id} not found for removal`);
        return;
      }
      this.app.stage.removeChild(renderer);
      renderer.destroy();
      delete this.renderers[id];
    } catch (error) {
      console.error(`Error removing entity ${id}:`, error);
    }
  }

  getScreenDimensions(): { width: number; height: number } {
    return { width: this.app.screen.width, height: this.app.screen.height };
  }
}
