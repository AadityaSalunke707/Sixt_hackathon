# Person 2 files — React + TypeScript

These files implement only Person 2's responsibilities. They do not overwrite Person 1's Sidebar, Navbar, Overview, Analytics, Diagnose, shared DashboardLayout, App or main entry point.

## Copy into your existing `src/` folder

```text
src/
├── components/
│   ├── PromptInput.tsx
│   ├── PolicyEditor.tsx
│   ├── CriterionEditor.tsx
│   ├── ExampleManager.tsx
│   ├── EvaluationResult.tsx
│   ├── ScoreBreakdown.tsx
│   └── VerdictBadge.tsx
├── pages/
│   ├── RunEvaluation.tsx
│   ├── JudgeBuilder.tsx
│   └── Recipe.tsx
├── services/
│   └── api.ts
├── Person2Workspace.tsx
├── person2-webawesome.ts
└── person2.css
```

## 1. Install

From your frontend project root:

```bash
npm install @awesome.me/webawesome
npm install -D typescript
```

Import the Web Awesome registration once from your existing `main.tsx` or `main.jsx`:

```tsx
import './person2-webawesome';
```

The supplied workspace imports its own CSS. If TypeScript complains about custom `wa-*` JSX tags, add a `src/webawesome.d.ts` declaration file or use the React 19 custom-element JSX support from your installed React types.

## 2. Mount without replacing shared files

Your friend owns the global App/router/layout. Add this component as a route or as the content for a Person 2 navigation item:

```tsx
import Person2Workspace from './Person2Workspace';

// Inside your existing route element:
<Person2Workspace />
```

Do not replace App.tsx, main.tsx, DashboardLayout.tsx, index.css or any Person 1 files.

## 3. Backend API contract

Default endpoint: `POST http://localhost:8000/api/evaluate`

Request body sent by the frontend:

```json
{
  "criterion": "Criterion text",
  "policy": "Company policy text",
  "prompt": "Optional original user prompt",
  "reply": "ONE candidate reply only",
  "examples": [
    { "reply": "Labelled example", "verdict": "FAIL", "rationale": "Why" }
  ]
}
```

Expected response shape:

```json
{
  "verdict": "FAIL",
  "overall_score": 24,
  "explanation": "The reply omits a material policy condition.",
  "violations": ["Does not mention vehicle availability."],
  "evidence": ["You can extend your rental in the app."],
  "suggested_improvements": ["State that extension depends on availability."],
  "scores": {
    "policy_alignment": 20,
    "meaning_preservation": 15,
    "clarity": 90
  }
}
```

The API normalizer also accepts `label`, `decision`, `score`, `reasoning`, `rationale`, `issues`, `mistakes`, `dimension_scores` and `supporting_evidence`.

If your actual route differs, create `.env` in the frontend root:

```env
VITE_API_BASE_URL=http://localhost:8000
VITE_EVALUATE_PATH=/your/real/route
```

Restart Vite after editing `.env`.

**Important:** You did not include backend source files in the uploaded ZIP, so `/api/evaluate` and the request/response schema above are an explicit integration contract, not a claim that your backend already exposes this route. Change only `src/services/api.ts` once the backend owner confirms the actual route/schema.

## 4. Hackathon constraints respected

- One candidate reply is sent per evaluation request.
- The frontend never sends the paired reply, edit type, or hidden label.
- The model is not selectable in the browser; backend must enforce `claude-haiku-4.5`.
- The surprise criterion, policy and examples are editable runtime inputs.
- Maximum three LLM calls per reply must be enforced in the backend.
- Recipe page documents methodology; official submission remains `final_judge.py`.
