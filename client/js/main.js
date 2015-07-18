import React from 'react';

import utils from './utils';
import AppRouter from'./components/AppRouter.jsx';


window.React = React;
React.render(<AppRouter />, document.getElementById('app'));

window.onload = utils.setupiOSTouchState;
