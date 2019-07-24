import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk'
import rootReducer from  './rootReducer';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

const middlewareEnhancer = applyMiddleware(thunkMiddleware)

const store = createStore(rootReducer, undefined, middlewareEnhancer);

ReactDOM.render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
);

registerServiceWorker();