import { Container, Texture, TilingSprite } from "pixi.js";

import type { Ground as GroundEntity } from "@/entity/Ground";

/**
 * Ground component displays a tiled ground using PixiJS TilingSprite.
 * @see {@link ../../docs/design/component/ground.md|Ground Component Design Document}
 */
export class Ground extends Container {
  private tilingSprite: TilingSprite;

  constructor(texture: Texture, screenWidth: number, screenHeight: number) {
    super();

    // Ground should be a strip at the bottom, not fill entire screen
    // Use a fixed scale factor for consistent appearance across screen sizes
    const GROUND_SCALE_FACTOR = 2.0;
    const groundHeight = texture.height * GROUND_SCALE_FACTOR;

    // Create TilingSprite with scaled dimensions
    // The sprite's display area should be the scaled size
    this.tilingSprite = new TilingSprite({
      texture,
      width: screenWidth,
      height: groundHeight,
    });

    // Apply the same scale to both tile axes to maintain aspect ratio
    this.tilingSprite.tileScale.set(GROUND_SCALE_FACTOR, GROUND_SCALE_FACTOR);

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
