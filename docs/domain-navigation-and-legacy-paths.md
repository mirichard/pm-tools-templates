# Domain navigation and legacy-path support

The six performance domains are the maintained outcome-oriented entry points for the repository. Canonical template locations are recorded in `templates/templates.json`; a record's `canonical_path`, or `path` when no canonical path is present, is authoritative.

## Domain entry points

| Domain | Use it for |
|---|---|
| [Stakeholder](../domains/stakeholder/) | Identification, engagement, and audience-focused communication |
| [Team](../domains/team/) | Team formation, collaboration, skills, and ceremonies |
| [Delivery](../domains/delivery/) | Delivery approach, execution, quality, and work coordination |
| [Planning](../domains/planning/) | Strategy, scope, schedule, budget, and resources |
| [Uncertainty](../domains/uncertainty/) | Risks, opportunities, issues, and contingencies |
| [Measurement](../domains/measurement/) | Progress, status, health, outcomes, and maturity |

The [domain taxonomy](../meta/architecture-research/772-performance-domain-taxonomy.md) defines scope boundaries and cross-domain rules. The [template index](../TEMPLATE_INDEX.md) and [interactive browser](../templates/index.html) remain supported discovery paths.

## Bookmarks and external integrations

- Domain classification is maintained in `meta/domain-mapping.json`; reviewed decisions are recorded in `meta/domain-review-decisions.json`. A later reclassification preserves the canonical URL, so its directory name can reflect an earlier classification. Use domain landing pages and mapping metadata for discovery.
- The curated catalog also exports each template's primary `domain` as one of `Stakeholder`, `Team`, `Delivery`, `Planning`, `Uncertainty`, or `Measurement`. Run `node scripts/sync-catalog-domains.js` after classification changes. Reviewed decisions take precedence over mapping records; unmapped additions must declare an explicit top-level domain scalar in front matter. The command checks catalog paths and aliases without rewriting them or inferring classification from directory names. Missing or conflicting classifications fail before any catalog write. `node scripts/sync-catalog-domains.js --check` and the curated-template validator detect missing or stale exports.
- Existing legacy file URLs remain supported as lightweight navigation documents pointing to the maintained canonical file.
- New bookmarks and documentation should use canonical paths.
- Integrations should read `templates/templates.json`, prefer `canonical_path` when present, and treat `alternate_paths` as compatibility aliases. Integrations must not infer canonical identity from directory enumeration.
- Release tags are immutable; links pinned to a tag retain that release's structure.

## Support and deprecation timeline

There is no scheduled removal date for the 137 migration-era legacy paths. They remain supported through vNext and at least the next major release.

Any future removal requires all of the following:

1. Usage or feedback evidence shows the path is no longer materially used.
2. A deprecation notice identifies every affected path and replacement in release notes and this document.
3. The notice remains published for at least two releases and 180 days, whichever is longer.
4. Automated link, catalog-alias, and external-bookmark checks pass before and after removal.

Until those conditions are met, legacy pointers and catalog aliases are part of the compatibility contract, not cleanup candidates.

## Validation

`node scripts/validate-domain-navigation.mjs` verifies minimum coverage, all six domain landing pages, their local links, three domain-matched starting assets per domain, root discoverability, and workflow cross-reference coverage. Migration validation separately verifies every legacy pointer and canonical destination.
