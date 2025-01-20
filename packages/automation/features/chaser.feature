Feature: Simple Feature

  Scenario: I log in to Chaser and confirm invoice amount
    Given I am logged into Chaser
        And I click to skip MFA enrollment
    When I click on Receivables
        And I navigate to invoices
    Then The first row has an invoice id of 00000011 and should have £1,000 outstanding
