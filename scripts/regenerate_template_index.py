#!/usr/bin/env python3
import json
import os
from datetime import datetime
from typing import Any, Dict, List, Tuple

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
TEMPLATES_JSON = os.path.join(REPO_ROOT, "templates", "templates.json")
INDEX_MD = os.path.join(REPO_ROOT, "TEMPLATE_INDEX.md")

PREFERRED_PREFIXES = (
    "templates/",
    "role-based-toolkits/",
    "project-lifecycle/",
    "project-assessment-suite/",
    "industry-specializations/",
)


def load_templates() -> List[Dict[str, Any]]:
    with open(TEMPLATES_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
        if isinstance(data, dict) and "templates" in data:
            return data["templates"]
        if isinstance(data, list):
            return data
        raise RuntimeError("Unrecognized templates.json structure")


def choose_best_path(entry: Dict[str, Any]) -> str:
    # Prefer canonical_path if present
    if isinstance(entry.get("canonical_path"), str) and entry["canonical_path"]:
        return entry["canonical_path"].lstrip("./")
    # Otherwise prefer entry.path that starts with preferred prefixes
    p = (entry.get("path") or "").lstrip("./")
    alts = entry.get("alternate_paths") or []
    candidates = [p] + [a.lstrip("./") for a in alts if isinstance(a, str)]
    # Keep only those that exist and match preferred prefixes ordering
    existing = [c for c in candidates if c and os.path.exists(os.path.join(REPO_ROOT, c))]
    if not existing:
        return p or (alts[0] if alts else "")
    # Sort by preferred prefix rank then by path length (shorter is nicer)
    def rank(path: str) -> Tuple[int, int, str]:
        prefix_rank = next((i for i, pref in enumerate(PREFERRED_PREFIXES) if path.startswith(pref)), 999)
        return (prefix_rank, len(path), path)
    existing.sort(key=rank)
    return existing[0]


def md_row(title: str, path: str, methodology: str, complexity: str, owner: str, last_updated: str) -> str:
    return f"| [{title}]({path}) | {methodology} | {complexity} | {owner} | {last_updated} |"


def normalize(s: Any, default: str = "") -> str:
    if s is None:
        return default
    if isinstance(s, (int, float)):
        return str(s)
    return str(s)


def main() -> int:
    templates = load_templates()

    # Deduplicate by chosen best path; if multiple entries map to same path, keep highest quality_score then latest updated
    items: Dict[str, Dict[str, Any]] = {}
    for t in templates:
        title = normalize(t.get("title") or t.get("name") or os.path.basename(t.get("path", "")).replace("_", " ").replace("-", " ").title())
        methodology = normalize(t.get("methodology") or "universal").lower()
        complexity = normalize(t.get("complexity") or t.get("level") or "intermediate").lower()
        owner = normalize(t.get("owner") or "mirichard")
        last_updated = normalize(t.get("last_updated") or t.get("lastModified") or datetime.utcnow().strftime("%Y-%m-%d"))
        path = choose_best_path(t)
        if not path:
            continue
        quality = t.get("quality_score") or 0
        key = path
        current = items.get(key)
        record = {
            "title": title,
            "path": path,
            "methodology": methodology,
            "complexity": complexity,
            "owner": owner,
            "last_updated": last_updated,
            "quality": quality,
        }
        if current is None:
            items[key] = record
        else:
            # prefer higher quality, then newer last_updated (lexicographical ISO date)
            if record["quality"] > current.get("quality", 0) or record["last_updated"] > current.get("last_updated", ""):
                items[key] = record

    # Sort by title asc
    rows = sorted(items.values(), key=lambda r: (r["title"].lower(), r["path"]))

    header_note = (
        "# Template Index\n\n"
        "Note on canonicalization:\n"
        "- This index prefers canonical paths under templates/ and role-based-toolkits/ when multiple equivalents exist.\n"
        "- Duplicates and aliases are omitted for clarity; see templates/templates.json for alternate_paths.\n\n"
        "<a id=\"beginner-templates\"></a>\n"
        "<a id=\"intermediate-templates\"></a>\n"
        "<a id=\"advanced-templates\"></a>\n\n"
    )

    table_header = "| Template | Methodology | Complexity | Owner | Last Updated |\n|---|---|---|---|---|\n"

    body = "\n".join(
        md_row(r["title"], r["path"], r["methodology"], r["complexity"], r["owner"], r["last_updated"]) for r in rows
    )

    content = header_note + table_header + body + "\n"

    with open(INDEX_MD, "w", encoding="utf-8") as f:
        f.write(content)

    print(f"Regenerated {INDEX_MD} with {len(rows)} unique templates.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
