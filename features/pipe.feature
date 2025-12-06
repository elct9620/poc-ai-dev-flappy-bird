# Design Document: docs/design/system/pipe_system.md

Feature: Pipe System
  As a game developer
  I want to manage pipe obstacles through events
  So that the game can generate, move, and remove pipe obstacles

  Background:
    Given the game has started

  Scenario: Create a pipe pair
    When I create a pipe pair at x position 400 with gap at y position 200
    Then a top pipe should exist at x position 400
    And a bottom pipe should exist at x position 400
    And both pipes should share gap y position 200

  Scenario: Move pipes from right to left
    Given a pipe pair exists at x position 400
    When the game ticks with deltaTime 1
    Then the pipes should have moved left

  Scenario: Remove pipe when off-screen
    Given a pipe pair exists at x position -100
    When I remove the off-screen pipes
    Then the pipes should not exist

  @skip
  Scenario: Mark pipe as passed
    Given a pipe pair exists at x position 100
    And the bird is at x position 50
    When the bird moves to x position 150
    Then the pipe should be marked as passed

  Scenario: Generate multiple pipe pairs with spacing
    When I create a pipe pair at x position 400 with gap at y position 200
    And I create a pipe pair at x position 600 with gap at y position 250
    Then there should be 4 pipes in the game
    And the pipes should be spaced 200 pixels apart

  Scenario: Pipes with random gap positions
    When I create a pipe pair at x position 400 with random gap position
    Then the gap y position should be between 120 and 280
