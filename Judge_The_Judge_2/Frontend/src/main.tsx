import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';

// Registers WebAwesome custom elements and loads its component styles.
import './person2-webawesome';
import './index.css';

import App from './App';

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);
  root.render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
}
