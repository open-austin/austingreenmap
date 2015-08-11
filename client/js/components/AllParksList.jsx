import _ from 'lodash';
import React from 'react';

import {distanceBetweenCoords, formatDistanceBetweenCoords} from '../utils';
import api from '../utils/api';


export default class AllParksList extends React.Component {
    render() {
        var sortedParks = _.sortByAll(this.props.parks, (park) => distanceBetweenCoords(this.props.userLatLng, park.properties.center), 'name');

        var parkList = sortedParks.map((park) => {
            return (
                <div className='park-list-item row' key={park.id}>
                    <div className='park-name nine columns'><a href={`#park/${park.id}`}>{park.properties.PARK_NAME}</a></div>
                    <div className='park-distance three columns'>{this.props.userLatLng ? formatDistanceBetweenCoords(this.props.userLatLng, park.properties.center) : null}</div>
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
