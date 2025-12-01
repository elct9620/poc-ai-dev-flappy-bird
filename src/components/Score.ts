import { Container, Sprite, Texture } from "pixi.js";

import type { Score as ScoreEntity } from "@/entity/Score";

export class Score extends Container {
  private textures: Record<string, Texture>;
  private currentValue: number = -1;
  private digitSprites: Sprite[] = [];

  constructor(textures: Record<string, Texture>) {
    super();
    this.textures = textures;
  }

  sync(entity: ScoreEntity): void {
    // Update position and scale
    this.position.set(entity.position.x, entity.position.y);
    this.scale.set(entity.scale);

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
