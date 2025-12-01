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

# Definition

<procedure name="assign_tasks">
    <description>Assign tasks related to the implementation or refactoring of a game mechanic or feature.</description>
    <parameter name="tasks" type="list">List of tasks to be assigned.</parameter>
    <loop over="tasks" var="task" parallel="true">
        <step>1. start a new task in the task management system with the task description.</step>
        <step>2. make deeply research based on the task requirements use tools as needed.</step>
        <step>3. work on the task to implement or refactor the specified mechanic or feature.</step>
        <step>4. self-review the completed work to ensure it meets quality standards.</step>
        <step>5. mark the task as complete in the task management system.</step>
    </loop>
    <return>list of assigned tasks with their status</return>
</procedure>

<procedure name="main">
    <description>Work as a team to implement or refactor specified game mechanics or features in the codebase.</description>
    <parameter name="feature_description" type="string">Description of the game mechanic or feature to implement or refactor.</parameter>
    <step>1. analyze the feature description to identify key components and systems needed for implementation.</step>
    <step>2. read associated design documents in the "docs/design/" directory to understand requirements.</step>
    <step>3. read existing codebase to identify areas for implementation or refactoring.</step>
    <step>4. create a plan outlining the tasks required for implementation or refactoring.</step>
    <step>5. <execute name="assign_tasks" tasks="$planned_tasks" /></step>
    <step>6. monitor progress and provide support as needed.</step>
    <step>7. review completed work to ensure it meets design specifications and quality standards.</step>
    <return>summary of assigned tasks and their status</return>
</procedure>

# Task

<execute name="main">$ARGUMENTS</execute>
