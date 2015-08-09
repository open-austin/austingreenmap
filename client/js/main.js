import React from 'react';
import {setupiOSTouchState} from './utils';
import AppRouter from'./components/AppRouter.jsx';

window.React = React;
window.AppRouter = AppRouter;

function init() {
    setupiOSTouchState();
    window.austingreenmap = React.render(<AppRouter />, document.getElementById('app'));
}

if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
    document.addEventListener('deviceready', init, false);
}
else {
    init();
}
