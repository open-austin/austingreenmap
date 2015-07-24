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
        // Pass props to dynamically rendered children
        var props = {slideUp: () => this.slideUp()};
        const children = React.Children.map(this.props.children, (element) =>
            React.cloneElement(element, props)
        );

        return (
            <div className={this.state.up ? 'container up' : 'container down'} ref='content'>
                <div className='park-count u-clickable' onClick={() => this.slideUp()}>
                    <Chevron up={this.state.up} />
                    <div className='count'>{this.props.title}</div>
                </div>
                {this.state.up ? <div className='container-content'>{children}</div> : null}
            </div>
        );
    }
}
