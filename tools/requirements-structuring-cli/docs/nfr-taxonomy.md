# NFR Taxonomy and Pattern Curation

Taxonomy structure and sub-characteristic descriptions are reconstructed from secondary/public sources, not the primary ISO/IEC 25010:2023 document (paywalled). REQUIRES human verification against the purchased standard before being treated as authoritative for a released product.

This library is a **review candidate** for #1115, part of #1107. No primary ISO
text was accessed or transcribed. The 9 characteristics and 40 sub-characteristics
reflect the recorded public-source reconstruction, not independently verified ISO
coverage. All entries remain `requires-human-verification` or
`REQUIRES_PRIMARY_REVIEW`. Passing tests establishes data integrity, not standards
accuracy. Keep PR #1120 in draft until the required human review is recorded.

## Files and versions

| File | Purpose |
| --- | --- |
| `data/nfr/taxonomy.json` | Public-source taxonomy, edition, per-entry citations and verification state |
| `data/nfr/patterns.json` | Neutral core: exactly one pattern per recorded sub-characteristic; framework bibliography |
| `data/nfr/overlays.json` | Separate, explicitly selected additive patterns and applicability notes |
| `schemas/nfr-*.schema.json` | Draft-07 structural contracts |
| `src/nfr-library.js` | Schema and relationship validation; immutable library selection |
| `src/nfr-overlays.js` | Existing #1112 registry interface, preserving name selection and neutral default |

The library revision is `0.1.0`, separate from the CLI package version. Both pattern
files declare their compatible `taxonomyRevision`; the loader requires matching
revisions. Framework references carry edition, URL and access date, and each
pattern identifies a section. Mutable regulatory references must be rechecked at
review time; an access date is not a frozen copy of a regulation.

## Pattern contract

Each pattern has a stable `<core-or-overlay>.<sub-characteristic>` identifier, one
parameterized requirement statement, a metric type and unit, a comparison
operator, measurement instructions, and provenance linking its taxonomy entry and
framework sections. The mappings and measurements are **curator-authored
proposals**, not quotations, normative ISO mappings or framework-prescribed
thresholds. Frameworks inform the measurement approach; they do not endorse these
particular patterns.

Every statement requires explicit `system`, `scope`, `conditions` and numeric
`target` bindings. `scope` identifies a frozen, nonempty assessment inventory.
`conditions` must supply the environment, workload or participant cohort,
observation window, oracle, aggregation and exclusions needed by the metric.
A ratio with an empty denominator is unavailable evidence, never a passing result.
No target has a default. Percentage success/coverage targets are bounded by 100;
percentage growth and degradation can exceed 100. Count targets must be bound to
whole units by a consuming generator. A low or zero target can be mathematically
valid yet unacceptable: stakeholders must approve its practical meaning.

The recoverability pattern measures restoration time (RTO). It does not silently
supply a recovery-point/data-loss objective (RPO); that constraint requires a
separate reviewed extension. The engagement metric is a provisional behavioral
proxy, not a universal measure of user experience. Safety cases require reviewed
hazards, safe-state predicates and an appropriate assurance process. Finite
security test corpora do not establish immunity to unknown attacks.

## Source approach

Taxonomy references remain separate from framework provenance. The bibliography
in `patterns.json` identifies the actual editions used:

- [ISTQB CTFL 4.0.1](https://istqb.org/wp-content/uploads/2024/11/ISTQB_CTFL_Syllabus_v4.0.1.pdf): test levels, types and measurement vocabulary.
- [Google SRE](https://sre.google/sre-book/service-level-objectives/): operational measurement, with separate chapter references for monitoring, testing, modularity and deployment.
- [NIST SP 800-34 Rev. 1](https://csrc.nist.gov/pubs/sp/800/34/r1/final): recovery objectives.
- [OWASP ASVS 5.0.0](https://github.com/OWASP/ASVS/tree/v5.0.0/5.0/en): security verification topics.
- [NIST SSDF 1.1](https://doi.org/10.6028/NIST.SP.800-218): reuse and executable testing practices.
- [WCAG 2.2](https://www.w3.org/TR/2024/REC-WCAG22-20241212/): accessibility concepts informing proposed interaction measurements.
- [NASA-STD-8739.8B](https://sma.nasa.gov/docs/default-source/policies/nasa-std-8739-8b.pdf): safety analysis and safe-state concepts, adapted without imposing NASA applicability on the neutral core.

Reviewers must assess whether each cited section adequately supports the proposed
metric. A general testing framework is not evidence that ISO prescribes a specific
metric. Retain uncertainty instead of inventing citations or treating a model's
recollection as evidence.

## Opt-in overlays

The default is `neutral`: exactly the 40 core patterns. Selecting one overlay adds
its pattern without changing or removing any core pattern. Current examples are
small review candidates, **not complete control libraries or compliance claims**:

| Selection | Included measure | Review boundary |
| --- | --- | --- |
| `fda-21-cfr-11` | Record-change audit coverage | [21 CFR 11.10(e)](https://www.ecfr.gov/current/title-21/chapter-I/subchapter-A/part-11/subpart-B/section-11.10); closed-system applicability and additional audit controls require review |
| `hipaa` | ePHI audit-event coverage | [45 CFR 164.312(b)](https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-C/part-164/subpart-C/section-164.312); risk-assessed event scope and examination capability require review |
| `pci-dss` | Post-authorization SAD retention | [PCI SSC FAQ 1154](https://www.pcisecuritystandards.org/faqs/1154/); target fixed to zero, subject to qualified scope review |
| `wcag-22` | Keyboard-operation coverage | WCAG 2.2 criterion 2.1.1; reviewed exceptions, target fixed to 100 |
| `section-508` | Keyboard-operation coverage for web content | [E205.4](https://www.access-board.gov/ict/) incorporates WCAG **2.0** A/AA; this pattern covers only criterion 2.1.1, target fixed to 100 |

GDPR and other domain examples can be added through the same curation process;
no GDPR overlay is registered in this revision. `--profile` remains an alias for
`--overlay`; conflicting selections fail. Multiple simultaneous overlays are not
part of the current CLI contract. No overlay is inferred from input text.

## Consumer boundary for #1108 and #1109

```js
const { loadNFRLibrary } = require('./src/nfr-library');
const neutral = loadNFRLibrary();
const accessibility = loadNFRLibrary({ overlay: 'wcag-22' });
// neutral.patterns: 40 core patterns
// accessibility.patterns: the same 40 plus one explicit overlay pattern
```

Results include revision, taxonomy, frameworks, accuracy notice, release status,
applicability and immutable patterns. Unknown overlays and invalid bundled data
throw errors. The loader makes no network or provider calls. Assets and curation
documentation are included in the npm package.

Classification (#1108) must select only the loaded taxonomy identities.
Generation (#1109) must select only an available pattern ID and bind its declared
parameters; record library revision, pattern ID, bindings, provenance and any
coverage gaps. Reject unknown IDs, extra or missing bindings, invalid units,
fractional counts and unreviewed applicability. Never generate substitute prose
outside the library when coverage is missing. Parameter rendering and candidate
review are follow-ups, not implemented by this data PR.

`generate-nfr --list-overlays` exposes registered selection names. The existing
command still writes a placeholder report: selecting an overlay records that
selection but does not yet generate requirements or call a provider.

## Curation and release review

1. Open a PR with the proposed taxonomy identity or pattern change, authoritative
   source edition, section and URL, plus an original paraphrase and explicit
   rationale for the measurement and mapping. Do not commit purchased ISO text.
2. Keep neutral requirements independent of industry mandates. Put legal scope,
   mandatory bounds and applicability notes in an additive overlay. Never replace
   or silently weaken a core pattern when selecting an overlay.
3. Supply one assessable statement with a reproducible metric, units, comparison,
   parameter definitions and measurement plan. Explain limitations and avoid
   arbitrary default thresholds. Add regression tests for new relationships and
   selection behavior, then run the commands below.
4. Use semantic revisions: patch for citations/wording that preserves meaning,
   minor for additive overlay coverage, major for changed IDs, meaning, units,
   bounds or incompatible contracts. Update both library revisions together;
   update `taxonomyRevision` when taxonomy data changes. Record the revision's
   rationale in the PR. Do not reuse retired IDs for different meanings.
5. A human with access to the purchased ISO/IEC 25010:2023 standard must check every
   characteristic, sub-characteristic and description, recording reviewer, date,
   standard edition, reviewed commit and dispositions on the PR. Framework and
   domain reviewers must also assess mappings, measurement sufficiency and legal
   applicability. Machine schema checks cannot replace these reviews.
6. Only a subsequent reviewed change may alter the verification flags and their
   schemas, with links to that evidence. This revision deliberately cannot express
   an approved release. Keep #1115 open and this PR draft until its authoritative
   taxonomy acceptance criterion is met; do not publish it as an authoritative NFR
   source or merge automatically.

From `tools/requirements-structuring-cli`:

```sh
npm ci
npm run validate:nfr-library
npm test
npm pack --dry-run
```

The tests exercise schema failures, coverage changes, provenance references,
parameter/metric consistency, overlay isolation, immutable results and the CLI's
selection behavior without credentials. Schema and relationship success reports
must retain the human-review limitation.
