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
    When the game starts
    Then the player should see the background
