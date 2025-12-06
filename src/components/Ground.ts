import { Container, Texture, TilingSprite } from "pixi.js";

import type { Ground as GroundEntity } from "@/entity/Ground";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Ground component displays a tiled ground using PixiJS TilingSprite.
 * Scale is calculated using ScaleCalculator for responsive rendering.
 * @see {@link ../../docs/design/component/ground.md|Ground Component Design Document}
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class Ground extends Container {
  private tilingSprite: TilingSprite;

  constructor(texture: Texture, scaleCalculator: ScaleCalculator) {
    super();

    const { width: screenWidth, height: screenHeight } =
      scaleCalculator.getDimensions();

    // Ground should be a strip at the bottom, not fill entire screen
    // Use base scale to match background scaling
    const scale = scaleCalculator.getBaseScale();
    const groundHeight = texture.height * scale;

    // Create TilingSprite with scaled dimensions
    // The sprite's display area should be the scaled size
    this.tilingSprite = new TilingSprite({
      texture,
      width: screenWidth,
      height: groundHeight,
    });

    // Apply the same scale to both tile axes to maintain aspect ratio
    this.tilingSprite.tileScale.set(scale, scale);

    // Position at the bottom of the screen
    this.tilingSprite.position.set(0, screenHeight - groundHeight);

    this.addChild(this.tilingSprite);
  }

  sync(_entity: GroundEntity): void {
    // Ensure visibility when entity exists
    this.visible = true;

    // Note: Screen dimensions are currently fixed at construction time.
    // Future: Add resize handler if dynamic screen size changes are needed.
  }
}
