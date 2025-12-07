# This feature is related to:
# - docs/design/system/pipe_system.md
# - docs/design/system/audio_system.md

Feature: Score Calculation
  As a player
  I want to see my score increase automatically when I successfully navigate through pipes
  So that I can track my progress and compete for high scores

  Background:
    Given the game has started
    And a score exists with id "game-score" and value 0
    And the bird is at position (50, 200)

  Scenario: Score increments when bird passes a pipe pair
    Given a pipe pair exists at x position 100
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value 1

  Scenario: Score only increments once per pipe pair
    Given a pipe pair exists at x position 100
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    And the game ticks with deltaTime 1
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value 1
    And the pipe should be marked as passed

  Scenario: Score does not increment after bird dies
    Given a pipe pair exists at x position 100
    And a pipe pair exists at x position 180
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    And the bird moves to x position 190
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value 1

  Scenario: Point sound plays when score increments
    Given a pipe pair exists at x position 100
    When the bird moves to x position 160
    And the game ticks with deltaTime 1
    Then the point sound effect should play

  Scenario Outline: Score detection with different positions
    Given a pipe pair exists at x position <pipe_x>
    When the bird moves to x position <bird_x>
    And the game ticks with deltaTime 1
    Then the score "game-score" should have value <expected_score>

    Examples:
      # Boundary calculation: pipe right edge = pipe_x (100) + PIPE_WIDTH (52) = 152
      #                      bird passes when: bird_x + BIRD_WIDTH (34) > 152
      #                      therefore: bird_x > 118 means passed
      | pipe_x | bird_x | expected_score | description                    |
      | 100    | 160    | 1              | bird clearly passed pipe       |
      | 100    | 90     | 0              | bird has not reached pipe      |
      | 100    | 119    | 1              | bird just passed pipe edge     |
      | 100    | 118    | 0              | bird just before pipe edge     |
