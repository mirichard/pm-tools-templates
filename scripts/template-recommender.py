#!/usr/bin/env python3
"""
template-recommender.py — Context-based template recommendation engine

Asks 7 project context questions, applies matching rules, and outputs
a personalized recommendation card with essential templates, toolkit,
and use-case pathway suggestions.

Usage:
  python3 scripts/template-recommender.py              # Interactive mode
  python3 scripts/template-recommender.py --json FILE  # From JSON profile
"""

import json
import sys
from pathlib import Path

REPO_ROOT = Path(__file__).parent.parent
TEMPLATES_JSON = REPO_ROOT / "templates" / "templates.json"

# ── Context Questions ─────────────────────────────────────────────────────────

QUESTIONS = [
    {
        "key": "size",
        "prompt": "Project size?",
        "options": ["small", "medium", "large", "enterprise"],
        "default": "medium"
    },
    {
        "key": "methodology",
        "prompt": "Methodology?",
        "options": ["agile", "traditional", "hybrid", "unsure"],
        "default": "unsure"
    },
    {
        "key": "risk_profile",
        "prompt": "Risk profile?",
        "options": ["low", "medium", "high", "regulatory"],
        "default": "medium"
    },
    {
        "key": "team_size",
        "prompt": "Team size?",
        "options": ["solo", "small (2-9)", "medium (10-50)", "large (50+)"],
        "values": ["solo", "small", "medium", "large"],
        "default": "small"
    },
    {
        "key": "industry",
        "prompt": "Industry?",
        "options": ["general", "it", "healthcare", "financial", "construction"],
        "default": "general"
    },
    {
        "key": "phase",
        "prompt": "Current project phase?",
        "options": ["starting", "planning", "in_progress", "closing"],
        "default": "starting"
    },
    {
        "key": "pm_experience",
        "prompt": "PM experience level?",
        "options": ["new", "intermediate", "advanced"],
        "default": "intermediate"
    }
]

# ── Recommendation Templates ─────────────────────────────────────────────────

ESSENTIALS = {
    "starting": [
        ("Project Charter", "project-lifecycle/01-initiation/project-charter/", "Define project purpose and authority"),
        ("Stakeholder Register", "project-lifecycle/01-initiation/stakeholder-analysis/", "Identify key players"),
        ("Communication Plan", "project-lifecycle/02-planning/communication-planning/", "Establish information flow"),
    ],
    "planning": [
        ("Project Management Plan", "project-lifecycle/02-planning/project-management-plan/", "Comprehensive execution strategy"),
        ("Risk Management Plan", "project-lifecycle/02-planning/risk-management/", "Identify and plan for risks"),
        ("Resource Plan", "project-lifecycle/02-planning/resource-planning/", "Allocate people and budget"),
    ],
    "in_progress": [
        ("Status Report", "templates/traditional/Traditional/Templates/status_report_template.md", "Track and communicate progress"),
        ("Issue Log", "project-lifecycle/04-monitoring-control/issue-management/", "Manage problems quickly"),
        ("Change Control", "project-lifecycle/04-monitoring-control/change-control/", "Manage scope changes"),
    ],
    "closing": [
        ("Project Closure Report", "project-lifecycle/05-closure/project-closure/", "Formal completion"),
        ("Lessons Learned", "project-lifecycle/05-closure/lessons-learned/", "Capture knowledge"),
        ("Post-Implementation Review", "templates/universal/post-implementation-review-template.md", "Assess delivered value"),
    ],
}

AGILE_EXTRAS = [
    ("Sprint Planning", "templates/agile/sprint_planning_template.md", "Plan iteration work"),
    ("Product Backlog", "role-based-toolkits/product-owner/backlog-management-template.md", "Manage work items"),
    ("Sprint Retrospective", "templates/agile/sprint_retrospective_template.md", "Continuous improvement"),
]

RISK_EXTRAS = [
    ("Risk Register", "templates/traditional/Traditional/Templates/risk_register_template.md", "Track all risks"),
    ("Risk Assessment", "project-assessment-suite/risk-management-assessment-template.md", "Evaluate risk maturity"),
    ("Governance Assessment", "project-assessment-suite/governance-assessment-template.md", "Review oversight"),
]

TOOLKITS = {
    "agile": ("Scrum Master Toolkit", "role-based-toolkits/scrum-master/"),
    "traditional": ("Project Manager Toolkit", "role-based-toolkits/project-manager/"),
    "hybrid": ("Project Manager Toolkit", "role-based-toolkits/project-manager/"),
    "unsure": ("First-Time PM Starter Kit", "quick-start-kits/first-time-pm-starter/"),
}

PATHWAYS = {
    "starting": "Starting a New Project",
    "planning": "Starting a New Project",
    "in_progress": "Reporting to Stakeholders",
    "closing": "Closing a Project",
}

INDUSTRY_PATHS = {
    "it": "industry-specializations/information-technology/",
    "healthcare": "industry-specializations/healthcare-pharmaceutical/",
    "financial": "industry-specializations/financial-services/",
    "construction": "industry_templates/construction/",
}


# ── Interactive Input ─────────────────────────────────────────────────────────

def ask_questions() -> dict:
    print("\n📋 PROJECT CONTEXT ASSESSMENT")
    print("=" * 50)
    print("Answer 7 questions to get personalized template recommendations.\n")

    context = {}
    for q in QUESTIONS:
        options = q["options"]
        values = q.get("values", options)
        print(f"{q['prompt']}")
        for i, opt in enumerate(options, 1):
            default_mark = " (default)" if values[i-1] == q["default"] else ""
            print(f"  {i}. {opt}{default_mark}")

        while True:
            choice = input(f"Enter 1-{len(options)} [default: {q['default']}]: ").strip()
            if choice == "":
                context[q["key"]] = q["default"]
                break
            try:
                idx = int(choice) - 1
                if 0 <= idx < len(values):
                    context[q["key"]] = values[idx]
                    break
            except ValueError:
                pass
            print(f"  Please enter a number 1-{len(options)}")
        print()

    return context


# ── Recommendation Engine ─────────────────────────────────────────────────────

def generate_recommendations(ctx: dict) -> str:
    meth = ctx["methodology"]
    phase = ctx["phase"]
    risk = ctx["risk_profile"]
    exp = ctx["pm_experience"]
    industry = ctx["industry"]
    team = ctx["team_size"]
    size = ctx["size"]

    lines = []
    desc_parts = [size.title(), meth.title() if meth != "unsure" else ""]
    if industry != "general":
        desc_parts.append(industry.upper())
    desc_parts.append(f"Project ({risk.title()} Risk)")
    desc = " ".join(p for p in desc_parts if p)

    lines.append("=" * 60)
    lines.append(f"  PROJECT CONTEXT: {desc}")
    lines.append("=" * 60)
    lines.append("")

    # Essential templates
    lines.append("📋 ESSENTIAL TEMPLATES:")
    essentials = ESSENTIALS.get(phase, ESSENTIALS["starting"])
    if exp == "new":
        # Swap to simple versions
        essentials = [
            ("Project Charter (Simple)", "quick-start-kits/first-time-pm-starter/project-charter-simple.md", "Simplified project definition"),
            ("Risk Register (Simple)", "quick-start-kits/first-time-pm-starter/risk-register-simple.md", "Basic risk tracking"),
            ("Status Report (Simple)", "quick-start-kits/first-time-pm-starter/status-report-simple.md", "Simple progress updates"),
        ]
    for i, (name, path, reason) in enumerate(essentials, 1):
        lines.append(f"   {i}. {name}")
        lines.append(f"      → {path}")
        lines.append(f"      {reason}")
    lines.append("")

    # Methodology extras
    if meth == "agile" or (meth == "unsure" and team in ("solo", "small")):
        lines.append("🔄 AGILE ADD-ONS:")
        for name, path, reason in AGILE_EXTRAS:
            lines.append(f"   • {name} → {path}")
        lines.append("")

    # Risk extras
    if risk in ("high", "regulatory"):
        lines.append("⚠️  RISK/GOVERNANCE ADD-ONS:")
        for name, path, reason in RISK_EXTRAS:
            lines.append(f"   • {name} → {path}")
        lines.append("")

    # Toolkit
    toolkit_name, toolkit_path = TOOLKITS.get(meth, TOOLKITS["unsure"])
    if exp == "new":
        toolkit_name, toolkit_path = "First-Time PM Starter Kit", "quick-start-kits/first-time-pm-starter/"
    lines.append(f"📚 RECOMMENDED TOOLKIT:")
    lines.append(f"   → {toolkit_name} ({toolkit_path})")
    lines.append("")

    # Pathway
    pathway = PATHWAYS.get(phase, "Starting a New Project")
    lines.append(f"🛤️  USE-CASE PATHWAY:")
    lines.append(f"   → \"{pathway}\" (docs/USE_CASE_PATHWAYS.md)")
    lines.append("")

    # Industry
    if industry != "general" and industry in INDUSTRY_PATHS:
        lines.append(f"🏭 INDUSTRY TEMPLATES:")
        lines.append(f"   → {INDUSTRY_PATHS[industry]}")
        lines.append("")

    # Benefits tracking
    if size in ("large", "enterprise") or risk in ("high", "regulatory"):
        lines.append(f"📊 VALUE TRACKING:")
        lines.append(f"   • Benefits Register → templates/universal/benefits-register-lightweight.md")
        lines.append(f"   • ROI Dashboard → business-stakeholder-suite/financial-governance/roi-tracking-dashboard.md")
        lines.append("")

    lines.append("=" * 60)
    return "\n".join(lines)


# ── Main ──────────────────────────────────────────────────────────────────────

def main():
    if len(sys.argv) > 2 and sys.argv[1] == "--json":
        with open(sys.argv[2]) as f:
            ctx = json.load(f)
        if "project_context" in ctx:
            ctx = ctx["project_context"]
    else:
        ctx = ask_questions()

    print(generate_recommendations(ctx))


if __name__ == "__main__":
    main()
