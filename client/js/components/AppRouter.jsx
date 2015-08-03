import React from 'react';

import App from './App.react.jsx';


export default class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: window.location.hash.substring(1)
        };
    }

    componentWillMount() {
        window.addEventListener('hashchange', this.onHashChange.bind(this));
    }

    componentDidUnmount() {
        window.removeEventListener('hashchange', this.onHashChange.bind(this));
    }

    onHashChange() {
        this.setState({ route: window.location.hash.substring(1) });
    }

    render() {
        var id = this.state.route.match(/park\/\d*/) ? this.state.route.split('park/')[1] : null;
        var app = window.app = (<App parkId={id} />);

        return app;
    }

}
