import _ from 'lodash';
import React from 'react';
import when from 'when';

import api from '../utils/api';


function searchLookup(query, lookup) {
    var keys = Object.keys(lookup);

    var query = new RegExp(query, 'i');

    var matchingKeys = keys.filter((k) => query.test(k));

    var matchingValues = [];

    matchingKeys.forEach((k) => {
        matchingValues = matchingValues.concat(lookup[k]);
    });

    return matchingValues;
}

var search = _.memoize(function (query, lookups) {
    var matches = [];

    lookups.forEach((lookup) => {
        var results = searchLookup(query, lookup);
        matches = matches.concat(results)
    });

    var uniqueMatches = _.uniq(matches);

    return uniqueMatches;
});


export default class ParkFilters extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            amenityLookup: {},
            facilityLookup: {},
            filter: null,
            visibleParkIds: [],
        };

        this.load()
            .then(() => this.onChange());
    }

    load() {
        var amenityPromise = api.getLookup('amenity')
            .then((data) => this.setState({amenityLookup: data}));

        var facilityPromise = api.getLookup('facility')
            .then((data) => this.setState({facilityLookup: data}));

        return when.settle([amenityPromise, facilityPromise]);
    }

    onChange(filter) {
        this.setState({filter: filter});

        var visibleParkIds = this.filterParks(filter);
        this.setState({visibleParkIds: visibleParkIds});

        this.props.setVisibleParkIds(visibleParkIds);
    }

    // FIXME: make this fast
    // FIXME: filter by park name
    filterParks(filter) {
        console.debug('filter', filter)

        var visibleParkIds = search(filter, [this.state.amenityLookup, this.state.facilityLookup])

        return visibleParkIds;
    }

    render() {
        var options;
        return (
            <div className='park-filters'>
                <input type='text' onChange={(e) => this.onChange(e.target.value)} value={this.state.filter}></input>
                <span><b>{this.state.visibleParkIds.length}</b> matching parks</span>
            </div>
        );
    }
}

ParkFilters.propTypes = {
    setVisibleParkIds: React.PropTypes.func.isRequired,
};
