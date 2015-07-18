import _ from 'lodash';
import React from 'react';
import turf from 'turf';

import api from '../utils/api';
import utils from '../utils';
import ParkMap from './ParkMap.jsx';
import HomePage from './HomePage.jsx';
import ParkPage from './ParkPage.jsx';

export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            allParks: null,
            allParksTopo: null,
            allTrailsTopo: null,
            userLocation: null,
            visibleParks: null,
            visibleParkIds: null,
            amenityLookup: null,
            facilityLookup: null,
        };

        api.getAllParks()
            .then((data) => this.setState({
                allParks: data,
                visibleParks: data,
                visibleParkIds: data.map((park) => Number(park.park_id))  // FIXME: update the json files so we don't need to convert to number
            }))
            .then(() => this.computeParkDistance());

        api.getAllParksTopo()
            .then((data) => this.setState({allParksTopo: data}));

        api.getAllTrailsTopo()
            .then((data) => this.setState({allTrailsTopo: data}));

        api.getLookup('amenity')
            .then((data) => this.setState({amenityLookup: data}));

        api.getLookup('facility')
            .then((data) => this.setState({facilityLookup: data}));

        utils.getUserLocation()
            .tap((latLng) => this.setState({userLocation: latLng}))
            .tap(() => this.computeParkDistance())
            .catch((err) => console.error(err));
    }

    selectParkWithId(parkId) {
        return _.find(this.state.allParks, (park) => park.park_id === Number(parkId));
    }

    computeParkDistance() {
        if (!this.state.allParks || !this.state.userLocation) {
            return;
        }

        var parksWithDistance = this.state.allParks.map((park) => {
            var toPoint = turf.point([this.state.userLocation[1], this.state.userLocation[0]]);
            var fromPoint = turf.point([park.center[1], park.center[0]]);

            park.distance = turf.distance(toPoint, fromPoint, 'miles');

            return park;
        });

        this.setState({allParks: parksWithDistance});
    }

    applyFilters(filters) {
        var visibleParks = this.state.allParks.filter((park) => {
            // FIXME: Convert park ids to numbers when we generate the data
            return filters.reduce( (matches, filter) => {
                const matchingFacility =
                    !!this.state.facilityLookup &&
                    filter in this.state.facilityLookup &&
                    this.state.facilityLookup[filter].map(Number).indexOf(park.park_id) !== -1;
                const matchingAmenity =
                    !!this.state.amenityLookup &&
                    filter in this.state.amenityLookup &&
                    this.state.amenityLookup[filter].map(Number).indexOf(park.park_id) !== -1;
                return matches && (matchingFacility || matchingAmenity);
            }, true);
        });

        this.setState({
            visibleParks: visibleParks,
            visibleParkIds: visibleParks.map((park) => Number(park.park_id)),
        });
    }


    render() {
        var homePageLoaded = this.state.visibleParkIds && this.state.allParksTopo && this.state.allTrailsTopo && this.state.amenityLookup && this.state.facilityLookup && this.state.visibleParks;

        var content = <div className='loading'>Loading</div>;
        const park = this.props.parkId && this.selectParkWithId(this.props.parkId);
        if (park) {
            content = (
                <ParkPage
                    parkId={park.park_id}
                    name={park.name}
                    center={park.center}
                    parkGeo={this.state.parkGeo}
                    amenityGeo={this.state.amenityGeo}
                    facilityGeo={this.state.facilityGeo}
                    trailGeo={this.state.trailGeo} />
            );
        }
        else if (homePageLoaded) {
            content = (
                <HomePage
                    userLocation={this.state.userLocation}
                    allParksTopo={this.state.allParksTopo}
                    allTrailsTopo={this.state.allTrailsTopo}
                    amenityLookup={this.state.amenityLookup}
                    facilityLookup={this.state.facilityLookup}
                    visibleParkIds={this.state.visibleParkIds}
                    visibleParks={this.state.visibleParks}
                    applyFilters={(filter) => this.applyFilters(filter)} />
            );
        }

        return (
            <div>
                {content}
            </div>
        );
    }
}

App.propTypes = {
    parkId:  React.PropTypes.string,
};
