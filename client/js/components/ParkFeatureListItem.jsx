import React from 'react';


export default class ParkFeatureListItem extends React.Component {
    render() {
        return (
            <div className='row' key={this.props.id} onClick={() => this.props.showFeatureInMap(this.props.id)}>
                <div className='two columns'>
                    {this.props.type}
                </div>
                <div className='eight columns'>
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
