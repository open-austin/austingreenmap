import React from 'react';
import App from './App.react.jsx';


export default class AppRouter extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            route: window.location.hash.substring(1)
        }
    }

    componentWillMount() {
        window.addEventListener('hashchange', this.onHashChange.bind(this));
    }

    componentDidUnmount() {
        window.removeEventListener('hashchange', this.onHashChange.bind(this));
    }

    onHashChange() {
        this.setState({ route: window.location.hash.substring(1) })
    }

    render() {
        var id;
        if (this.state.route.match(/park\/\d*/)) {
            id = this.state.route.split('park/')[1]
        } else {
            id = null
        }
        console.log(id)
        return <App parkId={id}/>;
    }

}
