import React from 'react';

import Chevron from './Chevron.jsx';

export default class Container extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            up: false,
        };
    }

    slideUp() {
        this.setState({up: !this.state.up});
    }

    render() {
        return (
            <div className={this.state.up ? 'container up' : 'container down'} ref='content'>
                <div className='park-count u-clickable' onClick={() => this.slideUp()}>
                    <Chevron up={this.state.up} />
                    <div className='count'>{this.props.title}</div>
                </div>
                <div className='container-content'>
                    {this.state.up ? this.props.children : null}
                </div>
            </div>
        );
    }
}
