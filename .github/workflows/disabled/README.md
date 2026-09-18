# Disabled Workflows

These workflows have been disabled as part of the workflow audit conducted on 2025-08-03.

## Disabled Test/Debug Workflows

The following workflows were moved here because they serve only testing/debugging purposes and were causing unnecessary failures:

- `test-clean-status-simple.yml` - Simple test for clean status workflow
- `test-enhanced-clean-status-workflow.yml` - Test for enhanced clean status
- `test-enhanced-email-workflow.yml` - Email workflow testing
- `test-minimal-status.yml` - Minimal status email testing  
- `test-status-workflow.yml` - General status workflow testing
- `debug-enhanced-workflow.yml` - Debug workflow for development

## Re-enabling Workflows

To re-enable any of these workflows:

1. Move the workflow file back to `.github/workflows/`
2. Test the workflow on a feature branch
3. Ensure it serves a clear operational purpose
4. Update documentation

## Audit Information

- **Audit Date:** 2025-08-03
- **Audit Branch:** audit-actions/2025-08-03  
- **Reason:** Test-only workflows causing failures with no operational value
- **Full Audit Report:** See `WORKFLOW_AUDIT_RESULTS.md` in repository root
