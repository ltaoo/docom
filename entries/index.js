import React from 'react';
import ReactDOM from 'react-dom';

import App from '@root/theme/App';
import fileTree from '@root/.docom/db';

ReactDOM.render(<App data={fileTree} />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
