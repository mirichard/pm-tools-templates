# Documentation Scan Baseline Triage

## Purpose

This project management repository baseline records the findings produced after repairing the documentation scanner under issue #1052. It prevents the scanner execution defect from being confused with content findings and provides a controlled follow-up path without weakening detection rules.

## Baseline

The repaired scanner ran against commit `52bd3f199531ad568863a14eaebab3db143894ff`, which contains the Sprint 10 recovery changes from PR #1051 and the sensitive-information scanner repair from PR #1070.

| Classification | Rule | Findings | Disposition |
|---|---|---:|---|
| Security review | `doc-sec-privateIP` | 56 | Separately tracked for validation and remediation |
| Security review | `doc-sec-credentials` | 40 | Separately tracked for validation and remediation |
| Security review | `doc-sec-envHosts` | 26 | Separately tracked for validation and remediation |
| Security review | `doc-sec-awsSecrets` | 8 | Separately tracked for validation and remediation |
| Relevance review | `doc-relevance-keywords` | 198 | Separately tracked for relevance-policy review |

These are pattern matches, not confirmed disclosures. No match is allowlisted by this record. Any future allowlist entry requires a specific rationale in `doc-sec-allowlist.txt` and review through the normal pull-request process.

## Sprint 10 rescan

The first repaired run identified one relevance warning in `docs/principles/self-assessment.md`. The document was updated to state its project management context. The final local rerun found zero findings in the Sprint 10 paths. The pull-request workflow must retain `doc-scan.sarif` plus `scan-stats.json` as artifacts.

## Closure conditions

- Retain the complete SARIF and statistics artifacts from the repair pull request.
- Use #1071 for baseline validation and remediation.
- Do not treat an exit code of `1` as content findings; it means the scanner could not complete reliably.
- Do not close baseline triage based only on aggregate counts; disposition must be traceable to the individual SARIF results.
