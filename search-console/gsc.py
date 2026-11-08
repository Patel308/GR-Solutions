"""Search Console data for THIS project: `py search-console/gsc.py <command>` (or python3).

The site and output folder are preset from site.json, so no --site is needed.
On the owner's PC it uses the shared API in "Scallar Stack/Console" (and its key).
Anywhere else (Codex / Claude Code cloud sessions) it uses the copy of gsc_api.py in this
folder, with the key from env GSC_SERVICE_ACCOUNT_JSON_B64. See README.md here.
"""
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
cfg = json.loads((HERE / "site.json").read_text(encoding="utf-8"))
central = Path(os.environ.get("GSC_HOME", cfg["console_home"])) / "scripts"

if (central / "gsc_api.py").exists() and not os.environ.get("GSC_USE_VENDORED"):
    api_dir = central
else:  # cloud session / other machine: vendored copy + single-site registry
    api_dir = HERE
    os.environ.setdefault("GSC_SITES_FILE", str(HERE / "site.json"))

os.environ.setdefault("GSC_DEFAULT_SITE", cfg["site"])
os.environ.setdefault("GSC_DATA_DIR", str(HERE / "data"))
sys.path.insert(0, str(api_dir))

import gsc_api  # noqa: E402  (must import after the env vars are set)

sys.exit(gsc_api.main())
