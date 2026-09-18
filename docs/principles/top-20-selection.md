# Top-20 Template Annotation Selection

## Status

Selection and annotation are `PASS`. The repository owner approved all content on 2026-09-02 after reviewing the candidate work, unblocking #741 and the dependent annotations.

No repository usage telemetry or download analytics were found. Therefore “high traffic” is operationalized transparently as the first 20 unique, existing records in the authoritative `templates/templates.json` catalog. That catalog drives the repository selector and its order is reproducible. This is a discovery-priority proxy, not a claim about measured traffic.

`scripts/validate-sprint-10.mjs --require-annotations` requires the three-field annotation block on precisely these files, confirms allowed taxonomy IDs, enforces uniqueness and a maximum of 10 frontmatter lines, and validates a one-sentence rationale. The strict validation passes for all 20.

The selected paths are generated and checked from the catalog rather than maintained as an unverifiable narrative list. A future evidence-backed ranking change must be recorded through change control.

## Annotation contract

```yaml
primary_principles: ["value-focus"]
secondary_principles: ["evidence-based-decisions"]
principle_rationale: "Connects approved outcomes to traceable decisions and measures."
```

The block is three physical lines, machine-readable, and comfortably below the 10-line maximum.
