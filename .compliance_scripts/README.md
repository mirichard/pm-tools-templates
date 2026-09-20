# IP Compliance Tooling Inventory

This directory contains legacy documentation for repository PMI/IP review. It does not contain the executable suite formerly advertised here. The earlier examples naming `run_ip_mitigation.sh`, `implement_ip_mitigation.sh` and `quick_compliance_fix.sh` do not identify available scripts at these documented locations.

## Existing tool

The root-level [validate_ip_compliance.sh](../validate_ip_compliance.sh) inspects Markdown with keyword heuristics for PMI references and disclaimers. Its summary counters are not reliable because the scan loop updates them inside a pipeline/subshell. Individual flags also require human interpretation; a trademark reference is not by itself a legal finding. This inventory does not validate or repair the script.

If used for a content review, retain the script revision, individual observations, reviewer decisions and follow-up actions. Do not use an aggregate score as an acceptance gate or as evidence of regulatory compliance.

## Governance integration

- [Compliance integration framework](../docs/governance/compliance-integration-framework.md#integrate-the-repository-compliance-assets): link IP-review evidence separately from regulatory obligations.
- [Historical IP mitigation status](../README_COMPLIANCE.md): background only; verify any current status before relying on it.

These resources do not validate GDPR, HIPAA, SOX, ISO/IEC 27001 or NIST controls and do not provide certification or legal approval.
