"""Read-only regression and discovery checks for the three regional brand hubs."""
import argparse
import importlib.util
import json
from pathlib import Path
import re
import sys

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('blog_audit', Path(__file__).with_name('audit-blog-release.py'))
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
NEW = {'/services/' + brand + '-tv-repair' for brand in ('sony', 'samsung', 'lg')}
ALLOWED = {'/services', '/services/brands', '/services/sony-tv-repair-noida', '/services/samsung-tv-repair-delhi', '/services/lg-tv-repair-delhi'}


def check(current, before, origin):
    errors, changed = [], []
    pages = current['pages']
    if set(pages) - set(before['pages']) != NEW or set(before['pages']) - set(pages):
        errors.append('Sitemap additions/removals differ from the three hubs')
    for path, old in before['pages'].items():
        page = pages[path]
        for field in ('status', 'title', 'h1', 'description', 'canonical', 'robots', 'x_robots', 'schemas'):
            if page[field] != old[field]:
                errors.append(path + ': existing ' + field + ' changed')
        if not set(old['links']).issubset(page['links']):
            errors.append(path + ': existing link lost')
        if page['text'] != old['text']:
            changed.append(path)
            if path not in ALLOWED:
                errors.append(path + ': unexpected body change')
            remaining = iter(page['text'].split())
            if not all(any(word == candidate for candidate in remaining) for word in old['text'].split()):
                errors.append(path + ': original text lost or reordered')
    for path, page in pages.items():
        if page['status'] != 200 or len(page['h1']) != 1 or not page['title'] or not page['description']:
            errors.append(path + ': incomplete page')
        if page['canonical'].rstrip('/') != (base.PUBLIC + path).rstrip('/'):
            errors.append(path + ': canonical mismatch')
        if 'noindex' in str([page['robots'], page['x_robots']]).lower():
            errors.append(path + ': noindex')
        if not page['schemas']:
            errors.append(path + ': no schema')
        for schema in page['schemas']:
            if schema.get('@type') == 'FAQPage':
                for faq in schema['mainEntity']:
                    if faq['name'] not in page['text'] or faq['acceptedAnswer']['text'] not in page['text']:
                        errors.append(path + ': FAQ schema differs from visible copy')
    for path in NEW:
        page = pages[path]
        slug = path.rsplit('/', 1)[1]
        if page['h1'][0].lower().replace(' ', '-') != slug:
            errors.append(path + ': primary keyword/H1/URL mismatch')
        if len(page['text'].split()) < 700:
            errors.append(path + ': incomplete repair guidance')
        expected_cities = {path + '-' + city for city in ('delhi', 'noida', 'greater-noida', 'ghaziabad')}
        if not expected_cities.issubset(page['links']):
            errors.append(path + ': missing local service handoff')
        if not {'/pricing', '/contact', '/about'}.issubset(page['links']):
            errors.append(path + ': missing trust/conversion links')
        if len([link for link in page['links'] if link.startswith('/blog/')]) < 3:
            errors.append(path + ': insufficient supporting guides')
        if not any(path in p['links'] for other, p in pages.items() if other not in NEW):
            errors.append(path + ': orphaned hub')
        if base.PUBLIC + path not in current['llms']:
            errors.append(path + ': absent from llms.txt')
        services = [schema for schema in page['schemas'] if schema.get('@type') == 'Service']
        if len(services) != 1 or services[0].get('provider', {}).get('@id') != base.PUBLIC + '/#localbusiness':
            errors.append(path + ': inconsistent provider entity')
        if 'aggregateRating' in json.dumps(page['schemas']):
            errors.append(path + ': unsupported rating introduced')
    for url, date in before['lastmods'].items():
        if current['lastmods'].get(url) != date:
            errors.append(url + ': existing sitemap date changed')
    if any(current['lastmods'].get(base.PUBLIC + path)[:10] != '2026-10-28' for path in NEW):
        errors.append('New hub dates are incorrect')
    if current['robots'] != before['robots']:
        errors.append('robots.txt changed')
    if not all(line in current['llms'] for line in before['llms'].splitlines() if line.strip()):
        errors.append('Existing llms.txt content lost')
    links = {link.split('?')[0] for p in pages.values() for link in p['links'] if link.startswith('/')}
    for link in links - set(pages):
        if base.audit.read(origin + link)[1] != 200:
            errors.append(link + ': broken internal destination')
    service_sets = {path: base.audit.phrases(p['text']) for path, p in pages.items() if path.startswith('/services/')}
    overlaps = {}
    for path in sorted(NEW | {'/services/' + slug for slug in base.audit.TARGETS}):
        score, other = max((base.audit.overlap(service_sets[path], value), other) for other, value in service_sets.items() if other != path)
        overlaps[path] = {'percent': round(score, 2), 'nearest': other}
        if score >= 25:
            errors.append(path + ': shared five-word phrase overlap >=25%')
    return {'origin': origin, 'checked_pages': len(pages), 'preserved_existing_pages': len(before['pages']), 'new_hubs': sorted(NEW), 'existing_pages_with_additive_links': sorted(changed), 'phrase_overlap': overlaps, 'failures': errors}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--baseline', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    result = check(base.capture(args.url.rstrip('/')), json.loads(Path(args.baseline).read_text(encoding='utf-8')), args.url.rstrip('/'))
    Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps(result, indent=2))
    sys.exit(bool(result['failures']))
