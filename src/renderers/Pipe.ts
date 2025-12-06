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
  private baseTexture: Texture;

  constructor(texture: Texture, scaleCalculator: ScaleCalculator) {
    super();

    this.baseTexture = texture;

    // Create sprite with pipe texture
    this.sprite = new Sprite(texture);

    // Apply scale once in constructor
    const scale = scaleCalculator.getBaseScale();
    this.sprite.scale.set(scale, scale);

    this.addChild(this.sprite);
  }

  sync(entity: PipeEntity): void {
    // For top pipes, flip vertically and adjust anchor
    if (entity.isTop) {
      // Anchor at bottom-left (0, 1) so the bottom of the sprite is at position.y
      this.sprite.anchor.set(0, 1);
      // Negative y scale to flip vertically (pipe cap will be at bottom)
      const currentScale = this.sprite.scale.x;
      this.sprite.scale.set(currentScale, -currentScale);
    } else {
      // Bottom pipes use anchor at top-left (0, 0)
      this.sprite.anchor.set(0, 0);
      // Positive y scale (normal orientation)
      const currentScale = this.sprite.scale.x;
      this.sprite.scale.set(currentScale, currentScale);
    }

    // Update position
    this.position.set(entity.position.x, entity.position.y);

    // Adjust height by cropping texture
    const originalHeight = 320; // From design doc
    const originalWidth = 52; // From design doc

    if (entity.height < originalHeight) {
      // Crop the texture based on height
      let frame: Rectangle;
      if (entity.isTop) {
        // For top pipes, crop from the bottom to show the cap at bottom
        const cropY = originalHeight - entity.height;
        frame = new Rectangle(0, cropY, originalWidth, entity.height);
      } else {
        // For bottom pipes, crop from the top to show the cap at top
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
