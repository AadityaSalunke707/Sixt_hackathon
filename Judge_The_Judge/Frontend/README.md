<<<<<<< HEAD
<<<<<<< HEAD
# Judge the Judge — Frontend
=======
<<<<<<< HEAD
=======
>>>>>>> refs/remotes/origin/main
# React + TypeScript + Vite
=======
# React + Vite
>>>>>>> 9547c88820b860a0e3eb6797bed25ff537dabb74
<<<<<<< HEAD
>>>>>>> b91fbb478ed1e152ecae3322625f92eef33dfe6a
=======
>>>>>>> refs/remotes/origin/main

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

<<<<<<< HEAD
<<<<<<< HEAD
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
=======
<<<<<<< HEAD
=======
>>>>>>> refs/remotes/origin/main
If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```

You can also install [eslint-plugin-react-x](https://npmx.dev/package/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://npmx.dev/package/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])

```
=======
If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
>>>>>>> 9547c88820b860a0e3eb6797bed25ff537dabb74
<<<<<<< HEAD
>>>>>>> b91fbb478ed1e152ecae3322625f92eef33dfe6a
=======
>>>>>>> refs/remotes/origin/main
