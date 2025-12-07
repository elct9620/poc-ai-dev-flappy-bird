# This feature is related to:
# - docs/design/system/collision_system.md
# - docs/design/entity/bird.md
# - docs/design/entity/pipe.md
# - docs/design/entity/ground.md
Feature: Collision Detection
  As a player
  I want the game to detect when I hit obstacles
  So that the game ends when I fail to navigate safely

  Background:
    Given the game has started
    And a bird is created at position (100, 200)
    And a ground is created at the bottom of the screen

  Scenario: Bird dies when hitting pipe
    Given a pipe is created at position (200, 0)
    When the game advances until the bird collides with the pipe
    Then the bird should be dead

  Scenario: Pipes stop moving when bird dies
    Given a pipe is created at position (200, 0)
    When the game advances until the bird collides with the pipe
    Then the pipes should stop moving

  Scenario: Ground stops scrolling when bird dies
    Given a pipe is created at position (200, 0)
    When the game advances until the bird collides with the pipe
    Then the bird should be dead

  Scenario: Bird ignores player input after death
    Given the bird is killed
    When the player clicks the mouse
    Then the bird's vertical velocity should not change

  Scenario: Bird falls after collision
    Given a pipe is created at position (200, 0)
    And the bird has collided with the pipe
    When the game advances by 0.5 seconds
    Then the bird should have moved downward

  Scenario: Game stops when bird lands on ground
    Given the bird is killed
    When the game advances until the bird reaches the ground
    Then the game should stop completely

  Scenario: Bird stays alive when passing through pipe gap
    Given a pipe is created at position (200, 0)
    When the player navigates through the gap between pipes
    Then the bird should remain alive

  Scenario Outline: Collision detection with various bird and pipe positions
    Given a pipe is created at position (<pipe_x>, 0)
    And the bird is at position (<bird_x>, <bird_y>)
    When the game advances by 0.1 seconds
    Then the bird should be <state>

    Examples:
      | pipe_x | bird_x | bird_y | state | scenario_description        |
      | 100    | 50     | 200    | alive | bird far left of pipe       |
      | 100    | 100    | 200    | alive | bird at pipe edge           |
      | 100    | 114    | 50     | dead  | bird hits top pipe          |
      | 100    | 114    | 350    | dead  | bird hits bottom pipe       |
      | 100    | 120    | 180    | alive | bird in gap (safe zone)     |
      | 100    | 170    | 200    | alive | bird far right of pipe      |
