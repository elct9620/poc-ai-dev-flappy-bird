import { Container, Sprite, Texture } from "pixi.js";

import { ZINDEX_PIPE } from "@/constants";
import type { Pipe as PipeEntity } from "@/entity/Pipe";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Pipe renderer provides the visual representation of pipe obstacles.
 * Scale is calculated using ScaleCalculator for responsive rendering.
 *
 * Design: Pipes use full texture height (320px scaled). Off-screen parts are
 * naturally hidden by screen boundaries and ground layer covers the bottom.
 * No Frame cropping or Anchor adjustments needed.
 *
 * @see {@link ../../docs/design/renderer/pipe.md|Pipe Renderer Design Document}
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class Pipe extends Container {
  private sprite: Sprite;

  constructor(
    texture: Texture,
    scaleCalculator: ScaleCalculator,
    isTop: boolean,
  ) {
    super();

    // Create sprite with pipe texture
    this.sprite = new Sprite(texture);

    // Use default anchor (0, 0) for both top and bottom pipes
    this.sprite.anchor.set(0, 0);

    // Apply scale once in constructor
    const scale = scaleCalculator.getBaseScale();

    if (isTop) {
      // Top pipes: flip vertically with negative Y scale
      // Sprite extends downward from position, flipped upside-down
      this.sprite.scale.set(scale, -scale);
    } else {
      // Bottom pipes: normal orientation
      this.sprite.scale.set(scale, scale);
    }

    this.addChild(this.sprite);

    // Set zIndex for rendering order - Pipes above background but below ground
    this.zIndex = ZINDEX_PIPE;
  }

  sync(entity: PipeEntity): void {
    // Update position only - no texture manipulation needed
    this.position.set(entity.position.x, entity.position.y);

    // Ensure visibility
    this.visible = true;
  }
}
