# This feature is related to:
# - docs/design/system/collision_system.md
# - docs/design/entity/bird.md
# - docs/design/entity/pipe.md
# - docs/design/entity/ground.md
@skip
Feature: Collision Detection
  As a player
  I want the game to detect when I hit obstacles
  So that the game ends when I fail to navigate safely

  Background:
    Given the game has started
    And a bird is created at position (100, 200)
    And a ground is created at the bottom of the screen

  Scenario: Game ends when bird hits pipe
    Given a pipe is created at position (200, 0)
    When the game advances until the bird collides with the pipe
    Then the bird should be dead

  Scenario: Scrolling stops when bird hits obstacle
    Given a pipe is created at position (200, 0)
    When the game advances until the bird collides with the pipe
    Then all scrolling should stop

  Scenario: Bird loses control after hitting obstacle
    Given a pipe is created at position (200, 0)
    And the bird has collided with the pipe
    When the player clicks the mouse
    Then the bird should not respond to input

  Scenario: Bird continues falling after collision
    Given a pipe is created at position (200, 0)
    And the bird has collided with the pipe
    When the game advances by 0.5 seconds
    Then the bird should continue falling

  Scenario: Game completely stops when bird hits ground after death
    Given the bird is killed
    When the game advances until the bird reaches the ground
    Then the game should stop completely

  Scenario: Bird safely passes through gap without collision
    Given a pipe is created at position (200, 0)
    When the player navigates through the gap between pipes
    Then the bird should remain alive

  Scenario: Game continues when bird navigates safely
    Given a pipe is created at position (200, 0)
    When the player navigates through the gap between pipes
    Then the game should continue running

  Scenario Outline: Collision detection with different positions
    Given a pipe is created at position (<pipe_x>, 0)
    And the bird is at position (<bird_x>, <bird_y>)
    When the game advances by 0.1 seconds
    Then the bird should be <state>

    Examples:
      | pipe_x | bird_x | bird_y | state |
      | 100    | 100    | 200    | alive |
      | 100    | 120    | 50     | dead  |
      | 100    | 120    | 350    | dead  |
