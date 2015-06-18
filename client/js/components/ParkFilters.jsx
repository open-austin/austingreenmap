import _ from 'lodash';
import React from 'react';

import api from '../utils/api';


export default class ParkFilters extends React.Component {
    constructor(props) {
        super(props);
    }

    render() {
        var options = Object.keys(this.props.amenityLookup)
            .concat(Object.keys(this.props.facilityLookup))
            .sort()
            .map((k) => <option key={k}>{k}</option>);

        return (
            <div className='filters row'>
                Find parks with
                <select onChange={(e) => this.props.setFilter(e.target.value)}>
                    <option defaultValue></option>
                    {options}
                </select>
            </div>
        );
    }
}

ParkFilters.propTypes = {
    amenityLookup: React.PropTypes.object.isRequired,
    facilityLookup: React.PropTypes.object.isRequired,
    setFilter: React.PropTypes.func.isRequired,
};
