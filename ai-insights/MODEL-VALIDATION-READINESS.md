# Risk-model validation prerequisites

Checkpoint: 09/25/2026. Acceptance authority: #1329; repairs: #1298;
representative evaluation: #1374. This document records unresolved inputs; it
does not approve criteria or redefine the recovery scope.

## Verified implementation state

- Initialization creates random weights; saved-model loading is commented out.
- Training is unimplemented and now rejects explicitly.
- The checked source includes a synthetic data generator. Project outcomes and
  risk severity are assigned randomly; these are not observed labels.
- No representative labeled dataset was found under the app's checked-in files.
- Existing scenario confidence thresholds and accuracy claims are not an agreed
  evaluation protocol. Passing hand-authored scenarios cannot establish calibration.

## Required decisions and materials

| Input | Needed before implementation or acceptance |
| --- | --- |
| Prediction target | Define the risk event, assessment time, forecast horizon, and meaning of low/medium/high/critical. Distinguish outcome severity from probability. |
| Representative data | Authorized project records, observed labels/outcomes, timestamps, provenance, population coverage, and missing-data rules. Identify the owner who can approve use. |
| Evaluation protocol | Agree the train/validation/test separation, project/time leakage controls, class coverage, baseline comparison, metrics and acceptance thresholds before training. |
| Calibration | Define how confidence will be evaluated and when low-confidence or out-of-distribution predictions must abstain. |
| Timeline rules | Define a tight schedule relative to scope/work/available capacity. Duration alone does not establish feasibility. Agree the trigger, severity and justified recommendation; no threshold is inferred from the 14/15-day fixtures. |
| Technology rules | Define supported stack-risk inputs and evidence. A list of technology names alone does not establish integration complexity or team proficiency. Agree the trigger and expected output. |
| Approval | Record the product decision owner and reviewer who accept these definitions and thresholds. Issue assignment does not establish approval. |

## Work after prerequisites are available

1. Implement input/label validation and versioned training with reproducible
   preprocessing, feature order, seeds and artifact provenance.
2. Implement artifact loading and verify identical predictions after save/reload
   and across independent instances of the same artifact. A fixed random seed is
   insufficient evidence of predictive validity.
3. Evaluate once against the reserved holdout using the agreed criteria, including
   subgroup coverage, calibration and uncertainty/abstention behavior.
4. Reconcile existing scenario assertions with approved criteria without hiding
   failures; obtain two consecutive complete passing runs and remaining #1329 gates.

Until then, the app stays withdrawn, metadata identifies unvalidated outputs,
and unresolved tests remain active. Synthetic fixtures may exercise the training
pipeline once implemented, but cannot satisfy representative evaluation acceptance.
