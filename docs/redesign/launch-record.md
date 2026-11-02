# Launch record: 2026 redesign

Launched **2 November 2026, 03:58 UTC (09:28 IST)**, on the owner's go-ahead.

| | |
| --- | --- |
| Launch merge commit on `main` | `3080205` (normal merge commit, so one revert undoes it) |
| Previous production | `606f612`, Docker image `sha-606f612` (`sha256:9a2375a2…3059`) |
| Deploy run | [Build, Push, Deploy #41385392426](https://github.com/Patel308/GR-Solutions/actions/runs/41385392426): lint, 29 unit tests, build, image, Hostinger deploy, origin check, all green |
| Post-deploy check | [Verify Production #41385883350](https://github.com/Patel308/GR-Solutions/actions/runs/41385883350): green, reports attached as `production-verification` |
| Rollback drill (before launch) | [Roll Back Production #41385297395](https://github.com/Patel308/GR-Solutions/actions/runs/41385297395): put `sha-606f612` back, server running it again in about 6 s |

## How it was done

1. Pre-flight on the launch commit (`dfc6a15`): lint, 29/29 unit tests,
   `npm audit` 0 vulnerabilities, production build on Node 20 (as CI and
   Docker), and a crawl of that build identical to the tested launch snapshot.
2. Shipped the rollback first: **Roll Back Production** workflow and
   `docs/rollback.md` on `main` (`395cdc6`, deploy green, site unchanged).
3. Rollback drill: ran it with the then-live image, proving the whole path
   (Docker Hub lookup, server swap, origin check) without changing the site.
4. Launch: merged the redesign branch into `main` with a merge commit and
   pushed; the normal deploy pipeline built and deployed it.
5. **Verify Production** (runs automatically after every deploy from now on):
   built the deployed commit on a clean runner, crawled it and
   https://grsolution.co.in.

## Verified on the live site

| Check | Result |
| --- | --- |
| Live site vs the deployed build: 112 URLs, raw HTML: titles, metas, canonicals, robots, headings, links + anchor text, images + alt, JSON-LD, copy, FAQ = schema, sitemap, robots.txt, redirects, llms.txt | **Identical: 0 differences** |
| Live site vs the pre-redesign site (`snapshots/live-2026-11-02`) | **0 unapproved violations**; 101 of 111 URLs identical in every core field; the rest only signed-off changes (phone D1, "5+ years" D5); 56 review items, the same as the pre-launch mapping |

Git tags could not be pushed from the launch session (blocked by its proxy);
the previous version is identified by commit `606f612` and its image tag.

## Owner, today

1. **Google Business Profile:** primary phone → +91 93155 15700.
2. Phone check: open the site, tap Call (93155 15700), WhatsApp and Book
   Visit; send one test enquiry and check the email carries a `GR-` ID.
3. Search Console → URL Inspection → Test live URL: home and two service
   pages → Request indexing.

## Watching and rollback

- Days 1–7: Search Console **Pages** report and the Generative AI report.
- Days 7–28: clicks and impressions against the previous period.
- Rollback triggers, steps and the one-click workflow: `docs/rollback.md`.
