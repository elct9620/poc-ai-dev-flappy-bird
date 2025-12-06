import type { Application, Container, Texture } from "pixi.js";

import type { Background } from "@/entity/Background";
import type { Bird } from "@/entity/Bird";
import type { Ground } from "@/entity/Ground";
import type { Pipe } from "@/entity/Pipe";
import type { Score } from "@/entity/Score";
import { Background as BackgroundRenderer } from "@/renderers/Background";
import { Bird as BirdRenderer } from "@/renderers/Bird";
import { Ground as GroundRenderer } from "@/renderers/Ground";
import { Pipe as PipeRenderer } from "@/renderers/Pipe";
import { Score as ScoreRenderer } from "@/renderers/Score";
import type { StageAdapter } from "@/systems/StageAdapter";
import { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * PixiStageAdapter bridges game entities with PixiJS rendering.
 * Manages visual renderer lifecycle and synchronization between
 * game state and PixiJS display objects.
 *
 * This adapter implements the StageAdapter interface, providing
 * a concrete implementation for rendering entities using PixiJS.
 */
export class PixiStageAdapter implements StageAdapter {
  private app: Application;
  private renderers: Record<string, Container> = {};
  private numberTextures: Record<string, Texture>;
  private birdTextures: Texture[];
  private backgroundTexture: Texture;
  private groundTexture: Texture;
  private pipeTexture: Texture;
  private scaleCalculator: ScaleCalculator;

  constructor(
    app: Application,
    numberTextures: Record<string, Texture>,
    birdTextures: Texture[],
    backgroundTexture: Texture,
    groundTexture: Texture,
    pipeTexture: Texture,
  ) {
    this.app = app;
    this.numberTextures = numberTextures;
    this.birdTextures = birdTextures;
    this.backgroundTexture = backgroundTexture;
    this.groundTexture = groundTexture;
    this.pipeTexture = pipeTexture;
    this.scaleCalculator = new ScaleCalculator(
      app.screen.width,
      app.screen.height,
    );
    // Enable sorting by zIndex
    this.app.stage.sortableChildren = true;
  }

  updateScore(entity: Score): void {
    try {
      // Get or create Score renderer
      let renderer = this.renderers[entity.id];
      if (!renderer) {
        renderer = new ScoreRenderer(this.numberTextures, this.scaleCalculator);
        this.renderers[entity.id] = renderer;
        renderer.zIndex = 200; // Score above all game elements
        this.app.stage.addChild(renderer);
      }

      // Sync renderer with entity
      (renderer as ScoreRenderer).sync(entity);
    } catch (error) {
      console.error(`Error updating score ${entity.id}:`, error);
    }
  }

  updateBird(entity: Bird): void {
    try {
      // Get or create Bird renderer
      let renderer = this.renderers[entity.id];
      if (!renderer) {
        renderer = new BirdRenderer(this.birdTextures, this.scaleCalculator);
        this.renderers[entity.id] = renderer;
        renderer.zIndex = 50; // Bird above pipes but below ground
        this.app.stage.addChild(renderer);
      }

      // Sync renderer with entity
      // AnimatedSprite manages its own animation timing internally
      (renderer as BirdRenderer).sync(entity);
    } catch (error) {
      console.error(`Error updating bird ${entity.id}:`, error);
    }
  }

  updateBackground(entity: Background): void {
    try {
      // Get or create Background renderer
      let renderer = this.renderers[entity.id];
      if (!renderer) {
        renderer = new BackgroundRenderer(
          this.backgroundTexture,
          this.scaleCalculator,
        );
        this.renderers[entity.id] = renderer;
        renderer.zIndex = 0; // Background at the back
        this.app.stage.addChild(renderer);
      }

      // Sync renderer with entity
      (renderer as BackgroundRenderer).sync(entity);
    } catch (error) {
      console.error(`Error updating background ${entity.id}:`, error);
    }
  }

  updateGround(entity: Ground): void {
    try {
      // Get or create Ground renderer
      let renderer = this.renderers[entity.id];
      if (!renderer) {
        renderer = new GroundRenderer(this.groundTexture, this.scaleCalculator);
        this.renderers[entity.id] = renderer;
        renderer.zIndex = 100; // Ground on top to cover pipe bottoms
        this.app.stage.addChild(renderer);
      }

      // Sync renderer with entity
      (renderer as GroundRenderer).sync(entity);
    } catch (error) {
      console.error(`Error updating ground ${entity.id}:`, error);
    }
  }

  updatePipe(entity: Pipe): void {
    try {
      // Get or create Pipe renderer
      let renderer = this.renderers[entity.id];
      if (!renderer) {
        renderer = new PipeRenderer(
          this.pipeTexture,
          this.scaleCalculator,
          entity.isTop,
        );
        this.renderers[entity.id] = renderer;
        renderer.zIndex = 10; // Pipes above background but below ground
        this.app.stage.addChild(renderer);
      }

      // Sync renderer with entity
      (renderer as PipeRenderer).sync(entity);
    } catch (error) {
      console.error(`Error updating pipe ${entity.id}:`, error);
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
    return this.scaleCalculator.getDimensions();
  }
}
