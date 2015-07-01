import React from 'react';

import icons from '../utils/icons.json';


export default class ParkFeatureListItem extends React.Component {
    render() {
        var icon = icons[this.props.type];
        var iconURL = icon === '?' ? 'images/deciduous_tree.png' : `images/icons/${icon}-18@2x.png`;

        return (
            <div className='feature-list-item row u-clickable' key={this.props.id} onClick={() => this.props.showFeatureInMap(this.props.id)}>
                <div className='feature-name seven columns'>
                    <div className='feature-icon'>
                        <img src={iconURL} alt={this.props.type} />
                    </div>
                    <div>
                        <div className='name'>{this.props.name}</div>
                        <i>{this.props.description}</i>
                    </div>
                </div>
                <div className='feature-type two columns'>
                    {this.props.type}
                </div>
                <div className='feature-status two columns'>
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
