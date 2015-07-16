import React from 'react';

export default class AppRouter extends React.Component {

    componentWillMount() {
        window.addEventListener('hashchange', this.onHashChange.bind(this));
    }

    componentDidUnmount() {
        window.removeEventListener('hashchange', this.onHashChange.bind(this));
    }

    onHashChange() {
        const route = window.location.hash.substring(1);
        var id;
        if (route.match(/park\/\d*/)) {
            id = route.split('park/')[1]
        } else {
            id = null
        }
        this.props.selectParkWithId(id);
    }

    render() {
        return null;
    }

}

AppRouter.propTypes = {
    selectParkWithId: React.PropTypes.func.isRequired
}
