import React from 'react';

import icons from '../utils/icons.json';


export default class ParkFeatureListItem extends React.Component {
    render() {
        var icon = icons[this.props.type];
        var iconURL = icon === '?' ? 'images/deciduous_tree.png' : `images/icons/${icon}-18@2x.png`;

        return (
            <div className='feature-list-item row'>
                <div className='feature-icon u-clickable' onClick={() => this.props.selectFeature(this.props.id)}>
                    <div className='icon'><img src={iconURL} alt={this.props.type} /></div>
                </div>
                <div className='feature-details eight'>
                    <div className='long-text'>
                        <div className='feature-name u-clickable' onClick={() => this.props.selectFeature(this.props.id)}>{this.props.name}</div>
                        <div className='feature-description'>{this.props.description}</div>
                    </div>
                    <div className='short-text three'>
                        <div className='feature-type'>{this.props.type}</div>
                        <div className='feature-accessible'>{this.props.accessibilityStatus}</div>
                    </div>
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
    selectFeature: React.PropTypes.func.isRequired,
};
