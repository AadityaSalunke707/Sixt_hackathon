# Judge the Judge — Frontend

Combined React + TypeScript + Vite frontend for both dashboard/diagnostics and judge configuration/evaluation.

## Start

```bash
npm install
npm run dev
```

## Production build

```bash
npm run build
```

## Backend connection

Create `.env` in this folder:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_EVALUATE_PATH=/api/evaluate
```

The Run Evaluation page expects `POST /api/evaluate`. Confirm the route and response schema with the backend implementation. The API adapter lives in `src/services/api.ts`.

## Source structure

- `src/components/`: shared dashboard and evaluation UI components
- `src/pages/`: Overview, Analytics, Diagnose, Run Evaluation, Judge Builder, Recipe
- `src/layouts/`: shared dashboard shell and navigation
- `src/services/`: backend API adapter

Charts and case rows currently marked as illustrative/demo are placeholders until connected to actual benchmark CSV outputs. Do not present them as measured results.
