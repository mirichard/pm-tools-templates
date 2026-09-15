<!--
Draft GitHub Release body for tag v1.2.0-requirements-cli, mirroring the
structure of the v1.1.0-requirements-cli release
(https://github.com/mirichard/pm-tools-templates/releases/tag/v1.1.0-requirements-cli).
Paste the content below (without this comment) into the GitHub Release when
creating the tag; this file is a staging draft, not additional CLI
documentation, and is not referenced by the README.
-->

## Requirements Structuring & Validation CLI v1.2.0

LLM-assisted tool implementing the Li & Zheng (2025) framework for sprint teams to convert business requirements into testable specifications — now extended with NFR generation and ISO/IEC 25010 mapping.

### What's New in v1.2.0

**NFR Generation & ISO/IEC 25010 Mapping** (epic #1107)
- Classifies every FR/UCS step against a curated ISO/IEC 25010:2023 taxonomy (#1108)
- Generates deterministic NFR candidate statements from classification output, with explicit `[NEEDS INPUT: <name>]` placeholders for every unbound target, condition, or scope — no values are invented (#1109)
- New `generate-nfr` CLI command, also auto-run as a pipeline phase after UCS/tests/Gherkin generation (#1112)
- Curated pattern library with 40 neutral patterns plus 5 opt-in, additive domain overlays: `fda-21-cfr-11`, `hipaa`, `pci-dss`, `wcag-22`, `section-508` (#1115)
- Golden end-to-end reference example: recorded `neutral` and `pci-dss` captures of a password-reset feature, covering all eight pipeline artifacts through NFR generation (#1116)
- Based on: Almonte et al. (2025), *"Automated Non-Functional Requirements Generation in Software Engineering with LLMs: A Comparative Study"* — [arXiv:2503.15248](https://arxiv.org/abs/2503.15248)

**Source Requirement Traceability**
- The initial, source-driven UCS, test case, and Gherkin artifacts now carry the source requirement ID and text propagated from parsing on each step (#1139). Membership validation cannot detect a wrong-but-valid ID, so this is provenance labeling for review, not a guarantee the cited requirement is the one actually used. Legacy transformation without a source catalog does not claim provenance, and the optional feedback/refinement phase may alter or omit this metadata.

**Fixes**
- Negative Gherkin scenarios (invalid password, expired reset link) now assert the action that triggers their expected result, instead of asserting the outcome directly (#1168)
- NFR input validation accepts `null` for the step fields the generation prompts explicitly permit to be null (#1164)
- Terminal alternative/exception flows without a rejoin point now end the generated test case correctly (#1137)

**Known limitation**
- The `fda-21-cfr-11` and `hipaa` overlays have added no additional candidates on every capture measured so far: the classifier has not been observed to produce the `accountability` sub-characteristic they depend on since PR #1139. Whether this is a classifier limitation or reflects that no source tested to date contains an explicitly auditable requirement is unresolved — tracked in [#1163](https://github.com/mirichard/pm-tools-templates/issues/1163).

### Full Feature Set

- 6-phase pipeline with interactive review gates, plus an automatic NFR generation phase after Phase 2
- Multi-provider LLM: Gemini (free tier), Claude, OpenAI, any OpenAI-compatible endpoint
- Formal structuring per Equation 1, UCS template generation, test case generation (Algorithm 1)
- Consistency validation against activity diagrams (Rules 1 & 2) and state machines (Rule 3)
- 3-pass feedback loop: gap analysis, coverage expansion, implicit requirement discovery
- Gherkin/BDD `.feature` file generation (Cucumber, pytest-bdd, SpecFlow compatible)
- ISO/IEC 25010:2023 quality-attribute classification and NFR candidate generation, with opt-in domain overlays
- Source requirement traceability from input through the initial UCS and its generated test/Gherkin artifacts
- Human-readable Markdown reports
- 171 unit tests (up from 29 in v1.1.0)

### Getting Started

```bash
cd tools/requirements-structuring-cli
npm install
cp .env.example .env   # Add your GEMINI_API_KEY

# Full pipeline (NFR generation runs automatically after Phase 2):
npm start pipeline requirements-input.md -o ./output

# Or standalone, against an already-generated UCS file:
npm start -- generate-nfr ./output/requirements-input-ucs.json -o ./nfr-output
```

See [README](https://github.com/mirichard/pm-tools-templates/tree/main/tools/requirements-structuring-cli) for full documentation, including the [golden NFR fixture worked example](https://github.com/mirichard/pm-tools-templates/tree/main/tools/requirements-structuring-cli/examples/fixtures/nfr-golden).
