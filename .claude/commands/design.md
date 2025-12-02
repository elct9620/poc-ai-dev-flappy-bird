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

- [Entity](docs/templates/entity.md)
- [System](docs/templates/system.md)
- [Component](docs/templates/component.md)
- [Event](docs/templates/event.md)

# Rules

- Use the provided templates for creating new documents.
- Design is technology-agnostic and focuses on game mechanics, avoid implementation details.
- Reuse existing design and do not create duplicates.
- Always ask for clarification if the feature description is ambiguous.
- Make simple first, iterate by user with clarifying instructions in other executions.

# Cucumber

The `features/` may be modified but unable to pass tests until implementation is done in another execution. Make sure mark pending tests in `features/` after creating or editing design documents.

# Definition

<procedure name="plan_documents">
    <description>According to the feature and any clarification instructions, plan the documents needed.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to document.</parameter>
    <parameter name="clarify_instructions" type="string" optional="true">Additional instructions for clarification.</parameter>
    <step>1. analyze the feature description to identify relevant entities, systems, events, and components.</step>
    <step>2. determine if new design documents need to be created or existing ones edited.</step>
    <step>3. outline all documents to be created or edited, specifying their type (entity, system, component) and key details.</step>
    <return>list of planned documents with type and details</return>
</procedure>

<procedure name="main">
    <description>This procedure creates or edits design documents for specified game mechanics or features.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to document.</parameter>
    <parameter name="clarify_instructions" type="string" optional="true">Additional instructions for clarification.</parameter>
    <step>1. review the "docs/design/" directory structure to identify document to create or clarify.</step>
    <step>2. <execute name="plan_documents" feature_description="$feature_description" clarify_instructions="$clarify_instructions" /></step>
    <loop over="planned_documents" var="doc">
        <step>3. if the document type is "entity", "system", "event", or "component", load the corresponding template from "docs/templates/".</step>
        <step>4. populate the template with details from the planned document.</step>
        <step>5. write the populated template to the appropriate path in "docs/design/[layer_singular]/[item_name].md".</step>
    </loop>
    <step>6. update index files in "docs/[layer]s.md" to include links to the new or edited documents.</step>
    <return>summary of created or edited documents with their paths</return>
</procedure>

# Task

<execute name="main">$ARGUMENTS</execute>
