import React from 'react';


export default class Navigation extends React.Component {
    render () {
        var h1 = <h1 onClick={() => window.location.reload()}>Austin Green Map</h1>;

        return (
            <div className='navigation'>
                <a className='logo' onClick={() => window.location.reload()}>
                    <img alt='Austin Green Map' src='images/deciduous_tree.png' />
                </a>
                {this.props.children ? this.props.children : h1}
            </div>
        );
    }
}
