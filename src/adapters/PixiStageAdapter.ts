import type { Application, Container, Texture } from "pixi.js";

import { Bird as BirdComponent } from "@/components/Bird";
import { Score as ScoreComponent } from "@/components/Score";
import type { Bird } from "@/entity/Bird";
import type { Score } from "@/entity/Score";
import type { StageAdapter } from "@/systems/ScoreSystem";

/**
 * PixiStageAdapter bridges game entities with PixiJS rendering.
 * Manages visual component lifecycle and synchronization between
 * game state and PixiJS display objects.
 *
 * This adapter implements the StageAdapter interface, providing
 * a concrete implementation for rendering entities using PixiJS.
 */
export class PixiStageAdapter implements StageAdapter {
  private app: Application;
  private components: Record<string, Container> = {};
  private numberTextures: Record<string, Texture>;
  private birdTextures: Texture[];

  constructor(
    app: Application,
    numberTextures: Record<string, Texture>,
    birdTextures: Texture[],
  ) {
    this.app = app;
    this.numberTextures = numberTextures;
    this.birdTextures = birdTextures;
  }

  updateScore(entity: Score): void {
    try {
      // Get or create Score component
      let component = this.components[entity.id];
      if (!component) {
        component = new ScoreComponent(this.numberTextures);
        this.components[entity.id] = component;
        this.app.stage.addChild(component);
      }

      // Sync component with entity
      (component as ScoreComponent).sync(entity);
    } catch (error) {
      console.error(`Error updating score ${entity.id}:`, error);
    }
  }

  updateBird(entity: Bird): void {
    try {
      // Get or create Bird component
      let component = this.components[entity.id];
      if (!component) {
        component = new BirdComponent(this.birdTextures);
        this.components[entity.id] = component;
        this.app.stage.addChild(component);
      }

      // Sync component with entity
      // AnimatedSprite manages its own animation timing internally
      (component as BirdComponent).sync(entity);
    } catch (error) {
      console.error(`Error updating bird ${entity.id}:`, error);
    }
  }

  removeEntity(id: string): void {
    try {
      const component = this.components[id];
      if (!component) {
        console.warn(`Component ${id} not found for removal`);
        return;
      }
      this.app.stage.removeChild(component);
      component.destroy();
      delete this.components[id];
    } catch (error) {
      console.error(`Error removing entity ${id}:`, error);
    }
  }
}
