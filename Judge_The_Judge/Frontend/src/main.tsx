
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// WebAwesome styles and components
import '@awesome.me/webawesome/dist/styles/webawesome.css';

import '@awesome.me/webawesome/dist/components/button/button.js';
import '@awesome.me/webawesome/dist/components/card/card.js';
import '@awesome.me/webawesome/dist/components/badge/badge.js';
import '@awesome.me/webawesome/dist/components/callout/callout.js';
import '@awesome.me/webawesome/dist/components/icon/icon.js';
import '@awesome.me/webawesome/dist/components/spinner/spinner.js';

// Person 2 WebAwesome configuration
import './person2-webawesome';

// Global styles
import './index.css';

// Main application
import App from './App';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);
