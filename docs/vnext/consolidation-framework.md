# Consolidation Decision Framework
> **Story:** #717 (Redundancy Detection) | **Epic:** #707 (Repository Audit & Mapping)
> **Purpose:** Standardized criteria for resolving asset duplication and overlap

---

## Consolidation Action Types

| Action | Definition | When to Apply |
|--------|-----------|---------------|
| **KEEP** | Designate as canonical; enhance in place | Best-in-class asset for its purpose |
| **MERGE** | Combine content from duplicates into canonical | Duplicates contain unique value not in canonical |
| **REDIRECT** | Replace with pointer to canonical location | Exact or near-exact duplicate in wrong location |
| **ARCHIVE** | Move to `_archive/` with deprecation notice | Outdated but has historical/reference value |
| **DELETE** | Remove from repository | No unique value; generated artifacts, build output |

## Canonical Selection Criteria

When multiple assets serve the same purpose, select the canonical asset using these criteria (in priority order):

1. **Structural Fit** — Does the asset live in the correct domain directory per the vNext taxonomy?
2. **Completeness** — Which version has the most complete content (sections, examples, guidance)?
3. **Recency** — Which version was most recently updated (git blame/log)?
4. **Naming Convention** — Which follows `kebab-case.md` naming standard?
5. **Cross-Reference Density** — Which is referenced by other assets or README files?
6. **Maintainability** — Which is easier to maintain going forward (less nesting, clearer structure)?

## Conflict Resolution

- If two assets score equally, prefer the one in the **deeper, more specific** directory (e.g., `role-based-toolkits/scrum-master/` over `templates/agile/`)
- If content is genuinely complementary, **MERGE** into the canonical location
- Never delete without first confirming no inbound references exist

## Duplication Severity Levels

- **S1 — Exact Duplicate**: Identical or near-identical content in multiple locations
- **S2 — Structural Duplicate**: Same purpose/topic, different content depth or format
- **S3 — Overlap**: Partially overlapping scope; assets serve related but distinct purposes
- **S4 — Naming Collision**: Different content, confusingly similar names/paths

---

*Framework created as part of Task #765. Applied in duplication-elimination-map.md (Task #766).*
