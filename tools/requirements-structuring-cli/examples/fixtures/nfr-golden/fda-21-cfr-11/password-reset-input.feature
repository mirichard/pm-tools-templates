Feature: UC-PASSWORD-RESET — Allows a user to reset their forgotten password and regain access to their account.
  Allows a user to reset their forgotten password and regain access to their account.

  Background:
    Given the user is on the login page.

  Scenario: Happy Path — Basic Flow
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link with an email address.
    Then the System sends a Password Reset Link to the User's email address.
    When the User clicks the received Password Reset Link, which directs them to the System.
    Then the user is on the new password entry form.
    When the User enters and confirms a new password for their Account to the System.
    Then the system has received a new Password that meets complexity rules.
    Then the System invalidates the Password Reset Link and all active Login Sessions for the Account, then displays a confirmation message to the User.
    Then the password Reset Link is invalidated
    Then the all Login Sessions for the Account are invalidated
    Then the confirmation message displayed to User
    Then the user can log in with the new Password.

  Scenario: The provided email address does not match any registered Account.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link with an email address.
    Then the System displays a generic confirmation message to the User, without confirming if the email exists.
    When the User clicks the received Password Reset Link, which directs them to the System.
    Then the user is on the new password entry form.
    When the User enters and confirms a new password for their Account to the System.
    Then the system has received a new Password that meets complexity rules.
    Then the System invalidates the Password Reset Link and all active Login Sessions for the Account, then displays a confirmation message to the User.
    Then the password Reset Link is invalidated
    Then the all Login Sessions for the Account are invalidated
    Then the confirmation message displayed to User
    Then the user can log in with the new Password.

  Scenario: The Password Reset Link is expired or already used.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link with an email address.
    Then the System sends a Password Reset Link to the User's email address.
    Then the System displays an error message to the User, indicating the link is invalid, and offers to send a new Password Reset Link.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link with an email address.
    Then the System sends a Password Reset Link to the User's email address.
    When the User clicks the received Password Reset Link, which directs them to the System.
    Then the user is on the new password entry form.
    When the User enters and confirms a new password for their Account to the System.
    Then the system has received a new Password that meets complexity rules.
    Then the System invalidates the Password Reset Link and all active Login Sessions for the Account, then displays a confirmation message to the User.
    Then the password Reset Link is invalidated
    Then the all Login Sessions for the Account are invalidated
    Then the confirmation message displayed to User
    Then the user can log in with the new Password.

  Scenario: The new Password does not meet complexity rules.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link with an email address.
    Then the System sends a Password Reset Link to the User's email address.
    When the User clicks the received Password Reset Link, which directs them to the System.
    Then the user is on the new password entry form.
    Then the System rejects the new password and displays specific unmet password rules to the User.
    When the User enters and confirms a new password for their Account to the System.
    Then the system has received a new Password that meets complexity rules.
    Then the System invalidates the Password Reset Link and all active Login Sessions for the Account, then displays a confirmation message to the User.
    Then the password Reset Link is invalidated
    Then the all Login Sessions for the Account are invalidated
    Then the confirmation message displayed to User
    Then the user can log in with the new Password.
