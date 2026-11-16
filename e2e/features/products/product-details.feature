@products @product-details
Feature: Product details
  As a shopper
  I want to open a product from the catalogue
  So that I can see its details before buying

  @smoke
  Scenario: Open product details from the catalogue
    Given I am on the home page
    When I open the "Combination Pliers" product
    Then I should be on the product page
    And the product name should be "Combination Pliers"
    And the product price should be "14.15"
    And the product description should not be empty
    And the quantity should be 1
    And I should see the buttons "Add to cart", "Add to favourites" and "Compare"

  Scenario: Change the quantity
    Given I am on the "Combination Pliers" product page
    When I increase the quantity 2 times
    Then the quantity should be 3
    When I decrease the quantity 1 time
    Then the quantity should be 2
