import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import './index.css';
import '@avan/themes/fonts.css';
import '@avan/themes/default.css';
import '@avan/themes/dark.css';
// NOTE: vite.config.ts aliases `@avan/react/client` straight to the package's source for fast
// local HMR, so its structural CSS (styles/calendar.css, styles/time-picker.css) is already
// pulled in transitively — a real consumer importing the published package must additionally
// `import '@avan/react/client.css';` (see documentation/installation.md).

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
