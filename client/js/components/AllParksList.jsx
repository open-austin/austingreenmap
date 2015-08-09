import _ from 'lodash';
import React from 'react';


import {distanceBetweenCoords} from '../utils';
import api from '../utils/api';



export default class AllParksList extends React.Component {

    calculateDistance(park) {
        if (!this.props.userLatLng) {
            return 0;
        }

        return distanceBetweenCoords(this.props.userLatLng, park.properties.center);
    }

    formatDistance(park) {
        var distance = this.calculateDistance(park);
        return (Math.round(distance * 100) / 100) + ' mi';
    }

    render() {
        var sortedParks = _.sortByAll(this.props.parks, (park) => this.calculateDistance(park), 'name');

        var parkList = sortedParks.map((park) => {
            return (
                <div className='park-list-item row' key={park.id}>
                    <div className='park-name nine columns'><a href={`#park/${park.park_id}`}>{park.properties.PARK_NAME}</a></div>
                    <div className='park-distance three columns'>{this.props.userLatLng ? this.formatDistance(park) : null}</div>
                </div>
            );
        });

        return (
            <div className='parks-list'>
                {parkList}
            </div>
        );
    }
}

AllParksList.propTypes = {
    parks:  React.PropTypes.array.isRequired,
    userLatLng:  React.PropTypes.array,
};
