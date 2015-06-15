import _ from 'lodash';
import React from 'react';
import turf from 'turf';

import api from '../utils/api';
import utils from '../utils';
import ParkMap from './ParkMap.jsx';
import ParksList from './ParksList.jsx';
import ParksMap from './ParksMap.jsx';
import Navigation from './Navigation.jsx';
import ParkFilters from './ParkFilters.jsx';


export default class App extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            allParks: null,
            allParksTopo: null,
            park: null,
            parkGeo: null,
            amenityGeo: null,
            facilityGeo: null,
            trailGeo: null,
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
                visibleParkIds: data.map((park) => Number(park.park_id))
            }));

        api.getAllParksTopo()
            .then((data) => this.setState({allParksTopo: data}));

        api.getLookup('amenity')
            .then((data) => this.setState({amenityLookup: data}));

        api.getLookup('facility')
            .then((data) => this.setState({facilityLookup: data}));

        utils.getUserLocation()
            .tap((latLng) => this.setUserLocation(latLng))
            .catch((err) => console.error(err));
    }

    selectParkWithId(parkId) {
        var park = _.find(this.state.allParks, (park) => park.park_id === parkId);
        this.selectPark(park);
    }

    selectPark(park) {
        this.setState({park: park});

        api.getFeatureGeoJson(park.park_id, 'park')
            .tap((data) => this.setState({parkGeo: data}));

        api.getFeatureGeoJson(park.park_id, 'amenity')
            .tap((data) => this.setState({amenityGeo: data}));

        api.getFeatureGeoJson(park.park_id, 'facility')
            .tap((data) => this.setState({facilityGeo: data}));

        api.getFeatureGeoJson(park.park_id, 'trail')
            .tap((data) => this.setState({trailGeo: data}));
    }

    setUserLocation(userLocation) {
        var parksWithDistance = this.state.allParks.map((park) => {
            var toPoint = turf.point([userLocation[1], userLocation[0]]);
            var fromPoint = turf.point([park.center[1], park.center[0]]);

            park.distance = turf.distance(toPoint, fromPoint, 'miles');

            return park;
        });

        this.setState({
            allParks: parksWithDistance,
            userLocation: userLocation
        });
    }

    applyFilters(filter) {
        var visibleParks = this.state.allParks.filter((park) => {
            // FIXME: Convert park ids to numbers when we generate the data
            var matchingAmenity = !!this.state.amenityLookup && this.state.amenityLookup[filter] && this.state.amenityLookup[filter].map(Number).indexOf(park.park_id) !== -1;
            var matchingFacility = !!this.state.facilityLookup && this.state.facilityLookup[filter] && this.state.facilityLookup[filter].map(Number).indexOf(park.park_id) !== -1;

            return matchingAmenity || matchingFacility;
        });

        this.setState({
            visibleParks: visibleParks,
            visibleParkIds: visibleParks.map((park) => Number(park.park_id)),
        });
    }

    render() {
        var content;

        if (this.state.park) {
            content = (
                <ParkMap
                    name={this.state.park.name}
                    center={this.state.park.center}
                    parkGeo={this.state.parkGeo}
                    facilityGeo={this.state.facilityGeo}
                    amenityGeo={this.state.amenityGeo}
                    trailGeo={this.state.trailGeo} />
            );
        }
        else if (this.state.allParks && this.state.allParksTopo) {
            var parkFilters;
            if (this.state.amenityLookup && this.state.facilityLookup) {
                parkFilters = <ParkFilters
                    amenityLookup={this.state.amenityLookup}
                    facilityLookup={this.state.facilityLookup}
                    setFilter={(filter) => this.applyFilters(filter)} />
            }
            content = (
                <div>
                    {parkFilters}
                    <ParksMap
                        visibleParkIds={this.state.visibleParkIds}
                        parksTopo={this.state.allParksTopo}
                        onSelectPark={(parkId) => this.selectParkWithId(parkId)} />
                    <ParksList
                        parks={this.state.visibleParks}
                        onSelectPark={(park) => this.selectPark(park)} />
                </div>
            );
        }
        return (
            <div>
              <div className='container'>
                  <Navigation />
                  {content}
              </div>
            </div>
          );
    }
}
