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
    When the bird moves past the pipe to x position 160
    And the game ticks
    Then the score "game-score" should have value 1
    And the pipe should be marked as passed

  @skip
  Scenario: Score only increments once per pipe pair
    Given a pipe pair exists at x position 100
    When the bird moves past the pipe to x position 160
    And the game ticks
    And the game ticks
    And the game ticks
    Then the score "game-score" should have value 1

  @skip
  Scenario: Score increments for multiple pipe pairs
    Given a pipe pair exists at x position 100
    And a pipe pair exists at x position 300
    When the bird moves past the pipe to x position 160
    And the game ticks
    And the bird moves past the pipe to x position 360
    And the game ticks
    Then the score "game-score" should have value 2

  @skip
  Scenario: Point sound plays when score increments
    Given a pipe pair exists at x position 100
    When the bird moves past the pipe to x position 160
    And the game ticks
    Then the point sound should have played

  @skip
  Scenario: Score detection accounts for bird width with scaling
    Given the screen scale is 1.5
    And a pipe pair exists at x position 100
    When the bird's right edge passes the pipe's right edge
    And the game ticks
    Then the score "game-score" should have value 1

  @skip
  Scenario: No score if bird hasn't fully passed pipe
    Given a pipe pair exists at x position 100
    When the bird is at x position 90
    And the game ticks
    Then the score "game-score" should have value 0
    And the pipe should not be marked as passed
