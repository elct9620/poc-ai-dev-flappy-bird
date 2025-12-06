# This feature is related to:
# - docs/design/entity/background.md
# - docs/design/renderer/background.md
# - docs/design/system/background_system.md
Feature: Background System
  As a player
  I want to see the game background
  So that the game visuals become richer

  Background:
    Given the game has started

  Scenario: Player sees background when game starts
    When a background is created with id "background"
    Then the background "background" should exist in the game state
    And the background "background" should have type "background"

  Scenario: Background is removed when destroyed
    Given a background exists with id "background"
    When the background "background" is removed
    Then the background "background" should not exist in the game state
