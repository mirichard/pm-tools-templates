# Revised A/B source-mapping discovery

C and D are cancelled by the owner. Revised budget: 40 live calls. Actual calls
made: 0. No hybrid was constructed or classified. This evidence is temporary;
remove it with the entire isolation directory before PR #1128 merges.

The parser reads explicit source labels FR1 through FR6 and retains the exact
original source line. attachSources requires an existing sourceRequirementId;
it does not derive one from a UCS stepId. Old steps predate that field.

## Old-step correspondence

| Old UCS path (stepId) | Source correspondence |
|---|---|
| /basicFlow/steps/0 (1) | FR1: requesting a reset link from the login page |
| /basicFlow/steps/1 (2) | FR2: registered-account email/link validity |
| /basicFlow/steps/2 (3) | FR3: clicking a valid link and entering the password form |
| /basicFlow/steps/3 (4) | AMBIGUOUS: entry/confirmation from FR3 and complexity-rule conditions from FR4 |
| /basicFlow/steps/4 (5) | FR5: link/session invalidation and confirmation |
| /alternativeFlows/0/steps/0 (2a1.1) | FR2: generic confirmation for an unmatched email |
| /alternativeFlows/1/steps/0 (4a1.1) | FR4: rejecting invalid passwords and showing unmet rules |
| /exceptionFlows/0/steps/0 (3b1.1) | FR6: expired/used link error and offer of a new link |

These are textual correspondences, not recovered historical provenance. Seven
have clear single-source counterparts. Step4 cannot be attributed uniquely
without selecting between two contributing requirements.

Exact source lines:

> 3. FR3: Clicking a valid, unexpired reset link takes the user to a form to enter and confirm a new password.

> 4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).

Exact old step4 text:

```json
{
  "stepId": "4",
  "actor": "User",
  "action": "Enters and confirms",
  "precondition": "User is on the new password entry form; The new Password meets complexity rules.",
  "postcondition": "System has received a new Password that meets complexity rules.",
  "description": "The User enters and confirms a new password for their Account to the System."
}
```

Selecting FR4 merely because stepId is4 would be inference, not an application
of the parse-time source-label scheme. Selecting FR3 would omit attribution of
the password-rule conditions. No mapping was guessed; no sourceText invented.

## Verified call counts and method

Actual baseline file counts: A(new)=7 basic+2 alternative+1 exception=10 steps;
B(old)=5 basic+2 alternative+1 exception=8 steps. Classification invokes one
chatJSON call per requirement unit, so expected calls per run are10 and8.
Two runs each would require36 calls if they succeeded without retries. These
are planning counts, not measurements. Actual invocations would be counted by
wrapping the existing Gemini model generateContent method at dispatch in a
throwaway script, enforcing the40-call cap and counting failed invocations too.
No repository code modification is needed. No live invocation was made.

The owner's instruction explicitly requires stopping if any old step cannot
be mapped without inference. The experiment is therefore blocked before hybrid
construction. No V1 verdict or elimination conclusion is supported yet.
