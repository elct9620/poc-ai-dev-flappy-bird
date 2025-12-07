import type { Background } from "@/entity/Background";
import type { Bird } from "@/entity/Bird";
import type { Ground } from "@/entity/Ground";
import type { Pipe } from "@/entity/Pipe";
import type { Score } from "@/entity/Score";

/**
 * Base interface for all game entities.
 * Renamed from Entity to IEntity to follow interface naming convention.
 */
export interface IEntity {
  id: string;
  type: string;
}

/**
 * Union of all game entity types.
 * This is the single source of truth for entity types in the game.
 */
export type Entity = Score | Bird | Pipe | Background | Ground;

/**
 * Extract the type property string from an entity type.
 * Uses TypeScript's infer keyword to get the literal type from the discriminant.
 *
 * Example:
 *   EntityTypeName<Pipe> = "pipe"
 *   EntityTypeName<Bird> = "bird"
 */
export type EntityTypeName<T extends Entity> = T extends { type: infer U }
  ? U
  : never;

/**
 * Get entity type by its discriminant property value.
 * This uses TypeScript's conditional types with infer to narrow the union.
 *
 * Example:
 *   EntityByType<"pipe"> = Pipe
 *   EntityByType<"score"> = Score
 */
export type EntityByType<T extends string> = Entity extends infer E
  ? E extends { type: T }
    ? E
    : never
  : never;
