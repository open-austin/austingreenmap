import _ from 'lodash';
import React from 'react';

import api from '../utils/api';


export default class ParksList extends React.Component {
    selectPark(park) {
        this.props.onSelectPark(park);
    }

    render() {
        var sortedParks = _.sortByAll(this.props.parks, 'distance', 'name');

        var parkList = sortedParks.map((park) => {
            return (
                <div className='row u-clickable' onClick={() => this.selectPark(park)} key={park.park_id}>
                    <div className='name eleven columns'>{park.name}</div>
                    <div className='id one column right'>{park.distance ? Math.round(park.distance * 100) / 100 : null}</div>
                </div>
            );
        });

        return (
            <div>
                <div className='row'>
                    <div className='ten columns'><h6>Name</h6></div>
                    <div className='two columns right'><h6>Distance (mi)</h6></div>
                </div>
                {parkList}
            </div>
        );
    }
}

ParksList.propTypes = {
    parks:  React.PropTypes.array.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};
