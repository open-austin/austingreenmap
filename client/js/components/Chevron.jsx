import React from 'react';

import chevronSVG from '../../images/chevron-up.svg';


export default class Chevron extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            up: true,
        };
    }

    onClick() {
        if (!this.state.up) {
            window.scrollTo(0, 0);
        }
        else {
            this.props.slideUp();
        }

        this.setState({up: !this.state.up});
    }

    render() {
        return <div className={this.state.up ? 'chevron up' : 'chevron down'} onClick={() => this.onClick()} dangerouslySetInnerHTML={{__html: chevronSVG}}></div>;
    }
}

Chevron.PropTypes = {
    slideUp: React.PropTypes.func.isRequired,
};
