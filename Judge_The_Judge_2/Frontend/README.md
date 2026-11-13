# Judge the Judge — SIXT Hackathon Frontend

A single React + TypeScript + Vite application combining the shared dashboard and judge evaluation workspace.

## Requirements

- Node.js 20.19+ or 22.12+
- npm

## Start locally

```bash
npm install
cp .env.example .env
npm run dev
```

If you do not have a backend running yet, the dashboard can still be explored, but evaluation requests need the API described below.

## Checks and production build

```bash
npm run lint
npx tsc -b
npm run build
```

The build script runs the TypeScript project checks before Vite creates the production bundle.

## Backend configuration

Copy `.env.example` to `.env` and adjust the values for your backend:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_EVALUATE_PATH=/api/evaluate
```

The evaluation page sends `POST /api/evaluate`. Confirm the request and response schema against the backend implementation. The API adapter is `src/services/api.ts`.

## Source structure

- `src/layouts/` — shared dashboard layout and navigation
- `src/pages/` — Overview, Analytics, Diagnose, Run Evaluation, Judge Builder, and Recipe
- `src/components/` — reusable dashboard and evaluation components
- `src/services/` — backend API adapter
- `src/assets/` — local images and assets
- `src/Person2Workspace.tsx` — standalone Person 2 workspace component, retained for optional use
- `src/person2-webawesome.ts` — single registration point for WebAwesome custom elements

## Notes

The main application uses one `App.tsx` and one `main.tsx`. Demo/illustrative dashboard data should not be presented as measured benchmark results. Keep secrets out of frontend environment variables; Vite-exposed variables are bundled into client code.
