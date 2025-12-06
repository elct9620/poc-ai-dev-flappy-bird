# Design Rubric

This document outlines the criteria for evaluating the quality of design document. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Formatting and Structure (1 point)

The design document should follow template structure and formatting guidelines.

For example:

- The `entity` should strictly follow `docs/tmplates/entity.md`.
- The `system` should strictly follow `docs/tmplates/system.md`.
- The `renderer` should strictly follow `docs/tmplates/renderer.md`.
- The `event` should strictly follow `docs/tmplates/event.md`.
- The `foundation` should strictly follow `docs/tmplates/foundation.md`.

### Avoid Over-Engineering (1 point)

When creating a design document, ensure that the design is as simple as possible while still meeting requirements.

Depending on the more complex requirements, consider the following:

- Progressive enhancement: start with a simple design and add complexity only as needed.
- YAGNI (You Aren't Gonna Need It): avoid adding features or complexity that are not currently required.
- KISS (Keep It Simple, Stupid): strive for simplicity in design and implementation.

### Clarity and Readability (1 point)

The design document should be clear and easy to understand.

- Use simple and concise language.
- Avoid jargon and technical terms unless necessary, and provide explanations when used.
- Use diagrams or illustrations to explain complex concepts when appropriate.
- Easy to follow to implement the design based on the document.

### Consistency (1 point)

All design documents should maintain a consistent style and format throughout the project.

- Check related design documents for consistency in terminology and structure.
- Ensure that naming conventions are followed consistently.
- Use same style for naming entities, systems, renderers, and events across documents.

### Glossary and Definitions (1 point)

Take care to define any new terms or concepts introduced in the design document.

- Check index of glossary for existing definitions, e.g. `docs/entities.md`, `docs/systems.md`, `docs/renderers.md`, `docs/events.md`, `docs/foundations.md`.
- Ensure that definitions are clear and unambiguous.
- Avoid using undefined terms or jargon without explanation.
- Keep index of glossary up to date with new definitions as needed.

### Cross-Referencing (1 point)

Any document that related to other design documents should include cross-references.

```markdown
This renderer builds upon the [Entity Name](../entity/entity-name.md) to update its state based on game events.
```
