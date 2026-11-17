"""Hero images for the two decision guides (1536x1024, WebP).

Built from GR Solution's real workshop photos plus on-brand graphics
(colours from docs/design-system.md). Drawn at 2x and downscaled for smooth edges.
usage: py -I scripts/make-guide-heroes.py .
   Windows (Segoe UI from C:/Windows/Fonts). For the site heading font it needs
   fontTools and brotli (pip install fonttools brotli); otherwise Segoe UI Bold.
"""
import sys
import tempfile
from pathlib import Path
from PIL import Image, ImageDraw, ImageFilter, ImageFont

ROOT = Path(sys.argv[1])
OUT = ROOT / 'public' / 'images' / 'blog'
S = 2  # supersampling factor
W, H = 1536 * S, 1024 * S

NAVY950 = (10, 26, 51)
NAVY700 = (10, 58, 133)
NAVY600 = (13, 71, 161)
TEAL400 = (25, 151, 173)
TEAL300 = (92, 200, 218)
WHITE = (255, 255, 255)
SURFACE = (245, 248, 252)
INK = (11, 27, 51)
MUTED = (71, 85, 105)
GREEN = (15, 122, 61)

FONTS = Path('C:/Windows/Fonts')


def _heading_font_path():
    """The site's heading face (Plus Jakarta Sans 800, docs/design-system.md), converted
    from app/fonts/*.woff2. Needs fontTools + brotli; falls back to Segoe UI Bold."""
    ttf = Path(tempfile.gettempdir()) / 'gr-PlusJakartaSans-800.ttf'
    if not ttf.exists():
        try:
            from fontTools.ttLib import TTFont
            face = TTFont(str(ROOT / 'app' / 'fonts' / 'plus-jakarta-sans-latin-800-normal.woff2'))
            face.flavor = None
            face.save(str(ttf))
        except Exception as error:  # noqa: BLE001 - any failure means "use the fallback"
            print(f'Heading font unavailable ({error}); using Segoe UI Bold')
            return FONTS / 'segoeuib.ttf'
    return ttf


HEAD = _heading_font_path()      # headings, badges, titles (site heading font)
SEMI = FONTS / 'seguisb.ttf'     # labels and list text (Windows system UI font, as the site's body)


def font(path, size):
    return ImageFont.truetype(str(path), size * S)


def cover(img, box_w, box_h, focus_x=0.5, focus_y=0.5):
    """Scale and crop img to fill box_w x box_h around a focus point."""
    scale = max(box_w / img.width, box_h / img.height)
    img = img.resize((round(img.width * scale), round(img.height * scale)), Image.LANCZOS)
    left = min(max(round(img.width * focus_x - box_w / 2), 0), img.width - box_w)
    top = min(max(round(img.height * focus_y - box_h / 2), 0), img.height - box_h)
    return img.crop((left, top, left + box_w, top + box_h))


def vertical_gradient(w, h, top, bottom):
    grad = Image.new('RGB', (1, h))
    for y in range(h):
        t = y / max(h - 1, 1)
        grad.putpixel((0, y), tuple(round(top[i] + (bottom[i] - top[i]) * t) for i in range(3)))
    return grad.resize((w, h))


def horizontal_fade(w, h, color, start_alpha, end_alpha):
    layer = Image.new('RGBA', (w, h), color + (0,))
    mask = Image.new('L', (w, 1))
    for x in range(w):
        t = x / max(w - 1, 1)
        mask.putpixel((x, 0), round(start_alpha + (end_alpha - start_alpha) * t))
    layer.putalpha(mask.resize((w, h)))
    return layer


def pill(draw, xy, text, fnt, fill, color, pad_x=22, pad_y=12):
    x, y = xy
    l, t, r, b = draw.textbbox((0, 0), text, font=fnt)
    w, h = r - l + pad_x * 2 * S, b - t + pad_y * 2 * S
    draw.rounded_rectangle((x, y, x + w, y + h), radius=h // 2, fill=fill)
    draw.text((x + pad_x * S - l, y + pad_y * S - t), text, font=fnt, fill=color)
    return w, h


def check_icon(draw, cx, cy, r, bg, fg):
    draw.ellipse((cx - r, cy - r, cx + r, cy + r), fill=bg)
    draw.line([(cx - r * 0.45, cy + r * 0.02), (cx - r * 0.1, cy + r * 0.38), (cx + r * 0.5, cy - r * 0.35)],
              fill=fg, width=max(round(r * 0.28), 2), joint='curve')


def shield_icon(draw, cx, cy, size, fill, tick):
    s = size
    pts = [(cx, cy - s), (cx + s * 0.85, cy - s * 0.65), (cx + s * 0.78, cy + s * 0.15),
           (cx, cy + s), (cx - s * 0.78, cy + s * 0.15), (cx - s * 0.85, cy - s * 0.65)]
    draw.polygon(pts, fill=fill)
    draw.line([(cx - s * 0.38, cy - s * 0.02), (cx - s * 0.08, cy + s * 0.3), (cx + s * 0.42, cy - s * 0.3)],
              fill=tick, width=round(s * 0.16), joint='curve')


def wrench_icon(draw, cx, cy, size, fill):
    # Simple wrench: handle bar plus open ring head.
    s = size
    draw.line([(cx - s * 0.7, cy + s * 0.7), (cx + s * 0.25, cy - s * 0.25)], fill=fill, width=round(s * 0.32))
    draw.ellipse((cx + s * 0.02, cy - s * 0.9, cx + s * 0.9, cy - s * 0.02), fill=fill)
    draw.ellipse((cx + s * 0.32, cy - s * 0.62, cx + s * 0.62, cy - s * 0.32), fill=NAVY950)
    draw.rectangle((cx + s * 0.55, cy - s * 0.95, cx + s * 1.0, cy - s * 0.48), fill=NAVY950)


def wordmark(draw, x, y, light=True):
    f = font(HEAD, 30)
    draw.text((x, y), 'GR', font=f, fill=TEAL300 if light else NAVY600)
    gw = draw.textlength('GR ', font=f)
    draw.text((x + gw, y), 'Solution', font=f, fill=WHITE if light else INK)


def save(img, name):
    final = img.resize((1536, 1024), Image.LANCZOS).convert('RGB')
    path = OUT / name
    final.save(path, 'WEBP', quality=82, method=6)
    print(f'{path.name}: {path.stat().st_size // 1024} KB, {final.size}')


# ---------------------------------------------------------------------------
# 1. Service centre vs local repair
# ---------------------------------------------------------------------------
def hero_service_centre():
    img = vertical_gradient(W, H, (14, 38, 78), NAVY950).convert('RGBA')
    split = round(W * 0.47)

    # Right: the real independent workshop. It starts under the left panel and fades in,
    # so there is no hard seam.
    photo_x = split - 260 * S
    photo = Image.open(ROOT / 'public' / 'images' / 'workshop-repair-bench.webp').convert('RGB')
    right = cover(photo, W - photo_x, H, focus_x=0.62, focus_y=0.55).convert('RGBA')
    right.alpha_composite(Image.new('RGBA', right.size, NAVY950 + (80,)))
    fade_w = 520 * S
    fade = horizontal_fade(fade_w, H, NAVY950, 255, 0)
    right.alpha_composite(fade, (0, 0))
    img.alpha_composite(right, (photo_x, 0))

    d = ImageDraw.Draw(img)
    # Soft glow behind the left panel.
    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    gd = ImageDraw.Draw(glow)
    gd.ellipse((-W * 0.2, H * 0.25, W * 0.55, H * 1.2), fill=NAVY600 + (90,))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(160 * S)))
    d = ImageDraw.Draw(img)

    pad = 92 * S
    # Eyebrow + headline.
    pill(d, (pad, 92 * S), 'TV REPAIR DECISION GUIDE', font(HEAD, 24), TEAL400, WHITE)
    head = font(HEAD, 74)
    d.text((pad, 168 * S), 'Service centre', font=head, fill=WHITE)
    d.text((pad, 254 * S), 'or local repair?', font=head, fill=TEAL300)

    # Left card: brand service centre. Translucent shapes go on their own layer and are
    # blended, because drawing RGBA fills straight onto the image replaces pixels.
    cx0, cy0, cx1, cy1 = pad, 410 * S, split - 96 * S, 820 * S
    card = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(card).rounded_rectangle((cx0, cy0, cx1, cy1), radius=34 * S, fill=(255, 255, 255, 22),
                                           outline=(255, 255, 255, 70), width=2 * S)
    img.alpha_composite(card)
    d = ImageDraw.Draw(img)
    shield_icon(d, cx0 + 92 * S, cy0 + 100 * S, 52 * S, TEAL400, WHITE)
    d.text((cx0 + 170 * S, cy0 + 58 * S), 'Brand service centre', font=font(HEAD, 34), fill=WHITE)
    d.text((cx0 + 170 * S, cy0 + 108 * S), 'Best while under warranty', font=font(SEMI, 26), fill=(205, 222, 240))
    rows = ['Keeps manufacturer warranty', 'Brand rates out of warranty', 'Visit charge as applicable']
    for i, row in enumerate(rows):
        y = cy0 + 200 * S + i * 62 * S
        check_icon(d, cx0 + 66 * S, y + 18 * S, 17 * S, (38, 70, 120), TEAL300)
        d.text((cx0 + 100 * S, y), row, font=font(SEMI, 27), fill=WHITE)

    # Right label: independent repair (over the real workshop photo), on a soft dark panel
    # so the white text stays readable over the bright bench.
    rx = split + 150 * S
    panel = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(panel).rounded_rectangle((rx - 40 * S, 440 * S, W - 60 * S, 840 * S), radius=34 * S, fill=NAVY950 + (165,))
    img.alpha_composite(panel.filter(ImageFilter.GaussianBlur(6 * S)))
    d = ImageDraw.Draw(img)
    tag_w, tag_h = pill(d, (rx, 470 * S), 'INDEPENDENT REPAIR', font(HEAD, 26), WHITE, NAVY950, pad_x=26, pad_y=14)
    wrench_icon(d, rx + 30 * S, 600 * S, 38 * S, TEAL300)
    d.text((rx + 90 * S, 572 * S), 'Worth comparing once', font=font(HEAD, 36), fill=WHITE)
    d.text((rx + 90 * S, 618 * S), 'the warranty has ended', font=font(HEAD, 36), fill=WHITE)
    for i, row in enumerate(['Free diagnosis first', 'Written estimate before work']):
        y = 700 * S + i * 58 * S
        check_icon(d, rx + 30 * S, y + 18 * S, 17 * S, TEAL400, WHITE)
        d.text((rx + 64 * S, y), row, font=font(SEMI, 27), fill=WHITE)

    # VS badge between the two sides.
    bx, by, br = split + 10 * S, 615 * S, 70 * S
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).ellipse((bx - br, by - br + 12 * S, bx + br, by + br + 12 * S), fill=(0, 0, 0, 120))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(18 * S)))
    d = ImageDraw.Draw(img)
    d.ellipse((bx - br, by - br, bx + br, by + br), fill=WHITE, outline=TEAL400, width=8 * S)
    vs = font(HEAD, 58)
    l, t, r, b = d.textbbox((0, 0), 'VS', font=vs)
    d.text((bx - (r - l) / 2 - l, by - (b - t) / 2 - t), 'VS', font=vs, fill=NAVY600)

    # Footer strip.
    d.rectangle((0, H - 108 * S, W, H), fill=(6, 18, 38))
    d.text((pad, H - 76 * S), 'Warranty  ·  Parts  ·  Total price  ·  Repair terms', font=font(SEMI, 28), fill=(205, 222, 240))
    wordmark(d, W - pad - 210 * S, H - 80 * S)
    save(img, 'service-centre-vs-local-tv-repair-delhi-ncr.webp')


# ---------------------------------------------------------------------------
# 2. How to choose a TV repair service: checklist
# ---------------------------------------------------------------------------
def hero_checklist():
    img = vertical_gradient(W, H, (14, 38, 78), NAVY950).convert('RGBA')
    photo_w = round(W * 0.46)
    photo = Image.open(ROOT / 'public' / 'images' / 'workshop-tv-diagnosis.webp').convert('RGB')
    right = cover(photo, photo_w, H, focus_x=0.5, focus_y=0.48).convert('RGBA')
    right.alpha_composite(horizontal_fade(photo_w, H, NAVY950, 240, 0))
    img.alpha_composite(right, (W - photo_w, 0))

    glow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(glow).ellipse((-W * 0.15, -H * 0.1, W * 0.6, H * 0.9), fill=NAVY600 + (80,))
    img.alpha_composite(glow.filter(ImageFilter.GaussianBlur(170 * S)))
    d = ImageDraw.Draw(img)

    pad = 92 * S
    pill(d, (pad, 84 * S), "BUYER'S CHECKLIST  ·  DELHI NCR", font(HEAD, 24), TEAL400, WHITE)
    head = font(HEAD, 70)
    d.text((pad, 156 * S), 'Choose the right', font=head, fill=WHITE)
    d.text((pad, 238 * S), 'TV repair service', font=head, fill=TEAL300)

    # White checklist card.
    cx0, cy0 = pad, 372 * S
    cx1, cy1 = round(W * 0.6), H - 92 * S
    shadow = Image.new('RGBA', (W, H), (0, 0, 0, 0))
    ImageDraw.Draw(shadow).rounded_rectangle((cx0, cy0 + 20 * S, cx1, cy1 + 20 * S), radius=34 * S, fill=(0, 0, 0, 140))
    img.alpha_composite(shadow.filter(ImageFilter.GaussianBlur(26 * S)))
    d = ImageDraw.Draw(img)
    d.rounded_rectangle((cx0, cy0, cx1, cy1), radius=34 * S, fill=SURFACE)
    d.rounded_rectangle((cx0, cy0, cx1, cy0 + 96 * S), radius=34 * S, fill=WHITE)
    d.rectangle((cx0, cy0 + 60 * S, cx1, cy0 + 96 * S), fill=WHITE)
    d.text((cx0 + 44 * S, cy0 + 26 * S), '7-point check before you book', font=font(HEAD, 34), fill=INK)
    d.line((cx0, cy0 + 96 * S, cx1, cy0 + 96 * S), fill=(226, 232, 240), width=2 * S)

    items = [
        'Diagnosis before any quote',
        'Visit charge stated upfront',
        'Written total estimate',
        'Repair or replace, new or used part',
        'Repair warranty in writing',
        'Home or workshop, and how long',
        'Honest about brand warranty',
    ]
    row_h = (cy1 - cy0 - 130 * S) / len(items)
    for i, item in enumerate(items):
        y = cy0 + 118 * S + i * row_h
        check_icon(d, cx0 + 64 * S, y + 22 * S, 21 * S, GREEN, WHITE)
        d.text((cx0 + 104 * S, y + 2 * S), item, font=font(SEMI, 29), fill=INK)

    # Small red-flag tag on the photo side.
    tx = round(W * 0.66)
    pill(d, (tx, H - 190 * S), 'No advance payment before diagnosis', font(SEMI, 25), (185, 28, 28), WHITE, pad_x=24, pad_y=13)
    wordmark(d, W - 92 * S - 210 * S, 70 * S)
    save(img, 'how-to-choose-tv-repair-service-checklist.webp')


if __name__ == '__main__':
    hero_service_centre()
    hero_checklist()
