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
  private isTop: boolean;
  private cachedTexture: Texture | null = null;
  private cachedHeight: number = -1;

  constructor(
    texture: Texture,
    scaleCalculator: ScaleCalculator,
    isTop: boolean,
  ) {
    super();

    this.baseTexture = texture;
    this.isTop = isTop;

    // Create sprite with pipe texture
    this.sprite = new Sprite(texture);

    // Apply scale and anchor once in constructor based on pipe type
    const scale = scaleCalculator.getBaseScale();
    if (isTop) {
      // Top pipes: use bottom anchor (0, 1) and flip vertically with negative Y scale
      // This makes the pipe extend upward from the bottom anchor point
      this.sprite.anchor.set(0, 1);
      this.sprite.scale.set(scale, -scale);
    } else {
      // Bottom pipes: use top anchor (0, 0) and normal orientation
      this.sprite.anchor.set(0, 0);
      this.sprite.scale.set(scale, scale);
    }

    this.addChild(this.sprite);
  }

  sync(entity: PipeEntity): void {
    // Update position
    this.position.set(entity.position.x, entity.position.y);

    // Adjust height by cropping texture (with caching to avoid recreation)
    const originalHeight = 320; // From design doc
    const originalWidth = 52; // From design doc

    if (entity.height < originalHeight) {
      // Only recreate texture if height has changed
      if (this.cachedHeight !== entity.height) {
        // Destroy old cached texture if it exists
        if (this.cachedTexture && this.cachedTexture !== this.baseTexture) {
          this.cachedTexture.destroy(false); // false = don't destroy the source
        }

        // Crop the texture based on height
        let frame: Rectangle;
        if (this.isTop) {
          // For top pipes, crop from the bottom to show the cap at bottom
          const cropY = originalHeight - entity.height;
          frame = new Rectangle(0, cropY, originalWidth, entity.height);
        } else {
          // For bottom pipes, crop from the top to show the cap at top
          frame = new Rectangle(0, 0, originalWidth, entity.height);
        }

        // Create and cache the new texture
        this.cachedTexture = new Texture({
          source: this.baseTexture.source,
          frame,
        });
        this.cachedHeight = entity.height;
      }

      // Use the cached texture
      this.sprite.texture = this.cachedTexture!;
    } else {
      // Use full texture
      this.sprite.texture = this.baseTexture;
      this.cachedHeight = -1;
    }

    // Ensure visibility
    this.visible = true;
  }

  destroy(options?: boolean | { children?: boolean; texture?: boolean }): void {
    // Clean up cached texture
    if (this.cachedTexture && this.cachedTexture !== this.baseTexture) {
      this.cachedTexture.destroy(false);
    }
    super.destroy(options);
  }
}
