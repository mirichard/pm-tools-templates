# Coverage diagnostic findings (#1116)

Temporary evidence, not a golden fixture or a fix. Delete this entire diagnostic
directory in a later cleanup task before PR #1128 merges.

## Method and budget

Existing modules were invoked from a throwaway script, with Gemini
`gemini-2.5-flash`, structure/creative temperatures both 0, traces disabled,
and no NFR_ATTRIBUTES subset. Every actual SDK generateContent invocation was
counted in call-ledger.json before dispatch; failed calls would count too.
No repository source, prompt or schema was edited. No ambiguity call was needed.
Regeneration: 3 calls (structure, correction, UCS). New classification: 10+10+10.
Old classification: 8+8+8. Total: 57/70, all completed, no retries or failures.
Each full result was committed and pushed before analysis.

## Upstream comparison

Old basic/alternative/exception steps: 5/2/1; new: 7/2/1.
Old basic step5 bundled invalidating the reset link, invalidating sessions, and
showing confirmation. New steps5,6,7 split that into three actions. Basic4 changed
from User entering/confirming a password to System accepting a password, with the
exact quantified constraint in its precondition. Both new traceability fields
appear on all10 steps. New basic4/5/6 omit toActor; old basic4/5 had it.
Description+precondition+postcondition characters: old2035/new1990.
All string-valued step-field characters, including IDs/sourceText: old2360/new4277.
These are raw character counts, not token counts. Complete per-step keys/text are
in upstream-diff.txt; aligned verbatim text is in step-text-comparison.md.

## Classifier request

The source constructs units without projecting step fields:

```js
const units = data.basicFlow.steps.map((step, index) => ({ path: `/basicFlow/steps/${index}`, step, flow: null }));
```

The actual request is:

```js
const context = { useCaseId: data.useCaseId, useCaseName: data.useCaseName,
  intent: data.intent, role: data.role, preconditions: data.preconditions,
  postconditions: data.postconditions, businessObjects: data.businessObjects };
userPrompt: JSON.stringify({ context, requirement: unit,
  taxonomy: { revision: taxonomy.revision, standardEdition: taxonomy.standardEdition,
    accuracyNotice: taxonomy.accuracyNotice, characteristics } }),
```

Thus all step fields, including sourceRequirementId and sourceText when present,
are sent. Branch context includes flowId, deviationPoint, triggerCondition, and
optional rejoinPoint. Top-level sourceRequirements is not explicitly included.
Classifier, classification prompt08, input validator, and taxonomy bytes match
the original neutral-capture commit57eb4721. Their hashes are recorded in
classifier-history.json. git show fba39481 (#1139) for classifier/prompt08 was empty;
latest changes to those paths were #1132 and #1123.

## Six runs (individual results, no averages)

- new-1: characteristics `["functional-suitability", "interaction-capability", "reliability", "security"]`; sub-characteristics `["appropriateness-recognizability", "authenticity", "confidentiality", "functional-appropriateness", "functional-completeness", "functional-correctness", "integrity", "learnability", "operability", "recoverability", "resistance", "self-descriptiveness", "user-assistance", "user-error-protection"]`; accountability **False**; assignments **53**; input SHA256 `1279e5ecccb0bb8be3701e377b151e815cc42e1c51db9782e98a1a491e2d749a`.
- new-2: characteristics `["functional-suitability", "interaction-capability", "reliability", "security"]`; sub-characteristics `["appropriateness-recognizability", "authenticity", "confidentiality", "functional-appropriateness", "functional-completeness", "functional-correctness", "integrity", "learnability", "operability", "recoverability", "resistance", "self-descriptiveness", "user-assistance", "user-error-protection"]`; accountability **False**; assignments **62**; input SHA256 `1279e5ecccb0bb8be3701e377b151e815cc42e1c51db9782e98a1a491e2d749a`.
- new-3: characteristics `["functional-suitability", "interaction-capability", "reliability", "security"]`; sub-characteristics `["appropriateness-recognizability", "authenticity", "confidentiality", "functional-appropriateness", "functional-completeness", "functional-correctness", "integrity", "learnability", "operability", "recoverability", "resistance", "self-descriptiveness", "user-assistance", "user-error-protection"]`; accountability **False**; assignments **53**; input SHA256 `1279e5ecccb0bb8be3701e377b151e815cc42e1c51db9782e98a1a491e2d749a`.
- old-1: characteristics `["compatibility", "flexibility", "functional-suitability", "interaction-capability", "maintainability", "performance-efficiency", "reliability", "security"]`; sub-characteristics `["accountability", "analysability", "appropriateness-recognizability", "authenticity", "availability", "confidentiality", "fault-tolerance", "faultlessness", "functional-appropriateness", "functional-completeness", "functional-correctness", "integrity", "interoperability", "learnability", "non-repudiation", "operability", "recoverability", "resistance", "scalability", "self-descriptiveness", "testability", "time-behaviour", "user-assistance", "user-error-protection"]`; accountability **True**; assignments **70**; input SHA256 `2da689ea9d1a29e3f6b46132062ccdf3ca18e0ca551555e93dffa1c4020ad7ec`.
- old-2: characteristics `["compatibility", "functional-suitability", "interaction-capability", "performance-efficiency", "reliability", "security"]`; sub-characteristics `["accountability", "appropriateness-recognizability", "authenticity", "availability", "confidentiality", "fault-tolerance", "faultlessness", "functional-appropriateness", "functional-completeness", "functional-correctness", "inclusivity", "integrity", "interoperability", "learnability", "non-repudiation", "operability", "recoverability", "resistance", "self-descriptiveness", "time-behaviour", "user-assistance", "user-error-protection"]`; accountability **True**; assignments **64**; input SHA256 `2da689ea9d1a29e3f6b46132062ccdf3ca18e0ca551555e93dffa1c4020ad7ec`.
- old-3: characteristics `["compatibility", "flexibility", "functional-suitability", "interaction-capability", "maintainability", "performance-efficiency", "reliability", "security"]`; sub-characteristics `["accountability", "analysability", "appropriateness-recognizability", "authenticity", "availability", "confidentiality", "fault-tolerance", "faultlessness", "functional-appropriateness", "functional-completeness", "functional-correctness", "integrity", "interoperability", "learnability", "non-repudiation", "operability", "recoverability", "resistance", "scalability", "self-descriptiveness", "testability", "time-behaviour", "user-assistance", "user-error-protection"]`; accountability **True**; assignments **72**; input SHA256 `2da689ea9d1a29e3f6b46132062ccdf3ca18e0ca551555e93dffa1c4020ad7ec`.

Accountability: 3 of6 runs, exclusively old controls, always /basicFlow/steps/0.
All nine characteristics were considered in all six runs.

## Verdicts

- H1 UPSTREAM SHIFT: SUPPORTED for observed decomposition/content change beyond
  traceability fields. 8→10 is explained by the step5 split. This is consistent
  with #1139 changing the upstream prompts/payloads, but one regeneration does
  not prove the prompt change alone caused that decomposition.
- H2 CLASSIFIER-INPUT CHANGE: NOT SUPPORTED **as its stated old-UCS control
  prediction of a systematic coverage shift under current code**. Old controls
  retain 8/6/8 coverage, versus historical8, rather than persistent4; relevant
  classifier code/prompt/taxonomy are byte-identical. The new UCS DOES change the
  actual request, including sourceText; its individual causal contribution is
  not isolated from other changed text, context, and decomposition. This verdict
  does not deny that verified payload difference.
- H3 MODEL VARIANCE: SUPPORTED. Identical old input yields 8/6/8 coverage and
  70/64/72 assignments. Identical new input yields 4/4/4 coverage and53/62/53
  assignments. Run-to-run variation exists, but these runs do not establish
  that variance alone explains an8→4 coverage swing on identical input.

The deterministic reason for zero FDA additions is absence of an accountability
assignment: all three new handoffs add zero overlay candidates; all three old
handoffs add fda-21-cfr-11.accountability at /basicFlow/steps/0. New core/FDA
counts are53/53,62/62,53/53; old counts70/71,64/65,72/73. The model's exact reason
for omitting accountability is undetermined. The first-step action is similar
across inputs, so the count increase alone cannot explain that omission.

## Unknowns and limits

The causal contributions of sourceText, changed action/actor, per-step conditions,
use-case/flow context, and decomposition were not isolated. Provider backend
revision or serving nondeterminism is not known. Three runs per input do not
establish probabilities or behavior on other providers, models or requirements.
There are no independently labelled correct attribute assignments, so broader
coverage is not established to be more correct. The earlier lost regenerated UCS
was not recovered; this is a newly committed experimental baseline.
No fix or remedy is proposed or implemented.
