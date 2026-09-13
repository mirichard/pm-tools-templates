Feature: UC-PASSWORD-RESET — Allows a user to reset their forgotten password.
  Allows a user to reset their forgotten password.

  Background:
    Given the user is on the login page

  Scenario: Happy Path — Basic Flow
    # Source requirement FR1
    # 1. FR1: A user on the login page can click "Forgot password" to enter their registered email address and request a reset link.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link for a given email address
    # Source requirement FR2
    # 2. FR2: If the email matches a registered account, the system sends a reset link to that email; the link is valid for 30 minutes from send time. If the email does not match any account, the system shows the same generic confirmation message (no account-enumeration signal).
    Then the System sends a Password Reset Link to the User.
    # Source requirement FR3
    # 3. FR3: Clicking a valid, unexpired reset link takes the user to a form to enter and confirm a new password.
    When the User clicks the Password Reset Link.
    Then the user is presented with a form to enter and confirm a new Password
    # Source requirement FR4
    # 4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).
    Then the System accepts the new Password.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System invalidates the Password Reset Link.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System invalidates all existing Login Sessions for the Account.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System displays a confirmation to the User that they can now log in with the new password.
    Then the user is informed they can log in with the new Password

  Scenario: If the email address provided by the User does not match a registered account.
    # Source requirement FR1
    # 1. FR1: A user on the login page can click "Forgot password" to enter their registered email address and request a reset link.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link for a given email address
    # Source requirement FR2
    # 2. FR2: If the email matches a registered account, the system sends a reset link to that email; the link is valid for 30 minutes from send time. If the email does not match any account, the system shows the same generic confirmation message (no account-enumeration signal).
    Then the System displays a generic confirmation message to the User, without revealing if the email is registered.

  Scenario: If the User attempts to click a Password Reset Link that is expired or already used.
    # Source requirement FR1
    # 1. FR1: A user on the login page can click "Forgot password" to enter their registered email address and request a reset link.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link for a given email address
    # Source requirement FR2
    # 2. FR2: If the email matches a registered account, the system sends a reset link to that email; the link is valid for 30 minutes from send time. If the email does not match any account, the system shows the same generic confirmation message (no account-enumeration signal).
    Then the System sends a Password Reset Link to the User.
    # Source requirement FR6
    # 6. FR6: If a reset link is expired or already used, the system shows an error and offers to send a new one (returning to FR1's flow).
    Then the System displays an error message to the User and offers to send a new Password Reset Link.
    # Source requirement FR1
    # 1. FR1: A user on the login page can click "Forgot password" to enter their registered email address and request a reset link.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link for a given email address
    # Source requirement FR2
    # 2. FR2: If the email matches a registered account, the system sends a reset link to that email; the link is valid for 30 minutes from send time. If the email does not match any account, the system shows the same generic confirmation message (no account-enumeration signal).
    Then the System sends a Password Reset Link to the User.
    # Source requirement FR3
    # 3. FR3: Clicking a valid, unexpired reset link takes the user to a form to enter and confirm a new password.
    When the User clicks the Password Reset Link.
    Then the user is presented with a form to enter and confirm a new Password
    # Source requirement FR4
    # 4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).
    Then the System accepts the new Password.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System invalidates the Password Reset Link.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System invalidates all existing Login Sessions for the Account.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System displays a confirmation to the User that they can now log in with the new password.
    Then the user is informed they can log in with the new Password

  Scenario: If the new Password entered by the User does not meet the specified rules.
    # Source requirement FR1
    # 1. FR1: A user on the login page can click "Forgot password" to enter their registered email address and request a reset link.
    When the User requests a Password Reset Link from the System.
    Then the system has received a request for a password reset link for a given email address
    # Source requirement FR2
    # 2. FR2: If the email matches a registered account, the system sends a reset link to that email; the link is valid for 30 minutes from send time. If the email does not match any account, the system shows the same generic confirmation message (no account-enumeration signal).
    Then the System sends a Password Reset Link to the User.
    # Source requirement FR3
    # 3. FR3: Clicking a valid, unexpired reset link takes the user to a form to enter and confirm a new password.
    When the User clicks the Password Reset Link.
    Then the user is presented with a form to enter and confirm a new Password
    # Source requirement FR4
    # 4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).
    Then the System rejects the Password and displays the specific unmet rules to the User.
    # Source requirement FR3
    # 3. FR3: Clicking a valid, unexpired reset link takes the user to a form to enter and confirm a new password.
    When the User clicks the Password Reset Link.
    Then the user is presented with a form to enter and confirm a new Password
    # Source requirement FR4
    # 4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).
    Then the System accepts the new Password.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System invalidates the Password Reset Link.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System invalidates all existing Login Sessions for the Account.
    # Source requirement FR5
    # 5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
    Then the System displays a confirmation to the User that they can now log in with the new password.
    Then the user is informed they can log in with the new Password
