"""Read-only preservation, discovery and intent checks for the two repair pages."""
import argparse
import importlib.util
import json
from pathlib import Path
import sys
import urllib.error
from urllib.parse import unquote

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('blog_audit', Path(__file__).with_name('audit-blog-release.py'))
base = importlib.util.module_from_spec(spec)
spec.loader.exec_module(base)
NEW = {'/services/tv-repair-dwarka', '/services/smart-tv-repair'}
REMOVED_DRAFTS = {'/services/' + brand + '-tv-repair' for brand in ('sony', 'samsung', 'lg')}
ALLOWED = {'/services', '/services/tv-repair-west-delhi', '/services/tv-repair-delhi', '/services/led-tv-repair'}


class DetailPage(base.audit.Page):
    def __init__(self):
        super().__init__()
        self.ids, self.anchors, self.images = set(), [], []

    def handle_starttag(self, tag, attrs):
        super().handle_starttag(tag, attrs)
        attrs = dict(attrs)
        if attrs.get('id'):
            self.ids.add(attrs['id'])
        if self.main and tag == 'a':
            self.anchors.append(attrs.get('href', ''))
        if self.main and tag == 'img':
            self.images.append(attrs)


def check(current, before, origin):
    errors, changed, new_details = [], [], []
    pages = current['pages']
    if set(pages) - set(before['pages']) != NEW or set(before['pages']) - set(pages):
        errors.append('Sitemap changes differ from the two requested pages')
    for path, old in before['pages'].items():
        page = pages[path]
        for key in ('status', 'title', 'h1', 'description', 'canonical', 'robots', 'x_robots', 'schemas'):
            if page[key] != old[key]:
                errors.append(path + ': existing ' + key + ' changed')
        if not set(old['links']).issubset(page['links']):
            errors.append(path + ': original internal link removed')
        if old['text'] != page['text']:
            changed.append(path)
            remaining = iter(page['text'].split())
            if path not in ALLOWED or not all(any(word == candidate for candidate in remaining) for word in old['text'].split()):
                errors.append(path + ': original body changed beyond approved additions')
    for path, page in pages.items():
        if page['status'] != 200 or len(page['h1']) != 1 or not page['title'] or not page['description']:
            errors.append(path + ': incomplete or unsuccessful page')
        if page['canonical'].rstrip('/') != (base.PUBLIC + path).rstrip('/'):
            errors.append(path + ': incorrect canonical')
        if 'noindex' in str([page['robots'], page['x_robots']]).lower():
            errors.append(path + ': blocked from indexing')
        for schema in page['schemas']:
            if schema.get('@type') == 'FAQPage':
                for faq in schema['mainEntity']:
                    if faq['name'] not in page['text'] or faq['acceptedAnswer']['text'] not in page['text']:
                        errors.append(path + ': FAQ schema does not match visible content')
    for path in NEW:
        page = pages[path]
        other = (NEW - {path}).pop()
        if other not in page['links'] or not {'/pricing', '/contact', '/about'}.issubset(page['links']):
            errors.append(path + ': missing contextual or conversion links')
        if not any(path in p['links'] for other_path, p in pages.items() if other_path not in NEW):
            errors.append(path + ': orphaned page')
        service = next((s for s in page['schemas'] if s.get('@type') == 'Service'), {})
        if service.get('provider', {}).get('@id') != base.PUBLIC + '/#localbusiness':
            errors.append(path + ': inconsistent provider entity')
        if service.get('url') != base.PUBLIC + path:
            errors.append(path + ': incorrect Service URL')
        faq = next((s for s in page['schemas'] if s.get('@type') == 'FAQPage'), {})
        if len(faq.get('mainEntity', [])) != 6:
            errors.append(path + ': missing booking questions')
        parsed = DetailPage()
        parsed.feed(base.audit.read(origin + path)[0])
        for link in parsed.anchors:
            if link.startswith('#') and link[1:] not in parsed.ids:
                errors.append(path + ': broken page anchor ' + link)
        if not parsed.images or not parsed.images[0].get('alt') or '/images/workshop-repair-bench.webp' not in unquote(parsed.images[0].get('src', '')):
            errors.append(path + ': incorrect workshop image/alt')
        if base.PUBLIC + path not in current['llms']:
            errors.append(path + ': missing from llms.txt')
        if current['lastmods'].get(base.PUBLIC + path, '')[:10] != '2026-10-28':
            errors.append(path + ': incorrect sitemap review date')
        new_details.append({'path': path, 'h1': page['h1'][0], 'words': len(page['text'].split()), 'faq_count': len(faq['mainEntity']), 'internal_links': len([link for link in page['links'] if link.startswith('/')])})
    # Draft pages never existed in production: remove them rather than redirect.
    for path in REMOVED_DRAFTS:
        if path in pages or any(path in p['links'] for p in pages.values()) or base.PUBLIC + path + ')' in current['llms']:
            errors.append(path + ': removed draft is still discoverable')
        try:
            base.audit.read(origin + path)
            errors.append(path + ': removed draft did not return 404')
        except urllib.error.HTTPError as error:
            if error.code != 404:
                errors.append(path + ': removed draft returned ' + str(error.code))
    for url, date in before['lastmods'].items():
        if current['lastmods'].get(url) != date:
            errors.append(url + ': existing sitemap date changed')
    if current['robots'] != before['robots']:
        errors.append('robots.txt changed')
    if not all(line in current['llms'] for line in before['llms'].splitlines() if line.strip()):
        errors.append('Existing llms.txt content removed')
    links = {link.split('?')[0] for page in pages.values() for link in page['links'] if link.startswith('/')}
    for link in links - set(pages):
        if base.audit.read(origin + link)[1] != 200:
            errors.append(link + ': broken internal destination')
    sets = {p: base.audit.phrases(v['text']) for p, v in pages.items() if p.startswith('/services/')}
    overlaps = {}
    for path in sorted(NEW | {'/services/' + slug for slug in base.audit.TARGETS}):
        score, other = max((base.audit.overlap(sets[path], value), other) for other, value in sets.items() if other != path)
        overlaps[path] = {'shared_five_word_phrases_percent': round(score, 2), 'nearest_page': other}
        if score >= 25:
            errors.append(path + ': text-similarity preservation target not met (not a Google threshold)')
    return {'origin': origin, 'checked_pages': len(pages), 'preserved_existing_pages': len(before['pages']), 'new_pages': new_details, 'existing_pages_with_additions': sorted(changed), 'removed_draft_routes_404': sorted(REMOVED_DRAFTS), 'text_similarity_not_cannibalisation': overlaps, 'failures': errors}


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
