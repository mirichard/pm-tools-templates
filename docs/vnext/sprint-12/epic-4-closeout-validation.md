# Epic 4 closeout validation

- Parent: #711
- Stories: #739 and #740
- Baseline: main after #1158 (`991cb72513d956cc49f5fed184cc6c6096b8a4a0`)

## Delivered controls

- Six performance-domain landing pages define purpose, boundaries, and three starting assets each.
- Root navigation exposes all six domains.
- The legacy-path policy defines canonical identifiers, external-integration behavior, indefinite current support, and the earliest permitted future removal window.
- Automated validation checks the minimum three-asset threshold, local landing-page links, domain classification of starting assets, root discoverability, and workflow cross-reference coverage.

## Coverage and classification evidence

The existing [domain coverage analysis](../../../meta/architecture-research/775-domain-coverage-report.md) supplies the methodology-by-domain type distribution, gap assessment, and a 20-asset consistency review. Its current primary-domain totals are:

| Stakeholder | Team | Delivery | Planning | Uncertainty | Measurement | Total |
|---:|---:|---:|---:|---:|---:|---:|
| 11 | 9 | 69 | 8 | 13 | 27 | 137 |

Every domain exceeds the three-asset minimum. The report records the two ambiguous classifications found in its sample and their disposition under the primary-use rule. Three additional low-confidence automated assignments remain visible in [`meta/needs-review.md`](../../../meta/needs-review.md); they are review candidates, not confirmed misclassifications, and must not be silently treated as human-approved classifications.

## Findability journeys

The validator exercises one landing-page journey per domain and at least three starting assets per journey:

| Entry point | Expected continuation |
|---|---|
| Stakeholder | Stakeholder analysis or business-case assets, then machine-readable related workflow assets |
| Team | Team charter, ceremony, or skills assets, then machine-readable related workflow assets |
| Delivery | Release, risk-board, or execution assets, then machine-readable related workflow assets |
| Planning | Budget, business-case, or charter assets, then machine-readable related workflow assets |
| Uncertainty | Risk, migration, or backlog assets, then machine-readable related workflow assets |
| Measurement | Assessment or pipeline-measurement assets, then machine-readable related workflow assets |

Legacy-entry journeys are independently enforced for all 137 moved assets by the migration post-check. Catalog integrations use canonical paths and retain all legacy aliases.

## Validation status

Local author validation must include the domain-navigation tests and validator, Sprint 10 validator, migration post-check, migration tests, metadata/link tests, and Markdown/link checks. PR CI and review remain required before closing #739. Issue #740 additionally requires human confirmation of the six findability journeys and disposition of the three remaining review candidates; automation is supporting evidence, not a substitute for that acceptance step. Issue #711 remains open until both stories close.
