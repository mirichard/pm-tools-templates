# Epic 4 closeout validation

- Parent: #711
- Stories: #739 and #740
- Baseline: main after #1158 (`991cb72513d956cc49f5fed184cc6c6096b8a4a0`)

## Delivered controls

- Six performance-domain landing pages define purpose, boundaries, and at least three starting assets each.
- Root navigation exposes all six domains.
- The legacy-path policy defines canonical identifiers, external-integration behavior, indefinite current support, and the earliest permitted future removal window.
- Automated validation checks the minimum three-asset threshold, local landing-page links, domain classification of starting assets, root discoverability, and workflow cross-reference coverage, and the three named reviewed starting assets.

## Coverage and classification evidence

The historical [domain coverage analysis](../../../meta/architecture-research/775-domain-coverage-report.md) supplies the original methodology-by-domain distribution, gap assessment, and 20-asset consistency review. The [accepted classification review](../../../docs/domain-classification-review.md) supersedes its primary-domain totals; current counts from [`meta/domain-mapping.json`](../../../meta/domain-mapping.json) are:

| Stakeholder | Team | Delivery | Planning | Uncertainty | Measurement | Total |
|---:|---:|---:|---:|---:|---:|---:|
| 11 | 9 | 67 | 8 | 14 | 28 | 137 |

Every domain exceeds the three-asset minimum. The report records the two ambiguous classifications found in its sample and their disposition under the primary-use rule. The owner-approved domain decisions retain API Documentation in Delivery, classify Problem Management Process as Uncertainty, and classify Timesheet Tracking as Measurement. The three flags in [`meta/needs-review.md`](../../../meta/needs-review.md) now concern value-flow classification only; domain approval does not approve value flow.

## Findability journeys

The validator exercises one landing-page journey per domain and at least three starting assets per journey:

| Entry point | Expected continuation |
|---|---|
| Stakeholder | Stakeholder analysis or business-case assets, then machine-readable related workflow assets |
| Team | Team charter, ceremony, or skills assets, then machine-readable related workflow assets |
| Delivery | Release, risk-board, or execution assets, then machine-readable related workflow assets |
| Planning | Budget, business-case, or charter assets, then machine-readable related workflow assets |
| Uncertainty | Problem Management, risk, migration, or backlog assets, then machine-readable related workflow assets |
| Measurement | Timesheet Tracking, assessment, or pipeline-measurement assets, then machine-readable related workflow assets |

Legacy-entry journeys are independently enforced for all 137 moved assets by the migration post-check. Catalog integrations use canonical paths and retain all legacy aliases.

## Validation status

Local author validation must include the domain-navigation tests and validator, Sprint 10 validator, migration post-check, migration tests, metadata/link tests, and Markdown/link checks. Story #739 closed after #1165 merged and post-merge verification passed. The three domain decisions for #740 are approved and implemented in #1166; this does not approve the outstanding value-flow classifications. PR #1166 still requires CI, review, visual acceptance, merge, and post-merge verification before #740 closes. Human confirmation of the six findability journeys remains an acceptance requirement; automation is supporting evidence. Issue #711 remains open until both stories close.
