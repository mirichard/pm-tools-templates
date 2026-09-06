#!/usr/bin/env python3
"""Build compact, deterministic visual-regression baseline packs."""

from __future__ import annotations

import argparse
import hashlib
import json
import re
import tempfile
import zipfile
from datetime import datetime, timezone
from pathlib import Path

from PIL import Image


BASELINE_WIDTH = 256
MAX_WEBP_DIMENSION = 16_383
WEBP_QUALITY = 85
WEBP_METHOD = 4


def sha256(path: Path) -> str:
    digest = hashlib.sha256()
    with path.open("rb") as stream:
        for chunk in iter(lambda: stream.read(1024 * 1024), b""):
            digest.update(chunk)
    return digest.hexdigest()


def convert_image(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        image = image.convert("RGB")
        width, height = image.size
        scale = min(BASELINE_WIDTH / width, MAX_WEBP_DIMENSION / height)
        baseline_width = max(1, round(width * scale))
        baseline_height = max(1, round(height * scale))
        image = image.resize(
            (baseline_width, baseline_height), Image.Resampling.LANCZOS
        )
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination, "WEBP", quality=WEBP_QUALITY, method=WEBP_METHOD)


def pack_name(source: Path) -> str:
    name = source.stem if source.is_file() else source.name
    name = re.sub(r"^screenshots-", "", name)
    name = re.sub(r"-\d+$", "", name)
    return f"{name}.zip"


def write_deterministic_pack(source_dir: Path, pack_path: Path) -> None:
    with zipfile.ZipFile(pack_path, "w", compression=zipfile.ZIP_STORED) as archive:
        for baseline in sorted(source_dir.rglob("*.webp")):
            relative_path = baseline.relative_to(source_dir).as_posix()
            info = zipfile.ZipInfo(relative_path, date_time=(1980, 1, 1, 0, 0, 0))
            info.compress_type = zipfile.ZIP_STORED
            info.external_attr = 0o100644 << 16
            archive.writestr(info, baseline.read_bytes())


def build_pack(source: Path, output_dir: Path) -> dict[str, object]:
    pack_path = output_dir / pack_name(source)
    if pack_path.exists():
        with zipfile.ZipFile(pack_path) as archive:
            baselines = sorted(
                path for path in archive.namelist() if path.endswith(".webp")
            )
        if not baselines:
            raise ValueError(f"Existing pack has no WebP baselines: {pack_path}")
        resolution_names = {Path(path).parent.name for path in baselines}
        if len(resolution_names) != 1:
            raise ValueError(f"Existing pack has mixed resolutions: {pack_path}")
        return {
            "file": pack_path.name,
            "browser_resolution": resolution_names.pop().replace("screenshots-", ""),
            "screenshots": len(baselines),
            "bytes": pack_path.stat().st_size,
            "sha256": sha256(pack_path),
        }

    with tempfile.TemporaryDirectory(prefix="visual-baseline-") as temp_dir:
        extracted_dir = Path(temp_dir) / "extracted"
        converted_dir = Path(temp_dir) / "converted"
        if source.is_file():
            with zipfile.ZipFile(source) as archive:
                archive.extractall(extracted_dir)
            source_dir = extracted_dir
        else:
            source_dir = source

        sources = sorted(source_dir.rglob("*.png"))
        if not sources:
            raise ValueError(f"No PNG screenshots found in {source}")

        resolution_names = {source.parent.name for source in sources}
        if len(resolution_names) != 1:
            raise ValueError(
                f"Expected one browser/resolution directory in {source}; "
                f"found {sorted(resolution_names)}"
            )

        resolution_name = resolution_names.pop()
        baseline_dir = converted_dir / f"screenshots-{resolution_name}"
        for source in sources:
            convert_image(source, baseline_dir / f"{source.stem}.webp")

        write_deterministic_pack(converted_dir, pack_path)

    return {
        "file": pack_path.name,
        "browser_resolution": resolution_name,
        "screenshots": len(sources),
        "bytes": pack_path.stat().st_size,
        "sha256": sha256(pack_path),
    }


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("input_dir", type=Path)
    parser.add_argument("output_dir", type=Path)
    parser.add_argument("--source-run", required=True, type=int)
    parser.add_argument("--source-commit", required=True)
    args = parser.parse_args()

    sources = sorted(args.input_dir.glob("*.zip"))
    if not sources:
        sources = sorted(path for path in args.input_dir.iterdir() if path.is_dir())
    if not sources:
        raise SystemExit(f"No screenshot artifacts found in {args.input_dir}")

    args.output_dir.mkdir(parents=True, exist_ok=True)
    packs = [build_pack(source, args.output_dir) for source in sources]
    manifest = {
        "schema_version": 1,
        "generated_at": datetime.now(timezone.utc).isoformat(),
        "source_workflow_run": args.source_run,
        "source_commit": args.source_commit,
        "format": "webp",
        "width": BASELINE_WIDTH,
        "maximum_dimension": MAX_WEBP_DIMENSION,
        "quality": WEBP_QUALITY,
        "method": WEBP_METHOD,
        "total_screenshots": sum(int(pack["screenshots"]) for pack in packs),
        "packs": packs,
    }
    (args.output_dir / "manifest.json").write_text(
        json.dumps(manifest, indent=2) + "\n", encoding="utf-8"
    )


if __name__ == "__main__":
    main()
