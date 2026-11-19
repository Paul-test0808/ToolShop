@cart
Feature: Shopping cart
  As a shopper
  I want to put products in my cart and manage them there
  So that I can buy what I need later

  Products are picked through the API as in stock and their prices are read from the page,
  so the scenarios keep working when the shop's data changes. Buying (checkout) is not covered here.

  Background:
    Given I am on the page of an in-stock product

  @smoke
  Scenario: Add a product to the cart
    When I add the product to the cart
    Then I should see the confirmation "Product added to shopping cart."
    And the cart icon should show 1

  Scenario: Add a product with a quantity of 3
    When I increase the quantity 2 times
    And I add the product to the cart
    Then the cart icon should show 3
    When I open the cart
    Then the cart should contain my products
    And the cart total should be correct

  Scenario: Add two different products
    When I add the product to the cart
    And I add another in-stock product to the cart
    Then the cart icon should show 2
    When I open the cart
    Then the cart should contain my products
    And the cart total should be correct

  Scenario: Adding the same product twice increases its quantity
    When I add the product to the cart
    And I add the product to the cart
    Then the cart icon should show 2
    When I open the cart
    Then the cart should contain my products
    And the cart total should be correct

  Scenario: Change the quantity in the cart
    Given I added the product to the cart
    And I open the cart
    When I change the quantity in the cart to 4
    Then the cart should contain my products
    And the cart total should be correct
    And the cart icon should show 4

  Scenario: Remove a product from the cart
    Given I added the product to the cart
    And I open the cart
    When I remove the product from the cart
    Then the cart should be empty

  Scenario: The cart is kept after reloading the page
    Given I added the product to the cart
    And I open the cart
    When I reload the cart page
    Then the cart should contain my products
    And the cart icon should show 1

  @known-bug @fail
  Scenario: Remove buttons have an accessible name
    Known bug: the remove (✕) button has no text, label or test id, so screen readers
    announce it only as "link". @fail keeps the suite green while the bug exists and
    turns this scenario red once the shop fixes it, as a reminder to drop the tags.

    Given I added the product to the cart
    And I open the cart
    Then every remove button should have an accessible name
