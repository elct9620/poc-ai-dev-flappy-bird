import type { Application, Container, Texture } from "pixi.js";

import { Bird as BirdComponent } from "@/components/Bird";
import { Score as ScoreComponent } from "@/components/Score";
import type { Bird } from "@/entity/Bird";
import type { Score } from "@/entity/Score";
import type { StageAdapter } from "@/systems/ScoreSystem";

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
    // Get or create Score component
    let component = this.components[entity.id];
    if (!component) {
      component = new ScoreComponent(this.numberTextures);
      this.components[entity.id] = component;
      this.app.stage.addChild(component);
    }

    // Sync component with entity
    (component as ScoreComponent).sync(entity);
  }

  updateBird(entity: Bird): void {
    // Get or create Bird component
    let component = this.components[entity.id];
    if (!component) {
      component = new BirdComponent(this.birdTextures);
      this.components[entity.id] = component;
      this.app.stage.addChild(component);
    }

    // Sync component with entity
    (component as BirdComponent).sync(entity);
  }

  removeEntity(id: string): void {
    const component = this.components[id];
    if (component) {
      this.app.stage.removeChild(component);
      component.destroy();
      delete this.components[id];
    }
  }
}
