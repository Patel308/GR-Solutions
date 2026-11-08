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
