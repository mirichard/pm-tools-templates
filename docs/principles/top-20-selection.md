# Top-20 Template Annotation Selection

## Status

Selection is prepared, but annotation is `BLOCKED` until the #741 taxonomy receives genuine independent approval.

No repository usage telemetry or download analytics were found. Therefore “high traffic” is operationalized transparently as the first 20 unique, existing records in the authoritative `templates/templates.json` catalog. That catalog drives the repository selector and its order is reproducible. This is a discovery-priority proxy, not a claim about measured traffic.

After approval, `scripts/validate-sprint-10.mjs --require-annotations` will require the three-field annotation block on precisely these files, confirm allowed taxonomy IDs, enforce uniqueness and a maximum of 10 frontmatter lines, and validate a one-sentence rationale.

The selected paths are generated and checked from the catalog rather than maintained as an unverifiable narrative list. A reviewer may approve a different evidence-backed ranking before annotation; that decision must be recorded as change control.

## Annotation contract

```yaml
primary_principles: ["value-focus"]
secondary_principles: ["evidence-based-decisions"]
principle_rationale: "Connects approved outcomes to traceable decisions and measures."
```

The block is three physical lines, machine-readable, and comfortably below the 10-line maximum.
