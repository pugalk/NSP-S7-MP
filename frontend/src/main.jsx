import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import { PortalProvider } from './context/PortalContext';
import { PWAProvider } from './context/PWAContext';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <PWAProvider>
        <PortalProvider>
          <App />
        </PortalProvider>
      </PWAProvider>
    </BrowserRouter>
  </React.StrictMode>
);
