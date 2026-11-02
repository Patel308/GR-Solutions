# Rolling back production

Every deploy builds a Docker image and tags it on Docker Hub as
`pateldeepesh/tv-wale:sha-<7-character commit>`. A rollback puts one of those
earlier images back on the Hostinger server. Nothing is rebuilt.

| Image | What it is |
| --- | --- |
| `sha-606f612` | The site before the 2026 redesign (live 29 Oct – 2 Nov 2026). Git tag `prod/pre-redesign-2026-11-02`. |

Any other earlier version: take its commit on `main` (`git log --first-parent main`,
or the commit shown on its "Build, Push, Deploy" run) and use `sha-` plus the
first 7 characters.

## When to roll back

- The site is down, broken on phones, or leads stop arriving: roll back at once.
- Search: after the first week, roll back if Search Console shows indexing
  errors, or clicks fall more than 20–25% for 7+ days against the previous
  period with no other explanation (season, an algorithm update, an outage).
  Small swings in the first days after any launch are normal.

## 1. Roll back now (about 1 minute, from a phone or laptop)

1. GitHub → **Patel308/GR-Solutions** → **Actions** → **Roll Back Production**.
2. **Run workflow**, branch `main`.
3. `image_tag`: `sha-606f612` (or another `sha-` tag), `reason`: one line.
4. **Run workflow**. The run turns green when the server answers with the
   old image; its summary shows the image and the reason.

It waits for any deploy that is already running, and never runs alongside one.

## 2. Check

- Open https://grsolution.co.in on a phone (refresh, or open a private tab).
- View source: the phone number and page are the old ones.

## 3. Keep it (before anyone pushes to main again)

A rollback lasts until the next push to `main`, which deploys `main` again.
To keep the older site, revert the change on `main` as well. For the
redesign launch, which was merged with a merge commit:

```bash
git checkout main && git pull
git log --first-parent --oneline -5        # find "Launch the 2026 redesign" merge commit
git revert -m 1 <merge commit>
git push origin main                        # deploys the reverted main, about 3 minutes
```

## 4. Re-launch later

Revert the revert (`git revert <revert commit>`) and push to `main`, or run
**Roll Back Production** with the redesign's own `sha-` tag.
