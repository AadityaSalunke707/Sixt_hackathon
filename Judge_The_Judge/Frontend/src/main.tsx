<<<<<<< HEAD
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
=======
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// @ts-expect-error CSS imports are handled by the bundler; TypeScript has no declaration for this stylesheet.
import '@awesome.me/webawesome/dist/styles/webawesome.css';
import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/card/card.js';
import '@awesome.me/webawesome/dist/components/badge/badge.js';
import '@awesome.me/webawesome/dist/components/callout/callout.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/spinner/spinner.js';

import './person2-webawesome';
// @ts-expect-error CSS imports are handled by the bundler; TypeScript has no declaration for this stylesheet.
import './index.css';

import App from './App';
>>>>>>> 9547c88820b860a0e3eb6797bed25ff537dabb74

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
<<<<<<< HEAD
  </StrictMode>,
)
=======
  </StrictMode>
);
>>>>>>> 9547c88820b860a0e3eb6797bed25ff537dabb74
