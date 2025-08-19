# Contract Validation Example (Draft)

This example demonstrates how a payload could be validated against a JSON Schema.

Pseudo-code
- Load schema for provider/event (e.g., providers/jira/inbound-issue-updated.schema.json)
- Validate payload
- Return success/failure with error messages

Notes
- Use a library like ajv for validation in a real implementation
- Keep schemas versioned

