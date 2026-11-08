"""Builds the GR Solution favicon SVGs from the site's heading font."""
import math, sys
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.pens.boundsPen import BoundsPen

FONT, OUT = sys.argv[1], sys.argv[2]
font = TTFont(FONT)
gs = font.getGlyphSet()
cmap = font.getBestCmap()
hmtx = font['hmtx']
TRACK = -12  # font units, a touch tighter than default

def layout(text):
    x, items = 0, []
    for ch in text:
        name = cmap[ord(ch)]
        items.append((name, x))
        x += hmtx[name][0] + TRACK
    return items

def bounds(items):
    bp = BoundsPen(gs)
    for name, x in items:
        gs[name].draw(TransformPen(bp, (1, 0, 0, 1, x, 0)))
    return bp.bounds  # xmin, ymin, xmax, ymax (font units, y up)

def letters_path(text, box_cx, box_cy, cap_px, max_w):
    items = layout(text)
    xmin, ymin, xmax, ymax = bounds(items)
    s = min(cap_px / (ymax - ymin), max_w / (xmax - xmin))
    cap_px = (ymax - ymin) * s
    tx = box_cx - (xmin + xmax) / 2 * s
    ty = box_cy + (ymin + ymax) / 2 * s
    pen = SVGPathPen(gs, ntos=lambda v: f'{v:.2f}'.rstrip('0').rstrip('.'))
    for name, x in items:
        gs[name].draw(TransformPen(pen, (s, 0, 0, -s, tx + x * s, ty)))
    w = (xmax - xmin) * s
    return pen.getCommands(), (box_cx - w / 2, box_cy - cap_px / 2, box_cx + w / 2, box_cy + cap_px / 2)

def arc(cx, cy, r, a0, a1):
    p = lambda a: (cx + r * math.cos(math.radians(a)), cy + r * math.sin(math.radians(a)))
    (x0, y0), (x1, y1) = p(a0), p(a1)
    large = 1 if (a0 - a1) % 360 > 180 else 0
    return f'M{x0:.1f} {y0:.1f}A{r} {r} 0 {large} 0 {x1:.1f} {y1:.1f}'

DEFS = ('<defs><linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">'
        '<stop offset="0" stop-color="#1D63C2"/><stop offset=".55" stop-color="#0D47A1"/>'
        '<stop offset="1" stop-color="#071F47"/></linearGradient></defs>')

def svg(full, rounded=True):
    rx = 112 if rounded else 0
    if full:
        d, box = letters_path('GR', 266, 256, 178, 286)
        swoosh = (f'<path d="{arc(256, 256, 198, 302, 58)}" fill="none" stroke="#5CC8DA" '
                  f'stroke-width="30" stroke-linecap="round"/>')
    else:  # 16 px: bigger letters, no swoosh
        d, box = letters_path('GR', 256, 256, 300, 428)
        swoosh = ''
    body = (f'<rect width="512" height="512" rx="{rx}" fill="url(#bg)"/>{swoosh}'
            f'<path d="{d}" fill="#fff"/>')
    return (f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">{DEFS}{body}</svg>\n', box)

for name, full, rounded in [('icon.svg', True, True), ('icon-small.svg', False, True), ('icon-square.svg', True, False)]:
    text, box = svg(full, rounded)
    open(f'{OUT}/{name}', 'w').write(text)
    print(name, len(text), 'bytes; letters box', [round(v) for v in box])
