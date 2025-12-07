import { GROUND_TEXTURE_HEIGHT, REFERENCE_HEIGHT } from "@/constants";

/**
 * Calculates the Y position of the ground based on screen dimensions.
 * Uses the same scaling formula as Ground renderer.
 *
 * @param screenHeight - Screen height in pixels
 * @returns Y coordinate of ground top edge
 */
export function calculateGroundY(screenHeight: number): number {
  const scale = screenHeight / REFERENCE_HEIGHT;
  const scaledGroundHeight = GROUND_TEXTURE_HEIGHT * scale;
  return screenHeight - scaledGroundHeight;
}
