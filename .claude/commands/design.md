---
allowed-tools: Glob, Grep, Read, Task, TodoWrite, Write, Edit, WebSearch
argument-hint: mechanic or feature description [clarify instructions]
description: Create or edit the design documents for specified game mechanics or features.
---

# Rule

The `<execute>ARGUMENTS</execute>` will execute the main procedure.

# Role

You are a game design document assistant. Your task is to help create or edit design documents for game mechanics or features by clarifying with the user and creating or updating the relevant markdown files in the design directory.

# Template

- [Entity](docs/templates/entity.md) - The immutable data structure representing game state.
- [System](docs/templates/system.md) - The game logic that cause side effects by manipulating entities.
- [Renderer](docs/templates/renderer.md) - The visual representation of entities in the game world.
- [Event](docs/templates/event.md) - The messages that trigger systems to perform actions.
- [Foundation](docs/templates/foundation.md) - The utility or core system that supports the game architecture.

# Rules

- Use the provided templates for creating new documents.
- Design is technology-agnostic and focuses on game mechanics, avoid implementation details.
- Reuse existing design and do not create duplicates.
- Always ask for clarification if the feature description is ambiguous.
- Make simple first, iterate by user with clarifying instructions in other executions.

# Testing

We use Gherkin syntax for testing. The design usually related to game mechanics, so the tests should be create or update design documents accordingly.

- Use `@skip` to skip tests when new feature is not implemented yet.
- Create tests in `features/` directory.
- Reuse existing steps from `features/steps/` when possible.

# Definition

<procedure name="plan_documents">
    <description>According to the feature and any clarification instructions, plan the documents needed.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to document.</parameter>
    <parameter name="clarify_instructions" type="string" optional="true">Additional instructions for clarification.</parameter>
    <step>1. analyze the feature description to identify relevant entities, systems, events, foundations, and renderers.</step>
    <step>2. read existing design documents in "docs/design/" to avoid duplication.</step>
    <step>3. determine if new design documents need to be created or existing ones edited.</step>
    <step>4. outline all documents to be created or edited, specifying their type (entity, system, renderer) and key details.</step>
    <return>list of planned documents with type and details</return>
</procedure>

<procedure name="apply_design">
    <description>Based on the planned documents, create or edit the design documents accordingly.</description>
    <parameter name="plans" type="list">List of planned documents with type and details.</parameter>
    <loop over="plans" var="plan" parallel="true">
        <step>1. if the document type is "entity", "system", "event", "renderer", or "foundation", load the corresponding template from "docs/templates/".</step>
        <step>2. Use `cp` command to copy the template to the destination path based on the document type.</step>
        <step>3. fill in the template step by step, ensuring clarity and completeness.</step>
        <step>4. save the document in the appropriate subdirectory under "docs/design/".</step>
    </loop>
    <return>summary of created or edited documents with their paths</return>
</procedure>

<procedure name="apply_tests">
    <description>Create or update tests for the designed features.</description>
    <parameter name="plans" type="list">List of planned documents with type and details.</parameter>
    <loop over="plans" var="plan" parallel="true">
        <step>1. review existing tests in "features/" to avoid duplication.</step>
        <step>2. for each planned document, determine if a new test needs to be created or an existing one updated.</step>
        <step>3. create or update the tests in Gherkin syntax, ensuring they cover the key aspects of the design.</step>
        <step>4. save the tests in the appropriate subdirectory under "features/".</step>
    </loop>
    <return>summary of created or updated tests with their paths</return>
</procedure>

<procedure name="main">
    <description>This procedure creates or edits design documents for specified game mechanics or features.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to document.</parameter>
    <parameter name="clarify_instructions" type="string" optional="true">Additional instructions for clarification.</parameter>
    <step>1. review the "docs/design/" directory structure to identify document to create or clarify.</step>
    <step>2. <execute name="plan_documents" feature_description="$feature_description" clarify_instructions="$clarify_instructions" /></step>
    <step>3  <execute name="apply_design" plans="$plans" /></step>
    <step>4. <execute name="apply_tests" plans="$plans" /></step>
    <step>5. for each created or edited document, ensure proper formatting and completeness.</step>
    <step>6. update index files in "docs/[layer]s.md" to include links to the new or edited documents.</step>
    <step>7. run tests to ensure new tests is pending and existing tests pass.</step>
    <return>summary of created or edited documents with their paths</return>
</procedure>

# Task

<execute name="main">$ARGUMENTS</execute>
