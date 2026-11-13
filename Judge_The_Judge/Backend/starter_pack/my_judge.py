"""Compatibility entry point; the submission implementation is final_judge.py."""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from final_judge import judge, prepare  # noqa: E402
