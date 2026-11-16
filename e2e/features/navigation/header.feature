@navigation
Feature: Header navigation
  As a visitor of the Toolshop
  I want to use the top navigation
  So that I can reach the main sections of the shop

  Background:
    Given I am on the home page

  @smoke
  Scenario: Home page shows the header and the product catalogue
    Then the page title should be "Practice Software Testing - Toolshop - v5.0"
    And the header should show the links:
      | Home       |
      | Categories |
      | Contact    |
      | Sign in    |
    And the language selector should show "EN"
    And I should see 9 products
    And every product should show a name and a price
    And the pagination should be visible

  Scenario: Categories menu lists all categories
    When I open the categories menu
    Then I should see the categories:
      | Hand Tools    |
      | Power Tools   |
      | Other         |
      | Special Tools |
      | Rentals       |

  @smoke
  Scenario: Open the Login page
    When I go to "Sign in" from the header
    Then I should be on the Login page
    And I should see the "Login" heading
    And I should see the login form with fields:
      | Email address * |
      | Password *      |
    And I should see the links to register and to reset the password

  @smoke
  Scenario: Open the Contact page
    When I go to "Contact" from the header
    Then I should be on the Contact page
    And I should see the "Contact" heading
    And I should see the contact form with fields:
      | First name    |
      | Last name     |
      | Email address |
      | Subject       |
      | Message *     |
      | Attachment    |

  Scenario Outline: Open the "<category>" category
    When I open the "<category>" category from the header
    Then I should be on the "<category>" category page
    And I should see the "Category: <category>" heading
    And I should see at least 1 product

    Examples:
      | category    |
      | Hand Tools  |
      | Power Tools |
      | Other       |

  Scenario: Return to the home page
    Given I go to "Contact" from the header
    When I go to "Home" from the header
    Then I should be on the Home page
    And I should see 9 products
