import React from 'react';

import icons from '../utils/icons.json';


export default class ParkFeatureListItem extends React.Component {
    render() {
        var icon = icons[this.props.type];
        var iconURL = icon === '?' ? 'images/deciduous_tree.png' : `images/icons/${icon}-18@2x.png`;

        return (
            <div className='row u-clickable' key={this.props.id} onClick={() => this.props.showFeatureInMap(this.props.id)}>
                <div className='one columns'>
                    <img src={iconURL} alt={this.props.type} />
                </div>
                <div className='two columns'>
                    {this.props.type}
                </div>
                <div className='seven columns'>
                    <div className='name'>{this.props.name}</div>
                    <i>{this.props.description}</i>
                </div>
                <div className='two columns right'>
                    <div className='indoorOutdoor'>{this.props.indoorOutdoor}</div>
                    <div className='accessibilityStatus'>{this.props.accessibilityStatus}</div>
                </div>
            </div>
        );
    }
}

ParkFeatureListItem.propTypes = {
    id: React.PropTypes.number.isRequired,
    name: React.PropTypes.string,
    description: React.PropTypes.string,
    type: React.PropTypes.string,
    indoorOutdoor: React.PropTypes.string,
    status: React.PropTypes.string,
    reservations: React.PropTypes.string,
    accessibilityStatus: React.PropTypes.string,
    showFeatureInMap: React.PropTypes.func.isRequired,
};
