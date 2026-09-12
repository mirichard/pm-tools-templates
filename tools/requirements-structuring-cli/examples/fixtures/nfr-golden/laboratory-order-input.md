# Requirements Input Template

## Use Case ID
UC-LAB-ORDER

## Use Case Name
Place and Review a Laboratory Supply Order

## Actors
- Laboratory Buyer
- Order Reviewer
- System

## Preconditions
- The Laboratory Buyer has an active account associated with a laboratory.
- The laboratory administrator has assigned the buyer permission to create orders.
- Products have catalog records with availability and handling instructions.
- This synthetic example concerns electronic order records reviewed for an opt-in audit scenario; it contains no real patient or payment data.

## Basic Flow
1. Laboratory Buyer signs in using their assigned account; System validates the account before granting access to the laboratory's order workspace.
2. Laboratory Buyer searches the catalog; System displays matching products and availability while retaining the buyer's entered search criteria.
3. Laboratory Buyer adds available products to the Shopping Cart; System displays the selected products and calculates the order total from catalog prices.
4. Laboratory Buyer reviews the Shopping Cart using keyboard navigation and may edit only quantity and selected size/variant. Price, product identity, and shipping address are not editable once the product is added to the cart. System accepts quantity edits only when the quantity is a positive integer not exceeding available stock, and accepts size/variant edits only when the selection is a valid option for that product. System associates each editable field with its visible label and displays validation errors next to the affected field; an invalid edit is rejected and the previous valid value is retained.
5. Laboratory Buyer submits the order for review; System saves the Order as awaiting review and assigns an order identifier.
6. System records the order submission and each subsequent order change in the Audit Record with actor identity, event time, affected order identifier, and the previous and new field values.
7. Order Reviewer opens the awaiting-review Order; System verifies reviewer permission and displays the order and its Audit Record without allowing the reviewer to alter historical audit entries.
8. Order Reviewer approves or returns the Order with a review comment; System records the review decision and actor identity and changes the Order state accordingly.
9. System makes the order receipt available for download; Laboratory Buyer retrieves the receipt from the order workspace.

## Alternative Flows
- If the catalog search service is unavailable, System keeps the search criteria and shows a service-unavailable message; Laboratory Buyer can retry without re-entering the criteria.
- If stock changes before submission, System identifies the unavailable product and preserves the remaining Shopping Cart for editing instead of submitting an incomplete order.
- If an Order submission is interrupted after saving, System retrieves the saved Order by its request identifier when Laboratory Buyer retries and returns that Order instead of creating a duplicate.
- If Order Reviewer returns an Order for correction, only fields flagged by that reviewer as needing correction may be edited; all other fields remain locked. Editable cart fields remain restricted to quantity and selected size/variant, with the same quantity and valid-option checks; price, product identity, and shipping address remain locked. Laboratory Buyer corrects the flagged editable fields and resubmits the Order; System preserves the prior review decision and records the correction in the Audit Record.

## Exception Flows
- If account verification fails, System denies access and displays an authentication failure message without exposing another laboratory's orders.
- If an Audit Record cannot be saved, System rejects the associated order-state change, retains the previous state, and reports that the action was not completed.
- If the client disconnects while downloading a receipt, Laboratory Buyer can request the stored receipt again without changing the approved Order.

## Postconditions
- Each submitted Order is retrievable in its recorded review state.
- The Order and its Audit Record retain the actor and change history for each completed state transition.
- No approval is represented as complete unless its audit entry was saved.

## Business Objects
- Account
- Product
- Shopping Cart
- Order
- Audit Record
- Receipt

## Related Use Cases
- UC-LAB-ACCOUNT: Administer laboratory account permissions
- UC-LAB-CATALOG: Maintain the laboratory supply catalog
