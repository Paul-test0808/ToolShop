@products @sort
Feature: Product sorting
  As a shopper
  I want to sort the catalogue
  So that I can compare products by name or price

  Background:
    Given I am on the home page

  Scenario Outline: Sort products by <field> <direction>
    When I sort products by "<option>"
    Then the sort selector should show "<option>"
    And products should be sorted by <field> in <direction> order
    And I should see 9 products

    Examples:
      | option             | field | direction  |
      | Name (A - Z)       | name  | ascending  |
      | Name (Z - A)       | name  | descending |
      | Price (Low - High) | price | ascending  |
      | Price (High - Low) | price | descending |
