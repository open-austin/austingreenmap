import React from 'react';

import Chevron from './Chevron.jsx';


export default class ParkSummary extends React.Component {

    slideUp() {
        var contentNode = React.findDOMNode(this.refs.content);
        window.scrollTo(0, contentNode.offsetTop);
    }

    render() {
        if (!this.props.parkGeo) {
            return <div>Loading</div>;
        }

        var googleMapsLink = `https://maps.google.com/?q=${this.props.parkGeo.properties.PARK_NAME} ${this.props.parkGeo.properties.ADDRESS}`;

        return (
            <div className='park-summary row'>
                <div className='six columns'>
                    <div><a href={googleMapsLink} target='_blank'>{this.props.parkGeo.properties.PARK_NAME}<br />{this.props.parkGeo.properties.ADDRESS}</a></div>
                    <div>Status: {this.props.parkGeo.properties.PARK_STATUS}</div>
                    <div>Acres: {this.props.parkGeo.properties.PARK_ACRES}</div>
                </div>
                <div className='six columns'>
                    <div>{this.props.parkGeo.properties.LAND_OWNER ? `Land owner: ${this.props.parkGeo.properties.LAND_OWNER}` : null}</div>
                    <div>{this.props.parkGeo.properties.PARK_TYPE ? `Park type: ${this.props.parkGeo.properties.PARK_TYPE}` : null}</div>
                    <div>{this.props.parkGeo.properties.DEVELOPMENT_STATUS ? `Development status: ${this.props.parkGeo.properties.DEVELOPMENT_STATUS}` : null}</div>
                </div>
            </div>
        );
    }
}

ParkSummary.PropTypes = {
    parkGeo: React.PropTypes.object,
};
