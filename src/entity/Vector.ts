/**
 * Vector is a value object representing a two-dimensional coordinate or directional value.
 * It is commonly used for positions, velocities, and other spatial properties in the game.
 *
 * Vector is immutable - any operations that modify a vector should return a new Vector
 * instance rather than mutating the existing one.
 */
export interface Vector {
  x: number;
  y: number;
}

/**
 * Creates a new Vector with the specified x and y components.
 */
export function createVector(x: number, y: number): Vector {
  return { x, y };
}

/**
 * Creates a new Vector with the same x and y values as an existing Vector.
 */
export function copyVector(vector: Vector): Vector {
  return { x: vector.x, y: vector.y };
}

/**
 * Creates a new Vector by adding the components of two vectors together.
 */
export function addVectors(a: Vector, b: Vector): Vector {
  return { x: a.x + b.x, y: a.y + b.y };
}

/**
 * Creates a new Vector by subtracting the components of one vector from another.
 */
export function subtractVectors(a: Vector, b: Vector): Vector {
  return { x: a.x - b.x, y: a.y - b.y };
}

/**
 * Creates a new Vector by multiplying both components by a scalar value.
 */
export function scaleVector(vector: Vector, scalar: number): Vector {
  return { x: vector.x * scalar, y: vector.y * scalar };
}
