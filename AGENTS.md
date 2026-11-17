<!-- BEGIN:search-console -->
## Google Search Console data

When asked for "console data", GSC, Search Console, rankings, clicks/impressions, queries, or
index status for grsolution.co.in, use `search-console/` (read `search-console/README.md` first).
Run `python3 search-console/gsc.py <command>` (`py` on Windows). The site is preset to `grsolution` (property `sc-domain:grsolution.co.in`).
Auth is a read-only service account, so don't write new GSC/OAuth code or ask for credentials.
In a cloud session, run `pip install -r search-console/requirements.txt` first if packages are
missing. The key comes from env `GSC_SERVICE_ACCOUNT_JSON_B64`; if it's absent, tell the user
to add it to the environment settings.
Before any SEO, AIO or GEO task, follow `search-console/SEO_WORKFLOW.md`: take or refresh the
snapshot (`python3 search-console/snapshot.py`), read its `SNAPSHOT.md`, and pass the evidence gates
(cite GSC / GA4 / Keyword Planner and the snapshot date; never invent volumes or rankings).
For GA4 behaviour, channels, AI-assistant traffic and leads, use `python3 search-console/ga4.py <command>`.
For keyword research (search volume, keyword ideas, trends), use
`python3 search-console/keywords.py <command>` (Google Ads Keyword Planner, read-only; see the
README). Don't build another Keyword Planner client.
<!-- END:search-console -->

<!-- BEGIN:new-pages-geo -->
## New and changed pages: indexing and AI citation (automated)

Most of this happens without extra work, as long as pages are built from the existing data files and templates:

- **Key facts and prices.** Every service, city and brand page renders `components/KeyFacts.jsx` under the trust band: free diagnosis, the most common repair with its Delhi NCR price range, service area, hours, warranty, and a price table for that TV type. The facts come from `data/keyFacts.js`, `data/pricing.js` and `data/siteConfig.js`. A new page built from `app/services/[slug]/page.jsx` or `components/ServicePageRevision.jsx` gets it automatically. A page outside those templates should render `<KeyFacts />` itself. Never add a claim to `data/keyFacts.js` that is not already confirmed elsewhere on the site.
- **Sitemap and llms.txt.** Both are generated from the data files, so a new page appears in them automatically.
- **Bing / IndexNow.** After every production deploy, `.github/workflows/deploy.yml` runs `scripts/indexnow.mjs`. It compares the sitemap before and after the deploy and submits every new, changed or removed URL to IndexNow (Bing, which feeds ChatGPT search, Copilot and DuckDuckGo). A URL counts as changed only when its sitemap `<lastmod>` changes, so **bump the matching date in `app/sitemap.js` (or `keyFactsReviewedAt`, a blog article's `updatedAt`, a landing page's `reviewedAt`) whenever a page's content really changes.** To resubmit everything, run the workflow manually with `indexnow_all` ticked, or run `node scripts/indexnow.mjs --all`. The key file is `public/443043e7cb5fa7d21f24112881af65cf.txt`; it is public by design.
- **Before merging a template change,** run the SEO check in `docs/design-system.md` and keep titles, metas, canonicals, H1s and heading order unchanged unless the change was signed off.
<!-- END:new-pages-geo -->
