
import { createRoot } from 'react-dom/client';
import React from 'react';
import App from './App.js';  // Explicitly reference .js extension
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Simple log to check if the app is initializing properly
console.log('App initializing...');

const rootElement = document.getElementById("root");
if (rootElement) {
  createRoot(rootElement).render(<App />);
} else {
  console.error('Root element not found!');
}
