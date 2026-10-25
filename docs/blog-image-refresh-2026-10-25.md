# Blog image refresh — 25 October 2026

## Final user instructions

Use the images already generated; do not generate more. Remove the visible image-generation descriptions from every blog image. Keep descriptive alt text and the existing SEO/AIO/GEO work.

## Assets and scope

Eleven replacement illustrations had completed when generation was stopped. Each is exported as a separate, descriptive WebP filename at 1280 × 853 pixels, quality 82, ranging from 32,518 to 175,566 bytes. Only format/resolution optimisation was applied to the generated originals. The two unique article images from the preceding release remain in place.

Four older articles keep their existing images: screen lines, backlight symptoms, TV restarting and repair versus replacement. The screen-lines and repair-versus-replacement articles therefore still share one legacy image. No additional generation was performed to complete that group after the user asked to stop.

The scope is the 17 published articles with `/blog/` detail URLs. The six promotional cards linking to `/services/` are service links, not additional blog articles.

All final asset paths, the original built-in imagegen prompts, alt text and generation sources are recorded in `blog-image-refresh-2026-10-25.json`. Generated originals remain at their original Codex save paths. All site-referenced final assets are saved in the project's `public/images/blog/` directory.

## Presentation and preservation

Visible generation captions are removed from all article images at the user's request. Alt text describes the relevant pictured objects or symptom. The images are editorial illustrations; no actual customer or repair-case claims have been added.

The eleven image changes automatically update the existing blog index thumbnails, article hero, Open Graph image and BlogPosting image through the shared article data. Responsive Next/Image delivery, accurate intrinsic dimensions and priority loading for article heroes remain in use. The final user correction requires no cropping: article heroes use full width and automatic height at their natural proportions on phones and desktop. Phones have approximately 8px side gutters and reduced surrounding spacing. The browser's default 40px figure margins were the cause of the earlier undersized image and are explicitly reset. A scoped CSS module also bypasses the phone container's 400px maximum; the site's custom Tailwind configuration has no `sm` breakpoint. The two new guides use an explicit layout flag so adding alt text to an older guide cannot alter its heading style or booking copy.

Existing shared `/images/service_*.webp` files remain available because service pages and the remaining older articles use them. They are not overwritten or redirected to one arbitrary article. Titles, descriptions, H1 text, article URLs, canonicals, publication/review dates, prices, FAQs, interlinks, CTA behaviour, sitemap dates, robots and llms.txt remain unchanged. Image references, alt attributes and the requested blog/workshop captions change; the remaining editorial copy is preserved.

## Search implications

Google's [image SEO guidance](https://developers.google.com/search/docs/appearance/google-images), checked 25 October 2026, recommends relevant images near related text, descriptive filenames and useful alt text, supported formats, responsive delivery and attention to loading speed. An image replacement can require recrawling and can change image-search visibility; it does not establish a guaranteed ranking gain or a guaranteed zero effect. Reusing an image is not by itself evidence of a spam penalty.

## Verification

`scripts/audit-blog-images.py` compares the complete site with the live 108-page snapshot captured immediately before this refresh. It checks metadata, links, canonical/crawl settings, schema equality except the eleven image references, body-text equality except the explicitly listed blog and workshop caption removals, Open Graph/hero/schema agreement, matching asset bytes, distinct replacement hashes, image weight/format, retained original shared URLs and the remaining duplicate inventory.

## Workshop and final responsive corrections

The workshop interior source in Downloads (`gr 3.jpg`) is also only 141 × 118 pixels; no clearer original was found. The homepage and About page now share a gallery of the two existing real workshop photographs (1200 × 900 and 720 × 960), with no captions or low-resolution thumbnail. The old thumbnail URL remains available. Desktop uses a full-container gallery with columns proportional to the source aspect ratios; phones stack full-width images with 8px gutters. Intrinsic dimensions, automatic height and contain sizing preserve the entire photograph. Blog desktop hero images use the larger column and no default figure margins.

Final validation: ESLint and the production build passed (114 static routes). The complete 108-page baseline comparison passed with zero failures. Browser checks at 320, 390, 540 and 1440 pixels covered Home, About, the motherboard guide and the no-power guide: 16 cases, all images loaded, no horizontal overflow, natural aspect ratios preserved. Workshop images at 390px are approximately 359px wide; desktop gallery photographs are approximately 661px and 372px wide, and the blog hero is approximately 560px wide at 1440px. Image captions are absent; informative table captions remain. Results are in `blog-mobile-image-layout-2026-10-25.json` and `blog-image-audit-2026-10-25.json`.
