import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { GoogleMapsWrapper } from './frontend/components/GoogleMapsWrapper.jsx';
import './index.css';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <GoogleMapsWrapper>
      <App />
    </GoogleMapsWrapper>
  </StrictMode>,
);

