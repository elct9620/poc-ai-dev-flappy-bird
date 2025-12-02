# Document Index Rubric

This document outlines the criteria for evaluating the quality of index documentation for entities, systems, events, and components. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Index File Structure (1 point)

> Each architectural layer (entities, systems, events, components) must have an index file that provides an overview and links to detailed design documents.

```markdown
# [Layer Name]

This document provides an overview of the [layer type] used in the game and their definitions document.

## [Category]

| Name | Description |
|------|-------------|
| [Item](./design/[layer]/[item].md) | [Brief description] |
```

- Index files should be named after the layer: `entities.md`, `systems.md`, `events.md`, `components.md`
- Must include a header with layer name
- Must include an overview sentence explaining the layer's purpose
- Must use a table format with Name and Description columns
- Entities index may include sub-headers for categories (e.g., "Entity", "Value Objects")

### Consistent Table Format (1 point)

> All index files must use a consistent markdown table structure with Name column containing links to detailed design documents.

```markdown
| Name                                           | Description                        |
|------------------------------------------------|------------------------------------|
| [ScoreSystem](./design/system/score_system.md) | Tracks and updates the game score. |
```

- First column labeled "Name" contains markdown link to design document
- Second column labeled "Description" contains brief description
- Link format: `[DisplayName](./design/[layer]/[filename].md)`
- Table must be properly formatted with alignment separators

### Design Document Path Convention (1 point)

> Detailed design documents must follow a consistent path structure under the `docs/design/` directory.

```markdown
./design/entity/score.md
./design/system/score_system.md
./design/component/score.md
```

- Design documents located at `docs/design/[layer_singular]/[item_name].md`
- Layer name in path must be singular: `entity`, `system`, `component`
- File names should use snake_case for multi-word items
- Links in index files must use relative paths starting with `./design/`

### Descriptive Overview Statement (1 point)

> Each index file must include a clear overview statement that explains the purpose and role of the architectural layer.

```markdown
This document provides an overview of the systems used in the game engine and their definitions.
```

- Overview must appear immediately after the header
- Must mention both the layer type and its context (e.g., "game", "game engine")
- Should use present tense
- Must end with "and their definitions" or "and their definitions document"
