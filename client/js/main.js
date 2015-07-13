import React from 'react';
import utils from './utils';
import App from './components/App.react.jsx';

window.React = React;
window.App = App;

function init() {
    utils.setupiOSTouchState();
    window.austingreenmap = React.render(<App />, document.getElementById('app'));
}

if (document.URL.indexOf("http://") === -1 && document.URL.indexOf("https://") === -1) {
    document.addEventListener('deviceready', init, false);
}
else {
    init();
}
