import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/ErrorBoundary.tsx';
import './index.css';

// Guard against third-party extension injection errors (e.g. MetaMask, external content scripts)
if (typeof window !== 'undefined') {
  window.addEventListener('error', (event) => {
    if (
      event.message?.includes('MetaMask') ||
      event.message?.includes('originalPrompt') ||
      event.filename?.includes('extension') ||
      event.filename?.includes('chrome-extension') ||
      event.filename?.includes('moz-extension')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  }, true);

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason?.message || String(event.reason || '');
    if (
      reason.includes('MetaMask') ||
      reason.includes('originalPrompt') ||
      reason.includes('chrome-extension')
    ) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

