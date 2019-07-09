import React from 'react';
import ReactDOM from 'react-dom';

import App from '@root/theme/App';
import source from '@root/.docom/source.json';
import imports from '@root/.docom/imports';
import './index.css';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(<App imports={imports} source={source} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();