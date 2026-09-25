# Dependency extraction feasibility check

Issue: https://github.com/mirichard/pm-tools-templates/issues/1379
Date: 09/25/2026. Exploratory development result, not held-out evaluation.

## Result

On one complete SCHEDBench example, the assistant extraction and a simple
before/after parser produced the same 48 directed dependencies across 32 activities
(30 tasks and two milestones). Both produced identical earliest starts and an
unlimited-resource lower bound of 50 abstract time units. No new dependency was
inferred: all 48 relationships are explicit in the source.

The topological calculation matched a separately implemented iterative relaxation.
A hand-solvable fork/join example returned 8. Cycles, missing durations and unknown
activities were rejected. These checks establish narrow mechanics, not general
scheduling reliability. Resource requirements remain in the source but are not
enforced by this experiment. The 50-unit result is NOT a feasible RCPSP schedule,
an optimum, a calendar completion date or a comparison against the source's bks.

## Method and limits

Downloaded 1,132 benchmark records and selected the first RCPSP-SM/easy record
in file order (instance 1, source instance j3010_8.sm). Inspected three candidate
records but executed only this first complete case. The other records are not
held-out tests. The source is a generated construction-themed benchmark, not an
actual construction plan. Domain labels do not validate activity sequencing.

The assistant in this conversation authored assistant-extraction.json from the
source text before running the parser. This is a saved conversational extraction,
not a separately invoked/version-pinned model experiment. No model API call,
repeated trial, model-latency measurement or cost comparison was performed.
There was no independent reference annotator or PM participant.

The parser shares the assistant-produced task names and durations; the comparison
isolates relationship extraction only. Its rules were written after viewing this
development case. It is not an independent gold standard, nor a held-out baseline.
Source-line checks verify that named activities and durations occur in cited lines;
they do not independently prove semantic correctness. The initial duration-span
validator missed the phrasing 'duration of <name> is <number>'; the validator was
corrected, with no changes to the saved extraction values.

Run: `python ai-insights/research/1379-feasibility/check.py` (Python 3 standard
library only). This reproduces parser/calculation results from the saved extraction;
it does not rerun a model. Results are written to results.json.

## Decision

No demonstrated AI advantage on this case. Keep UI work paused. Do not interpret
parser/model agreement as accuracy or PM superiority. Before a further comparative
experiment, freeze the baseline and model procedure and obtain unseen material
with independently reviewed relationships. Distinguish understanding explicitly
stated constraints from finding genuinely missing dependencies. Evidence needed
for the latter, plus independent reviewers, remains unavailable.

## Source and attribution

Shrenil Shaun Sharma and Avi Sharma, *SCHEDBench: A Benchmark for Evaluating LLM
Constraint Faithfulness in Natural-Language Combinatorial Scheduling* (2026).
https://arxiv.org/abs/2608.00991

Dataset: https://huggingface.co/datasets/SCHEDBench/SCHEDBench
Downloaded 09/25/2026 from
https://huggingface.co/datasets/SCHEDBench/SCHEDBench/resolve/main/SCHEDBench-v1.jsonl
Full downloaded JSONL SHA-256:
`c413f3c1c514decd46acbfd4b6706451c7cc58a39903264601ae64ceb50cfce2`.

The publisher's dataset card declares CC BY 4.0 for the released natural-language
renderings: https://creativecommons.org/licenses/by/4.0/
case.json preserves one record's field values, with JSON formatting changed.
assistant-extraction.json is a derived structured extraction. Retain attribution
and the CC BY 4.0 notice for these data; the repository's MIT license does not
relicense them. No canonical PSPLIB source matrix is redistributed. The benchmark
attributes the underlying instance family to Kolisch and Sprecher (1997);
original benchmark sources retain their own terms.

No DSLIB data are included. Its source suitability and reuse questions remain
separately documented in #1379. No application behavior or restoration gate changes.
