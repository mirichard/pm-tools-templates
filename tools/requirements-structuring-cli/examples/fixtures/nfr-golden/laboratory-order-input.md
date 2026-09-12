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
2. Laboratory Buyer searches by product name or product identifier. System trims the search text and uses case-insensitive substring matching against those two catalog fields only; an empty search lists the catalog, and no match displays an empty result message. System displays matching products and availability while retaining the buyer's entered search text.
3. Laboratory Buyer adds available products to the Shopping Cart in state Cart; System displays the selected products and calculates the order total from catalog prices. Products without size/variant options have no size/variant control; only their quantity is editable.
4. Laboratory Buyer reviews the Shopping Cart using keyboard navigation and may edit only quantity and selected size/variant. Price, product identity, and shipping address are not editable once the product is added to the cart. System accepts quantity edits only when the quantity is a positive integer not exceeding available stock, and accepts size/variant edits only when the selection is a valid option for that product. System associates each editable field with its visible label and displays validation errors next to the affected field; an invalid edit is rejected and the previous valid value is retained.
5. Laboratory Buyer submits the Cart; System assigns an order identifier and records the transition Cart to Submitted. A reviewer with the Reviewer role clicks "Start Review" on a Submitted order; this is the only action that moves Submitted to Under Review. No automatic or time-based trigger exists for that transition.
6. System audits every order state transition with order identifier, actor identity, timestamp, from-state and to-state. System also audits every field edit during a correction cycle with order identifier, actor identity, timestamp, field name, old value, new value and the correction flag it responds to. Submitted reviewer comments are immutable entries in this Audit Record; no buyer or reviewer may modify or delete them.
7. Order Reviewer opens the Under Review Order; System verifies reviewer permission and displays the order and its Audit Record without allowing the reviewer to alter historical audit entries.
8. In Under Review, Order Reviewer either approves the Order (transition to Approved) or returns it (transition to Returned for Correction). For a return, the reviewer must select one or more order-line fields from the fixed editable list quantity and size/variant, identifying the line item and field, and supply a required nonempty single-sentence comment per flag. Size/variant cannot be flagged for a product without variants. Each flag has an identifier tied to its order, line item, field and correction cycle. Approval comments are optional; if supplied, they must also be nonempty single-sentence comments. Comments accept plain text without line breaks and are limited to 500 characters; longer comments are rejected without submitting the decision. System records the reviewer identity, decision, flags and submitted comments immutably.
9. Once the Order is Approved, System makes a read-only HTML receipt available for download from the order workspace. The receipt remains available while the Order record exists, including after Fulfilled; this example has no order-deletion or receipt-expiry operation. The fulfillment system sends a shipment-confirmation webhook to the order service with the approved order identifier. The order service processes this webhook as the sole trigger for Approved to Fulfilled; no manual override exists. Only Approved orders can be fulfilled.

## Alternative Flows
- If the catalog search service is unavailable, System keeps the search criteria and shows a service-unavailable message; Laboratory Buyer can retry without re-entering the criteria.
- If stock changes before submission, System identifies the unavailable product and preserves the remaining Shopping Cart for editing instead of submitting an incomplete order.
- If an Order submission is interrupted after saving, System retrieves the saved Order by its request identifier when Laboratory Buyer retries and returns that Order instead of creating a duplicate.
- If Order Reviewer returns an Order for correction, only the explicitly flagged line-item fields become editable for that correction cycle; all other fields remain locked. Quantity and size/variant edits obey the same stock and valid-option checks; price, product identity, and shipping address remain locked. Resubmission is rejected until every flagged field has been edited with a valid value; each such edit clears its flag, and System checks that all flags are cleared before allowing Returned for Correction to Resubmitted. Once all flags are cleared and Laboratory Buyer submits the corrections, System records Returned for Correction to Resubmitted and then Resubmitted to Under Review. Any reviewer with the Reviewer role may handle the resubmission, not only the original reviewer. Until that submission, the Order remains Returned for Correction. Earlier decisions, reviewer identities, comments, flags, correction-cycle identifiers and state-transition history remain immutable audit entries; a new review appends a new decision rather than replacing any earlier one.

- Laboratory Buyer may cancel their Order only from Cart, Submitted or Under Review; System records the transition to Cancelled. Cancellation from Returned for Correction, Resubmitted, Approved or Fulfilled is rejected without changing the state. Cancelled and Fulfilled are terminal states.
- The only permitted lifecycle transitions are Cart to Submitted, Submitted to Under Review, Under Review to Returned for Correction or Approved, Returned for Correction to Resubmitted, Resubmitted to Under Review, Approved to Fulfilled, and the cancellation transitions specified above; all other transitions are rejected.

## Exception Flows
- If account verification fails, System denies access and displays an authentication failure message without exposing another laboratory's orders.
- If an Audit Record cannot be saved, System rejects the associated order-state change or correction-field edit, retains the previous state or field value, and reports that the action was not completed.
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
