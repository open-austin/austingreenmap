import React from 'react';

import chevronSVG from '../../images/chevron-up.svg';


export default class Chevron extends React.Component {
    render() {
        return <div className={this.props.up ? 'chevron down' : 'chevron up'} dangerouslySetInnerHTML={{__html: chevronSVG}}></div>;
    }
}

Chevron.PropTypes = {
    up: React.PropTypes.bool.isRequired,
};
