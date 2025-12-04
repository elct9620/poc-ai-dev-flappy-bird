import { Container, Texture, TilingSprite } from "pixi.js";

import type { Ground as GroundEntity } from "@/entity/Ground";

/**
 * Ground component displays a tiled ground using PixiJS TilingSprite.
 * @see {@link ../../docs/design/component/ground.md|Ground Component Design Document}
 */
export class Ground extends Container {
  private tilingSprite: TilingSprite;
  private screenHeight: number;

  constructor(texture: Texture, screenWidth: number, screenHeight: number) {
    super();

    this.screenHeight = screenHeight;

    // Calculate scale to maintain aspect ratio
    // Use screenHeight / textureHeight to ensure proper proportions
    const scale = screenHeight / texture.height;

    // Create TilingSprite with the ground texture
    this.tilingSprite = new TilingSprite({
      texture,
      width: screenWidth,
      height: texture.height,
    });

    // Apply the same scale to both axes to maintain aspect ratio
    this.tilingSprite.tileScale.set(scale, scale);

    // Position at the bottom of the screen
    const groundHeight = texture.height * scale;
    this.tilingSprite.position.set(0, screenHeight - groundHeight);

    this.addChild(this.tilingSprite);
  }

  sync(_entity: GroundEntity): void {
    // Ensure visibility when entity exists
    this.visible = true;

    // Update TilingSprite dimensions if screen size changed
    // (In a real implementation, we might get screen size from a global source)
  }
}
