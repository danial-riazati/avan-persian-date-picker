import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import Screenshots from './screenshots';
import './screenshots.css';
import '@avan/themes/default.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Screenshots />
  </StrictMode>,
);
