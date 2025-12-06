import { Container, Sprite, Texture } from "pixi.js";

import type { Score as ScoreEntity } from "@/entity/Score";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Score component displays the game score using digit sprites.
 * Scale is calculated using ScaleCalculator for responsive rendering.
 * @see {@link ../../docs/design/component/score.md|Score Component Design Document}
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class Score extends Container {
  private textures: Record<string, Texture>;
  private currentValue: number = -1;
  private digitSprites: Sprite[] = [];

  constructor(
    textures: Record<string, Texture>,
    scaleCalculator: ScaleCalculator,
  ) {
    super();
    this.textures = textures;

    // Apply responsive scale with design factor 2.0
    const scale = scaleCalculator.getResponsiveScale(2.0);
    this.scale.set(scale);
  }

  sync(entity: ScoreEntity): void {
    // Update position (scale is set in constructor)
    this.position.set(entity.position.x, entity.position.y);

    // Rebuild digits only if value changed
    if (this.currentValue !== entity.value) {
      this.rebuildDigits(entity.value, entity.spacing, entity.alignment);
      this.currentValue = entity.value;
    }
  }

  private rebuildDigits(
    value: number,
    spacing: number,
    alignment: "left" | "center" | "right",
  ): void {
    // Clear existing sprites
    for (const sprite of this.digitSprites) {
      this.removeChild(sprite);
      sprite.destroy();
    }
    this.digitSprites = [];

    // Convert value to digit array
    const digits = value.toString().split("");

    // Create sprite for each digit
    let xOffset = 0;
    for (const digit of digits) {
      const texture = this.textures[digit];
      if (texture) {
        const sprite = new Sprite(texture);
        this.digitSprites.push(sprite);
        this.addChild(sprite);
      }
    }

    // Calculate total width for alignment
    const digitWidth = this.digitSprites[0]?.width || 0;
    const totalWidth =
      digits.length * digitWidth + (digits.length - 1) * spacing;

    // Layout sprites with spacing and alignment
    xOffset = 0;
    if (alignment === "center") {
      xOffset = -totalWidth / 2;
    } else if (alignment === "right") {
      xOffset = -totalWidth;
    }

    for (let i = 0; i < this.digitSprites.length; i++) {
      const sprite = this.digitSprites[i];
      sprite.x = xOffset;
      xOffset += sprite.width + spacing;
    }
  }
}
