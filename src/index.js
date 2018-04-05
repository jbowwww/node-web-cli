import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

ReactDOM.render(<App cmdServer="ws://127.0.0.1:8080"/>, document.getElementById('root'));
registerServiceWorker();
