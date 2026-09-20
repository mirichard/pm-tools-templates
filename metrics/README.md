# Metrics records and flow extension

Story #755 extends the existing status snapshots in `status-data/`; `risk-data/` remains the historical risk series. Preserve historical files. The [status-reporting producer](../.github/workflows/status-reporting.yml) and [weekly-status producer](../.github/workflows/weekly-status-email.yml) now emit optional `flow_metrics: null`. They do not collect workflow transition events, so no flow performance is claimed by default.

Use the [delivery metrics guide](../docs/delivery/delivery-metrics-framework.md) to populate a verified flow section in a newly prepared status record after validating its event source. Keep existing report fields. This is an extension to the existing record, not another reporting pipeline. Consumer behavior: absent or null means **not assessed**; old records remain valid. Do not copy example values into operational reports.

| Optional flow field | Required meaning when populated |
|---|---|
| `workflow_id`, `workflow_version`, `item_type` | Scope, version and counted work type. |
| `window_start`, `window_end`, `as_of` | Timezone-qualified timestamps; window is start-inclusive/end-exclusive. |
| `request_event`, `start_event`, `finish_event`, `time_basis` | Measurement boundaries and elapsed calendar/business-time convention. |
| `source`, `source_as_of`, `owner` | Evidence query/location, data age and accountable reviewer. |
| `throughput_count`, `throughput_period` | Distinct finished items in the stated window; item count and time unit, not points. |
| `wip_count`, `unfinished_ages_hours` | Started unfinished items at as-of, including blocked/waiting work; retain age of each unresolved item. |
| `cycle_hours`, `lead_hours` | Completed-cohort duration observations, sample count and missing-data count; disclose any percentile method. |
| `active_hours`, `elapsed_hours`, `flow_efficiency_percent` | Non-overlapping active elapsed time and matching started-to-finished duration, with coverage. Percent = active / elapsed × 100; unavailable or zero denominator means null. |
| `kpi_ids`, `decision`, `next_review` | Links to the existing KPI hierarchy, action/owner and follow-up. |

Before publication, verify unique IDs, event ordering, cancellation/reopen policy, time units, nonnegative durations, active time no greater than matching elapsed time and source completeness. Do not calculate missing start times from issue creation timestamps without an explicitly agreed boundary. Do not fill absent measures with zero.

`metrics.recent_closed` may be a candidate input only after its query/window and completion semantics are verified. `metrics.open_issues` is not WIP. Existing snapshots can contain inconsistent totals; reconcile them at source rather than treating a stored health indicator as evidence.

Display the verified fields beside existing execution measures in the [project dashboard](../domains/uncertainty/project-lifecycle/04-monitoring-control/progress-tracking/project-dashboard-template.md#flow-and-value-measurements). This correction provides the record and dashboard integration; automated event collection remains outside its scope.
