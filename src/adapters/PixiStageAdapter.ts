import type { Application, Container, Texture } from "pixi.js";

import { Score } from "@/components/Score";
import type { ScoreEntity } from "@/entity/GameState";
import type { StageAdapter } from "@/systems/ScoreSystem";

export class PixiStageAdapter implements StageAdapter {
  private app: Application;
  private components: Record<string, Container> = {};
  private textures: Record<string, Texture>;

  constructor(app: Application, textures: Record<string, Texture>) {
    this.app = app;
    this.textures = textures;
  }

  updateScore(entity: ScoreEntity): void {
    // Get or create Score component
    let component = this.components[entity.id];
    if (!component) {
      component = new Score(this.textures);
      this.components[entity.id] = component;
      this.app.stage.addChild(component);
    }

    // Sync component with entity
    (component as Score).sync(entity);
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
