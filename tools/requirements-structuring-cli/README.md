# Requirements Structuring & Validation CLI

**LLM-Assisted Use Case Specification Framework for Sprint Teams**

A CLI tool that converts natural language requirements into formally structured Use Case Specifications (UCS), detects ambiguities before engineering begins, generates acceptance test cases and Gherkin/BDD feature files, and validates consistency against UML diagrams.

Built for sprint teams — Product Owners, Business Analysts, Engineers, QA, and Scrum Masters — to close the gap between business requirements and what gets built.

Based on: Li & Zheng (2025) *"Enhancing Requirements via Structured Formalization and Process-State Consistency Validation: An LLM-Assisted Test-Driven Framework"* — IET Software.

---

## How It Works

```
Business Stakeholder Interview
        ↓
  BA/PO fills in requirements template (Markdown)
        ↓
  ┌─────────────────────────────────────────────────────────────────┐
  │  Phase 0  Ambiguity Detection         → blockers & warnings    │
  │  Phase 1  Requirement Structuring      → formal structure JSON  │
  │  Phase 2  UCS + Test Cases + Gherkin   → UCS, tests, .feature  │
  │  Phase 3  Feedback Loop                → refined UCS            │
  │  Phase 4  Activity Diagram Validation  → Rule 1 & 2 checks     │
  │  Phase 5  State Machine Validation     → Rule 3 checks         │
  └─────────────────────────────────────────────────────────────────┘
        ↓
  Sprint team receives:
  • Ambiguity report (questions for stakeholders)
  • Formal Use Case Specification
  • Acceptance test cases
  • Gherkin .feature file (wire into Cucumber/pytest-bdd/SpecFlow)
  • Validation report
```

Each phase has a review gate — you approve before the pipeline continues.

---

## Prerequisites

- **Node.js** 16.0.0 or higher
- **LLM API Key** — one of the following (auto-detected):
  - **Google Gemini** (`GEMINI_API_KEY`) — free tier, recommended to start. Get a key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey)
  - **Anthropic Claude** (`ANTHROPIC_API_KEY`) — [console.anthropic.com/settings/keys](https://console.anthropic.com/settings/keys)
  - **OpenAI** (`OPENAI_API_KEY`) — [platform.openai.com/api-keys](https://platform.openai.com/api-keys)
  - **Any OpenAI-compatible** (`LLM_API_KEY` + `LLM_BASE_URL`) — Ollama, Together, Groq, Azure OpenAI, LM Studio, etc.

## Installation

```bash
cd tools/requirements-structuring-cli
npm install

# Configure your LLM provider
cp .env.example .env
# Edit .env and add your API key (e.g. GEMINI_API_KEY=your-key-here)
```

Optional global install:

```bash
npm link
# Now available as: pm-requirements <command>
```

---

## Quick Start

```bash
# 1. Copy the requirements template to your working directory
npm start init

# 2. Fill in requirements-input.md with your NL requirements
#    (gathered from stakeholder interviews)

# 3. Run the full pipeline
npm start pipeline requirements-input.md -o ./output

# 4. Review the output:
#    output/
#    ├── *-ambiguity-report.md     ← Questions for PO/stakeholders
#    ├── *-structured.json         ← Formal structure (Eq. 1)
#    ├── *-ucs.json                ← Use Case Specification
#    ├── *-ucs-refined.json        ← UCS after feedback loop
#    ├── *-tests.json              ← Test cases (all flow paths)
#    ├── *.feature                 ← Gherkin/BDD feature file
#    ├── *-summary.md              ← Executive summary
#    ├── *-use-case-spec.md        ← Human-readable UCS
#    ├── *-test-cases.md           ← Human-readable test cases
#    └── *-ambiguity.json          ← Raw ambiguity findings
```

---

## CLI Commands

### `init`

Copy the blank requirements input template to the current directory.

```bash
npm start init
```

### `detect <input-file>`

**Phase 0**: Scan raw requirements for ambiguities before structuring. Identifies vague qualifiers, undefined references, missing boundaries, implicit assumptions, and ambiguous business rules.

```bash
npm start detect requirements-input.md
npm start detect requirements-input.md -o ambiguity-report.md
```

Output includes a readiness score:
- **READY** — 0 blockers, ≤2 warnings. Clear to proceed.
- **NEEDS CLARIFICATION** — warnings present. Document assumptions or confirm with PO.
- **NOT READY** — 3+ blockers. Requirements need rework before the team can plan.

### `structure <input-file>`

**Phase 1**: Convert natural language requirements to formal structure per Equation 1:
`<Pre-conditions [Previous Step]; Actor; Action; Business Objects; [To actor]; [Post-conditions]>`

```bash
npm start structure requirements-input.md
npm start structure requirements-input.md -o my-structured.json
```

### `transform <structured-file>`

**Phase 2**: Convert formal structure to UCS template with basic, alternative, and exception flows.

```bash
npm start transform requirements-input-structured.json
npm start transform requirements-input-structured.json --deterministic  # No LLM needed
```

### `generate-tests <ucs-file>`

Generate test cases from UCS flows (Algorithm 1 — GenTestCase). Produces one test case per flow path.

```bash
npm start generate-tests requirements-input-ucs.json
```

### `generate-gherkin <test-cases-file>`

Generate a Gherkin `.feature` file from test cases. Maps UCS steps to Given/When/Then:
- Preconditions → `Given`
- Actor actions → `When`
- System responses → `Then`
- Postconditions → `Then`

```bash
npm start generate-gherkin my-tests.json --ucs my-ucs.json
npm start generate-gherkin my-tests.json --ucs my-ucs.json -o my-feature.feature
```

The `.feature` file can be wired directly into Cucumber, pytest-bdd, SpecFlow, or any Gherkin-compatible test framework.

### `generate-nfr [input-file]`

Accepts an existing structured or UCS JSON artifact and classifies each step
against the quality taxonomy (#1108). NFR text generation (#1109) is a follow-up.
See the [classification handoff contract](docs/nfr-classification.md).
See the [NFR input contract](docs/nfr-input-contract.md) for required fields,
shape validation, and compatibility decisions. No version marker is required.

```bash
npm start -- generate-nfr --list-overlays
npm start -- generate-nfr examples/web-store-ucs.json --profile neutral -o ./output
```

`--profile <name>` and `--overlay <name>` select the same registry entry. If both
are supplied, they must agree. The default is `neutral` (no domain overlay);
listing also shows the opt-in review candidates `fda-21-cfr-11`, `hipaa`,
`pci-dss`, `wcag-22`, and `section-508`. Unknown names fail clearly.
The [curated library and review requirements](docs/nfr-taxonomy.md) describe
40 neutral patterns, provenance, overlay scope and versioning. The taxonomy
requires human verification against the purchased ISO/IEC 25010:2023 standard
before authoritative release. Selecting an overlay does not establish compliance.
Listing needs no input file or API credentials and writes no report.

The command writes `<base>-nfr-report.md` through the existing Markdown report
writer, explicitly labeled `NFR generation not yet implemented (#1109)`, plus
a machine-readable `<base>-nfr-classifications.json` artifact. Classification
uses the configured LLM; no NFR candidates are generated. `pipeline` automatically
runs the same step after Phase 2 UCS, test cases and Gherkin, before the Phase 3
review gate; all existing phase ordering and gates are preserved.

| Flag | Behavior |
| --- | --- |
| `--provider gemini\|anthropic\|openai` | Override existing `LLM_PROVIDER` selection for the invocation; `openai` also covers compatible APIs using `LLM_BASE_URL`. |
| `--model <name>` | Override existing `LLM_MODEL` selection for the invocation. |
| `--attributes <names>` | Comma-separated non-empty names; top-level taxonomy names/IDs restricting classification; overrides `NFR_ATTRIBUTES` from the environment. |
| `--confidence-threshold <number>` | Finite number in `[0, 1]`; recorded only, no confidence calculation or review gate. |
| `--profile` / `--overlay` | Select an available name; default `neutral`. |
| `-o` / `--output <dir>` | Report directory, default `./output`. Pipeline retains `--output-dir` and also accepts `--output`. |

All these selection flags also apply to `pipeline`. Upstream pipeline phases
still use the configured LLM and interactive gates. Standalone classification requires the existing provider credentials;
overlay listing does not require API credentials. Provider/model flags reuse
the existing environment loader/client and restore overrides after execution.

```bash
npm start -- generate-nfr examples/web-store-ucs.json --attributes reliability,security --confidence-threshold 0.8 -o ./output
npm start -- pipeline examples/web-store-input.md --provider gemini --overlay neutral -o ./output
```

### `validate <ucs-file>`

Validate UCS consistency against activity diagrams and/or state machines (Algorithms 2 & 3).

```bash
npm start validate my-ucs.json --activity activity-diagram.json --state cart-state.json order-state.json
```

### `review <ucs-file> <test-cases-file>`

Run the interactive feedback loop — three LLM analysis passes:
1. Gap & contradiction analysis
2. Coverage expansion (suggest additional test cases)
3. Implicit requirement discovery

Each suggestion is presented for interactive accept/reject.

```bash
npm start review my-ucs.json my-tests.json
```

### `pipeline <input-file>`

Run the complete 6-phase pipeline with interactive review gates between each phase.

```bash
# Minimal (Phases 0-3 + reports)
npm start pipeline requirements-input.md -o ./output

# Full validation (all 6 phases)
npm start pipeline requirements-input.md \
  --activity activity-diagram.json \
  --state claim-state.json contract-state.json \
  -o ./output
```

---

## Consistency Rules

The tool implements three formal consistency rules from the paper:

**Rule 1 — Semantic Consistency** (Activity Diagram)
Every business object referenced in the activity diagram must appear in the associated UCS flows. Catches missing domain objects.

**Rule 2 — Process Consistency** (Activity Diagram)
If the activity diagram shows BO-X as input and BO-Y as output for an activity, then BO-X must appear before BO-Y in the UCS step sequence. Catches ordering violations.

**Rule 3 — State Consistency** (State Machine)
If the state machine requires action-A before action-B (because A's target state is B's source state), the UCS must have them in that same order. Catches lifecycle violations.

Rules 1 & 2 require an activity diagram JSON (`--activity`). Rule 3 requires state machine JSON (`--state`). See `schemas/` for the expected formats.

---

## LLM Configuration

The tool auto-detects your provider from whichever API key is set.
Priority: `GEMINI_API_KEY` → `ANTHROPIC_API_KEY` → `OPENAI_API_KEY` → `LLM_API_KEY`.

### Environment Variables

- `GEMINI_API_KEY` — Google Gemini API key
- `ANTHROPIC_API_KEY` — Anthropic Claude API key
- `OPENAI_API_KEY` — OpenAI API key
- `LLM_API_KEY` — Generic key for any OpenAI-compatible endpoint
- `LLM_PROVIDER` — Force provider: `gemini`, `anthropic`, or `openai` (default: auto)
- `LLM_MODEL` — Override the model name (defaults per provider)
- `LLM_BASE_URL` — Base URL for OpenAI-compatible APIs
- `LLM_MAX_TOKENS` — Max output tokens (default: `16384`)
- `LLM_TEMPERATURE_STRUCTURE` — Temperature for structuring tasks (default: `0.2`)
- `LLM_TEMPERATURE_CREATIVE` — Temperature for analysis/creative tasks (default: `0.5`)
- `LLM_TIMEOUT` — Request timeout in ms (default: `120000`)
- `SAVE_LLM_TRACES` — Save raw LLM request/response pairs (default: `false`)
- `LLM_TRACE_DIR` — Directory for trace files (default: `./traces`)

### Example `.env` for Gemini (free tier)

```env
GEMINI_API_KEY=your-key-here
```

### Example `.env` for local Ollama

```env
LLM_API_KEY=ollama
LLM_BASE_URL=http://localhost:11434/v1/chat/completions
LLM_MODEL=llama3
```

---

## Project Structure

```
requirements-structuring-cli/
├── src/
│   ├── index.js                # CLI entry point (9 commands)
│   ├── parser.js               # NL input reader
│   ├── structurer.js           # Phase 1: NL → formal structure (Eq. 1)
│   ├── ucs-transformer.js      # Phase 2: structure → UCS template
│   ├── ambiguity-detector.js   # Phase 0: ambiguity scanner
│   ├── gherkin-generator.js    # Gherkin/BDD .feature generator
│   ├── business-object.js      # BO model: (N, Att, S_allowed, M, C)
│   ├── ucs-template.js         # UCS data model
│   ├── test-generator.js       # Algorithm 1 (GenTestCase)
│   ├── consistency-checker.js  # Algorithms 2 & 3
│   ├── feedback-loop.js        # Interactive 3-pass refinement loop
│   ├── report-generator.js     # Human-readable Markdown reports
│   └── llm-client.js           # Multi-provider LLM wrapper
├── prompts/                     # 8 LLM prompt templates (00–07)
├── schemas/                     # JSON Schemas for all data formats
├── templates/                   # Requirements input template
├── examples/                    # Web Store sample data (from paper)
└── tests/                       # 29 unit tests
```

## Examples

### Web Store (from the paper)

The `examples/` directory contains data from the paper's GAMMA-J Web Store experiment:
- `web-store-input.md` — Natural language requirements
- `web-store-activity.json` — Activity diagram (BPM schema)
- `web-store-state.json` — Shopping Cart state machine

```bash
npm start pipeline examples/web-store-input.md -o ./web-store-output
```

---

## Testing

```bash
npm test
```

Runs 29 tests covering: business object model, UCS template model, test generator (Algorithm 1), consistency checker (Algorithms 2 & 3), requirements parser, ambiguity detector, and Gherkin generator.

---

## Intended Workflow

1. **BA/PO interviews business stakeholders** and captures requirements
2. **BA fills in the requirements template** (`npm start init`)
3. **Run the pipeline** (`npm start pipeline ...`) — tool detects ambiguities, structures requirements, generates UCS, test cases, and Gherkin
4. **PO resolves blockers** using the ambiguity report's clarification questions
5. **Sprint team reviews** the UCS spec and test cases
6. **QA wires up Gherkin** feature files into the test framework
7. **Engineers use the UCS** as design input for architecture, API design, and data model

---

## License

MIT — See the repository root LICENSE file.
