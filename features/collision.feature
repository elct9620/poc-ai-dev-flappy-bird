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
    When the bird moves to the pipe's position
    Then the bird should be dead
    And all scrolling should stop

  Scenario: Bird loses control after hitting obstacle
    Given a pipe is created at position (200, 0)
    And the bird has collided with the pipe
    When the player clicks the mouse
    Then the bird should not respond to input
    And the bird should continue falling

  Scenario: Game completely stops when bird hits ground after death
    Given the bird is dead
    And the bird is falling
    When the bird reaches the ground
    Then the game should stop completely

  Scenario: Game ends immediately when bird hits ground while alive
    When the bird falls to the ground
    Then the bird should be dead
    And the game should stop completely

  Scenario: Bird safely passes through gap without collision
    Given a pipe is created at position (200, 0)
    When the bird moves through the gap between pipes
    Then the bird should remain alive
    And the game should continue running

  Scenario: Complete game over flow from collision to landing
    Given a pipe is created at position (200, 0)
    When the bird hits the pipe
    Then the bird should be dead
    And all scrolling should stop
    When the game continues until the bird lands
    Then the game should stop completely
