# Golden NFR reference example (#1116)

The active source is `password-reset-input.md`, the owner's six functional
requirements for a single password-reset feature. It follows the section format
of the existing `examples/web-store-input.md` sample but uses a documented new
scenario. The earlier laboratory-order source was removed from this directory;
its history remains in Git and it is no longer used for fixture generation.

The source preserves the owner's 30-minute reset-link validity and 12-character
password rule. These are supplied functional requirements, not invented NFR
bindings. Generated NFR targets and measurement conditions must remain exactly
as the generator's NEEDS INPUT placeholders.

## Neutral capture

`neutral/` preserves the eight artifacts emitted by the live default run,
unchanged. Source commit: e1780547e007e2fd37461dfcc54fee9379bce536.
Provider: Gemini; model: gemini-2.5-flash; structure and creative temperatures: 0;
traces disabled. Phase 0 was READY (0 blockers, 1 password-rule warning).
The owner confirmed the six FRs are the entire functional scope and approved
proceeding past UI-only warnings. No additional source rules were invented.

The run produced 75 classifications/candidates across eight characteristics,
with 300 unbound placeholder bindings. Safety is uncovered. The post-generation
feedback gate was declined as directed: no interactive refinement was performed.
Consequently the CLI's later aggregate Markdown reports were not emitted; the
NFR Markdown, structured/UCS/test JSON and Gherkin are included as produced.
No generated content has been manually edited.

Overlay comparison and regeneration verification are pending.
