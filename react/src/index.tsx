import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

// Delay mounting until min 2000 millis after page load initiation
// Fallback to max if performance.timing.navigationStart undefined
const timeSinceNavStart =
  Date.now() - (performance?.timing?.navigationStart || Infinity);
const delayMountAmount = Math.max(2000 - timeSinceNavStart, 0);
setTimeout(function() {
  ReactDOM.render(<App />, document.getElementById('root'));
}, delayMountAmount);

serviceWorker.register();
