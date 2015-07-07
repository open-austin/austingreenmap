import React from 'react';

import utils from './utils';
import App from'./components/App.react.jsx';


window.React = React;
React.render(<App />, document.getElementById('app'));

window.onload = utils.setupiOSTouchState;
