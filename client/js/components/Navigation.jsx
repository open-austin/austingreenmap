import React from 'react';


export default class Navigation extends React.Component {
    render () {
        return (
            <div className='row nav'>
                <a className='logo' onClick={() => window.location.reload()}>
                    <img src='images/deciduous_tree.png' />
                </a>
            </div>
        );
    }
}
