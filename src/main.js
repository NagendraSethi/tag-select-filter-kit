
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.tsx';  // Updated to reference the TypeScript version
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simple log to check if the app is initializing properly
console.log('App initializing...');

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(React.createElement(App));  // Using createElement instead of JSX
} else {
  console.error('Root element not found!');
}
