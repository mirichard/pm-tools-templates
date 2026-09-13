# A/B hybrid construction

C and D are cancelled. This is temporary evidence; delete before PR #1128 merges.

A removes only sourceRequirementId/sourceText from every step of the committed new UCS. Its top-level sourceRequirements catalog and all other fields are unchanged. B adds only those two fields to each old UCS step; no top-level catalog is added.

Both schemas validate (Ajv, strict:false). Structural diffs assert exactly two field deletions/additions per step and no other changes. Actual counts: A=10, B=8.

## Owner rationale (verbatim)

this is a synthetic test artifact, not a provenance claim about the original generation. FR4 was chosen because the step's precondition and postcondition both carry FR4's complexity-rule language, and classification reads those fields alongside the description. The step's description action corresponds to FR3; that ambiguity is documented and is a known limitation of this hybrid.

## Owner-approved mapping

```json
{
  "/basicFlow/steps/0": "FR1",
  "/basicFlow/steps/1": "FR2",
  "/basicFlow/steps/2": "FR3",
  "/basicFlow/steps/3": "FR4",
  "/basicFlow/steps/4": "FR5",
  "/alternativeFlows/0/steps/0": "FR2",
  "/alternativeFlows/1/steps/0": "FR4",
  "/exceptionFlows/0/steps/0": "FR6"
}
```

All sourceText values come from parser.originalText for the corresponding FR label in the unchanged password-reset-input.md, including numbering and punctuation. No source text is invented. Example:

4. FR4: A new password must be at least 12 characters and contain at least one letter and one number. If it does not meet these rules, the system rejects it and shows the specific unmet rule(s).
