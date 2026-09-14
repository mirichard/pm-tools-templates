# Completed A/B isolation experiment

Temporary evidence for #1116; delete this entire directory before PR #1128 merges. No fix is proposed or implemented.

## Construction and method

See hybrid-notes.md for the verbatim owner rationale and mapping. A removes only sourceRequirementId/sourceText from ten new-UCS steps; B adds only those fields to eight old-UCS steps, using exact parser originalText source lines. C/D were cancelled because decomposition and rephrasing could not be separated. The two schemas passed validation; persisted diffs record 20 removals and 16 additions respectively. All hybrids were pushed before use, and every result was pushed before its coverage was computed.

Classification alone used the existing NFRClassifier.classify interface with Gemini 2.5 Flash, both temperatures zero, traces disabled, and no attribute subset. Actual SDK generateContent invocations were counted before dispatch in call-ledger.json, including failures had any occurred. No pipeline generation or structuring calls were made. Expected and actual calls were A10 and B8 per run: 36 total, all completed, zero retries. Both pairs have a zero characteristic-count difference, so no third-run trigger applies.

## Individual measurements

### A run 1

Characteristics: compatibility, functional-suitability, interaction-capability, performance-efficiency, reliability, security.

Sub-characteristics: appropriateness-recognizability, authenticity, availability, confidentiality, faultlessness, functional-appropriateness, functional-completeness, functional-correctness, integrity, interoperability, learnability, operability, recoverability, resistance, self-descriptiveness, time-behaviour, user-assistance, user-error-protection.

Accountability: no. Assignments: 78. Calls: 10; cumulative: 10. Result commit: 132c5028d5aa194c34d72a79c56220d70317aa8e.

### A run 2

Characteristics: compatibility, functional-suitability, interaction-capability, performance-efficiency, reliability, security.

Sub-characteristics: appropriateness-recognizability, authenticity, availability, confidentiality, fault-tolerance, faultlessness, functional-appropriateness, functional-completeness, functional-correctness, integrity, interoperability, learnability, operability, resistance, self-descriptiveness, time-behaviour, user-assistance, user-error-protection.

Accountability: no. Assignments: 68. Calls: 10; cumulative: 20. Result commit: 348d53f73850abf4a5f2b5a828bb01edaab84023.

### B run 1

Characteristics: functional-suitability, interaction-capability, reliability, security.

Sub-characteristics: appropriateness-recognizability, authenticity, availability, confidentiality, fault-tolerance, faultlessness, functional-appropriateness, functional-completeness, functional-correctness, integrity, learnability, operability, recoverability, resistance, self-descriptiveness, user-assistance, user-error-protection.

Accountability: no. Assignments: 56. Calls: 8; cumulative: 28. Result commit: bba3404567b951e43a39ca66cd867298b6a75b29.

### B run 2

Characteristics: functional-suitability, interaction-capability, reliability, security.

Sub-characteristics: appropriateness-recognizability, authenticity, availability, confidentiality, fault-tolerance, faultlessness, functional-appropriateness, functional-completeness, functional-correctness, integrity, learnability, operability, recoverability, resistance, self-descriptiveness, user-assistance, user-error-protection.

Accountability: no. Assignments: 56. Calls: 8; cumulative: 36. Result commit: e92a58d4af6aef0bc7155bf5bcd2bddd8b861e96.

## Verdicts

V1 ADDED FIELDS: SUPPORTED as a contributor. A changes new baseline 4/4/4 to 6/6; B changes old baseline 8/6/8 to 4/4. Both directions support narrowing with the added fields. A recovers compatibility and performance-efficiency, but not the full historical coverage or accountability. This does not establish a sole cause or a universal deterministic effect.

V2+V3 COMBINED: unisolated. Because V1 is supported, elimination does not establish the combined upstream change as the remaining cause. Decomposition versus wording cannot be apportioned here. Separating them would require a controlled prompt/regeneration intervention, not observation of these artifacts; no such intervention was performed.

Accountability occurs in zero of four runs. B loses the historical old-UCS accountability; A does not restore it on the new UCS. Neither tested hybrid supplies the FDA overlay's accountability prerequisite. The precise model mechanism is undetermined.

## Not established

- Whether broader coverage indicates better classification quality.
- Whether the old or new decomposition is the more correct specification.
- Provider-side nondeterminism across days, and generalization beyond two trials per hybrid.
- Separate effects of the ID field versus the sourceText field, which were manipulated together.
- Decomposition versus wording or other upstream context differences.
- Why the model omitted accountability, or behavior on other providers, models, or domains.
- Historical provenance for the owner-approved FR4 mapping: it is explicitly synthetic and its FR3 action ambiguity remains documented.

## Scope

Only isolation evidence and its notes were changed by this experiment. No source, prompt, schema, neutral/FDA fixture, or PR metadata change was made. No remedy was implemented. Full final scope verification and criteria disposition are recorded in the issue checkpoint.
