# Requirements Input Template

## Use Case ID
UC-01

## Use Case Name
Add Item to Cart and Checkout Order

## Actors
- Customer
- System

## Preconditions
- The customer must be logged in on the system

## Basic Flow
1. Customer adds products into the shopping cart.
2. Shopping cart displays the number of items and the total cost.
3. Customer adds or removes products from the shopping cart prior to checkout.
4. Customer checks out the order.
5. Customer confirms the order.
6. Customer updates the order if needed.
7. Customer receives a confirmation email with specific order details.

## Alternative Flows
- If the product is out of stock, the system displays an error message.
- If the order is incorrect, the system displays an error message.
- If the order is incorrect, the system allows customers to cancel the unpaid order and place a new one.
- If payment fails, the system prompts the customer to retry the payment.
- If payment fails, the system suggests alternative payment methods.
- If the order revision is attempted after a set deadline, the system displays a notification that revisions are no longer allowed.
- If there is an email delivery failure, the system displays an error message and prompts the customer to check their email settings.

## Exception Flows
- If payment fails after retry, the system cancels the transaction.

## Postconditions
- The customer has completed the checkout process and received a confirmation email.

## Business Objects
- Shopping Cart
- Product
- Order
- Invoice
- Account

## Related Use Cases
- UC-44: Process Credit Card Payment
- UC-105: Handle Returned Goods
