# Search Console data: grsolution.co.in

This folder gives anyone (people, Claude, Codex) Google Search Console data for **grsolution.co.in**.
It uses the property `sc-domain:grsolution.co.in` and calls the shared API in `C:/Users/dell/Desktop/Scallar Stack/Console`.

There is nothing to set up. Auth is a read-only service account that never expires. Don't add
OAuth or credential code to this project, and don't ask for keys.

## Commands (run from the project root)

```bash
py search-console/gsc.py doctor                       # confirm access works
py search-console/gsc.py summary --days 28            # clicks, impressions, CTR, avg position
py search-console/gsc.py summary --days 7 --fresh     # include the last 1-2 days (not yet final)
py search-console/gsc.py query --dimensions query --limit 50          # top queries
py search-console/gsc.py query --dimensions page --limit 50           # top pages
py search-console/gsc.py query --dimensions query,page --days 90 --csv search-console/data/query_page_90d.csv
py search-console/gsc.py query --dimensions query --filter "query:contains:<word>"
py search-console/gsc.py query --dimensions date --days 90            # daily trend
py search-console/gsc.py query --dimensions country|device            # country or device split
py search-console/gsc.py hourly                       # same as the GSC "24 hours" view
py search-console/gsc.py export --days 90             # full CSV bundle -> search-console/data/
py search-console/gsc.py inspect --url https://grsolution.co.in/some-page     # index status of one URL
py search-console/gsc.py sitemaps                     # sitemap status
```

On Windows you can also use `search-console\gsc <command>`. Add `--json` to `summary`, `query`,
`hourly` or `inspect` to get machine-readable output.

- **Dimensions:** `query, page, date, country, device, searchAppearance, hour`
- **Filter operators:** `contains, equals, notContains, notEquals, includingRegex, excludingRegex`
- **Search types (`--type`):** `web, image, video, news, discover, googleNews`

## Notes for SEO work

- Data is final up to about 2 days ago. The default end date is yesterday, so use `--fresh` for the newest days.
- The access is read-only. It can't submit sitemaps, request indexing or remove URLs; do those in the GSC UI.
- Google hides rare (anonymized) queries, so query rows don't add up to the site totals.
- The `data/` folder is git-ignored.
- Other sites' data: `py "C:/Users/dell/Desktop/Scallar Stack/Console/scripts/gsc_api.py" summary` (all sites).
