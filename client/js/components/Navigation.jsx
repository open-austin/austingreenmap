import React from 'react';


export default class Navigation extends React.Component {
    render () {
        var siteTitle = <h1><a href='#'>Austin Green Map</a></h1>;

        return (
            <div className='navigation'>
                <a title='Austin Green Map' className='logo'  href='#'>
                    <img alt='Austin Green Map' src='images/deciduous_tree.png' />
                </a>
                {this.props.children ? this.props.children : siteTitle}
            </div>
        );
    }
}
