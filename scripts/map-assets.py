#!/usr/bin/env python3
"""
map-assets.py — Automated asset mapping for vNext Epic 0

Reads templates/templates.json and maps each asset to:
  1. Value flow stage (input-enabler, activity-support, output-generator, outcome-tracker)
  2. Performance domain (Stakeholder, Team, Delivery, Planning, Uncertainty, Measurement)

Outputs:
  meta/value-flow-mapping.json   — Full value flow mapping
  meta/domain-mapping.json       — Full domain mapping
  meta/mapping-summary.md        — Human-readable summary
  meta/needs-review.md           — Assets flagged for manual review

Usage:
  python3 scripts/map-assets.py
"""

import json
import os
from pathlib import Path
from datetime import datetime

REPO_ROOT = Path(__file__).parent.parent
TEMPLATES_JSON = REPO_ROOT / "templates" / "templates.json"
META_DIR = REPO_ROOT / "meta"

# ── Value Flow Mapping Rules ──────────────────────────────────────────────────

METHODOLOGY_TAGS = {"agile", "scrum", "kanban", "traditional", "hybrid"}
EXECUTION_TAGS = METHODOLOGY_TAGS | {"technology"}

def classify_value_flow(tags: list[str]) -> tuple[str, str | None, str, bool]:
    """
    Returns (primary_category, secondary_category, rationale, needs_review).
    """
    tag_set = set(tags)

    # Rule 1: finance → outcome-tracker
    if "finance" in tag_set:
        secondary = "output-generator" if "monitoring" in tag_set else None
        return ("outcome-tracker", secondary,
                "Financial tracking measures business value realization", False)

    # Rule 2: monitoring (without finance) → output-generator
    if "monitoring" in tag_set:
        if tag_set & METHODOLOGY_TAGS:
            return ("output-generator", "activity-support",
                    "Monitoring template with methodology context produces reports during execution", False)
        return ("output-generator", None,
                "Monitoring-focused template produces reports and dashboards", False)

    # Rule 3: methodology tags → activity-support
    if tag_set & METHODOLOGY_TAGS:
        if "stakeholder-management" in tag_set and "planning" not in tag_set:
            return ("activity-support", "input-enabler",
                    "Methodology template with stakeholder focus supports execution and input gathering", False)
        return ("activity-support", None,
                "Methodology-specific template guides execution work", False)

    # Rule 4: planning + stakeholder-management (no execution tags) → input-enabler
    if "planning" in tag_set and "stakeholder-management" in tag_set and not (tag_set & EXECUTION_TAGS):
        return ("input-enabler", "activity-support",
                "Planning + stakeholder template gathers inputs for project setup", False)

    # Rule 5: quality + no monitoring → outcome-tracker
    if "quality" in tag_set and "monitoring" not in tag_set and not (tag_set & METHODOLOGY_TAGS):
        if "risk-management" in tag_set:
            return ("activity-support", "outcome-tracker",
                    "Quality + risk template supports execution with assessment aspect", False)
        return ("outcome-tracker", None,
                "Quality-focused template assesses and evaluates outcomes", False)

    # Rule 6: risk-management dominant → activity-support
    if "risk-management" in tag_set:
        if "planning" in tag_set:
            return ("activity-support", "input-enabler",
                    "Risk + planning template supports risk management during execution", False)
        return ("activity-support", None,
                "Risk management template guides uncertainty response during execution", False)

    # Rule 7: planning alone → activity-support
    if "planning" in tag_set:
        return ("activity-support", None,
                "Planning template structures project work", False)

    # Default
    if tags:
        return ("activity-support", None,
                "Default: template supports project execution", True)
    return ("activity-support", None,
            "No tags available — needs manual review", True)


# ── Domain Mapping Rules ─────────────────────────────────────────────────────

def classify_domain(tags: list[str]) -> tuple[str, list[str], str, bool]:
    """
    Returns (primary_domain, secondary_domains, rationale, needs_review).
    """
    tag_set = set(tags)
    secondaries = []

    # Rule 1: finance → Planning
    if "finance" in tag_set:
        if "monitoring" in tag_set:
            return ("Measurement", ["Planning"],
                    "Financial monitoring measures value delivery", False)
        return ("Planning", ["Measurement"] if "quality" in tag_set else [],
                "Financial template supports strategic planning and budgeting", False)

    # Rule 2: healthcare → Delivery
    if "healthcare" in tag_set:
        return ("Delivery", ["Uncertainty"] if "risk-management" in tag_set else [],
                "Industry-specific execution guidance", False)

    # Rule 3: methodology tags → Delivery
    if tag_set & METHODOLOGY_TAGS:
        if "stakeholder-management" in tag_set:
            secondaries.append("Stakeholder")
        if "risk-management" in tag_set:
            secondaries.append("Uncertainty")
        return ("Delivery", secondaries[:2],
                "Methodology-specific template guides delivery execution", False)

    # Rule 4: monitoring → Measurement
    if "monitoring" in tag_set:
        if "stakeholder-management" in tag_set:
            secondaries.append("Stakeholder")
        if "risk-management" in tag_set:
            secondaries.append("Uncertainty")
        return ("Measurement", secondaries[:2],
                "Monitoring template tracks and reports performance", False)

    # Rule 5: risk-management (dominant, no methodology) → Uncertainty
    if "risk-management" in tag_set and not (tag_set & METHODOLOGY_TAGS):
        if "planning" in tag_set:
            secondaries.append("Planning")
        if "stakeholder-management" in tag_set:
            secondaries.append("Stakeholder")
        return ("Uncertainty", secondaries[:2],
                "Risk-focused template manages project uncertainty", False)

    # Rule 6: stakeholder-management + communication → Stakeholder
    if "stakeholder-management" in tag_set and "communication" in tag_set:
        return ("Stakeholder", ["Planning"] if "planning" in tag_set else [],
                "Stakeholder engagement and communication template", False)

    # Rule 7: stakeholder-management alone → Stakeholder
    if "stakeholder-management" in tag_set:
        return ("Stakeholder", [],
                "Stakeholder-focused template", False)

    # Rule 8: planning (no methodology) → Planning
    if "planning" in tag_set:
        return ("Planning", [],
                "Planning template supports project strategy and scope", False)

    # Rule 9: quality → Measurement or Delivery
    if "quality" in tag_set:
        return ("Measurement", [],
                "Quality assessment template evaluates performance", False)

    # Rule 10: technology alone → Delivery
    if "technology" in tag_set:
        return ("Delivery", [],
                "Technology template supports delivery execution", False)

    # Default
    if tags:
        return ("Delivery", [],
                "Default: template supports delivery", True)
    return ("Delivery", [],
            "No tags available — needs manual review", True)


# ── Main ─────────────────────────────────────────────────────────────────────

def main():
    with open(TEMPLATES_JSON) as f:
        data = json.load(f)

    templates = data["templates"]
    print(f"Processing {len(templates)} templates...")

    value_flow_results = []
    domain_results = []
    needs_review = []

    vf_counts = {"input-enabler": 0, "activity-support": 0,
                 "output-generator": 0, "outcome-tracker": 0}
    domain_counts = {"Stakeholder": 0, "Team": 0, "Delivery": 0,
                     "Planning": 0, "Uncertainty": 0, "Measurement": 0}
    cross_domain_count = 0

    for t in templates:
        tags = t.get("tags", [])
        path = t["path"]
        title = t["title"]
        methodology = t.get("methodology", "universal")

        # Value flow
        vf_primary, vf_secondary, vf_rationale, vf_review = classify_value_flow(tags)
        vf_counts[vf_primary] += 1

        # Domain
        d_primary, d_secondary, d_rationale, d_review = classify_domain(tags)
        domain_counts[d_primary] += 1

        is_cross_domain = len(set(tags)) >= 5
        if is_cross_domain:
            cross_domain_count += 1

        review_needed = vf_review or d_review

        vf_record = {
            "path": path,
            "title": title,
            "methodology": methodology,
            "value_flow": {
                "primary": vf_primary,
                "secondary": vf_secondary,
                "rationale": vf_rationale
            },
            "flags": {
                "needs_review": review_needed,
                "cross_domain": is_cross_domain
            }
        }

        d_record = {
            "path": path,
            "title": title,
            "methodology": methodology,
            "domain": {
                "primary": d_primary,
                "secondary": d_secondary,
                "rationale": d_rationale
            },
            "flags": {
                "needs_review": review_needed,
                "cross_domain": is_cross_domain
            }
        }

        value_flow_results.append(vf_record)
        domain_results.append(d_record)

        if review_needed:
            needs_review.append({"path": path, "title": title, "tags": tags,
                                 "vf_primary": vf_primary, "d_primary": d_primary})

    # Write outputs
    META_DIR.mkdir(exist_ok=True)

    with open(META_DIR / "value-flow-mapping.json", "w") as f:
        json.dump({"generated": datetime.utcnow().isoformat() + "Z",
                    "total": len(value_flow_results),
                    "mappings": value_flow_results}, f, indent=2)

    with open(META_DIR / "domain-mapping.json", "w") as f:
        json.dump({"generated": datetime.utcnow().isoformat() + "Z",
                    "total": len(domain_results),
                    "mappings": domain_results}, f, indent=2)

    # Coverage matrix
    matrix = {}
    for r in domain_results:
        meth = r["methodology"]
        dom = r["domain"]["primary"]
        if meth not in matrix:
            matrix[meth] = {d: 0 for d in domain_counts}
        matrix[meth][dom] += 1

    # Summary
    review_pct = (len(needs_review) / len(templates) * 100) if templates else 0
    summary = f"""# Asset Mapping Summary

**Generated:** {datetime.utcnow().strftime('%Y-%m-%d %H:%M UTC')}
**Total assets mapped:** {len(templates)}
**Needs manual review:** {len(needs_review)} ({review_pct:.1f}%)
**Cross-domain assets:** {cross_domain_count}

## Value Flow Distribution

| Category | Count | Percentage |
|----------|-------|-----------|
| input-enabler | {vf_counts['input-enabler']} | {vf_counts['input-enabler']/len(templates)*100:.1f}% |
| activity-support | {vf_counts['activity-support']} | {vf_counts['activity-support']/len(templates)*100:.1f}% |
| output-generator | {vf_counts['output-generator']} | {vf_counts['output-generator']/len(templates)*100:.1f}% |
| outcome-tracker | {vf_counts['outcome-tracker']} | {vf_counts['outcome-tracker']/len(templates)*100:.1f}% |

## Domain Distribution

| Domain | Count | Percentage |
|--------|-------|-----------|
"""
    for d in ["Stakeholder", "Team", "Delivery", "Planning", "Uncertainty", "Measurement"]:
        summary += f"| {d} | {domain_counts[d]} | {domain_counts[d]/len(templates)*100:.1f}% |\n"

    summary += "\n## Coverage Matrix (Domain × Methodology)\n\n"
    summary += "| Methodology | " + " | ".join(domain_counts.keys()) + " | Total |\n"
    summary += "|-------------|" + "|".join(["---" for _ in domain_counts]) + "|---|\n"
    for meth in sorted(matrix.keys()):
        row = matrix[meth]
        total = sum(row.values())
        summary += f"| {meth} | " + " | ".join(str(row[d]) for d in domain_counts) + f" | {total} |\n"

    with open(META_DIR / "mapping-summary.md", "w") as f:
        f.write(summary)

    # Needs review
    review_md = f"# Assets Needing Manual Review\n\n**Count:** {len(needs_review)} of {len(templates)}\n\n"
    for r in needs_review:
        review_md += f"- **{r['title']}** (`{r['path']}`)\n"
        review_md += f"  - Tags: {', '.join(r['tags']) if r['tags'] else 'none'}\n"
        review_md += f"  - Auto-assigned: VF={r['vf_primary']}, Domain={r['d_primary']}\n\n"

    with open(META_DIR / "needs-review.md", "w") as f:
        f.write(review_md)

    # Print summary
    print(f"\n{'='*50}")
    print(f"VALUE FLOW:  {vf_counts}")
    print(f"DOMAINS:     {domain_counts}")
    print(f"REVIEW:      {len(needs_review)}/{len(templates)} ({review_pct:.1f}%)")
    print(f"CROSS-DOMAIN: {cross_domain_count}")
    print(f"{'='*50}")
    print(f"Outputs written to {META_DIR}/")


if __name__ == "__main__":
    main()
