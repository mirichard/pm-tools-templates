# Step 3 feasibility finding

No live calls or hybrid classifications were performed. This is a construction
blocker, not a finding about V1/V2/V3 effects on the model.

The prescribed C/D construction and SC3 conflict: they require replacing step
wording/preconditions while also requiring decomposition to be the only changed
variable, distinct from V3 rephrasing.

Exact baseline evidence:

| Field | Old basic step 5 | New basic step 5 |
|---|---|---|
| precondition | System has received a new Password that meets complexity rules. | New Password has been successfully accepted and changed for the Account |
| action | Invalidates and displays | invalidate |
| businessObject | Password Reset Link, Login Session, Account | Password Reset Link |
| toActor | User | absent |
| description | The System invalidates the Password Reset Link and all active Login Sessions for the Account, then displays a confirmation message to the User. | The System invalidates the Password Reset Link. |

New basic step 6 has action `invalidate`, businessObject `Login Session`, and no
toActor. Its description is `The System invalidates all existing Login Sessions
for the Account.` New basic step 7 has action `display`, businessObject `Account`,
and toActor `User`. Its description is `The System displays a confirmation to the
User that they can now log in with the new password.`

C explicitly imports old step5 description/precondition/postcondition. That
changes the precondition wording/meaning in addition to merging steps. Keeping
other new-step5 fields unchanged leaves a composite description paired with only
`invalidate` / `Password Reset Link`, with no recipient. Copying old action,
businessObject and recipient as well would exceed the specified field changes.

D explicitly imports the new5/6/7 text. It similarly changes conditions and
wording in addition to splitting. Keeping old action/businessObject/recipient on
all three steps leaves `Invalidates and displays` and all three business objects
on every split step; replacing those fields with new values also changes them.

These JSON objects could be made syntactically valid, but schema acceptance
would not prove causal single-variable isolation. Under the current definitions,
C/D cannot establish a decomposition-only effect separate from V3. No assumption
about how to resolve this conflict was made. A/B's added-field interventions do
not have this particular confound, but no hybrids were constructed or used once
the all-four prerequisite was found blocked.

Expected calls from the prescribed step counts would be A10, B8, C8, D10 per run.
Actual calls made: 0. No measurement has been substituted for a result.
