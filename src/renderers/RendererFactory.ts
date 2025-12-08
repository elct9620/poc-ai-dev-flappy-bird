import type { Texture } from "pixi.js";

import type { Renderer } from "@/adapters/Renderer";
import type { Entity, EntityByType, IEntity } from "@/entity/GameState";
import type { ScaleCalculator } from "@/utils/ScaleCalculator";

/**
 * Configuration for creating a renderer for a specific entity type.
 * Generic parameter TEntity allows type-safe renderer creation.
 */
interface RendererConfig<TEntity extends IEntity> {
  /**
   * Factory function to create a renderer instance for the given entity.
   * @param entity The entity to create a renderer for
   * @returns A new renderer instance
   */
  create: (entity: TEntity) => Renderer;
}

/**
 * Factory registry for creating entity renderers.
 * Uses factory pattern to instantiate renderers based on entity type.
 * @see {@link ../../docs/ARCHITECTURE.md|Architecture - Renderer Layer}
 */

/**
 * Factory for creating and configuring entity renderers.
 *
 * This factory centralizes renderer creation logic and configuration,
 * eliminating the need for type-specific methods in the adapter.
 * New entity types can be registered dynamically without changing
 * the adapter interface.
 */
export class RendererFactory {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private registry: Map<string, RendererConfig<any>> = new Map();
  private numberTextures: Record<string, Texture>;
  private birdTextures: Texture[];
  private backgroundTexture: Texture;
  private groundTexture: Texture;
  private pipeTexture: Texture;
  private scaleCalculator: ScaleCalculator;

  constructor(
    numberTextures: Record<string, Texture>,
    birdTextures: Texture[],
    backgroundTexture: Texture,
    groundTexture: Texture,
    pipeTexture: Texture,
    scaleCalculator: ScaleCalculator,
  ) {
    this.numberTextures = numberTextures;
    this.birdTextures = birdTextures;
    this.backgroundTexture = backgroundTexture;
    this.groundTexture = groundTexture;
    this.pipeTexture = pipeTexture;
    this.scaleCalculator = scaleCalculator;
  }

  /**
   * Get resources needed for renderer creation.
   * These getters allow the factory config create functions to access
   * the textures and scale calculator.
   */
  getNumberTextures(): Record<string, Texture> {
    return this.numberTextures;
  }

  getBirdTextures(): Texture[] {
    return this.birdTextures;
  }

  getBackgroundTexture(): Texture {
    return this.backgroundTexture;
  }

  getGroundTexture(): Texture {
    return this.groundTexture;
  }

  getPipeTexture(): Texture {
    return this.pipeTexture;
  }

  getScaleCalculator(): ScaleCalculator {
    return this.scaleCalculator;
  }

  /**
   * Register a renderer configuration for a specific entity type.
   * Uses TypeScript's infer to automatically extract the correct entity type from the string literal.
   * @param entityType The type identifier of the entity (e.g., "score", "bird")
   * @param config The configuration containing the create function
   */
  register<K extends string>(
    entityType: K,
    config: RendererConfig<EntityByType<K>>,
  ): void {
    this.registry.set(entityType, config);
  }

  /**
   * Create a renderer for the given entity using the registered configuration.
   * @param entity The entity to create a renderer for
   * @returns A new renderer instance
   * @throws Error if no renderer is registered for the entity type
   */
  createRenderer(entity: Entity): Renderer {
    const config = this.registry.get(entity.type);
    if (!config) {
      throw new Error(`No renderer registered for entity type: ${entity.type}`);
    }
    // Type assertion is safe here because:
    // 1. Registry is type-safe (register() enforces correct entity types)
    // 2. Runtime check ensures config exists
    // 3. Discriminated union guarantees entity.type correlates to entity structure
    return config.create(entity as EntityByType<typeof entity.type>);
  }
}
