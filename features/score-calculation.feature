# Design Document: docs/design/system/pipe_system.md, docs/design/system/audio_system.md

Feature: Score Calculation
  As a player
  I want to earn points when passing through pipes
  So that I can track my progress and compete for high scores

  Background:
    Given the game has started
    And a score exists with id "game-score" and value 0
    And the bird is at position (50, 200)

  @skip
  Scenario: Score increments when bird passes a pipe pair
    Given a pipe pair exists at x position 100
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value 1

  @skip
  Scenario: Score only increments once per pipe pair
    Given a pipe pair exists at x position 100
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    And the game ticks with deltaTime 1
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value 1
    And the pipe should be marked as passed

  @skip
  Scenario: Score increments for multiple pipe pairs
    Given a pipe pair exists at x position 100
    And a pipe pair exists at x position 300
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    And the bird moves to x position 360
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value 2

  @skip
  Scenario: Point sound plays when score increments
    Given a pipe pair exists at x position 100
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    Then the point sound effect should play

  @skip
  Scenario Outline: Score detection with different positions
    Given a pipe pair exists at x position <pipe_x>
    When the bird moves to x position <bird_x>
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value <expected_score>

    Examples:
      | pipe_x | bird_x | expected_score |
      | 100    | 160    | 1              |
      | 100    | 90     | 0              |
