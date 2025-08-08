#!/usr/bin/env python3
import json
import os
import sys
from typing import List, Dict, Any

REPO_ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), os.pardir))
TEMPLATES_JSON = os.path.join(REPO_ROOT, "templates", "templates.json")


def load_templates() -> List[Dict[str, Any]]:
    with open(TEMPLATES_JSON, "r", encoding="utf-8") as f:
        data = json.load(f)
        if isinstance(data, dict) and "templates" in data:
            return data["templates"]
        if isinstance(data, list):
            return data
        raise SystemExit("templates.json format not recognized (expected list or object with 'templates')")


def path_exists(rel_path: str) -> bool:
    # Allow leading './'
    rel_path = rel_path.lstrip("./")
    abs_path = os.path.join(REPO_ROOT, rel_path)
    return os.path.exists(abs_path)


def main() -> int:
    templates = load_templates()
    errors = []

    # Track canonical ownership to ensure uniqueness
    canonical_owner: Dict[str, str] = {}

    for t in templates:
        title = t.get("title") or t.get("name") or t.get("path", "<unknown>")
        canonical = t.get("canonical_path")
        if canonical:
            if not path_exists(canonical):
                errors.append(f"[MISSING] canonical_path does not exist for '{title}': {canonical}")
            owner = canonical_owner.get(canonical)
            if owner and owner != title:
                errors.append(
                    f"[DUPLICATE] canonical_path claimed by multiple templates: '{owner}' and '{title}' -> {canonical}"
                )
            else:
                canonical_owner[canonical] = title

        alts = t.get("alternate_paths") or []
        if not isinstance(alts, list):
            errors.append(f"[INVALID] alternate_paths must be an array for '{title}' (got {type(alts).__name__})")
            alts = []
        # Validate alternates exist and are distinct from canonical
        for ap in alts:
            if not isinstance(ap, str):
                errors.append(f"[INVALID] alternate_paths contains non-string entry for '{title}': {ap!r}")
                continue
            if canonical and ap == canonical:
                errors.append(f"[REDUNDANT] alternate path equals canonical for '{title}': {ap}")
            if not path_exists(ap):
                errors.append(f"[MISSING] alternate path does not exist for '{title}': {ap}")

        # If a bare 'path' field exists, sanity check it too
        p = t.get("path")
        if isinstance(p, str) and p:
            if not path_exists(p):
                errors.append(f"[MISSING] declared path does not exist for '{title}': {p}")

    if errors:
        print("Canonical/alternate path validation failed with the following issues:\n")
        for e in errors:
            print("- ", e)
        print(f"\nTotal issues: {len(errors)}")
        return 1

    print("All canonical_path, alternate_paths, and path entries are valid and unique.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
