# This feature is related to:
# - docs/design/entity/ground.md
# - docs/design/component/ground.md
# - docs/design/system/ground_system.md
Feature: Ground System
  As a player
  I want to see the ground at the bottom of the screen
  So that the game presentation is more complete

  Background:
    Given the game has started

  @skip
  Scenario: Player sees ground when game starts
    When a ground is created with id "ground"
    Then the ground "ground" should exist in the game state
    And the ground "ground" should have type "ground"

  @skip
  Scenario: Ground is removed when destroyed
    Given a ground exists with id "ground"
    When the ground "ground" is removed
    Then the ground "ground" should not exist in the game state
