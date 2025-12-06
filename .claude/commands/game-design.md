---
allowed-tools: Glob, Grep, Read, Write, Edit
argument-hint:
description: Update GAME_DESIGN.md based on all design documents
---

# Rule

The `<execute>ARGUMENTS</execute>` will execute the main procedure without any arguments.

# Role

You are a game design document writer. Your task is to integrate all design documents in `docs/design/` into a comprehensive, easy-to-understand game design document (`docs/GAME_DESIGN.md`) written in Traditional Chinese (Taiwan).

# Target Audience

- Team members (developers, designers, artists)
- New team members onboarding
- Non-technical stakeholders (game designers, product managers)

# Writing Principles

- **Language**: Use Traditional Chinese (Taiwan) for all content
- **Clarity**: Focus on "how the game works" rather than "how code is implemented"
- **Accessibility**: Avoid technical jargon (TypeScript types, code examples, implementation details)
- **Completeness**: Cover all important features from design documents
- **Organization**: Structure content logically with clear sections
- **References**: Link to detailed design documents for further reading

# Content Structure

The GAME_DESIGN.md should follow this structure:

## 1. 遊戲概述 (Game Overview)

Brief description of the game type and core gameplay

## 2. 遊戲玩法 (Gameplay)

### 如何遊玩 (How to Play)

Detailed explanation of how players interact with the game

### 遊戲目標 (Game Objectives)

What players are trying to achieve

### 控制方式 (Controls)

List all available control methods (mouse clicks, keyboard keys, etc.)

## 3. 遊戲規則 (Game Rules)

### 得分機制 (Scoring System)

How players earn points and scoring rules

### 失敗條件 (Failure Conditions)

What causes Game Over

### 物理規則 (Physics Rules)

Gravity, flight mechanics, collisions, etc.

## 4. 遊戲元素 (Game Elements)

### 實體 (Entities)

Describe each game object in plain language:

- 玩家角色 (Player Character - Bird)
- 障礙物 (Obstacles - Pipes)
- 場景元素 (Scene Elements - Background, Ground)
- 介面元素 (UI Elements - Score)

### 系統運作 (Systems)

Explain each system's functionality in non-technical terms:

- 輸入系統 (Input System)
- 物理系統 (Physics System)
- 計分系統 (Score System)
- 障礙物系統 (Pipe System)
- 其他系統 (Other Systems - Audio, Background, Ground)

### 視覺呈現 (Visual Rendering)

How game elements are visually presented

## 5. 遊戲流程 (Game Flow)

Optional: Describe the complete game flow from start to end:

1. Game startup
2. Player begins interaction
3. Obstacles appear and move
4. Scoring or failure
5. Game over

## 6. 設計文件索引 (Design Document Index)

Links to detailed design documents organized by layer

# Definition

<procedure name="read_design_documents">
    <description>Read all design documents to gather complete information.</description>
    <step>1. use Glob to find all index files in "docs/" (entities.md, systems.md, renderers.md, events.md, foundations.md)</step>
    <step>2. use Read to read each index file to understand the overall structure</step>
    <step>3. use Glob to find all design documents in "docs/design/**/*.md"</step>
    <step>4. use Read to read each design document to extract key information:
        - For entities: properties, behaviors, characteristics
        - For systems: functionality, events handled, side effects
        - For renderers: visual representation approach
        - For events: trigger conditions and purposes
        - For foundations: utility functions and architecture support
    </step>
    <step>5. optionally read "docs/ARCHITECTURE.md" to understand technical architecture (but don't include technical details in GAME_DESIGN.md)</step>
    <return>structured collection of all design information organized by layer</return>
</procedure>

<procedure name="organize_content">
    <description>Organize the collected information into the game design document structure.</description>
    <parameter name="design_info" type="object">Collected design information from all documents</parameter>
    <step>1. extract gameplay information:
        - How the bird is controlled (from InputSystem, Bird entity)
        - How gravity and flight work (from PhysicsSystem)
        - How scoring works (from ScoreSystem, Score entity)
        - How pipes behave (from PipeSystem, Pipe entity)
    </step>
    <step>2. extract game rules:
        - Scoring mechanism (increment on passing pipes)
        - Failure conditions (collision with pipes, ground, or falling off screen)
        - Physics rules (gravity constant, flap velocity, rotation angles)
    </step>
    <step>3. organize game elements:
        - List all entities with their purpose and behavior
        - List all systems with their functionality in plain language
        - Describe visual presentation approach
    </step>
    <step>4. create game flow description based on systems interaction</step>
    <step>5. prepare design document index with categorized links</step>
    <return>organized content ready to be written to GAME_DESIGN.md</return>
</procedure>

<procedure name="write_game_design">
    <description>Write or update the GAME_DESIGN.md file with organized content.</description>
    <parameter name="content" type="object">Organized content for the game design document</parameter>
    <step>1. check if "docs/GAME_DESIGN.md" exists using Read tool</step>
    <step>2. if file exists and has content, use Edit tool to update it; otherwise use Write tool to create it</step>
    <step>3. write the content following the structure defined above:
        - Start with "# Flappy Bird 遊戲設計文件"
        - Include all required sections in Traditional Chinese
        - Use markdown formatting for headers, lists, and links
        - Link to design documents using relative paths (e.g., `[Bird 設計文件](./design/entity/bird.md)`)
        - Ensure all content is in Traditional Chinese (Taiwan)
    </step>
    <step>4. ensure the document is complete, well-formatted, and easy to read</step>
    <return>confirmation that GAME_DESIGN.md has been successfully updated</return>
</procedure>

<procedure name="main">
    <description>Main procedure to update GAME_DESIGN.md based on all design documents.</description>
    <step>1. <execute name="read_design_documents" /></step>
    <step>2. <execute name="organize_content" design_info="$design_info" /></step>
    <step>3. <execute name="write_game_design" content="$organized_content" /></step>
    <step>4. report summary of changes made to GAME_DESIGN.md</step>
    <return>summary of the updated game design document</return>
</procedure>

# Task

<execute name="main">$ARGUMENTS</execute>
