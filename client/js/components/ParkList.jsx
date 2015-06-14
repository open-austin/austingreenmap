import React from 'react';

import api from '../utils/api';


export default class ParkList extends React.Component {
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
        var parkList = this.props.parks.map((park) => {
            // FIXME: Convert park ids to numbers when we generate the data
            if (!!this.state.amenity && this.state.amenityLookup[this.state.amenity].map(Number).indexOf(park.park_id) === -1) {
                return;
            }

            if (!!this.state.facility && this.state.facilityLookup[this.state.facility].map(Number).indexOf(park.park_id) === -1) {
                return;
            }

            return (
                <div className='row u-clickable' onClick={() => this.selectPark(park)} key={park.park_id}>
                    <div className='name ten columns'>{park.name}</div>
                    <div className='id two columns'>{park.park_id}</div>
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
                    <div className='ten columns'><h6>Park Name</h6></div>
                    <div className='two columns'><h6>Park ID</h6></div>
                </div>
                {parkList}
            </div>
        );
    }
}

ParkList.propTypes = {
    parks:  React.PropTypes.array.isRequired,
    onSelectPark:  React.PropTypes.func.isRequired,
};
