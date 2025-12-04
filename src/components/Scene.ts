import { Container, Texture, TilingSprite } from "pixi.js";

import type { Scene as SceneEntity } from "@/entity/Scene";

/**
 * Scene component displays a tiled background using PixiJS TilingSprite.
 * @see {@link ../../docs/design/component/scene.md|Scene Component Design Document}
 */
export class Scene extends Container {
  private tilingSprite: TilingSprite;

  constructor(texture: Texture, screenWidth: number, screenHeight: number) {
    super();

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
    const scale = screenHeight / texture.height;

    // Apply the same scale to both axes to maintain aspect ratio
    // This makes each tile's height match screen height, and width scales proportionally
    this.tilingSprite.tileScale.set(scale, scale);

    this.addChild(this.tilingSprite);
  }

  sync(_entity: SceneEntity): void {
    // Ensure visibility when entity exists
    this.visible = true;

    // Update TilingSprite dimensions if screen size changed
    // (In a real implementation, we might get screen size from a global source)
  }
}
