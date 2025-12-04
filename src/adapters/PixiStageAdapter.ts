import type { Application, Container, Texture } from "pixi.js";

import { Background as BackgroundComponent } from "@/components/Background";
import { Bird as BirdComponent } from "@/components/Bird";
import { Score as ScoreComponent } from "@/components/Score";
import type { Background } from "@/entity/Background";
import type { Bird } from "@/entity/Bird";
import type { Score } from "@/entity/Score";
import type { StageAdapter } from "@/systems/StageAdapter";

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
  private backgroundTexture: Texture;

  constructor(
    app: Application,
    numberTextures: Record<string, Texture>,
    birdTextures: Texture[],
    backgroundTexture: Texture,
  ) {
    this.app = app;
    this.numberTextures = numberTextures;
    this.birdTextures = birdTextures;
    this.backgroundTexture = backgroundTexture;
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

  updateBackground(entity: Background): void {
    try {
      // Get or create Background component
      let component = this.components[entity.id];
      if (!component) {
        component = new BackgroundComponent(
          this.backgroundTexture,
          this.app.screen.width,
          this.app.screen.height,
        );
        this.components[entity.id] = component;
        // Add background at the back (index 0) so it renders behind everything
        this.app.stage.addChildAt(component, 0);
      }

      // Sync component with entity
      (component as BackgroundComponent).sync(entity);
    } catch (error) {
      console.error(`Error updating background ${entity.id}:`, error);
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
