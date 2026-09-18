# Requirements Input Template

Fill in the sections below with your natural language requirements.
Run `pm-requirements structure requirements-input.md` to convert to formal structure.

## Use Case ID
UC-XX

## Use Case Name
[Name of the use case, e.g., "Checkout Order"]

## Actors
- [Primary actor, e.g., "Customer"]
- [Secondary actor, if any, e.g., "System"]

## Preconditions
- [Condition that must be true before the use case begins]
- [e.g., "The customer must be logged in"]

## Basic Flow
1. [First step in the happy path, e.g., "Customer adds products to the shopping cart"]
2. [Second step, e.g., "System displays the number of items and total cost"]
3. [Continue numbering...]

## Alternative Flows
- [Describe deviations from the basic flow, e.g., "If the product is out of stock, the system displays an error message"]
- [e.g., "If the buyer selects credit card, system processes credit card payment"]

## Exception Flows
- [Describe error conditions, e.g., "If payment fails, the system prompts the user to change payment method"]

## Postconditions
- [State after successful completion, e.g., "The customer has completed the checkout process"]

## Business Objects
- [Optional: List key business entities, e.g., "Order", "Shopping Cart", "Product"]
- [This helps with consistency validation if you provide activity/state diagrams]

## Related Use Cases
- [Optional: References to other use cases, e.g., "UC-44: Process Credit Card Payment"]
