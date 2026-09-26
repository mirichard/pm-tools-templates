#!/usr/bin/env python3
"""Build the pinned DEV-SSH-01 source-only packet; no findings are embedded."""
import argparse
import hashlib
import json
from pathlib import Path
from urllib.request import Request, urlopen

from pypdf import PdfReader, PdfWriter

SOURCES = [
    {
        "id": "SSH-11", "record": "3595441",
        "filename": "D1.1 SSHOC Project Management Plan (approved 18 Nov 2019).pdf",
        "bytes": 1190085,
        "sha256": "f10479d2af4f12aebbddde36372832fbcef88dc131bfc78304f251962c9553a3",
        "pages": [1, 2, 11, 12],
    },
    {
        "id": "SSH-12A", "record": "4436724",
        "filename": "D1.2. Quality Assurance & Risk Assessment Plan_v1.2_(approved 3 Nov 2020).pdf",
        "bytes": 1172230,
        "sha256": "48779e0fea37b55593b9fb79bfbe2c9f6092d52737eaf118962e18520b3bd74a",
        "pages": [1, 2, 22, 23, 24],
    },
]


def fetch(url):
    request = Request(url, headers={"User-Agent": "PMToolsResearch/1.0"})
    with urlopen(request, timeout=60) as response:
        return response.read()


def build(output):
    if output.exists() and any(output.iterdir()):
        raise ValueError("Output directory must be empty; retain earlier runs.")
    output.mkdir(parents=True, exist_ok=True)
    writer = PdfWriter()
    manifest = {"pack": "DEV-SSH-01", "version": "1.0", "sources": [], "page_map": []}
    for source in SOURCES:
        api_url = "https://zenodo.org/api/records/" + source["record"]
        record_bytes = fetch(api_url)
        record = json.loads(record_bytes)
        if record.get("metadata", {}).get("license", {}).get("id") != "cc-by-4.0":
            raise ValueError("License metadata changed for " + source["id"])
        matches = [entry for entry in record["files"] if entry["key"] == source["filename"]]
        if len(matches) != 1:
            raise ValueError("Exact source file not found: " + source["id"])
        download_url = matches[0]["links"]["self"]
        data = fetch(download_url)
        if len(data) != source["bytes"] or hashlib.sha256(data).hexdigest() != source["sha256"]:
            raise ValueError("Pinned source verification failed: " + source["id"])
        original = output / (source["id"] + ".pdf")
        original.write_bytes(data)
        (output / (source["id"] + "-record.json")).write_bytes(record_bytes)
        reader = PdfReader(original)
        for page in source["pages"]:
            writer.add_page(reader.pages[page - 1])
            manifest["page_map"].append({
                "packet_page": len(manifest["page_map"]) + 1,
                "source_id": source["id"], "original_pdf_page": page,
            })
        manifest["sources"].append({
            **source, "record_api": api_url, "download_url": download_url,
            "license": "CC-BY-4.0", "total_pdf_pages": len(reader.pages),
        })
    packet = output / "DEV-SSH-01-source-only.pdf"
    with packet.open("wb") as handle:
        writer.write(handle)
    if len(PdfReader(packet).pages) != 9:
        raise ValueError("Packet page count failed")
    manifest["packet_sha256"] = hashlib.sha256(packet.read_bytes()).hexdigest()
    manifest_path = output / "manifest.json"
    manifest_path.write_text(json.dumps(manifest, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "packet": str(packet), "pages": 9,
        "manifest_sha256": hashlib.sha256(manifest_path.read_bytes()).hexdigest(),
    }))


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("output_directory", type=Path)
    args = parser.parse_args()
    try:
        build(args.output_directory)
    except Exception as error:
        parser.exit(1, "Packet preparation failed: " + str(error) + "\n")
