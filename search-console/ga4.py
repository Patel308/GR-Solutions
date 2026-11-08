"""GA4 reports for THIS project: `py search-console/ga4.py <command>` (summary, channels, ai, pages, leads, ...).

Same bootstrap as gsc.py: on the owner's PC the shared copies in "Scallar Stack/Console/scripts" (and
"Scallar Stack/Google ads" for keywords) are used; elsewhere the vendored copies in this folder.
"""
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
cfg = json.loads((HERE / "site.json").read_text(encoding="utf-8"))
central = Path(os.environ.get("GSC_HOME", cfg["console_home"])) / "scripts"

if (central / "ga4_api.py").exists() and not os.environ.get("GSC_USE_VENDORED"):
    api_dir = central
    os.environ.setdefault("ADS_HOME", cfg.get("ads_home", ""))
else:  # cloud session / other machine: vendored copies + single-site registry
    api_dir = HERE
    os.environ.setdefault("GSC_SITES_FILE", str(HERE / "site.json"))
    os.environ.setdefault("ADS_HOME", str(HERE))
os.environ.setdefault("GSC_DEFAULT_SITE", cfg["site"])
os.environ.setdefault("GSC_DATA_DIR", str(HERE / "data"))
os.environ.setdefault("ADS_SITES_FILE", str(HERE / "site.json"))
os.environ.setdefault("ADS_CACHE_DIR", str(HERE / ".cache" / "keywords"))
sys.path.insert(0, str(api_dir))

import ga4_api  # noqa: E402  (must import after the env vars are set)

sys.exit(ga4_api.main())
