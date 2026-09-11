# NFR candidate generation

Generation consumes the unchanged #1108 classification JSON contract and the
read-only #1115 library. It renders candidate statements, not approved or fully
bound acceptance criteria. Targets and measurement conditions are never guessed:
all unsupplied parameters use `[NEEDS INPUT: parameter]`. No binding-input
mechanism is introduced. Humans edit the report today.

Generation uses deterministic template substitution, with renderer version 1.0.0;
no generation LLM call or prompt is necessary. Classification still uses the
existing provider. No #1110 integration or #1111 review gate is implemented.
