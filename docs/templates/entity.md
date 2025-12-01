# [Entity Name]

<!--
    Responsibility
    ===

    The entity is pure data structure representing game state. e.g. Player, Enemy, Item, etc.
-->

Brief description of the entity and its state representation.

## Properties

<!--
  Properties
  ===

  The properties is flatten data structure that represents the state of the entity, if nested is necessary it usually means that another entity or value object should be created.

  - When entity is "entity", the "id" is required.
  - When entity is "value object", do not include "id".
  - Use "type" property as annotation that indicates the visual type of the entity.

  All entity are designed to be immutable and use mutation functions to update their state.
-->

| Name        | Type    | Description              |
|-------------|---------|--------------------------|
| [Property1] | [Type1] | Description of Property1 |
| [Property2] | [Type2] | Description of Property2 |
| ...         | ...     | ...                      |

## Mutations

### [Mutation Name 1]

Description of the mutation and its effect on the entity's state.

### [Mutation Name 2]

Description of the mutation and its effect on the entity's state.
