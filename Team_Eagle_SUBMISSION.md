# Submission

## Authors

**Team name:** Team Eagle

**Project:** Project 3: Judge the Judge

**Team members:** Aaditya Dnyaneshwar Salunke, Satyam Verma, Charishma Velanati

## Problem and approach

We built a reusable LLM-as-a-judge system to check whether a single AI-generated customer-service reply follows a supplied evaluation criterion and company policy. Our initial criterion focuses on over-promising: for example, changing “may” to “will”, removing an important condition, widening the scope of a policy, or stating a more generous amount than the policy allows.

Our main idea is to judge the meaning of one candidate reply against the criterion and policy supplied at runtime—not to compare it with a paired alternative or use hidden edit labels. This makes the judge criterion-agnostic and allows the same implementation to be used with a new “surprise” criterion by changing the inputs rather than the code.

The judging method combines:
- **Criterion-driven prompting:** the current criterion and company policy are provided at runtime and treated as the judging reference.
- **Balanced few-shot calibration:** `prepare()` selects up to two PASS and two FAIL examples from the supplied development examples. Pair metadata and hidden edit information are not included in the judge prompt.
- **A lightweight numeric review signal:** numerals in the candidate reply that do not appear verbatim in the policy are flagged for checking. This is a review hint, not an automatic failure rule.
- **Two independently framed reviews:** one audits claims and conditions; the other challenges the reply for a specific, policy-supported violation.
- **Conditional adjudication:** if the first two reviews disagree, a third call reassesses the case. The final verdict is the majority decision.

The judge uses at most three LLM calls per candidate reply and returns only `PASS` or `FAIL`.

**Assumptions:** the supplied policy is the source of truth; the criterion defines what counts as a violation; and the development examples are representative enough to provide useful calibration. The judge evaluates one reply at a time.

## Models and why

We selected **Claude Haiku 4.5**, accessed through the SIXT-provided LLM API. We chose it because it is the model configured for the hackathon environment and supports the OpenAI-compatible Chat Completions interface used by our backend.

| Model / configuration | Open-weight or closed | Where it runs | Main metric(s) | Cost and time per item | Chosen? |
| --- | --- | --- | --- | --- | --- |
| Claude Haiku 4.5 with proposed judge (`final_judge.py`; balanced examples, two reviews and conditional third review) | Closed | SIXT LLM API | Combined, macro catch, macro keep, Cohen’s kappa, repeat consistency | Unknown — not measured yet | Yes — only model tested |

**Project-specific settings**
- Model: `claude-haiku-4.5`
- Temperature: `0`
- Maximum output tokens: `256` (configurable)
- Request timeout: `60` seconds (configurable)
- Maximum retries: `6` (configurable for rate limits and server errors)
- Maximum model calls per candidate: `3`
- Calibration examples: up to `2` PASS and `2` FAIL examples
- Runner concurrency: default `5` workers; use `--workers 1` for sequential runs
- Measured API cost and per-item latency: not available; not yet measured

Claude Haiku 4.5 is the only model tested so far. The supplied baseline verdict file is used as a reference benchmark, not as evidence that a second model was tested. A controlled baseline-prompt comparison using the same Claude model would be a useful additional experiment. Cost and latency have not been measured and are reported as unknown.

## Results

The benchmark scorer in `starter_pack/score.py` reports:
- **Combined:** harmonic mean of macro catch and macro keep. Macro rates average across edit types, so frequent edit types do not dominate.
- **Macro catch:** ability to pass the original and fail its harmful edit.
- **Macro keep:** ability to pass both the original and its harmless edit.
- **Cohen’s kappa:** agreement with the dataset’s construction labels (and human labels, if supplied).
- **Repeat consistency:** agreement between two runs of the same judge, when a second run is supplied.

The supplied development set contains **226 paired cases** (452 individual replies). It includes **110 harmful** and **116 harmless** edits. The fast subset contains 119 paired cases. The surprise development set contains 73 paired cases.

**Reference only — supplied baseline verdict file:** scoring `baseline_dev_verdicts.csv` against the 226 development pairs gives:
- Combined: **0.697**
- Macro catch: **0.592**
- Macro keep: **0.847**

These are development-set reference numbers from the baseline verdict file included in the starter pack. They are **not our proposed judge’s result and must not be described as held-out test performance**.

**Our proposed judge on held-out data:** Not available yet. We have not completed or recorded a held-out evaluation, so no held-out performance figures are claimed. These results should be added after running the final, frozen implementation on the designated held-out set.

**What did not work / limitations:** the numeric check is lexical and can flag equivalent number formats or irrelevant numerals; it therefore only prompts closer review. Both reviews use the same underlying model, so they are not fully independent model opinions. Few-shot examples may bias the judge if they are unrepresentative. Repeat consistency alone does not prove correctness. The system returns a binary verdict and does not produce an official numerical score, evidence excerpts or improvement suggestions.

## How to run

### Requirements

- Python **3.10 or newer** for the judging/benchmark scripts.
- Node.js and npm for the React frontend.
- A SIXT LLM API key and the model/API configuration for live judging.
- The Python judge and scorer use the Python standard library.

### Configure the backend

Create `Backend/.env` (or the environment file location used by your backend) with the following variable names. Do not commit the file or expose the key in frontend `VITE_*` variables.

```env
JUDGE_LLM_BASE_URL=<SIXT-provided-base-URL>
JUDGE_LLM_API_KEY=<your-private-key>
JUDGE_LLM_MODEL=claude-haiku-4.5
JUDGE_LLM_MAX_TOKENS=256
JUDGE_LLM_TIMEOUT=60
JUDGE_LLM_MAX_RETRIES=6
```

### Reproduce the benchmark

From a fresh clone, enter the starter-pack directory:

```bash
cd Backend/starter_pack
```

Run the proposed judge on the fast development subset:

```bash
python3 run_judge.py \
  --judge final_judge.py \
  --pairs dev_pairs_fast.jsonl \
  --criterion JUDGE1_CRITERION.md \
  --policy policy.md \
  --dev dev_pairs.jsonl \
  --out ours_fast.csv
```

Score the fast run:

```bash
python3 score.py ours_fast.csv dev_pairs_fast.jsonl
```

Run the full development set:

```bash
python3 run_judge.py \
  --judge final_judge.py \
  --pairs dev_pairs.jsonl \
  --criterion JUDGE1_CRITERION.md \
  --policy policy.md \
  --dev dev_pairs.jsonl \
  --out ours.csv
```

Score the full development run against the supplied baseline:

```bash
python3 score.py ours.csv dev_pairs.jsonl \
  --baseline baseline_dev_verdicts.csv
```

Run the surprise criterion with the same judge implementation (only the criterion and example inputs change):

```bash
python3 run_judge.py \
  --judge final_judge.py \
  --pairs surprise/dev_pairs.jsonl \
  --criterion surprise/CRITERION.md \
  --policy policy.md \
  --dev surprise/dev_pairs.jsonl \
  --out surprise_dev.csv

python3 score.py surprise_dev.csv surprise/dev_pairs.jsonl
```

Run the offline unit tests:

```bash
python3 -m unittest -v test_final_judge.py
```

For repeat consistency, run the same cases a second time without enabling the response cache, then score both runs:

```bash
python3 score.py ours.csv dev_pairs.jsonl --repeat ours_run2.csv
```

### Run the web application

From the project root, start the backend API using the project's documented backend command, then start the frontend:

```bash
cd Frontend
npm install
npm run dev
```

[Confirm and insert the exact backend API start command and any additional backend dependencies from the final repository before submission.]

**Environment variable names required:** `JUDGE_LLM_BASE_URL`, `JUDGE_LLM_API_KEY`, `JUDGE_LLM_MODEL`, `JUDGE_LLM_MAX_TOKENS`, `JUDGE_LLM_TIMEOUT`, `JUDGE_LLM_MAX_RETRIES`. `JUDGE_LLM_CACHE` is optional and should not be enabled when measuring repeat consistency.

## Demo

**Selected demo format:** Presentation slides.

**Demo file path:** `submission/slides.pdf` (maximum 5 slides). Place the final exported slide deck at this path before packaging the submission. The slide file has not been supplied or verified yet.

## Next steps

With more time, we would:
1. Evaluate on a larger and more diverse held-out set, including additional languages, policy domains and unseen edit types.
2. Compare Claude Haiku 4.5 with alternative models using the same cases, prompts and scoring procedure.
3. Add human-reviewed labels and analyse false accepts and false rejects by edit type and language.
4. Measure API latency, token usage and cost per candidate, and optimise the number of model calls without reducing reliability.
5. Improve number and unit normalisation while keeping the check as a supporting signal rather than a hard-coded rule.
6. Add structured, auditable explanations as a separate feature only if the evaluation protocol permits it; the official verdict would remain PASS/FAIL.

SIXT could use this workflow as a configurable quality gate for customer-support AI replies. Teams could supply a policy and criterion for a specific workflow, evaluate replies before they reach customers, and monitor failure patterns as policies or models change.
