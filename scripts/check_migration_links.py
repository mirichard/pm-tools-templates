#!/usr/bin/env python3
"""Check inline Markdown file/heading links in a migration wave against its base.

Dependency-free, deliberately scoped: inline Markdown links outside fenced code,
ATX headings and explicit HTML IDs. Does not check external URLs, site routing,
reference-style links, or inbound legacy section bookmarks. Reports pre-existing
failures separately; exits nonzero for new failures. Run from the repository root.
"""
import argparse
from collections import Counter
import html
import json
from pathlib import Path
import posixpath
import re
import subprocess
from urllib.parse import unquote, urlsplit


def prose(content):
    lines = []
    fence = None
    for line in content.splitlines():
        match = re.match(r"^\s*(`{3,}|~{3,})", line)
        if match:
            marker = match.group(1)
            if fence is None:
                fence = marker
            elif marker[0] == fence[0] and len(marker) >= len(fence):
                fence = None
            lines.append("")
        else:
            lines.append("" if fence else line)
    return "\n".join(lines)


def anchors(content):
    content = prose(content)
    found = set(re.findall(r'''\b(?:id|name)=["']([^"']+)["']''', content))
    used = set()
    for heading in re.findall(r"^ {0,3}#{1,6}\s+(.+?)\s*#*\s*$", content, re.M):
        heading = re.sub(r"\[([^]]+)\]\([^)]*\)", r"\1", heading)
        heading = html.unescape(re.sub(r"<[^>]+>", "", heading)).lower()
        slug = re.sub(r"[^\w\s-]", "", heading).replace(" ", "-")
        candidate = slug
        suffix = 0
        while candidate in used:
            suffix += 1
            candidate = f"{slug}-{suffix}"
        used.add(candidate)
        found.add(candidate)
    return found


def links(content):
    # Balanced parentheses in destinations cover the inline syntax used here.
    pattern = r"\]\((<[^>]+>|(?:[^\s()]|\([^()]*\))+)(?:\s+[\"'][^\n]*?[\"'])?\)"
    return [m.group(1).strip("<>") for m in re.finditer(pattern, prose(content))]


def check(content, source, read, exists):
    failures = Counter()
    checked = 0
    for href in links(content):
        url = urlsplit(html.unescape(href))
        if url.scheme or url.netloc:
            continue
        checked += 1
        target = unquote(url.path)
        target = (posixpath.normpath(target.lstrip("/")) if target.startswith("/")
                  else posixpath.normpath(posixpath.join(posixpath.dirname(source), target))
                  if target else source)
        if target == ".." or target.startswith("../") or not exists(target):
            failures[(href, "missing file or directory")] += 1
        elif url.fragment and target.lower().endswith(".md"):
            if unquote(url.fragment) not in anchors(read(target)):
                failures[(href, "missing heading or HTML anchor")] += 1
    return checked, failures


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--manifest", required=True)
    args = parser.parse_args()
    root = Path.cwd()
    plan = json.loads(Path(args.manifest).read_text())
    base = plan["pre_batch_sha"]
    # A missing base is a validation failure, never an empty baseline.
    def git(*args):
        return subprocess.check_output(["git", *args], text=True)
    entries = git("ls-tree", "-r", "-t", "--name-only", base).splitlines()
    base_paths = set(entries)
    def old_read(path):
        return git("show", f"{base}:{path}")
    moved = {a["destination"]: a["source"] for a in plan["assets"]}
    changed = git("diff", "--name-only", "--diff-filter=ACMR", base, "--", "*.md").splitlines()
    sources = sorted(set(changed) | set(moved) | {a["source"] for a in plan["assets"]})
    total = inherited = regressions = 0
    for source in sources:
        count, current = check((root / source).read_text(), source,
                               lambda p: (root / p).read_text(), lambda p: (root / p).exists())
        total += count
        previous = moved.get(source, source)
        old = Counter()
        if previous in base_paths:
            _, old = check(old_read(previous), previous, old_read, base_paths.__contains__)
        new = current - old
        inherited += sum((current & old).values())
        regressions += sum(new.values())
        for (href, reason), count in current.items():
            status = "NEW" if (href, reason) in new else "PRE-EXISTING"
            print(f"{status}: {source}: {href}: {reason} ({count})")
    print(f"Checked {len(sources)} files, {total} local inline links; "
          f"{inherited} pre-existing failures; {regressions} new failures.")
    raise SystemExit(1 if regressions else 0)


if __name__ == "__main__":
    main()
