import React from 'react';
import "@fontsource/material-icons-two-tone";// la biblio de font-family de jumia 
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
//cette import est necessaire pour travailler sur le concept de SPA (Single Page Application) . dit par ziyad 
import { BrowserRouter } from 'react-router-dom';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    {/*
     Le composant BrowserRouter entoure l'application entière pour permettre la gestion de la navigation côté client.
     Cela permet de créer une application monopage (SPA) où les différentes vues sont rendues sans recharger la page entière.
     dit par ziyad
     */}
    <BrowserRouter>
      <App />
    </BrowserRouter>
     
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
