import { Container, Rectangle, Sprite, Texture } from "pixi.js";

import type { Pipe as PipeEntity } from "@/entity/Pipe";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Pipe renderer provides the visual representation of pipe obstacles.
 * Scale is calculated using ScaleCalculator for responsive rendering.
 * @see {@link ../../docs/design/renderer/pipe.md|Pipe Renderer Design Document}
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class Pipe extends Container {
  private sprite: Sprite;
  private scaleCalculator: ScaleCalculator;
  private baseTexture: Texture;

  constructor(texture: Texture, scaleCalculator: ScaleCalculator) {
    super();

    this.scaleCalculator = scaleCalculator;
    this.baseTexture = texture;

    // Create sprite with pipe texture
    this.sprite = new Sprite(texture);
    this.sprite.anchor.set(0, 0);

    this.addChild(this.sprite);
  }

  sync(entity: PipeEntity): void {
    const scale = this.scaleCalculator.getBaseScale();

    // Apply scale - for top pipes, flip vertically
    this.sprite.scale.set(scale, entity.isTop ? -scale : scale);

    // Update position
    this.position.set(entity.position.x, entity.position.y);

    // Adjust height by cropping texture
    const originalHeight = 320; // From design doc
    const originalWidth = 52; // From design doc

    if (entity.height < originalHeight) {
      // Crop the texture based on height
      let frame: Rectangle;
      if (entity.isTop) {
        // For top pipes, crop from the bottom
        const cropY = originalHeight - entity.height;
        frame = new Rectangle(0, cropY, originalWidth, entity.height);
      } else {
        // For bottom pipes, crop from the top
        frame = new Rectangle(0, 0, originalWidth, entity.height);
      }
      // Create a new texture with the cropped frame
      this.sprite.texture = new Texture({
        source: this.baseTexture.source,
        frame,
      });
    } else {
      // Use full texture
      this.sprite.texture = this.baseTexture;
    }

    // Ensure visibility
    this.visible = true;
  }
}
