# Judge the Judge — SIXT Hackathon

One React frontend and one Python API, connected to the supplied criterion-agnostic LLM judge.

## Project layout

```text
Judge_The_Judge/
├── Frontend/                 # React 19 + TypeScript + Vite
│   ├── src/
│   │   ├── components/       # Shared dashboard and evaluation UI
│   │   ├── layouts/          # Shared dashboard layout
│   │   ├── pages/            # Overview, Analytics, Diagnose, Run Evaluation,
│   │   │                    # Judge Builder, Recipe
│   │   ├── services/api.ts   # Calls the backend API
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── .env.example
└── Backend/
    ├── app/main.py          # FastAPI bridge for the frontend
    ├── starter_pack/        # Original benchmark, runner, baseline and final judge
    ├── requirements.txt
    └── .env.example
```

## Requirements

- Node.js 20.19+ or 22.12+
- Python 3.11+
- Access to the hackathon-provided OpenAI-compatible LLM endpoint and API key

## 1. Configure and start the backend

In Terminal 1:

```bash
cd Judge_The_Judge/Backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp .env.example .env
```

Open `Backend/.env` and fill in `JUDGE_LLM_BASE_URL` and `JUDGE_LLM_API_KEY`.
Keep `JUDGE_LLM_MODEL=claude-haiku-4.5` as required by the hackathon. Never put
the LLM key in the frontend or commit the `.env` file.

Start the API from the `Backend` directory:

```bash
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

Check the service at <http://127.0.0.1:8000/api/health>.

## 2. Configure and start the frontend

In Terminal 2:

```bash
cd Judge_The_Judge/Frontend
npm install
cp .env.example .env
npm run dev
```

Open the local URL printed by Vite (normally <http://localhost:5173>).

## 3. Run checks

Frontend, from `Frontend/`:

```bash
npm run lint
npx tsc -b
npm run build
```

Backend offline tests, from `Backend/` with the virtual environment active:

```bash
python -m unittest discover -s starter_pack -p "test_*.py" -v
```

## API contract

- `GET /api/health` — confirms the API process is running.
- `POST /api/evaluate` — evaluates exactly one candidate reply.
- Request fields: `criterion`, `policy`, `prompt` (optional), `reply`, `language` (optional),
  and `examples` (optional labelled calibration examples).
- The backend calls the existing `starter_pack/final_judge.py` function. It uses two
  independent reviews and a third adjudication only when the first two disagree, so the
  configured judge uses at most three LLM calls per candidate reply.
- The API deliberately returns only the binary verdict. The supplied judge protocol
  does not generate a rationale, score breakdown, or evidence excerpts; the UI labels
  those fields as unavailable rather than inventing them.
- The LLM key remains on the backend and is never sent to the browser.

## Notes

Dashboard benchmark cards and charts are illustrative demo content unless replaced by
measured benchmark outputs. Do not present them as measured results. The backend API
is an interactive evaluation adapter; the official benchmark runner and submission
scripts remain in `Backend/starter_pack/`.
