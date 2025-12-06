import { AnimatedSprite, Container, Texture } from "pixi.js";

import type { Bird as BirdEntity } from "@/entity/Bird";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Bird component is responsible for visually representing the player character
 * using animated sprites. It displays the bird with appropriate position, rotation,
 * and wing flapping animation based on the bird entity's state.
 *
 * The component uses PixiJS AnimatedSprite to manage wing flapping animation
 * internally, cycling through frames continuously without relying on entity state.
 *
 * Scale is calculated using ScaleCalculator for responsive rendering.
 *
 * @see {@link ../../docs/design/component/bird.md|Bird Component Design Document}
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class Bird extends Container {
  private sprite: AnimatedSprite;

  constructor(textures: Texture[], scaleCalculator: ScaleCalculator) {
    super();

    // Create AnimatedSprite with all three frames
    this.sprite = new AnimatedSprite(textures);
    // Set anchor to center for proper rotation
    this.sprite.anchor.set(0.5, 0.5);
    // Apply base scale to match background scaling
    const scale = scaleCalculator.getBaseScale();
    this.sprite.scale.set(scale, scale);
    // Set animation speed: 8 ticks per frame at 60fps = 0.133 frames per tick
    // AnimationSpeed is in frames per tick, so 1/8 ≈ 0.125
    this.sprite.animationSpeed = 0.125;
    // Start playing the animation loop
    this.sprite.play();

    this.addChild(this.sprite);
  }

  sync(entity: BirdEntity): void {
    // Update position
    this.position.set(entity.position.x, entity.position.y);

    // Update rotation
    this.rotation = entity.rotation;

    // Control animation based on alive status
    if (entity.isAlive && !this.sprite.playing) {
      this.sprite.play();
    } else if (!entity.isAlive && this.sprite.playing) {
      this.sprite.stop();
    }

    // Update visibility based on isAlive
    this.visible = entity.isAlive;
  }
}
