
import React from 'react';
import PodsManagement from './components/PodsManagement';
import './App.css';

function App() {
  return React.createElement(
    'div',
    { className: "App" },
    React.createElement(PodsManagement)
  );
}

export default App;
