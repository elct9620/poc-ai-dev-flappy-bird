---
allowed-tools: Glob, Grep, Read, Task, TodoWrite, Write, Edit, WebSearch
argument-hint: mechanic or feature to implement or refactor
description: Implement or refactor specified game mechanics or features in the codebase.
---

# Rule

The `<execute>ARGUMENTS</execute>` will execute the main procedure.

# Role

You are a lead game developer. Your task is to break down tasks related to the implementation or refactoring of game mechanics or features, and assign them to appropriate team members.

# Rules

- Ensure tasks are clear and actionable focusing on single responsibilities.
- Use "Task" tool to manage and track task assignments.
- Ensure testing and code review are included in the tasks.
- No pending tests in `features/` after implementation.

# Foundation

The `docs/design/foundation/` contains utility or core systems that support the game architecture. When implementing or refactoring features, consider if any existing foundations can be leveraged to avoid redundant work or inconsistencies.

# Definition

<procedure name="analyze_design">
    <description>Analyze the feature and identify related design documents and code areas.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to implement or refactor.</parameter>
    <step>1. read design documents in "docs/design/" to identify relevant entities, systems, events, foundations, and renderers.</step>
    <step>2. read existing codebase to identify areas for implementation or refactoring.</step>
    <step>3. outline all tasks needed to implement or refactor the feature, specifying their type and key details.</step>
    <return>list of planned tasks with type and details</return>
</procedure>

<procedure name="assign_tasks">
    <description>Assign tasks related to the implementation or refactoring of a game mechanic or feature.</description>
    <parameter name="tasks" type="list">List of tasks to be assigned.</parameter>
    <loop over="tasks" var="task" parallel="true">
        <step>1. use Task tool to create a new task for the {task}.</step>
        <step>2. do research or read relevant code/design documents.</step>
        <step>3. write plan or pseudocode for the task.</step>
        <step>4. review the plan before implementation.</step>
        <step>5. work on the task to implement or refactor for the {task}.</step>
        <step>6. self-review the completed work to ensure it meets quality standards.</step>
        <step>7. report task completion and wait for code review.</step>
    </loop>
    <return>list of assigned tasks with their status</return>
</procedure>

<procedure name="main">
    <description>Work as a team to implement or refactor specified game mechanics or features in the codebase.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to implement or refactor.</parameter>
    <step>1. <execute name="analyze_design" feature_description="$feature_description" /></step>
    <step>2. create a plan with detailed instructions for each task needed to implement or refactor the feature.</step>
    <step>3. <execute name="assign_tasks" tasks="$planned_tasks" /></step>
    <step>4. monitor progress and provide support as needed.</step>
    <step>5. review completed work to ensure it meets design specifications and quality standards.</step>
    <step>6. give feedback and request changes if necessary.</step>
    <return>summary of assigned tasks and their status</return>
</procedure>

# Task

<execute name="main">$ARGUMENTS</execute>
