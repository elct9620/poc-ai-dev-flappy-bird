import { Container, Sprite, Texture } from "pixi.js";

import type { Bird as BirdEntity } from "@/entity/Bird";

/**
 * Bird component is responsible for visually representing the player character
 * using animated sprites. It displays the bird with appropriate position, rotation,
 * and wing flapping animation based on the bird entity's state.
 */
export class Bird extends Container {
  private textures: Texture[];
  private sprite: Sprite;
  private currentFrame: number = -1;

  constructor(textures: Texture[]) {
    super();
    this.textures = textures;

    // Create sprite with the first texture (frame 0)
    this.sprite = new Sprite(textures[0]);
    // Set anchor to center for proper rotation
    this.sprite.anchor.set(0.5, 0.5);
    this.addChild(this.sprite);
  }

  sync(entity: BirdEntity): void {
    // Update position
    this.position.set(entity.position.x, entity.position.y);

    // Update rotation
    this.rotation = entity.rotation;

    // Update animation frame
    if (this.currentFrame !== entity.animationFrame) {
      this.sprite.texture = this.textures[entity.animationFrame];
      this.currentFrame = entity.animationFrame;
    }

    // Update visibility based on isAlive
    this.visible = entity.isAlive;
  }
}
