@auth @register
Feature: Customer registration
  As a new visitor
  I want to register an account
  So that I can log in and shop

  Every scenario uses freshly generated customer data (unique email, random name, address, phone).

  @smoke
  Scenario: Open the registration page from Sign in
    Given I am on the home page
    When I go to "Sign in" from the header
    And I open the registration page from the login page
    Then I should be on the Registration page
    And I should see the registration form

  @smoke
  Scenario: Register a new account and log in with it
    Given I am on the registration page
    When I fill the registration form with valid details
    And I submit the registration form
    Then I should be on the Login page
    When I log in with my new account
    Then I should be on the My account page
    And the header should show my name

  Scenario: An email can only be registered once
    Given I have registered as a new customer
    When I register again with the same email
    Then I should see the registration error "A customer with this email address already exists."

  Scenario Outline: "<field>" is mandatory
    Given I am on the registration page
    When I fill the registration form with valid details except "<field>"
    And I submit the registration form
    Then I should see the error "<message>" for "<field>"
    And no other field should show an error

    Examples:
      | field         | message                   |
      | First name    | First name is required    |
      | Last name     | Last name is required     |
      | Date of Birth | Date of Birth is required |
      | Country       | Country is required       |
      | Postal code   | Postcode is required      |
      | House number  | House number is required  |
      | Street        | Street is required        |
      | City          | City is required          |
      | State         | State is required         |
      | Phone         | Phone is required.        |
      | Email         | Email is required         |
      | Password      | Password is required      |

  Scenario Outline: Invalid "<field>" is rejected
    Given I am on the registration page
    When I fill the registration form with "<field>" set to "<value>"
    And I submit the registration form
    Then I should see the error "<message>" for "<field>"
    And no other field should show an error

    Examples:
      | field    | value        | message                                     |
      | Email    | not-an-email | Email format is invalid                     |
      | Phone    | abc          | Only numbers are allowed.                   |
      | Password | abc          | Password must be minimal 6 characters long. |

  Scenario: The address is filled in from the postcode
    Given I am on the registration page
    When I fill the registration form with valid details
    Then the address should be filled in automatically
