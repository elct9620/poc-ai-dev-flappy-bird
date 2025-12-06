import { Container, Texture, TilingSprite } from "pixi.js";

import { ZINDEX_BACKGROUND } from "@/constants";
import type { Background as BackgroundEntity } from "@/entity/Background";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Background renderer displays a tiled background using PixiJS TilingSprite.
 * Scale is calculated using ScaleCalculator for responsive fullscreen rendering.
 * @see {@link ../../docs/design/renderer/background.md|Background Renderer Design Document}
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class Background extends Container {
  private tilingSprite: TilingSprite;

  constructor(texture: Texture, scaleCalculator: ScaleCalculator) {
    super();

    const { width: screenWidth, height: screenHeight } =
      scaleCalculator.getDimensions();

    // Create TilingSprite with the background texture
    this.tilingSprite = new TilingSprite({
      texture,
      width: screenWidth,
      height: screenHeight,
    });

    // Position at origin
    this.tilingSprite.position.set(0, 0);

    // Calculate scale to fit screen height while maintaining aspect ratio
    // Background should fill the height and tile horizontally (X-axis only)
    const scale = scaleCalculator.getFullscreenScale(texture.height);

    // Apply the same scale to both axes to maintain aspect ratio
    // This makes each tile's height match screen height, and width scales proportionally
    this.tilingSprite.tileScale.set(scale, scale);

    this.addChild(this.tilingSprite);

    // Set zIndex for rendering order - Background at the back
    this.zIndex = ZINDEX_BACKGROUND;
  }

  sync(_entity: BackgroundEntity): void {
    // Ensure visibility when entity exists
    this.visible = true;

    // Update TilingSprite dimensions if screen size changed
    // (In a real implementation, we might get screen size from a global source)
  }
}
