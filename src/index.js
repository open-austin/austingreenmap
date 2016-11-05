import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import AppRouter from'./components/AppRouter.jsx';
import './index.css';

ReactDOM.render(
  <AppRouter />,
  document.getElementById('app')
);

window.React = React;
window.AppRouter = AppRouter;
