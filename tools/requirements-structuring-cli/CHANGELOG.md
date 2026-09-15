# Changelog

All notable changes to the Requirements Structuring & Validation CLI are documented here.

## [1.2.0] — 2026-09-15

### Added

- **NFR Generation & ISO/IEC 25010 Mapping** (epic #1107): infers non-functional requirements from the FR/UCS the pipeline already produces, based on Almonte et al. (2025) *"Automated Non-Functional Requirements Generation in Software Engineering with LLMs: A Comparative Study"* — [arXiv:2503.15248](https://arxiv.org/abs/2503.15248).
  - **Attribute classification** (#1108): classifies every FR/UCS step against a curated ISO/IEC 25010:2023 taxonomy; new module `src/nfr-classifier.js`, versioned handoff contract (`<base>-nfr-classifications.json`).
  - **NFR candidate generation** (#1109): deterministic, template-based candidate rendering from classification output; every unsupplied target/condition/scope is an explicit `[NEEDS INPUT: <name>]` placeholder — no values are invented. New modules `src/nfr-candidates.js`, `src/nfr-candidate-report.js`.
  - **`generate-nfr` command + pipeline phase** (#1112): new standalone CLI command, also auto-run in `pipeline` after Phase 2 (UCS/tests/Gherkin), before the Phase 3 review gate. New module `src/nfr-generator.js`; flags documented in the README.
  - **Curated 25010 taxonomy + NFR pattern library** (#1115): 40 neutral patterns plus 5 opt-in, additive domain overlays (`fda-21-cfr-11`, `hipaa`, `pci-dss`, `wcag-22`, `section-508`). New module `src/nfr-library.js`, `src/nfr-overlays.js`, `data/nfr/{taxonomy,patterns,overlays}.json`.
  - **Golden end-to-end NFR reference example** (#1116): recorded `neutral` and `pci-dss` live captures of a password-reset feature, all eight pipeline artifacts through NFR generation, with a deterministic, provider-call-free regeneration check. See `examples/fixtures/nfr-golden/`.
- **Source requirement traceability** (#1139): parsed requirements retain a stable ID and original text; every generated UCS/test/Gherkin step carries that propagated ID and text. Membership validation cannot detect a wrong-but-valid ID (e.g. a step derived from FR4 that cites FR3), so this is provenance labeling, not a proof the cited requirement is the one actually used. New module `src/source-traceability.js`.
- Shared `src/actor-role.js`: single definition of "system actor" used by both the test generator and the Gherkin generator (previously two independently-maintained lists).
- 142 new unit tests (29 → 171) covering classification, generation, overlays, the NFR input contract, traceability, negative-scenario Gherkin synthesis, and the golden fixture.

### Changed

- Negative Gherkin scenarios (e.g. invalid password, expired link) now assert the action that triggers their expected result, instead of asserting the outcome directly (#1168).
- NFR input validation and reference schemas accept `null` for the step fields the generation prompts explicitly permit to be null (`toActor`, `precondition`, `postcondition`, `refUseCaseId`, and for formal structure `previousStep`/`deviationPoint`/`rejoinPoint`) (#1164).
- Classifier accepts a bare JSON array of assignments in addition to the object-wrapped shape (#1131).
- Classifier payload no longer sends traceability fields to the model (#1155).
- Terminal alternative/exception flows (no `rejoinPoint`) now correctly end the generated test case at the branch's own last step (#1137).

### Known limitations

- The `fda-21-cfr-11` and `hipaa` overlays key exclusively on the `accountability` ISO/IEC 25010 sub-characteristic. The classifier has not been observed to produce `accountability` on any pipeline output generated after PR #1139, so selecting either overlay has added no additional candidates on every capture measured so far. Whether this is a classifier limitation or reflects that no source tested to date has contained an explicitly auditable requirement is unresolved — tracked in [#1163](https://github.com/mirichard/pm-tools-templates/issues/1163).
- The ISO/IEC 25010:2023 taxonomy structure and sub-characteristic descriptions are reconstructed from secondary/public sources (the primary standard is paywalled) and require human verification before being treated as authoritative for a released product.

## [1.1.0] — 2026-03-11

### Added

- **Phase 0 — Ambiguity Detection**: LLM-powered scanner that flags vague qualifiers, undefined references, missing boundaries, implicit assumptions, and ambiguous business rules *before* structuring begins. Outputs a readiness score (ready / needs_clarification / not_ready) with severity-ranked findings and clarification questions for stakeholders.
  - New `detect <input-file>` CLI command for standalone use
  - Integrated as Phase 0 in the pipeline with review gate — blocks on "not_ready", prompts on "needs_clarification"
  - New prompt template: `prompts/00-detect-ambiguity.md`
  - New module: `src/ambiguity-detector.js`

- **Gherkin/BDD Output**: Deterministic generator that converts test cases into `.feature` files compatible with Cucumber, pytest-bdd, SpecFlow, and other Gherkin frameworks.
  - UCS preconditions → `Background: Given`
  - Actor actions → `When`, system responses → `Then`, postconditions → final `Then`
  - New `generate-gherkin <test-cases-file> --ucs <ucs-file>` CLI command
  - Auto-generated in pipeline after test case generation
  - New module: `src/gherkin-generator.js`

- 10 new unit tests for ambiguity detector and Gherkin generator (29 total)
- Pipeline output now includes Gherkin `.feature` file and ambiguity report artifacts

### Changed

- Pipeline expanded from 5-phase to 6-phase (Phase 0 prepended)
- README rewritten for sprint team audience with full command reference, LLM configuration guide, workflow documentation, and updated project structure

## [1.0.0] — 2026-03-10

### Added

- **Phase 1 — Requirement Structuring**: Convert NL requirements to formal structure per Li & Zheng (2025) Equation 1
- **Phase 2 — UCS Template Generation**: Transform formal structure to Use Case Specifications with basic, alternative, and exception flows
- **Algorithm 1 — Test Case Generation**: Automatically generate test cases from every UCS flow path
- **Algorithms 2 & 3 — Consistency Validation**: Validate UCS against activity diagrams (Rules 1 & 2) and state machines (Rule 3)
- **Feedback Loop**: 3-pass LLM-assisted refinement — gap analysis, coverage expansion, implicit requirement discovery — with interactive human-in-the-loop review
- **Human-Readable Reports**: Markdown summary, use case spec, test cases, and validation reports
- **Multi-Provider LLM Support**: Google Gemini (free tier), Anthropic Claude, OpenAI, and any OpenAI-compatible endpoint (Ollama, Together, Groq, etc.) with auto-detection
- **Full Pipeline**: 5-phase end-to-end workflow with review gates
- 9 CLI commands: `init`, `structure`, `transform`, `generate-tests`, `validate`, `review`, `pipeline`
- 4 JSON schemas for data formats (formal-structure, ucs-template, business-process, state-model)
- 7 LLM prompt templates
- Web Store example data from the paper's GAMMA-J experiment
- 19 unit tests
