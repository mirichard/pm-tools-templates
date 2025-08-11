# Asana Deployer Scaffold (Issue #290)

Purpose
- Minimal project deployer to create an Asana project from a simple template.

Checklist (Phase 1)
- [ ] Define minimal template schema (project name, tasks, simple dependencies)
- [ ] Create project (POST /projects)
- [ ] Create tasks/subtasks; set basic dependencies
- [ ] Basic error handling and rollback on failure
- [ ] Audit logging for deploy events

Next
- Support custom field creation/mapping and team/workspace assignment
