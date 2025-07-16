import React from 'react';
import ReactDOM from 'react-dom/client';
import TemplateSelector from './components/TemplateSelector';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <TemplateSelector onSelect={(template) => console.log('Selected:', template)} />
    </ErrorBoundary>
  </React.StrictMode>
);
