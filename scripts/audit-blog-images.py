"""Check an image-only blog refresh against a full pre-refresh site snapshot."""
import argparse
from copy import deepcopy
import hashlib
import importlib.util
import json
from pathlib import Path
import sys
import urllib.parse
import urllib.request

sys.dont_write_bytecode = True
spec = importlib.util.spec_from_file_location('blog_audit', Path(__file__).with_name('audit-blog-release.py'))
blog_audit = importlib.util.module_from_spec(spec)
spec.loader.exec_module(blog_audit)
audit = blog_audit.audit
ROOT = Path(__file__).resolve().parents[1]


class ImagePage(audit.Page):
    def __init__(self):
        super().__init__()
        self.og_images = []
        self.images = []

    def handle_starttag(self, tag, attrs):
        super().handle_starttag(tag, attrs)
        attrs = dict(attrs)
        if tag == 'meta' and attrs.get('property') == 'og:image':
            self.og_images.append(attrs.get('content'))
        if tag == 'img' and self.main:
            self.images.append(attrs)


def check(current, before, origin, manifest):
    failures, images, changed = [], [], []
    replacements = {'/blog/' + item['slug']: item for item in manifest['items']}
    if set(current['pages']) != set(before['pages']):
        failures.append('Sitemap page set changed during image-only update')
    for path, old in before['pages'].items():
        page = current['pages'][path]
        expected_text = old['text']
        if path in manifest['removed_captions']:
            captions = manifest['removed_captions'][path]
            for caption in captions if isinstance(captions, list) else [captions]:
                expected_text = expected_text.replace(caption, '', 1)
        if ' '.join(page['text'].split()) != ' '.join(expected_text.split()):
            failures.append(path + ': unexpected article text change')
        for key in ('status', 'title', 'h1', 'description', 'canonical', 'robots', 'x_robots', 'links'):
            if old[key] != page[key]:
                failures.append(path + ': changed ' + key)
        if path in replacements:
            expected = deepcopy(old['schemas'])
            for schema in expected:
                if schema.get('@type') == 'BlogPosting':
                    schema['image'] = audit.PUBLIC_ORIGIN + replacements[path]['image']
            if page['schemas'] != expected:
                failures.append(path + ': schema changed beyond BlogPosting image')
            changed.append(path)
        elif page['schemas'] != old['schemas']:
            failures.append(path + ': unrelated page schema changed')
        if not path.startswith('/blog/'):
            continue
        schema = next(s for s in page['schemas'] if s.get('@type') == 'BlogPosting')
        image_url = schema['image']
        asset_path = image_url.removeprefix(audit.PUBLIC_ORIGIN)
        with urllib.request.urlopen(origin + asset_path, timeout=30) as response:
            data = response.read()
            if response.status != 200 or not response.headers.get('Content-Type', '').startswith('image/'):
                failures.append(path + ': image not served')
        html = audit.read(origin + path)[0]
        parsed = ImagePage()
        parsed.feed(html)
        if parsed.og_images != [image_url]:
            failures.append(path + ': Open Graph image does not match article schema')
        if not parsed.images or asset_path not in urllib.parse.unquote(parsed.images[0].get('src', '')):
            failures.append(path + ': hero image source does not match schema')
        if path in replacements:
            item = replacements[path]
            if parsed.images[0].get('alt') != item['alt']:
                failures.append(path + ': incorrect alt text')
            if not data.startswith(b'RIFF') or data[8:12] != b'WEBP' or len(data) > 185000:
                failures.append(path + ': replacement image format/weight is outside budget')
            if hashlib.sha256(data).digest() != hashlib.sha256((ROOT / ('public' + asset_path)).read_bytes()).digest():
                failures.append(path + ': served image differs from approved asset')
        if 'AI-generated' in page['text']:
            failures.append(path + ': visible image-generation caption remains')
        images.append({'path': path, 'image': asset_path, 'bytes': len(data), 'sha256': hashlib.sha256(data).hexdigest(), 'replaced': path in replacements})
    for key in ('robots', 'llms', 'lastmods'):
        if current[key] != before[key]:
            failures.append(key + ': changed in image-only update')
    for path in ('/', '/about'):
        workshop = ImagePage()
        workshop.feed(audit.read(origin + path)[0])
        sources = [urllib.parse.unquote(i.get('src', '')) for i in workshop.images]
        if any('/images/workshop-interior.webp' in src for src in sources):
            failures.append(path + ': low-resolution workshop thumbnail remains')
        for asset in ('workshop-repair-bench.webp', 'workshop-tv-diagnosis.webp'):
            if not any(asset in src for src in sources):
                failures.append(path + ': missing original workshop photo ' + asset)
    index_page = ImagePage()
    index_page.feed(audit.read(origin + '/blog')[0])
    index_sources = [urllib.parse.unquote(image.get('src', '')) for image in index_page.images]
    for item in manifest['items']:
        if not any(item['image'] in source for source in index_sources):
            failures.append(item['slug'] + ': replacement missing from blog listing thumbnails')
    # Shared originals remain available because other site pages still use them.
    original_paths = {s['image'].removeprefix(audit.PUBLIC_ORIGIN) for path, p in before['pages'].items() if path in replacements for s in p['schemas'] if s.get('@type') == 'BlogPosting'}
    for path in original_paths:
        with urllib.request.urlopen(origin + path, timeout=30) as response:
            if response.status != 200:
                failures.append(path + ': original shared image no longer available')
    groups = {}
    for image in images:
        groups.setdefault(image['sha256'], []).append(image['path'])
    duplicates = [paths for paths in groups.values() if len(paths) > 1]
    generated_hashes = [image['sha256'] for image in images if image['replaced']]
    if len(set(generated_hashes)) != len(replacements):
        failures.append('Generated replacements are not all distinct')
    return {'origin': origin, 'checked_pages': len(current['pages']), 'blog_articles': len(images), 'replaced_articles': len(changed), 'remaining_legacy_articles': len(images) - len(changed) - 2, 'remaining_duplicate_article_groups': duplicates, 'replacement_bytes_min': min(i['bytes'] for i in images if i['replaced']), 'replacement_bytes_max': max(i['bytes'] for i in images if i['replaced']), 'images': images, 'failures': failures}


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--url', required=True)
    parser.add_argument('--baseline', required=True)
    parser.add_argument('--output', required=True)
    args = parser.parse_args()
    origin = args.url.rstrip('/')
    manifest = json.loads((ROOT / 'docs/blog-image-refresh-2026-10-25.json').read_text(encoding='utf-8'))
    before = json.loads(Path(args.baseline).read_text(encoding='utf-8'))
    result = check(blog_audit.capture(origin), before, origin, manifest)
    Path(args.output).write_text(json.dumps(result, indent=2), encoding='utf-8')
    print(json.dumps({key: value for key, value in result.items() if key != 'images'}, indent=2))
    sys.exit(bool(result['failures']))
