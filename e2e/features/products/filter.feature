@products @filter
Feature: Product filters
  As a shopper
  I want to filter the catalogue
  So that I only see the products I am interested in

  Background:
    Given I am on the home page

  @smoke
  Scenario: Filter by a sub-category
    When I filter by category "Hammer"
    Then only products from the category "Hammer" should be shown

  Scenario: Selecting a main category selects all its sub-categories
    When I filter by category "Power Tools"
    Then these category filters should be selected:
      | Grinder |
      | Sander  |
      | Saw     |
      | Drill   |
    And only products from these categories should be shown:
      | Grinder |
      | Sander  |
      | Saw     |
      | Drill   |

  Scenario: Filter by brand
    When I filter by brand "ForgeFlex Tools"
    Then only products of the brand "ForgeFlex Tools" should be shown

  Scenario: Combine a category and a brand
    When I filter by category "Hammer"
    And I filter by brand "ForgeFlex Tools"
    Then only products from the category "Hammer" should be shown
    And only products of the brand "ForgeFlex Tools" should be shown

  Scenario: Removing a filter shows other products again
    Given I filter by category "Hammer"
    When I remove the category filter "Hammer"
    Then products from categories other than "Hammer" should be shown

  Scenario: Show only eco-friendly products
    When I show only eco-friendly products
    Then only eco-friendly products should be shown

  Scenario: Limit the price range
    When I set the maximum price to 20
    Then every product price should be at most 20
