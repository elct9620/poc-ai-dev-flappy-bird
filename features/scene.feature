# This feature is related to:
# - docs/design/entity/scene.md
# - docs/design/component/scene.md
# - docs/design/system/scene_system.md
Feature: Scene System
  As a player
  I want to see the game background
  So that the game visuals become richer

  Background:
    Given the game has started

  @skip
  Scenario: Player sees background when game starts
    When a scene is created with id "background"
    Then the scene "background" should exist in the game state
    And the scene "background" should have type "scene"

  @skip
  Scenario: Background is removed when scene is destroyed
    Given a scene exists with id "background"
    When the scene "background" is removed
    Then the scene "background" should not exist in the game state
