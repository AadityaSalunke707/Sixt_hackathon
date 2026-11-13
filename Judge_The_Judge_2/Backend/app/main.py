from __future__ import annotations

import logging
import os
import sys
import threading
from pathlib import Path
from typing import Literal

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, ConfigDict, Field

# Make the supplied starter-pack modules importable when Uvicorn is started
# from the Backend directory with: uvicorn app.main:app --reload.
BACKEND_DIR = Path(__file__).resolve().parents[1]
STARTER_PACK_DIR = BACKEND_DIR / "starter_pack"
if str(STARTER_PACK_DIR) not in sys.path:
    sys.path.insert(0, str(STARTER_PACK_DIR))

import baseline_judge  # noqa: E402
import final_judge  # noqa: E402

logger = logging.getLogger("judge_the_judge.api")

app = FastAPI(
    title="Judge the Judge API",
    version="1.0.0",
    description="Local API adapter for the criterion-agnostic hackathon judge.",
)

allowed_origins = [
    origin.strip()
    for origin in os.getenv(
        "FRONTEND_ORIGINS",
        "http://localhost:5173,http://127.0.0.1:5173,http://localhost:4173",
    ).split(",")
    if origin.strip()
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=False,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Accept"],
)

# final_judge.prepare stores examples in module-level state. Serialize API
# evaluations so simultaneous users cannot mix one another's examples.
_evaluation_lock = threading.Lock()


class LabelledExample(BaseModel):
    model_config = ConfigDict(extra="ignore")

    reply: str = Field(min_length=1, max_length=20_000)
    verdict: Literal["PASS", "FAIL"]
    rationale: str | None = Field(default=None, max_length=4_000)


class EvaluationRequest(BaseModel):
    model_config = ConfigDict(extra="ignore")

    criterion: str = Field(min_length=1, max_length=20_000)
    policy: str = Field(min_length=1, max_length=30_000)
    prompt: str = Field(default="", max_length=10_000)
    reply: str = Field(min_length=1, max_length=20_000)
    language: str = Field(default="unspecified", max_length=40)
    examples: list[LabelledExample] = Field(default_factory=list, max_length=20)


@app.get("/api/health")
def health() -> dict[str, str]:
    return {
        "status": "ok",
        "service": "judge-the-judge",
        "model": os.getenv("JUDGE_LLM_MODEL", "not-configured"),
    }


@app.post("/api/evaluate")
def evaluate(request: EvaluationRequest) -> dict:
    # The endpoint accepts one candidate reply only. Paired alternatives,
    # edit categories, and hidden labels are not part of this API contract.
    with _evaluation_lock:
        dev_examples = []
        for index, example in enumerate(request.examples):
            dev_examples.append(
                {
                    "source_id": f"ui-example-{index}",
                    "edit_type": "user-supplied-calibration-example",
                    "lang": request.language,
                    "question_original": request.prompt,
                    "original": example.reply,
                    "original_label": example.verdict.lower(),
                    "original_rationale": example.rationale or "",
                }
            )

        final_judge.prepare(request.criterion, request.policy, dev_examples)

        try:
            verdict = final_judge.judge(
                question=request.prompt,
                reply=request.reply,
                lang=request.language,
                criterion=request.criterion,
                policy=request.policy,
            )
        except baseline_judge.LLMError as exc:
            raise HTTPException(status_code=503, detail=str(exc)) from exc
        except Exception as exc:  # keep internal details and secrets in server logs only
            logger.exception("Evaluation failed")
            raise HTTPException(
                status_code=502,
                detail="The judge service failed. Check the backend terminal for details.",
            ) from exc

    return {
        "verdict": verdict.upper(),
        "overall_score": None,
        "explanation": (
            f"The configured judge returned {verdict.upper()}. "
            "The official judging protocol returns a binary PASS/FAIL decision; "
            "it does not generate a written rationale or numerical score."
        ),
        "violations": [],
        "evidence": [],
        "suggested_improvements": [],
        "scores": {},
    }
