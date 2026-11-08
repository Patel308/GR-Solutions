# Favicon

The site icon: a white "GR" in the heading font (Plus Jakarta Sans
ExtraBold, outlined to paths so it looks the same everywhere) on the brand
navy, with the logo's teal swoosh. Everything sits inside the circle Google
crops search-result icons to. The 16 px size has its own drawing (bigger
letters, no swoosh) so browser tabs stay sharp.

| File in `public/` | Used for |
| --- | --- |
| `favicon.ico` (16, 32, 48 px) | Browsers' default `/favicon.ico` request, Google |
| `icon.svg` | Modern browsers (any size) |
| `icon-96.png` | Google search results (multiple of 48 px, sharp on 2x screens) |
| `icon-192.png` | Android |
| `apple-touch-icon.png` (180 px, square) | iPhone / iPad home screen |

Comparison with the old icon: `docs/redesign/favicon-preview.png`.

## Regenerating

```bash
pip install fonttools brotli pillow
python3 tools/favicon/make_svg.py app/fonts/plus-jakarta-sans-latin-800-normal.woff2 /tmp/fav
cp tools/favicon/render.mjs ./.render-favicon.mjs && node ./.render-favicon.mjs /tmp/fav /tmp/fav && rm ./.render-favicon.mjs
python3 -c "from PIL import Image; d='/tmp/fav'; i=[Image.open(f'{d}/icon-{s}.png').convert('RGBA') for s in (16,32,48)]; i[2].save(f'{d}/favicon.ico', sizes=[(16,16),(32,32),(48,48)], append_images=i[:2])"
cp /tmp/fav/{favicon.ico,icon.svg,icon-96.png,icon-192.png,apple-touch-icon.png} public/
```

Keep the file names: Google refreshes a site's icon when it recrawls the
home page, and a stable URL avoids an extra round trip.
