Feature: Score System
  As a game developer
  I want to manage score entities through events
  So that the game can track and display player scores

  Background:
    Given the game has started

  Scenario: Create a new score
    When I create a score with id "player-score" and value 0
    Then the score "player-score" should exist
    And the score "player-score" should have value 0

  Scenario: Create score with all properties
    When I create a score with id "hud-score", value 42, position (100, 50), scale 2.5, spacing 4, and "center" alignment
    Then the score "hud-score" should exist
    And the score "hud-score" should have value 42
    And the score "hud-score" should have position (100, 50)
    And the score "hud-score" should have scale 2.5
    And the score "hud-score" should have spacing 4
    And the score "hud-score" should have "center" alignment

  Scenario: Reset score value
    Given a score exists with id "game-score" and value 10
    When I reset the score "game-score"
    Then the score "game-score" should have value 0

  Scenario: Increment score value
    Given a score exists with id "game-score" and value 0
    When I increment the score "game-score"
    Then the score "game-score" should have value 1

  Scenario: Increment score multiple times
    Given a score exists with id "game-score" and value 0
    When I increment the score "game-score"
    And I increment the score "game-score"
    And I increment the score "game-score"
    Then the score "game-score" should have value 3

  Scenario: Remove a score
    Given a score exists with id "temp-score" and value 100
    When I remove the score "temp-score"
    Then the score "temp-score" should not exist

  Scenario: Manage multiple scores
    When I create a score with id "score-1" and value 10
    And I create a score with id "score-2" and value 20
    And I create a score with id "score-3" and value 30
    Then there should be 3 scores in the game
    And the score "score-1" should have value 10
    And the score "score-2" should have value 20
    And the score "score-3" should have value 30

  Scenario Outline: Score with different alignments
    When I create a score with id "aligned-score", value 100, position (50, 50), scale 1, spacing 2, and "<alignment>" alignment
    Then the score "aligned-score" should have "<alignment>" alignment

    Examples:
      | alignment |
      | left      |
      | center    |
      | right     |

  Scenario Outline: Score with boundary values
    When I create a score with id "boundary-score" and value <value>
    Then the score "boundary-score" should have value <value>

    Examples:
      | value  |
      | 0      |
      | 999999 |
      | -100   |

  Scenario: Reset non-existent score
    When I reset the score "missing-score"
    Then the score "missing-score" should not exist

  Scenario: Score state immutability
    Given a score exists with id "immutable-score" and value 100
    When I increment the score "immutable-score"
    Then the score "immutable-score" should have value 101
    And the previous state should not be modified
