import _ from 'lodash';
import React from 'react';

import api from '../utils/api';


export default class ParksList extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            amenity: null,
            facility: null,
            amenityLookup: {},
            facilityLookup: {},
        };

        api.getLookup('amenity')
            .then((data) => this.setState({amenityLookup: data}));

        api.getLookup('facility')
            .then((data) => this.setState({facilityLookup: data}));
    }

    selectPark(park) {
        this.props.onSelectPark(park);
    }

    render() {
        var sortedParks = _.sortByAll(this.props.parks, 'distance', 'name');

        var parkList = sortedParks.map((park) => {
            // FIXME: Convert park ids to numbers when we generate the data
            if (!!this.state.amenity && this.state.amenityLookup[this.state.amenity].map(Number).indexOf(park.park_id) === -1) {
                return;
            }

            if (!!this.state.facility && this.state.facilityLookup[this.state.facility].map(Number).indexOf(park.park_id) === -1) {
                return;
            }

            return (
                <div className='row u-clickable' onClick={() => this.selectPark(park)} key={park.park_id}>
                    <div className='name eleven columns'>{park.name}</div>
                    <div className='id one column right'>{park.distance ? Math.round(park.distance * 100) / 100 : null}</div>
                </div>
            );
        });

        var amenityOptions = Object.keys(this.state.amenityLookup).sort().map((k) => <option key={k}>{k}</option>);
        var facilityOptions = Object.keys(this.state.facilityLookup).sort().map((k) => <option key={k}>{k}</option>);

        return (
            <div>
                <div className='row'>
                    <select>
                        <option defaultValue>Neighborhood</option>
                        <option>Downtown</option>
                    </select>

                    <select value={this.state.amenity} onChange={(e) => this.setState({amenity: e.target.value})}>
                        <option defaultValue></option>
                        {amenityOptions}
                    </select>

                    <select value={this.state.facility} onChange={(e) => this.setState({facility: e.target.value})}>
                        <option defaultValue></option>
                        {facilityOptions}
                    </select>

                    <input type='text' placeholder='Name' />
                </div>
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
