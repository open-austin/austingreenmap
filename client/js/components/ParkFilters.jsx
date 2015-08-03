import _ from 'lodash';
import React from 'react';
import Select from 'react-select';

import api from '../utils/api';


// FIXME: memoize
function searchLookup(query, lookup) {
    var keys = Object.keys(lookup);

    var query = new RegExp(query);

    var matchingKeys = keys.filter((k) => query.test(k));

    var matchingValues = [];

    matchingKeys.forEach((k) => {
        matchingValues += lookup[k];
    });

    return matchingValues;
}

// FIXME: memoize
function search(query, lookups) {
    var matches = lookups.map((lookup) => searchLookup(query, lookup));

    var uniqueMatches = _.uniq(matches);

    return uniqueMatches;
}



export default class ParkFilters extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            amenityLookup: {},
            facilityLookup: {},
            filter: null,
        };
    }

    load() {
        api.getLookup('amenity')
            .then((data) => this.setState({amenityLookup: data}));

        api.getLookup('facility')
            .then((data) => this.setState({facilityLookup: data}));
    }

    onChange(e) {
        var filter = e.target.value;
        this.setState({filter: filter});

        var visibleParkIds = this.filterParks(filter);
        this.setState({visibleParkIds: visibleParkIds});
    }

    // FIXME: make this fast
    // FIXME: filter by park name
    filterParks(filter) {
        if (!filter) {
            return this.parks();
        }

        var visibleParkIds = search(filter, [this.state.amenityLookup, this.stateFacilityLookup])

        return visibleParkIds;
    }

    render() {
        var options;
        return (
            <div className='park-filters'>
                <input type='text' onChange={(e) => this.onChange(e)} value={this.state.filter}></input>
            </div>
        );
    }
}

ParkFilters.propTypes = {
    amenityLookup: React.PropTypes.object.isRequired,
    facilityLookup: React.PropTypes.object.isRequired,
    applyFilters: React.PropTypes.func.isRequired,
};
