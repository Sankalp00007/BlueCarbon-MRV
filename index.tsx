import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

const rootElement = document.getElementById('root');

if (!rootElement) {
  console.error("BlueCarbon Ledger: Critical Error - Root element not found");
} else {
  try {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
    console.log("BlueCarbon Ledger: Application mounted successfully");
  } catch (err) {
    console.error("BlueCarbon Ledger: Critical Mount Error:", err);
    rootElement.innerHTML = `
      <div style="height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; font-family: 'Inter', sans-serif; padding: 20px; text-align: center; background: #fff1f2;">
        <div style="font-size: 48px; margin-bottom: 20px;">⚠️</div>
        <h1 style="color: #9f1239; font-size: 20px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 12px;">Registry Sync Failed</h1>
        <p style="color: #be123c; font-size: 14px; max-width: 400px; line-height: 1.6;">The application encountered a critical error during initialization. This is usually caused by a script loading conflict.</p>
        <button onclick="location.reload()" style="margin-top: 32px; background: #0ea5e9; color: white; padding: 12px 32px; border: none; border-radius: 12px; font-weight: 700; text-transform: uppercase; font-size: 12px; letter-spacing: 0.1em; cursor: pointer; box-shadow: 0 10px 15px -3px rgba(14, 165, 233, 0.3);">Retry Connection</button>
      </div>
    `;
  }
}
