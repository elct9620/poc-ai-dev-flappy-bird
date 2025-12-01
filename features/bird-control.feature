Feature: Bird Control
  As a player
  I want to control the player character
  So that the game has basic operability

  Background:
    Given the game has started
    And a bird is created at position (100, 200)

  Scenario: Bird falls when no input is provided
    When the game advances by 1 second
    Then the bird should have moved downward
    And the bird's vertical velocity should be positive

  Scenario: Bird flies upward when player provides input
    When the player clicks the mouse
    Then the bird should have negative vertical velocity
    And the bird should tilt upward

  Scenario: Bird flies upward when player presses space key
    When the player presses the "Space" key
    Then the bird should have negative vertical velocity
    And the bird should tilt upward

  Scenario: Bird continues falling after flap effect ends
    Given the player clicks the mouse
    When the game advances by 1 second
    Then the bird should have positive vertical velocity
    And the bird should tilt downward

  Scenario: Bird animation changes during flapping
    When the player clicks the mouse
    Then the bird's animation frame should advance

  Scenario: Bird can flap multiple times
    When the player clicks the mouse
    And the game advances by 0.05 seconds
    And the player clicks the mouse
    And the game advances by 0.05 seconds
    And the player clicks the mouse
    Then the bird should be higher than its initial position

  Scenario: Bird rotation reflects movement direction
    Given the bird is falling
    When the bird's vertical velocity is 200 pixels per second
    Then the bird should be tilted downward
    When the player clicks the mouse
    And the game advances by 0.1 seconds
    Then the bird should be tilted upward

  Scenario: Bird stops responding to input when dead
    Given the bird is killed
    When the player clicks the mouse
    Then the bird's vertical velocity should not change

  Scenario: Remove a bird
    When the bird is removed
    Then the bird should not exist in the game state
