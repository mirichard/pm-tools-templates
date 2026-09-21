"""Validate Markdown changed by a pull request, never an unrelated fallback set."""
import json
import os
from pathlib import Path
import re
import subprocess
import sys


def git(*args):
    return subprocess.check_output(["git", *args])


def validate(event):
    pr = event["pull_request"]
    base, head = pr["base"]["sha"], pr["head"]["sha"]
    if not all(re.fullmatch(r"[0-9a-f]{40}", sha) for sha in (base, head)):
        raise ValueError("Expected full commit SHAs for pull request base and head")
    # Three-dot diff excludes unrelated base-branch changes. NUL delimiting
    # preserves spaces/newlines; deletions are intentionally excluded.
    paths = git("diff", "--name-only", "--diff-filter=ACMRT", "-z",
                f"{base}...{head}", "--").split(b"\0")
    paths = [os.fsdecode(p) for p in paths if p and p.endswith((b".md", b".markdown"))]
    if not paths:
        print("No changed Markdown files; validation not applicable.")
        return 0
    failed = False
    for path in paths:
        # Read the exact PR blob, rather than following a checkout symlink or
        # validating the synthetic merge commit's different content.
        content = git("show", f"{head}:{path}")
        if not re.search(rb"^# ", content, re.MULTILINE) or len(content) < 50:
            print(f"FAIL {path!r}: missing title or fewer than 50 bytes")
            failed = True
        else:
            print(f"PASS {path!r}")
    print(f"Validated {len(paths)} changed Markdown files.")
    return int(failed)


if __name__ == "__main__":
    try:
        if os.environ.get("GITHUB_EVENT_NAME") != "pull_request":
            raise ValueError("Changed-file validation requires a pull_request event")
        sys.exit(validate(json.loads(Path(os.environ["GITHUB_EVENT_PATH"]).read_text())))
    except (KeyError, ValueError, OSError, subprocess.CalledProcessError) as error:
        print(f"Cannot validate pull request files: {error}", file=sys.stderr)
        sys.exit(1)
