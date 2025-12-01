# Vector

A Vector is a value object representing a two-dimensional coordinate or directional value. It is commonly used for positions, velocities, and other spatial properties in the game.

## Properties

| Name | Type   | Description            |
|------|--------|------------------------|
| x    | number | Horizontal component   |
| y    | number | Vertical component     |

## Mutations

Vector is an immutable value object. Any operations that modify a vector should return a new Vector instance rather than mutating the existing one.

### Create Vector

Creates a new Vector with the specified x and y components.

### Copy Vector

Creates a new Vector with the same x and y values as an existing Vector.

### Add Vectors

Creates a new Vector by adding the components of two vectors together.

### Subtract Vectors

Creates a new Vector by subtracting the components of one vector from another.

### Scale Vector

Creates a new Vector by multiplying both components by a scalar value.
