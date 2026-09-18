# Requirements Input Template

## Use Case ID
UC-PASSWORD-RESET

## Use Case Name
User Password Reset

## Actors
- User
- System

## Preconditions
- The user is on the login page.

## Basic Flow
1. FR1: A user on the login page can click "Forgot password" to enter their registered email address and request a reset link.
2. FR2: If the email matches a registered account, the system sends a reset link to that email; the link is valid for 30 minutes from send time. If the email does not match any account, the system shows the same generic confirmation message (no account-enumeration signal).
3. FR3: Clicking a valid, unexpired reset link takes the user to a form to enter and confirm a new password.
4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).
5. FR5: On successful password change, the system invalidates the reset link, invalidates all existing login sessions for that account, and displays a confirmation that the user can now log in with the new password.
6. FR6: If a reset link is expired or already used, the system shows an error and offers to send a new one (returning to FR1's flow).

## Postconditions
- On successful password change, the reset link and existing account login sessions are invalidated, and the user can log in with the new password.

## Business Objects
- Account
- Password Reset Link
- Password
- Login Session
