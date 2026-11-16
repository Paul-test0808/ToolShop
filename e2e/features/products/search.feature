@products @search
Feature: Product search
  As a shopper
  I want to search the catalogue by name
  So that I can quickly find the tool I need

  Background:
    Given I am on the home page

  @smoke
  Scenario: Search by product name
    When I search for "pliers"
    Then I should see the search caption "Searched for: pliers"
    And I should see exactly these products:
      | Combination Pliers |
      | Pliers             |
      | Long Nose Pliers   |
      | Slip Joint Pliers  |
    And "Long Nose Pliers" should be marked as out of stock

  Scenario: Search is case-insensitive
    When I search for "HAMMER"
    Then I should see at least 1 product
    And every product name should contain "hammer"

  Scenario: Search with no matches
    When I search for "nonexistent-tool-xyz"
    Then I should see the message "There are no products found."
    And I should see 0 products

  Scenario: Reset the search
    Given I searched for "pliers"
    When I reset the search
    Then the search field should be empty
    And the search caption should not be shown
    And I should see 9 products
