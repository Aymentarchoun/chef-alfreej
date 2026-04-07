import React from 'react';
import ReactDOM from 'react-dom/client';
import { CartProvider } from './context/CartContext';
import App from './App';
import AdminApp from './admin/AdminApp';
import './i18n/index';
import './index.css';

const isAdmin = window.location.pathname.startsWith('/admin');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    {isAdmin ? (
      <AdminApp />
    ) : (
      <CartProvider>
        <App />
      </CartProvider>
    )}
  </React.StrictMode>
);
