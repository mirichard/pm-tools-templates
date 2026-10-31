"""Generate an issue inventory report from one complete GitHub snapshot."""
import argparse
from datetime import datetime, timedelta, timezone
import json
import os
from pathlib import Path
import re
import subprocess


def collect(repository):
    if not re.fullmatch(r"[\w.-]+/[\w.-]+", repository):
        raise ValueError("Expected owner/repository")
    result = subprocess.run([
        "gh", "api", "--paginate", "--slurp",
        f"repos/{repository}/issues?state=all&per_page=100&sort=created&direction=asc",
    ], check=True, capture_output=True, text=True)
    pages = json.loads(result.stdout)
    if not isinstance(pages, list) or not all(isinstance(p, list) for p in pages):
        raise ValueError("Incomplete or invalid issue snapshot")
    return [item for page in pages for item in page if "pull_request" not in item]


def summarize(issues, now):
    if len({i["number"] for i in issues}) != len(issues):
        raise ValueError("Duplicate issues in snapshot; retry collection")
    if any(i["state"] not in ("open", "closed") for i in issues):
        raise ValueError("Unknown issue state")
    opened = [i for i in issues if i["state"] == "open"]
    closed = [i for i in issues if i["state"] == "closed"]
    def labeled(items, names):
        return [i for i in items if names & {x["name"] for x in i.get("labels", [])}]
    strategic = labeled(issues, {"strategic"})
    recent = []
    for i in closed:
        stamp = datetime.fromisoformat(i["closed_at"].replace("Z", "+00:00"))
        if now - timedelta(days=7) <= stamp <= now:
            recent.append(i)
    priorities = labeled(opened, {"high-priority", "priority-high"})
    metrics = {
        "total_issues": len(issues), "open_issues": len(opened),
        "closed_issues": len(closed),
        "completion_rate": len(closed) * 100 // len(issues) if issues else 0,
        "high_priority": len(priorities), "bugs": len(labeled(opened, {"bug"})),
        "strategic_open": sum(i["state"] == "open" for i in strategic),
        "strategic_progress": sum(i["state"] == "closed" for i in strategic) * 100 // len(strategic) if strategic else 0,
        "critical_risks": len(labeled(opened, {"critical"})),
        "blockers": len(labeled(opened, {"blocker", "blocked"})),
        "recent_closed": len(recent),
    }
    return metrics, sorted(recent, key=lambda i: i["number"]), priorities


def render(issues, now, report_type, methodology, repository):
    metrics, recent, priorities = summarize(issues, now)
    def rows(items):
        lines = []
        for item in items:
            title = re.sub(r"([\\`*_{}\[\]<>|])", r"\\\1", item["title"].replace("\n", " "))
            lines.append(f"- [#{item['number']}](https://github.com/{repository}/issues/{item['number']}): {title}")
        return "\n".join(lines) or "- None recorded in this snapshot."
    report = f"""# {report_type.title()} Issue Inventory Report

Snapshot captured: {now.isoformat()} (UTC). Repository: {repository}.
Methodology context: {methodology}. Window for recent closures: previous seven days.

This is a repository-wide issue inventory, not sprint/release completion or delivery acceptance.
Pull requests are excluded. Closed includes completed and not-planned issues.
The legacy JSON keys `completion_rate` and `strategic_progress` mean issue closure percentages only.
An empty denominator is reported as zero for compatibility, not evidence of progress.

| Metric | Value |
|---|---:|
| Total issues | {metrics['total_issues']} |
| Open issues | {metrics['open_issues']} |
| Closed issues (all closure reasons) | {metrics['closed_issues']} |
| Issue closure percentage | {metrics['completion_rate']}% |
| Strategic-labeled issue closure percentage | {metrics['strategic_progress']}% |
| Open high-priority-labeled issues | {metrics['high_priority']} |
| Open bug-labeled issues | {metrics['bugs']} |
| Open critical-labeled issues | {metrics['critical_risks']} |
| Open blocker/blocked-labeled issues | {metrics['blockers']} |

Label counts do not establish the absence of risks or dependency blockers.
Sprint velocity, burndown, project health, acceptance and future targets are not measured here.
GitHub pagination is not transactionally isolated; concurrent issue changes may require a fresh capture.

## Recently closed issues ({metrics['recent_closed']})

{rows(recent)}

## Open high-priority-labeled issues

{rows(priorities)}
"""
    data = {"report_date": now.isoformat(), "report_type": report_type,
            "methodology": methodology, "repository": repository,
            "metric_scope": "repository_issue_inventory_all_closure_reasons",
            "metrics": metrics, "flow_metrics": None,
            "health_indicators": {"overall_health": "not_assessed", "risk_level": "not_assessed", "progress_trend": "not_assessed"},
            "recent_closed_numbers": [i["number"] for i in recent]}
    return report, data


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--repository", default=os.environ.get("GITHUB_REPOSITORY"))
    parser.add_argument("--snapshot", type=Path)
    parser.add_argument("--report-type", choices=("weekly", "monthly", "sprint", "milestone"), default="weekly")
    parser.add_argument("--methodology", choices=("agile", "traditional", "hybrid"), default="agile")
    args = parser.parse_args()
    if not args.repository:
        parser.error("--repository is required")
    issues = json.loads(args.snapshot.read_text()) if args.snapshot else collect(args.repository)
    now = datetime.now(timezone.utc)
    report, data = render(issues, now, args.report_type, args.methodology, args.repository)
    report_path = Path(f"reports/status/{args.report_type}-status-{now.date()}.md")
    metrics_path = Path(f"metrics/status-data/status-metrics-{now.date()}.json")
    for path, content in ((report_path, report), (metrics_path, json.dumps(data, indent=2) + "\n")):
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(content)
    if os.environ.get("GITHUB_OUTPUT"):
        with open(os.environ["GITHUB_OUTPUT"], "a") as output:
            for key, value in data["metrics"].items():
                output.write(f"{key}={value}\n")
    print(report_path)


if __name__ == "__main__":
    main()
