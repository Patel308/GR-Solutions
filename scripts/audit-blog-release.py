"""Read-only SEO regression audit for the two October repair guides.

Capture --snapshot before editing, then supply it as --baseline against the
production build. Uses the existing rendered-HTML parser; no extra packages.
"""
import argparse
from concurrent.futures import ThreadPoolExecutor
import importlib.util
import json
from pathlib import Path
import re
import sys
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('service_audit', Path(__file__).with_name('audit-service-content.py'))
audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(audit)
NEW_PATHS = {'/blog/tv-motherboard-diagnosis', '/blog/prepare-for-doorstep-tv-repair'}
PUBLIC = audit.PUBLIC_ORIGIN


def capture(origin):
    xml = audit.read(origin + '/sitemap.xml')[0]
    dates = {node.find('{*}loc').text: node.find('{*}lastmod').text for node in ET.fromstring(xml)}
    with ThreadPoolExecutor(max_workers=4) as pool:
        pages = dict(pool.map(lambda url: audit.fetch(origin, url.removeprefix(PUBLIC)), dates))
    return {'pages': pages, 'lastmods': dates, 'robots': audit.read(origin + '/robots.txt')[0], 'llms': audit.read(origin + '/llms.txt')[0]}


def check(current, before, origin):
    errors = []
    old_pages, pages = before['pages'], current['pages']
    if set(pages) - set(old_pages) != NEW_PATHS or set(old_pages) - set(pages):
        errors.append('Sitemap additions differ from the two new blogs or an existing URL was removed')
    fields = ('status', 'title', 'h1', 'description', 'canonical', 'robots', 'x_robots')
    changed = []
    for path, page in pages.items():
        if page['status'] != 200 or not page['title'] or not page['description'] or len(page['h1']) != 1:
            errors.append(path + ': incomplete page')
        if page['canonical'].rstrip('/') != (PUBLIC + path).rstrip('/'):
            errors.append(path + ': wrong canonical')
        if 'noindex' in str([page['robots'], page['x_robots']]).lower():
            errors.append(path + ': blocked from indexing')
        if not page['schemas']:
            errors.append(path + ': missing structured data')
        for schema in page['schemas']:
            if schema.get('@type') == 'FAQPage':
                for item in schema['mainEntity']:
                    if item['name'] not in page['text'] or item['acceptedAnswer']['text'] not in page['text']:
                        errors.append(path + ': FAQ differs from visible content')
        if path in old_pages:
            old = old_pages[path]
            errors.extend(path + ': changed ' + key for key in fields if page[key] != old[key])
            if not set(old['links']).issubset(page['links']):
                errors.append(path + ': existing link removed')
            if old['schemas'] != page['schemas']:
                errors.append(path + ': existing structured data changed')
            if page['text'] != old['text']:
                changed.append(path)
                # New CTAs/cards may interrupt the text, but no old article or
                # service wording should disappear. /blog card labels changed.
                if path != '/blog':
                    remaining = iter(re.findall(r'\S+', page['text']))
                    if not all(any(word == candidate for candidate in remaining) for word in re.findall(r'\S+', old['text'])):
                        errors.append(path + ': existing body text removed or reordered')
        else:
            blog = next((s for s in page['schemas'] if s.get('@type') == 'BlogPosting'), {})
            if blog.get('datePublished') != '2026-10-25' or blog.get('dateModified') != '2026-10-25':
                errors.append(path + ': incorrect new article dates')
            if not blog.get('image', '').startswith(PUBLIC + '/images/blog/'):
                errors.append(path + ': missing original blog image')
            else:
                with urllib.request.urlopen(origin + blog['image'].removeprefix(PUBLIC), timeout=30) as image:
                    if image.status != 200 or not image.headers.get('Content-Type', '').startswith('image/'):
                        errors.append(path + ': image not served')
            if '/pricing' not in page['links'] or '/contact' not in page['links']:
                errors.append(path + ': missing conversion links')
            if not any(path in p['links'] for other, p in pages.items() if other != path):
                errors.append(path + ': orphaned new article')
    internal = {link.split('?')[0] for p in pages.values() for link in p['links'] if link.startswith('/')}
    for link in sorted(internal - set(pages)):
        try:
            if audit.read(origin + link)[1] != 200:
                errors.append(link + ': broken internal link')
        except urllib.error.HTTPError as error:
            errors.append(link + ': HTTP ' + str(error.code))
    if current['robots'] != before['robots']:
        errors.append('robots.txt changed')
    if not all(PUBLIC + path in current['llms'] for path in NEW_PATHS):
        errors.append('New articles missing from llms.txt')
    if not all(line in current['llms'] for line in before['llms'].splitlines() if line.strip()):
        errors.append('Existing llms.txt content removed')
    landing = audit.fetch(origin, '/landing')[1]
    if 'noindex' not in str(landing['robots']).lower() or PUBLIC + '/landing' in current['lastmods']:
        errors.append('Intentional landing exclusion changed')
    try:
        audit.read(origin + '/missing-blog-release-audit')
        errors.append('Missing URL did not return 404')
    except urllib.error.HTTPError as error:
        if error.code != 404:
            errors.append('Missing URL returned unexpected status')
    service_sets = {path: audit.phrases(p['text']) for path, p in pages.items() if path.startswith('/services/')}
    overlap = {}
    for slug in audit.TARGETS:
        path = '/services/' + slug
        overlap[path] = round(max(audit.overlap(service_sets[path], value) for other, value in service_sets.items() if other != path), 2)
        if overlap[path] >= 25:
            errors.append(path + ': service phrase overlap is no longer below 25%')
    return {'origin': origin, 'checked_pages': len(pages), 'existing_pages_preserved': len(old_pages), 'new_pages': sorted(NEW_PATHS), 'changed_existing_body': changed, 'service_max_phrase_overlap': overlap, 'failures': errors}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--snapshot')
    parser.add_argument('--baseline')
    parser.add_argument('--output')
    args = parser.parse_args()
    origin = args.url.rstrip('/')
    current = capture(origin)
    if args.snapshot:
        Path(args.snapshot).write_text(json.dumps(current, ensure_ascii=False), encoding='utf-8')
    if args.baseline:
        result = check(current, json.loads(Path(args.baseline).read_text(encoding='utf-8')), origin)
        if args.output:
            Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
        print(json.dumps(result, indent=2))
        sys.exit(bool(result['failures']))
    print('Captured', len(current['pages']), 'pages')
