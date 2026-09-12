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

Work in progress: Phase 0 must return READY before continuing. If it returns
NOT READY or NEEDS CLARIFICATION, stop and report the exact findings without
further source edits. Full neutral/overlay outputs, four-characteristic breadth,
meaningful overlay differentiation and reproducible regeneration remain
unverified. This is not yet the completed #1113/#1114 anchor.
