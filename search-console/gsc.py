"""Search Console data for THIS project.

Thin launcher for the shared API in "Scallar Stack/Console". The site and the output folder are
preset from site.json, so no --site is needed. Run `py search-console/gsc.py --help`.
"""
import json
import os
import sys
from pathlib import Path

HERE = Path(__file__).resolve().parent
cfg = json.loads((HERE / "site.json").read_text(encoding="utf-8"))
home = Path(os.environ.get("GSC_HOME", cfg["console_home"]))
api = home / "scripts" / "gsc_api.py"
if not api.exists():
    sys.exit(f"Shared GSC API not found at {api}. Set GSC_HOME to the Console folder.")

os.environ.setdefault("GSC_DEFAULT_SITE", cfg["site"])
os.environ.setdefault("GSC_DATA_DIR", str(HERE / "data"))
sys.path.insert(0, str(api.parent))

import gsc_api  # noqa: E402  (must import after the env vars are set)

sys.exit(gsc_api.main())
