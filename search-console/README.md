# Search Console data: grsolution.co.in

This folder gives anyone (people, Claude, Codex) Google Search Console data for **grsolution.co.in**.
It uses the property `sc-domain:grsolution.co.in`. Auth is a read-only service account that never expires. Don't add
OAuth or credential code to this project, and don't ask for keys in chat.

## Commands (run from the project root; use `python3` instead of `py` on Linux/Mac/cloud)

```bash
py search-console/gsc.py doctor                       # confirm access works
py search-console/gsc.py summary --days 28            # clicks, impressions, CTR, avg position
py search-console/gsc.py summary --days 7 --fresh     # include the last 1-2 days (not yet final)
py search-console/gsc.py query --dimensions query --limit 50          # top queries
py search-console/gsc.py query --dimensions page --limit 50           # top pages
py search-console/gsc.py query --dimensions query,page --days 90 --csv search-console/data/query_page_90d.csv
py search-console/gsc.py query --dimensions query --filter "query:contains:<word>"
py search-console/gsc.py query --dimensions date --days 90            # daily trend
py search-console/gsc.py query --dimensions country                   # or: device
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

## Cloud sessions (Codex cloud / Claude Code on the web)

The cloud machine can't see the owner's PC, so it uses `search-console/gsc_api.py` in this repo and
reads the key from an environment variable. Each cloud environment needs this once:

1. **Environment variable:** `GSC_SERVICE_ACCOUNT_JSON_B64`, set to the base64 of the
   service-account key. The owner sets it in the environment settings. Never commit it.
2. **Setup:** `pip install -r search-console/requirements.txt`
3. **Network access:** allow `oauth2.googleapis.com`, `searchconsole.googleapis.com` and
   `www.googleapis.com`.

Check it with `python3 search-console/gsc.py doctor`. It should print `OK  grsolution`.
If it fails: "packages missing" means step 2 wasn't done; "No Search Console credentials" means
step 1 wasn't done; a connection error means step 3 wasn't done.

## Files

- **`site.json`:** this project's site and property
- **`gsc.py` / `gsc.cmd`:** launchers
- **`gsc_api.py`:** a copy of the shared API. Don't edit it here: edit `C:/Users/dell/Desktop/Scallar Stack/Console/scripts/gsc_api.py`
  and run `sync_project_folders.py`.
