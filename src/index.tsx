import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware, { ThunkMiddleware } from 'redux-thunk';
import rootReducer from './rootReducer';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import { composeWithDevTools } from 'redux-devtools-extension';
import { AppState, AppActions } from './types';

const middlewareEnhancer = applyMiddleware(thunkMiddleware as ThunkMiddleware<
  AppState,
  AppActions
>);

const store = createStore(rootReducer, composeWithDevTools(middlewareEnhancer));

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();
