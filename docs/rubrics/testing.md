# Testing Rubric

This document outlines the criteria for evaluating the quality of testing steps. We assert at least 80% of the criteria must be met to pass.

## Criteria

### Reuse Steps (1 point)

When writing feature tests, check if there are existing steps that can be reused to avoid duplication.

- Use existing steps whenever possible.
- Avoid creating new steps that duplicate existing functionality.
- Refactor existing steps if necessary to accommodate new test scenarios.

### Describe User Interactions (1 point)

The testing steps should clearly describe user interactions with the system.

```gherkin
Given the game has started
When the player collects a coin
Then the player's score should increase by 10 points
```

- Not just technical actions, but also how a user would interact with the system.
- Use descriptive language to convey the user's perspective.
- Ensure that the steps are easy to understand for someone unfamiliar with the system.

### Verify One Thing at a Time (1 point)

Each testing step should verify a single aspect of the system to ensure clarity and precision.

```gherkin
Then the player's score should increase by 10 points
And the coin should disappear from the game worlda # Avoid this, this isn't related to score verification
```

- Avoid combining multiple verifications in a scenario.
- Each scenario should focus on one specific outcome.

### Follow Design Documents (1 point)

Testing should align with the design documents to avoid unnecessary or irrelevant tests.

- The explicit requirements from the design documents should be the basis for writing tests.
- Edge cases can be considered, but avoid speculative tests that are not grounded in the design.
- Ensure that tests can reproduce by the real users not just theoretical scenarios.

### No Skipped Tests (1 point)

All tests should be executed without skipping to ensure comprehensive coverage.

The exception is design-only changes where no code changes are made, it is acceptable to skip tests use `@skip` annotation with a clear reason.

### Examples for multiple Data Sets (1 point)

When testing features that require multiple data sets, use examples to cover different scenarios.

```gherkin
Scenario Outline: Player collects different types of coins
    Given the game has started
    When the player collects a <coin_type> coin
    Then the player's score should increase by <points> points
    Examples:
      | coin_type | points |
      | gold      | 10     |
      | silver    | 5      |
      | bronze    | 2      |
```

### Reference Documents (1 point)

For tests related to specific features or systems, reference the relevant design documents in the test comments.

```gherkin
# The feature is related to "docs/design/system/score_system.md"
Feature: Score System
  As a player
  I want to see my score increase when I collect coins
  So that I can track my progress in the game

  @issue-123
  Scenario: Player collects a coin
      Given the game has started
      When the player collects a coin
      Then the player's score should increase by 10 points
```

- Reference the design documents that define the feature being tested.
- Use annotations to link to GitHub issues or design documents where applicable.

