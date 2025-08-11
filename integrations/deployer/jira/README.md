# Jira Deployer Scaffold (Issue #290)

Purpose
- Minimal project deployer to create a Jira project from a simple template.

Checklist (Phase 1)
- [ ] Define minimal template schema (name, key, issue types)
- [ ] Create project via REST (POST /rest/api/3/project)
- [ ] Create issue types/fields if missing; idempotent operations
- [ ] Basic error handling and rollback on failure
- [ ] Audit logging for deploy events

Next
- Support workflow scheme assignment and permissions mapping
