"""Read-only audit of rendered service copy and its search-facing contract.

Use --snapshot before editing, then --baseline against a local production build.
Overlap deliberately uses the same metric as the original live-site audit:
intersection of distinct five-word phrases / smaller phrase set, main text only.
"""

import argparse
from concurrent.futures import ThreadPoolExecutor
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import urllib.request
import xml.etree.ElementTree as ET


TARGETS = [
    "toshiba-tv-repair-delhi", "toshiba-tv-repair-noida",
    "toshiba-tv-repair-greater-noida", "toshiba-tv-repair-ghaziabad",
    "lg-tv-repair-noida", "lg-tv-repair-greater-noida",
    "vu-tv-repair-greater-noida", "plasma-tv-repair-ghaziabad",
    "oled-qled-tv-repair-noida",
]
PUBLIC_ORIGIN = "https://grsolution.co.in"


class Page(HTMLParser):
    def __init__(self):
        super().__init__()
        self.main = self.skip = 0
        self.capture = None
        self.capture_text = []
        self.text, self.headings, self.links, self.schemas = [], [], [], []
        self.meta, self.canonical, self.title = {}, "", ""

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag == "main":
            self.main += 1
        if tag in ("script", "style", "noscript"):
            self.skip += 1
        if tag == "meta" and attrs.get("name"):
            self.meta[attrs["name"]] = attrs.get("content", "")
        if tag == "link" and attrs.get("rel") == "canonical":
            self.canonical = attrs.get("href", "")
        if tag == "a" and self.main:
            self.links.append(attrs.get("href", "").split("#")[0])
        if tag in ("h1", "title") or (tag == "script" and attrs.get("type") == "application/ld+json"):
            self.capture = tag
            self.capture_text = []

    def handle_data(self, data):
        if self.main and not self.skip and data.strip():
            self.text.append(data.strip())
        if self.capture:
            self.capture_text.append(data)

    def handle_endtag(self, tag):
        if tag == self.capture:
            value = "".join(self.capture_text)
            if tag == "h1":
                self.headings.append(value)
            elif tag == "title":
                self.title = value
            else:
                decoded = json.loads(value)
                self.schemas.extend(decoded if isinstance(decoded, list) else [decoded])
            self.capture = None
        if tag == "main":
            self.main = max(0, self.main - 1)
        if tag in ("script", "style", "noscript"):
            self.skip = max(0, self.skip - 1)


def read(url):
    request = urllib.request.Request(url, headers={"User-Agent": "GRSolutionContentAudit/1.0"})
    with urllib.request.urlopen(request, timeout=45) as response:
        return response.read().decode("utf-8"), response.status, response.headers


def fetch(origin, path):
    body, status, headers = read(origin + path)
    page = Page()
    page.feed(body)
    return path, {
        "status": status, "title": page.title, "h1": page.headings,
        "description": page.meta.get("description"), "canonical": page.canonical,
        "robots": {k: v for k, v in page.meta.items() if k in ("robots", "googlebot")},
        "x_robots": headers.get("X-Robots-Tag"),
        "text": " ".join(page.text), "links": sorted(set(page.links)),
        "schemas": page.schemas,
    }


def phrases(text):
    words = re.findall(r"\w+", text.lower())
    return {tuple(words[i:i + 5]) for i in range(len(words) - 4)}


def overlap(left, right):
    return 100 * len(left & right) / min(len(left), len(right)) if left and right else 0


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--url", required=True)
    parser.add_argument("--snapshot")
    parser.add_argument("--baseline")
    parser.add_argument("--output")
    args = parser.parse_args()
    origin = args.url.rstrip("/")
    xml, _, _ = read(origin + "/sitemap.xml")
    locations = [node.text for node in ET.fromstring(xml).findall("{*}url/{*}loc")]
    paths = sorted(url.removeprefix(PUBLIC_ORIGIN) for url in locations if "/services/" in url)
    with ThreadPoolExecutor(max_workers=4) as pool:
        pages = dict(pool.map(lambda path: fetch(origin, path), paths))
    robots = read(origin + "/robots.txt")[0]
    snapshot = {"pages": pages, "sitemap": locations, "robots": robots}
    if args.snapshot:
        Path(args.snapshot).write_text(json.dumps(snapshot, ensure_ascii=False), encoding="utf-8")
    baseline = json.loads(Path(args.baseline).read_text(encoding="utf-8")) if args.baseline else None
    phrase_sets = {path: phrases(page["text"]) for path, page in pages.items()}
    rows, failures = [], []
    for slug in TARGETS:
        path = "/services/" + slug
        page = pages[path]
        matches = sorted((
            {"path": other, "percent": round(overlap(phrase_sets[path], value), 2)}
            for other, value in phrase_sets.items() if other != path
        ), key=lambda match: match["percent"], reverse=True)
        unchanged = {}
        if baseline:
            before = baseline["pages"][path]
            for key in ("status", "title", "h1", "description", "canonical", "robots", "x_robots"):
                unchanged[key] = page[key] == before[key]
            # Preserve every existing internal destination, including blog guides.
            unchanged["internal_links"] = set(before["links"]).issubset(page["links"])
            before_schemas = {schema["@type"]: schema for schema in before["schemas"] if isinstance(schema.get("@type"), str)}
            after_schemas = {schema["@type"]: schema for schema in page["schemas"] if isinstance(schema.get("@type"), str)}
            for schema_type in ("Service", "BreadcrumbList"):
                unchanged[schema_type] = before_schemas.get(schema_type) == after_schemas.get(schema_type)
            faq = after_schemas.get("FAQPage", {}).get("mainEntity", [])
            unchanged["faq_matches_content"] = bool(faq) and all(
                item["name"] in page["text"] and item["acceptedAnswer"]["text"] in page["text"]
                for item in faq
            )
            failures.extend(path + ": " + key for key, value in unchanged.items() if not value)
            if matches[0]["percent"] >= 25:
                failures.append(path + ": overlap >= 25%")
        rows.append({"path": path, "words": len(page["text"].split()), "closest": matches[:3], "preserved": unchanged})
    if baseline:
        if set(locations) != set(baseline["sitemap"]):
            failures.append("Sitemap URL set changed")
        if robots != baseline["robots"]:
            failures.append("robots.txt changed")
        # Unrequested service pages must keep their main copy and metadata.
        for path, page in pages.items():
            if path.rsplit("/", 1)[-1] not in TARGETS and page != baseline["pages"][path]:
                failures.append(path + ": untargeted page changed")
    result = {
        "metric": "Shared distinct five-word phrases / smaller phrase set; main content only; names retained",
        "compared_service_pages": len(pages), "targets": rows, "failures": failures,
    }
    if args.output:
        Path(args.output).write_text(json.dumps(result, indent=2, ensure_ascii=False) + "\n", encoding="utf-8")
    print(json.dumps(result, indent=2, ensure_ascii=True), flush=True)
    if failures:
        raise SystemExit(1)


if __name__ == "__main__":
    main()
