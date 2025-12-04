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

    // Calculate uniform scale to maintain aspect ratio
    // Use the larger scale factor to ensure full screen coverage while preserving proportions
    const scaleX = screenWidth / texture.width;
    const scaleY = screenHeight / texture.height;
    const uniformScale = Math.max(scaleX, scaleY);

    // Apply uniform scaling to both axes for aspect-ratio-preserving tiling
    this.tilingSprite.tileScale.set(uniformScale, uniformScale);

    this.addChild(this.tilingSprite);
  }

  sync(_entity: SceneEntity): void {
    // Ensure visibility when entity exists
    this.visible = true;

    // Update TilingSprite dimensions if screen size changed
    // (In a real implementation, we might get screen size from a global source)
  }
}
