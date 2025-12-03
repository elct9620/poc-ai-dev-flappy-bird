import { Container, Sprite, Texture } from "pixi.js";

import type { Bird as BirdEntity } from "@/entity/Bird";

/**
 * Bird component is responsible for visually representing the player character
 * using animated sprites. It displays the bird with appropriate position, rotation,
 * and wing flapping animation based on the bird entity's state.
 *
 * The component manages its own animation state internally, cycling through
 * wing flapping frames continuously without relying on entity state.
 *
 * @see {@link ../../docs/design/component/bird.md|Bird Component Design Document}
 */
export class Bird extends Container {
  private textures: Texture[];
  private sprite: Sprite;
  private currentFrame: number = 0;
  private frameCounter: number = 0;
  private static readonly ANIMATION_FRAME_DURATION = 8; // ticks per frame (~133ms at 60fps)

  constructor(textures: Texture[]) {
    super();
    this.textures = textures;

    // Create sprite with the first texture (frame 0)
    this.sprite = new Sprite(textures[0]);
    // Set anchor to center for proper rotation
    this.sprite.anchor.set(0.5, 0.5);
    this.addChild(this.sprite);
  }

  sync(entity: BirdEntity, deltaTime: number): void {
    // Update position
    this.position.set(entity.position.x, entity.position.y);

    // Update rotation
    this.rotation = entity.rotation;

    // Update animation continuously while bird is alive
    if (entity.isAlive) {
      this.frameCounter += deltaTime;

      // Advance frame when counter reaches duration
      if (this.frameCounter >= Bird.ANIMATION_FRAME_DURATION) {
        this.currentFrame = (this.currentFrame + 1) % 3;
        this.sprite.texture = this.textures[this.currentFrame];
        this.frameCounter -= Bird.ANIMATION_FRAME_DURATION;
      }
    }

    // Update visibility based on isAlive
    this.visible = entity.isAlive;
  }
}
