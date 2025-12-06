/**
 * Centralized scale calculation for responsive sprite rendering.
 * All scales are calculated relative to a reference screen height of 512px
 * (the original Flappy Bird canvas height).
 *
 * @see {@link ../../docs/design/guidelines/scale.md|Scale Guidelines}
 */
export class ScaleCalculator {
  /**
   * Reference height matching original Flappy Bird canvas.
   * All responsive scales are calculated relative to this value.
   */
  private static readonly REFERENCE_HEIGHT = 512;

  constructor(
    private screenWidth: number,
    private screenHeight: number,
  ) {}

  /**
   * Calculate fullscreen fill scale for background elements.
   * Scales the texture to fill the screen height completely.
   *
   * @param textureHeight - The height of the texture in pixels
   * @returns Scale factor to fill screen height
   */
  getFullscreenScale(textureHeight: number): number {
    return this.screenHeight / textureHeight;
  }

  /**
   * Calculate responsive scale with design factor.
   * Used for game objects and UI elements that should scale proportionally
   * with screen size while maintaining a design-specified multiplier.
   *
   * @param designScaleFactor - The base scale factor from design (e.g., 2.0)
   * @returns Responsive scale factor adjusted for current screen height
   */
  getResponsiveScale(designScaleFactor: number): number {
    return (
      (this.screenHeight / ScaleCalculator.REFERENCE_HEIGHT) * designScaleFactor
    );
  }

  /**
   * Get current screen dimensions.
   *
   * @returns Object containing width and height
   */
  getDimensions(): { width: number; height: number } {
    return { width: this.screenWidth, height: this.screenHeight };
  }
}
