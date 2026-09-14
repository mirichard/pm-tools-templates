# Reviewed domain classifications

Parent: #711. Acceptance story: #740. Owner decisions: [confirmation](https://github.com/mirichard/pm-tools-templates/issues/740#issuecomment-5667449915).

| Asset | Reviewed domain | Primary purpose |
|---|---|---|
| API Documentation | Delivery | Structure and document a technical delivery interface |
| Problem Management Process | Uncertainty | Identify, investigate, mitigate, and resolve unexpected problems |
| Timesheet Tracking | Measurement | Record and summarize effort evidence |

The decisions are authoritative inputs in `meta/domain-review-decisions.json`. Mapping regeneration applies them after automatic rules; cross-reference regeneration uses the current domain while preserving the executed migration record. Canonical files, URLs, catalog aliases, original hashes, and migration manifests remain unchanged. Directory names can retain the earlier classification; domain navigation follows the current mapping.

The Uncertainty landing page now links directly to Problem Management. The Measurement landing page links directly to Timesheet Tracking. API Documentation remains a Delivery starting asset. These links and all six domain entry points are checked by `validate-domain-navigation.mjs`.

Current coverage: Stakeholder 11, Team 9, Delivery 67, Planning 8, Uncertainty 14, Measurement 28; total 137. Every domain exceeds the minimum of three. All three domain review decisions are complete. The remaining three `needs_review` flags concern value-flow classification, which the domain acceptance did not approve; they remain visible in `meta/needs-review.md`.

This classification change does not repair template content. The inherited defects remain tracked in #1145, #1156, and #1157. Body repairs still need an explicit integrity transition before modifying the original migrated content.
