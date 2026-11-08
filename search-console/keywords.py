"""Google Ads Keyword Planner for THIS project: `py search-console/keywords.py <command>` (or python3).

Site defaults (countries, language) come from site.json. On the owner's PC it uses the shared
API in "Scallar Stack/Google ads" (and its .env). Anywhere else (cloud sessions) it uses the copy
of ads_api.py in this folder with credentials from environment variables. See README.md here.
"""
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
cfg = json.loads((HERE / "site.json").read_text(encoding="utf-8"))
central = Path(os.environ.get("ADS_HOME", cfg.get("ads_home", "")))

if (central / "ads_api.py").exists() and not os.environ.get("ADS_USE_VENDORED"):
    api_dir = central
else:  # cloud session / other machine: vendored copy
    api_dir = HERE
os.environ.setdefault("ADS_SITES_FILE", str(HERE / "site.json"))
os.environ.setdefault("ADS_DEFAULT_SITE", cfg["site"])
os.environ.setdefault("ADS_DATA_DIR", str(HERE / "data" / "keywords"))
os.environ.setdefault("ADS_CACHE_DIR", str(HERE / ".cache" / "keywords"))
sys.path.insert(0, str(api_dir))

import ads_api  # noqa: E402  (must import after the env vars are set)

sys.exit(ads_api.main())
